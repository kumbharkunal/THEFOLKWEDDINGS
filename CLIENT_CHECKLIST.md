# Client checklist · confirm before launch

Everything The Folk Weddings needs to confirm, supply or decide. Until an item is answered, the site either hides it or shows a clearly marked placeholder, so the demo never states something the studio has not confirmed.

Most answers are a one-line change in `src/content/site.ts` (copy and facts) or `src/content/images.ts` (photos). Environment variables are set in Vercel (or `.env.local`).

## Decisions to raise first

- [ ] **The domain `thefolkweddings.in` is not live.** It had no DNS records on 19 November 2026, although the Instagram handle uses it. Offer to register it in the studio's own name. At launch: add it in Vercel, set `NEXT_PUBLIC_SITE_URL=https://thefolkweddings.in`, set `NEXT_PUBLIC_DEMO_MODE=false`, redeploy. Until then the demo lives at https://thefolkweddings.vercel.app.
- [ ] **The photographs are AI-generated stand-ins.** All twelve must be replaced with Praveen's own work, with the couples' permission, before launch (see `IMAGES.md`). Never present the stand-ins as the studio's weddings.
- [ ] **The original logo files.** Only a 1080px image was available. Ask for the vector or high-resolution logo, so the elephant stays sharp at large sizes.
- [ ] **The reading of the name and the emblem.** The page presents them as a reading, not as their origin: "folk · of the people, their rituals and their songs" and "the elephant · dressed for the procession". Ask whether they are happy with this, or want their own words (`manifesto` in `site.ts`).

## Contact details (from the studio's public profiles)

- [ ] **Phone and WhatsApp +91 73381 35246.** Taken from the Instagram and Threads bios and the sign-off on every post; the WhatsApp Business profile matches. Every WhatsApp button opens a chat with this number, with the message already written (nothing is sent until the visitor presses send). Confirm this is the number for enquiries.
- [ ] **Email praveenpkphotography@gmail.com.** From the same sign-off. Confirm, or supply a studio address.
- [ ] **Who the messages greet.** The WhatsApp messages open "Hi Praveen!". Confirm, or choose another greeting (`whatsappCopy`).
- [ ] **Studio address** (`studio.address`). Only "Belgaum" is public, so the site names the city alone.
- [ ] **The studio's names.** The site uses "The Folk Weddings", "Praveen Pk" (shown as "Led by Praveen Pk.") and, in the structured data, "Praveen Pk Photography & Films" (the credit on their films and their WhatsApp Business name). Confirm the spelling and how they like to be named.

## Facts and services

- [ ] **Experience figures** (`studio.yearsActive`, `weddingsShot`, `citiesCovered`). None are public; when set, they count up in Behind the lens.
- [ ] **Service area.** Currently "Based in Belgaum. Working across Goa and Bangalore, and available worldwide." (from the bio, which says "Belgaum | Goa | Banglore" and "Available Globaly"; the site corrects the spelling).
- [ ] **Services.** Weddings, wedding films, pre-weddings, engagement and ring ceremonies, haldi and portraits are all in the studio's own posts. **Mehendi** (with haldi) and **sangeet** (a booking chip) are not yet; confirm or remove them.
- [ ] **The album.** Step 04 of How we work promises "a carefully edited gallery, your film and an album made to be handed down". Their "New Chapter" highlight shows a maroon album with the logo; confirm albums are part of their packages.
- [ ] **No prices anywhere.** Every call to action is about checking availability. Keep it that way unless the studio decides otherwise.

## Reviews and ratings

- [ ] **Three real reviews**, with the couples' permission and the attribution they prefer (for example "Kavya & Arjun, Belgaum, 2026"). Replace the placeholders in `testimonials` and set `placeholder: false`; the "placeholder" tag then disappears.
- [ ] **A rating to cite, if any.** No listing on a review platform was checked for this demo. If the studio wants to cite one, agree the exact wording, fill in `trust` (platform, link, rating, review count, date checked) and set `show: true`. That turns on the hero trust line, the rating stats and the "Read all reviews" link. Ratings never go into the structured data.

## Brand and legal

- [ ] **Social profiles.** Instagram `@thefolkweddings.in` and Threads `@thefolkweddings.in` are linked. No Facebook page was found; add one if it exists.
- [ ] **Language.** The page is in English (British spelling) with ritual words shared across communities (muhurtam, haldi, mehendi, antarpat). Ask whether they want a line in Kannada or Marathi anywhere.
- [ ] **Display font licence.** Zodiak (Indian Type Foundry) is free for commercial web use under the ITF Free Font License but may not be redistributed or modified; the files are downloaded at build time and never stored in the repository.
- [ ] **Developer credit** in the footer (`studio.developerCredit`), if they want one.
- [ ] **Privacy.** The booking form sends nothing to any server: it only opens WhatsApp with a message the visitor sends themselves. No cookies or trackers; Vercel Speed Insights (cookieless) runs only on Vercel.

## At launch

- [ ] Domain added in Vercel; `NEXT_PUBLIC_SITE_URL` set; `NEXT_PUBLIC_DEMO_MODE=false`.
- [ ] Contact details confirmed; real photos in (`npm run images:check` reports 12 real); hero contrast re-checked.
- [ ] Placeholder reviews replaced or removed.
- [ ] `npm run lint`, `npm run typecheck`, `npm run preflight` and `npx playwright test` all pass.
