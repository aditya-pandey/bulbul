# Bulbul: Brand and design system

**Bulbul** *(बुलबुल · بلبل)* is the songbird that stands for the poet in Urdu and Persian verse.

---

## 1. Brand mark

- **Idea:** a comma that sings. The bird's body is a comma, its wing carries lines of verse, its beak is open.
- **Wordmark:** lowercase `bulbul`, drawn as paths. Every stem is cut on the slant of a reed pen.
- **Files (`assets/brand/`):** `bulbul-symbol.svg`, `bulbul-symbol-small.svg` (32px and below: no wing lines, larger eye and cheek), `bulbul-wordmark.svg`, `bulbul-lockup.svg`, `bulbul-lockup-reversed.svg`, app icons, and `kit/` (favicons, PWA icons, black and white).
- **Clear space:** the height of the cheek patch on all sides.
- **Minimum size:** symbol 16px (small cut), lockup 24px high.
- **Colour:** bird in ink or cream, cheek in red. On red, the bird is cream and the cheek is ink. Don't recolour the bird red, flip it, or close the beak.

---

## 2. Colour and surface tokens

### Light
- `--bg #F7F4EE` · `--surface #FFFDFA` · `--surface-2 #EFEAE1`
- `--ink #1C1714` · `--ink-2 #5A5048` · `--ink-3 #6B6158`
- `--accent #A82E26` · `--brand-ink #1D1A17` · `--brand-red #B3332A`

### Dark
- `--bg #12100E` · `--surface #1B1815` · `--surface-2 #29241F`
- `--ink #F3EBDD` · `--ink-2 #B5A999` · `--accent #E7766A`
- `--brand-ink #F3EBDD` · `--brand-red #E0574A`

Red marks the one primary action on a screen. Selected options use ink.

### Space, corners and type
All chrome uses these tokens (`styles.css`, `:root`). Poster styles (`.poem-*`) keep their own pixel sizes, because they are content.

| Token | Values |
|---|---|
| Space (4 px grid) | `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 20 · `--s-6` 24 · `--s-8` 32 · `--s-10` 40 |
| Corners | `--r-xs` 4 · `--r-sm` 8 · `--r-md` 12 · `--r-lg` 16 · `--r-xl` 24 · `--r-full` pill |
| Type (rem) | `--t-1` 12 · `--t-2` 13 · `--t-3` 14 · `--t-4` 16 · `--t-5` 18 · `--t-6` 24 · `--t-7` 32 · `--t-8` 52 |
| Target | `--hit` 32 px, 44 px on phones and touch |

Light or dark follows the system until someone chooses, and the browser's bar colour follows `--bg`.

### Motion
Nothing animates because the page re-rendered. Two settings, following the system until the person chooses with the motion button:
- **Full:** cards lift on hover (the frame moves, never the hit area), filtered cards glide, the poster cross-fades, carousel slides travel, a poem carries from its card to the studio.
- **Calm:** everything fades, nothing travels.

### Patterns
- **Choice:** selected states use ink. Red is the one primary action, the caret of attention on a hint, and the kept heart.
- **Pictures over words:** placement, frame, title, line and alignment are pictograms in `pictos.js` (40 x 50, interface ink), with a label below and an `aria-label`.
- **Studio:** one set of five tools, Write first: Write, Looks, Picture, Type, Page. Format, Slides, Undo and Redo live in the bar. Each change stores only the keys it touched (`recordChange`), so undo never disturbs the words.
- **Writing (`editor.js`):** a contenteditable surface that owns its nodes (`data-morph-ignore`), so renders never touch the caret or Hindi composition. It reads and writes the poem's marked-up text. Never below 18 px, so iPhones do not zoom. `--kb` lifts its bar above the keyboard. With a mouse you can also type on the page; by touch, a tap on a line opens Write at that line.
- **Breakpoints:** the phone layout is `(max-width: 600px), (max-width: 860px) and (min-height: 501px)`. A phone held sideways uses the side-by-side layout.
- **Long pages:** `isLong` (Long page, over 14 lines) turns corner and side art into `opening`. `flow` is `one`, `two` or `step`. `fitLong` sizes text to the longest line. Run art (`run: { w, top, mid, end }`) is a top, a tile and an end; the tile uses `background-repeat: round` so it always meets both ends.
- **Readable size:** words under about 10.6 px at 458 px wide raise `.full-tip` with fixes.
- **Phone panel:** `--sheet-h` 260 px, never over 40 percent. A long page keeps its size and scrolls behind it. Pickers are single rows at rest and spread into grids when pulled up. Any other poster stays whole above it.
- **Picking up:** hold the words or a keepsake and move. Guides show at the page centre. Enter edits, arrows nudge, 0 resets.
- **States:** `currentNotice()` shows one line and one action. Empty, search, failed and offline each say what happened, then what to do.
- **Keys:** `?` lists them. Tabs and menus move with arrows and return focus when they close.
- **Voice:** quiet, warm, plain. No exclamation marks, no technical words.

### Editing model
A page is a stack: picture, type, page (paper, light, frame) and words. A look sets the first three together. Every other control changes one layer and leaves the rest alone: choosing a picture keeps its placement, choosing a paper keeps the picture. Layer keys live in `LAYERS` in `data.js`.

Every transition runs between 160 and 460 ms. Only ambient loops on the home page (the swaying branch, falling petals, the bird's breathing) and the shimmer and ring while something is being made last longer, and they stop in Calm. On Android, in Full, a light vibration marks a centre snap, a keepsake landing, a look kept, and an image or backup saved.

### Illustration
Gouache shapes with a wobbling edge and dry-brush texture over a watercolour bloom. Figures are seen from behind or without features. Madder, vermilion, turmeric, indigo, teal and sage on warm paper. Transparent WebP, square for Stories, 2:1 for landscapes.

Other families keep one rule each: **folk** uses its own pattern language; **print** is flat colour with gouged or grainy edges; **line** is one weight with a single red accent; **night** is drawn for dark pages. Woven and printed frames are 300 px tiles (100 px slices) used as border images, so they fit any format.

---

## 3. Studio Craft & Capabilities
- **132 artworks** (63 original), 24 papers, 8 textures, 12 frames and custom photos; **103 Looks**; watercolour, light and keepsake layers.
- **50 fonts:** Classic (12), Handwriting (14), Typewriter (4), Modern (4), हिन्दी (16).
- **Editorial Customisations:** Draggable poem textbox with magnetic center snap, 7 Title styles (`Classic · No Title · Drop Cap · Small Caps · Lyrical Italic · Highlight · Side Margin`), 7 text styles (`Plain · Torn Paper · Line Cut-Out · Word Cut-Out · Underlined · Highlighter · Blackout`), 7 artwork placements (`Book Editorial · Full Canvas · Art Below · Corner Art · Landscape · Arch Window · Taped Print`), 4 Paper Textures (`Fine Grain · Kraft Fiber · Cotton Rag · Smooth`), 8 Ink Colour Swatches, Line Rhythm (`Tight · Balanced · Airy`), and inline poetic emphasis (`**bold**`, `__underline__`, `*italic*`).
