# UI_SPEC — Prime Khatab Deals (plain directory build)

Build to these values exactly. If a component needs a value that is not here,
pick the nearest value from this file — do not invent a new one.

## Sources & what was taken / rejected

- **UI UX Pro Max skill** (`.claude/skills/ui-ux-pro-max` + `ui-styling`):
  adopted platform rules only — WCAG AA contrast ≥ 4.5:1 for body text,
  visible `:focus-visible` outlines, touch targets ≥ 40px (drawer rows 44px),
  ≥ 8px spacing between adjacent targets, SVG icons instead of emoji,
  design tokens instead of ad-hoc values, sequential heading order,
  sticky header must not overlap content.
  Its `--design-system` search suggested a marketing pattern (hero, feature
  showcase, Rubik/Nunito, green/orange palette) — **rejected**: the owner
  banned heroes, marketing copy and extra colours.
- **Resourify** (resourify.com, fetched 25 Nov 2026): text-first directory.
  One-line site description, "Last updated …" meta line, then dense deal
  rows: small brand logo + plain-language deal summary. No hero theatre.
- **GrabOn** (grabon.in): card anatomy = offer figure first ("Up To 45% OFF"),
  one-line title, ONE flat CTA button with a verb ("GRAB NOW"). Category tab
  row. Store/logo grids are plain and dense.
- **DesiDime** (desidime.com): feed rows — thumbnail left, title, relative
  timestamp in grey, one-line excerpt. Boring, scannable, high density.
- **Zoutons** (zoutons.com): coupon list rows — discount block, title, code
  in a mono chip, one "View Code" button, small grey meta ("17 active
  offers"). Same anatomy repeated for every item.

**What makes them look real:** list density over big cards; the offer figure
is the visual anchor; exactly one flat CTA per item; small grey meta text;
category nav as plain tabs/links; one system sans at small sizes; nothing
glows, floats or shines.

## Tokens

### Colour (flat hex, no gradients anywhere)

| Role | Hex | Use |
|---|---|---|
| primary | `#2563eb` | primary buttons, active chips, links hover, badge |
| primary-hover | `#1d4ed8` | hover state of primary only |
| heading | `#0f172a` | headings, card titles |
| body | `#334155` | normal text, drawer rows |
| muted | `#64748b` | descriptions, meta, footer links |
| faint | `#94a3b8` | timestamps, section labels, disclosure |
| border | `#e2e8f0` | card/header/footer borders, dividers |
| border-strong | `#cbd5e1` | button/input borders, inactive chip borders |
| surface | `#ffffff` | page + cards |
| surface-alt | `#f8fafc` | hover backgrounds, figure panel on deal page |
| chip-bg | `#f1f5f9` | inactive hashtag chips |

### Type — Inter only (no display font)

| Element | Size | Weight | Colour |
|---|---|---|---|
| Body / UI text | 14px / 1.5 | 400 | body |
| Page heading (H1) | 24px / 1.25 | 700 | heading |
| Section heading (H2) | 18px / 1.3 | 600 | heading |
| Card title | 15px / 1.35 | 600 | heading, max 2 lines |
| Card description | 13px / 1.5 | 400 | muted, max 3 lines |
| Meta / timestamps | 12px | 400 | faint |
| Button label | 14px | 600 | — |
| Chip label | 13px | 500 | — |
| Wordmark | 17px | 700 | heading ("Deals" in primary) |
| Promo code | 14px mono | 700 | heading |

### Spacing scale

4 / 8 / 12 / 16 / 24 / 32 / 48 px only. Page container: max-width 1152px,
side padding 16px. Section gap 32px. Grid gap 16px.

### Radius

Buttons/inputs/cards/logo tiles: 8px. Chips: 999px. Badge: 4px.
Nothing uses 16px+ radius.

### Shadows

None. Borders do the separation. (Backdrop for the drawer is a flat
`rgba(15,23,42,0.4)` overlay — not a shadow.)

## Components

### Buttons

- Height 40px, padding 0 16px, radius 8px, font 14px/600.
- Primary: flat `#2563eb` bg, white text. Hover: `#1d4ed8`. Nothing else
  changes on hover — no scale, no shadow, no shine, no transition of
  transform.
- Secondary: white bg, 1px border `#cbd5e1`, text `#334155`.
  Hover: bg `#f8fafc`.
- Focus: 2px outline `#2563eb`, offset 2px (`:focus-visible`, global CSS).

### Header (sticky, white)

- Border-bottom 1px `#e2e8f0`. Inner row: padding 12px 16px, gap 12px.
- Order: menu button → logo (36×36, radius 8px) + wordmark → search
  (flex-1) → Submit a Deal (primary button, hidden below md).
- Mobile: search wraps to a second row inside the header.
- Search input: height 40px, radius 8px, border `#cbd5e1`, 14px text,
  magnifier SVG 16px in `#94a3b8` at left 12px. Focus: border `#2563eb` +
  2px ring `rgba(37,99,235,0.2)`.

### Menu button + drawer (the three-dots)

- Button: 40×40px, radius 8px, white bg, 1px border `#cbd5e1`. Icon: SVG
  three vertical dots, circles r=1.8 in a 24 viewBox, fill `#334155`,
  evenly spaced (cy 5/12/19). Hover: bg `#f8fafc`. `aria-label="Open menu"`,
  `aria-expanded` reflects state.
- Drawer: `position: fixed`, left edge, top 0, **full height (100dvh)**,
  width 300px (max 86vw), white bg, border-right 1px `#e2e8f0`, own
  vertical scroll (`overflow-y: auto`). Slides with a 200ms transform
  transition (functional motion only). NOT a dropdown, NOT a popup.
- Backdrop: fixed inset 0, flat `rgba(15,23,42,0.4)`, click closes.
  Escape closes. Clicking any link closes.
- Drawer header row: wordmark + close button (32×32, border `#e2e8f0`),
  border-bottom `#e2e8f0`, padding 14px 20px.
- Drawer sections: "All Categories" (the 11 categories), "Deal Types"
  (Freebies, Discounts, Trials, Credits, Promo Codes, No Credit Card),
  "Pages" (Home, Categories, About, Submit a Deal, Privacy Policy, Terms).
- Section label: 11px, 600, uppercase, letter-spacing 0.08em, `#94a3b8`,
  padding 20px 20px 4px.
- Row: min-height 44px, padding 10px 20px, 14px text `#334155`, chevron
  "›" in `#cbd5e1` at right. Hover: bg `#f8fafc`, text `#2563eb`.
  **No counts, no badges in the drawer.**

### Category chips row (under the header, top of home)

- "All" + the 11 categories, links or filter buttons.
- Height 32px, padding 0 12px, radius 999px, 13px/500.
- Active: bg `#2563eb`, border `#2563eb`, white text.
- Inactive: white bg, border `#cbd5e1`, text `#334155`; hover border
  `#94a3b8`. Row gap 8px, wraps.

### Deal-type chips

Same as category chips, height 30px: All, Freebies, Discounts, Trials,
Credits, Promo Codes, No Credit Card.

### Deal card

- White bg, 1px border `#e2e8f0`, radius 8px, padding 16px. No shadow,
  no hover lift — hover only darkens the border to `#cbd5e1`.
- Top row: logo tile 48×48 (radius 8px, border `#e2e8f0`, image
  object-contain with 6px padding; fallback = flat `#2563eb` tile with the
  brand initial in white 18px/700) + badge at right.
- Badge: flat `#2563eb` bg, white, 12px/700, radius 4px, padding 2px 8px.
- Brand line: 11px, 600, uppercase, letter-spacing 0.06em, `#94a3b8`.
- Title 15px/600 heading colour, links to the deal page.
- Description 13px muted, 3-line clamp.
- Hashtag chips: bg `#f1f5f9`, text `#64748b`, 11px/600, radius 999px,
  padding 2px 8px.
- Footer: border-top 1px `#f1f5f9`, padding-top 12px, margin-top 12px:
  Copy Code (primary button) or Get Deal (primary button) + expiry text
  12px faint at right ("Expires 12 Jan 2027" / "12d left").

### Code box (deal page)

- Dashed 1.5px border `#cbd5e1`, bg `#f8fafc`, radius 8px. Code in mono
  14px/700. Attached Copy button = primary button style.

### Deal page

- Breadcrumb 13px muted. Poster image (if `imageUrl`) full-width,
  radius 8px, border `#e2e8f0`.
- Header: logo tile 80×80, H1 24px/700, meta line 13px muted.
- Offer figure panel: flat `#f8fafc` bg, border `#e2e8f0`, radius 8px;
  figure 32px/800 `#0f172a`; no gradient text.
- Benefits / steps: plain bordered rows (1px `#e2e8f0`, radius 8px,
  padding 12px 16px, 14px text) with a small flat number/check marker.
- Similar deals: the same card grid (no rails/carousels).

### Empty state (home + category pages, when there are 0 deals)

Centred block, padding 64px 16px, nothing else in main:
- H1/H2 "No deals yet" — 20px/600 `#0f172a`.
- One line, 14px `#64748b`: "New offers are added regularly. Check back soon."
- "Submit a Deal" primary button below.
No illustrations, no icons, no counts, no placeholder cards.

### Footer

- Border-top 1px `#e2e8f0`, white bg, padding 32px 16px.
- Col 1: logo + wordmark, one line 13px muted, contact email link.
- Link columns: heading 13px/600 `#0f172a`; links 13px `#64748b`,
  line-height 2, hover `#2563eb`. Columns: Categories / Pages
  (Categories, About, Submit a Deal, Privacy Policy, Terms).
- Bottom strip: affiliate disclosure + trademark disclaimer, 12px
  `#94a3b8`, then copyright line 12px `#94a3b8`.
- No pill clouds, no brand lists.

## Hard rules (owner — override everything above on conflict)

1. No gradients anywhere — buttons, badges, tiles, text, panels.
2. No glow/coloured shadows, no shine, no float/glow decoration,
   no hover animations beyond a flat colour change.
3. No hero, no announcement bar, no marketing copy, no stat pills,
   no newsletter band, no rails (New Arrivals / Trending / Spotlight /
   Recently Verified render nothing — they do not exist).
4. No dummy data: no invented views/clicks/counts anywhere, including
   the drawer and footer. A number may appear only if it is a field of
   a real deal (expiry, dates).
5. Sections render nothing when their data is empty.
6. One font (Inter), one accent colour (`#2563eb`), white background.
