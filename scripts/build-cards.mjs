#!/usr/bin/env node
// Build the trust-card render feed: cards.json (the aggregate) plus a CARD.svg
// per skill. Each SVG is an abstract generated book cover: a permanent visual
// seed picks a palette from the shared cover theme, one of
// six flat print-style compositions (sun arcs, organic blob, op-art waves,
// bauhaus grid, torn-paper collage, diagonal beams), one of four layouts, and
// every shape parameter. The cover combines the skill title and tagline with
// trust data in a fixed colophon: six layer meters, score, rarity, tier, and the
// digest drawn as an ISBN-style barcode. Content metrics only nudge bounded art
// details, so a new edition remains recognizably the same skill. Everything is deterministic, so files
// commit and CI-diff cleanly. Regenerate with:
//   pnpm cards                write cards.json + every CARD.svg
//   pnpm cards <skill...>     regenerate only those skills; their cards.json
//                             entries are patched in place, everything else
//                             (other entries, other CARD.svg) stays untouched
//   pnpm cards:check          full build, then fail if any card is stale (CI);
//                             also accepts skill names to scope the check
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { contentDynamics, contentProfile, visualIdentity } from "./card-visual-identity.mjs";

const CARD = "skills/engineering/trust-card/scripts/card.py";
const buckets = ["engineering", "productivity"];

const RANK = { STRONG: 3, MEDIUM: 2, WEAK: 1, UNVERIFIED: 0, ABSENT: 0 };
const INITIAL = { integrity: "I", authorship: "A", capability: "C", content_provenance: "P", vouching: "V", freshness: "F" };

const DOMAIN = {
  "react-compiler": "frontend", "react-stinky": "frontend", "codegen-api": "frontend",
  "javascript-ecosystem": "frontend", "theme-colors": "frontend", "visual-consistency": "frontend", "ask-ux": "frontend",
  godot: "game", "game-design": "game",
  "mcp-server": "ai", okf: "ai", odsf: "ai",
  "no-slop": "writing", "to-story": "writing", autopilot: "writing", breadcrumbs: "writing", "fable-mode": "writing",
  "android-compose": "mobile",
  "tauri-stinky": "desktop",
  "comment-stinky": "quality", "test-stinky": "quality",
  "audit-actions": "security", "trust-card": "security",
};

// Domain gives the cover its series line. A permanent per-skill identity picks
// from one global pool of curated print palettes, so the shelf varies like a
// real publisher's list while each title remains recognizable across editions.
const LABEL = {
  frontend: "Frontend / UI", game: "Game", ai: "AI & Agents", writing: "Writing",
  mobile: "Mobile", desktop: "Desktop", quality: "Testing & Quality", security: "Security",
};

// Append new palettes. Reordering or inserting entries would change established
// identities because the permanent seed selects by index.
const PALETTES = [
  { bg: "#f1ece1", ink: "#1e3050", acc: ["#3a6ea8", "#e2703a", "#eec643"] },
  { bg: "#14304e", ink: "#f2ecdf", acc: ["#6fa8d8", "#e2703a", "#eec643"] },
  { bg: "#e7edf1", ink: "#232f43", acc: ["#2f6fae", "#c94f63", "#93b7d4"] },
  { bg: "#f4ead7", ink: "#46180f", acc: ["#bb4430", "#e29b34", "#2e6e60"] },
  { bg: "#2a1512", ink: "#f4ead7", acc: ["#e05a3a", "#e8a53f", "#7fa694"] },
  { bg: "#eee0cb", ink: "#33241c", acc: ["#c8552e", "#8c3d5c", "#dcae54"] },
  { bg: "#efedea", ink: "#28283a", acc: ["#5b5f97", "#8c98a6", "#d98f4e"] },
  { bg: "#232334", ink: "#eeedf3", acc: ["#9aa4e0", "#5b5f97", "#dfa055"] },
  { bg: "#e6e5ef", ink: "#32324a", acc: ["#6c6ea0", "#a473b8", "#4d8a8a"] },
  { bg: "#f6efdb", ink: "#3a3220", acc: ["#b3a054", "#7c5f36", "#41604a"] },
  { bg: "#333f2c", ink: "#f3eedd", acc: ["#c9b878", "#d78f4c", "#8ea88b"] },
  { bg: "#f0e6d4", ink: "#4a3a2a", acc: ["#a8763e", "#5d7052", "#c25e42"] },
  { bg: "#eef2e7", ink: "#1c3a28", acc: ["#2f8a55", "#f0b93b", "#3a6ea8"] },
  { bg: "#14341f", ink: "#eef2e4", acc: ["#63b884", "#e9c04a", "#7fb0d8"] },
  { bg: "#e2ecdd", ink: "#243b2c", acc: ["#4a9a68", "#d97e3e", "#8fbfa0"] },
  { bg: "#f0ebe2", ink: "#2c3540", acc: ["#3e7c8a", "#c8683a", "#d8b13f"] },
  { bg: "#1f2e33", ink: "#efeadf", acc: ["#6fb1bd", "#e08050", "#e2c05a"] },
  { bg: "#f2ece4", ink: "#3a2434", acc: ["#a44a7e", "#3e8a74", "#e0a23e"] },
  { bg: "#301f2c", ink: "#f2ebe2", acc: ["#cf7aab", "#5cb094", "#e6b04e"] },
  { bg: "#efedea", ink: "#1c1b21", acc: ["#45444e", "#c03b2d", "#b7b2a6"] },
  { bg: "#1b1a20", ink: "#eceae4", acc: ["#8e8a97", "#e05340", "#c8c2b4"] },
  // saturated grounds and off-family combinations, for spread across a shelf
  { bg: "#157f8d", ink: "#f4efe2", acc: ["#f2a93b", "#123c46", "#e2703a"] },
  { bg: "#e6dff0", ink: "#3a2f55", acc: ["#7b5ea7", "#e28f6a", "#f0c948"] },
  { bg: "#d9ecdf", ink: "#101812", acc: ["#2f8a55", "#e05340", "#f0c948"] },
  { bg: "#e3a92f", ink: "#221a08", acc: ["#f4ead7", "#a8431e", "#2e4a3f"] },
  { bg: "#dd5637", ink: "#f7ead9", acc: ["#7a1f0e", "#f0c948", "#3a6ea8"] },
  { bg: "#20242b", ink: "#eae6da", acc: ["#e0d84a", "#4a90d9", "#d95970"] },
  { bg: "#f5e9e2", ink: "#5a2a1e", acc: ["#c96f4a", "#8aa39b", "#3f3d56"] },
];

// Semantic colors are part of the cover theme too. `dark` is the contrast
// variant used when the default uncommon gray sits on a dark cover.
const RARITIES = {
  common: { key: "common", col: null, label: "COMMON" },
  uncommon: { key: "uncommon", col: "#8b95a1", dark: "#aab2bb", label: "UNCOMMON" },
  rare: { key: "rare", col: "#d4af37", label: "RARE" },
  mythic: { key: "mythic", col: "#e8743b", label: "MYTHIC" },
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
  if (signed && vouched) return RARITIES.mythic;
  if (signed || vouched) return RARITIES.rare;
  if (g.integrity === "STRONG" && (RANK[g.capability] || 0) >= 2) return RARITIES.uncommon;
  return RARITIES.common;
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

// ---------------------------------------------------------------- generative
// Deterministic PRNG seeded from the permanent visual identity.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = (rng, a, b) => a + rng() * (b - a);
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
function shuffle(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
// Overlap treatment: multiply reads as ink on paper, but turns to mud on a
// dark ground, so dark palettes get plain opaque overlaps instead.
const overlap = (pal, op = 0.9) => lum(pal.bg) < 0.5 ? ` opacity="0.96"` : ` style="mix-blend-mode:multiply" opacity="${op}"`;

// Closed organic blob: radial points with jitter, joined by Catmull-Rom beziers.
function blobPath(rng, cx, cy, r, k = 8) {
  const pts = [];
  for (let i = 0; i < k; i++) {
    const a = (i / k) * 2 * Math.PI;
    const rr = r * rnd(rng, 0.72, 1.24);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < k; i++) {
    const p0 = pts[(i - 1 + k) % k], p1 = pts[i], p2 = pts[(i + 1) % k], p3 = pts[(i + 2) % k];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

// Rectangle with hand-torn edges: jittered points along each side.
function tornRect(rng, w, h) {
  const j = Math.min(w, h) * 0.03 + 2;
  const pts = [];
  const edge = (x0, y0, x1, y1, n) => {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const nx = y1 - y0, ny = x0 - x1; // perpendicular
      const len = Math.hypot(nx, ny) || 1;
      const d = rnd(rng, -j, j);
      pts.push([x0 + (x1 - x0) * t + (nx / len) * d, y0 + (y1 - y0) * t + (ny / len) * d]);
    }
  };
  edge(0, 0, w, 0, 7); edge(w, 0, w, h, 5); edge(w, h, 0, h, 7); edge(0, h, 0, 0, 5);
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// Six composition styles. Each fills the full-bleed art zone (0,0,W,AH) and
// returns flat, print-like shapes in the palette. All randomness comes from rng.
function styleSun(rng, pal, W, AH) {
  const cx = rnd(rng, W * 0.32, W * 0.68), cy = rnd(rng, AH * 0.58, AH * 0.82);
  const R = rnd(rng, AH * 0.6, AH * 0.85);
  const ring = shuffle(rng, [pal.acc[0], pal.acc[1], pal.acc[2], pal.ink]);
  const n = 4 + Math.floor(rng() * 2);
  let s = `<rect width="${W}" height="${AH}" fill="${pal.bg}"/>`;
  for (let i = 0; i < n; i++)
    s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(R * (1 - i / n)).toFixed(1)}" fill="${ring[i % ring.length]}"/>`;
  if (rng() < 0.6) {
    const hy = AH * rnd(rng, 0.84, 0.93);
    s += `<rect x="0" y="${hy.toFixed(0)}" width="${W}" height="${(AH - hy + 2).toFixed(0)}" fill="${pal.ink}"/>`;
  }
  s += `<circle cx="${rnd(rng, W * 0.1, W * 0.9).toFixed(1)}" cy="${rnd(rng, AH * 0.08, AH * 0.3).toFixed(1)}" r="${rnd(rng, 8, 16).toFixed(1)}" fill="${pick(rng, pal.acc)}"/>`;
  return s;
}

function styleBlob(rng, pal, W, AH) {
  const cols = shuffle(rng, pal.acc);
  let s = `<rect width="${W}" height="${AH}" fill="${pal.bg}"/>`;
  s += `<path d="${blobPath(rng, rnd(rng, W * 0.38, W * 0.62), rnd(rng, AH * 0.42, AH * 0.58), rnd(rng, AH * 0.3, AH * 0.38))}" fill="${cols[0]}"/>`;
  s += `<path d="${blobPath(rng, rnd(rng, W * 0.28, W * 0.72), rnd(rng, AH * 0.3, AH * 0.7), rnd(rng, AH * 0.14, AH * 0.2), 7)}" fill="${cols[1]}"${overlap(pal, 0.85)}/>`;
  s += `<circle cx="${rnd(rng, W * 0.15, W * 0.85).toFixed(1)}" cy="${rnd(rng, AH * 0.12, AH * 0.85).toFixed(1)}" r="${rnd(rng, 40, 90).toFixed(1)}" fill="none" stroke="${pal.ink}" stroke-width="2.5"/>`;
  s += `<circle cx="${rnd(rng, W * 0.1, W * 0.9).toFixed(1)}" cy="${rnd(rng, AH * 0.1, AH * 0.9).toFixed(1)}" r="${rnd(rng, 7, 13).toFixed(1)}" fill="${pal.ink}"/>`;
  return s;
}

function styleWaves(rng, pal, W, AH) {
  const fx = rnd(rng, W * 0.25, W * 0.75), fy = rnd(rng, AH * 0.3, AH * 0.68);
  const spread = rnd(rng, 80, 150), amp = rnd(rng, 9, 20), wl = rnd(rng, 90, 190), ph = rnd(rng, 0, Math.PI * 2);
  let s = `<rect width="${W}" height="${AH}" fill="${pal.bg}"/>`;
  s += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${rnd(rng, spread, spread * 1.5).toFixed(1)}" fill="${pick(rng, pal.acc)}"/>`;
  for (let y = 22; y < AH - 8; y += 15) {
    const pts = [];
    for (let x = -8; x <= W + 8; x += 8) {
      const g = Math.exp(-(((y - fy) ** 2) / (2 * spread ** 2) + ((x - fx) ** 2) / (2 * (spread * 2.2) ** 2)));
      const yy = y + Math.sin((x / wl) * 2 * Math.PI + ph + y * 0.02) * amp * (0.2 + g * 2.4);
      pts.push(`${x},${yy.toFixed(1)}`);
    }
    s += `<polyline points="${pts.join(" ")}" fill="none" stroke="${pal.ink}" stroke-width="2"/>`;
  }
  return s;
}

function styleBauhaus(rng, pal, W, AH) {
  const cols = pick(rng, [3, 4]), rows = pick(rng, [3, 4]);
  const cw = W / cols, ch = AH / rows;
  const paint = [...pal.acc, pal.ink];
  let s = `<rect width="${W}" height="${AH}" fill="${pal.bg}"/>`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c * cw, y = r * ch;
    const cell = rng() < 0.28 ? pick(rng, paint) : pal.bg;
    if (cell !== pal.bg) s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cw + 0.5).toFixed(1)}" height="${(ch + 0.5).toFixed(1)}" fill="${cell}"/>`;
    let fg = pick(rng, paint);
    if (fg === cell) fg = paint.find((p) => p !== cell) || pal.ink;
    const kind = Math.floor(rng() * 6);
    const [X, Y, X2, Y2] = [x.toFixed(1), y.toFixed(1), (x + cw).toFixed(1), (y + ch).toFixed(1)];
    if (kind === 0) { // quarter circle from a random corner
      const q = Math.floor(rng() * 4);
      const d = [
        `M ${X} ${Y} L ${X2} ${Y} A ${cw.toFixed(1)} ${ch.toFixed(1)} 0 0 1 ${X} ${Y2} Z`,
        `M ${X2} ${Y} L ${X2} ${Y2} A ${cw.toFixed(1)} ${ch.toFixed(1)} 0 0 1 ${X} ${Y} Z`,
        `M ${X2} ${Y2} L ${X} ${Y2} A ${cw.toFixed(1)} ${ch.toFixed(1)} 0 0 1 ${X2} ${Y} Z`,
        `M ${X} ${Y2} L ${X} ${Y} A ${cw.toFixed(1)} ${ch.toFixed(1)} 0 0 1 ${X2} ${Y2} Z`,
      ][q];
      s += `<path d="${d}" fill="${fg}"/>`;
    } else if (kind === 1) { // half circle
      const up = rng() < 0.5;
      s += `<path d="M ${X} ${(y + ch / 2).toFixed(1)} A ${(cw / 2).toFixed(1)} ${(ch / 2).toFixed(1)} 0 0 ${up ? 1 : 0} ${X2} ${(y + ch / 2).toFixed(1)} Z" fill="${fg}"/>`;
    } else if (kind === 2) {
      s += `<circle cx="${(x + cw / 2).toFixed(1)}" cy="${(y + ch / 2).toFixed(1)}" r="${(Math.min(cw, ch) * rnd(rng, 0.24, 0.42)).toFixed(1)}" fill="${fg}"/>`;
    } else if (kind === 3) { // diagonal half
      const flip = rng() < 0.5;
      s += `<path d="M ${X} ${flip ? Y : Y2} L ${X2} ${Y} L ${X2} ${Y2} Z" fill="${fg}"/>`;
    } else if (kind === 4) { // bars
      for (let i = 0; i < 3; i++)
        s += `<rect x="${X}" y="${(y + ch * (0.14 + i * 0.3)).toFixed(1)}" width="${cw.toFixed(1)}" height="${(ch * 0.14).toFixed(1)}" fill="${fg}"/>`;
    } // kind 5: empty cell, breathing room
  }
  return s;
}

function styleCollage(rng, pal, W, AH) {
  const cols = shuffle(rng, pal.acc);
  let s = `<rect width="${W}" height="${AH}" fill="${pal.bg}"/>`;
  const n = 4 + Math.floor(rng() * 2);
  for (let i = 0; i < n; i++) {
    const w = rnd(rng, W * 0.22, W * 0.5), h = rnd(rng, AH * 0.2, AH * 0.5);
    const x = rnd(rng, -20, W - w * 0.6), y = rnd(rng, -20, AH - h * 0.7);
    const rot = rnd(rng, -14, 14);
    s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})"><polygon points="${tornRect(rng, w, h)}" fill="${cols[i % cols.length]}"${overlap(pal)}/></g>`;
  }
  // a patch of halftone dots
  const dx = rnd(rng, W * 0.1, W * 0.65), dy = rnd(rng, AH * 0.1, AH * 0.6);
  let dots = "";
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++)
    dots += `<circle cx="${(c * 13).toFixed(0)}" cy="${(r * 13).toFixed(0)}" r="2.6" fill="${pal.ink}"/>`;
  s += `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${rnd(rng, -10, 10).toFixed(1)})">${dots}</g>`;
  s += `<circle cx="${rnd(rng, W * 0.15, W * 0.85).toFixed(1)}" cy="${rnd(rng, AH * 0.15, AH * 0.8).toFixed(1)}" r="${rnd(rng, 46, 90).toFixed(1)}" fill="none" stroke="${pal.ink}" stroke-width="2"/>`;
  return s;
}

function styleBeams(rng, pal, W, AH) {
  const ang = rnd(rng, -32, 32);
  const paint = shuffle(rng, [...pal.acc, pal.ink]);
  let stripes = "";
  let x = -260, i = 0;
  while (x < W + 260) {
    const w = rnd(rng, 34, 120);
    if (rng() < 0.72) stripes += `<rect x="${x.toFixed(1)}" y="-260" width="${w.toFixed(1)}" height="${AH + 520}" fill="${paint[i++ % paint.length]}"${overlap(pal, 0.92)}/>`;
    x += w + rnd(rng, 0, 46);
  }
  let s = `<rect width="${W}" height="${AH}" fill="${pal.bg}"/>`;
  s += `<g transform="rotate(${ang.toFixed(1)} ${(W / 2).toFixed(0)} ${(AH / 2).toFixed(0)})">${stripes}</g>`;
  s += `<circle cx="${rnd(rng, W * 0.2, W * 0.8).toFixed(1)}" cy="${rnd(rng, AH * 0.2, AH * 0.75).toFixed(1)}" r="${rnd(rng, 40, 76).toFixed(1)}" fill="${pal.bg}" stroke="${pal.ink}" stroke-width="2.5"/>`;
  return s;
}

// These identity-bearing arrays are append-only for the same reason as palettes.
const STYLES = [styleSun, styleBlob, styleWaves, styleBauhaus, styleCollage, styleBeams];

// Digest hex as an ISBN-style barcode: bar and gap widths from the bytes.
function barcode(bytes, h, ink) {
  let x = 0;
  const bars = [];
  for (let i = 8; i < 30; i++) {
    const w = 1 + (bytes[i] & 3);
    bars.push(`<rect x="${x}" y="0" width="${w}" height="${h}" fill="${ink}"/>`);
    x += w + 2 + ((bytes[i] >> 4) & 1);
  }
  return { svg: bars.join(""), width: x - 2 };
}

// Three typographic voices: bookish serif, modernist sans, technical mono.
// `w` is the approximate uppercase glyph width in em, for sizing the title.
const FONTS = [
  { fam: "Georgia,'Times New Roman',serif", w: 0.74, ls: 2 },
  { fam: "'Helvetica Neue',Helvetica,Arial,sans-serif", w: 0.72, ls: 4 },
  { fam: "ui-monospace,SFMono-Regular,Menlo,monospace", w: 0.64, ls: 1 },
];
const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";

// ------------------------------------------------------------------ the cover
export function renderSvg(e, heroDataUri, profile) {
  const W = 672, H = 936, MID = W / 2;
  const label = LABEL[DOMAIN[e.skill] || "ai"];
  const bytes = digestBytes(e.target_digest);
  const visual = visualIdentity(e.skill, PALETTES.length, STYLES.length, FONTS.length);
  const identityBytes = visual.bytes;
  const rng = mulberry32(visual.seed);
  const pal = PALETTES[visual.paletteIndex];
  const dynamics = contentDynamics(profile);
  const dark = lum(pal.bg) < 0.5;
  const score = trustScore(e.grades), reach = reachableMax(e.grades, (e.capability || {}).model), rar = rarity(e.grades);

  // Structural picks come only from the permanent visual identity. Live
  // content can move the art within narrow bounds but cannot redesign it.
  const style = STYLES[visual.styleIndex];
  let layout = visual.layout; // 0 art-top, 1 art-below-title, 2 poster, 3 typographic
  if (heroDataUri && layout === 3) layout = 0;
  const font = FONTS[visual.fontIndex];
  const align = layout <= 1 && identityBytes[9] % 5 < 2 ? "left" : "center";
  const tx = align === "left" ? 64 : MID, anchor = align === "left" ? "start" : "middle";

  const words = String(e.skill).toUpperCase().split("-");
  const maxLen = Math.max(...words.map((w) => w.length));
  const n = words.length;
  const fit = (usable, cap) => Math.max(30, Math.min(cap, Math.floor((usable / maxLen - font.ls) / font.w)));

  const artAt = (y0, h) =>
    `<clipPath id="artc"><rect x="0" y="${y0}" width="${W}" height="${h}"/></clipPath>`
    + `<g clip-path="url(#artc)"><g transform="translate(0 ${y0})">`
    + `<g transform="translate(${(MID + dynamics.shiftX).toFixed(1)} ${(h / 2 + dynamics.shiftY).toFixed(1)}) rotate(${dynamics.rotate.toFixed(2)}) scale(${dynamics.scale.toFixed(4)}) translate(${-MID} ${(-h / 2).toFixed(1)})">`
    + (heroDataUri
      ? `<image x="0" y="0" width="${W}" height="${h}" href="${heroDataUri}" preserveAspectRatio="xMidYMid slice"/>`
      : style(rng, pal, W, h))
    + `</g></g></g>`;
  const seriesEl = (y) => `<text x="${tx}" y="${y}" text-anchor="${anchor}" font-size="14" letter-spacing="4" fill="${pal.ink}" opacity="0.75" font-family="${MONO}">${esc(label.toUpperCase())}</text>`;
  const titleEl = (y, fs) => words.map((w, i) =>
    `<text x="${tx}" y="${(y + i * fs * 1.06).toFixed(0)}" text-anchor="${anchor}" font-size="${fs}" font-weight="bold" letter-spacing="${font.ls}" fill="${pal.ink}" font-family="${font.fam}">${esc(w)}</text>`).join("");
  const tagEl = (y, chars = 56) => wrap(e.description, chars, 2).map((ln, i) =>
    `<text x="${tx}" y="${(y + i * 23).toFixed(0)}" text-anchor="${anchor}" font-size="17" font-style="italic" fill="${pal.ink}" opacity="0.72">${esc(ln)}</text>`).join("");

  let body = "";
  if (layout === 0) { // full-bleed art above, text block beneath
    const fs = fit(560, n === 1 ? 76 : 58);
    let y = 594;
    body = artAt(0, 552) + seriesEl(y);
    y += 22 + fs * 0.92;
    body += titleEl(y, fs);
    y += (n - 1) * fs * 1.06 + 34;
    body += tagEl(y);
  } else if (layout === 1) { // title banner on top, art beneath
    const fs = fit(560, n === 1 ? 72 : 56);
    let y = 108;
    body = seriesEl(y);
    y += 26 + fs * 0.92;
    body += titleEl(y, fs);
    y += (n - 1) * fs * 1.06 + 36;
    body += tagEl(y);
    const artTop = Math.round(y + 23 + 36);
    body += artAt(artTop, 800 - artTop);
  } else if (layout === 2) { // full-page poster, title on a floating panel
    const fs = fit(440, n === 1 ? 60 : 46);
    const pw = Math.min(600, Math.max(maxLen * (fs * font.w + font.ls), 44 * 8.2) + 76);
    const panelTop = Math.round(rnd(rng, 290, 400));
    let y = panelTop + 48;
    const seriesY = y;
    y += 26 + fs * 0.92;
    const titleY = y;
    y += (n - 1) * fs * 1.06 + 32;
    const tagY = y;
    const panelH = Math.round(tagY + 23 - panelTop + 40);
    body = artAt(0, 800)
      + `<rect x="${(MID - pw / 2).toFixed(0)}" y="${panelTop}" width="${pw.toFixed(0)}" height="${panelH}" fill="${pal.bg}"/>`
      + seriesEl(seriesY) + titleEl(titleY, fs) + tagEl(tagY, 44);
  } else { // typographic: the title is the art, with sparse seeded accents
    const fs = fit(560, n === 1 ? 112 : 82);
    const deco = Math.floor(rng() * 3);
    if (deco === 0) {
      // the title sits on this circle, so pick the accent the ink reads best on
      const disc = [...pal.acc].sort((a, b) => Math.abs(lum(b) - lum(pal.ink)) - Math.abs(lum(a) - lum(pal.ink)))[0];
      body += `<circle cx="${rnd(rng, MID - 90, MID + 90).toFixed(0)}" cy="${rnd(rng, 360, 470).toFixed(0)}" r="${rnd(rng, 170, 230).toFixed(0)}" fill="${disc}"${overlap(pal, 0.9)}/>`;
    } else if (deco === 1) {
      const bar = pick(rng, pal.acc);
      for (let i = 0; i < 5; i++)
        body += `<rect x="0" y="${76 + i * 34}" width="${W}" height="16" fill="${bar}"/>`;
      body += `<rect x="0" y="742" width="${W}" height="16" fill="${bar}"/>`;
    } else {
      const cx = pick(rng, [128, W - 128]), cy = rnd(rng, 150, 240);
      for (let i = 0; i < 3; i++)
        body += `<circle cx="${cx}" cy="${cy.toFixed(0)}" r="${60 + i * 34}" fill="none" stroke="${pal.ink}" stroke-width="2.5"/>`;
      body += `<circle cx="${cx}" cy="${cy.toFixed(0)}" r="14" fill="${pick(rng, pal.acc)}"/>`;
    }
    const first = 452 - ((n - 1) * fs * 1.06) / 2;
    body += seriesEl(Math.round(first - fs * 0.92 - 34)) + titleEl(Math.round(first), fs);
    body += tagEl(Math.round(first + (n - 1) * fs * 1.06 + 52));
  }

  // Colophon: six trust meters, score line, digest barcode. Book back matter.
  const rankOf = (L) => RANK[e.grades?.[L]] || 0;
  const layers = e.layers || Object.keys(e.grades || {});
  let meters = "";
  layers.forEach((L, i) => {
    const mx = 56 + i * 26;
    for (let sgm = 0; sgm < 3; sgm++)
      meters += `<rect x="${mx}" y="${886 - 7 - sgm * 9}" width="20" height="7" fill="${pal.ink}" opacity="${sgm < rankOf(L) ? 1 : 0.16}"/>`;
    meters += `<text x="${mx + 10}" y="904" text-anchor="middle" font-size="11" fill="${pal.ink}" opacity="0.7" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">${INITIAL[L] || "?"}</text>`;
  });
  const cap = e.capability || {};
  const capLine = cap.model === "epistemic"
    ? `knowledge · ${cap.injects_concepts ?? "?"} concepts`
    : `executable · ${cap.source === "declared" ? "declared" : "inferred"} manifest`;
  const tier = String(e.risk_tier || "").split("-").pop().toUpperCase();
  const rarCol = rar.col ? (dark && rar.dark ? rar.dark : rar.col) : pal.ink;
  const bc = barcode(bytes, 26, pal.ink);
  const shortDigest = (String(e.target_digest).split(":").pop() || "").slice(0, 12);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Georgia,'Times New Roman',serif" data-visual-key="${visual.key}" data-palette="${visual.paletteIndex}" data-style="${visual.styleIndex}" data-layout="${layout}" data-content-files="${profile.files}" data-content-words="${profile.words}" data-content-headings="${profile.headings}">
<defs>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${identityBytes[6]}" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0.55 0.55 0 0"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="${pal.bg}"/>
${body}
<text x="${MID}" y="832" text-anchor="middle" font-size="13" letter-spacing="1" fill="${pal.ink}" opacity="0.75" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">${esc(e.identity || "-")}</text>
<line x1="56" y1="850" x2="616" y2="850" stroke="${pal.ink}" stroke-width="1" opacity="0.35"/>
${meters}
<text x="${MID}" y="876" text-anchor="middle" font-size="15" letter-spacing="1" font-family="ui-monospace,SFMono-Regular,Menlo,monospace"><tspan fill="${rarCol}" font-weight="bold">${rar.label}</tspan><tspan fill="${pal.ink}"> · ${score}/${reach} · ${esc(tier)}</tspan></text>
<text x="${MID}" y="898" text-anchor="middle" font-size="12" fill="${pal.ink}" opacity="0.7" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">${esc(capLine)}</text>
<g transform="translate(${616 - bc.width} 858)">${bc.svg}</g>
<text x="616" y="900" text-anchor="end" font-size="10" fill="${pal.ink}" opacity="0.75" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">sha256 ${esc(shortDigest)}</text>
<text x="616" y="914" text-anchor="end" font-size="10" fill="${pal.ink}" opacity="0.75" font-family="ui-monospace,SFMono-Regular,Menlo,monospace">EXP ${esc(e.expires || "-")}</text>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${dynamics.grainOpacity.toFixed(3)}"/>
</svg>
`;
}

function main() {
// Positional args scope the run to those skills: only they are re-verified and
// re-rendered, and their cards.json entries are patched into the existing feed.
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const skills = [];
const scanOrder = []; // every skill with a CARD.md, in feed order
for (const bucket of buckets) {
  const base = `skills/${bucket}`;
  for (const name of readdirSync(base).sort()) {
    const dir = `${base}/${name}`;
    if (!existsSync(`${dir}/SKILL.md`)) continue;
    if (!existsSync(`${dir}/CARD.md`)) {
      console.warn(`skip ${name}: no CARD.md (run: python3 ${CARD} generate ${dir})`);
      continue;
    }
    scanOrder.push(name);
    if (only.length && !only.includes(name)) continue;
    const out = execFileSync("python3", [CARD, "verify", `${dir}/CARD.md`, "--bundle", dir, "--json"], { encoding: "utf8" });
    const hero = HERO_FILES.find((h) => existsSync(`${dir}/${h}`)) || null;
    const heroDataUri = hero
      ? `data:${HERO_MIME[hero.split(".").pop()]};base64,${readFileSync(`${dir}/${hero}`).toString("base64")}`
      : null;
    const verify = JSON.parse(out);
    const grades = verify.grades || {};
    const entry = {
      skill: name, bucket, domain: LABEL[DOMAIN[name] || "ai"], ...verify,
      trust_score: trustScore(grades), reachable: reachableMax(grades, (verify.capability || {}).model), rarity: rarity(grades).key,
      art: { svg: "CARD.svg", hero },
    };
    writeFileSync(`${dir}/CARD.svg`, renderSvg(entry, heroDataUri, contentProfile(dir)));
    skills.push(entry);
  }
}

if (only.length) {
  const missing = only.filter((n) => !skills.some((s) => s.skill === n));
  if (missing.length) {
    console.error(`no such skill (or no CARD.md): ${missing.join(", ")}`);
    process.exit(1);
  }
}

// Scoped run: patch the fresh entries into the existing feed instead of
// recomputing every skill. Order and membership still follow the disk scan,
// so a full rebuild produces the same feed shape.
let feed = skills;
if (only.length) {
  const existing = existsSync("cards.json") ? JSON.parse(readFileSync("cards.json", "utf8")).skills || [] : [];
  const byName = new Map(existing.map((s) => [s.skill, s]));
  for (const s of skills) byName.set(s.skill, s);
  feed = scanOrder.map((n) => byName.get(n)).filter(Boolean);
  const absent = scanOrder.filter((n) => !byName.has(n));
  if (absent.length) console.warn(`not in the feed yet (run a full 'pnpm cards' to add): ${absent.join(", ")}`);
}

const doc = { repo: "saschb2b/skills", card_version: "0.1", count: feed.length, skills: feed };
writeFileSync("cards.json", JSON.stringify(doc, null, 2) + "\n");
console.log(only.length
  ? `wrote cards.json (patched ${skills.map((s) => s.skill).join(", ")}; ${feed.length} entries) + ${skills.length} CARD.svg`
  : `wrote cards.json + ${skills.length} CARD.svg (${skills.filter((s) => s.art.hero).length} with hero art)`);

// --check (CI): fail if any card is stale vs its live bundle (integrity is a
// digest recompute, fully offline). The feed's byte freshness is not gated,
// since re-verifying a sigstore signature needs cosign (absent in CI), which
// would grade a signed card MEDIUM here and STRONG locally.
if (process.argv.includes("--check")) {
  const stale = skills.filter((s) => s.grades?.integrity !== "STRONG").map((s) => s.skill);
  if (stale.length) {
    console.error(`stale cards (integrity not STRONG; regenerate with 'card.py generate'): ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log("cards check: all integrity STRONG");
}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
