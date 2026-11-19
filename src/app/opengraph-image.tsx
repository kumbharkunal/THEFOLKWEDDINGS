import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { CSSProperties } from "react";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { photos } from "@/content/images";
import { hero, seo } from "@/content/site";
import { palette, withAlpha } from "@/lib/tokens";

export const alt = seo.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const PLACEHOLDER_MARK = "folk-placeholder";
const root = process.cwd();
const font = (file: string) => readFile(join(root, "src/fonts/vendor", file));

// Read once at build time. Satori takes TTF (not WOFF2) and cannot decode WebP, so the photo is
// converted to JPEG here, cropped around its focal point; the logo lettering is resized to PNG.
const [zodiakLight, zodiakLightItalic, dmMono] = await Promise.all([
  font("Zodiak-Light.ttf"),
  font("Zodiak-LightItalic.ttf"),
  readFile(join(root, "scripts/assets/DMMono-Regular.ttf")),
]);

const LOGO_WIDTH = 236;
const logoPng = await sharp(join(root, "src/assets/brand/logo-wordmark.png"))
  .resize({ width: LOGO_WIDTH, kernel: "lanczos3" })
  .png()
  .toBuffer();
const logoHeight = (await sharp(logoPng).metadata()).height ?? 120;
const logo = `data:image/png;base64,${logoPng.toString("base64")}`;

/**
 * The hero photograph (a static path, so only this file is traced into the server bundle).
 * OG_IMAGE_SOURCE, optional and relative to the project, previews the card with another photo at
 * build time; it is excluded from tracing on purpose.
 */
const override = process.env.OG_IMAGE_SOURCE;
const source = override
  ? resolve(/*turbopackIgnore: true*/ root, override)
  : join(process.cwd(), "images", "hero-desktop.webp");

async function heroPhoto(): Promise<string | null> {
  const file = source;
  const meta = await sharp(file).metadata();
  // While the hero is a placeholder the card is typographic, so the preview never shows one.
  if (!meta.width || !meta.height || meta.exif?.includes(PLACEHOLDER_MARK)) return null;
  const { width, height } = size;
  const scale = Math.max(width / meta.width, height / meta.height);
  const resizedWidth = Math.round(meta.width * scale);
  const resizedHeight = Math.round(meta.height * scale);
  const { x, y } = photos.heroDesktop.focal;
  const left = Math.min(Math.max(Math.round((resizedWidth * x) / 100 - width / 2), 0), resizedWidth - width);
  const top = Math.min(Math.max(Math.round((resizedHeight * y) / 100 - height / 2), 0), resizedHeight - height);
  const jpeg = await sharp(file)
    .resize(resizedWidth, resizedHeight)
    .extract({ left, top, width, height })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

const photo = await heroPhoto();

function CropMark({ corner, color }: { corner: "tl" | "tr" | "bl" | "br"; color: string }) {
  const edge = 32;
  const style: CSSProperties = {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    ...(corner.startsWith("t") ? { top: edge, borderTopWidth: 1.5 } : { bottom: edge, borderBottomWidth: 1.5 }),
    ...(corner.endsWith("l") ? { left: edge, borderLeftWidth: 1.5 } : { right: edge, borderRightWidth: 1.5 }),
  };
  return <div style={style} />;
}

/**
 * Link preview card (1200 x 630, JPEG so WhatsApp shows it). With the hero photograph: the photo
 * under a warm shade scrim, the logo's lettering and the headline in cream with "love" in apricot.
 * Without it: the same type on the logo's maroon inside a gold frame.
 */
export default async function OpenGraphImage() {
  const onPhoto = photo !== null;
  const text = onPhoto ? palette.cream : palette.apricot;
  const soft = onPhoto ? withAlpha(palette.cream, 0.86) : palette.apricotSoft;
  const mark = onPhoto ? withAlpha(palette.cream, 0.7) : palette.gold;

  const card = new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: palette.maroon,
          color: text,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={size.width}
            height={size.height}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        ) : null}
        {onPhoto ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: `linear-gradient(90deg, ${withAlpha(palette.shade, 0.84)} 0%, ${withAlpha(palette.shade, 0.56)} 50%, ${withAlpha(palette.shade, 0.14)} 80%, ${withAlpha(palette.shade, 0)} 100%)`,
            }}
          />
        ) : null}
        {onPhoto ? (
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              left: 0,
              height: 360,
              backgroundImage: `linear-gradient(0deg, ${withAlpha(palette.shade, 0.5)} 0%, ${withAlpha(palette.shade, 0)} 100%)`,
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              bottom: 18,
              left: 18,
              border: `1px solid ${withAlpha(palette.gold, 0.55)}`,
            }}
          />
        )}
        <CropMark corner="tl" color={mark} />
        <CropMark corner="tr" color={mark} />
        <CropMark corner="bl" color={mark} />
        <CropMark corner="br" color={mark} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={LOGO_WIDTH} height={logoHeight} style={{ position: "absolute", top: 70, left: 78 }} />

        <div
          style={{
            position: "absolute",
            left: 84,
            right: 84,
            bottom: 84,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 20, letterSpacing: 1.2, color: soft }}>
            {seo.ogEyebrow}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 22,
              fontFamily: "Zodiak",
              fontWeight: 300,
              // Smaller over a photograph so the lines end before the couple (focal point near 70%).
              fontSize: onPhoto ? 78 : 90,
              lineHeight: 0.98,
              letterSpacing: onPhoto ? -2.2 : -2.6,
            }}
          >
            {hero.title.map((line, lineIndex) => (
              <div key={lineIndex} style={{ display: "flex", whiteSpace: "pre" }}>
                {line.map((run, runIndex) => (
                  <span key={runIndex} style={run.italic ? { fontStyle: "italic", color: palette.apricot } : undefined}>
                    {run.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Zodiak", data: zodiakLight, weight: 300, style: "normal" },
        { name: "Zodiak", data: zodiakLightItalic, weight: 300, style: "italic" },
        { name: "DM Mono", data: dmMono, weight: 400, style: "normal" },
      ],
    },
  );

  const png = Buffer.from(await card.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": contentType } });
}
