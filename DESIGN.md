# Design

<!-- impeccable:design-schema 1 -->

## World

Marine plotting sheet / chart table. The product is navigational infrastructure for solo builders — you take a fix, plot a bearing, ship.

Seed: `63f07665` · grounded index 4 (marine plotting sheet) · mode Persuade.

## Palette

| Token | Hex | Role |
|-------|-----|------|
| Sea | `#0a5f6b` | Page ground |
| Sea deep | `#063a42` | Code wells, depth |
| Land | `#d9a441` | Ochre bands, links |
| Magenta | `#d0127a` | Compass ink, CTAs, active bearings |
| Paper | `#f3f7f8` | Plot windows, body on sea |
| Ink | `#101418` | Text on paper/land |

Color strategy: Full palette from chart materials. Light paper windows punched into a committed teal sea (daylight nav station, not neon-on-black).

## Type

- Display / labels: **Geologica**
- Body: **Atkinson Hyperlegible**
- Data / code: **Spline Sans Mono**

## Components

- Magenta compass rose mark (brand + hero)
- Land bands (uppercase Geologica strips)
- Plot windows (paper cards for tools/docs)
- Mark buttons (clipped parallelogram CTAs)
- Bearings nav (uppercase links with magenta underline)

## First surface

Landing page: rose + three rhumb lines (Forms / Catch / Schema) beside the pitch; live Schema repair bench as the primary proof in the first scroll.

## Motion

One authored settle: rose rotates into place; rhumb lines draw. Disabled under `prefers-reduced-motion`.

## Do not

- Cream/paper full-page grounds
- Inter / Space Grotesk / DM Sans stacks
- Eyebrow kickers
- Icon+heading+text card grids as page structure
- Fabricated testimonials or MRR
