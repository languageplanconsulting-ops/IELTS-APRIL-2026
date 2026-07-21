# Brand webfonts (licensed — not committed)

The speaking journey headlines use **Galaxie Copernicus** and all other Latin
text uses **Styrene B**. These are paid, licensed faces and are deliberately
**not** in the repo:

- Galaxie Copernicus — Village (villagetype.com)
- Styrene B — Commercial Type (commercialtype.com)

Thai text uses **Anuphan**, which is loaded free from Google Fonts in
`index.html` — nothing to add for Thai.

## What to drop here

Export/convert your licensed files to `.woff2` and place them in this folder
with these exact names (referenced by `@font-face` in `src/index.css`):

| File | Weight |
| --- | --- |
| `GalaxieCopernicus-Book.woff2` | 400 |
| `GalaxieCopernicus-Medium.woff2` | 500 |
| `GalaxieCopernicus-Bold.woff2` | 700 |
| `StyreneB-Regular.woff2` | 400 |
| `StyreneB-Medium.woff2` | 500 |
| `StyreneB-Bold.woff2` | 700 |

If you only have `.otf`/`.ttf`, convert to `.woff2` first (e.g. `fonttools`,
or an offline converter you're licensed to use).

Until these files are present, Copernicus falls back to Anuphan/Georgia and
Styrene B falls back to Anuphan/Inter. The layout does not break — only the
Latin typeface changes.

To use different filenames or add more weights, edit the `@font-face` block at
the top of `src/index.css`.
