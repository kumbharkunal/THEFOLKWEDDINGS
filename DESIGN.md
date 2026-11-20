# DESIGN.md · The Folk Weddings

> **An heirloom album, opened.** Stories of love, people & culture.

This is the design specification for The Folk Weddings homepage. Code follows it; when the two disagree, fix the code or update this file deliberately. Tokens live in `src/app/globals.css` (Tailwind v4 `@theme static`) and, for non-CSS contexts, `src/lib/tokens.ts`.

## 1. Visual Theme & Atmosphere

**Style:** a heritage wedding album. Maroon cover, apricot foil, cream pages.
**Keywords:** folk, ritual, procession, heritage, album, foil, candid, unhurried.
**Tone:** warm, rich, quiet, photographic. Not: glitter, gold gradients, filigree, bridal pink, template luxury.
**Feel:** opening a wedding album bound in maroon, the studio's name pressed in apricot foil, the photographs inside printed on cream.

**Concept**
- The page is the logo: the maroon (#370905) and apricot (#FCD895) of the studio's own mark, which their Instagram album pages use too.
- The intro draws the logo itself: the lettering is written left to right, the tagline settles, the elephant rises.
- The hero is the *viewfinder*; scrolling turns it into a *print* ("screen to print").
- Stories are a *roll* of film. The Instagram wall is a *contact sheet*. Behind the lens *develops* in the tray.
- The booking form and the reviews are cream *invitation cards* laid on the maroon.
- The logo's caparisoned elephant leads the name section and closes the footer.

**Signature motif, used sparingly:** mono frame counters (Fr. 001); EXIF readouts in spaced columns; thin gold crop marks at frame corners; contact-sheet rebate numbers under tiles; fine film grain. Captions always sit outside photographs, never as pills over them.

**Language:** English only, British spelling. The studio works across Kannada, Marathi and North Indian weddings, and Belagavi sits on the Karnataka and Maharashtra language border, so the page uses ritual words shared across communities (muhurtam, haldi, mehendi, antarpat) rather than one regional script.

**Interaction tier:** L3 (immersive): GSAP + ScrollTrigger + SplitText + ScrambleText, Lenis smoothing, Motion for UI state, one OGL WebGL moment (lazy, desktop only).
**Dials:** DESIGN_VARIANCE 7, MOTION_INTENSITY 8, VISUAL_DENSITY 3.

## 2. Color Palette & Roles

**Brand colours** (fixed in every scheme):

| Token | Hex | Use |
|---|---|---|
| `maroon` | #370905 | the page (the logo's background) |
| `maroon-deep` | #250402 | deep bands, image wells, story viewer |
| `maroon-raised` | #4A1009 | nav glass tint, mobile menu sheet, raised dark surfaces |
| `apricot` | #FCD895 | the logo's lettering; text on maroon; primary buttons |
| `apricot-soft` | #C9A97C | secondary text on maroon |
| `cream` | #FFF4E0 | invitation cards; text over photographs |
| `cream-deep` | #F4E1C1 | card shells, the message bubble |
| `gold` | #C8A165 | hairlines, crop marks, the process thread, the scroll rail. Never text. |
| `shade` | #1C0402 | scrims over photographs, overlays, backdrops |
| `kumkum` | #A3261C | errors and the "today" dot inside the cream cards |

**Roles** follow the scheme they sit in. The maroon page is the default (`:root`); `.scheme-light` restates every role for the cream cards (the booking card, the date picker, the review cards). Custom properties resolve where they are declared, so each role and its rgb helper is restated rather than derived.

| Role | On the maroon page | In a cream card |
|---|---|---|
| `canvas` / `canvas-deep` | maroon / maroon-deep | cream / cream-deep |
| `surface` | maroon-raised | #FFFAF1 (the card core and its fields) |
| `fg` / `fg-soft` | apricot / apricot-soft | maroon / #74463A |
| `accent` / `on-accent` | apricot / maroon | maroon / apricot |
| `accent-hover` | #FFE7B8 | #5C140C |
| `highlight` | cream | kumkum |
| `ornament` | gold | #A07A42 |
| `line` / `line-strong` | apricot 14% / 50% | maroon 14% / 55% |
| `error` | #FFB3A3 | kumkum |
| focus ring | apricot (cream over photographs) | maroon |

**Measured contrast (WCAG 2.x):**

| Pair | Ratio | Use |
|---|---|---|
| apricot on maroon / maroon-deep / maroon-raised | 12.79 / 14.04 / 11.24 | all text on the page |
| apricot-soft on maroon / maroon-deep / maroon-raised | 7.85 / 8.61 / 6.90 | captions, helpers, mono labels |
| cream on maroon / maroon-raised | 16.01 / 14.07 | highlighted titles, active menu index |
| maroon on apricot, rest / hover | 12.79 / 14.43 | primary button label on the page |
| maroon on cream / cream-deep / card core | 16.01 / 13.61 / 16.78 | all text in the cards |
| card fg-soft on card core / cream-deep | 7.54 / 6.12 | helpers and placeholders in the cards |
| apricot on maroon, rest / hover | 12.79 / 9.87 | primary button label in the cards |
| kumkum on card core / cream-deep | 7.08 / 5.75 | errors, always with an icon |
| line-strong on maroon / on card core | 4.02 / 4.06 | control outlines, input borders (3:1 needed) |
| apricot at half opacity on maroon | 4.02 | undeveloped manifesto words (large text, 3:1 needed) |
| apricot / apricot-soft on the booking wash (maroon 86% over the silk) | about 8.9 / 5.5 | booking copy |
| gold on maroon | 7.26 | decorative only |
| WhatsApp green on maroon | 8.80 | the floating button |
| cream hero copy over the photo and its scrims, measured on pixels | `tests/contrast-over-image.spec.ts` | hero at 320 to 1920px |

**Color rules**
- Components reference tokens only. Tailwind's default palette is cleared (`--color-*: initial`), so a stray `bg-blue-500` cannot compile into anything.
- One accent per scheme: apricot on the page, maroon in the cards. Gold is never text.
- No pure white or black surfaces. The exceptions are the glass highlight and the white marks of Threads and WhatsApp.
- No decorative gradients. Shade scrims over photographs exist only for legibility; their strengths are set per photo in `src/content/images.ts` and proven by `tests/contrast-over-image.spec.ts`, which samples the real pixels under every line of hero text.

## 3. Typography Rules

All fonts are self-hosted through `next/font` (no third-party requests, no layout shift). The display face is downloaded at build time from Fontshare by `scripts/fetch-fonts.mjs`, because its licence forbids redistribution and modification.

| Role | Font | Loading | Fallback |
|---|---|---|---|
| Display | Zodiak, static Light 300 and Regular 400 | Light preloaded | "Times New Roman", serif (metric-adjusted) |
| Emotional and brand italics | Zodiak Light Italic 300 | on demand | as above |
| UI and body | Hanken Grotesk (variable) | preloaded, latin | Arial, sans-serif (metric-adjusted) |
| Captions, EXIF, counters | DM Mono 400 | on demand | ui-monospace, monospace |

| Token | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `text-hero` | clamp(3rem, 0.9rem + 8.6vw, 9rem) | 300 | 0.92 | -0.035em | hero h1 |
| `text-display` | clamp(2.5rem, 1.2rem + 4.6vw, 6.5rem) | 300 | 0.98 | -0.025em | section h2 |
| `text-lead` | clamp(1.625rem, 0.9rem + 2.9vw, 4rem) | 300 | 1.12 | -0.015em | manifesto |
| `text-h3` | clamp(1.5rem, 1.1rem + 1.4vw, 2.5rem) | 400 | 1.15 | -0.01em | story, step, card titles |
| `text-body-lg` | clamp(1.0625rem, 1rem + 0.35vw, 1.25rem) | 450 | 1.55 | 0 | hero sub, intros |
| `text-body` | clamp(1rem, 0.96rem + 0.2vw, 1.125rem) | 450 | 1.6 | 0 | body |
| `text-caption` | 0.75rem (mono) | 400 | 1.4 | +0.06em | EXIF, counters, rebates |

**The name.** The logo itself (scripts/make-brand.mjs) appears in the intro, the name section and the footer. Everywhere else the name is live text: "The *Folk* Weddings" in Zodiak, with "Folk" in Light Italic after the logo's script (`Wordmark`). The footer sets it huge and fitted to the page width.

**Typography rules**
- Italic is reserved for *love* (hero), *tell* (booking), the "Folk" of the wordmark, the booking sign-off, romanised ritual terms and the marquee.
- Body measure stays at or under 62ch. No all-caps labels; mono captions are mixed case.
- `lang="en-IN"` with British spelling (colour, centre).
- Split-text line masks pad `0.08em` above and `0.18em` below, so italic descenders never clip.
- No gradient text and no text shadows. Never use Inter, Roboto, Poppins, Montserrat, Playfair Display or Cormorant.

## 4. Component Stylings

Every interactive component has designed default, hover, active, focus-visible and disabled states. Hover applies only on devices that can hover.

### Buttons
- **Primary:** an `accent` pill with an `on-accent` label and a nested circle (button-in-button) holding the icon: apricot with a maroon label on the page, maroon with an apricot label in the cards. The circle is the opposite colour; the WhatsApp glyph stays its official green.
- **Ghost:** a `line-strong` outline with an `fg` label; hover tints `fg` at 5%.
- **Ghost on photographs:** cream at 40% outline over shade at 60%, cream label.
- Labels roll on hover (two stacked spans, 450ms cinematic). With reduced motion only the colour changes.

### Invitation cards (double bezel: the booking form and the reviews)
A `cream-deep` shell, 6px, around a `#FFFAF1` core, with `shadow-card` (a white inset highlight over a warm shade drop). The whole card carries `.scheme-light`, so its fields, chips, links and buttons turn maroon on cream.

### Navigation (floating glass pill)
- **Over the page:** maroon-raised at 72% over an 18px backdrop blur, apricot text, a hairline of apricot at 14%.
- **Over photographs:** shade at 60%, cream text. Tone follows the section under the pill.
- Hidden while scrolling down past 120px, shown on scroll up, compact once scrolled. The active link carries a sliding pill (Motion layoutId).

### Inputs, chips and the date picker (inside the cream card)
- Fields: `surface` background, `line-strong` border (4.06:1), maroon text, 16px so iOS never zooms. Errors are kumkum with a WarningCircle icon, wired with `aria-describedby`.
- Chips: real checkboxes styled as pills. Checked chips fill with maroon and apricot text, and the plus turns into a check, so state never relies on colour alone.
- Date picker: the site's own calendar in a native modal dialog, cream like the card: popover from 640px, bottom sheet below. Today has a kumkum dot; the chosen day sits on a maroon disc.

### Brand marks and the logo
- Instagram: the official glyph with its gradient. Threads: the white mark (Meta's form for dark backgrounds). WhatsApp: the green glyph; white on the green FAB. Paths from simple-icons, rendered on the server.
- The logo artwork (wordmark, tagline, elephant) is used as cut by `scripts/make-brand.mjs`: never recoloured, redrawn or rotated, and placed only on maroon or on photographs. It animates only by clip-path, transform and opacity.

## 5. Layout Principles

- Container max width 90rem (1440px); side padding `--gutter` = clamp(1rem, 0.6rem + 1.8vw, 2.5rem); text measure at most 62ch.
- 4px spacing scale; section padding `--section-y` = clamp(6rem, 3rem + 9vw, 12rem).
- Grid: 12 columns at 1024px and up (gap 24px), 6 at 768px, 4 below.

| Section | Layout family |
|---|---|
| Hero | full-bleed pin-scrub |
| Marquee | kinetic strip |
| The name | elephant ornament + scrubbed paragraph + floating prints, then the studio's promise beside one print and "Where the stories happen" under the other |
| Stories | horizontal roll (desktop) / snap carousel (mobile) |
| Services | index list + cursor preview |
| Behind the lens | 5/7 split (the only split on the page) |
| How we work | staircase timeline with a drawn thread |
| Kind words | card stack |
| Instagram | contact-sheet grid |
| Booking | full-bleed silk under a maroon wash + invitation card |
| Footer | link columns + elephant + fitted wordmark |

**Radii** apply to UI chrome only: pills 999px, mobile sheet 28px, cards 22px outer and 16px inner, fields 14px, the hero print end state 18px. Photographs are sharp prints: radius 0, no shadows.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | none | sections, photographs |
| Hairline | `0 0 0 1px var(--color-line)` | dividers, card shells, glass edge |
| Glass | backdrop blur 18px + saturate 1.4 over a tint | nav |
| Card | `--shadow-card` | invitation cards |
| Float | `--shadow-fab` | WhatsApp button |
| Overlay | shade 60% backdrop | open mobile menu |

Layers: content 0, floating service preview 20, FAB 60, nav 70, menu backdrop 80, menu sheet 90, grain 95, cursor 96, preloader 100. Dialogs use the native top layer.

## 7. Animation & Interaction

**Philosophy:** motion tells the story (the logo drawing in, screen to print, develop, roll, contact sheet) or confirms an action. One orchestrated moment per viewport. Only transform, opacity and clip-path animate.

**Engine ownership:** GSAP owns scroll, text and image choreography; Motion owns UI state (nav, menu, presence, drag, magnetic). Every element is owned by exactly one engine.

| Kind | Value |
|---|---|
| Eases | `cinematic` cubic-bezier(0.16, 1, 0.3, 1); `expo.out`; `power4.out`; exits `power2.in`; CSS UI `cubic-bezier(0.32, 0.72, 0, 1)` |
| Durations | micro 150 to 250ms, UI 300 to 500ms, reveals 0.9 to 1.4s, exits about 65% of their entry |
| Springs (Motion) | nav pill 380/32, menu morph 300/30, magnetic 150/15, card stack 260/26, FAB 420/30 |
| Staggers | lines 0.08s, menu links 0.05s, tiles 0.04 to 0.05s |

### The intro (first visit per session)
1. The logo's lettering is written in left to right (clip-path, 1.2s, power2.inOut); the elephant rises out of a bottom mask (from 0.25s, 1s expo.out); the tagline settles (from 0.6s).
2. A gold hairline fills with real progress (fonts and the hero photo decoding, capped at 1s). The logo holds for at least 1.45s.
3. The logo lifts away and a hexagonal iris with gold blade edges opens onto the hero.
4. Click, scroll, touch or a key skips it; reduced motion shows the logo still and fades out in 200ms.

The smooth scroll sets `gsap.ticker.lagSmoothing(0)`, so a tween created straight after a long main-thread block would finish on its first tick. The intro therefore starts two frames after the logo artwork decodes (`freshFrame` in `Preloader.tsx`).

### Scroll and the rest
- Desktop only (at most two pins): the hero pin "screen to print" (scale 1 to 0.62, radius to 18px) and the stories horizontal roll.
- Scrubs: the manifesto word reveal (half to full opacity), the process thread, the developing print, parallax on the manifesto prints.
- The elephant ornament walks in on a left-to-right clip-path wipe (1.4s cinematic).
- Image hover: inner image to 1.03. Buttons: label roll, nested circle nudge, magnetic on fine pointers. Links: underline draws from the left.
- Special effects: ScrambleText EXIF readout, velocity-driven marquee, cursor follower (apricot, View/Drag/Open), film grain, the OGL "liquid light" over the hero on large fine-pointer screens.

### Reduced motion
No smoothing, scrub, pin, parallax, marquee velocity, cursor or WebGL. SplitText does not split. Every `[data-reveal]` gets a single 200ms fade. `tests/reduced-motion.spec.ts` checks this.

## 8. Do's and Don'ts

### Do
- Let the photographs lead; type and chrome stay quiet.
- Keep the logo artwork exactly as cut, on maroon or on photographs.
- Use apricot for text and buttons on the page, maroon inside the cards; gold only for hairlines and ornaments.
- Measure every text-over-photo scrim with the contrast test after a hero photo changes.
- Give every effect a reduced-motion equivalent. Design focus states as carefully as hover states.

### Don't
- ❌ Use an em dash or en dash anywhere, including alt text (`npm run preflight`).
- ❌ Add gradients to the apricot (no "gold foil" shine), glows or text shadows.
- ❌ Put the logo artwork on cream, recolour it or animate its marks other than by clip, transform or opacity.
- ❌ Overlay pills, tags or labels on photographs. Round, shadow or border photographs.
- ❌ Animate blur, width, height, top or left. Track continuous values in React state or add window scroll listeners.
- ❌ Hard-code hex values in components.
- ❌ Show prices, put ratings in JSON-LD, or state facts the studio has not confirmed.
- ❌ Name couples from the studio's posts on the page.

## 9. Responsive Behavior

| Name | Width | Key changes |
|---|---|---|
| Phone | < 768px | single column; hero title at the top, CTAs at the bottom; stories become a snap carousel; services become an accordion; Instagram 2 columns; no pins, no cursor |
| Tablet | 768 to 1023px | 6-column grid; still touch behaviour (no pins); badge visible |
| Desktop | ≥ 1024px | 12-column grid; pins and scrubbed transforms on fine pointers; cursor follower; services cursor preview |
| Wide | ≥ 1440px | container caps at 1440px; hero type caps at 9rem |

- Touch targets at least 44 × 44px. `viewport-fit=cover`; nav, FAB and sheet use `env(safe-area-inset-*)`. `100svh` for the hero, `100dvh` for the mobile sheet.
- Long words are sized to fit: the Instagram handle scales with the container (its width is about 8.1em), the footer wordmark is fitted by script.
- The QA sweep covers 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920px with no horizontal overflow.
