#!/usr/bin/env node
// Build the trust-card render feed: cards.json (the aggregate) plus a CARD.svg
// per skill. The SVG follows the structural grid and spacing of a 5:7 trading
// card (title bar, dominant art window, type line, a two-panel text box for
// rules + flavor, a credit row, and a power/toughness-style box), but in our
// own visual identity, not anyone's frame artwork. Domain sets the frame color;
// trust score sets rarity; optional hero.* art fills the art window. Everything
// is deterministic, so files commit and CI-diff cleanly. Regenerate with:
//   pnpm cards            write cards.json + every CARD.svg
//   pnpm cards:check      the same, then fail if any card is stale (CI)
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const CARD = "skills/engineering/trust-card/scripts/card.py";
const buckets = ["engineering", "productivity"];

const ACCENTS = ["#ff77a8", "#29adff", "#00e436", "#ffa300", "#ffec27", "#008751", "#ff004d", "#83769c", "#ffccaa"];
const GRADE = { STRONG: "#2e8b57", MEDIUM: "#d9a300", WEAK: "#c8702a", UNVERIFIED: "#8a8378", ABSENT: "#8a8378" };
const RANK = { STRONG: 3, MEDIUM: 2, WEAK: 1, UNVERIFIED: 0, ABSENT: 0 };
const INITIAL = { integrity: "I", authorship: "A", capability: "C", content_provenance: "P", vouching: "V", freshness: "F" };

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
  frontend: { label: "Frontend / UI", lite: "#cfe2f2", base: "#2f6fae", dark: "#163d68" },
  game: { label: "Game", lite: "#eec3b3", base: "#b5402f", dark: "#6a2118" },
  ai: { label: "AI & Agents", lite: "#e4e8ee", base: "#8c98a6", dark: "#4c545f" },
  writing: { label: "Writing", lite: "#f3ecd2", base: "#c9b878", dark: "#857349" },
  mobile: { label: "Mobile", lite: "#bdddc3", base: "#2f8a55", dark: "#184b2e" },
  security: { label: "Security", lite: "#a6a3af", base: "#45444e", dark: "#222127" },
};

const HERO_FILES = ["hero.png", "hero.jpg", "hero.jpeg", "hero.webp", "hero.gif", "hero.svg"];
const HERO_MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif", svg: "image/svg+xml" };

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const digestBytes = (d) => ((String(d).split(":").pop() || "").padEnd(64, "0").slice(0, 64).match(/../g) || []).map((h) => parseInt(h, 16));

function trustScore(grades) {
  return Object.values(grades || {}).reduce((s, g) => s + (RANK[g] || 0), 0);
}
function reachableMax(grades, capModel) {
  let m = 0;
  for (const [layer, grade] of Object.entries(grades || {})) {
    if (grade === "UNVERIFIED") continue;
    m += layer === "capability" ? (capModel === "epistemic" ? 3 : 2)
      : (layer === "freshness" || layer === "content_provenance") ? 2 : 3;
  }
  return m;
}
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
  const cols = 9, rows = 7, half = Math.ceil(cols / 2), cw = w / cols, ch = h / rows;
  let bit = 0;
  const stream = bytes.slice(1);
  const next = () => { const b = (stream[Math.floor(bit / 8) % stream.length] >> (bit % 8)) & 1; bit++; return b; };
  const cells = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < half; c++) {
    if (!next()) continue;
    for (const cc of new Set([c, cols - 1 - c]))
      cells.push(`<rect x="${(x + cc * cw).toFixed(1)}" y="${(y + r * ch).toFixed(1)}" width="${(cw + 0.8).toFixed(1)}" height="${(ch + 0.8).toFixed(1)}" fill="${accent}"/>`);
  }
  return cells.join("");
}

// Zone grid lifted from a real 5:7 card (672x936): title bar, art window, type
// line, two-panel text box, credit row, P/T box. Filled with our own visuals.
function renderSvg(e, heroDataUri) {
  const W = 672, H = 936;
  const f = FRAME[DOMAIN[e.skill] || "ai"];
  const bytes = digestBytes(e.target_digest);
  const accent = ACCENTS[bytes[0] % ACCENTS.length];
  const score = trustScore(e.grades), reach = reachableMax(e.grades, (e.capability || {}).model), rar = rarity(e.grades);
  const name = String(e.skill).toUpperCase();
  const nameFont = Math.max(20, Math.min(34, Math.floor(470 / (name.length * 0.56))));
  const ink = "#1b1812", parch = "#f1e8cf", pborder = "#b9a96e", track = "#ddd0ad";

  const art = { x: 51.5, y: 106.5, w: 570, h: 416 };
  const screen = heroDataUri
    ? `<image x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" href="${heroDataUri}" preserveAspectRatio="xMidYMid slice" clip-path="url(#scr)"/>`
    : `<g clip-path="url(#scr)"><rect x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" fill="url(#art)"/>${identicon(art.x + 60, art.y + 44, art.w - 120, art.h - 88, bytes, accent)}</g>`;

  const layers = e.layers || Object.keys(e.grades || {});
  const rx0 = 73, rw = 516, gap = 14, bw = (rw - gap * (layers.length - 1)) / layers.length, by = 636;
  const bars = layers.map((L, i) => {
    const x = rx0 + i * (bw + gap), g = e.grades?.[L] || "ABSENT";
    return `<rect x="${x.toFixed(1)}" y="${by}" width="${bw.toFixed(1)}" height="26" rx="4" fill="${track}" stroke="${pborder}" stroke-width="1"/>`
      + `<rect x="${x.toFixed(1)}" y="${by}" width="${(bw * RANK[g] / 3).toFixed(1)}" height="26" rx="4" fill="${GRADE[g]}"/>`
      + `<text x="${(x + bw / 2).toFixed(1)}" y="${by + 50}" font-size="16" fill="${ink}" text-anchor="middle" font-family="ui-monospace,monospace">${INITIAL[L] || "?"}</text>`;
  }).join("");

  const cap = e.capability || {};
  const capLine = cap.model === "epistemic"
    ? `Knowledge - executes nothing, injects ${cap.injects_concepts ?? "?"} concepts`
    : `Executable - ${cap.source === "declared" ? "declared manifest" : "inferred"} capability`;
  const flavor = wrap(e.description, 52, 4)
    .map((ln, i) => `<text x="73" y="${736 + i * 24}" font-size="20" font-style="italic" fill="#4a4534" font-family="Georgia,serif">${esc(ln)}</text>`).join("");
  const shortDigest = (String(e.target_digest).split(":").pop() || "").slice(0, 12);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Georgia,'Times New Roman',serif">
<defs>
<linearGradient id="frame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.lite}"/><stop offset="0.12" stop-color="${f.base}"/><stop offset="1" stop-color="${f.dark}"/></linearGradient>
<linearGradient id="plate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.lite}"/><stop offset="1" stop-color="${f.base}"/></linearGradient>
<linearGradient id="art" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10131d"/><stop offset="1" stop-color="#05060a"/></linearGradient>
<clipPath id="scr"><rect x="${art.x}" y="${art.y}" width="${art.w}" height="${art.h}" rx="4"/></clipPath>
</defs>
<rect x="0" y="0" width="${W}" height="${H}" rx="30" fill="#0c0b0e"/>
<rect x="18" y="18" width="636" height="900" rx="20" fill="url(#frame)"/>
<rect x="40" y="46" width="592" height="54" rx="10" fill="url(#plate)" stroke="#0c0b0e" stroke-width="1.5"/>
<text x="60" y="84" font-size="${nameFont}" font-weight="bold" fill="${ink}">${esc(name)}</text>
<circle cx="600" cy="73" r="21" fill="${f.dark}" stroke="#0c0b0e" stroke-width="1.5"/>
<text x="600" y="80" font-size="18" font-weight="bold" fill="#fff1e8" text-anchor="middle" font-family="ui-monospace,monospace">${esc(String(e.risk_tier || "").split("-").pop().toUpperCase())}</text>
<rect x="${art.x - 5}" y="${art.y - 5}" width="${art.w + 10}" height="${art.h + 10}" rx="6" fill="${f.dark}"/>
${screen}
<rect x="51.5" y="536" width="570" height="42" rx="8" fill="url(#plate)" stroke="#0c0b0e" stroke-width="1.5"/>
<text x="68" y="564" font-size="24" fill="${ink}">${esc(f.label)} Skill</text>
<rect x="588" y="544" width="20" height="20" rx="3" transform="rotate(45 598 554)" fill="${rar.col}" stroke="#0c0b0e" stroke-width="1.2"/>
<rect x="52.5" y="585.5" width="569" height="279" rx="10" fill="${parch}" stroke="${pborder}" stroke-width="2"/>
<text x="73" y="624" font-size="16" letter-spacing="2" fill="${ink}">TRUST</text>
${bars}
<text x="73" y="702" font-size="16" fill="#3a3528">${esc(capLine)}</text>
<line x1="63" y1="718" x2="611" y2="718" stroke="${pborder}" stroke-width="1"/>
${flavor}
<rect x="18" y="878" width="636" height="40" fill="#0c0b0e" opacity="0.5"/>
<text x="44" y="898" font-size="15" fill="#e6ddca" font-family="ui-monospace,monospace">BY ${esc(e.identity || "-")}</text>
<text x="44" y="914" font-size="14" fill="#b3ab98" font-family="ui-monospace,monospace">sha256 ${esc(shortDigest)} - EXP ${esc(e.expires || "-")}</text>
<rect x="502" y="838" width="132" height="64" rx="12" fill="url(#plate)" stroke="#0c0b0e" stroke-width="1.5"/>
<text x="568" y="861" font-size="12" letter-spacing="2" fill="${ink}" text-anchor="middle" font-family="ui-monospace,monospace">VERIFIED</text>
<text x="568" y="890" font-size="28" font-weight="bold" fill="${ink}" text-anchor="middle" font-family="ui-monospace,monospace">${score}/${reach}</text>
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
