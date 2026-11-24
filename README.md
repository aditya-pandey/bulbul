# Bulbul

*For words that sing*

**Bulbul** *(बुलबुल · بلبل, the songbird that stands for the poet in Urdu and Persian verse)* is a standalone poetry writer and page studio with zero build steps.

## Highlights
- **Identity ([DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)):** a comma that is also a crested bulbul, with a custom-drawn `bulbul` wordmark in ink and red.
- **Steady interface:** `morph.js` patches the page in place, so scroll, focus, images and typing survive every click. Never assign `innerHTML` on `#app`.
- **A home that grows:** a gulmohar branch with a blossom per poem, a bulbul that hops to the one you hover and recites your lines, a daily spark and looks to start from.
- **One tab, one layer:** `Looks` sets the whole page (with undo). `Picture`, `Type` and `Page` each change only their own part, and show a dot when they differ from the look. `Words` is for writing. Everything can be undone.
- **Share without a server:** copy the page as an image, download it, or prepare it for WhatsApp, Instagram, Stories, Pinterest, X, Threads and Facebook at the right size, with a preview. The preview itself can be saved or copied as a 1080 × 1350 mockup on a choice of six backdrops, transparent included. Phones get the system share sheet. Nothing is uploaded by Bulbul; poems are kept in the browser.
- **Examples:** 17 pages made from six poems by Aditya (`examples.js`), each viewable, copyable and reusable as a style.
- **92 one-tap Looks** (Illustrated, Folk, Print, Line, Night, Light, Paper, Painted), previewed with your own poem. Hindi poems get a Devanagari face automatically.
- **121 artworks, 24 papers and 12 frames:** 52 original pieces drawn for Bulbul, from gouache stories to Warli, Madhubani, Gond, linocut, cyanotype, paper-cut, riso, one-line and ink wash, plus museum art, sketches, light, book and watercolour, and custom photo upload.
- **Finishing layers:** watercolour washes, light and shadow (window, palm, leaves, golden hour, old film) and keepsakes (postage, wax seal, washi tape, pressed fern, marigolds, petals, chai ring, red thread).
- **50 Google Fonts:** Classic (12), Handwriting (14), Typewriter (4), Modern (4) and हिन्दी (16).
- **Deep Yet Effortless Customisations:**
  - **Draggable Textbox** with live pointer drag & magnetic center snap
  - **7 Title Styles** (`Classic`, `No Title`, `Drop Cap`, `Small Caps`, `Lyrical Italic`, `Highlight`, `Side Margin`)
  - **7 Text Styles** (`Plain`, `Torn Paper`, `Line Cut-Out`, `Word Cut-Out`, `Underlined`, `Highlighter`, `Blackout`) + inline `**bold**` / `__underline__` / `*italic*`
  - **4 Paper Textures** (`Fine Grain`, `Kraft Fiber`, `Cotton Rag`, `Smooth`), **8 Ink Swatches**, and **Line Rhythm**
  - **Long-Poem Engine:** Auto-Fit Typography, Live Multi-Slide Instagram Carousel (`---` manual breaks or smart stanza balancing), and Unclipped Long Page tall PNG export.
- **Native iOS Responsive UX:** Frosted translucent chrome, iPhone bottom tab dock (`Looks · Picture · Type · Page · Words`), a bottom sheet you drag down to close or up to enlarge while the dock stays in reach, swipes between slides, and offline support.

- **What you see is what you save:** `snapshot.js` paints the real poster markup from `sheet.js` into the PNG, so a new style needs CSS only.

## Local Preview & Deploy
Zero build step — deploy directly to Netlify, GitHub Pages, or Vercel.
```bash
python3 -m http.server 4174 --directory .
```
