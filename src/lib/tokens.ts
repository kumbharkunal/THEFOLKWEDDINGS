/**
 * Palette for places that cannot read CSS custom properties: metadata, the Open Graph image, the
 * generated icons and the preloader canvas. Components style through the Tailwind tokens in
 * globals.css instead. Keep both in sync.
 */
export const palette = {
  maroon: "#370905",
  maroonDeep: "#250402",
  maroonRaised: "#4A1009",
  apricot: "#FCD895",
  apricotSoft: "#C9A97C",
  cream: "#FFF4E0",
  creamDeep: "#F4E1C1",
  gold: "#C8A165",
  shade: "#1C0402",
  kumkum: "#A3261C",
} as const;

/** "#C8A165" + 0.5 becomes "rgba(200, 161, 101, 0.5)", for canvas drawing. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha))})`;
}
