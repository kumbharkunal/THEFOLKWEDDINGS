# IMAGES.md · the photographs and the logo

The page uses twelve photo slots and the studio's logo. Every slot currently holds an **AI-generated stand-in**: warm, candid Indian wedding scenes made for the pitch. They must be replaced with Praveen Pk's own photographs (with the couples' permission) before launch, and never presented as the studio's real weddings.

## How replacing works

1. Save the photo in `/images` with the **exact slot name**, as `.webp`, `.png`, `.jpg` or `.jpeg` (for example `story-haldi.jpg`).
2. Delete the stand-in `.webp` of that slot first (the scripts never overwrite a real photo), then run `npm run dev` or `npm run build`. A slot-named PNG or JPG is converted to the slot's WebP at its exact size, cropped around the most interesting area (sharp's attention crop, quality 88). The original is kept and git-ignored.
3. Run `npm run images:check`. Every slot should report `real` with the right size.

Then, in `src/content/images.ts`, update that photo's **`alt`** (what it shows, in one plain sentence), **`focal`** (where the subject is, in percent), **`exif`** (the real lens, aperture, shutter and ISO; the current values are decorative) and, for the hero photos, **`scrim`**:

```bash
npm run build && npx playwright test tests/contrast-over-image.spec.ts --project=chromium
```

It measures the real pixels under every line of hero text at six widths. Lower the scrim values while the test still passes; raise them if it fails.

## The slots

| File | Size (px) | Ratio | Used in | The stand-in shows |
|---|---|---|---|---|
| `hero-desktop.webp` | 2560 × 1440 | 16:9 | Hero on landscape screens; link preview card; WebGL texture | A couple in a Paithani saree and pheta walking hand in hand through a temple courtyard at golden hour |
| `hero-mobile.webp` | 1080 × 1920 | 9:16 | Hero on portrait screens | The same moment, composed vertically |
| `story-haldi.webp` | 1200 × 1800 | 2:3 | Stories 01; services (Haldi & Mehendi); Instagram tile | A laughing bride as relatives apply turmeric |
| `story-monsoon.webp` | 1800 × 1200 | 3:2 | Stories 02; services (Pre-wedding); Instagram tile | A couple on old fort walls above misty hills and waterfalls |
| `story-antarpat.webp` | 1200 × 1800 | 2:3 | Stories 03; services (Weddings); Instagram tile | A bride looking over a saffron antarpat as petals fall |
| `story-mehendi.webp` | 1200 × 1800 | 2:3 | Stories 04; manifesto print; Instagram tile | Mehendi hands drawn with peacocks, holding a marigold |
| `story-sangeet.webp` | 1800 × 1200 | 3:2 | Stories 05; services (Wedding films); Instagram tile | A groom twirling the bride under string lights |
| `story-nath.webp` | 1200 × 1800 | 2:3 | Stories 06; services (Portraits); Instagram tile | A groom touching the bride's nath, foreheads together |
| `behind-the-lens.webp` | 1200 × 1500 | 4:5 | Behind the lens (shown developing from grey to colour) | A photographer framing the ceremony at the mandap |
| `detail-rings.webp` | 1200 × 1200 | 1:1 | How we work accent; services (Engagement & ring ceremony); Instagram tile | Two rings on turmeric rice in a brass plate |
| `detail-paithani.webp` | 1200 × 1200 | 1:1 | Manifesto print; Instagram tile | A Paithani border with a woven peacock |
| `cta-silk.webp` | 1920 × 1080 | 16:9 | Booking background, under a maroon wash | Soft cream silk with marigolds |

Photos are shown as sharp prints: no rounded corners, borders or filters. Several slots appear in more than one place, often cropped to a square or 4:5, so keep the subject away from the edges.

**What the studio's own photos should bring:** the heritage settings their work is known for (temples, palaces, forts, old mansions), real rituals (muhurtam, haldi, ring ceremonies), warm and true colour, and no text, watermarks or logos in the frame. For the desktop hero, keep the left half calm and fairly dark, because the headline sits there; for the mobile hero, keep the top and bottom thirds calm. `behind-the-lens.webp` is ideally a real behind-the-scenes photo of Praveen at work.

## The logo

`brand/logo-source.png` is the studio's logo as supplied (1080 × 1080, apricot lettering and the elephant on textured maroon). `npm run brand` (`scripts/make-brand.mjs`) cuts it into transparent layers in `src/assets/brand/`:

| Layer | Used in |
|---|---|
| `logo-wordmark.png` ("THE / Folk / WEDDINGS") | the intro; the link preview card |
| `logo-tagline.png` | the intro |
| `logo-elephant.png` | the intro, the name section, the footer, the app icons |
| `logo-lockup.png` | all three as drawn (for any future use) |

The lettering is keyed by its exact anti-aliasing coverage, so letter counters stay open; the elephant is keyed by colour distance with its interior filled, so it stays solid over photographs. The source is a 1080px raster, so the elephant can look slightly soft at its largest size on high-density screens. When the studio supplies a vector or high-resolution logo, replace `brand/logo-source.png`, check the band rows at the top of `scripts/make-brand.mjs`, and run `npm run brand` again.

## Link previews

The link preview card (`/opengraph-image`, shown by WhatsApp, Instagram and X) is built from `hero-desktop.webp` at build time: the photo under a warm shade scrim, the logo's lettering and the headline. To preview the card with another photo, set `OG_IMAGE_SOURCE` (see `.env.example`).

## If the photos stay AI-generated for a while

They are fine for a pitch, but check each one for hands and fingers, jewellery and draping that look right for the ritual shown, garbled text, and faces of real, identifiable people.
