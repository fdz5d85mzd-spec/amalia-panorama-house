# AmaLia PanoRama House

Next.js 14 (App Router) + TypeScript + Tailwind. Ready-to-deploy build with
real property photos and a 4-language switcher.

## Τι περιλαμβάνει αυτή η έκδοση

- Project setup (Next.js + TS + Tailwind)
- Responsive layout, πλοήγηση (`components/Navigation.tsx`) — διάφανη πάνω
  στο hero, συμπαγής στο scroll, mobile menu
- Hero (`components/Hero.tsx`) — πραγματική φωτογραφία θέας, αργή κίνηση
  ("Ken Burns")
- Introduction, Rooms (με πραγματικές φωτογραφίες κάθε δωματίου)
- **Gallery** (`components/Gallery.tsx`) — mosaic grid με 8 πραγματικές
  φωτογραφίες του σπιτιού
- Experiences strip — Κούριο, Όμοδος, Λεμεσός
- Footer
- **Πολυγλωσσία**: Ελληνικά / English / Deutsch / Русский μέσω
  `lib/i18n.ts` + `components/LanguageProvider.tsx` (client-side switcher —
  σωστό επόμενο βήμα για Sprint 4 είναι ξεχωριστά URLs ανά γλώσσα, π.χ.
  `/en/`, για SEO)
- Scroll reveal animations (`components/Reveal.tsx`)
- Design system: `tailwind.config.ts`, `app/globals.css`

## Design system

- **Χρώματα**: limestone (πέτρα), ink (κείμενο), copper (CTA/accent), wine
  (κρασί Τροόδους), olive (αμπέλι) — εμπνευσμένα από το ίδιο το σπίτι.
- **Γραμματοσειρές**: Fraunces (τίτλοι), Karla (κείμενο), Space Mono
  (μικρές λεπτομέρειες).
- **Signature element**: `components/TerraceDivider.tsx` — γραμμές που
  μικραίνουν σαν τις πεζούλες των αμπελιών γύρω από το Σούνι.

## Πώς να το κάνεις publish (δωρεάν, μέσω Vercel)

1. Αποσυμπίεσε το zip και κάνε push σε ένα νέο GitHub repo:
   ```bash
   cd amalia-panorama-house
   git init
   git add .
   git commit -m "Amalia Panorama House"
   git branch -M main
   git remote add origin https://github.com/<το-username-σου>/amalia-panorama-house.git
   git push -u origin main
   ```
2. Πήγαινε στο https://vercel.com και συνδέσου με τον GitHub λογαριασμό σου.
3. "Add New Project" → επίλεξε το repo `amalia-panorama-house`. Το Vercel
   αναγνωρίζει αυτόματα ότι είναι Next.js — καμία ρύθμιση δεν χρειάζεται.
4. Πάτα **Deploy**. Σε ~1 λεπτό θα έχεις δωρεάν link τύπου
   `amalia-panorama-house.vercel.app`.
5. Κάθε επόμενο `git push` στο `main` κάνει αυτόματα re-deploy το site.

Όταν αποκτήσεις δικό σου domain: Vercel dashboard → Project → Settings →
Domains, 2 λεπτά δουλειά.

## Εκτέλεση τοπικά (προαιρετικό, πριν το push)

```bash
npm install
npm run dev
```

Ανοίξτε http://localhost:3000

## Επόμενα βήματα

- Booking widget, weather, Google Maps (Sprint 2 υπόλοιπο)
- About/FAQ ως ξεχωριστές σελίδες, Reviews, Contact form (Sprint 3)
- SEO, i18n routing ανά γλώσσα, Airbnb calendar sync (Sprint 4)
