// `npm run brand`: cuts the studio's logo (brand/logo-source.png, 1080 x 1080 on textured maroon)
// into transparent layers for the site. Run once when the logo changes; the outputs are committed.
//
//   src/assets/brand/logo-wordmark.png   "THE / Folk / WEDDINGS"
//   src/assets/brand/logo-tagline.png    "Stories of love, people & culture"
//   src/assets/brand/logo-elephant.png   the caparisoned elephant
//   src/assets/brand/logo-lockup.png     all three, as drawn
//
// The background is modelled per row from the empty side margins (it carries a soft vignette and
// a linen texture). Lettering is keyed by its exact anti-aliasing coverage (a pixel is a linear mix
// of lettering and background), so the counters of letters stay open. The elephant has many
// colours, so it is keyed by colour distance and its interior holes are filled, which keeps it
// solid wherever it sits (photographs included).
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ROOT } from "./image-slots.mjs";

const SOURCE = path.join(ROOT, "brand", "logo-source.png");
const OUT_DIR = path.join(ROOT, "src", "assets", "brand");
const PAD = 6;

// Bands measured from the source's row profile (rows with foreground, inclusive).
const BANDS = {
  wordmark: { y0: 115, y1: 469, x0: 202, x1: 910, kind: "lettering" },
  tagline: { y0: 498, y1: 534, x0: 278, x1: 815, kind: "lettering" },
  elephant: { y0: 540, y1: 965, x0: 298, x1: 820, kind: "illustration" },
};
// The brand apricot (#FCD895): edge pixels take this colour, so thin strokes never pick up texture.
const LETTER = [252, 216, 149];
const NOISE = 7; // background texture amplitude (colour distance)
const ILLUSTRATION_RAMP = [14, 46]; // colour distance: transparent below, opaque above

const { data, info } = await sharp(SOURCE).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const at = (x, y) => (y * W + x) * 3;

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[sorted.length >> 1];
};
// Per row: the median of the left and right margins, mixed linearly across the width.
const marginBg = [];
for (let y = 0; y < H; y += 1) {
  const left = [[], [], []];
  const right = [[], [], []];
  for (let x = 10; x < 140; x += 1) for (let c = 0; c < 3; c += 1) left[c].push(data[at(x, y) + c]);
  for (let x = 940; x < 1070; x += 1) for (let c = 0; c < 3; c += 1) right[c].push(data[at(x, y) + c]);
  marginBg.push([left.map(median), right.map(median)]);
}
const background = (x, y) => {
  const [left, right] = marginBg[y];
  const t = x / (W - 1);
  return [0, 1, 2].map((c) => left[c] * (1 - t) + right[c] * t);
};
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const smoothstep = (edge0, edge1, value) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

// Full-strength lettering distance, measured on the solid strokes of WEDDINGS (95th percentile).
const samples = [];
for (let y = 380; y < 460; y += 1) {
  for (let x = 210; x < 900; x += 1) {
    const p = [data[at(x, y)], data[at(x, y) + 1], data[at(x, y) + 2]];
    samples.push(distance(p, background(x, y)));
  }
}
samples.sort((a, b) => a - b);
const fullLetter = samples[Math.floor(samples.length * 0.95)];

function keyBand({ y0, y1, x0, x1, kind }) {
  const width = x1 - x0 + 1 + PAD * 2;
  const height = y1 - y0 + 1 + PAD * 2;
  const rgba = Buffer.alloc(width * height * 4);
  const alpha = new Float32Array(width * height);

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const x = x0 - PAD + col;
      const y = y0 - PAD + row;
      const i = row * width + col;
      // The padding stays empty: neighbouring bands (the tagline's descenders above the elephant)
      // must never leak into a layer.
      if (x < x0 || y < y0 || x > x1 || y > y1) continue;
      const p = [data[at(x, y)], data[at(x, y) + 1], data[at(x, y) + 2]];
      const b = background(x, y);
      const d = distance(p, b);
      const a =
        kind === "lettering"
          ? Math.min(1, Math.max(0, (d - NOISE) / (fullLetter - NOISE)))
          : smoothstep(ILLUSTRATION_RAMP[0], ILLUSTRATION_RAMP[1], d);
      alpha[i] = a;
      // Un-premultiply against the background; faint edge pixels lean on the brand apricot.
      for (let c = 0; c < 3; c += 1) {
        const straight = a > 0.02 ? (p[c] - (1 - a) * b[c]) / a : p[c];
        const value = kind === "lettering" ? LETTER[c] * (1 - a) + straight * a : straight;
        rgba[i * 4 + c] = Math.round(Math.min(255, Math.max(0, value)));
      }
    }
  }

  if (kind === "illustration") {
    // Fill interior holes: anything transparent that cannot be reached from the edge of the band
    // is part of the drawing (dark shading), not background.
    const outside = new Uint8Array(width * height);
    const queue = [];
    const push = (col, row) => {
      if (col < 0 || row < 0 || col >= width || row >= height) return;
      const i = row * width + col;
      if (outside[i] || alpha[i] >= 0.5) return;
      outside[i] = 1;
      queue.push(i);
    };
    for (let col = 0; col < width; col += 1) {
      push(col, 0);
      push(col, height - 1);
    }
    for (let row = 0; row < height; row += 1) {
      push(0, row);
      push(width - 1, row);
    }
    while (queue.length > 0) {
      const i = queue.pop();
      const col = i % width;
      const row = (i - col) / width;
      push(col + 1, row);
      push(col - 1, row);
      push(col, row + 1);
      push(col, row - 1);
    }
    for (let i = 0; i < alpha.length; i += 1) {
      if (outside[i] || alpha[i] >= 0.5) continue;
      const col = i % width;
      const row = (i - col) / width;
      const x = x0 - PAD + col;
      const y = y0 - PAD + row;
      alpha[i] = 1;
      for (let c = 0; c < 3; c += 1) rgba[i * 4 + c] = data[at(x, y) + c];
    }
  }

  for (let i = 0; i < alpha.length; i += 1) rgba[i * 4 + 3] = Math.round(alpha[i] * 255);
  return { rgba, width, height };
}

await mkdir(OUT_DIR, { recursive: true });
const layers = {};
for (const [name, band] of Object.entries(BANDS)) {
  const { rgba, width, height } = keyBand(band);
  layers[name] = { rgba, width, height, band };
  const file = path.join(OUT_DIR, `logo-${name}.png`);
  await sharp(rgba, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(file);
  console.log(`[brand] ${path.relative(ROOT, file)} ${width} x ${height}`);
}

// The lockup: the three layers at their original positions, on a transparent canvas.
const top = BANDS.wordmark.y0 - PAD;
const left = BANDS.wordmark.x0 - PAD;
const lockupWidth = BANDS.wordmark.x1 - BANDS.wordmark.x0 + 1 + PAD * 2;
const lockupHeight = BANDS.elephant.y1 - BANDS.wordmark.y0 + 1 + PAD * 2;
const composites = Object.values(layers).map(({ rgba, width, height, band }) => ({
  input: rgba,
  raw: { width, height, channels: 4 },
  left: band.x0 - PAD - left,
  top: band.y0 - PAD - top,
}));
const lockup = path.join(OUT_DIR, "logo-lockup.png");
await sharp({ create: { width: lockupWidth, height: lockupHeight, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(composites)
  .png({ compressionLevel: 9 })
  .toFile(lockup);
console.log(`[brand] ${path.relative(ROOT, lockup)} ${lockupWidth} x ${lockupHeight} (lettering at full strength: ${fullLetter.toFixed(0)})`);
