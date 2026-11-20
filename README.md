# The Folk Weddings · homepage demo

A single-page site for The Folk Weddings, the wedding photography and films studio of Praveen Pk, based in Belgaum and working across Goa, Bangalore and beyond: "Stories of love, people & culture."

It is a pitch demo. Search engines are kept out (demo mode), unconfirmed studio facts stay empty, and the twelve photographs are AI-generated stand-ins until the studio's own work replaces them.

- **Live demo:** https://thefolkweddings.vercel.app
- **Design source of truth:** [`DESIGN.md`](DESIGN.md)
- **Photographs and the logo:** [`IMAGES.md`](IMAGES.md)
- **What to confirm with the studio before launch:** [`CLIENT_CHECKLIST.md`](CLIENT_CHECKLIST.md)
- **Conventions for anyone (or any AI assistant) editing the code:** [`CLAUDE.md`](CLAUDE.md)

## What is on the page

| Section | What it does |
|---|---|
| Intro | First visit only: the studio's own logo draws itself in on its maroon, then an aperture iris opens onto the hero. Click, scroll or a key skips it. |
| Hero | "Stories of *love*, people & culture." over an art-directed photo (portrait and landscape crops). On large screens, scrolling turns the screen into a framed print. A WebGL "liquid light" follows the cursor. |
| Marquee | The services in italic, speeding up and reversing with your scroll. |
| The name | The logo's elephant, a reading of "folk", and a paragraph that develops word by word. Then the studio's own promise from its bio (real moments, raw emotions, artistic frames) and "Where the stories happen": Belgaum, Goa, Bangalore and venues from its posts, each with its position read like an EXIF location. |
| Selected stories | A pinned horizontal film roll on desktop, a swipe carousel on phones; any frame opens full screen. |
| What we capture | An index of services; hovering shows a floating photo. Each row opens WhatsApp with a message about that service. |
| Behind the lens | A print that develops as it scrolls into view, and "Led by Praveen Pk." |
| How we work | Four steps on a gold thread, ending with "Keep it alive". |
| Kind words | A stack of cream review cards you can drag, or move with the buttons and arrow keys (placeholders until real reviews arrive). |
| Instagram | A contact sheet of frames that converge as you arrive. |
| Booking | Names, date, city and functions compose a WhatsApp message to the studio, shown live before it is sent. The date opens the site's own calendar. Nothing is sent by the site itself. |
| Footer | Links, the official Instagram, Threads and WhatsApp marks, phone and email, the elephant and the studio name set to the page width. |

Also: a floating WhatsApp button, a custom cursor and scrollbar on desktop, film grain, a 404 page ("Lost frame."), link previews for WhatsApp and social apps, elephant app icons, and structured data for search engines (no rating, no price).

## Run it locally

Needs Node.js 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run dev` and `npm run build` first download the Zodiak display font from Fontshare into `src/fonts/vendor` (needs a connection on the first run) and create a marked placeholder for any missing photo in `/images`.

```bash
npm run build
npm run start        # http://localhost:3000
npm run start:qa     # same build on port 3108, used by the tests and Lighthouse
```

## Edit the content

All copy and studio facts live in **`src/content/site.ts`**; components never hard-code text. Photographs, their alt text, focal points and scrim strengths live in **`src/content/images.ts`**.

- **Studio facts** (`studio`): the phone, WhatsApp number and email come from the studio's public profiles. Years active, weddings photographed, cities covered and the street address start as `null` and stay hidden until set.
- **Ratings** (`trust`): empty and hidden. See `CLIENT_CHECKLIST.md` before citing any.
- **Reviews** (`testimonials`): three placeholders, each tagged "placeholder" on the page.
- **WhatsApp:** the messages are in `whatsappCopy`; the number is `studio.whatsappNumber` (an env var can override it).
- **The logo:** `brand/logo-source.png` is cut into transparent layers by `npm run brand` (see `IMAGES.md`).

## Environment variables

None are required. Copy `.env.example` to `.env.local` to override locally.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, link previews, sitemap and structured data | Vercel's production URL, then `https://thefolkweddings.in` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Overrides the studio WhatsApp number (digits with country code) | `studio.whatsappNumber` |
| `NEXT_PUBLIC_DEMO_MODE` | `true` keeps the site out of search results (noindex). Set `false` at launch. | `true` |
| `OG_IMAGE_SOURCE` | Optional: preview the link card with another photo at build time | `images/hero-desktop.webp` |

## Deploy

The repository is `github.com/kumbharkunal/THEFOLKWEDDINGS`; the Vercel project is `thefolkweddings`, so production lives at **https://thefolkweddings.vercel.app**. The framework, build command and output are detected automatically, and no environment variables are needed for the demo.

- From the terminal: `npx vercel` (preview) and `npx vercel --prod` (production).
- At launch: register `thefolkweddings.in` in the studio's name, add it in Vercel (Project, Settings, Domains), set `NEXT_PUBLIC_SITE_URL=https://thefolkweddings.in` and `NEXT_PUBLIC_DEMO_MODE=false`, and redeploy.

## Quality checks

```bash
npm run lint           # ESLint, zero warnings allowed
npm run typecheck      # route types + TypeScript
npm run preflight      # copy rules: no em or en dashes, no filler words, at most one middle dot per line
npm run images:check   # which photo slots are real, placeholder or missing
npx playwright test    # needs `npm run build`; starts the server on port 3108 if it is not running
npm run lh:mobile      # Lighthouse against `npm run start:qa`
npm run lh:desktop
```

The Playwright suite (31 tests in Chromium) covers the mobile menu, axe WCAG 2.2 A/AA scans at 390 and 1440px (with reduced motion, the menu open and the date picker open), reduced motion, a clean console, hero contrast measured on real pixels at six widths, the booking form and date picker, the review stack, the scroll rail, resilience without scripts and horizontal overflow. `SHOT_WIDTHS=all` sweeps nine widths; `SHOT_WEBKIT=1 npx playwright test tests/screens.spec.ts --project=webkit` runs WebKit.

## Project structure

```
brand/                  the studio's logo as supplied (logo-source.png)
images/                 the 12 photo slots (see IMAGES.md)
public/                 grain texture
scripts/                fonts, brand layers, image placeholders and checks, copy preflight
src/app/                layout, page, 404, page-transition template, link-preview images, icons, manifest, robots, sitemap
src/assets/brand/       the logo cut into transparent layers by `npm run brand`
src/components/layout/  nav, mobile menu, footer, preloader, smooth scroll, cursor, grain, floating WhatsApp
src/components/sections/ one file (or a server + client pair) per section
src/components/ui/      buttons, wordmark, headings, image reveals, crop marks, brand marks
src/components/webgl/   the lazy hero shader
src/content/            site.ts (copy and facts), images.ts (photos)
src/lib/                GSAP setup, media queries, scroll helpers, WhatsApp links, fonts, SEO, icons
tests/                  Playwright specs
```

## Troubleshooting

- **A CSS change does not show up:** Turbopack's cache can serve a stale stylesheet. Stop the server, run `npm run clean`, and start again.
- **Port 3000 is busy:** run `npx next dev --port 3001`. Tests and Lighthouse use port 3108.
- **On a phone the nav never appears and nothing animates:** open the "Network" address that `npm run dev` prints, and restart the dev server if the computer's address changed.
- **The font download fails:** check the connection to `api.fontshare.com`, then build again.
- **`EBUSY` or `EPERM` errors in a OneDrive folder:** pause OneDrive sync while working.

## Credits and licences

| Asset | Licence or source |
|---|---|
| The logo | The Folk Weddings, used for this demo of their own site |
| Zodiak | Indian Type Foundry, ITF Free Font License: self-hosting allowed; no redistribution or modification. Downloaded at build time, never committed. |
| Hanken Grotesk, DM Mono | SIL Open Font License (via `next/font`) |
| Brand marks | simple-icons (CC0); the marks belong to their owners and are used unaltered |
| Icons | Phosphor |
| Animation | GSAP (free standard licence), Motion, Lenis, OGL |
| Photographs | AI-generated stand-ins until the studio supplies its own |
