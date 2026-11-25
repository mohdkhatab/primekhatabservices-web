# Prime Khatab Deals — Design System

A plain deal directory, not a marketing site. The full, binding spec with
concrete values lives in **UI_SPEC.md** (project root) — this file is the
short version. Real Indian coupon directories (GrabOn, DesiDime, Zoutons,
Resourify) are the reference: dense, scannable, boring in a good way.

## Layout

Sticky plain header (three-dots menu button → full-height left drawer with
all categories → logo + wordmark → search → Submit a Deal) → category
chips → deal-type chips → deals grid → plain footer. That is the whole
home page. Deal pages keep only functional blocks: poster, code box,
benefits, how to redeem, FAQ, similar deals.

**There is no hero, no announcement bar, no newsletter band, no rails
(New Arrivals / Trending / Spotlight / Recently Verified), no stat pills,
no marketing copy.** Sections render nothing when their data is empty.

## Colours (white + royal blue ONLY, all flat)

- Surface: white `#ffffff`; alt surface `#f8fafc`
- Primary: royal blue `#2563eb`, hover `#1d4ed8` — the only accent
- Text: `#0f172a` headings, `#334155` body, `#64748b` muted, `#94a3b8` faint
- Borders: `#e2e8f0`, strong `#cbd5e1`
- **No gradients anywhere. No glow or coloured shadows. No shadows at all —
  borders do the separation.**

## Type

- One font: **Inter**. Body 14px, card titles 15px semibold, page
  headings 24px bold, section headings 18px semibold, meta 12px.
- No display typeface, no oversized headlines, no gradient text.

## Components

- Buttons: flat solid `#2563eb` (or white with a `#cbd5e1` border),
  40px tall, radius 8px, 14px semibold. Hover = the flat colour darkens.
  No shine, no scale, no shadow, no animation.
- Cards: white, 1px `#e2e8f0` border, radius 8px, padding 16px. Real
  brand logo image (per-deal `logo_url`); fallback is a flat blue initial
  tile. Flat blue badge (radius 4px) carries the offer figure.
- Chips: 999px pills; active = flat blue, inactive = white with border.
- Drawer: fixed, full-height, 300px, white, plain list rows (min 44px)
  with a small chevron; no counts or badges inside.
- Icons: inline SVG only (menu dots, search). No emoji icons.

## Data honesty rule

No dummy data, ever: no invented views, clicks, counts or claims. A
number appears only when it is a field of a real deal (expiry, dates).
With zero deals the site shows one centred empty state — "No deals yet /
New offers are added regularly. Check back soon." — and nothing else.

## Motion

Functional only: the drawer slides (200ms) so users can see where it came
from. Nothing else animates.
