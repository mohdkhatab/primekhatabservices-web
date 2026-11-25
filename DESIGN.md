# Prime Khatab Deals — Design System

Layout system modelled on a Resourify-style deal-directory structure (announcement
bar → sticky header with left category drawer + search → split hero with featured
poster → New Arrivals rail → brand Spotlight → Trending rail → Recently Verified
list → Browse explorer → newsletter → disclosure footer), re-skinned entirely in
our own brand. Structure is borrowed; all copy, colours and graphics are our own.

## Colours (white + royal blue ONLY)

- Base / surface: white `#ffffff`, tinted panels `blue-50` → `blue-100`
- Primary accent: royal blue only — `brand` scale in `tailwind.config.ts`
  (blue-500 `#3b82f6`, primary buttons blue-600 `#2563eb` → blue-700 `#1d4ed8`,
  sky-500 allowed inside the blue gradient family)
- Text: slate-900 headings, slate-500/600 body, slate-400 meta
- Never: pink, rose, fuchsia, amber, orange, green, dark theme

## Type

- Display/headings: Sora (600–800), tight tracking on H1
- Body/UI: Inter
- Promo codes: monospace, bold, inside a dashed blue border box

## Components

- Header: three-dots (⋮) button on the LEFT opens a slide-in drawer with all
  categories (live deal counts), deal types and quick links; logo next to it,
  search in the centre, "Submit a Deal" pill on the right
- Buttons: blue gradient pill (primary, with shine sweep + glow shadow),
  white/blue-ring pill (secondary)
- Cards: white, `rounded-2xl`, blue-100 border, soft blue shadow;
  hover = lift + blue-300 border + deeper blue shadow
- Brand logos: REAL images supplied per-deal via `logo_url` / `image_url`
  (the admin pastes any CDN/image link when adding a deal; `components/BrandTile.tsx`
  renders it). Fallback when a deal has no logo (or the image fails) is a
  deterministic royal-blue initial tile — same brand, same shade, every time
- Poster images: `image_url` renders as the hero featured-poster and as the
  banner across the top of the deal detail page
- Badges: gradient pill for the offer figure, tinted pills for status
  (New / Limited Time / Active), hashtag chips for topic + deal type

## Data honesty rule

- NO dummy numbers anywhere: no invented views, clicks, subscriber counts or
  testimonials. Every number on the site is computed from the real deals data
  (live deal counts, category counts) or is a real field of the deal itself
  (listed/verified date, expiry countdown).

## Motion (CSS/Tailwind only, no heavy libs)

- `fade-up` staggered entrances, `float` ambient hero glows,
  animated gradient headline text, button shine on hover, copy-button pop,
  left drawer slide-in with backdrop blur

## Iconography & Graphics

- No icon font/library; simple unicode glyphs (✓ ⏳ ⌕ ↗ ⋮) in blue/slate
- Site logo: `public/logo.png`; social share image: `public/og-image.jpg`
  (1200×630); favicon set: `app/icon.png` + `public/favicon.ico`,
  `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`
