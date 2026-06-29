#!/usr/bin/env python3
"""
card.py - generate, sign, attest, and verify holistic trust cards for OKF
bundles and agent skills.

Design contract (mirrors OKF's own asymmetry):
  - PRODUCER is precise: attach every layer of evidence you can.
  - CONSUMER is forgiving: a layer that cannot be verified is reported as
    UNVERIFIED, never a hard failure. The verdict is a GRADIENT computed by
    the consumer's policy, never a binary badge stamped on the card.

A card is an OKF concept (`type: Card`). It binds three provenances that are
usually separate:
  - content provenance   (where each claim came from: Citations, fetch dates)
  - artifact provenance  (who shipped this exact byte sequence, unaltered)
  - capability provenance (what it will do / what it makes the agent believe)

Crypto is OPTIONAL and pluggable. If `cosign` is on PATH we record a keyless
Sigstore+Rekor reference; else we fall back to a local ed25519 key
(OWASP Agentic Skills Top 10, AST01/AST02); else the card is honestly marked
unsigned. Nothing here ever requires a token, a chain, or a wallet.

Commands:
  generate <dir>            build a card from a bundle/skill directory
  sign     <card> [--key]   sign the bound digest (ed25519 local or cosign)
  attest   <card> --kind .. append an independent attestation (scan/review/...)
  verify   <card> [--policy]graded evaluation of every layer
  validate <card>           OKF conformance (hard rule) + soft warnings
"""
from __future__ import annotations
import argparse, base64, datetime, hashlib, json, os, re, shutil, subprocess, sys

# ----------------------------------------------------------------------------- helpers
SKIP = {".git", ".DS_Store"}
# Card-related artifacts never count toward the bundle digest, so signing or
# attesting (which writes these) can't change the thing being attested.
CARD_SUFFIXES = (".manifest.json", ".sigstore", ".key", ".pem")
CARD_NAMES = {"CARD.md"}
URL_RE = re.compile(r"https?://[^\s)\"'>]+")
NET_HINTS = ("requests.", "urllib", "httpx", "http.client", "socket.",
             "fetch(", "axios", "curl ", "wget ")
WRITE_HINTS = ("open(", "with open", "Path(", ".write_text", ".write(", "shutil.",
               ">", ">>")
SHELL_HINTS = ("subprocess.", "os.system", "Popen", "bash", "sh -c", "exec(")
REGULATED = {"legal", "recht", "medical", "health", "financial", "tax", "steuer",
             "safety", "compliance"}


def now() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def is_card_artifact(rel: str, card_name: str | None = None) -> bool:
    base = os.path.basename(rel)
    if base in CARD_NAMES or (card_name and base == card_name):
        return True
    return base.endswith(CARD_SUFFIXES)


def walk_files(root: str, card_name: str | None = None):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP]
        for fn in sorted(filenames):
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, root)
            if any(p in SKIP for p in rel.split(os.sep)):
                continue
            if is_card_artifact(rel, card_name):
                continue
            yield rel, full


def bundle_manifest(root: str, card_name: str | None = None):
    """Sorted (relpath, sha256) over every file -> a stable content manifest."""
    entries = [{"path": rel.replace(os.sep, "/"), "sha256": sha256_file(full)}
               for rel, full in walk_files(root, card_name)]
    entries.sort(key=lambda e: e["path"])
    return entries


def manifest_digest(entries) -> str:
    blob = "\n".join(f"{e['sha256']}  {e['path']}" for e in entries).encode()
    return "sha256:" + hashlib.sha256(blob).hexdigest()


def parse_frontmatter(path: str) -> dict:
    try:
        text = open(path, encoding="utf-8", errors="replace").read()
    except OSError:
        return {}
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm = {}
    lines = text[3:end].splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        i += 1
        # only top-level `key: value` lines; skip blanks, comments, and indented
        # (nested / continuation) lines
        if not line.strip() or line.strip().startswith("#") or ":" not in line or line[:1] in (" ", "\t"):
            continue
        k, _, v = line.partition(":")
        v = v.strip()
        if v in (">", ">-", ">+", "|", "|-", "|+"):
            # YAML block/folded scalar: gather the indented continuation lines
            block = []
            while i < len(lines) and (not lines[i].strip() or lines[i][:1] in (" ", "\t")):
                block.append(lines[i].strip())
                i += 1
            joiner = "\n" if v[0] == "|" else " "
            fm[k.strip()] = joiner.join(b for b in block if b).strip()
        else:
            fm[k.strip()] = v.strip('"').strip("'")
    return fm


def yaml_dump(obj, indent=0) -> str:
    """Minimal YAML emitter (no dependency). Handles dict/list/scalars."""
    pad = "  " * indent
    out = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, (dict, list)) and v:
                out.append(f"{pad}{k}:")
                out.append(yaml_dump(v, indent + 1))
            elif isinstance(v, (dict, list)):
                out.append(f"{pad}{k}: {'{}' if isinstance(v, dict) else '[]'}")
            else:
                out.append(f"{pad}{k}: {scalar(v)}")
    elif isinstance(obj, list):
        for item in obj:
            if isinstance(item, dict):
                inner = yaml_dump(item, indent + 1).lstrip()
                out.append(f"{pad}- {inner}")
            else:
                out.append(f"{pad}- {scalar(item)}")
    return "\n".join(out)


def scalar(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if v is None:
        return "null"
    s = str(v)
    if s == "" or re.search(r"[:#]", s) or s != s.strip():
        return json.dumps(s)
    return s

# ----------------------------------------------------------------------------- detection
def detect_type(root: str) -> str:
    if os.path.exists(os.path.join(root, "SKILL.md")):
        return "skill"
    if os.path.exists(os.path.join(root, "index.md")):
        return "okf"
    for rel, full in walk_files(root):
        if rel.endswith(".md") and parse_frontmatter(full).get("type"):
            return "okf"
    return "unknown"


def summary(text: str, n: int = 200) -> str:
    """A short card face: collapse whitespace, cut at a word boundary, not mid-word."""
    text = " ".join((text or "").split())
    if len(text) <= n:
        return text
    return text[:n].rsplit(" ", 1)[0].rstrip(",;:") + "..."


def face(root: str, kind: str) -> dict:
    if kind == "skill":
        fm = parse_frontmatter(os.path.join(root, "SKILL.md"))
        return {"name": fm.get("name") or os.path.basename(os.path.abspath(root)),
                "version": fm.get("version", "0.0.0"),
                "description": summary(fm.get("description", ""))}
    fm = parse_frontmatter(os.path.join(root, "index.md"))
    return {"name": fm.get("title") or os.path.basename(os.path.abspath(root)),
            "version": fm.get("version", "0.0.0"),
            "description": fm.get("description", "")[:200]}


def concepts(root: str):
    found = []
    for rel, full in walk_files(root):
        if rel.endswith(".md"):
            t = parse_frontmatter(full).get("type")
            if t:
                found.append((rel, t))
    return found


def grep(root: str, hints) -> list[str]:
    hit = set()
    for rel, full in walk_files(root):
        if not rel.endswith((".py", ".sh", ".js", ".ts", ".rb")):
            continue
        try:
            body = open(full, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        for h in hints:
            if h in body:
                hit.add(rel)
    return sorted(hit)


def external_sources(root: str) -> list[str]:
    urls = set()
    for rel, full in walk_files(root):
        if rel.endswith((".md", ".txt", ".json", ".yaml", ".yml")):
            try:
                urls.update(URL_RE.findall(open(full, errors="replace").read()))
            except OSError:
                pass
    return sorted(urls)[:20]


def content_provenance(root: str, kind: str) -> dict:
    if kind != "okf":
        return {"applicable": False}
    cited = 0
    refs_with_dates = 0
    for rel, full in walk_files(root):
        if not rel.endswith(".md"):
            continue
        body = open(full, errors="replace").read()
        if re.search(r"#+\s*Citations", body, re.I):
            cited += 1
        if rel.startswith("references" + os.sep) and re.search(
                r"(fetched|retrieved|timestamp|date)\s*:", body, re.I):
            refs_with_dates += 1
    return {"applicable": True, "concepts_with_citations": cited,
            "reference_concepts_dated": refs_with_dates}


def capability(root: str, kind: str, concept_list) -> dict:
    srcs = external_sources(root)
    if kind == "okf":
        # A knowledge bundle executes nothing. Its capability is EPISTEMIC:
        # what it injects into the agent's context and what it claims authority on.
        domains = set()
        for rel, t in concept_list:
            for tag in (t,) + tuple(rel.replace(os.sep, " ").replace("-", " ").split()):
                low = tag.lower()
                if low in REGULATED:
                    domains.add(low)
        fm = parse_frontmatter(os.path.join(root, "index.md"))
        for tag in re.findall(r"[\w-]+", fm.get("tags", "")):
            if tag.lower() in REGULATED:
                domains.add(tag.lower())
        return {"model": "epistemic", "executes": False, "network": "none",
                "injects_concepts": len(concept_list),
                "asserts_over": sorted(domains) or ["general"],
                "declared_external_sources": srcs}
    # executable skill: prefer a declared manifest, else INFER and flag it.
    manifest = None
    for cand in ("skillsandbox.yaml", "permissions.yaml", "manifest.yaml"):
        if os.path.exists(os.path.join(root, cand)):
            manifest = cand
    net = grep(root, NET_HINTS)
    shell = grep(root, SHELL_HINTS)
    writes = grep(root, WRITE_HINTS)
    return {"model": "executable",
            "manifest_declared": manifest,
            "source": "declared" if manifest else "inferred",
            "network": "see-manifest" if manifest else ("present" if net else "none"),
            "shell": None if manifest else bool(shell),
            "filesystem_writes": None if manifest else bool(writes),
            "network_evidence": net, "shell_evidence": shell,
            "declared_external_sources": srcs}


def risk_tier(kind: str, cap: dict) -> str:
    if kind == "okf":
        # epistemic harm is silent; asserting over a regulated domain raises it.
        if set(cap.get("asserts_over", [])) & REGULATED:
            return "epistemic-L2"
        return "epistemic-L1" if cap.get("injects_concepts", 0) > 10 else "epistemic-L0"
    if cap.get("source") == "inferred" and (cap.get("shell") or cap.get("network") == "present"):
        return "executable-L2-unverified"
    return "executable-L1"

# ----------------------------------------------------------------------------- signing
def have(tool: str) -> bool:
    return shutil.which(tool) is not None


def local_ed25519_sign(digest: str, key_path: str | None):
    from cryptography.hazmat.primitives.asymmetric.ed25519 import (
        Ed25519PrivateKey, Ed25519PublicKey)
    from cryptography.hazmat.primitives import serialization
    if key_path and os.path.exists(key_path):
        priv = serialization.load_pem_private_key(open(key_path, "rb").read(), None)
    else:
        priv = Ed25519PrivateKey.generate()
        key_path = key_path or "card-signing.key"
        open(key_path, "wb").write(priv.private_bytes(
            serialization.Encoding.PEM,
            serialization.PrivateFormat.PKCS8,
            serialization.NoEncryption()))
        os.chmod(key_path, 0o600)
    sig = priv.sign(digest.encode())
    pub = priv.public_key().public_bytes(
        serialization.Encoding.Raw, serialization.PublicFormat.Raw)
    return {"scheme": "ed25519",
            "public_key": "ed25519:" + base64.b64encode(pub).decode(),
            "signature": base64.b64encode(sig).decode()}


def local_ed25519_verify(digest: str, signing: dict) -> bool:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
    try:
        raw = base64.b64decode(signing["public_key"].split(":", 1)[1])
        sig = base64.b64decode(signing["signature"])
        Ed25519PublicKey.from_public_bytes(raw).verify(sig, digest.encode())
        return True
    except Exception:
        return False

# ----------------------------------------------------------------------------- card I/O
def split_card(path: str):
    text = open(path, encoding="utf-8").read()
    if not text.startswith("---"):
        raise SystemExit("not a card: missing frontmatter")
    end = text.find("\n---", 3)
    return text[3:end].strip(), text[end + 4:]


def load_card(path: str) -> dict:
    fm, _ = split_card(path)
    # tolerant parse: pull the JSON sidecar we always embed for round-tripping
    m = re.search(r"<!--card-data\s*(\{.*?\})\s*-->", open(path).read(), re.S)
    if not m:
        raise SystemExit("card has no machine-readable block (regenerate)")
    return json.loads(m.group(1))


def render_card(data: dict) -> str:
    fm = {k: v for k, v in data.items() if k != "_body"}
    body = data.get("_body", "")
    return (f"---\n{yaml_dump(fm)}\n---\n\n{body}\n\n"
            f"<!--card-data {json.dumps(data, separators=(',', ':'))} -->\n")

# ----------------------------------------------------------------------------- commands
def cmd_generate(args):
    root = args.dir.rstrip("/")
    kind = args.type or detect_type(root)
    out = args.out or os.path.join(root, "CARD.md")
    card_name = os.path.basename(out)
    manifest = bundle_manifest(root, card_name)
    digest = manifest_digest(manifest)
    f = face(root, kind)
    cl = [(rel, t) for rel, t in concepts(root) if t.lower() != "index"]
    cap = capability(root, kind, cl)
    data = {
        "type": "Card",                       # the one OKF conformance rule
        "card_version": "0.1",
        "title": f["name"],
        "target_version": f["version"],
        "description": f["description"],
        "timestamp": now(),
        # ---- integrity (always solved)
        "target_digest": digest,
        "bom": {"files": len(manifest), "algorithm": "sha256-manifest"},
        # ---- artifact provenance (filled by `sign`)
        "identity": args.identity,
        "signing": None,
        "transparency": None,
        # ---- capability provenance
        "capability": cap,
        "risk_tier": risk_tier(kind, cap),
        # ---- content provenance (OKF-native)
        "content_provenance": content_provenance(root, kind),
        # ---- independent evidence (filled by `attest`)
        "attestations": [],
        # ---- freshness
        "expires": args.expires,
        "supersedes": args.supersedes,
        "_body": (f"# {f['name']}\n\nTrust card for `{os.path.basename(os.path.abspath(root))}` "
                  f"({kind}). Evidence is graded by the consumer, not asserted here. "
                  f"Run `card.py verify` against the live bundle to evaluate it."),
    }
    # also drop the full file manifest next to the card for reproducibility
    open(out, "w").write(render_card(data))
    mpath = os.path.splitext(out)[0] + ".manifest.json"
    json.dump(manifest, open(mpath, "w"), indent=2)
    print(f"card  -> {out}")
    print(f"digest-> {digest}  ({len(manifest)} files)")
    print(f"kind  -> {kind}    risk -> {data['risk_tier']}")
    if kind != "okf" and cap.get("source") == "inferred":
        print("WARN  -> capability INFERRED (no permission manifest declared); "
              "treat shell/network as unverified")


def cmd_sign(args):
    data = load_card(args.card)
    digest = data["target_digest"]
    if have("cosign") and not args.local:
        # keyless Sigstore: identity from OIDC, entry lands in Rekor.
        try:
            subprocess.run(["cosign", "sign-blob", "--yes", "--bundle",
                            args.card + ".sigstore", "-"], input=digest.encode(),
                           check=True, capture_output=True)
            data["signing"] = {"scheme": "sigstore-keyless",
                               "bundle": os.path.basename(args.card) + ".sigstore"}
            data["transparency"] = {"log": "rekor", "stapled": True}
            print("signed via cosign (keyless); rekor entry stapled")
        except subprocess.CalledProcessError as e:
            print("cosign failed, falling back to local ed25519:", e.stderr.decode()[:120])
            data["signing"] = local_ed25519_sign(digest, args.key)
    else:
        data["signing"] = local_ed25519_sign(digest, args.key)
        print(f"signed with local ed25519 (key: {args.key or 'card-signing.key'})")
    if args.identity:
        data["identity"] = args.identity
    open(args.card, "w").write(render_card(data))


def cmd_attest(args):
    data = load_card(args.card)
    data["attestations"].append({
        "kind": args.kind, "by": args.by, "result": args.result,
        "at_digest": data["target_digest"], "timestamp": now()})
    open(args.card, "w").write(render_card(data))
    print(f"attestation added: {args.kind} by {args.by} -> {args.result}")


# graded scale: STRONG > MEDIUM > WEAK > ABSENT/UNVERIFIED
def cmd_verify(args):
    data = load_card(args.card)
    grades = {}
    notes = {}

    # integrity: recompute the bundle digest from disk and compare
    if args.bundle:
        man = bundle_manifest(args.bundle.rstrip("/"), os.path.basename(args.card))
        live = manifest_digest(man)
        if live == data["target_digest"]:
            grades["integrity"] = "STRONG"; notes["integrity"] = "digest matches live bundle"
        else:
            grades["integrity"] = "ABSENT"; notes["integrity"] = f"MISMATCH live={live}"
    else:
        grades["integrity"] = "UNVERIFIED"; notes["integrity"] = "pass --bundle to recompute"

    # authorship + transparency
    s = data.get("signing")
    if not s:
        grades["authorship"] = "ABSENT"; notes["authorship"] = "card is unsigned"
    elif s["scheme"] == "ed25519":
        ok = local_ed25519_verify(data["target_digest"], s)
        grades["authorship"] = "MEDIUM" if ok else "ABSENT"
        notes["authorship"] = ("valid ed25519 over digest (identity self-asserted)"
                               if ok else "ed25519 signature INVALID")
    elif s["scheme"].startswith("sigstore"):
        grades["authorship"] = "STRONG"
        notes["authorship"] = "sigstore keyless + rekor (verify bundle with cosign)"

    # capability
    cap = data.get("capability", {})
    if cap.get("model") == "epistemic":
        grades["capability"] = "STRONG"
        notes["capability"] = (f"executes=False; injects {cap.get('injects_concepts')} "
                               f"concepts; asserts over {cap.get('asserts_over')}")
    elif cap.get("source") == "declared":
        grades["capability"] = "MEDIUM"; notes["capability"] = "permission manifest declared (enforce in sandbox)"
    else:
        grades["capability"] = "WEAK"; notes["capability"] = "capability inferred, not declared/enforced"

    # content provenance
    cp = data.get("content_provenance", {})
    if cp.get("applicable"):
        n = cp.get("concepts_with_citations", 0)
        grades["content_provenance"] = "MEDIUM" if n else "WEAK"
        notes["content_provenance"] = f"{n} concepts carry Citations; {cp.get('reference_concepts_dated',0)} dated refs"
    else:
        grades["content_provenance"] = "UNVERIFIED"; notes["content_provenance"] = "n/a for executable skills"

    # independent attestations (the vouching chain)
    atts = data.get("attestations", [])
    valid = [a for a in atts if a.get("at_digest") == data["target_digest"]]
    grades["vouching"] = ("STRONG" if len(valid) >= 2 else "WEAK" if valid else "ABSENT")
    notes["vouching"] = f"{len(valid)} attestation(s) bound to this digest"

    # freshness
    exp = data.get("expires")
    if exp:
        fresh = exp >= now()[:10]
        grades["freshness"] = "MEDIUM" if fresh else "ABSENT"
        notes["freshness"] = ("not expired" if fresh else f"EXPIRED {exp}")
    else:
        grades["freshness"] = "UNVERIFIED"; notes["freshness"] = "no expiry set"

    # machine-readable feed (for rendering elsewhere); skips the policy gate
    if args.json:
        print(json.dumps({
            "title": data.get("title"),
            "description": data.get("description"),
            "risk_tier": data.get("risk_tier"),
            "target_digest": data.get("target_digest"),
            "identity": data.get("identity"),
            "expires": data.get("expires"),
            "capability": data.get("capability"),
            "layers": ["integrity", "authorship", "capability",
                       "content_provenance", "vouching", "freshness"],
            "grades": grades,
            "notes": notes,
        }))
        return

    # ---- render the gradient (never a single boolean)
    rank = {"STRONG": 3, "MEDIUM": 2, "WEAK": 1, "UNVERIFIED": 0, "ABSENT": 0}
    print(f"\nTrust gradient for: {data['title']}  [{data['risk_tier']}]")
    print("-" * 64)
    for layer in ["integrity", "authorship", "capability",
                  "content_provenance", "vouching", "freshness"]:
        g = grades.get(layer, "UNVERIFIED")
        bar = "#" * rank[g] + "." * (3 - rank[g])
        print(f"  {layer:<20} [{bar}] {g:<11} {notes.get(layer,'')}")
    print("-" * 64)

    # consumer policy: list of layer:min-grade requirements
    if args.policy:
        reqs = dict(p.split(":") for p in args.policy.split(","))
        unmet = [f"{k} needs {v}, has {grades.get(k,'ABSENT')}"
                 for k, v in reqs.items() if rank[grades.get(k, "ABSENT")] < rank[v]]
        if unmet:
            print("POLICY: REJECTED ->", "; ".join(unmet)); sys.exit(2)
        print("POLICY: ACCEPTED")
    else:
        print("No policy supplied -> reporting only (consumer decides).")


def cmd_validate(args):
    data = load_card(args.card)
    if not data.get("type"):
        print("FAIL: missing required `type`"); sys.exit(1)
    print(f"OK: type={data['type']} (conformant)")
    for soft in ["target_digest", "card_version", "timestamp"]:
        if not data.get(soft):
            print(f"warn: recommended field `{soft}` absent")
    if not data.get("signing"):
        print("warn: unsigned (run `card.py sign`)")
    if not data.get("attestations"):
        print("warn: no independent attestations (run `card.py attest`)")


# ----------------------------------------------------------------------------- cli
def main():
    p = argparse.ArgumentParser(description="Holistic trust cards for OKF bundles and skills")
    sub = p.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("generate"); g.add_argument("dir")
    g.add_argument("--type", choices=["okf", "skill"]); g.add_argument("--out")
    g.add_argument("--identity"); g.add_argument("--expires"); g.add_argument("--supersedes")
    g.set_defaults(func=cmd_generate)

    s = sub.add_parser("sign"); s.add_argument("card")
    s.add_argument("--key"); s.add_argument("--identity")
    s.add_argument("--local", action="store_true", help="force local ed25519")
    s.set_defaults(func=cmd_sign)

    a = sub.add_parser("attest"); a.add_argument("card")
    a.add_argument("--kind", required=True, help="scan|review|reproducible-build|...")
    a.add_argument("--by", required=True); a.add_argument("--result", required=True)
    a.set_defaults(func=cmd_attest)

    v = sub.add_parser("verify"); v.add_argument("card")
    v.add_argument("--bundle", help="bundle dir, to recompute integrity")
    v.add_argument("--policy", help="e.g. integrity:STRONG,authorship:MEDIUM")
    v.add_argument("--json", action="store_true", help="emit the gradient as JSON instead of bars")
    v.set_defaults(func=cmd_verify)

    vl = sub.add_parser("validate"); vl.add_argument("card"); vl.set_defaults(func=cmd_validate)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
