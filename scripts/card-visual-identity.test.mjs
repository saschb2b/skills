import assert from "node:assert/strict";
import test from "node:test";

import { renderSvg } from "./build-cards.mjs";
import { contentDynamics, visualIdentity, visualSeed } from "./card-visual-identity.mjs";

const COUNTS = [28, 6, 3];

test("no-slop retains its established cover identity", () => {
  const identity = visualIdentity("no-slop", ...COUNTS);
  assert.deepEqual(
    {
      paletteIndex: identity.paletteIndex,
      styleIndex: identity.styleIndex,
      layout: identity.layout,
      fontIndex: identity.fontIndex,
      align: identity.align,
    },
    { paletteIndex: 7, styleIndex: 4, layout: 2, fontIndex: 1, align: "center" },
  );
});

test("a content digest change preserves rendered cover structure", () => {
  const entry = {
    skill: "no-slop",
    description: "A stable writing skill.",
    target_digest: `sha256:${"1".repeat(64)}`,
    identity: "did:web:example.com",
    expires: "2027-08-08",
    grades: { integrity: "STRONG", capability: "MEDIUM" },
    layers: ["integrity", "capability"],
    capability: { model: "executable", source: "declared" },
    risk_tier: "executable-L1",
  };
  const profile = { files: 12, words: 4_000, headings: 30 };
  const before = renderSvg(entry, null, profile);
  const after = renderSvg({ ...entry, target_digest: `sha256:${"e".repeat(64)}` }, null, profile);
  const art = (svg) => svg.match(/<clipPath id="artc"[\s\S]*?<\/g><\/g><\/g>/)?.[0];
  const signature = (svg) => svg.match(/data-visual-key="[^"]+" data-palette="\d+" data-style="\d+" data-layout="\d+"/)?.[0];

  assert.equal(signature(before), signature(after));
  assert.equal(art(before), art(after));
  assert.notEqual(before, after, "the digest barcode and colophon should still change");
  assert.notEqual(visualSeed("no-slop"), visualSeed("to-story"));
});

test("content metrics make bounded edition-level changes", () => {
  const small = contentDynamics({ files: 5, words: 800, headings: 12 });
  const large = contentDynamics({ files: 35, words: 20_000, headings: 180 });

  assert.notDeepEqual(small, large);
  for (const dynamics of [small, large]) {
    assert.ok(dynamics.scale >= 0.99 && dynamics.scale <= 1.01);
    assert.ok(Math.abs(dynamics.rotate) <= 0.8);
    assert.ok(Math.abs(dynamics.shiftX) <= 4);
    assert.ok(Math.abs(dynamics.shiftY) <= 3);
    assert.ok(dynamics.grainOpacity >= 0.22 && dynamics.grainOpacity <= 0.30);
  }
});

test("new skills receive deterministic, slug-derived identities", () => {
  const first = visualIdentity("future-skill", ...COUNTS);
  const second = visualIdentity("future-skill", ...COUNTS);
  assert.deepEqual(first, second);
  assert.notEqual(first.key, visualIdentity("another-skill", ...COUNTS).key);
});
