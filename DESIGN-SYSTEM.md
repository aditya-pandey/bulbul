# Noor — Brand Identity & Design System

**Noor** *(नूर · نور — "light")* is a quiet, tactile poetry writer and editorial studio built to feel like a calm, native iOS publication app.

---

## 1. Brand Mark — *Dawn Light Monogram & Custom `noor` Wordmark*

- **Symbol (`noor-symbol.svg`):** An architectural folded-ribbon **N** constructed on an exact `256×256` integer grid (`60°` diagonal precision, `100/100` `svg_audit.py` score) whose right pillar parts to let a luminous **Noor Gold** (`#C48B3B`) morning sun orb shine through. Zero moon/crescent motifs; pure geometry, folded paper, and dawn light.
- **Custom Wordmark (`noor-wordmark.svg`):** Bespoke outlined lowercase **`noor`** letterforms (`100/100` `svg_audit.py` score, zero `<text>` dependency) featuring paired geometric `oo` bowls crowned by a warm Noor Gold circular light-dot.
- **Files (`assets/brand/`):**
  - `noor-symbol.svg`, `noor-symbol-small.svg` (optical `16–24px` cut), `noor-wordmark.svg`, `noor-lockup.svg`
  - iOS App Icon: `noor-app-icon.svg`, `noor-app-icon-512.png`, `apple-touch-icon.png`
  - Web Icons & monochrome variants: `assets/brand/kit/` (`favicon.ico`, `favicon.svg`, `icon-192.png`, `icon-512.png`, `maskable-512.png`, black/white/gold SVGs)
- **Clear space:** Minimum `1×` sun-orb diameter (`44u` on a `256u` grid) on all sides.

---

## 2. Colour & Surface Tokens

### Light Studio *(Alabaster Gallery)*
- `--bg: #F6F6F4` · `--surface: #FFFFFF` · `--surface-2: #EFEFEC`
- `--ink: #181614` (`17.4:1`) · `--ink-2: #57514A` (`7.3:1`) · `--ink-3: #655E55` (`5.4:1`)
- `--accent: #B87F32` (Noor Gold) · `--accent-warm: #A34A32` (Colophon Terracotta)

### Night Studio *(Velvet Obsidian)*
- `--bg: #0E0F12` · `--surface: #17191E` · `--surface-2: #22252C`
- `--ink: #F4F1EA` (`16.8:1`) · `--ink-2: #ACA69B` (`7.4:1`) · `--accent: #D9A75A`

---

## 3. Studio Craft & Capabilities
- **69 Curated Artworks** across Minimal (18), Sketches (10), Light (11), Book & Ink (16), Watercolour (14) + 14 Solid Editorial Papers (including Raw Kraft & Cotton Rag) + Custom Photo Upload.
- **32 Curated Fonts** across Classic (9), Handwriting (8), Typewriter (3), Modern (4), and हिन्दी / Devanagari (8).
- **Editorial Customisations:** Draggable poem textbox with magnetic center snap, 7 Title styles (`Classic · No Title · Drop Cap · Small Caps · Lyrical Italic · Highlight · Side Margin`), 4 Text Paper styles (`Plain · Torn Paper · Line Cut-Out · Word Cut-Out`), 4 Artwork placements (`Book Editorial · Full Canvas · Art Below · Corner Art`), 4 Paper Textures (`Fine Grain · Kraft Fiber · Cotton Rag · Smooth`), 8 Ink Colour Swatches, Line Rhythm (`Tight · Balanced · Airy`), and inline poetic emphasis (`**bold**`, `__underline__`, `*italic*`).
- **Apple-Grade Responsive Motion:** Native iOS spring curve `cubic-bezier(0.32, 0.72, 0, 1)`, frosted glass bars (`backdrop-filter: saturate(180%) blur(20px)`), staggered card reveal, smooth artwork crossfade, and iPhone Bottom Sheet inspector drawer.
