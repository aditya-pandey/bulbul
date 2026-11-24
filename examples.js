// Example pages shown on the home screen. All poems by Aditya (आदित्य), kept as written
// (इबादत with its Urdu spelling and grammar corrected at the author's request);
// "---" marks a carousel slide and is never printed.
import { LOOK_BASE } from './data.js';

const ANJAAN = `मैं चाहता हूँ,
कि, तुम फिर एक बार अंजान बन जाओ,

पहली बार,
मेरे घर आए हो,
वैसे नए नए,
मेहमान बन जाओ।

तुम फिर एक बार अंजान बन जाओ ।

ग़मों को मेरे,
धुएँ में उड़ा दो,
फिर एक बार मेरा पहला ,
धूम्रपान बन जाओ।

तुम फिर एक बार अंजान बन जाओ ।

मैं फिर से तुम्हें,
शुरू से जान पाऊँ,
मगर इस बार थोड़े ,
आसान बन जाओ।

तुम फिर एक बार अंजान बन जाओ ।

तुम्हारी आँखों से
दुनिया दिखाओ,
बिना सोचे जो बोलूँ, वो सुनने वाले ,
कान बन जाओ।

तुम फिर एक बार अंजान बन जाओ ।

मेरे कंपकपाते होठों को,
छू कर तुम,
उसकी खोई हुई,
मुस्कान बन जाओ।

तुम फिर एक बार अंजान बन जाओ ।`;

const NAARAAZ = `मेरे जीवन के कुछ हिस्से,
आजकल बड़े नाराज़ से हैं ।

किताबों का चीख चीख के,
गला खराब सा हो गया है।
अब मुझे देखते ही मासूम सा चेहरा बना लेती हैं,
इस उम्मीद में कि,
आज मै कुछ पन्ने पलट पाऊंगा ।

मेरी कलम ने,
खुद को आहत करना शुरू कर दिया है,
मेरे कोरे कागज़ के हिस्सों में,
उसका नीला खून बहते देखा है मैने।

पियानो की कीज़,
बैठीं हैं दांत पीस,
हर कुछ देर पर,
विरह संगीत की चीख निकालती हैं।

खिड़की से आती हुई धूप,
उसके पास रखी कुर्सी,
जहाँ मै घंटों बिता देता था,
अब खाली, चुपचाप,
नाराज़ सी हैं।

महीनों से,
इनसे मिलना नहीं हुआ है ।
जल्द लौटने का वादा,
रोज़ करता हूँ उन्हें ।

आज कलम को पास बुलाकर,
थोड़ा नीला खून उधार मांगकर,
मैने अपने जीवन के इन हिस्सों के,
नाराजगी के किस्सों से,
कागज़ के कोरेपन को,
थोड़ा कम किया है।`;

const ANTARMAN = `कहते हैं,
की जहां न पहुंचे रवि,
वहां पहुंचे कवि ।

तो मैने भी,
कलम उठा ली ।
और चुना,
तुम्हारा मन,
अंतर्मन ।

तुम्हारा अंतर्मन तो,
आलीशान था,
चार मंजिला मकान था,
जहां न कोई ताले,
न दरबान था ।

पहली मंजिल पर,
तुम्हारा परिवार,
तुम्हारे मित्र,
और ,
तुम्हारा भगवान था ।

दूसरी पे,
सूखते गुलाब,
फटे ख़त,
जो तुम्हारे पुराने आशिकों का,
मानसिक समान था ।

तीसरी मंजिल पे,
एक कमरे में,
खालीपन,
दूसरा,
सुनसान था ।

चौथी मंजिल के,
पांचवे कमरे में,
तुम्हारे अंतर्मन तक,
आने का इनाम था ।

कमरे के एक कोने में,
भूली बिसरी लिखावट में,
लिखा,
मेरा नाम था ।`;

const TREE = `Almost look like an art.

Not just any art.

The Magnum Opus.

Maybe a painting.

With just the right colours, mixed in the the
most precise measurements.
With your smile being the most wonderful of it all.
Smile. The pink smile, spilling all over the foliage, being the reason for cherry to blossom in spring.

Maybe a poetry.

Poetry of what kind?
The kind which you read and don't need rhyme to groove with.
Poetry, which, is almost devotional, you lose yourself in it.

Maybe a song.

Song with colourful melodies.
One you just start humming to, without needing a beat.

Maybe I don't know the right word

Maybe some things are best left as something to be felt as, and not explained.

Maybe I am mesmerised,
Maybe I am lost,
It's just the magic, left by few,
Maybe it's an art,
The tree and you.`;

const PLACE = `"What I wish for you to find?"

"A good place,
A Wonderful place,

A Place,
full of places,
which place importance on people,
and not places.

A place,
A little place for you,
Which is in shape of you.
The little place for you,
would have things placed just for you.

A place,
Where those things,
will all have a little place in them,
that will be full of you.

A place,
where wind doesn’t push,
But, carries you,
to places,
made for you.

A place,
where darkness has ,
no home,
Where rivers flow,
with kindness alone.

A place,
Where dreams are not borrowed,
They are solely yours,
nurtured by you,
for you.

A place,
where your voice is the music,
and even silences sing,
the tunes of you.

A place,
where you don't have to lease,
The keys,
To your own freedom.

A place,
where the hands of clock,
don't hold on to,
your hands, your dreams.

A place,
where you aren't,
Someone's Number two,
It's just you,
Being you.

You,
the life,
of those things,
and those places.

You,
Simply you,
As you are,
As you were always meant to be,

To find,
A Good place.
A Wonderful place.
A place of you."`;

const IBADAT = `काफ़िर था मैं,
हर ख़ुदा से इनकार किया मैंने,
बस तेरे नाम पे आकर,
कुफ़्र में थोड़ी रियायत करता हूँ।

तेरी इजाज़त से,
तेरी इबादत करता हूँ,
दुनिया को लगता है,
उसकी मुख़ालिफ़त करता हूँ।

गर यही दुनिया को गुनाह लगता है,
तो ख़ारिज हर रिवायत करता हूँ,
ख़ुद ही अपना ख़ुदा चुनकर,
मैं आज ऐलान-ए-बग़ावत करता हूँ।

न काशी, न कैलाश,
न मदीने की तलाश,
आँखें मूँद, तेरी मूरत बनाकर,
हर रोज़ अब ज़ियारत करता हूँ।

तेरी आँखों में डुबो के,
तेरे नाम से शुरू,
तेरे नाम पे ख़त्म,
अब मुकम्मल अपनी इबारत करता हूँ।

तेरे लिखे ख़तों को,
आज भी पढ़ता रहता हूँ,
हर लफ़्ज़ में तेरा नाम लेकर,
तिलावत करता हूँ।

तू पूछे तो बता दूँ,
कि मेरी बंदगी क्या है,
तुझे ख़ुदा मानकर,
तुझसे ही शिकायत करता हूँ।`;

// A verbatim run of stanzas, by first words
const part = (text, ...starts) => starts.map(s => {
  const st = text.split(/\n\s*\n/).find(x => x.startsWith(s));
  if (!st) throw new Error('Example excerpt not found: ' + s);
  return st;
}).join('\n\n');

// Breaks a poem into slides before each stanza that begins with one of these words
const slides = (text, ...starts) => text.split(/\n\s*\n/).map(st => (starts.some(s => st.startsWith(s)) ? '---\n\n' : '') + st).join('\n\n');

const ex = (id, kind, title, body, sign, patch) => ({
  ...LOOK_BASE, id: 'ex-' + id, kind, title, body, sign, pageNo: '', mood: '', ratio: '4:5', paper: 'ivory-press', ...patch
});
const paper = (id, patch) => ({ bgMode: 'solid', paper: id, layout: 'overlay', ...patch });
const A = '— आदित्य';
const E = '— Aditya';

export const EXAMPLES = [
  ex('anjaan', 'Slides', 'अंजान बन जाओ', slides(ANJAAN, 'पहली बार', 'ग़मों', 'मैं फिर', 'तुम्हारी आँखों', 'मेरे कंप'), A,
    { painting: 'story-dehleez', font: 'kalam', carousel: true, texture: 'cotton' }),
  ex('ibadat', 'Slides', 'इबादत', slides(IBADAT, 'तेरी इजाज़त', 'गर यही', 'न काशी', 'तेरी आँखों', 'तेरे लिखे', 'तू पूछे'), A,
    { painting: 'story-ibadat', layout: 'below', font: 'kurale', align: 'center', carousel: true, look: 'ibadat' }),
  ex('tree', 'Long page', 'The tree and you', TREE, '',
    { painting: 'run-vine', layout: 'run', font: 'editorial', titleStyle: 'italic', ratio: 'auto', look: 'bougainvillea' }),
  ex('dhoop', 'Window light', 'नाराज़ हिस्से, नाराज़ किस्से', part(NAARAAZ, 'खिड़की'), A,
    paper('ivory-press', { font: 'devanagari', light: 'light-panes', titleStyle: 'none', rhythm: 'airy' })),
  ex('antarman', 'Slides', 'अंतर्मन', slides(ANTARMAN, 'तो मैने', 'तुम्हारा अंतर्मन', 'पहली', 'दूसरी', 'तीसरी', 'चौथी', 'कमरे'), A,
    { painting: 'story-antarman', font: 'laila', carousel: true, texture: 'cotton', ratio: '4:5' }),
  ex('number-two', 'Blackout', 'Place of You', 'A *place,*\nwhere *you* aren\'t,\nSomeone\'s Number two,\nIt\'s *just you,*\n*Being you.*', '',
    paper('gallery-white', { font: 'courier-prime', textStyle: 'blackout', titleStyle: 'none', rhythm: 'airy', ratio: '1:1' })),
  ex('neela-khoon', 'Letter', 'नाराज़ हिस्से, नाराज़ किस्से', part(NAARAAZ, 'मेरी कलम'), A,
    { painting: 'story-kursi', font: 'dekko', titleStyle: 'none', inkColor: 'indigo', texture: 'cotton' }),
  ex('place', 'Slides', 'Place of You', PLACE, E,
    { painting: 'scene-valley', layout: 'scene', font: 'gilda', carousel: true }),
  ex('aasaan', 'Underlined', 'अंजान बन जाओ', part(ANJAAN, 'मैं फिर', 'तुम फिर'), A,
    paper('blush-vellum', { font: 'kalam-light', textStyle: 'ruled', atmos: 'wash-teal', titleStyle: 'none', texture: 'cotton' })),
  ex('mera-naam', 'Arch', 'अंतर्मन', part(ANTARMAN, 'कमरे'), A,
    { painting: 'hasui-moon-magome', layout: 'arch', font: 'rozha', align: 'center', titleStyle: 'none' }),
  ex('mesmerised', 'Illustrated', 'The tree and you', part(TREE, 'Maybe I am mesmerised'), '',
    { painting: 'story-cherry', font: 'cedarville', titleStyle: 'none', texture: 'cotton' }),
  ex('gulaab', 'Pressed and torn', 'अंतर्मन', part(ANTARMAN, 'दूसरी'), A,
    paper('sandstone', { font: 'kurale', charm: 'charm-petals', charmPos: 'br', titleStyle: 'none', texture: 'cotton' })),
  ex('naaraaz', 'Long page', 'नाराज़ हिस्से, नाराज़ किस्से', NAARAAZ, A,
    { painting: 'story-kursi', layout: 'corner', font: 'tillana', ratio: 'auto', texture: 'cotton' }),
  ex('kindness', 'Illustrated', 'Place of You', part(PLACE, 'A place,\nwhere darkness'), '',
    { painting: 'story-place', font: 'poetic-italic', titleStyle: 'none', texture: 'cotton' }),
  ex('mehmaan', 'Story', 'अंजान बन जाओ', part(ANJAAN, 'पहली बार', 'तुम फिर'), A,
    { painting: 'story-dehleez', layout: 'below', font: 'yatra', align: 'center', titleStyle: 'none', ratio: '9:16' }),
  ex('shikayat', 'Ajrakh frame', 'इबादत', part(IBADAT, 'तू पूछे'), A,
    paper('ivory-press', { font: 'eczar', frame: 'ajrakh', align: 'center', titleStyle: 'none' })),
  ex('magnum', 'Highlighter', 'The tree and you', part(TREE, 'Almost', 'Not just', 'The Magnum'), '',
    paper('gallery-white', { font: 'baskerville', textStyle: 'marker', titleStyle: 'none', ratio: '1:1' }))
];
