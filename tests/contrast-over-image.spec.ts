import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";
import { contextFor } from "./helpers";

/**
 * Text over the hero photograph, measured on real pixels: the copy is hidden, the hero is captured,
 * and the pixels under each line of text are sampled. The light end of that background (its 95th
 * percentile, so single bright specks of grain do not decide it) must still give 4.5:1 against the
 * text, or 3:1 for the large title. The text colour is read from the page; where a line mixes
 * colours (the apricot "love" among cream words) the darker one counts. Run this again whenever a
 * hero photo or its scrim in src/content/images.ts changes.
 */

function luminance([r, g, b]: readonly number[]): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

interface Box {
  name: string;
  minimum: number;
  x: number;
  y: number;
  width: number;
  height: number;
  /** The darkest text colour in the element, as [r, g, b]. */
  rgb: number[];
}

async function measure(page: Page): Promise<{ name: string; ratio: number; minimum: number }[]> {
  const boxes: Box[] = await page.evaluate(() => {
    const targets: [string, string, number][] = [
      ["eyebrow", "[data-hero-eyebrow]", 4.5],
      ["title", "[data-hero-title]", 3],
      ["sub", "[data-hero-sub]", 4.5],
      ["readout", "[data-hero-readout] p", 4.5],
    ];
    const channel = (value: number) => {
      const c = value / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const lum = ([r, g, b]: number[]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    const darkestText = (element: Element) =>
      [element, ...Array.from(element.querySelectorAll("*"))]
        .filter((node) =>
          Array.from(node.childNodes).some((child) => child.nodeType === Node.TEXT_NODE && child.textContent?.trim()),
        )
        .map((node) => (getComputedStyle(node).color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number))
        .reduce((darkest, rgb) => (lum(rgb) < lum(darkest) ? rgb : darkest), [255, 255, 255]);
    return targets.flatMap(([name, selector, minimum]) => {
      const element = document.querySelector(selector);
      if (!element) return [];
      const rgb = darkestText(element);
      // Tight boxes around the actual text lines, not the whole block.
      const range = document.createRange();
      range.selectNodeContents(element);
      return Array.from(range.getClientRects())
        .filter((rect) => rect.width > 2 && rect.height > 2)
        .map((rect) => ({ name, minimum, x: rect.x, y: rect.y, width: rect.width, height: rect.height, rgb }));
    });
  });

  await page.addStyleTag({
    content: "[data-hero-copy] *, [data-hero-readout] *, [data-hero-badge-wrap], .grain { color: transparent !important; text-decoration-color: transparent !important; visibility: hidden !important; }",
  });
  await page.waitForTimeout(150);
  const shot = await page.screenshot();
  const { data, info } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });

  const worst = new Map<string, { ratio: number; minimum: number }>();
  for (const box of boxes) {
    const samples: number[] = [];
    const x0 = Math.max(0, Math.floor(box.x));
    const y0 = Math.max(0, Math.floor(box.y));
    const x1 = Math.min(info.width, Math.ceil(box.x + box.width));
    const y1 = Math.min(info.height, Math.ceil(box.y + box.height));
    for (let y = y0; y < y1; y += 1) {
      for (let x = x0; x < x1; x += 1) {
        const index = (y * info.width + x) * info.channels;
        samples.push(luminance([data[index], data[index + 1], data[index + 2]]));
      }
    }
    if (samples.length === 0) continue;
    samples.sort((a, b) => a - b);
    const light = samples[Math.min(samples.length - 1, Math.floor(samples.length * 0.95))];
    const ratio = contrast(luminance(box.rgb), light);
    const previous = worst.get(box.name);
    if (!previous || ratio < previous.ratio) worst.set(box.name, { ratio, minimum: box.minimum });
  }
  return Array.from(worst, ([name, value]) => ({ name, ...value }));
}

test.describe("contrast over the hero photograph", () => {
  test.skip(({ browserName }) => browserName !== "chromium");

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    test(`text stays legible at ${width}px`, async ({ browser }) => {
      // Reduced motion shows the final, static composition straight away.
      const context = await contextFor(browser, width, { reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto("/", { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      const results = await measure(page);
      console.log(`[contrast ${width}px] ${results.map((r) => `${r.name} ${r.ratio.toFixed(2)}`).join(", ")}`);
      for (const result of results) {
        expect(result.ratio, `${result.name}: ${result.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(result.minimum);
      }
      await context.close();
    });
  }
});
