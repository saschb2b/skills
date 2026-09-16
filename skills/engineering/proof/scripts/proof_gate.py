#!/usr/bin/env python3
"""
proof_gate.py - freeze a story's acceptance contract, record verifier evidence, gate on it.

The contract is one OKF `Acceptance` concept (acceptance.md) holding a single fenced
```json proof-contract``` block. Freeze pins its SHA-256 (plus any policy files), a builder
implements, an independent verifier runs checks and records verdicts, and `gate` recomputes
everything: frozen bytes, exact ID coverage, evidence integrity, and candidate freshness
(SHA-256 over every tracked and non-ignored file in the Git work tree, minus the evidence dir).

Commands:
  validate <acceptance.md>
  freeze   <acceptance.md> --evidence DIR --builder IDENT --verifier IDENT [--force]
  run      --evidence DIR --check ID [--timeout S] -- argv...
  verdict  --evidence DIR --check ID --result PASS|FAIL|UNVERIFIED --by IDENT --observed TEXT
           [--artifact artifacts/REL]...
  gate     --evidence DIR

Exit codes: 0 gate PASS (or command succeeded), 1 gate not PASS / run exit mismatch,
2 invalid input or integrity violation.

This is integrity bookkeeping between cooperating roles, not a security boundary. Identities
are declared strings. OKF conformance of the concept file is the okf validator's job; this
tool only checks the `type: Acceptance` marker and never parses YAML. It never executes
anything read from the contract; `run` executes exactly the argv given on the command line.
"""
from __future__ import annotations
import argparse, datetime, hashlib, json, math, os, re, subprocess, sys, uuid

ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$")
IDENT_RE = re.compile(r"^(human|agent):[A-Za-z0-9][A-Za-z0-9._@-]{0,63}$")
FENCE_RE = re.compile(r"^```json proof-contract[ \t]*\r?\n(.*?)^```[ \t]*\r?$", re.M | re.S)
KINDS = ("command", "inspection", "human")
RESULTS = ("PASS", "FAIL", "UNVERIFIED")
PLACEHOLDERS = {"", "ok", "okay", "pass", "passed", "fail", "done", "todo", "tbd", "n/a", "na",
                "yes", "no", "-", "x", "fine", "works", "lgtm", "verified", "checked"}
GATE_FILES = {"freeze.json", "verdicts.json", "report.json"}
_isjunction = getattr(os.path, "isjunction", lambda p: False)


class ProofError(Exception):
    pass


# ----------------------------------------------------------------------------- primitives
def now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: str) -> str:
    guard_path(path)
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def _pairs(pairs):
    out = {}
    for k, v in pairs:
        if k in out:
            raise ProofError(f"duplicate JSON key {k!r}")
        out[k] = v
    return out


def _const(name):
    raise ProofError(f"non-finite JSON number {name}")


def loads_strict(text: str, where: str = "JSON"):
    try:
        return json.loads(text, object_pairs_hook=_pairs, parse_constant=_const)
    except json.JSONDecodeError as e:
        raise ProofError(f"{where}: invalid JSON: {e}")


def read_json(path: str):
    guard_path(path)
    if not os.path.isfile(path):
        raise ProofError(f"missing {path}")
    with open(path, "rb") as f:
        return loads_strict(f.read().decode("utf-8"), path)


def write_json(path: str, obj) -> None:
    guard_path(path)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(obj, f, indent=2, sort_keys=True, allow_nan=False)
        f.write("\n")


def _need(obj, key, typ, where):
    if not isinstance(obj, dict) or key not in obj:
        raise ProofError(f"{where}: missing '{key}'")
    v = obj[key]
    if not isinstance(v, typ) or (typ is int and isinstance(v, bool)):
        raise ProofError(f"{where}: '{key}' must be {typ.__name__}")
    return v


def _text(obj, key, where):
    v = _need(obj, key, str, where)
    if not v.strip():
        raise ProofError(f"{where}: '{key}' is empty")
    return v


def _str_list(obj, key, where, nonempty):
    v = _need(obj, key, list, where)
    if nonempty and not v:
        raise ProofError(f"{where}: '{key}' must not be empty")
    if any(not isinstance(s, str) or not s.strip() for s in v):
        raise ProofError(f"{where}: '{key}' must contain nonempty strings")
    return v


def _no_extra(obj, allowed, where):
    extra = sorted(set(obj) - set(allowed))
    if extra:
        raise ProofError(f"{where}: unknown keys {extra}")


def _id(obj, where):
    v = _need(obj, "id", str, where)
    if not ID_RE.match(v):
        raise ProofError(f"{where}: invalid id {v!r}")
    return v


def ident(s: str) -> str:
    if not isinstance(s, str) or not IDENT_RE.match(s):
        raise ProofError(f"identity must look like human:<name> or agent:<name>, got {s!r}")
    return s


def safe_rel(p, where) -> str:
    """A repo-relative path with no absolute prefix, drive, '.' or '..' components."""
    if not isinstance(p, str) or not p or "\0" in p or ":" in p or p[0] in "/\\":
        raise ProofError(f"{where}: path must be relative, got {p!r}")
    parts = re.split(r"[\\/]+", p)
    if any(x in ("", ".", "..") for x in parts):
        raise ProofError(f"{where}: unsafe path {p!r}")
    return "/".join(parts)


def guard_path(path: str) -> None:
    """Refuse links and Windows reparse points before reading or replacing proof files."""
    cur = os.path.abspath(path)
    while True:
        if os.path.islink(cur) or _isjunction(cur):
            raise ProofError(f"symlink or junction in proof path: {path}")
        if os.path.lexists(cur) and getattr(os.lstat(cur), "st_file_attributes", 0) & 0x400:
            raise ProofError(f"reparse point in proof path: {path}")
        parent = os.path.dirname(cur)
        if parent == cur:
            return
        cur = parent


# ----------------------------------------------------------------------------- contract
def check_okf_marker(text: str) -> None:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        raise ProofError("contract must start with an OKF frontmatter block ('---')")
    found = False
    for line in lines[1:]:
        if line.strip() == "---":
            if not found:
                raise ProofError("frontmatter lacks the 'type: Acceptance' marker")
            return
        if re.fullmatch(r"type:\s*Acceptance\s*", line):
            found = True
    raise ProofError("unterminated frontmatter")


def validate_contract(text: str) -> dict:
    check_okf_marker(text)
    blocks = FENCE_RE.findall(text)
    if len(blocks) != 1:
        raise ProofError(f"contract needs exactly one ```json proof-contract block, found {len(blocks)}")
    c = loads_strict(blocks[0], "contract")
    if not isinstance(c, dict):
        raise ProofError("contract JSON must be an object")
    _no_extra(c, ("proof", "story", "scope", "policy", "criteria"), "contract")
    if type(c.get("proof")) is not int or c["proof"] != 1:
        raise ProofError("contract: 'proof' must be 1")
    story = _need(c, "story", dict, "contract")
    _no_extra(story, ("id", "title", "as_a", "i_want", "so_that"), "story")
    story_id = _id(story, "story")
    for k in ("title", "as_a", "i_want", "so_that"):
        if k == "title" or k in story:
            _text(story, k, "story")
    scope = _need(c, "scope", dict, "contract")
    _no_extra(scope, ("in", "out"), "scope")
    _str_list(scope, "in", "scope", True)
    _str_list(scope, "out", "scope", False)
    policy = c.get("policy", [])
    if not isinstance(policy, list):
        raise ProofError("contract: 'policy' must be a list")
    policy = [safe_rel(p, "policy") for p in policy]
    if len(set(policy)) != len(policy):
        raise ProofError("contract: duplicate policy path")
    criteria = _need(c, "criteria", list, "contract")
    if not criteria:
        raise ProofError("contract: 'criteria' must not be empty")
    crit_ids, checks = [], {}
    for i, crit in enumerate(criteria):
        where = f"criteria[{i}]"
        if not isinstance(crit, dict):
            raise ProofError(f"{where}: must be an object")
        _no_extra(crit, ("id", "behavior", "checks"), where)
        cid = _id(crit, where)
        if cid in crit_ids or cid in checks:
            raise ProofError(f"{where}: duplicate id {cid!r}")
        crit_ids.append(cid)
        _text(crit, "behavior", where)
        cl = _need(crit, "checks", list, where)
        if not cl:
            raise ProofError(f"{where}: 'checks' must not be empty")
        for j, ch in enumerate(cl):
            w = f"{where}.checks[{j}]"
            if not isinstance(ch, dict):
                raise ProofError(f"{w}: must be an object")
            _no_extra(ch, ("id", "kind", "expect", "expect_exit"), w)
            chid = _id(ch, w)
            if chid in checks or chid in crit_ids:
                raise ProofError(f"{w}: duplicate id {chid!r}")
            kind = _need(ch, "kind", str, w)
            if kind not in KINDS:
                raise ProofError(f"{w}: kind must be one of {KINDS}, got {kind!r}")
            _text(ch, "expect", w)
            if "expect_exit" in ch and kind != "command":
                raise ProofError(f"{w}: expect_exit only applies to command checks")
            ee = ch.get("expect_exit", 0)
            if isinstance(ee, bool) or not isinstance(ee, int) or not 0 <= ee <= 255:
                raise ProofError(f"{w}: expect_exit must be an integer 0..255")
            checks[chid] = {"criterion": cid, "kind": kind, "expect": ch["expect"], "expect_exit": ee}
    all_ids = crit_ids + list(checks)
    if len({i.casefold() for i in all_ids}) != len(all_ids):
        raise ProofError("criterion and check IDs must be unique ignoring case")
    return {"story_id": story_id, "policy": policy, "criteria": crit_ids, "checks": checks}


# ----------------------------------------------------------------------------- git + candidate
def git(root: str, *args: str) -> bytes:
    try:
        r = subprocess.run(["git", *args], cwd=root, capture_output=True, check=True)
    except FileNotFoundError:
        raise ProofError("git not found on PATH")
    except subprocess.CalledProcessError as e:
        raise ProofError(f"git {' '.join(args)} failed: {e.stderr.decode(errors='replace').strip()}")
    return r.stdout


def repo_root(path: str) -> str:
    start = path if os.path.isdir(path) else os.path.dirname(path) or "."
    return os.path.realpath(git(start, "rev-parse", "--show-toplevel").decode("utf-8").strip())


def rel_in_repo(root: str, path: str, what: str) -> str:
    full = os.path.realpath(os.path.abspath(path))
    if full == root or not full.startswith(root + os.sep):
        raise ProofError(f"{what} must be inside the repo work tree, not the root: {path}")
    return os.path.relpath(full, root).replace(os.sep, "/")


def candidate_digest(root: str, exclude_rel: str) -> dict:
    """SHA-256 over every tracked and non-ignored untracked file, except the evidence dir."""
    dec = lambda b: [p for p in b.decode("utf-8", "surrogateescape").split("\0") if p]
    tracked = dec(git(root, "ls-files", "-z"))
    others = dec(git(root, "ls-files", "-z", "--others", "--exclude-standard"))
    prefix = exclude_rel + "/"
    files = sorted(p for p in set(tracked + others) if not p.startswith(prefix))
    h, missing = hashlib.sha256(), []
    for rel in files:
        full = os.path.join(root, rel)
        if os.path.islink(full):
            entry = "symlink:" + os.readlink(full)
        elif os.path.isfile(full):
            entry = sha256_file(full)
        elif os.path.isdir(full):
            raise ProofError(f"tracked directory or submodule cannot be fingerprinted: {rel}")
        else:
            entry = "missing"
            missing.append(rel)
        h.update(rel.encode("utf-8", "surrogateescape") + b"\0" + entry.encode("utf-8", "surrogateescape") + b"\n")
    return {"digest": h.hexdigest(), "files": len(files), "missing": missing}


def guard_evidence(root: str, ev_rel: str, contract_rel: str, policy: list) -> None:
    """The evidence dir is the only digest exclusion, so it must stay narrow."""
    for p in [contract_rel, *policy]:
        if p == ev_rel or p.startswith(ev_rel + "/"):
            raise ProofError(f"evidence dir {ev_rel!r} would exclude {p!r} from the candidate")
    paths = git(root, "ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", ev_rel)
    visible = [p for p in paths.decode("utf-8", "surrogateescape").split("\0") if p]
    bad = [p for p in visible
           if not (p[len(ev_rel) + 1:] in GATE_FILES or p[len(ev_rel) + 1:].startswith(("runs/", "artifacts/")))]
    if bad:
        raise ProofError(f"evidence dir {ev_rel!r} holds non-evidence files (overbroad exclusion): {bad[:3]}")


# ----------------------------------------------------------------------------- state
class State:
    def __init__(self, ev_arg: str):
        guard_path(ev_arg)
        self.ev = os.path.realpath(os.path.abspath(ev_arg))
        if not os.path.isdir(self.ev):
            raise ProofError(f"evidence dir does not exist: {ev_arg}")
        self.root = repo_root(self.ev)
        self.ev_rel = rel_in_repo(self.root, self.ev, "evidence dir")
        fz = self.freeze = read_json(os.path.join(self.ev, "freeze.json"))
        for k, t in (("proof", int), ("contract_path", str), ("contract_sha256", str), ("evidence_dir", str),
                     ("policy", dict), ("criteria", list), ("checks", dict), ("builder", str), ("verifier", str),
                     ("freeze_id", str)):
            _need(fz, k, t, "freeze.json")
        if fz["proof"] != 1 or not re.fullmatch(r"[0-9a-f]{32}", fz["freeze_id"]):
            raise ProofError("invalid freeze version or identity")
        if fz["evidence_dir"] != self.ev_rel:
            raise ProofError(f"evidence dir {self.ev_rel!r} differs from frozen {fz['evidence_dir']!r}")
        ident(fz["builder"]), ident(fz["verifier"])
        if fz["builder"].casefold() == fz["verifier"].casefold():
            raise ProofError("builder and verifier must be different identities")
        contract_abs = os.path.join(self.root, safe_rel(fz["contract_path"], "freeze.json"))
        guard_path(contract_abs)
        if not os.path.isfile(contract_abs):
            raise ProofError(f"frozen contract is missing: {fz['contract_path']}")
        with open(contract_abs, "rb") as f:
            data = f.read()
        if sha256_bytes(data) != fz["contract_sha256"]:
            raise ProofError("contract changed since freeze (re-freeze to start a new proof)")
        self.contract = validate_contract(data.decode("utf-8"))
        kinds = {k: v["kind"] for k, v in self.contract["checks"].items()}
        if self.contract["criteria"] != fz["criteria"] or kinds != fz["checks"]:
            raise ProofError("frozen ID set differs from the contract")
        if set(fz["policy"]) != set(self.contract["policy"]):
            raise ProofError("frozen policy list differs from the contract")
        for p, sha in fz["policy"].items():
            full = os.path.join(self.root, p)
            if not os.path.isfile(full) or sha256_file(full) != sha:
                raise ProofError(f"policy file changed or missing since freeze: {p}")
        guard_evidence(self.root, self.ev_rel, fz["contract_path"], self.contract["policy"])
        self.checks = self.contract["checks"]

    def check(self, cid: str) -> dict:
        if cid not in self.checks:
            raise ProofError(f"unknown check id {cid!r}; frozen checks: {sorted(self.checks)}")
        return self.checks[cid]

    def artifact(self, p, where) -> tuple:
        rel = safe_rel(p, where)
        if not rel.startswith("artifacts/"):
            raise ProofError(f"{where}: artifacts must live under <evidence>/artifacts/, got {rel!r}")
        cur = self.ev
        for part in rel.split("/"):
            cur = os.path.join(cur, part)
            if os.path.islink(cur) or _isjunction(cur):
                raise ProofError(f"{where}: symlink in artifact path {rel!r}")
        if not os.path.realpath(cur).startswith(self.ev + os.sep):
            raise ProofError(f"{where}: artifact escapes the evidence dir: {rel!r}")
        if not os.path.isfile(cur):
            raise ProofError(f"{where}: artifact missing or not a regular file: {rel!r}")
        if os.path.getsize(cur) == 0:
            raise ProofError(f"{where}: artifact is empty: {rel!r}")
        return rel, sha256_file(cur)

    def digest(self) -> dict:
        return candidate_digest(self.root, self.ev_rel)


# ----------------------------------------------------------------------------- commands
def cmd_validate(a) -> int:
    c = validate_contract(open(a.contract, "rb").read().decode("utf-8"))
    print(f"valid: story {c['story_id']}, {len(c['criteria'])} criteria, {len(c['checks'])} checks, "
          f"{len(c['policy'])} policy files")
    return 0


def cmd_freeze(a) -> int:
    guard_path(a.contract)
    guard_path(a.evidence)
    root = repo_root(a.contract)
    contract_rel = rel_in_repo(root, a.contract, "contract")
    data = open(os.path.join(root, contract_rel), "rb").read()
    c = validate_contract(data.decode("utf-8"))
    builder, verifier = ident(a.builder), ident(a.verifier)
    if builder.lower() == verifier.lower():
        raise ProofError("builder and verifier must be different identities")
    ev = os.path.realpath(os.path.abspath(a.evidence))
    ev_rel = rel_in_repo(root, ev, "evidence dir")
    guard_evidence(root, ev_rel, contract_rel, c["policy"])
    policy = {}
    for p in c["policy"]:
        full = os.path.join(root, p)
        if os.path.islink(full) or not os.path.isfile(full):
            raise ProofError(f"policy file missing or not a regular file: {p}")
        policy[p] = sha256_file(full)
    target = os.path.join(ev, "freeze.json")
    if os.path.exists(target) and not a.force:
        raise ProofError(f"{target} exists; pass --force to start a new proof")
    os.makedirs(ev, exist_ok=True)
    write_json(target, {"proof": 1, "freeze_id": uuid.uuid4().hex, "frozen_at": now(), "contract_path": contract_rel,
                        "contract_sha256": sha256_bytes(data), "policy": policy, "evidence_dir": ev_rel,
                        "story_id": c["story_id"], "criteria": c["criteria"],
                        "checks": {k: v["kind"] for k, v in c["checks"].items()},
                        "builder": builder, "verifier": verifier})
    print(f"frozen {contract_rel} ({sha256_bytes(data)[:12]}) -> {target}")
    return 0


def cmd_run(a) -> int:
    st = State(a.evidence)
    check = st.check(a.check)
    if check["kind"] != "command":
        raise ProofError(f"{a.check} is a {check['kind']} check; only command checks are run")
    argv = a.argv[1:] if a.argv[:1] == ["--"] else a.argv
    if not argv:
        raise ProofError("run needs an explicit argv after '--'")
    if not math.isfinite(a.timeout) or a.timeout <= 0:
        raise ProofError("timeout must be a finite positive number")
    runs = os.path.join(st.ev, "runs")
    guard_path(runs)
    for suffix in ("json", "stdout", "stderr"):
        guard_path(os.path.join(runs, f"{a.check}.{suffix}"))
    before, started = st.digest(), now()
    error = None
    try:
        p = subprocess.run(argv, cwd=st.root, capture_output=True, timeout=a.timeout)
        code, out, err = p.returncode, p.stdout, p.stderr
    except (FileNotFoundError, PermissionError, OSError) as e:
        code, out, err, error = None, b"", b"", f"could not start: {e}"
    except subprocess.TimeoutExpired as e:
        code, out, err, error = None, e.stdout or b"", e.stderr or b"", f"timeout after {a.timeout}s"
    os.makedirs(runs, exist_ok=True)
    for name, blob in (("stdout", out), ("stderr", err)):
        with open(os.path.join(runs, f"{a.check}.{name}"), "wb") as f:
            f.write(blob)
    after = st.digest()
    write_json(os.path.join(runs, f"{a.check}.json"), {
        "proof": 1, "freeze_id": st.freeze["freeze_id"], "check": a.check, "argv": argv, "cwd": ".", "started": started, "ended": now(),
        "exit": code, "error": error, "stdout_sha256": sha256_bytes(out), "stderr_sha256": sha256_bytes(err),
        "contract_sha256": st.freeze["contract_sha256"],
        "candidate_before": before["digest"], "candidate_after": after["digest"]})
    print(f"run {a.check}: exit={code} error={error} candidate={after['digest'][:12]}"
          + (" (candidate changed during run)" if before["digest"] != after["digest"] else ""))
    return 0 if code == check["expect_exit"] else 1


def cmd_verdict(a) -> int:
    st = State(a.evidence)
    check = st.check(a.check)
    by, observed = ident(a.by), a.observed.strip()
    if observed.lower() in PLACEHOLDERS:
        raise ProofError("--observed must state what was actually observed, not a placeholder")
    rec = {"check": a.check, "result": a.result, "by": by, "observed": observed, "at": now(),
           "freeze_id": st.freeze["freeze_id"],
           "contract_sha256": st.freeze["contract_sha256"], "candidate_digest": st.digest()["digest"],
           "artifacts": [dict(zip(("path", "sha256"), st.artifact(p, "--artifact"))) for p in a.artifact]}
    if check["kind"] == "command":
        run_path = os.path.join(st.ev, "runs", f"{a.check}.json")
        if not os.path.isfile(run_path):
            raise ProofError(f"command check {a.check} has no run record; run it first")
        rec["run"], rec["run_sha256"] = f"runs/{a.check}.json", sha256_file(run_path)
    vpath = os.path.join(st.ev, "verdicts.json")
    doc = read_json(vpath) if os.path.exists(vpath) else {"verdicts": []}
    kept = [v for v in _need(doc, "verdicts", list, "verdicts.json") if not (isinstance(v, dict) and v.get("check") == a.check)]
    write_json(vpath, {"verdicts": kept + [rec]})
    print(f"verdict {a.check}: {a.result} by {by}")
    return 0


def judge(st: State, cur: dict, cid: str, check: dict, v) -> tuple:
    """Return (status, reasons). Raises ProofError on malformed or tampered evidence."""
    if v is None:
        return "UNVERIFIED", ["no verdict recorded"]
    where = f"verdicts.json[{cid}]"
    result = v.get("result")
    if result not in RESULTS:
        raise ProofError(f"{where}: malformed result {result!r}")
    by, observed = ident(v.get("by")), _need(v, "observed", str, where)
    arts = _need(v, "artifacts", list, where)
    for art in arts:
        rel, sha = st.artifact(_need(art, "path", str, where), where)
        if _need(art, "sha256", str, where) != sha:
            raise ProofError(f"{where}: artifact {rel!r} changed since the verdict")
    if result != "PASS":
        return result, [f"verifier declared {result}: {observed.strip()}"]
    reasons = []
    if observed.strip().lower() in PLACEHOLDERS:
        reasons.append("observed finding missing or placeholder")
    if check["kind"] in ("inspection", "human") and not arts:
        reasons.append("inspection or human check needs an attached finding artifact")
    if v.get("freeze_id") != st.freeze["freeze_id"]:
        reasons.append("verdict belongs to an earlier freeze (stale)")
    if by.lower() == st.freeze["builder"].lower():
        reasons.append("judged by the builder")
    if check["kind"] == "human":
        if not by.startswith("human:"):
            reasons.append(f"human check needs human:* evidence, got {by}")
    elif by.lower() != st.freeze["verifier"].lower():
        reasons.append(f"judged by {by}, frozen verifier is {st.freeze['verifier']}")
    if v.get("contract_sha256") != st.freeze["contract_sha256"]:
        reasons.append("verdict bound to a different contract (stale)")
    if v.get("candidate_digest") != cur["digest"]:
        reasons.append("candidate changed since verdict (stale)")
    if check["kind"] == "command":
        run_path = os.path.join(st.ev, "runs", f"{cid}.json")
        if v.get("run") != f"runs/{cid}.json" or not os.path.isfile(run_path):
            return "UNVERIFIED", reasons + ["run record missing"]
        if sha256_file(run_path) != v.get("run_sha256"):
            reasons.append("run record changed since verdict (stale run)")
        run = read_json(run_path)
        if not isinstance(run, dict) or type(run.get("proof")) is not int or run["proof"] != 1:
            raise ProofError(f"{run_path}: invalid run version or shape")
        _str_list(run, "argv", run_path, True)
        if run.get("cwd") != "." or (run.get("exit") is not None and type(run["exit"]) is not int):
            raise ProofError(f"{run_path}: invalid run cwd or exit type")
        if run.get("freeze_id") != st.freeze["freeze_id"]:
            reasons.append("run belongs to an earlier freeze (stale run)")
        if run.get("check") != cid or run.get("contract_sha256") != st.freeze["contract_sha256"]:
            raise ProofError(f"{run_path}: run record belongs to another check or contract")
        if run.get("candidate_before") != cur["digest"] or run.get("candidate_after") != cur["digest"]:
            reasons.append("candidate changed since or during run (stale run)")
        for name in ("stdout", "stderr"):
            out = os.path.join(st.ev, "runs", f"{cid}.{name}")
            if not os.path.isfile(out) or sha256_file(out) != run.get(f"{name}_sha256"):
                raise ProofError(f"{run_path}: {name} capture missing or changed")
        code = run.get("exit")
        if code is None:
            reasons.append(f"command unavailable: {run.get('error')}")
        elif code != check["expect_exit"]:
            return "FAIL", [f"declared PASS but run exited {code}, expected {check['expect_exit']}"] + reasons
        if not arts and all(os.path.getsize(os.path.join(st.ev, "runs", f"{cid}.{name}")) == 0
                            for name in ("stdout", "stderr")):
            reasons.append("command has no captured output or attached evidence")
    return ("UNVERIFIED" if reasons else "PASS"), reasons


def cmd_gate(a) -> int:
    guard_path(a.evidence)
    ev = os.path.realpath(os.path.abspath(a.evidence))
    try:
        return _gate(State(a.evidence))
    except ProofError as e:
        # Only a dir that already carries a freeze is an evidence dir; never write anywhere else.
        if os.path.isfile(os.path.join(ev, "freeze.json")):
            write_json(os.path.join(ev, "report.json"), {"proof": 1, "gated_at": now(), "gate": "INVALID", "error": str(e)})
        raise


def _gate(st: State) -> int:
    cur = st.digest()
    vpath = os.path.join(st.ev, "verdicts.json")
    doc = read_json(vpath) if os.path.exists(vpath) else {"verdicts": []}
    seen = {}
    for v in _need(doc, "verdicts", list, "verdicts.json"):
        cid = v.get("check") if isinstance(v, dict) else None
        if not isinstance(cid, str) or cid not in st.checks:
            raise ProofError(f"verdicts.json: unknown check id {cid!r}")
        if cid in seen:
            raise ProofError(f"verdicts.json: duplicate verdict for {cid!r}")
        seen[cid] = v
    rank = {"PASS": 0, "UNVERIFIED": 1, "FAIL": 2}
    checks, crit = {}, {c: "PASS" for c in st.contract["criteria"]}
    for cid, check in st.checks.items():
        status, reasons = judge(st, cur, cid, check, seen.get(cid))
        checks[cid] = {"criterion": check["criterion"], "kind": check["kind"], "status": status, "reasons": reasons}
        if rank[status] > rank[crit[check["criterion"]]]:
            crit[check["criterion"]] = status
        print(f"{status:<10} {cid:<24} {check['kind']:<11} {'; '.join(reasons)}")
    gate = max(crit.values(), key=rank.get)
    counts = {s: sum(1 for c in checks.values() if c["status"] == s) for s in RESULTS}
    write_json(os.path.join(st.ev, "report.json"), {
        "proof": 1, "freeze_id": st.freeze["freeze_id"], "gated_at": now(), "story_id": st.freeze["story_id"], "gate": gate, "counts": counts,
        "contract_sha256": st.freeze["contract_sha256"], "candidate_digest": cur["digest"],
        "candidate_files": cur["files"], "missing_tracked": cur["missing"],
        "builder": st.freeze["builder"], "verifier": st.freeze["verifier"], "criteria": crit, "checks": checks})
    if cur["missing"]:
        print(f"missing tracked files: {cur['missing']}")
    print(f"GATE: {gate} ({counts['PASS']} PASS, {counts['FAIL']} FAIL, {counts['UNVERIFIED']} UNVERIFIED) "
          f"candidate={cur['digest'][:12]}")
    return 0 if gate == "PASS" else 1


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="proof_gate.py", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("validate"); p.add_argument("contract"); p.set_defaults(func=cmd_validate)
    p = sub.add_parser("freeze"); p.add_argument("contract"); p.add_argument("--evidence", required=True)
    p.add_argument("--builder", required=True); p.add_argument("--verifier", required=True)
    p.add_argument("--force", action="store_true"); p.set_defaults(func=cmd_freeze)
    p = sub.add_parser("run"); p.add_argument("--evidence", required=True); p.add_argument("--check", required=True)
    p.add_argument("--timeout", type=float, default=600.0)
    p.add_argument("argv", nargs=argparse.REMAINDER); p.set_defaults(func=cmd_run)
    p = sub.add_parser("verdict"); p.add_argument("--evidence", required=True); p.add_argument("--check", required=True)
    p.add_argument("--result", required=True, choices=RESULTS); p.add_argument("--by", required=True)
    p.add_argument("--observed", required=True); p.add_argument("--artifact", action="append", default=[])
    p.set_defaults(func=cmd_verdict)
    p = sub.add_parser("gate"); p.add_argument("--evidence", required=True); p.set_defaults(func=cmd_gate)
    a = ap.parse_args(argv)
    try:
        return a.func(a)
    except (ProofError, OSError, UnicodeError, ValueError) as e:
        print(f"error: {e}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
