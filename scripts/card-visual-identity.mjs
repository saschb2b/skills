import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

// These seeds freeze the covers that existed when stable visual identities were
// introduced. They are visual IDs, not live content digests. Never update one
// when a skill changes internally. New skills use a hash of their stable slug.
const LEGACY_VISUAL_SEEDS = {
  "android-compose": "59c6833b22b7484cd57abc14ac370a98e20b2f9bbd25360e310098afd287ac04",
  "audit-actions": "d8ac9d1ac04b2df935c1f558e21f843274f0ddf5398f6fa7cb4a85f5d8191201",
  "codegen-api": "19d63bdecd273cb266852f8cae9198a089f8eedddb4a6e565591b7d51c6a7d29",
  "comment-stinky": "0b0850ef8a79cfe0d6b08a7e308f95477e6b827ff68e7c9e1c5a42f7fc9ff274",
  "godot": "f2c2137160dde8a4d76eb7111b3f46d12fbab1cecc87dd831af38859443af534",
  "javascript-ecosystem": "966d0604731c9223fb3371848a05130aa09ee4b076d3a416a697fa565489e887",
  "mcp-server": "25a6e45a2ce7c78f80dccbc6471c25dc7763e1706efd677432dac78746c2ccba",
  "odsf": "f21e1246f5b614f92965a842fb1b332b5143c911228411aec539b7fecc7748db",
  "okf": "90599a0c2f098c496d33ad48414887900b11ca5415861b432a10a12f8ed78e1e",
  "react-compiler": "29a409869e1c79240ba6e2edf6910068ef7e95948988b7c09c9d94516e1e3ffc",
  "react-stinky": "dd894bf88c98cbf6e3a8765c80804f7369f2aa171062434b4b22322452b55765",
  "tauri-stinky": "8af36d4bd7c075dbf638978f25f66e25dcabd9a8744ff69713b8e11391fdab8e",
  "test-stinky": "f1e1347939af6b3a548797fa5a32b14940ef83af1fa71a712cc1a56bc0ca6bc5",
  "theme-colors": "8f2c47b14459154c05f9f82ff638864d4273b188fdaa3717529d9988dfdb7d47",
  "trust-card": "1856e0cb89180df6f49c7d777e80ac05502884ac1e639965727d4c850b94b801",
  "visual-consistency": "f2c2e71a09874d5fd9939438fe9ce61a341412e8e507438c7697026ec3470255",
  "ask-ux": "b8c42ed670805556d20a105952d950563744f5fea6b4086fb55acc007f691d3f",
  "autopilot": "ddf3683f9ad619f8b23bf76d1b71a02903489021917ba2531c0834b1ce879fd8",
  "breadcrumbs": "d626f1bcacc8412225043966190d7716e8fdd0d2ec0e4d20650e1119955b04d1",
  "fable-mode": "c9c8b72bcb0872bfaa8b898e68adbec883ad1844ced433d0739b7f67b9d39bd8",
  "game-design": "f828eb665e7f958084e3c0948734ebe1bcccad2a6e23190980b12758107c7b4b",
  "no-slop": "28ba744c22778e962b0b0ee47d7df7f6d1ac978853474ecf7718e87bf814e23b",
  "to-story": "55f4796d8b9346ee35111950fd7bbbf66f459e2605eceaa314de9935feeae1bd",
};

const bytesFromHex = (hex) => (hex.padEnd(64, "0").slice(0, 64).match(/../g) || []).map((h) => parseInt(h, 16));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function visualSeed(skill) {
  return LEGACY_VISUAL_SEEDS[skill]
    || createHash("sha256").update(`skill-card-visual:v1:${skill}`).digest("hex");
}

export function visualIdentity(skill, paletteCount, styleCount, fontCount) {
  const hex = visualSeed(skill);
  const bytes = bytesFromHex(hex);
  const layout = bytes[7] % 4;
  return {
    key: hex.slice(0, 12),
    bytes,
    seed: ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0,
    paletteIndex: bytes[5] % paletteCount,
    styleIndex: bytes[4] % styleCount,
    layout,
    fontIndex: bytes[8] % fontCount,
    align: layout <= 1 && bytes[9] % 5 < 2 ? "left" : "center",
  };
}

export function contentProfile(dir) {
  const manifestPath = `${dir}/CARD.manifest.json`;
  if (!existsSync(manifestPath)) return { files: 0, words: 0, headings: 0 };

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  let words = 0;
  let headings = 0;
  for (const item of manifest) {
    const path = `${dir}/${item.path}`;
    if (!existsSync(path) || !/\.(?:css|html?|js|json|jsx|md|mjs|py|svg|toml|tsx?|txt|ya?ml)$/i.test(item.path)) continue;
    const text = readFileSync(path, "utf8");
    words += text.match(/[\p{L}\p{N}_'-]+/gu)?.length || 0;
    if (/\.md$/i.test(item.path)) headings += text.match(/^#{1,6}\s+\S/gm)?.length || 0;
  }
  return { files: manifest.length, words, headings };
}

// Content can nudge a cover, but never redesign it. These deliberately narrow
// bounds preserve the silhouette, palette, layout, and type while letting a
// larger or more structured edition carry slightly different visual pressure.
export function contentDynamics({ files = 0, words = 0, headings = 0 } = {}) {
  const size = clamp(Math.log10(Math.max(10, words)) / 5, 0, 1);
  const structure = clamp(headings / Math.max(1, files * 8), 0, 1);
  const breadth = clamp(files / 40, 0, 1);
  return {
    scale: 0.99 + size * 0.02,
    rotate: (structure - 0.5) * 1.6,
    shiftX: (breadth - 0.5) * 8,
    shiftY: (size - 0.5) * 6,
    grainOpacity: 0.22 + (size * 0.05) + (structure * 0.03),
  };
}
