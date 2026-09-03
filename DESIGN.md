# Design

<!-- impeccable:design-schema 1 -->

## World

Night ridge. Quiet graphite field with an ink mountain hero — infrastructure under the thing you ship, not a neon tool dashboard.

Brief-pinned from user references (ink linocut mountains, TURA graphite panels, OUTER mono metadata; red accent dropped). Mode: Persuade on marketing surfaces.

## Palette

| Token | Hex | Role |
|-------|-----|------|
| Ground | `#0e0f11` | Page field |
| Panel | `#15171a` | Soft-shadow wells |
| Panel lift | `#1c1f23` | Pro / elevated panels |
| Stone | `#8a8f96` | Secondary text, outlines |
| Snow | `#f2f1ec` | Display type, primary CTAs |
| Mist | `#a9b8c6` | Links, focus, active nav |
| Danger | `#b5554a` | Errors (muted brick) |
| Ok | `#7a9a7e` | Success (muted sage) |

Color strategy: Restrained monochrome with mist as the single cool accent. No neon, no glow, no mesh grid.

## Type

- Display: **Albert Sans**
- Body: **Hanken Grotesk**
- Data / labels: **Geist Mono**

Display headings are sentence case. Uppercase tracking reserved for mono micro-labels (`.land-band`, `.index-num`, nav).

## Components

- White line-stroke compass mark (brand)
- Soft-shadow graphite panels (`.plot-window`)
- Snow filled / stone outline buttons (`.mark-btn`, `.secondary`)
- Ink mountain hero (`/art/ridge-hero.png`) + SVG ridge divider (`Ridge.astro`)
- Indexed product list with hairlines (not icon cards)

## First surface

Landing: headline in empty sky above the ridge; primary CTA “Repair broken JSON”; SchemaBench panel overlapping the ridge base; product index on solid ground.

## Motion

One authored rise: hero copy and mountain fade/translate up (~1.2s). Panel hover lifts shadow. Disabled under `prefers-reduced-motion`.

## Do not

- Neon orange, glow halos, cathode mesh
- Cream/paper full-page grounds
- Inter / Space Grotesk / DM Sans as display
- Eyebrow kickers above headings
- Icon+heading+text card grids as page structure
- Fabricated testimonials or MRR
