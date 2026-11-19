@AGENTS.md

# The Folk Weddings homepage: project conventions

A single-page Next.js 16 demo for The Folk Weddings, a wedding photography and films studio in Belgaum. Read `DESIGN.md` before changing anything visual; it is the design source of truth. `README.md` covers running, deploying and checks; `IMAGES.md` the photo slots and the logo layers; `CLIENT_CHECKLIST.md` what the studio still has to confirm.

## Stack and versions (pinned)
- next 16.4.6 (App Router, Turbopack, fully static), react 19.3, TypeScript **6.0.3** (TS 7 breaks typescript-eslint), ESLint **9.39** (eslint-config-next's plugins do not support 10). The React Compiler lint rules are on.
- Tailwind v4 via `@tailwindcss/turbopack` in `next.config.ts`. Tokens in `src/app/globals.css` (`@theme static`, default palette cleared).
- gsap 3.15 + @gsap/react (ScrollTrigger, SplitText, ScrambleText, CustomEase), motion 14 (LazyMotion + `m` from `motion/react-m`, async `domMax`), lenis 1.3 (`lenis/react`), ogl (lazy hero shader only).

## Theme
- The page is dark: the logo's maroon with apricot type. Classes use **role** tokens (`canvas`, `canvas-deep`, `surface`, `fg`, `fg-soft`, `accent`, `on-accent`, `accent-hover`, `highlight`, `ornament`, `line`, `line-strong`, `error`) that follow their scheme. `.scheme-light` restates every role for the cream cards; it is on the booking card, the date picker dialog and the review cards. Add it to any new light surface instead of hard-coding maroon on cream.
- Brand tokens (`maroon`, `apricot`, `cream`, `gold`, `shade`, `kumkum` and their variants) are fixed. Use `shade` for scrims and overlays over photographs and `cream` for text on photographs.
- Custom properties resolve where they are declared, so a role cannot be derived from another inside `.scheme-light`; restate it (and its rgb helper: `--fg-rgb`, `--accent-rgb`, `--highlight-rgb`).

## Rules
- Copy lives in `src/content/site.ts` (WhatsApp templates included, in `whatsappCopy`); images, alt text, focal points, EXIF and scrim strengths in `src/content/images.ts`. Components never hard-code copy or hex values.
- Unknown studio facts are `null` placeholders in `site.ts`; UI that needs them renders only when set. Never invent facts (years, counts, names, prices, ratings), and never name couples from the studio's posts.
- `trust.show` (with every value set) gates every rating, review count and review link. Ratings never go in JSON-LD (`src/lib/seo.ts`). No prices anywhere.
- The logo artwork in `src/assets/brand/` comes only from `npm run brand` (`scripts/make-brand.mjs`, from `brand/logo-source.png`). Never edit, recolour or redraw it; place it only on maroon or on photographs. The name elsewhere is the live `Wordmark` component.
- Server Components by default; `"use client"` only on interactive leaves. Brand marks (Instagram, Threads, WhatsApp) come from simple-icons in the server component `BrandIcon` and are passed into client components as props; never redraw or recolour them.
- GSAP: import only from `@/lib/gsap` (plugins registered once). Use `useGSAP({ scope })`, `gsap.matchMedia()` with `QUERIES` from `@/lib/media`, and revert on unmount. Pins and scrubbed transforms only under `QUERIES.desktopMotion`; at most two pins (hero, stories).
- Each element is animated by one engine: GSAP for scroll, text and images; Motion for UI state.
- Never call a useGSAP `contextSafe` function from inside a `gsap.matchMedia()` callback (or from another component's GSAP callback): GSAP then nests the parent context in its own child, and the next revert overflows the stack. Inside `mm.add((context) => ...)`, bind deferred functions with `context.add("name", fn)`.
- The smooth scroll sets `gsap.ticker.lagSmoothing(0)`. A tween created straight after a long main-thread block (hydration) is timed from a stale clock and finishes on its first tick, so start load-time animations a couple of frames later (see `freshFrame` in `Preloader.tsx`).
- Animate only transform, opacity and clip-path. Never animate blur. No window scroll listeners; use ScrollTrigger or IntersectionObserver.
- Reduced motion: no smoothing, no pins, scrub, parallax, cursor or WebGL; `[data-reveal]` elements get a 200ms fade from `GsapBoot`.
- In-page navigation goes through `scrollToSection()` in `@/lib/scroll`. Overlays use `lockScroll()` / `unlockScroll()`; while locked the window reports scroll 0, so section tracking checks `isScrollLocked()`.
- All WhatsApp links come from `waLink()` in `@/lib/whatsapp`. The booking preview and the sent text come from the same template.
- Text over the hero photo: scrims are flat zones under the copy; tune their strengths per photo in `images.ts` with `tests/contrast-over-image.spec.ts` (it reads the real text colours from the page).
- Copy rules: no em or en dashes anywhere, at most one middle dot per line, British spelling, no filler words, English only. `npm run preflight` enforces this in `src/`; keep the root docs to the same rules.
- React Compiler lint: no `setState` directly in effects, no mutating values returned from hooks, no reading or writing refs during render.

## Images, logo and fonts
- Slot images live in `/images` (see `IMAGES.md`). `scripts/ensure-images.mjs` creates marked placeholders for missing slots and converts slot-named PNG/JPG files; it never overwrites a real photo.
- Zodiak is downloaded at build time by `scripts/fetch-fonts.mjs` into `src/fonts/vendor` (git-ignored). Its licence forbids redistribution, subsetting and format conversion. Only Light is preloaded.

## Commands
- `npm run dev` (port 3000), `npm run build`, `npm run build:indexable` (demo mode off, for SEO checks), `npm run start:qa` (port 3108, used by Playwright and Lighthouse)
- `npm run lint`, `npm run typecheck`, `npm run preflight`, `npm run images:check`, `npm run brand`
- `npx playwright test` (Chromium, 31 tests; the QA server on 3108 is reused or started). `SHOT_WIDTHS=all` for the nine-width sweep, `SHOT_WEBKIT=1 ... --project=webkit` for WebKit.
- `npm run lh:mobile` / `npm run lh:desktop` against `start:qa`.

## Gotchas
- Turbopack's persistent cache can serve a stale stylesheet after a CSS edit (dev and build). If a CSS change is missing, stop the server, run `npm run clean`, and start again.
- Playwright reuses whatever server is on 3108; make sure no other project's QA server is running there.
- Anything hidden until JavaScript runs needs a CSS failsafe keyed on `.js:not(.gsap-ready)` (reveals, intro, hero clip, nav); `tests/resilience.spec.ts` covers the nav.
- Keep LF line endings (`.gitattributes` enforces them on commit).

## Git
- One commit per milestone. End commit messages with the attribution line requested by the session.
