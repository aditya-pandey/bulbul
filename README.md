# Bulbul: Poetry studio

**Bulbul** *(बुलबुल · بلبل, the songbird that stands for the poet in Urdu and Persian verse)* is a standalone poetry writer and page studio with zero build steps.

## Highlights
- **Identity ([DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)):** a comma that is also a crested bulbul, with a custom-drawn `bulbul` wordmark in ink and red.
- **Steady interface:** `morph.js` patches the page in place, so scroll, focus, images and typing survive every click. Never assign `innerHTML` on `#app`.
- **69 Curated Artworks + 14 Editorial Papers:** Minimal & Spot (18), Sketches (10), Light (11), Book & Ink (16), Watercolour & Gouache (14), including Indian poetic corner art (`Saffron Cycle`, `Lotus & Ribbon`, `Misty Sage`, `Dusk Lantern`), Audubon bird plates, and custom photo upload.
- **32 Curated Google Fonts:** Classic (9), Handwriting (8), Typewriter (3), Modern (4), and हिन्दी / Devanagari (8).
- **Deep Yet Effortless Customisations:**
  - **Draggable Textbox** with live pointer drag & magnetic center snap
  - **7 Title Styles** (`Classic`, `No Title`, `Drop Cap`, `Small Caps`, `Lyrical Italic`, `Highlight`, `Side Margin`)
  - **4 Text Paper Styles** (`Plain`, `Torn Paper`, `Line Cut-Out`, `Word Cut-Out`) + inline `**bold**` / `__underline__` / `*italic*`
  - **4 Paper Textures** (`Fine Grain`, `Kraft Fiber`, `Cotton Rag`, `Smooth`), **8 Ink Swatches**, and **Line Rhythm**
  - **Long-Poem Engine:** Auto-Fit Typography, Live Multi-Slide Instagram Carousel (`---` manual breaks or smart stanza balancing), and Unclipped Long Page tall PNG export.
- **Native iOS Responsive UX:** Frosted translucent chrome, iPhone bottom tab dock (`Artwork · Fonts · Style · Write`), spring-animated bottom sheet inspector, and offline PWA support.

## Local Preview & Deploy
Zero build step — deploy directly to Netlify, GitHub Pages, or Vercel.
```bash
python3 -m http.server 4174 --directory .
```
