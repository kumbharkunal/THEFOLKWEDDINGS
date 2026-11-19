/**
 * Image manifest. Files live in /images at the project root and are imported statically, so Next
 * generates width, height and blur placeholders. Replace a photo by saving a file with the same
 * name (see IMAGES.md); if the new photo shows something different, update its alt text here.
 *
 * EXIF lines are decorative (the generated photos have no real camera data). Swap in the real
 * values when the studio's own photographs arrive.
 */
import type { StaticImageData } from "next/image";
import behindTheLens from "@images/behind-the-lens.webp";
import ctaSilk from "@images/cta-silk.webp";
import detailPaithani from "@images/detail-paithani.webp";
import detailRings from "@images/detail-rings.webp";
import heroDesktop from "@images/hero-desktop.webp";
import heroMobile from "@images/hero-mobile.webp";
import storyAntarpat from "@images/story-antarpat.webp";
import storyHaldi from "@images/story-haldi.webp";
import storyMehendi from "@images/story-mehendi.webp";
import storyMonsoon from "@images/story-monsoon.webp";
import storyNath from "@images/story-nath.webp";
import storySangeet from "@images/story-sangeet.webp";

export interface Exif {
  lens: string;
  aperture: string;
  shutter: string;
  iso: number;
}

export interface Photo {
  src: StaticImageData;
  /** Empty only for purely decorative backgrounds. */
  alt: string;
  title: string;
  exif: Exif;
  /** Focal point in percent; drives object-position so subjects are never cropped out. */
  focal: { x: number; y: number };
  /**
   * Ink scrim strengths (0 to 1) for text laid over the photo: top band, bottom band and, on wide
   * screens, a side band behind the left-aligned lines. Tune them with
   * tests/contrast-over-image.spec.ts whenever the photo changes (as light as the test allows).
   */
  scrim?: { top: number; bottom: number; side?: number };
}

export const photos = {
  heroDesktop: {
    src: heroDesktop,
    alt: "A bride in a Paithani saree and her groom walk hand in hand through a temple courtyard at golden hour.",
    title: "Golden hour",
    exif: { lens: "85mm", aperture: "f/1.8", shutter: "1/400", iso: 200 },
    focal: { x: 70, y: 45 },
    scrim: { top: 0.42, bottom: 0.54, side: 0.35 },
  },
  heroMobile: {
    src: heroMobile,
    alt: "A bride in a Paithani saree and her groom walk hand in hand through a temple courtyard at golden hour.",
    title: "Golden hour",
    exif: { lens: "85mm", aperture: "f/1.8", shutter: "1/400", iso: 200 },
    focal: { x: 50, y: 58 },
    scrim: { top: 0.56, bottom: 0.6 },
  },
  storyHaldi: {
    src: storyHaldi,
    alt: "A laughing bride as relatives smear turmeric on her cheeks at the haldi.",
    title: "Haldi candids",
    exif: { lens: "35mm", aperture: "f/2", shutter: "1/500", iso: 200 },
    focal: { x: 50, y: 40 },
  },
  storyMonsoon: {
    src: storyMonsoon,
    alt: "A couple on old fort walls above misty green hills and waterfalls.",
    title: "Monsoon on the fort",
    exif: { lens: "24mm", aperture: "f/4", shutter: "1/250", iso: 400 },
    focal: { x: 50, y: 50 },
  },
  storyAntarpat: {
    src: storyAntarpat,
    alt: "A bride looks over a saffron antarpat held between her and the groom as petals fall.",
    title: "Before the antarpat falls",
    exif: { lens: "85mm", aperture: "f/1.8", shutter: "1/320", iso: 640 },
    focal: { x: 50, y: 42 },
  },
  storyMehendi: {
    src: storyMehendi,
    alt: "A bride's mehendi hands, drawn with peacocks, hold a marigold on a silk saree.",
    title: "Mehendi and marigold",
    exif: { lens: "50mm", aperture: "f/2.2", shutter: "1/400", iso: 320 },
    focal: { x: 50, y: 50 },
  },
  storySangeet: {
    src: storySangeet,
    alt: "A groom twirls the bride under string lights while the family claps at the sangeet.",
    title: "Sangeet night",
    exif: { lens: "35mm", aperture: "f/1.4", shutter: "1/160", iso: 2000 },
    focal: { x: 50, y: 45 },
  },
  storyNath: {
    src: storyNath,
    alt: "A groom gently touches the bride's nath as their foreheads meet, both smiling.",
    title: "A quiet minute",
    exif: { lens: "85mm", aperture: "f/1.6", shutter: "1/250", iso: 500 },
    focal: { x: 50, y: 35 },
  },
  behindTheLens: {
    src: behindTheLens,
    alt: "A photographer frames the ceremony at the mandap, lit by brass lamps and marigolds.",
    title: "Behind the lens",
    exif: { lens: "50mm", aperture: "f/2", shutter: "1/200", iso: 400 },
    focal: { x: 50, y: 40 },
  },
  detailRings: {
    src: detailRings,
    alt: "Two wedding rings on turmeric rice in a brass plate, with marigolds, kumkum and a lamp.",
    title: "The rings",
    exif: { lens: "100mm", aperture: "f/2.8", shutter: "1/200", iso: 400 },
    focal: { x: 50, y: 50 },
  },
  detailPaithani: {
    src: detailPaithani,
    alt: "Close-up of a Paithani silk border with a woven peacock motif.",
    title: "Paithani",
    exif: { lens: "100mm", aperture: "f/4", shutter: "1/160", iso: 320 },
    focal: { x: 50, y: 50 },
  },
  ctaSilk: {
    src: ctaSilk,
    alt: "",
    title: "Silk",
    exif: { lens: "100mm", aperture: "f/5.6", shutter: "1/125", iso: 200 },
    focal: { x: 50, y: 50 },
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export function getPhoto(key: PhotoKey): Photo {
  return photos[key];
}

export function objectPosition(photo: Photo): string {
  return `${photo.focal.x}% ${photo.focal.y}%`;
}
