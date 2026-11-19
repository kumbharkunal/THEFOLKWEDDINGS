/**
 * All homepage copy and studio facts live here. Edit this file to change wording or fill in
 * details; components never hard-code copy.
 *
 * Voice: warm, short, plain. British and Indian English spelling. No em or en dashes.
 * Facts: nothing invented. Unknowns are null and their UI stays hidden until a value is set.
 * Contact details come from the studio's own public profiles (the Instagram and Threads bios, the
 * sign-off on every post and the WhatsApp Business profile); CLIENT_CHECKLIST.md lists what the
 * studio still has to confirm.
 */
import type { PhotoKey } from "./images";

export type Placeholder<T> = T | null;

/** A run of text; `italic` marks emotional or brand words, `term` marks ritual words. */
export interface TextRun {
  text: string;
  italic?: boolean;
  term?: boolean;
}

/* Studio details. */

export const studio = {
  name: "The Folk Weddings",
  /** The intended domain. It does not resolve yet (see CLIENT_CHECKLIST.md). */
  domain: "thefolkweddings.in",
  /** The photographer behind the studio, shown in Behind the lens. */
  ownerName: "Praveen Pk" as Placeholder<string>,
  /** The name on the studio's films and WhatsApp Business profile, for the structured data. */
  alternateName: "Praveen Pk Photography & Films" as Placeholder<string>,
  /** International format for display and tel: links. */
  phone: "+91 73381 35246" as Placeholder<string>,
  /** Digits with country code. NEXT_PUBLIC_WHATSAPP_NUMBER takes priority when set. */
  whatsappNumber: "917338135246" as Placeholder<string>,
  email: "praveenpkphotography@gmail.com" as Placeholder<string>,
  /** Street address. Only the city is public, so the site names the city alone. */
  address: null as Placeholder<string>,
  yearsActive: null as Placeholder<number>,
  weddingsShot: null as Placeholder<number>,
  citiesCovered: null as Placeholder<number>,
  developerCredit: null as Placeholder<{ name: string; url: Placeholder<string> }>,
  serviceArea: "Based in Belgaum. Working across Goa and Bangalore, and available worldwide.",
} as const;

/* The studio name as set in the nav, the menu and the footer, with "Folk" in italic after the
   script lettering of the logo. */
export const brand = {
  wordmark: [{ text: "The " }, { text: "Folk", italic: true }, { text: " Weddings" }] as TextRun[],
} as const;

/**
 * Ratings and awards appear only when `show` is true and every value is set. None were found for
 * the studio, so this stays empty until the studio decides what, if anything, to cite.
 */
export const trust = {
  show: false as boolean,
  platform: null as Placeholder<string>,
  url: null as Placeholder<string>,
  rating: null as Placeholder<number>,
  reviewCount: null as Placeholder<number>,
  checkedOn: null as Placeholder<string>,
} as const;

export const socials = {
  instagram: {
    handle: "@thefolkweddings.in",
    url: "https://www.instagram.com/thefolkweddings.in/",
    directMessage: "https://ig.me/m/thefolkweddings.in",
  },
  threads: {
    handle: "@thefolkweddings.in",
    url: "https://www.threads.com/@thefolkweddings.in",
  },
} as const;

/* Navigation */

export const nav = {
  links: [
    { id: "stories", label: "Stories" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "process", label: "Process" },
    { id: "reviews", label: "Reviews" },
  ],
  cta: "Book a date",
  menuOpen: "Menu",
  menuClose: "Close",
  menuTitle: "Menu",
  skipLink: "Skip to content",
  homeLabel: "The Folk Weddings, back to the top",
} as const;

/* Hero */

export const hero = {
  eyebrow: "Wedding photography & films · Belgaum, Goa, Bangalore",
  title: [
    [{ text: "Stories of " }, { text: "love", italic: true }, { text: "," }],
    [{ text: "people & culture." }],
  ] as TextRun[][],
  sub: "Real moments, raw emotions and artistic frames. Wedding photographs and films that keep your rituals, your people and your culture exactly as they felt.",
  primaryCta: "Check your date",
  secondaryCta: "See the stories",
  badge: "Book your date · The Folk Weddings · ",
  badgeLabel: "Book your date on WhatsApp",
  scrollCue: "Scroll",
  print: { frame: "Fr. 001", title: "Golden hour" },
} as const;

/* Services marquee: the same services as the list below, so it is hidden from screen readers. */

export const marquee = [
  "Weddings",
  "Wedding films",
  "Pre-wedding",
  "Ring ceremony",
  "Haldi & mehendi",
  "Portraits",
] as const;

/* The name. Presented as a reading of the name and the emblem, never as their origin
   (see CLIENT_CHECKLIST.md). */

export const manifesto = {
  notes: [
    { term: "folk", meaning: "of the people, their rituals and their songs" },
    { term: "the elephant", meaning: "dressed for the procession" },
  ],
  paragraph: [
    { text: "Every wedding carries a culture of its own. The chants at the " },
    { text: "muhurtam", term: true },
    { text: ". Turmeric that finds every cheek at the " },
    { text: "haldi", term: true },
    {
      text: ". A grandmother who knows each ritual by heart. The Folk Weddings keeps all of it: the love, the people and the culture they carry.",
    },
  ] as TextRun[],
} as const;

/* Selected stories. Titles are moments, not couples. */

export interface Story {
  id: string;
  title: string;
  caption: string;
  photo: PhotoKey;
}

export const stories = {
  title: "Selected stories",
  viewLabel: "View",
  openLabel: (title: string) => `Open ${title} full screen`,
  dotLabel: (index: number, total: number) => `Go to story ${index} of ${total}`,
  viewer: {
    close: "Close",
    previous: "Previous story",
    next: "Next story",
  },
  items: [
    {
      id: "haldi-candids",
      title: "Haldi candids",
      caption: "Turmeric on every cheek and laughter nobody planned.",
      photo: "storyHaldi",
    },
    {
      id: "monsoon-fort",
      title: "Monsoon on the fort",
      caption: "A pre-wedding walk along old fort walls, wrapped in cloud.",
      photo: "storyMonsoon",
    },
    {
      id: "antarpat",
      title: "Before the antarpat falls",
      caption: "A silk cloth held between two people, moments before it is lowered.",
      photo: "storyAntarpat",
    },
    {
      id: "mehendi-marigold",
      title: "Mehendi and marigold",
      caption: "Peacocks drawn in henna, and a marigold held like a promise.",
      photo: "storyMehendi",
    },
    {
      id: "sangeet-night",
      title: "Sangeet night",
      caption: "One twirl under the lights while the whole family cheers.",
      photo: "storySangeet",
    },
    {
      id: "a-quiet-minute",
      title: "A quiet minute",
      caption: "Forehead to forehead, moments before the rituals begin.",
      photo: "storyNath",
    },
  ] as Story[],
} as const;

/* What we capture */

export interface Service {
  id: string;
  title: string;
  description: string;
  photo: PhotoKey;
  /** Completes "We'd like to know more about ..." in the WhatsApp message. */
  enquiry: string;
  /** True when the studio's own posts show it; false until the studio confirms it. */
  confirmed: boolean;
}

export const services = {
  title: "What we capture",
  askLabel: (title: string) => `Ask about ${title.toLowerCase()}`,
  rowLabel: (title: string) => `${title}: ask on WhatsApp (opens in a new tab)`,
  items: [
    {
      id: "weddings",
      title: "Weddings",
      description: "The whole day, from the first ritual to the last goodbye, told candidly.",
      photo: "storyAntarpat",
      enquiry: "your wedding coverage",
      confirmed: true,
    },
    {
      id: "films",
      title: "Wedding films",
      description: "Films that keep the chants, the music and the pauses in between.",
      photo: "storySangeet",
      enquiry: "your wedding films",
      confirmed: true,
    },
    {
      id: "pre-wedding",
      title: "Pre-wedding",
      description: "Temples, palaces and old forts: an unhurried shoot somewhere with a story.",
      photo: "storyMonsoon",
      enquiry: "a pre-wedding shoot",
      confirmed: true,
    },
    {
      id: "ring-ceremony",
      title: "Engagement & ring ceremony",
      description: "The first promise, the rings and both families around you.",
      photo: "detailRings",
      enquiry: "engagement and ring ceremony coverage",
      confirmed: true,
    },
    {
      id: "haldi-mehendi",
      title: "Haldi & Mehendi",
      description: "Turmeric, henna, music and everyone who joins in.",
      photo: "storyHaldi",
      enquiry: "haldi and mehendi coverage",
      // Haldi is in the studio's posts; mehendi is still to be confirmed.
      confirmed: false,
    },
    {
      id: "portraits",
      title: "Portraits",
      description: "Artistic portraits with a vintage soul, in rooms full of old light.",
      photo: "storyNath",
      enquiry: "a portrait session",
      confirmed: true,
    },
  ] as Service[],
} as const;

/* Behind the lens */

export const about = {
  title: "Behind the lens",
  paragraphs: [
    "The Folk Weddings is a wedding photography and films studio based in Belgaum, working across Goa, Bangalore and beyond. We stay quietly at the edges of the day, close enough to catch the glance and far enough to let it happen.",
    "We look for real moments, raw emotions and artistic frames, and for the culture that makes your wedding yours: the rituals, the music and the elders who know every step.",
  ],
  ownerLine: (name: string) => `Led by ${name}.`,
  statLabels: {
    rating: (platform: string) => `Rating on ${platform}`,
    reviews: (platform: string) => `Reviews on ${platform}`,
    yearsActive: "Years photographing weddings",
    weddingsShot: "Weddings photographed",
    citiesCovered: "Cities travelled for weddings",
  },
} as const;

/* How we work: a real sequence, so it is numbered. */

export const howWeWork = {
  title: "How we work",
  steps: [
    { title: "Say hello", text: "Message us your date, city and the functions you’re planning." },
    { title: "Plan the story", text: "We learn your rituals, places and people, so nothing that matters is missed." },
    { title: "Live your day", text: "We blend in. You stay present." },
    {
      title: "Keep it alive",
      text: "A carefully edited gallery, your film and an album made to be handed down.",
    },
  ],
} as const;

/* Kind words. Placeholders until the studio shares real reviews with permission. */

export interface Testimonial {
  quote: string;
  attribution: string;
  placeholder: boolean;
}

export const testimonials = {
  title: "Kind words",
  placeholderTag: "placeholder",
  readAll: (platform: string) => `Read all reviews on ${platform}`,
  previous: "Previous review",
  next: "Next review",
  status: (index: number, total: number) => `Review ${index} of ${total}`,
  dragLabel: "Drag",
  items: [
    {
      quote: "They caught every ritual our grandparents cared about, and it still feels like us.",
      attribution: "Bride & groom, Belgaum",
      placeholder: true,
    },
    {
      quote: "The temple shoot felt like a walk with a friend. The photographs feel like a film.",
      attribution: "Bride & groom, Goa",
      placeholder: true,
    },
    {
      quote: "Months later, the film still plays every time family visits.",
      attribution: "Bride & groom, Bangalore",
      placeholder: true,
    },
  ] as Testimonial[],
} as const;

/* Instagram wall: a contact sheet of static tiles that all open the profile. */

export const instagram = {
  title: "@thefolkweddings.in",
  cta: "Follow on Instagram",
  tileLabel: (title: string) => `${title}, open @thefolkweddings.in on Instagram (opens in a new tab)`,
  tiles: [
    { photo: "storyHaldi", rebate: "14" },
    { photo: "detailRings", rebate: "14A" },
    { photo: "storyMonsoon", rebate: "15" },
    { photo: "storyAntarpat", rebate: "15A" },
    { photo: "detailPaithani", rebate: "16" },
    { photo: "storyMehendi", rebate: "16A" },
    { photo: "storySangeet", rebate: "17" },
    { photo: "storyNath", rebate: "17A" },
  ] as { photo: PhotoKey; rebate: string }[],
} as const;

/* Booking */

export const bookingFunctions = [
  "Pre-wedding",
  "Engagement",
  "Haldi",
  "Mehendi",
  "Sangeet",
  "Wedding",
  "Reception",
] as const;
export type BookingFunction = (typeof bookingFunctions)[number];

export const booking = {
  /** The studio's own sign-off, from every post. */
  eyebrow: "Keep your precious memories alive with us",
  title: [{ text: "Let’s " }, { text: "tell", italic: true }, { text: " your story." }] as TextRun[],
  sub: "Share your date and city, and we’ll check availability.",
  fields: {
    names: {
      label: "Your names",
      placeholder: "e.g. Kavya & Arjun",
      error: "Enter your names",
    },
    date: {
      label: "Wedding date",
      placeholder: "Choose a date",
      helper: "An approximate date is fine.",
      error: "Choose a date (an approximate one is fine)",
      pastError: "Choose a date from today onwards",
      picker: {
        title: "Choose your wedding date",
        previousMonth: "Previous month",
        nextMonth: "Next month",
        previousYear: "Previous year",
        nextYear: "Next year",
        showMonths: "choose a month",
        showDays: "back to the days",
        close: "Close",
      },
    },
    city: {
      label: "City",
      placeholder: "e.g. Belgaum",
      error: "Enter your city",
    },
    functions: {
      legend: "Functions",
      helper: "Choose all that apply.",
    },
  },
  preview: {
    label: "Your message",
    /** Shown in the preview until the matching field is filled in. */
    tokens: { names: "your names", date: "your date", city: "your city" },
  },
  submit: "Check availability on WhatsApp",
  note: "Opens WhatsApp with this message. Nothing is sent until you press send.",
  opened: "WhatsApp is open in a new tab with your message, ready to send.",
  popupBlocked: "WhatsApp did not open in a new tab. Use this link instead:",
  openLink: "Open WhatsApp",
  instagramCta: "Message on Instagram",
  callCta: "Call",
} as const;

/* WhatsApp messages. The booking preview and the sent text come from the same template. */

export const whatsappCopy = {
  general: "Hi Praveen! We'd love to check if The Folk Weddings is available for our wedding.",
  service: (enquiry: string) =>
    `Hi Praveen! We'd like to know more about ${enquiry}. Could you share your availability?`,
  booking: ({
    names,
    date,
    city,
    functions,
  }: {
    names: string;
    date: string;
    city: string;
    functions: readonly BookingFunction[];
  }) =>
    `Hi Praveen! We're ${names}. Our wedding is on ${date} in ${city}. ` +
    `Functions: ${functions.length > 0 ? functions.join(", ") : "to be decided"}. ` +
    "Could you share your availability?",
} as const;

/* Footer */

export const footer = {
  srHeading: "Contact and links",
  navLabel: "Footer",
  navigationTitle: "Navigation",
  servicesTitle: "Services",
  connectTitle: "Connect",
  backToTop: "Back to top",
  rights: (year: number) => `© ${year} The Folk Weddings. All rights reserved.`,
  credit: (name: string) => `Website by ${name}`,
} as const;

/* Global UI */

export const ui = {
  whatsappFab: "Chat on WhatsApp (opens in a new tab)",
  whatsappTooltip: "Chat on WhatsApp",
  newTab: "(opens in a new tab)",
  cursor: { view: "View", drag: "Drag", open: "Open" },
} as const;

/* SEO */

export const seo = {
  title: "The Folk Weddings | Wedding Photography & Films in Belgaum, Goa & Bangalore",
  description:
    "Candid wedding photography and films by Praveen Pk. Weddings, temple and palace pre-weddings, haldi and ring ceremonies across Belgaum (Belagavi), Goa, Bangalore and beyond.",
  ogAlt: "The Folk Weddings. Stories of love, people & culture.",
  ogEyebrow: "Wedding photography & films · Belgaum",
  /** Places for the structured data (search engines also read Belagavi and Bengaluru). */
  locality: "Belgaum",
  region: "Karnataka",
  areaServed: [
    { type: "City", name: "Belagavi" },
    { type: "State", name: "Goa" },
    { type: "City", name: "Bengaluru" },
  ],
  knowsAbout: ["Wedding photography", "Wedding films", "Pre-wedding photography", "Portrait photography"],
} as const;

/* 404 */

export const notFoundCopy = {
  frame: "Fr. 404",
  title: "Lost frame.",
  body: "This frame never made it into the album. The rest of the story is waiting on the homepage.",
  cta: "Back to the homepage",
} as const;
