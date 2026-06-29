#!/usr/bin/env node
// Build the trust-card render feed: cards.json (the aggregate) plus a CARD.svg
// per skill, laid out like a Magic: The Gathering card (5:7, black border, a
// color-identity frame, title bar with a cost pip, art window, type line with a
// rarity symbol, a parchment text box holding the six trust bars and the
// description as flavor text, and a bottom line with identity + short digest).
// Domain sets the frame color; trust score sets rarity. Optional hero.* art
// fills the art window instead of the digest-seeded identicon. Deterministic,
// so files commit and CI-diff cleanly. Regenerate after a skill or card change:
//   pnpm cards            write cards.json + every CARD.svg
//   pnpm cards:check      the same, then fail if any card is stale (CI)
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const CARD = "skills/engineering/trust-card/scripts/card.py";
const buckets = ["engineering", "productivity"];

// PICO-8 palette for the digest identicon accents (fixed, documented hex).
const ACCENTS = ["#ff77a8", "#29adff", "#00e436", "#ffa300", "#ffec27", "#008751", "#ff004d", "#83769c", "#ffccaa"];
const GRADE = { STRONG: "#2e8b57", MEDIUM: "#d9a300", WEAK: "#c8702a", UNVERIFIED: "#8a8378", ABSENT: "#8a8378" };
const RANK = { STRONG: 3, MEDIUM: 2, WEAK: 1, UNVERIFIED: 0, ABSENT: 0 };
const INITIAL = { integrity: "I", authorship: "A", capability: "C", content_provenance: "P", vouching: "V", freshness: "F" };

// Domain -> MTG-style color identity. Frame palettes are approximations of the
// W/U/B/R/G, artifact, and white frames.
const DOMAIN = {
  "react-compiler": "frontend", "react-stinky": "frontend", "codegen-api": "frontend",
  "javascript-ecosystem": "frontend", "theme-colors": "frontend", "visual-consistency": "frontend", "ask-ux": "frontend",
  godot: "game", "game-design": "game",
  "mcp-server": "ai", okf: "ai", odsf: "ai",
  "no-slop": "writing", "to-story": "writing", autopilot: "writing",
  "android-compose": "mobile",
  "audit-actions": "security", "trust-card": "security",
};
const FRAME = {
  frontend: { label: "Frontend / UI", lite: "#bcd6ec", base: "#2f6fae", dark: "#1c4d82" },
  game: { label: "Game", lite: "#e6b6a3", base: "#b5402f", dark: "#7e2a20" },
  ai: { label: "AI & Agents", lite: "#dde2e8", base: "#8c98a6", dark: "#5d6773" },
  writing: { label: "Writing", lite: "#efe6c6", base: "#c9b878", dark: "#9c8c52" },
  mobile: { label: "Mobile", lite: "#b3d6ba", base: "#2f8a55", dark: "#1d5e39" },
  security: { label: "Security", lite: "#9b98a4", base: "#45444e", dark: "#2a2930" },
};

const HERO_FILES = ["hero.png", "hero.jpg", "hero.jpeg", "hero.webp", "hero.gif", "hero.svg"];
const HERO_MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml" };

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const digestBytes = (d) => ((String(d).split(":").pop() || "").padEnd(64, "0").slice(0, 64).match(/../g) || []).map((h) => parseInt(h, 16));

function trustScore(grades) {
  return Object.values(grades || {}).reduce((s, g) => s + (RANK[g] || 0), 0); // 0..18
}
// Reachable maximum for THIS artifact: drop n/a layers (UNVERIFIED) and respect
// per-layer ceilings (capability tops at MEDIUM for a skill, freshness and
// content provenance never grade STRONG). A skill maxes at 13, a bundle at 16,
// so the score reads as verification completeness, not a flat-18 grade.
function reachableMax(grades, capModel) {
  let m = 0;
  for (const [layer, grade] of Object.entries(grades || {})) {
    if (grade === "UNVERIFIED") continue;
    m += layer === "capability" ? (capModel === "epistemic" ? 3 : 2)
      : (layer === "freshness" || layer === "content_provenance") ? 2 : 3;
  }
  return m;
}

// Rarity tracks the verification ceremony, not a quality grade: generated ->
// declared -> signed -> attested.
function rarity(grades) {
  const g = grades || {};
  const signed = (RANK[g.authorship] || 0) >= 2;
  const vouched = (RANK[g.vouching] || 0) >= 3;
  if (signed && vouched) return { key: "mythic", col: "#e8743b", label: "MYTHIC" };
  if (signed || vouched) return { key: "rare", col: "#d4af37", label: "RARE" };
  if (g.integrity === "STRONG" && (RANK[g.capability] || 0) >= 2) return { key: "uncommon", col: "#aab2bb", label: "UNCOMMON" };
  return { key: "common", col: "#2f2f2f", label: "COMMON" };
}
function wrap(text, max, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; if (lines.length === maxLines) break; }
    else cur = cur ? cur + " " + w : w;
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  const used = lines.join(" ").split(/\s+/).length;
  if (used < words.length && lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/[ ,.;:]+$/, "") + "...";
  return lines;
}

// A mirrored identicon seeded by the bundle digest, so the art is provenance.
function identicon(x, y, w, h, bytes, accent) {
  const cols = 9, rows = 6, half = Math.ceil(cols / 2), cw = w / cols, ch = h / rows;
  let bit = 0;
  const stream = bytes.slice(1);
  const next = () => { const b = (stream[Math.floor(bit / 8) % stream.length] >> (bit % 8)) & 1; bit++; return b; };
  const cells = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < half; c++) {
    if (!next()) continue;
    for (const cc of new Set([c, cols - 1 - c]))
      cells.push(`<rect x="${(x + cc * cw).toFixed(2)}" y="${(y + r * ch).toFixed(2)}" width="${(cw + 0.6).toFixed(2)}" height="${(ch + 0.6).toFixed(2)}" fill="${accent}"/>`);
  }
  return cells.join("");
}

function renderSvg(e, heroDataUri) {
  const W = 360, H = 504;
  const f = FRAME[DOMAIN[e.skill] || "ai"];
  const bytes = digestBytes(e.target_digest);
  const accent = ACCENTS[bytes[0] % ACCENTS.length];
  const score = trustScore(e.grades);
  const reach = reachableMax(e.grades, (e.capability || {}).model);
  const rar = rarity(e.grades);
  const name = String(e.skill).toUpperCase();
  const nameFont = Math.max(11, Math.min(18, Math.floor(296 / (name.length * 0.56))));
  const tier = String(e.risk_tier || "").split("-").pop().toUpperCase();
  const ink = "#1b1812", parch = "#f1e8cf", pborder = "#b9a96e", track = "#ddd0ad";

  const art = { x: 24, y: 56, w: 312, h: 186 };
  const screen = heroDataUri
    ? `<image x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" href="${heroDataUri}" preserveAspectRatio="xMidYMid slice" clip-path="url(#scr)"/>`
    : `<g clip-path="url(#scr)"><rect x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" fill="url(#art)"/>${identicon(art.x + 30, art.y + 20, art.w - 60, art.h - 40, bytes, accent)}</g>`;

  const layers = e.layers || Object.keys(e.grades || {});
  const bx = 30, n = layers.length, gap = 8, bw = (300 - gap * (n - 1)) / n, by = 318;
  const pips = layers.map((L, i) => {
    const x = bx + i * (bw + gap), g = e.grades?.[L] || "ABSENT";
    return `<rect x="${x.toFixed(2)}" y="${by}" width="${bw.toFixed(2)}" height="13" rx="2.5" fill="${track}" stroke="${pborder}" stroke-width="0.6"/>`
      + `<rect x="${x.toFixed(2)}" y="${by}" width="${(bw * RANK[g] / 3).toFixed(2)}" height="13" rx="2.5" fill="${GRADE[g]}"/>`
      + `<text x="${(x + bw / 2).toFixed(2)}" y="${by + 26}" font-size="8" fill="${ink}" text-anchor="middle" font-family="ui-monospace,monospace">${INITIAL[L] || "?"}</text>`;
  }).join("");

  const cap = e.capability || {};
  const capLine = cap.model === "epistemic"
    ? `Knowledge - executes nothing, injects ${cap.injects_concepts ?? "?"} concepts`
    : `Executable - ${cap.source === "declared" ? "declared manifest" : "inferred"} capability`;
  const flavor = wrap(e.description, 50, 3)
    .map((ln, i) => `<text x="30" y="${392 + i * 15}" font-size="9.5" font-style="italic" fill="#4a4534" font-family="Georgia,serif">${esc(ln)}</text>`).join("");
  const shortDigest = (String(e.target_digest).split(":").pop() || "").slice(0, 12);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Georgia,'Times New Roman',serif">
<defs>
<linearGradient id="frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.lite}"/><stop offset="0.14" stop-color="${f.base}"/><stop offset="1" stop-color="${f.dark}"/></linearGradient>
<linearGradient id="art" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10131d"/><stop offset="1" stop-color="#05060a"/></linearGradient>
<clipPath id="scr"><rect x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" rx="3"/></clipPath>
</defs>
<rect x="0" y="0" width="${W}" height="${H}" rx="18" fill="#0c0b0e"/>
<rect x="9" y="9" width="${W - 18}" height="${H - 18}" rx="11" fill="url(#frame)"/>
<rect x="18" y="18" width="324" height="34" rx="6" fill="${f.lite}" stroke="${f.dark}" stroke-width="1"/>
<text x="29" y="40" font-size="${nameFont}" font-weight="bold" fill="${ink}">${esc(name)}</text>
<circle cx="325" cy="35" r="11" fill="${f.dark}" stroke="#0c0b0e" stroke-width="1"/>
<text x="325" y="39" font-size="10" font-weight="bold" fill="#fff1e8" text-anchor="middle" font-family="ui-monospace,monospace">${esc(tier)}</text>
<rect x="${art.x - 3}" y="${art.y - 3}" width="${art.w + 6}" height="${art.h + 6}" rx="4" fill="${f.dark}"/>
${screen}
<rect x="18" y="248" width="324" height="26" rx="5" fill="${f.lite}" stroke="${f.dark}" stroke-width="1"/>
<text x="29" y="266" font-size="12" fill="${ink}">${esc(f.label)} Skill</text>
<rect x="319" y="254" width="14" height="14" rx="2" transform="rotate(45 326 261)" fill="${rar.col}" stroke="#0c0b0e" stroke-width="0.8"/>
<rect x="18" y="280" width="324" height="170" rx="4" fill="${parch}" stroke="${pborder}" stroke-width="1.5"/>
<text x="30" y="306" font-size="9" letter-spacing="1.5" fill="${ink}">TRUST</text>
${pips}
<text x="30" y="364" font-size="9" fill="#3a3528">${esc(capLine)}</text>
<line x1="30" y1="374" x2="330" y2="374" stroke="${pborder}" stroke-width="0.8"/>
${flavor}
<rect x="9" y="${H - 46}" width="${W - 18}" height="37" rx="0" fill="#0c0b0e" opacity="0.5"/>
<text x="20" y="${H - 28}" font-size="8" fill="#e6ddca" font-family="ui-monospace,monospace">BY ${esc(e.identity || "-")}</text>
<text x="20" y="${H - 16}" font-size="8" fill="#b3ab98" font-family="ui-monospace,monospace">sha256 ${esc(shortDigest)} - ${rar.label} - EXP ${esc(e.expires || "-")}</text>
<rect x="286" y="${H - 43}" width="56" height="29" rx="5" fill="${f.lite}" stroke="#0c0b0e" stroke-width="1"/>
<text x="314" y="${H - 33}" font-size="5.5" letter-spacing="0.5" fill="${ink}" text-anchor="middle" font-family="ui-monospace,monospace">VERIFIED</text>
<text x="314" y="${H - 19}" font-size="12" font-weight="bold" fill="${ink}" text-anchor="middle" font-family="ui-monospace,monospace">${score}/${reach}</text>
</svg>
`;
}

const skills = [];
for (const bucket of buckets) {
  const base = `skills/${bucket}`;
  for (const name of readdirSync(base).sort()) {
    const dir = `${base}/${name}`;
    if (!existsSync(`${dir}/SKILL.md`)) continue;
    if (!existsSync(`${dir}/CARD.md`)) {
      console.warn(`skip ${name}: no CARD.md (run: python3 ${CARD} generate ${dir})`);
      continue;
    }
    const out = execFileSync("python3", [CARD, "verify", `${dir}/CARD.md`, "--bundle", dir, "--json"], { encoding: "utf8" });
    const hero = HERO_FILES.find((h) => existsSync(`${dir}/${h}`)) || null;
    const heroDataUri = hero
      ? `data:${HERO_MIME[hero.split(".").pop()]};base64,${readFileSync(`${dir}/${hero}`).toString("base64")}`
      : null;
    const verify = JSON.parse(out);
    const grades = verify.grades || {};
    const entry = {
      skill: name, bucket, domain: FRAME[DOMAIN[name] || "ai"].label, ...verify,
      trust_score: trustScore(grades), reachable: reachableMax(grades, (verify.capability || {}).model), rarity: rarity(grades).key,
      art: { svg: "CARD.svg", hero },
    };
    writeFileSync(`${dir}/CARD.svg`, renderSvg(entry, heroDataUri));
    skills.push(entry);
  }
}

const doc = { repo: "saschb2b/skills", card_version: "0.1", count: skills.length, skills };
writeFileSync("cards.json", JSON.stringify(doc, null, 2) + "\n");
console.log(`wrote cards.json + ${skills.length} CARD.svg (${skills.filter((s) => s.art.hero).length} with hero art)`);

// --check (CI): fail if any card is stale vs its live bundle. Pair with
// `git diff --exit-code` over cards.json and the SVGs to catch unbuilt output.
if (process.argv.includes("--check")) {
  const stale = skills.filter((s) => s.grades?.integrity !== "STRONG").map((s) => s.skill);
  if (stale.length) {
    console.error(`stale cards (integrity not STRONG; regenerate with 'card.py generate'): ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log("cards check: all integrity STRONG");
}
