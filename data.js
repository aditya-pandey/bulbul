export const ARTWORKS = [
  // Sketches — Pencil, Graphite, Charcoal & Fine Pen-and-Ink
  { id: 'sketch-unravel', grp: 'sketch', name: 'Unraveling Ink', src: './assets/art/sketch-unravel.svg', bg: '#FFFFFF', bg2: '#FAF9F7', dark: false, ink: '#1A1816', sub: '#544E47', acc: '#6D443B', mat: '#FFFFFF', blend: 'multiply', contain: true, defLayout: 'side', defTextStyle: 'plain', filter: '' },
  { id: 'sketch-sargent-lily', grp: 'sketch', name: 'Pencil Lily', src: './assets/art/sketch-sargent-lily.jpg', bg: '#FFFFFF', bg2: '#FAF9F6', dark: false, ink: '#1A1A1A', sub: '#555555', acc: '#3A3A3A', mat: '#FFFFFF', blend: 'multiply', defLayout: 'side', filter: 'contrast(1.18) brightness(1.05)' },
  { id: 'bocagea-ink', grp: 'sketch', name: 'Botanical Ink', src: './assets/art/bocagea-ink.jpg', bg: '#FFFFFF', bg2: '#FAF9F6', dark: false, ink: '#181818', sub: '#525252', acc: '#2C2C2C', mat: '#FFFFFF', blend: 'multiply', defLayout: 'side', filter: 'contrast(1.14) saturate(0)' },
  { id: 'sketch-sargent-rose', grp: 'sketch', name: 'Rose Sketch', src: './assets/art/sketch-sargent-rose.jpg', bg: '#F7F4EE', bg2: '#EFEAE0', dark: false, ink: '#1E1C19', sub: '#56514A', acc: '#4A453E', mat: '#FCFBF8', blend: 'multiply', defLayout: 'side', vignette: true, filter: 'contrast(1.36) brightness(1.18) saturate(0)' },
  { id: 'sketch-sargent-portrait', grp: 'sketch', name: 'Charcoal Muse', src: './assets/art/sketch-sargent-portrait.jpg', bg: '#F8F5EE', bg2: '#EFE9DD', dark: false, ink: '#1D1A17', sub: '#554E46', acc: '#463E36', mat: '#FDFBF7', blend: 'multiply', vignette: true, defLayout: 'side', filter: 'contrast(1.32) brightness(1.18) saturate(.10)' },
  { id: 'sketch-redon-flower', grp: 'sketch', name: 'Bloom & Profile', src: './assets/art/sketch-redon-flower.jpg', bg: '#ECE2D0', bg2: '#E2D4BC', dark: false, ink: '#241B14', sub: '#5A4A3D', acc: '#7B583B', mat: '#F9F4EB', blend: '', defLayout: 'side', filter: '' },
  { id: 'sketch-klimt-profile', grp: 'sketch', name: 'Ochre Profile', src: './assets/art/sketch-klimt-profile.jpg', bg: '#E5D1B1', bg2: '#DAC19A', dark: false, ink: '#241A12', sub: '#594635', acc: '#855832', mat: '#F8F1E5', blend: '', defLayout: 'side', filter: '' },
  { id: 'sketch-durer-hands', grp: 'sketch', name: 'Quiet Hands', src: './assets/art/sketch-durer-hands.jpg', bg: '#20323E', bg2: '#182731', dark: true, ink: '#F4F2EC', sub: '#BCC9D2', acc: '#D8E2E8', mat: '#F3F6F8', blend: '', defLayout: 'side', filter: '' },
  { id: 'sketch-redon-window', grp: 'sketch', name: 'Arched Window', src: './assets/art/sketch-redon-window.jpg', bg: '#221D18', bg2: '#191511', dark: true, ink: '#F5EFE4', sub: '#C8BCA8', acc: '#DFBE84', mat: '#F8F4EC', blend: '', defLayout: 'side', filter: '' },
  { id: 'sketch-redon-tree', grp: 'sketch', name: 'Charcoal Tree', src: './assets/art/sketch-redon-tree.jpg', bg: '#28221A', bg2: '#1E1913', dark: true, ink: '#F4EEE3', sub: '#C7BCAB', acc: '#D8B982', mat: '#F7F3EA', blend: '', defLayout: 'side', filter: '' },

  // Light — Sunbeams, Golden Dawn, Window Light & Glowing Skies
  { id: 'light-sunbeams', grp: 'light', name: 'Sunbeams', src: './assets/art/light-sunbeams.jpg', bg: '#2A3036', bg2: '#1F2429', dark: true, ink: '#F5F4EE', sub: '#C4C9CE', acc: '#E6D6AE', mat: '#F5F5F2', blend: '', defLayout: 'side', filter: '' },
  { id: 'light-window', grp: 'light', name: 'Window Light', src: './assets/art/light-window.jpg', bg: '#1E1914', bg2: '#15110D', dark: true, ink: '#F6EFE2', sub: '#CBBFA9', acc: '#E5BD78', mat: '#F8F4EC', blend: '', defLayout: 'side', filter: '' },
  { id: 'light-turner-dawn', grp: 'light', name: 'Golden Dawn', src: './assets/art/light-turner-dawn.jpg', bg: '#F5EDE0', bg2: '#ECE0CC', dark: false, ink: '#231A12', sub: '#564638', acc: '#A66E2E', mat: '#FCF9F3', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'light-turner-boat', grp: 'light', name: 'Morning Mist', src: './assets/art/light-turner-boat.jpg', bg: '#F7F3E7', bg2: '#EEE7D4', dark: false, ink: '#211D15', sub: '#554E40', acc: '#9B7938', mat: '#FDFBF5', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'light-pale-morning', grp: 'light', name: 'Pale Morning', src: './assets/art/light-pale-morning.jpg', bg: '#F0ECE6', bg2: '#E5DFD7', dark: false, ink: '#1F1D21', sub: '#524E57', acc: '#6E657A', mat: '#FAF8F6', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'light-friedrich', grp: 'light', name: 'Horizon Glow', src: './assets/art/light-friedrich.jpg', bg: '#1D1915', bg2: '#14110E', dark: true, ink: '#F7F0E4', sub: '#CEC1AE', acc: '#F0B866', mat: '#F9F4EC', blend: '', defLayout: 'side', filter: '' },
  { id: 'light-monet-train', grp: 'light', name: 'Sunlit Station', src: './assets/art/light-monet-train.jpg', bg: '#F4EDE2', bg2: '#EAE0D0', dark: false, ink: '#221C16', sub: '#564A3E', acc: '#9A653A', mat: '#FBF8F3', blend: '', defLayout: 'side', filter: '' },
  { id: 'sienna-arch', grp: 'light', name: 'Sunlit Plaster', src: './assets/art/sienna-arch.jpg', bg: '#EBDAD0', bg2: '#DFC8BA', dark: false, ink: '#261810', sub: '#543D30', acc: '#944A2D', mat: '#FBF6EF', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'lotus-gold', grp: 'light', name: 'Golden Lotus', src: './assets/art/lotus-gold.jpg', bg: '#F8F4ED', bg2: '#EFE9DD', dark: false, ink: '#14110E', sub: '#4A423B', acc: '#9B6B56', mat: '#FDFBF8', blend: '', defLayout: 'overlay', filter: '' },

  // Minimal — Zen Ink, Vast Whitespace & Airy Gallery Prints
  { id: 'min-enso', grp: 'minimal', name: 'Zen Ensō', src: './assets/art/min-enso.png', bg: '#FBF9F4', bg2: '#F4F0E7', dark: false, ink: '#181715', sub: '#52504A', acc: '#383530', mat: '#FFFFFF', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'min-ochre-sun', grp: 'minimal', name: 'Ochre Sun', src: './assets/art/min-ochre-sun.svg', bg: '#F3ECE0', bg2: '#EBE1D0', dark: false, ink: '#1F1A15', sub: '#554A3E', acc: '#B07A42', mat: '#FAF6EE', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'min-crescent-line', grp: 'minimal', name: 'Crescent Line', src: './assets/art/min-crescent-line.svg', bg: '#FAF8F4', bg2: '#F2EFE9', dark: false, ink: '#1D1A17', sub: '#544E47', acc: '#8C6D46', mat: '#FFFFFF', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'min-quiet-horizon', grp: 'minimal', name: 'Quiet Horizon', src: './assets/art/min-quiet-horizon.svg', bg: '#F6F2EA', bg2: '#EDE7DB', dark: false, ink: '#1E1A16', sub: '#544C44', acc: '#B68044', mat: '#FCFBF8', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'min-sengai-bamboo', grp: 'minimal', name: 'Ink Bamboo', src: './assets/art/min-sengai-bamboo.jpg', bg: '#F4EFE3', bg2: '#EBE4D4', dark: false, ink: '#1C1B17', sub: '#524E44', acc: '#9B3F33', mat: '#FAF7F0', blend: 'multiply', defLayout: 'side', filter: 'contrast(1.24) brightness(1.13)' },
  { id: 'min-plum-ink', grp: 'minimal', name: 'Plum Ink', src: './assets/art/min-plum-ink.jpg', bg: '#EFE9DB', bg2: '#E5DEC9', dark: false, ink: '#201D18', sub: '#544E43', acc: '#7B5D44', mat: '#F9F6EE', blend: '', defLayout: 'side', filter: '' },
  { id: 'min-window-beam', grp: 'minimal', name: 'Light Shaft', src: './assets/art/min-window-beam.svg', bg: '#F8F5EE', bg2: '#EFEADF', dark: false, ink: '#1D1A16', sub: '#544E45', acc: '#B87F32', mat: '#FFFFFF', blend: 'multiply', contain: true, defLayout: 'side', filter: '' },
  { id: 'min-single-stem', grp: 'minimal', name: 'Single Stem', src: './assets/art/min-single-stem.svg', bg: '#FAF7F5', bg2: '#F3ECE8', dark: false, ink: '#1E1B18', sub: '#574E4A', acc: '#A66D62', mat: '#FFFFFF', blend: 'multiply', contain: true, defLayout: 'side', filter: '' },
  { id: 'min-rain-lines', grp: 'minimal', name: 'Quiet Rain', src: './assets/art/min-rain-lines.svg', bg: '#F4F6F7', bg2: '#EAEFF2', dark: false, ink: '#1A2129', sub: '#4E5B68', acc: '#4E6A82', mat: '#FFFFFF', blend: 'multiply', contain: true, defLayout: 'side', filter: '' },
  { id: 'min-lunar-phases', grp: 'minimal', name: 'Moon Phases', src: './assets/art/min-lunar-phases.svg', bg: '#F9F7F2', bg2: '#F1ECE2', dark: false, ink: '#1D1A16', sub: '#544E45', acc: '#B87F32', mat: '#FFFFFF', blend: 'multiply', contain: true, defLayout: 'side', filter: '' },
  { id: 'min-two-birds', grp: 'minimal', name: 'Paper Swallows', src: './assets/art/min-two-birds.svg', bg: '#F6F1EA', bg2: '#EDE4D9', dark: false, ink: '#1E1A16', sub: '#564D44', acc: '#A86248', mat: '#FCF9F4', blend: 'multiply', contain: true, defLayout: 'side', filter: '' },
  { id: 'min-arch-sun', grp: 'minimal', name: 'Midnight Arch', src: './assets/art/min-arch-sun.svg', bg: '#12141A', bg2: '#1B1E28', dark: true, ink: '#F4EFE4', sub: '#C2BCB0', acc: '#DFBE7A', mat: '#F6F3EC', blend: '', contain: true, defLayout: 'side', filter: '' },
  { id: 'spot-bicycle', grp: 'minimal', name: 'Blue Bicycle', src: './assets/art/spot-bicycle.svg', bg: '#F9F5EB', bg2: '#F2ECDD', dark: false, ink: '#1F242A', sub: '#545B64', acc: '#4B7DA3', mat: '#FCFBF7', blend: 'multiply', contain: true, defLayout: 'below', defTextStyle: 'plain', filter: '' },
  { id: 'spot-teacup', grp: 'minimal', name: 'Quiet Teacup', src: './assets/art/spot-teacup.svg', bg: '#F8F5EE', bg2: '#F0EBE0', dark: false, ink: '#1E1B18', sub: '#575049', acc: '#6E8290', mat: '#FFFFFF', blend: 'multiply', contain: true, defLayout: 'below', defTextStyle: 'plain', filter: '' },
  { id: 'spot-paper-boat', grp: 'minimal', name: 'Paper Boat', src: './assets/art/spot-paper-boat.svg', bg: '#F5F4F0', bg2: '#ECEBE4', dark: false, ink: '#1D2024', sub: '#53585F', acc: '#4D758F', mat: '#FFFFFF', blend: 'multiply', contain: true, defLayout: 'below', defTextStyle: 'plain', filter: '' },
  { id: 'art-saffron-cycle', grp: 'minimal', name: 'Saffron Cycle', src: './assets/art/art-saffron-cycle.svg', bg: '#CEBDA3', bg2: '#C2AF93', dark: false, ink: '#35261A', sub: '#56402E', acc: '#D97814', mat: '#F6EFE4', blend: '', contain: true, defLayout: 'corner', defTextStyle: 'plain', defTexture: 'kraft', defTitleStyle: 'none', filter: '' },
  { id: 'art-lotus-dusk', grp: 'minimal', name: 'Lotus & Ribbon', src: './assets/art/art-lotus-dusk.svg', bg: '#F5EFE4', bg2: '#ECE4D5', dark: false, ink: '#1C1815', sub: '#4F473E', acc: '#C63A32', mat: '#FAF7F1', blend: 'multiply', contain: true, defLayout: 'corner', defTextStyle: 'plain', defTexture: 'cotton', defTitleStyle: 'none', filter: '' },
  { id: 'art-misty-meadow', grp: 'light', name: 'Misty Sage', src: './assets/art/art-misty-meadow.svg', bg: '#EFECE6', bg2: '#E5E6E1', dark: false, ink: '#1B1C1B', sub: '#4D5452', acc: '#5E7B7E', mat: '#F8F8F6', blend: '', defLayout: 'overlay', defTextStyle: 'plain', defTexture: 'cotton', defTitleStyle: 'none', filter: '' },
  { id: 'art-lantern-glow', grp: 'light', name: 'Dusk Lantern', src: './assets/art/art-lantern-glow.svg', bg: '#151A24', bg2: '#0F131B', dark: true, ink: '#F5EFE4', sub: '#C5BEB0', acc: '#F2B857', mat: '#F6F3EC', blend: '', contain: true, defLayout: 'corner', defTextStyle: 'plain', filter: '' },
  { id: 'bot-wild-phlox', grp: 'minimal', name: 'Wild Phlox', src: './assets/art/bot-wild-phlox.jpg', bg: '#F3EFE6', bg2: '#EAE4D8', dark: false, ink: '#211B1D', sub: '#584C50', acc: '#B5566B', mat: '#FAF8F3', blend: 'multiply', defLayout: 'below', defTextStyle: 'plain', filter: 'contrast(1.06) brightness(1.04)' },

  // Book & Ink — Vintage Botanicals, Woodblocks & Narrative Plates
  { id: 'ed-redpoll', grp: 'editorial', name: 'Redpoll Linnet', src: './assets/art/ed-redpoll.jpg', bg: '#F4EEDB', bg2: '#EBE3CB', dark: false, ink: '#1E1B16', sub: '#524C40', acc: '#9B3832', mat: '#FAF7EE', blend: '', defLayout: 'overlay', defTextStyle: 'cutout-word', filter: '' },
  { id: 'ed-lesser-redpoll', grp: 'editorial', name: 'Twin Linnets', src: './assets/art/ed-lesser-redpoll.jpg', bg: '#F4EEDC', bg2: '#EAE1CA', dark: false, ink: '#1E1B16', sub: '#524B40', acc: '#9C484D', mat: '#FAF7EE', blend: '', defLayout: 'overlay', defTextStyle: 'cutout-word', filter: '' },
  { id: 'ed-cedar-birds', grp: 'editorial', name: 'Cedar Birds', src: './assets/art/ed-cedar-birds.jpg', bg: '#F2EBD7', bg2: '#E8DFC6', dark: false, ink: '#1E1B16', sub: '#524B3F', acc: '#6D5437', mat: '#FAF6EB', blend: '', defLayout: 'overlay', defTextStyle: 'cutout-word', filter: '' },
  { id: 'redoute-rose', grp: 'editorial', name: 'Crimson Rose', src: './assets/art/redoute-rose.jpg', bg: '#EFE7D7', bg2: '#E6DAC4', dark: false, ink: '#1F1914', sub: '#554A3E', acc: '#8B302C', mat: '#FAF6EE', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'redoute-blush', grp: 'editorial', name: 'Blush Rose', src: './assets/art/redoute-blush.jpg', bg: '#F7F2EA', bg2: '#EFE7DB', dark: false, ink: '#241A1C', sub: '#5B494C', acc: '#9C4A58', mat: '#FDFBF8', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'ed-dandelion', grp: 'editorial', name: 'Dandelion', src: './assets/art/ed-dandelion.jpg', bg: '#F5EFE2', bg2: '#ECE4D2', dark: false, ink: '#201C14', sub: '#544C3B', acc: '#9B7724', mat: '#FCF9F2', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'ed-redon-flowers', grp: 'editorial', name: 'Profile & Blooms', src: './assets/art/ed-redon-flowers.jpg', bg: '#261E24', bg2: '#1C151B', dark: true, ink: '#F6EFE8', sub: '#CBBCC6', acc: '#E5BC74', mat: '#F8F4F2', blend: '', defLayout: 'side', filter: '' },
  { id: 'ed-hasui-snow', grp: 'editorial', name: 'Winter Snow', src: './assets/art/ed-hasui-snow.jpg', bg: '#1B242D', bg2: '#131A21', dark: true, ink: '#F3F5F7', sub: '#BBC6D0', acc: '#EBD09B', mat: '#F4F6F8', blend: '', defLayout: 'side', filter: '' },
  { id: 'ed-hasui-rain', grp: 'editorial', name: 'Rainy Lane', src: './assets/art/ed-hasui-rain.jpg', bg: '#222A2D', bg2: '#181F22', dark: true, ink: '#F3F2EC', sub: '#BDC5C7', acc: '#E5C97B', mat: '#F5F5F2', blend: '', defLayout: 'side', filter: '' },
  { id: 'koson-moon-goose', grp: 'editorial', name: 'Moonlight Flight', src: './assets/art/koson-moon-goose.jpg', bg: '#F0EADA', bg2: '#E7DFCA', dark: false, ink: '#1F1D19', sub: '#534E44', acc: '#7B5E3F', mat: '#FAF7F0', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'koson-wagtail-lotus', grp: 'editorial', name: 'Lotus & Bird', src: './assets/art/koson-wagtail-lotus.jpg', bg: '#EFEAD8', bg2: '#E6DFC8', dark: false, ink: '#201E19', sub: '#524D42', acc: '#6A6A4A', mat: '#F9F6EE', blend: 'multiply', defLayout: 'side', filter: '' },
  { id: 'ed-crow-moon', grp: 'editorial', name: 'Crow & Moon', src: './assets/art/ed-crow-moon.jpg', bg: '#E7E2D6', bg2: '#DCD5C5', dark: false, ink: '#1B1A17', sub: '#504C44', acc: '#8A3A2E', mat: '#F7F5EE', blend: '', defLayout: 'side', filter: '' },
  { id: 'koson-plum-moon', grp: 'editorial', name: 'Plum & Moon', src: './assets/art/koson-plum-moon.jpg', bg: '#343530', bg2: '#282925', dark: true, ink: '#F4F0E6', sub: '#C4BEB0', acc: '#E3D5A8', mat: '#F7F4EC', blend: '', defLayout: 'side', filter: '' },
  { id: 'koson-heron-rain', grp: 'editorial', name: 'Heron in Rain', src: './assets/art/koson-heron-rain.jpg', bg: '#12161E', bg2: '#1B212D', dark: true, ink: '#F2F4F7', sub: '#B9C2CF', acc: '#D8C89E', mat: '#F5F6F8', blend: '', defLayout: 'side', filter: '' },
  { id: 'hasui-moon-magome', grp: 'editorial', name: 'Twilight Pines', src: './assets/art/hasui-moon-magome.jpg', bg: '#0F2B3D', bg2: '#173B50', dark: true, ink: '#F4F2EA', sub: '#BBD0DC', acc: '#F0C674', mat: '#F4F6F7', blend: '', defLayout: 'side', filter: '' },
  { id: 'koson-crow-blossom', grp: 'editorial', name: 'Crow & Blossom', src: './assets/art/koson-crow-blossom.jpg', bg: '#4B4A3E', bg2: '#3B3A30', dark: true, ink: '#F7F3E8', sub: '#CFC9BA', acc: '#E6C58E', mat: '#F6F3EB', blend: '', defLayout: 'side', filter: '' },

  // Watercolour — Original Hand-Painted Full-Bleed Canvases
  { id: 'bot-anemone', grp: 'canvas', name: 'Anemone Gouache', src: './assets/art/bot-anemone.jpg', bg: '#B6B8B5', bg2: '#A4A7A3', dark: false, ink: '#1A1918', sub: '#464442', acc: '#9C3D42', mat: '#F4F4F2', blend: '', defLayout: 'overlay', defTextStyle: 'torn', filter: '' },
  { id: 'bot-magnolia', grp: 'canvas', name: 'Umbrella Magnolia', src: './assets/art/bot-magnolia.jpg', bg: '#D7CEBA', bg2: '#C9BEA7', dark: false, ink: '#1E1B17', sub: '#4D463D', acc: '#637552', mat: '#F8F5EE', blend: '', defLayout: 'overlay', defTextStyle: 'torn', filter: '' },
  { id: 'bot-almond', grp: 'canvas', name: 'Almond Blossom', src: './assets/art/bot-almond.jpg', bg: '#4E9DA8', bg2: '#3D8691', dark: false, ink: '#181C1E', sub: '#464E52', acc: '#2C6C75', mat: '#F5F9FA', blend: '', defLayout: 'overlay', defTextStyle: 'torn', filter: '' },
  { id: 'bot-red-lily', grp: 'canvas', name: 'Wild Red Lily', src: './assets/art/bot-red-lily.jpg', bg: '#F2ECDC', bg2: '#E8DFCA', dark: false, ink: '#221914', sub: '#58463B', acc: '#B8441E', mat: '#FAF7F0', blend: '', defLayout: 'side', defTextStyle: 'plain', filter: '' },
  { id: 'botanical-linen', grp: 'canvas', name: 'Pressed Olive', src: './assets/art/botanical-linen.jpg', bg: '#F7F3EA', bg2: '#EFE8DA', dark: false, ink: '#1F1C17', sub: '#50483E', acc: '#6A7A58', mat: '#FDFBF7', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'moonlit-velvet', grp: 'canvas', name: 'Midnight Moon', src: './assets/art/moonlit-velvet.jpg', bg: '#0F1423', bg2: '#182036', dark: true, ink: '#F5EFE4', sub: '#C4BCB0', acc: '#DFBE7A', mat: '#F7F3EA', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'vintage-rose', grp: 'canvas', name: 'Vintage Rose', src: './assets/art/vintage-rose.jpg', bg: '#F5ECE4', bg2: '#ECE0D5', dark: false, ink: '#2B1B1F', sub: '#5A4248', acc: '#8E4B57', mat: '#FDF9F7', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'sumi-mist', grp: 'canvas', name: 'Sumi-e Mist', src: './assets/art/sumi-mist.jpg', bg: '#EDEAE1', bg2: '#E2DDD1', dark: false, ink: '#1E1E1B', sub: '#4F4E48', acc: '#5E5D52', mat: '#F8F7F2', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'monsoon-window', grp: 'canvas', name: 'Monsoon Glass', src: './assets/art/monsoon-window.jpg', bg: '#1B2530', bg2: '#253240', dark: true, ink: '#EEF3F7', sub: '#BBC8D4', acc: '#E0B47B', mat: '#F2F5F7', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'pastel-clouds', grp: 'canvas', name: 'Twilight Clouds', src: './assets/art/pastel-clouds.jpg', bg: '#F5ECE9', bg2: '#ECDFDB', dark: false, ink: '#261E29', sub: '#544759', acc: '#8C5A76', mat: '#FCF8FA', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'ocean-calm', grp: 'canvas', name: 'Quiet Sea', src: './assets/art/ocean-calm.jpg', bg: '#E6EFF2', bg2: '#D8E5EA', dark: false, ink: '#162633', sub: '#3C5161', acc: '#34607C', mat: '#F7FAFC', blend: '', defLayout: 'overlay', filter: '' },
  { id: 'velvet-plum', grp: 'canvas', name: 'Velvet Plum', src: './assets/art/moonlit-velvet.jpg', bg: '#24172B', bg2: '#31203B', dark: true, ink: '#F7EEF6', sub: '#CCB8CD', acc: '#DFB2CE', mat: '#FAF5FA', blend: '', defLayout: 'overlay', filter: 'hue-rotate(38deg) saturate(1.12)' },
  { id: 'autumn-amber', grp: 'canvas', name: 'Candlelit Umber', src: './assets/art/sienna-arch.jpg', bg: '#261912', bg2: '#352319', dark: true, ink: '#F8ECDA', sub: '#D3BC9F', acc: '#E5AA68', mat: '#FBF4E8', blend: '', defLayout: 'overlay', filter: 'invert(1) sepia(.72) hue-rotate(-14deg) brightness(.52) contrast(1.18)' },
  { id: 'noir-sumi', grp: 'canvas', name: 'Noir Ink Hills', src: './assets/art/sumi-mist.jpg', bg: '#131315', bg2: '#1D1D20', dark: true, ink: '#F2EEE6', sub: '#BEB8AC', acc: '#D8C294', mat: '#F5F1E8', blend: '', defLayout: 'overlay', filter: 'invert(1) sepia(.22) brightness(.58) contrast(1.12)' }
];

export const PAPERS = [
  { id: 'ivory-press', name: 'Ivory Press', bg: '#FAF7F0', bg2: '#F2ECE0', dark: false, ink: '#1E1A16', sub: '#5B5349', acc: '#8B6D4B', mat: '#FFFFFF' },
  { id: 'parchment', name: 'Warm Parchment', bg: '#EFE7D6', bg2: '#E5D8C1', dark: false, ink: '#221B14', sub: '#594C3E', acc: '#8B4D36', mat: '#FAF6EE' },
  { id: 'gallery-white', name: 'Gallery White', bg: '#FFFFFF', bg2: '#F8F8F6', dark: false, ink: '#161616', sub: '#565656', acc: '#2A2A2A', mat: '#FFFFFF' },
  { id: 'blush-vellum', name: 'Blush Vellum', bg: '#F7ECEA', bg2: '#EEDCD8', dark: false, ink: '#2B1B1F', sub: '#62484F', acc: '#9E5462', mat: '#FDF9F8' },
  { id: 'sage-linen', name: 'Sage Linen', bg: '#ECEFE8', bg2: '#DFE5D8', dark: false, ink: '#1B241D', sub: '#49584C', acc: '#5F775A', mat: '#F8FAF6' },
  { id: 'mist-blue', name: 'Mist Paper', bg: '#EAF0F4', bg2: '#DCE5EC', dark: false, ink: '#18242E', sub: '#485968', acc: '#4A6E8A', mat: '#F7FAFC' },
  { id: 'sandstone', name: 'Warm Clay', bg: '#EBDDD0', bg2: '#DFCBB9', dark: false, ink: '#2B1D14', sub: '#614839', acc: '#9C5736', mat: '#FBF6F0' },
  { id: 'mauve-dusk', name: 'Dusty Mauve', bg: '#EEE8EE', bg2: '#E1D8E2', dark: false, ink: '#251C28', sub: '#57485C', acc: '#7D5C82', mat: '#FAF7FB' },
  { id: 'midnight-ink', name: 'Midnight Ink', bg: '#131722', bg2: '#1B2233', dark: true, ink: '#F3EFE6', sub: '#B9C0CE', acc: '#DFBE7A', mat: '#F7F4EC' },
  { id: 'obsidian-gold', name: 'Obsidian Gold', bg: '#141312', bg2: '#1F1D1B', dark: true, ink: '#F5EFE4', sub: '#BEB5A6', acc: '#D8B46C', mat: '#F8F4EC' },
  { id: 'forest-dusk', name: 'Forest Dusk', bg: '#17231E', bg2: '#203029', dark: true, ink: '#F0F2EC', sub: '#B6C4BC', acc: '#C9B886', mat: '#F4F7F5' },
  { id: 'raw-kraft', name: 'Raw Kraft', bg: '#CCB99F', bg2: '#C0AB8F', dark: false, ink: '#332418', sub: '#584130', acc: '#A34A32', mat: '#F6EFE4' },
  { id: 'handmade-cotton', name: 'Cotton Rag', bg: '#F5EFE4', bg2: '#ECE4D5', dark: false, ink: '#1E1A16', sub: '#544B41', acc: '#8C4A32', mat: '#FAF7F0' },
  { id: 'espresso', name: 'Dark Espresso', bg: '#211814', bg2: '#2D211C', dark: true, ink: '#F6EDE4', sub: '#CBB9AA', acc: '#DDA975', mat: '#FBF5EE' }
];

export const FONTS = [
  // Classic Serif
  { id: 'eb-garamond', cat: 'classic', name: 'EB Garamond', fam: "'EB Garamond',Georgia,serif", titleW: 500, bodyW: 400, ls: '0em', lh: 1.72, italicTitle: false },
  { id: 'editorial', cat: 'classic', name: 'Cormorant', fam: "'Cormorant Garamond',Georgia,serif", titleW: 600, bodyW: 500, ls: '.01em', lh: 1.66, italicTitle: false },
  { id: 'poetic-italic', cat: 'classic', name: 'Newsreader Italic', fam: "'Newsreader',Georgia,serif", titleW: 500, bodyW: 400, ls: '0em', lh: 1.72, italicTitle: true },
  { id: 'baskerville', cat: 'classic', name: 'Baskerville', fam: "'Libre Baskerville',Georgia,serif", titleW: 400, bodyW: 400, ls: '0em', lh: 1.78, italicTitle: false },
  { id: 'classic', cat: 'classic', name: 'Playfair', fam: "'Playfair Display',Georgia,serif", titleW: 500, bodyW: 400, ls: '.01em', lh: 1.72, italicTitle: false },
  { id: 'bodoni', cat: 'classic', name: 'Bodoni Moda', fam: "'Bodoni Moda',Georgia,serif", titleW: 500, bodyW: 400, ls: '.02em', lh: 1.72, italicTitle: false },
  { id: 'instrument', cat: 'classic', name: 'Instrument Serif', fam: "'Instrument Serif',Georgia,serif", titleW: 400, bodyW: 400, ls: '.01em', lh: 1.56, italicTitle: false, scaleBoost: 1.14 },
  { id: 'fraunces', cat: 'classic', name: 'Fraunces Soft', fam: "'Fraunces',Georgia,serif", titleW: 500, bodyW: 400, ls: '-.01em', lh: 1.68, italicTitle: false },
  { id: 'crimson', cat: 'classic', name: 'Crimson Pro', fam: "'Crimson Pro',Georgia,serif", titleW: 500, bodyW: 400, ls: '0em', lh: 1.68, italicTitle: false },

  // Handwriting & Script
  { id: 'caveat', cat: 'hand', name: 'Caveat', fam: "'Caveat',cursive", titleW: 600, bodyW: 500, ls: '.01em', lh: 1.56, italicTitle: false, scaleBoost: 1.18 },
  { id: 'belle', cat: 'hand', name: 'La Belle Aurore', fam: "'La Belle Aurore',cursive", titleW: 400, bodyW: 400, ls: '.02em', lh: 1.7, italicTitle: false, scaleBoost: 1.16 },
  { id: 'reenie', cat: 'hand', name: 'Reenie Beanie', fam: "'Reenie Beanie',cursive", titleW: 400, bodyW: 400, ls: '.02em', lh: 1.48, italicTitle: false, scaleBoost: 1.28 },
  { id: 'dancing', cat: 'hand', name: 'Dancing Script', fam: "'Dancing Script',cursive", titleW: 600, bodyW: 500, ls: '.01em', lh: 1.62, italicTitle: false, scaleBoost: 1.12 },
  { id: 'alex', cat: 'hand', name: 'Alex Brush', fam: "'Alex Brush',cursive", titleW: 400, bodyW: 400, ls: '.02em', lh: 1.65, italicTitle: false, scaleBoost: 1.22 },
  { id: 'sacramento', cat: 'hand', name: 'Sacramento', fam: "'Sacramento',cursive", titleW: 400, bodyW: 400, ls: '.02em', lh: 1.58, italicTitle: false, scaleBoost: 1.32 },
  { id: 'homemade', cat: 'hand', name: 'Homemade Apple', fam: "'Homemade Apple',cursive", titleW: 400, bodyW: 400, ls: '.02em', lh: 2.05, italicTitle: false, scaleBoost: 0.92 },
  { id: 'shadows', cat: 'hand', name: 'Shadows Light', fam: "'Shadows Into Light',cursive", titleW: 400, bodyW: 400, ls: '.03em', lh: 1.68, italicTitle: false, scaleBoost: 1.1 },

  // Typewriter & Mono
  { id: 'typewriter', cat: 'mono', name: 'Special Elite', fam: "'Special Elite','Courier New',monospace", titleW: 400, bodyW: 400, ls: '.01em', lh: 1.82, italicTitle: false, scaleBoost: 0.92 },
  { id: 'courier-prime', cat: 'mono', name: 'Courier Prime', fam: "'Courier Prime',monospace", titleW: 400, bodyW: 400, ls: '0em', lh: 1.78, italicTitle: false, scaleBoost: 0.9 },
  { id: 'ibm-mono', cat: 'mono', name: 'IBM Plex Mono', fam: "'IBM Plex Mono',monospace", titleW: 500, bodyW: 400, ls: '-.01em', lh: 1.78, italicTitle: false, scaleBoost: 0.88 },

  // Modern Minimal
  { id: 'jost', cat: 'modern', name: 'Jost Light', fam: "'Jost',sans-serif", titleW: 400, bodyW: 300, ls: '.03em', lh: 1.76, italicTitle: false, scaleBoost: 0.95 },
  { id: 'lora', cat: 'modern', name: 'Lora', fam: "'Lora',Georgia,serif", titleW: 500, bodyW: 400, ls: '0em', lh: 1.74, italicTitle: false },
  { id: 'syne', cat: 'modern', name: 'Syne Editorial', fam: "'Syne',sans-serif", titleW: 600, bodyW: 400, ls: '.01em', lh: 1.72, italicTitle: false, scaleBoost: 0.94 },
  { id: 'inter', cat: 'modern', name: 'Inter Clean', fam: "'Inter',sans-serif", titleW: 500, bodyW: 400, ls: '-.01em', lh: 1.74, italicTitle: false, scaleBoost: 0.92 },

  // Hindi / Devanagari
  { id: 'devanagari', cat: 'hindi', name: 'Tiro Devanagari', fam: "'Tiro Devanagari Hindi','Noto Serif Devanagari',Georgia,serif", titleW: 500, bodyW: 400, ls: '0em', lh: 1.92, italicTitle: false },
  { id: 'kalam', cat: 'hindi', name: 'Kalam Hand', fam: "'Kalam','Noto Serif Devanagari',cursive", titleW: 700, bodyW: 400, ls: '0em', lh: 1.76, italicTitle: false, scaleBoost: 1.04 },
  { id: 'yatra', cat: 'hindi', name: 'Yatra Calligraphic', fam: "'Yatra One','Noto Serif Devanagari',serif", titleW: 400, bodyW: 400, ls: '.01em', lh: 1.84, italicTitle: false, scaleBoost: 1.04 },
  { id: 'amita', cat: 'hindi', name: 'Amita Flourish', fam: "'Amita','Noto Serif Devanagari',cursive", titleW: 700, bodyW: 400, ls: '0em', lh: 1.92, italicTitle: false, scaleBoost: 1.0 },
  { id: 'gotu', cat: 'hindi', name: 'Gotu Minimal', fam: "'Gotu','Noto Serif Devanagari',sans-serif", titleW: 400, bodyW: 400, ls: '.01em', lh: 1.88, italicTitle: false, scaleBoost: 0.98 },
  { id: 'sahitya', cat: 'hindi', name: 'Sahitya Book', fam: "'Sahitya','Noto Serif Devanagari',serif", titleW: 700, bodyW: 400, ls: '0em', lh: 1.88, italicTitle: false, scaleBoost: 1.04 },
  { id: 'eczar', cat: 'hindi', name: 'Eczar Literary', fam: "'Eczar','Noto Serif Devanagari',serif", titleW: 600, bodyW: 500, ls: '0em', lh: 1.82, italicTitle: false, scaleBoost: 1.02 },
  { id: 'rozha', cat: 'hindi', name: 'Rozha Editorial', fam: "'Rozha One','Noto Serif Devanagari',serif", titleW: 400, bodyW: 400, ls: '.01em', lh: 1.85, italicTitle: false }
];

export const FONT_CATS = [
  { id: 'all', label: 'All (32)' },
  { id: 'classic', label: 'Classic' },
  { id: 'hand', label: 'Handwriting' },
  { id: 'mono', label: 'Typewriter' },
  { id: 'modern', label: 'Modern' },
  { id: 'hindi', label: 'हिन्दी' }
];

export const LAYOUTS = [
  { id: 'side', label: 'Book Editorial' },
  { id: 'overlay', label: 'Full Canvas' },
  { id: 'below', label: 'Art Below' },
  { id: 'corner', label: 'Corner Art' }
];

export const FRAMES = [
  { id: 'none', label: 'Clean' },
  { id: 'hairline', label: 'Editorial' },
  { id: 'bookpage', label: 'Book Page' },
  { id: 'polaroid', label: 'Gallery Mat' },
  { id: 'arch', label: 'Arch Print' }
];

export const RATIOS = [
  { id: 'auto', label: 'Long Page', w: 1080, h: 0 },
  { id: '4:5', label: '4:5 Insta', w: 1080, h: 1350 },
  { id: '1:1', label: '1:1 Square', w: 1080, h: 1080 },
  { id: '9:16', label: '9:16 Story', w: 1080, h: 1920 },
  { id: '2:3', label: '2:3 Pin', w: 1000, h: 1500 }
];

export const TEXT_STYLES = [
  { id: 'plain', label: 'Plain' },
  { id: 'torn', label: 'Torn Paper' },
  { id: 'cutout-line', label: 'Line Cut-Out' },
  { id: 'cutout-word', label: 'Word Cut-Out' }
];

export const TITLE_STYLES = [
  { id: 'classic', label: 'Classic' },
  { id: 'none', label: 'No Title' },
  { id: 'dropcap', label: 'Drop Cap' },
  { id: 'smallcaps', label: 'Small Caps' },
  { id: 'italic', label: 'Lyrical Italic' },
  { id: 'highlight', label: 'Highlight' },
  { id: 'vertical', label: 'Side Margin' }
];

export const TEXTURES = [
  { id: 'grain', label: 'Fine Grain' },
  { id: 'kraft', label: 'Kraft Fiber' },
  { id: 'cotton', label: 'Cotton Rag' },
  { id: 'none', label: 'Smooth' }
];

export const INK_SWATCHES = [
  { id: 'auto', label: 'Auto', hex: '' },
  { id: 'nocturne', label: 'Nocturne', hex: '#181614' },
  { id: 'umber', label: 'Warm Umber', hex: '#3B281B' },
  { id: 'crimson', label: 'Deep Crimson', hex: '#6E2424' },
  { id: 'indigo', label: 'Midnight Indigo', hex: '#1D2B44' },
  { id: 'forest', label: 'Deep Pine', hex: '#1D3326' },
  { id: 'ivory', label: 'Warm Ivory', hex: '#F5EFE4' },
  { id: 'gold', label: 'Noor Gold', hex: '#DFBE7A' }
];

export const RHYTHMS = [
  { id: 'tight', label: 'Tight', mult: 0.88 },
  { id: 'balanced', label: 'Balanced', mult: 1.0 },
  { id: 'airy', label: 'Airy', mult: 1.18 }
];

export const TEXT_SIZES = [
  { id: 'auto', label: 'Auto-fit' },
  { id: 'sm', label: 'S' },
  { id: 'md', label: 'M' },
  { id: 'lg', label: 'L' }
];

export const MOODS = ['Love', 'Life', 'Stillness', 'Late Night', 'Minimal', 'Nature', 'Hindi', 'Long'];

export const PRESETS = [
  { bgMode: 'art', painting: 'light-sunbeams', layout: 'side', font: 'editorial', frame: 'hairline', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'sketch-sargent-lily', layout: 'side', font: 'baskerville', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'min-ochre-sun', layout: 'side', font: 'eb-garamond', frame: 'bookpage', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'light-turner-dawn', layout: 'overlay', font: 'poetic-italic', frame: 'hairline', align: 'center', ratio: '4:5', wash: 6 },
  { bgMode: 'art', painting: 'sketch-redon-flower', layout: 'side', font: 'classic', frame: 'bookpage', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'min-enso', layout: 'side', font: 'jost', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'light-window', layout: 'side', font: 'eb-garamond', frame: 'hairline', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'redoute-rose', layout: 'side', font: 'eb-garamond', frame: 'bookpage', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'sketch-durer-hands', layout: 'side', font: 'baskerville', frame: 'hairline', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'ed-hasui-snow', layout: 'side', font: 'typewriter', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'min-crescent-line', layout: 'side', font: 'editorial', frame: 'hairline', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'min-window-beam', layout: 'side', font: 'eb-garamond', frame: 'hairline', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'min-arch-sun', layout: 'side', font: 'poetic-italic', frame: 'hairline', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'min-lunar-phases', layout: 'side', font: 'baskerville', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'light-turner-boat', layout: 'overlay', font: 'editorial', frame: 'none', align: 'center', ratio: '4:5', wash: 4 },
  { bgMode: 'art', painting: 'moonlit-velvet', layout: 'overlay', font: 'poetic-italic', frame: 'bookpage', align: 'center', ratio: '4:5', wash: 8 },
  { bgMode: 'art', painting: 'ed-redpoll', layout: 'overlay', textStyle: 'cutout-word', font: 'baskerville', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'bot-anemone', layout: 'overlay', textStyle: 'torn', font: 'typewriter', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'spot-bicycle', layout: 'below', textStyle: 'plain', font: 'eb-garamond', frame: 'none', align: 'center', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'art-saffron-cycle', layout: 'corner', textStyle: 'plain', titleStyle: 'none', texture: 'kraft', font: 'eczar', frame: 'none', align: 'left', ratio: '1:1', wash: 0 },
  { bgMode: 'art', painting: 'art-lotus-dusk', layout: 'corner', textStyle: 'plain', titleStyle: 'none', texture: 'cotton', font: 'yatra', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'sketch-unravel', layout: 'side', textStyle: 'plain', font: 'baskerville', frame: 'none', align: 'left', ratio: '4:5', wash: 0 },
  { bgMode: 'art', painting: 'lotus-gold', layout: 'overlay', font: 'devanagari', frame: 'hairline', align: 'center', ratio: '4:5', wash: 0 }
];

export const RHYME_GROUPS = [
  ['night', 'light', 'bright', 'sight', 'flight', 'quiet', 'midnight', 'starlight', 'twilight', 'white', 'might', 'write', 'ignite'],
  ['rain', 'pain', 'pane', 'again', 'remain', 'stain', 'vein', 'train', 'lane', 'windowpane', 'refrain', 'plain', 'grain'],
  ['sky', 'high', 'sigh', 'fly', 'by', 'dry', 'cry', 'why', 'goodbye', 'lullaby', 'firefly', 'passerby'],
  ['heart', 'apart', 'start', 'part', 'art', 'chart', 'dark', 'spark', 'mark', 'embark'],
  ['time', 'rhyme', 'chime', 'climb', 'sublime', 'prime', 'line', 'mine', 'shine', 'divine', 'pine', 'wine'],
  ['sea', 'free', 'be', 'me', 'tree', 'breeze', 'leaves', 'breathe', 'beneath', 'dream', 'stream', 'gleam'],
  ['moon', 'soon', 'tune', 'june', 'noon', 'bloom', 'room', 'gloom', 'perfume', 'plume', 'monsoon'],
  ['sun', 'run', 'done', 'one', 'spun', 'begun', 'undone', 'gold', 'hold', 'fold', 'told', 'cold', 'old'],
  ['hand', 'sand', 'land', 'stand', 'understand', 'wind', 'behind', 'kind', 'mind', 'find', 'blind'],
  ['home', 'alone', 'stone', 'bone', 'known', 'grown', 'roam', 'foam', 'poem', 'tone'],
  ['glow', 'slow', 'snow', 'know', 'grow', 'below', 'shadow', 'window', 'meadow', 'echo'],
  ['still', 'sill', 'fill', 'hill', 'until', 'spill', 'chill', 'will', 'thrill']
];

export const WORD_BANKS = [
  { label: 'Light & Dawn', words: ['sunbeams', 'amber', 'goldleaf', 'motes', 'daybreak', 'glow', 'horizon', 'radiance', 'windowpane', 'warmth'] },
  { label: 'Night & Sky', words: ['silhouettes', 'starlight', 'constellation', 'velvet', 'dusk', 'luminous', 'crescent', 'solstice', 'drift', 'stillness'] },
  { label: 'Rain & Water', words: ['petrichor', 'ripple', 'mist', 'monsoon', 'shoreline', 'puddle', 'deluge', 'tide', 'drenched', 'quietude'] },
  { label: 'Love & Longing', words: ['tender', 'linger', 'whisper', 'ache', 'unspoken', 'pulse', 'echo', 'solace', 'devotion', 'bloom'] },
  { label: 'हिन्दी / उर्दू शब्द', words: ['ख़ामोशी', 'चाँदनी', 'ख़्वाब', 'रूबरू', 'आरज़ू', 'बारिश', 'साया', 'लम्हा', 'अधूरा', 'मुस्कान', 'तन्हाई', 'सुकून', 'रौशनी', 'सहर'] }
];

export function findRhymes(word) {
  const w = String(word || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!w || w.length < 2) return [];
  const exact = [];
  for (const grp of RHYME_GROUPS) {
    if (grp.includes(w)) {
      for (const item of grp) if (item !== w && !exact.includes(item)) exact.push(item);
    }
  }
  if (exact.length) return exact.slice(0, 12);
  const suf3 = w.slice(-3);
  const suf2 = w.slice(-2);
  const pool = RHYME_GROUPS.flat();
  const fuzzy = [];
  for (const item of pool) {
    if (item === w) continue;
    if ((suf3.length === 3 && item.endsWith(suf3)) || item.endsWith(suf2)) {
      if (!fuzzy.includes(item)) fuzzy.push(item);
    }
  }
  return fuzzy.slice(0, 10);
}

export function poemMetrics(body) {
  const clean = String(body || '').replace(/^\s*[-—]{3,}\s*$/gm, '').trim();
  if (!clean) return { stanzas: 0, lines: 0, words: 0, syllables: 0 };
  const stanzas = clean.split(/\n\s*\n+/).filter(Boolean).length;
  const lines = clean.split('\n').filter(l => l.trim().length > 0).length;
  const wordArr = clean.split(/\s+/).filter(Boolean);
  let syl = 0;
  for (const w of wordArr) {
    const en = w.toLowerCase().replace(/[^a-z]/g, '');
    if (en) {
      const m = en.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g);
      syl += Math.max(1, m ? m.length : 1);
    } else {
      syl += Math.max(1, Math.round(w.length / 2));
    }
  }
  return { stanzas, lines, words: wordArr.length, syllables: syl };
}

/**
 * Smart Long-Poem Auto-Fit Typography Calculator
 * Returns { scale, lhMult, padMult, isCompact } used identically in CSS live preview and Canvas export.
 */
export function computeTypeScale(body, { ratio = '4:5', layout = 'side', textSize = 'auto', isCarousel = false } = {}) {
  const manual = { sm: 0.82, md: 1.0, lg: 1.18 };
  if (textSize !== 'auto' && manual[textSize]) {
    return { scale: manual[textSize], lhMult: textSize === 'sm' ? 0.92 : 1.0, padMult: textSize === 'sm' ? 0.84 : 1.0 };
  }
  // Long Page never needs aggressive shrinking
  if (ratio === 'auto' && !isCarousel) {
    return { scale: 1.0, lhMult: 1.0, padMult: 1.0 };
  }
  const rawLines = String(body || '').split('\n');
  const charsPerLine = layout === 'side' ? 28 : 40;
  let visualLines = 0;
  for (const l of rawLines) {
    const t = l.trim();
    if (!t) visualLines += 0.65;
    else visualLines += Math.max(1, Math.ceil(t.length / charsPerLine));
  }
  const cap = ratio === '1:1' ? 11 : ratio === '9:16' ? 21 : ratio === '2:3' ? 18 : 15;
  const effCap = layout === 'below' ? cap * 0.78 : cap;
  if (visualLines <= effCap) return { scale: 1.0, lhMult: 1.0, padMult: 1.0 };
  const over = visualLines / effCap;
  // Smooth step-down down to 0.66 so 24-30 line poems fit on a single 4:5 poster just like published Instagram book pages
  const scale = Math.max(0.66, Math.min(1.0, Number((1 / Math.pow(over, 0.56)).toFixed(3))));
  const lhMult = Math.max(0.84, Number((1 - (1 - scale) * 0.45).toFixed(3)));
  const padMult = Math.max(0.72, Number((1 - (1 - scale) * 0.75).toFixed(3)));
  return { scale, lhMult, padMult };
}

/**
 * Smart Multi-Slide Carousel Paginator
 * Respects manual `---` page breaks first; otherwise balances stanzas cleanly per slide.
 */
export function paginatePoem(body, { ratio = '4:5', layout = 'side' } = {}) {
  const raw = String(body || '').trim();
  if (!raw) return [{ text: '', index: 0, total: 1, isFirst: true, isLast: true }];

  const manualRe = /^\s*[-—]{3,}\s*$/m;
  if (manualRe.test(raw)) {
    const parts = raw.split(/^\s*[-—]{3,}\s*$/m).map(p => p.trim()).filter(Boolean);
    const list = parts.length ? parts : [raw];
    return list.map((text, i) => ({
      text,
      index: i,
      total: list.length,
      isFirst: i === 0,
      isLast: i === list.length - 1
    }));
  }

  const charsPerLine = layout === 'side' ? 30 : 42;
  const maxLinesFirst = ratio === '1:1' ? 10 : ratio === '9:16' ? 18 : ratio === '2:3' ? 16 : 13;
  const maxLinesNext = maxLinesFirst + 3;

  const measureBlock = txt => {
    let n = 0;
    for (const l of txt.split('\n')) {
      const t = l.trim();
      n += t ? Math.max(1, Math.ceil(t.length / charsPerLine)) : 0.7;
    }
    return n;
  };

  const stanzas = raw.split(/\n\s*\n+/).map(s => s.trim()).filter(Boolean);
  const slides = [];
  let cur = [];
  let curLines = 0;

  const flush = () => {
    if (cur.length) {
      slides.push(cur.join('\n\n'));
      cur = [];
      curLines = 0;
    }
  };

  for (const st of stanzas) {
    const limit = slides.length === 0 ? maxLinesFirst : maxLinesNext;
    const stLines = measureBlock(st);
    // If a single massive stanza exceeds limit on its own, split it gracefully by line chunks
    if (stLines > limit + 2) {
      flush();
      const lines = st.split('\n');
      let chunk = [];
      let cCount = 0;
      for (const ln of lines) {
        const w = Math.max(1, Math.ceil(ln.trim().length / charsPerLine));
        const lim = slides.length === 0 ? maxLinesFirst : maxLinesNext;
        if (chunk.length && cCount + w > lim) {
          slides.push(chunk.join('\n'));
          chunk = [ln];
          cCount = w;
        } else {
          chunk.push(ln);
          cCount += w;
        }
      }
      if (chunk.length) {
        cur = [chunk.join('\n')];
        curLines = cCount;
      }
      continue;
    }
    const gap = cur.length ? 1.1 : 0;
    if (cur.length && curLines + gap + stLines > limit) {
      flush();
    }
    cur.push(st);
    curLines += (cur.length > 1 ? 1.1 : 0) + stLines;
  }
  flush();

  const finalSlides = slides.length ? slides : [raw];
  return finalSlides.map((text, i) => ({
    text,
    index: i,
    total: finalSlides.length,
    isFirst: i === 0,
    isLast: i === finalSlides.length - 1
  }));
}

export function resolveStyle(poem) {
  const bgMode = poem.bgMode || 'art';
  const painting = ARTWORKS.find(a => a.id === poem.painting) || ARTWORKS[0];
  const paper = PAPERS.find(p => p.id === poem.paper) || PAPERS[0];
  const font = FONTS.find(f => f.id === poem.font) || FONTS[0];
  const photoDark = poem.photoDark !== false;
  let pal;
  if (bgMode === 'art') pal = painting;
  else if (bgMode === 'solid') pal = paper;
  else {
    pal = photoDark
      ? { bg: '#161618', bg2: '#222226', dark: true, ink: '#F6F3EC', sub: '#CBC6BC', acc: '#E5C687', mat: '#FAF8F3' }
      : { bg: '#F7F4EE', bg2: '#EFEAE0', dark: false, ink: '#1D1A17', sub: '#554F47', acc: '#8B6D4B', mat: '#FFFFFF' };
  }
  const customInk = INK_SWATCHES.find(sw => sw.id === poem.inkColor && sw.hex);
  if (customInk) pal = { ...pal, ink: customInk.hex };
  return {
    bgMode,
    painting,
    paper,
    font,
    pal,
    layout: poem.layout || painting.defLayout || 'side',
    frame: poem.frame || 'hairline',
    align: poem.align || 'left',
    ratio: poem.ratio || '4:5',
    textSize: poem.textSize || 'auto',
    textStyle: (poem.textStyle === 'cutout' ? 'cutout-line' : poem.textStyle) || 'plain',
    titleStyle: poem.titleStyle || 'classic',
    texture: poem.texture || 'grain',
    inkColor: poem.inkColor || 'auto',
    rhythm: poem.rhythm || 'balanced',
    textX: Number.isFinite(poem.textX) ? poem.textX : 0,
    textY: Number.isFinite(poem.textY) ? poem.textY : 0,
    carousel: Boolean(poem.carousel),
    wash: Number.isFinite(poem.wash) ? poem.wash : 0,
    sign: poem.sign || '',
    pageNo: poem.pageNo || '',
    mood: poem.mood || '',
    photo: poem.photo || '',
    photoDark
  };
}

export const STARTER_POEMS = [
  {
    id: 'poem-people-we-become',
    title: 'The People We Become',
    body: `To someone, I am sunshine,\nto someone else, the storm—\nthe same beating heart,\njust seen in different forms.\n\nTo some, I am too quiet,\nto others, far too much—\na voice that brings them shelter,\nor one they dare not trust.\n\nA hero in one chapter,\na lesson in the next—\nthe ink remains unaltered,\nwhile every reader shifts the text.\n\nA place someone calls home,\na name another leaves behind—\na hand held through the winter,\nor a ghost inside the mind.\n\nToo soft for half the room,\ntoo distant for the rest—\nwe measure one another\nthrough the weight inside our chest.\n\nSo I wear all of these versions,\nstitched softly by their eyes,\nuntil I barely notice\nwhich horizon still is mine.`,
    bgMode: 'art',
    painting: 'min-ochre-sun',
    layout: 'side',
    font: 'eb-garamond',
    frame: 'bookpage',
    align: 'left',
    ratio: '4:5',
    textSize: 'auto',
    carousel: false,
    wash: 0,
    sign: '— noor',
    pageNo: '19',
    mood: 'Long',
    archived: false,
    createdAt: 1795400600000,
    updatedAt: 1795400600000
  },
  {
    id: 'poem-morning-light',
    title: 'Morning Light',
    body: `Even in a silent room\nthe window keeps its promise—\na quiet rectangle of gold\nresting gently on the floor.\n\nDust motes drift like unspoken thoughts\nthat finally found the sun.`,
    bgMode: 'art',
    painting: 'light-sunbeams',
    layout: 'side',
    font: 'editorial',
    frame: 'hairline',
    align: 'left',
    ratio: '4:5',
    textSize: 'auto',
    carousel: false,
    wash: 0,
    sign: '— strandgade',
    pageNo: '',
    mood: 'Stillness',
    archived: false,
    createdAt: 1795400500000,
    updatedAt: 1795400500000
  },
  {
    id: 'poem-overdue-rain',
    title: 'Overdue Rain',
    body: `Perhaps hearts\nare gardens too—\n\nsometimes they bloom,\nsometimes they drown,\nsometimes they lose\ntheir brightest hue\nbefore their roots are found.\n\nSo I will let the clouds\nfinish what they came to do.\n\nBecause every storm\nmust lose the fight\nto morning's light.`,
    bgMode: 'art',
    painting: 'sketch-sargent-lily',
    layout: 'side',
    font: 'baskerville',
    frame: 'none',
    align: 'left',
    ratio: '4:5',
    textSize: 'auto',
    carousel: false,
    wash: 0,
    sign: '~ quiet sketch',
    pageNo: '',
    mood: 'Life',
    archived: false,
    createdAt: 1795400400000,
    updatedAt: 1795400400000
  },
  {
    id: 'poem-on-roses',
    title: 'On Roses',
    body: `If I were to name the color\nof your love,\nI would still reach\nfor the red of a rose.\n\nRoses do not bloom\nfor applause.\nThey bloom because\nit is their nature—\nto be soft,\nto be wild,\nto be unforgettable.`,
    bgMode: 'art',
    painting: 'redoute-rose',
    layout: 'side',
    font: 'eb-garamond',
    frame: 'bookpage',
    align: 'left',
    ratio: '4:5',
    textSize: 'auto',
    carousel: false,
    wash: 0,
    sign: '',
    pageNo: '143',
    mood: 'Love',
    archived: false,
    createdAt: 1795400300000,
    updatedAt: 1795400300000
  },
  {
    id: 'poem-11-11',
    title: '11:11',
    body: `कहते हैं जब घड़ी में\nग्यारह बजकर ग्यारह मिनट होते हैं,\nआँखें बंद कर लेनी चाहिए,\nमन में कोई ख़्वाहिश रखनी चाहिए।\n\nऔर मुझ नास्तिक को भी,\nपहली बार,\nइन चार अंकों में\nकुछ अजीब-सा सुंदर लगा।`,
    bgMode: 'art',
    painting: 'lotus-gold',
    layout: 'overlay',
    font: 'devanagari',
    frame: 'hairline',
    align: 'center',
    ratio: '4:5',
    textSize: 'auto',
    carousel: false,
    wash: 0,
    sign: '— रात के पन्ने',
    pageNo: '',
    mood: 'Hindi',
    archived: false,
    createdAt: 1795400200000,
    updatedAt: 1795400200000
  },
  {
    id: 'poem-quiet-hours',
    title: 'Quiet Hours',
    body: `Some evenings arrive\nwithout asking permission—\njust warm light behind a snowy pane,\nand half a sentence\nwaiting to become a poem.`,
    bgMode: 'art',
    painting: 'ed-hasui-snow',
    layout: 'side',
    font: 'poetic-italic',
    frame: 'hairline',
    align: 'left',
    ratio: '4:5',
    textSize: 'auto',
    carousel: false,
    wash: 0,
    sign: '— midnight',
    pageNo: '',
    mood: 'Late Night',
    archived: false,
    createdAt: 1795400100000,
    updatedAt: 1795400100000
  }
];
