import { studio, whatsappCopy } from "@/content/site";

/** Digits-only WhatsApp number from the env (preferred) or site.ts, or null when not set yet. */
export function whatsappNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || studio.whatsappNumber || "";
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

/**
 * The one helper that builds every WhatsApp link. Without a number it opens WhatsApp in share
 * mode (https://wa.me/?text=...), so the composed message still works in the demo.
 */
export function waLink(message: string): string {
  const number = whatsappNumber();
  const text = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** The message templates live with the rest of the copy, in site.ts. */
export const waMessages = whatsappCopy;

/** "2027-02-14" becomes "14 February 2027". */
export function formatWeddingDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
