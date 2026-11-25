# Prime Khatab Deals — Design System

Layout system modelled on a Resourify-style deal-directory structure (announcement
bar → sticky header with search → featured hero poster → arrivals → brand
spotlight → trending carousel → verified rich list → browse explorer →
newsletter → disclosure footer), re-skinned entirely in our own brand.
Structure is borrowed; all copy, colours and graphics are our own.

## Colours (white + pink ONLY)

- Base / surface: white `#ffffff`, tinted panels `pink-50` → `pink-100`
- Primary accent: pink family only — `brand` scale in `tailwind.config.ts`
  (pink-500 `#ec4899` → rose-500 `#f43f5e`, light fuchsia for gradients)
- Text: stone-900 headings, stone-500/600 body, stone-400 meta
- Never: blue, navy, amber, orange, green, dark theme

## Type

- Display/headings: Sora (600–800), tight tracking on H1
- Body/UI: Inter
- Promo codes: monospace, bold, inside a dashed pink border box

## Components

- Buttons: pink gradient pill (primary, with shine sweep + glow shadow),
  white/pink-ring pill (secondary)
- Cards: white, `rounded-3xl`, pink-100 border, soft pink shadow;
  hover = lift + pink-300 border + deeper pink shadow
- Brand logos: code-drawn initial tiles (`components/BrandTile.tsx`) —
  pink gradient shade picked deterministically per brand; never hotlink logos
- Badges: gradient pill for the offer figure, tinted pills for status
  (New / Limited Time / Trending / Active), hashtag chips for topic + deal type

## Motion (CSS/Tailwind only, no heavy libs)

- `fade-up` staggered entrances, `float` ambient hero glows,
  animated gradient headline text, button shine on hover, copy-button pop

## Iconography & Graphics

- No icon font/library; simple unicode glyphs (✓ ⚡ 👁 ↗) in pink/stone
- All graphics drawn from the pink tokens above; favicon is a pink-gradient
  "PK" SVG (`app/icon.svg`)
