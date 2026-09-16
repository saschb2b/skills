#!/usr/bin/env python3
"""Adversarial tests for proof_gate.py. Each test builds a throwaway Git repo. Run with:
    python skills/engineering/proof/scripts/test_proof_gate.py
"""
import contextlib, io, json, os, shutil, subprocess, sys, tempfile, unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import proof_gate as pg  # noqa: E402

GIT = ["git", "-c", "user.name=t", "-c", "user.email=t@example.com", "-c", "core.autocrlf=false",
       "-c", "commit.gpgsign=false"]
BUILDER, VERIFIER, HUMAN = "agent:claude-builder", "agent:claude-verifier", "human:sascha"

CONTRACT_JSON = {
    "proof": 1,
    "story": {"id": "STORY-42", "title": "Lock out after repeated failed logins"},
    "scope": {"in": ["POST /login lockout"], "out": ["password reset"]},
    "policy": ["docs/constitution.md"],
    "criteria": [
        {"id": "AC-1", "behavior": "Given 5 wrong passwords, the 6th attempt is locked out", "checks": [
            {"id": "AC-1.c1", "kind": "command", "expect": "lockout tests pass with exit 0"},
            {"id": "AC-1.c2", "kind": "inspection", "expect": "counter keyed by account"}]},
        {"id": "AC-2", "behavior": "Locked user sees a banner", "checks": [
            {"id": "AC-2.c1", "kind": "human", "expect": "banner visible on staging"}]}]}


def contract_text(payload=CONTRACT_JSON, head="---\ntype: Acceptance\ntitle: STORY-42\n---\n", extra=""):
    body = payload if isinstance(payload, str) else json.dumps(payload, indent=2)
    return f"{head}\n# STORY-42\n\nProse for humans.\n\n```json proof-contract\n{body}\n```\n{extra}"


TEST_SCRIPT = ("import os, sys\nsys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))\n"
               "import app\nprint('lockout ok')\nsys.exit(0 if app.lockout(6) and not app.lockout(5) else 1)\n")


class Repo:
    def __init__(self):
        self.tmp = tempfile.TemporaryDirectory(ignore_cleanup_errors=True)
        self.root = os.path.realpath(self.tmp.name)
        self.git("init", "-q")
        self.write("src/app.py", "def lockout(n):\n    return n > 5\n")
        self.write("tests/test_app.py", TEST_SCRIPT)
        self.write("config.toml", "[login]\nmax_attempts = 5\n")
        self.write("docs/constitution.md", "# Constitution\nNo scope creep.\n")
        self.write(".gitignore", "__pycache__/\n*.log\n")
        self.write("proof/STORY-42/acceptance.md", contract_text())
        self.git("add", "-A")
        self.git("commit", "-q", "-m", "fixture")
        self.contract = self.path("proof/STORY-42/acceptance.md")
        self.ev = self.path("proof/STORY-42/evidence")

    def close(self):
        self.tmp.cleanup()

    def git(self, *args):
        return subprocess.run(GIT + list(args), cwd=self.root, check=True, capture_output=True).stdout

    def path(self, rel):
        return os.path.join(self.root, *rel.split("/"))

    def write(self, rel, text):
        full = self.path(rel)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "w", encoding="utf-8", newline="\n") as f:
            f.write(text)

    def cli(self, *args):
        out, err = io.StringIO(), io.StringIO()
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            try:
                code = pg.main([str(a) for a in args])
            except SystemExit as e:  # argparse usage errors
                code = e.code
        return code, out.getvalue() + err.getvalue()

    # flow helpers
    def freeze(self, builder=BUILDER, verifier=VERIFIER, ev=None, **kw):
        args = ["freeze", self.contract, "--evidence", ev or self.ev, "--builder", builder, "--verifier", verifier]
        return self.cli(*args, *(["--force"] if kw.get("force") else []))

    def run(self, cid="AC-1.c1", argv=None):
        return self.cli("run", "--evidence", self.ev, "--check", cid, "--", *(argv or [sys.executable, "tests/test_app.py"]))

    def verdict(self, cid, result="PASS", by=VERIFIER, observed="observed the expected behaviour in detail", arts=()):
        args = ["verdict", "--evidence", self.ev, "--check", cid, "--result", result, "--by", by, "--observed", observed]
        for a in arts:
            args += ["--artifact", a]
        return self.cli(*args)

    def gate(self):
        return self.cli("gate", "--evidence", self.ev)

    def report(self):
        with open(os.path.join(self.ev, "report.json"), encoding="utf-8") as f:
            return json.load(f)

    def full_pass(self):
        assert self.freeze()[0] == 0
        assert self.run()[0] == 0
        assert self.verdict("AC-1.c1", observed="2 lockout tests passed, 6th attempt rejected")[0] == 0
        os.makedirs(os.path.join(self.ev, "artifacts"), exist_ok=True)
        self.write("proof/STORY-42/evidence/artifacts/scope.txt", "Fixture inspection finding for the account key.\n")
        assert self.verdict("AC-1.c2", observed="counter dict keyed by account id in app.py",
                            arts=["artifacts/scope.txt"])[0] == 0
        self.write("proof/STORY-42/evidence/artifacts/banner.txt", "screenshot stand-in\n")
        assert self.verdict("AC-2.c1", by=HUMAN, observed="banner with wait time visible on staging",
                            arts=["artifacts/banner.txt"])[0] == 0

    def edit_json(self, rel, fn):
        full = os.path.join(self.ev, rel)
        with open(full, encoding="utf-8") as f:
            doc = json.load(f)
        fn(doc)
        with open(full, "w", encoding="utf-8") as f:
            json.dump(doc, f)


class ProofGateTests(unittest.TestCase):
    def setUp(self):
        self.r = Repo()
        self.addCleanup(self.r.close)

    def assertGate(self, code, gate=None, contains=""):
        got, out = self.r.gate()
        self.assertEqual(got, code, out)
        if gate:
            self.assertEqual(self.r.report()["gate"], gate, out)
        self.assertIn(contains, out)

    # ---- happy path
    def test_end_to_end_pass_and_idempotent_gate(self):
        code, out = self.r.cli("validate", self.r.contract)
        self.assertEqual(code, 0, out)
        self.r.full_pass()
        self.assertGate(0, "PASS", "GATE: PASS (3 PASS")
        rep = self.r.report()
        self.assertEqual({c["status"] for c in rep["checks"].values()}, {"PASS"})
        self.assertEqual(rep["missing_tracked"], [])
        self.assertGate(0, "PASS")  # report.json rewrite lives in the excluded evidence dir

    # ---- contract validation
    def test_contract_rejections(self):
        base = json.dumps(CONTRACT_JSON)
        cases = {
            "duplicate key": (base.replace('"proof": 1', '"proof": 1, "proof": 1'), "duplicate JSON key"),
            "nonfinite": (base.replace('"proof": 1', '"proof": NaN'), "non-finite"),
            "bool proof": (base.replace('"proof": 1', '"proof": true'), "'proof' must be 1"),
            "empty criteria": (json.dumps({**CONTRACT_JSON, "criteria": []}), "must not be empty"),
            "duplicate check id": (base.replace('"AC-1.c2"', '"AC-1.c1"'), "duplicate id"),
            "unknown key (argv)": (base.replace('"kind": "command"', '"kind": "command", "argv": ["rm"]'), "unknown keys"),
            "bad kind": (base.replace('"kind": "human"', '"kind": "auto"'), "kind must be one of"),
            "expect_exit on human": (base.replace('"kind": "human"', '"kind": "human", "expect_exit": 0'), "only applies"),
            "policy traversal": (base.replace('"docs/constitution.md"', '"../secrets"'), "unsafe path"),
            "policy absolute": (base.replace('"docs/constitution.md"', '"/etc/passwd"'), "must be relative"),
            "id with slash": (base.replace('"AC-2.c1"', '"../evil"'), "invalid id"),
            "empty scope.in": (json.dumps({**CONTRACT_JSON, "scope": {"in": [], "out": []}}), "must not be empty"),
            "empty expect": (base.replace('"expect": "counter keyed by account"', '"expect": "  "'), "is empty"),
        }
        for name, (payload, msg) in cases.items():
            with self.subTest(name):
                self.r.write("proof/STORY-42/acceptance.md", contract_text(payload))
                code, out = self.r.cli("validate", self.r.contract)
                self.assertEqual(code, 2, f"{name}: {out}")
                self.assertIn(msg, out)
        for name, text, msg in [
            ("no type marker", contract_text(head="---\ntitle: x\n---\n"), "lacks the 'type: Acceptance'"),
            ("no frontmatter", contract_text(head=""), "must start with an OKF frontmatter"),
            ("two blocks", contract_text(extra="\n```json proof-contract\n{}\n```\n"), "exactly one"),
        ]:
            with self.subTest(name):
                self.r.write("proof/STORY-42/acceptance.md", text)
                code, out = self.r.cli("validate", self.r.contract)
                self.assertEqual(code, 2, out)
                self.assertIn(msg, out)

    # ---- freeze
    def test_freeze_rejections(self):
        self.assertEqual(self.r.freeze(verifier="agent:Claude-Builder")[0], 2, "same identity, case-insensitive")
        self.assertEqual(self.r.freeze(builder="claude")[0], 2, "identity without kind prefix")
        self.assertEqual(self.r.freeze(ev=self.r.root)[0], 2, "evidence at repo root")
        self.assertEqual(self.r.freeze(ev=self.r.path("proof/STORY-42"))[0], 2, "evidence dir contains the contract")
        self.assertEqual(self.r.freeze(ev=self.r.path("docs"))[0], 2, "evidence dir contains the policy file")
        code, out = self.r.freeze(ev=self.r.path("src"))
        self.assertEqual(code, 2)
        self.assertIn("overbroad", out)
        self.assertEqual(self.r.freeze(ev=os.path.join(self.r.tmp.name, "..", "outside-ev"))[0], 2, "outside work tree")
        self.assertFalse(os.path.exists(os.path.join(self.r.root, "src", "freeze.json")))
        self.assertEqual(self.r.freeze()[0], 0)
        self.assertEqual(self.r.freeze()[0], 2, "second freeze without --force")
        self.assertEqual(self.r.freeze(force=True)[0], 0)

    def test_contract_or_policy_edit_after_freeze_invalidates(self):
        self.r.full_pass()
        self.r.write("proof/STORY-42/acceptance.md", contract_text(extra="\nAdded a sentence after freeze.\n"))
        self.assertGate(2, contains="contract changed since freeze")
        self.assertEqual(self.r.report()["gate"], "INVALID")
        self.r.write("proof/STORY-42/acceptance.md", contract_text())
        self.r.write("docs/constitution.md", "# Constitution\nScope creep is fine now.\n")
        self.assertGate(2, contains="policy file changed")

    # ---- run
    def test_run_rejections_and_unavailable_command(self):
        self.r.freeze()
        self.assertEqual(self.r.run("AC-1.c2")[0], 2, "inspection checks cannot be run")
        self.assertEqual(self.r.run("AC-9")[0], 2, "unknown check")
        self.assertEqual(self.r.cli("run", "--evidence", self.r.ev, "--check", "AC-1.c1")[0], 2, "no argv")
        code, out = self.r.run(argv=["definitely-not-a-program-xyz", "--version"])
        self.assertEqual(code, 1)
        self.assertIn("exit=None", out)
        self.assertEqual(self.r.verdict("AC-1.c1")[0], 0)
        self.assertGate(1, "UNVERIFIED", "command unavailable")

    def test_contradicted_pass_is_fail_not_unverified(self):
        self.r.freeze()
        self.r.write("tests/test_app.py", "import sys\nprint('boom')\nsys.exit(1)\n")
        self.assertEqual(self.r.run()[0], 1)
        self.assertEqual(self.r.verdict("AC-1.c1")[0], 0)
        self.assertGate(1, "FAIL", "declared PASS but run exited 1")
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"][0].update(result="FAIL"))
        self.assertGate(1, "FAIL", "verifier declared FAIL")

    # ---- freshness
    def test_stale_on_source_test_config_untracked_and_deleted(self):
        self.r.full_pass()
        self.r.write("src/app.py", "def lockout(n):\n    return n > 4\n")
        self.assertGate(1, "UNVERIFIED", "stale")
        self.r.git("checkout", "--", "src/app.py")
        self.assertGate(0, "PASS")
        self.r.write("tests/test_app.py", TEST_SCRIPT + "# tweaked\n")
        self.assertGate(1, "UNVERIFIED", "stale")
        self.r.git("checkout", "--", "tests/test_app.py")
        self.r.write("config.toml", "[login]\nmax_attempts = 50\n")
        self.assertGate(1, "UNVERIFIED", "stale")
        self.r.git("checkout", "--", "config.toml")
        self.r.write("src/new_module.py", "x = 1\n")  # untracked, not ignored
        self.assertGate(1, "UNVERIFIED", "stale")
        os.remove(self.r.path("src/new_module.py"))
        self.r.write("debug.log", "ignored\n")  # matches *.log, so invisible to the digest
        self.assertGate(0, "PASS")
        os.remove(self.r.path("config.toml"))
        self.assertGate(1, "UNVERIFIED", "missing tracked files: ['config.toml']")
        self.assertEqual(self.r.report()["missing_tracked"], ["config.toml"])

    def test_missing_verdict_is_unverified(self):
        self.r.freeze()
        self.r.run()
        self.assertEqual(self.r.verdict("AC-1.c1")[0], 0)
        self.assertGate(1, "UNVERIFIED", "no verdict recorded")
        self.assertEqual(self.r.report()["counts"], {"PASS": 1, "FAIL": 0, "UNVERIFIED": 2})

    # ---- roles and human evidence
    def test_roles(self):
        self.r.full_pass()
        self.assertEqual(self.r.verdict("AC-2.c1", by=VERIFIER, observed="agent looked at the banner")[0], 0)
        self.assertGate(1, "UNVERIFIED", "human check needs human:* evidence")
        self.assertEqual(self.r.verdict("AC-2.c1", by=BUILDER.replace("agent:", "human:"), observed="looked",
                                       arts=["artifacts/banner.txt"])[0], 0)
        self.assertGate(0, "PASS")  # a human with the builder's name is a different declared identity
        self.assertEqual(self.r.verdict("AC-1.c2", by=BUILDER, observed="I wrote it, it is fine")[0], 0)
        self.assertGate(1, "UNVERIFIED", "judged by the builder")
        self.assertEqual(self.r.verdict("AC-1.c2", by="agent:someone-else", observed="looks right to me")[0], 0)
        self.assertGate(1, "UNVERIFIED", "frozen verifier is agent:claude-verifier")
        self.assertEqual(self.r.verdict("AC-1.c2", by="human:reviewer", observed="reviewed the diff")[0], 0)
        self.assertGate(1, "UNVERIFIED", "frozen verifier")
        self.assertEqual(self.r.verdict("AC-1.c1", by=HUMAN, observed="I ran it")[0], 0)
        self.assertGate(1, "UNVERIFIED", "frozen verifier")

    def test_placeholder_observation_is_not_evidence(self):
        self.r.full_pass()
        for text in ("ok", "PASS", " done ", "", "lgtm"):
            self.assertEqual(self.r.verdict("AC-1.c2", observed=text)[0], 2, repr(text))
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"][1].update(observed="ok"))
        self.assertGate(1, "UNVERIFIED", "placeholder")
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"][1].pop("observed"))
        self.assertGate(2, contains="missing 'observed'")

    # ---- artifacts
    def test_artifact_rules(self):
        self.r.full_pass()
        human = lambda art: self.r.verdict("AC-2.c1", "PASS", HUMAN, "saw it on staging", arts=[art])
        self.r.write("proof/STORY-42/evidence/artifacts/empty.txt", "")
        self.assertEqual(human("artifacts/empty.txt")[0], 2, "empty")
        self.r.write("proof/STORY-42/evidence/loose.txt", "x\n")
        self.assertEqual(human("loose.txt")[0], 2, "outside artifacts/")
        os.remove(os.path.join(self.r.ev, "loose.txt"))
        self.assertEqual(human("artifacts/../../acceptance.md")[0], 2, "traversal")
        self.assertEqual(human("artifacts/nope.png")[0], 2, "missing")
        self.assertEqual(human(self.r.path("config.toml"))[0], 2, "absolute")
        link = os.path.join(self.r.ev, "artifacts", "escape.md")
        try:
            os.symlink(self.r.path("docs/constitution.md"), link)
        except (OSError, NotImplementedError):
            pass  # no symlink privilege on this host; the guard is exercised where symlinks exist
        else:
            code, out = human("artifacts/escape.md")
            self.assertEqual(code, 2)
            self.assertIn("symlink", out)
        self.assertGate(0, "PASS")  # the rejected verdicts never replaced the good one
        self.r.write("proof/STORY-42/evidence/artifacts/banner.txt", "altered after the verdict\n")
        self.assertGate(2, contains="changed since the verdict")

    # ---- tampering with evidence files
    def test_verdicts_json_tampering(self):
        self.r.full_pass()
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"].append({**d["verdicts"][0], "check": "AC-7"}))
        self.assertGate(2, contains="unknown check id")
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"].pop())
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"].append(dict(d["verdicts"][0])))
        self.assertGate(2, contains="duplicate verdict")
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"].pop())
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"][0].update(result="PASSED"))
        self.assertGate(2, contains="malformed result")
        self.r.edit_json("verdicts.json", lambda d: d["verdicts"][0].update(result="PASS", candidate_digest="0" * 64))
        self.assertGate(1, "UNVERIFIED", "candidate changed since verdict")
        self.assertEqual(self.r.cli("verdict", "--evidence", self.r.ev, "--check", "AC-1.c1", "--result", "MAYBE",
                                    "--by", VERIFIER, "--observed", "something")[0], 2)
        with open(os.path.join(self.r.ev, "verdicts.json"), "w") as f:
            f.write('{"verdicts": [], "verdicts": []}')
        self.assertGate(2, contains="duplicate JSON key")

    def test_run_record_tampering_and_rerun(self):
        self.r.full_pass()
        stdout_path = os.path.join(self.r.ev, "runs", "AC-1.c1.stdout")
        with open(stdout_path, "rb") as f:
            original = f.read()
        self.assertIn(b"lockout ok", original)
        with open(stdout_path, "ab") as f:
            f.write(b"forged\n")
        self.assertGate(2, contains="stdout capture missing or changed")
        with open(stdout_path, "wb") as f:
            f.write(original)
        self.assertGate(0, "PASS")
        self.r.edit_json("runs/AC-1.c1.json", lambda d: d.update(exit=0))  # same content, re-serialised
        self.assertGate(1, "UNVERIFIED", "run record changed since verdict")
        self.assertEqual(self.r.run()[0], 0)  # fresh run after the verdict: verdict no longer binds it
        self.assertGate(1, "UNVERIFIED", "run record changed since verdict")
        os.remove(os.path.join(self.r.ev, "runs", "AC-1.c1.json"))
        self.assertGate(1, "UNVERIFIED", "run record missing")

    def test_evidence_dir_must_match_freeze(self):
        self.r.full_pass()
        moved = self.r.path("proof/STORY-42/evidence-copy")
        shutil.copytree(self.r.ev, moved)
        code, out = self.r.cli("gate", "--evidence", moved)
        self.assertEqual(code, 2)
        self.assertIn("differs from frozen", out)
        shutil.rmtree(moved)
        self.assertGate(0, "PASS")

    def test_gate_never_writes_outside_an_evidence_dir(self):
        code, out = self.r.cli("gate", "--evidence", self.r.path("src"))
        self.assertEqual(code, 2)
        self.assertIn("missing", out)
        self.assertEqual(sorted(os.listdir(self.r.path("src"))), ["app.py"])

    def test_manual_checks_require_attached_findings(self):
        self.r.full_pass()
        for cid, actor in (("AC-1.c2", VERIFIER), ("AC-2.c1", HUMAN)):
            self.assertEqual(self.r.verdict(cid, by=actor, observed="Observed the behavior directly")[0], 0)
        self.assertGate(1, "UNVERIFIED", "attached finding artifact")

    def test_refreeze_invalidates_old_runs_and_verdicts(self):
        self.r.full_pass()
        self.assertGate(0, "PASS")
        self.assertEqual(self.r.freeze(force=True)[0], 0)
        self.assertGate(1, "UNVERIFIED", "earlier freeze")
        self.assertEqual(self.r.verdict("AC-1.c1")[0], 0)
        self.assertGate(1, "UNVERIFIED", "run belongs to an earlier freeze")

    def test_untracked_source_is_not_an_evidence_exclusion(self):
        self.r.write("new-src/app.py", "print('source')\n")
        code, out = self.r.freeze(ev=self.r.path("new-src"))
        self.assertEqual(code, 2, out)
        self.assertIn("overbroad", out)

    def test_silent_command_requires_other_evidence(self):
        self.r.freeze()
        self.r.run(argv=[sys.executable, "-c", "pass"])
        self.r.verdict("AC-1.c1")
        self.assertGate(1, "UNVERIFIED", "no captured output")

    def test_malformed_run_exit_cannot_equal_zero(self):
        self.r.full_pass()
        self.r.edit_json("runs/AC-1.c1.json", lambda d: d.update(exit=False))
        self.r.verdict("AC-1.c1")
        self.assertGate(2, contains="exit type")

    def test_invalid_contract_markers_and_case_collisions(self):
        for text in (
            contract_text(head="---\ntype: Acceptance\n"),
            contract_text(json.dumps(CONTRACT_JSON).replace('"proof": 1', '"proof": 1.0')),
            contract_text(json.dumps(CONTRACT_JSON).replace('"AC-1.c2"', '"ac-1.C1"')),
        ):
            with self.subTest(text=text[:60]):
                self.r.write("proof/STORY-42/acceptance.md", text)
                self.assertEqual(self.r.cli("validate", self.r.contract)[0], 2)

    def test_timeout_is_unverified_and_invalid_timeout_is_rejected(self):
        self.r.freeze()
        for timeout in ("nan", "inf", "0", "-1"):
            code, _ = self.r.cli("run", "--evidence", self.r.ev, "--check", "AC-1.c1",
                                "--timeout", timeout, "--", sys.executable, "-c", "print('x')")
            self.assertEqual(code, 2)
        code, out = self.r.cli("run", "--evidence", self.r.ev, "--check", "AC-1.c1",
                              "--timeout", "0.01", "--", sys.executable, "-c", "import time; time.sleep(2)")
        self.assertEqual(code, 1, out)
        self.r.verdict("AC-1.c1")
        self.assertGate(1, "UNVERIFIED", "command unavailable")

    def test_run_output_symlink_does_not_replace_target(self):
        self.r.freeze()
        runs = os.path.join(self.r.ev, "runs")
        os.makedirs(runs)
        target = self.r.path("config.toml")
        with open(target, "rb") as f:
            original = f.read()
        try:
            os.symlink(target, os.path.join(runs, "AC-1.c1.stdout"))
        except (OSError, NotImplementedError):
            self.skipTest("host cannot create symlinks")
        code, out = self.r.run()
        self.assertEqual(code, 2, out)
        with open(target, "rb") as f:
            self.assertEqual(f.read(), original)


if __name__ == "__main__":
    unittest.main(verbosity=2)
