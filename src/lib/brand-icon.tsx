import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { palette } from "@/lib/tokens";

/** The logo's elephant (transparent, 535 x 438), cut from the studio's logo by scripts/make-brand.mjs. */
const ELEPHANT = join(process.cwd(), "src/assets/brand/logo-elephant.png");

/**
 * The elephant on the logo's maroon. `rounded` gives the browser-tab favicon its own corners;
 * touch and manifest icons are full-bleed squares (platforms apply their own mask), with the
 * elephant inside the maskable safe zone. The artwork is resized by sharp first, so small icons
 * stay crisp.
 */
export async function brandIcon(dimension: number, { rounded }: { rounded: boolean }) {
  const inner = Math.round(dimension * (rounded ? 0.92 : 0.7));
  const png = await sharp(ELEPHANT).resize({ width: inner, kernel: "lanczos3" }).png().toBuffer();
  const { height = inner } = await sharp(png).metadata();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: palette.maroon,
          borderRadius: rounded ? Math.round(dimension * 0.22) : 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${png.toString("base64")}`} width={inner} height={height} alt="" />
      </div>
    ),
    { width: dimension, height: dimension },
  );
}
