import type { SpeciesDef } from "./types";
import { SpeciesCollection } from "./types";

// ── Celestial Court — mythological flora from many cultures ─────────────
const series: readonly SpeciesDef[] = [
  // ── Legendary ────────────────────────────────────────────────────────
  {
    id: 405,
    folder: "edenapple",
    name: "Eden Apple",
    rarity: "legendary",
    descriptionEN:
      "The apple tree that started it all. Its golden fruit still carries the weight of the first temptation — glowing softly, impossibly ripe, smelling of honey and regret. The bark is pale as bone, the leaves rustle like pages of a scripture nobody finished reading. A guardian in white linen watches from nearby. The serpent at the roots hasn't moved in millennia. It doesn't need to. The fruit does the tempting all on its own.",
    descriptionTH:
      "ต้นแอปเปิลที่จุดชนวนทุกสิ่ง ผลสีทองยังคงแบกน้ำหนักของการล่อลวงครั้งแรก — เรืองแสงอ่อน สุกงอมเกินจริง กลิ่นน้ำผึ้งปนเศร้า เปลือกซีดราวกระดูก ใบกรอบดังคล้ายหน้าพระคัมภีร์ที่ไม่มีใครอ่านจบ ผู้พิทักษ์ในอาภรณ์ลินินขาวเฝ้ามองอยู่ไม่ไกล อสรพิษที่โคนต้นไม่ขยับมาหลายพันปี มันไม่จำเป็น เพราะผลนั้นล่อลวงได้ด้วยตัวเอง",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Keeper of Forbidden Knowledge",
      th: "ผู้พิทักษ์ผลหวงห้าม",
    },
  },
  {
    id: 406,
    folder: "pantao",
    name: "Pan Tao",
    rarity: "legendary",
    descriptionEN:
      "The peach tree in the Queen Mother's celestial orchard bears fruit once every three thousand years. Its blossoms are the color of dawn clouds over Mount Kunlun, and when the peaches finally ripen, they glow like lanterns at a heavenly banquet. The trunk is old beyond counting, yet the bark feels warm to the touch — alive with spiritual energy that even immortals treat with respect. A maiden in Hanfu tends to it with practiced hands. The gods mark their calendars by this tree.",
    descriptionTH:
      "ท้อเซียนในสวนสวรรค์ของซีหวังหมู่ออกผลหนึ่งครั้งในสามพันปี ดอกมีสีเดียวกับเมฆยามรุ่งเหนือเขาคุนหลุน เมื่อผลสุกจะส่องสว่างราวโคมในงานเลี้ยงสวรรค์ ลำต้นเก่าแก่เกินจะนับ แต่เปลือกยังอุ่นเมื่อสัมผัส — สั่นสะเทือนด้วยพลังจิตที่แม้เซียนยังต้องเกรง นางในชุดฮั่นฝูดูแลมันด้วยมืออันชำนาญ เหล่าทวยเทพนับปฏิทินจากต้นนี้",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Immortal of the Peach Garden",
      th: "เซียนแห่งสวนท้อ",
    },
  },
  {
    id: 407,
    folder: "yggdrasilseed",
    name: "Yggdrasil Seed",
    rarity: "legendary",
    descriptionEN:
      "A seed from the great ash tree Yggdrasil, whose roots drink from the Well of Fate and whose crown scrapes the roof of the sky. Even as a seedling, this one grows with stubborn northern strength — its roots punch through frozen soil like they have somewhere important to be. The leaves turn silver in frost and gold in firelight. A Valkyrie keeps watch. When the wind stirs the branches, the sounds of nine worlds bleed through: battle-horns, ocean waves, the crackle of Muspelheim's flames.",
    descriptionTH:
      "เมล็ดจากต้นแอชมหึมาอิ๊กดราซิล ที่รากดื่มน้ำจากบ่อแห่งโชคชะตาและยอดครูดเพดานฟ้า แม้ยังเป็นต้นกล้า มันโตด้วยความแข็งแกร่งดื้อด้านแบบคนเหนือ — รากทิ่มทะลุดินเยือกแข็งราวกับมีที่ต้องไป ใบเปลี่ยนเป็นสีเงินในน้ำค้างแข็งและสีทองในแสงกองไฟ วัลคิรีเฝ้ามันอยู่ เมื่อลมสะกิดกิ่ง เสียงจากเก้าโลกรั่วไหลเข้ามา: เขาสงคราม คลื่นมหาสมุทร เสียงแตกของเปลวไฟมุสเปลเฮม",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Scion of the World Tree",
      th: "หน่อแห่งต้นจักรวาล",
    },
  },
  {
    id: 408,
    folder: "ambrosiavine",
    name: "Ambrosia Vine",
    rarity: "legendary",
    descriptionEN:
      "The vine that feeds the gods of Olympus. Its golden berries hang heavy with nectar that smells of warm sunlight and something you can't quite name but desperately want. The tendrils climb with a mind of their own, always reaching toward the highest point — marble columns, temple roofs, the sky itself. A woman in a white chiton collects the nectar in a chalice. Mortals who catch even a whiff of the fragrance are said to stand perfectly still and weep without knowing why.",
    descriptionTH:
      "เถาที่เลี้ยงเหล่าเทพแห่งโอลิมปัส ผลสีทองห้อยหนักด้วยน้ำทิพย์ที่มีกลิ่นแดดอุ่นปนกับบางอย่างที่เรียกไม่ถูกแต่อยากได้สุดหัวใจ เถาไต่ขึ้นไปเองราวกับมีสติ มุ่งหาจุดที่สูงที่สุดเสมอ — เสาหินอ่อน หลังคาวิหาร ท้องฟ้า สตรีในชุดไคตันขาวรองรับน้ำทิพย์ด้วยถ้วยทอง ว่ากันว่ามนุษย์ที่ได้กลิ่นแม้เพียงเล็กน้อยจะยืนนิ่งสนิทแล้วร้องไห้โดยไม่รู้สาเหตุ",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Bearer of Divine Nectar",
      th: "ผู้ถือน้ำทิพย์สวรรค์",
    },
  },
  {
    id: 409,
    folder: "lotusofire",
    name: "Lotus of Fire",
    rarity: "legendary",
    descriptionEN:
      "A lotus whose petals are made of living flame. It burns without heat, without smoke, without consuming itself — a fire that exists only to illuminate. The water around it stays perfectly still, as if afraid to disturb something sacred. Each petal unfurls like a prayer being spoken aloud. An Apsara dances nearby, her movements mirroring the way the flames flicker. The sutras say this flower appears only where the boundary between the mortal world and the divine grows thin.",
    descriptionTH:
      "ดอกบัวที่กลีบทำจากเปลวไฟ มันลุกไหม้โดยไม่ร้อน ไม่มีควัน ไม่เผาผลาญตัวเอง — ไฟที่มีอยู่เพื่อส่องสว่างเท่านั้น ผิวน้ำรอบมันนิ่งสนิทราวกับกลัวจะรบกวนสิ่งศักดิ์สิทธิ์ กลีบแต่ละกลีบคลี่ออกดั่งบทสวดที่เปล่งออกมาดังๆ อัปสราร่ายรำอยู่ใกล้ๆ ท่าทางของนางเคลื่อนไหวตามจังหวะที่เปลวไฟกระพริบ พระสูตรว่าดอกนี้ปรากฏเฉพาะที่รอยต่อระหว่างโลกมนุษย์กับสวรรค์บางเบาลง",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Flame-Born Apsara",
      th: "อัปสราเกิดแต่เปลวเพลิง",
    },
  },
  // ── Rare ──────────────────────────────────────────────────────────────
  {
    id: 410,
    folder: "sakurakitsune",
    name: "Sakura Kitsune",
    rarity: "rare",
    descriptionEN:
      "A cherry blossom that blooms out of season, surrounded by blue-white foxfire that floats like lazy fireflies. The petals fall slower than they should — as if time moves differently under this tree. It smells of spring rain and something faintly mischievous. A kitsune in the shape of a girl tends to it, though you'd only know her by the fox ears peeking through her hair and the tail she forgets to hide. The locals leave rice balls at the roots. They're always gone by morning.",
    descriptionTH:
      "ซากุระที่บานนอกฤดู ล้อมรอบด้วยแสงจิ้งจอกสีฟ้าขาวที่ลอยช้าๆ เหมือนหิ่งห้อยขี้เกียจ กลีบร่วงช้ากว่าที่ควร — ราวกับเวลาเดินต่างออกไปใต้ต้นนี้ กลิ่นฝนฤดูใบไม้ผลิปนกับอะไรบางอย่างที่ซุกซน คิทสึเนะในร่างสาวน้อยดูแลมันอยู่ แม้จะรู้ตัวก็ต่อเมื่อเห็นหูจิ้งจอกโผล่จากผมกับหางที่เธอลืมซ่อน ชาวบ้านวางข้าวปั้นไว้ที่โคนต้น พอเช้าก็หายทุกที",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 411,
    folder: "asphodel",
    name: "Asphodel Shade",
    rarity: "rare",
    descriptionEN:
      "The flower that carpets the fields of the Greek underworld, where souls go when they have nothing left to feel. Its petals are white edged with grey, faintly luminous — not bright enough to be hopeful, but not dark enough to be grim. The stems are cool to the touch, and the air around them is still, windless, like a room no one has entered in a very long time. A shade in silver-grey robes drifts nearby. The ancients planted asphodels on graves. Not as a farewell, but as a map home.",
    descriptionTH:
      "ดอกไม้ที่ปูคลุมทุ่งในยมโลกกรีก ที่ที่ดวงวิญญาณไปเมื่อไม่เหลืออะไรให้รู้สึกอีกแล้ว กลีบสีขาวขอบเทา เรืองแสงจางๆ — ไม่สว่างพอจะเป็นความหวัง แต่ไม่มืดพอจะเป็นความสิ้นหวัง ก้านเย็นเมื่อสัมผัส อากาศรอบมันนิ่งไร้ลม เหมือนห้องที่ไม่มีใครเข้ามานานมาก เงาในอาภรณ์สีเทาเงินลอยอยู่ใกล้ๆ คนโบราณปลูกแอสโฟเดลบนหลุมศพ ไม่ใช่เพื่อบอกลา แต่เป็นแผนที่กลับบ้าน",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 412,
    folder: "nightcactus",
    name: "Night Cactus",
    rarity: "rare",
    descriptionEN:
      "A cactus from the Aztec highlands that refuses to bloom by day. It waits for the stars, and when they appear, it erupts — massive white flowers with indigo-tipped petals that seem to hold actual starlight inside them. The bloom lasts one night, then closes at dawn as if it was never there. The thorns glow faint blue in moonlight, and the air fills with a scent like cold stone and desert rain. A star-priestess in feathered indigo robes keeps the night watch.",
    descriptionTH:
      "กระบองเพชรจากที่ราบสูงแอซเท็กที่ไม่ยอมบานตอนกลางวัน มันรอดวงดาว และเมื่อดาวปรากฏ มันก็ระเบิดบาน — ดอกขาวมหึมาปลายกลีบสีครามที่ดูเหมือนมีแสงดาวจริงๆ อยู่ข้างใน ดอกบานคืนเดียวแล้วหุบตอนรุ่งเช้าราวกับไม่เคยมีอยู่ หนามเรืองแสงฟ้าจางในแสงจันทร์ อากาศอบอวลด้วยกลิ่นหินเย็นกับฝนทะเลทราย นักบวชดาวในชุดขนนกสีครามเฝ้ายามค่ำ",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 413,
    folder: "silkwisteria",
    name: "Silk Wisteria",
    rarity: "rare",
    descriptionEN:
      "A wisteria from the imperial gardens whose falling blossoms weave themselves into silk threads before they touch the ground. The flower clusters hang like purple curtains, heavy and fragrant, swaying in a breeze that seems to exist only for this tree. Run your hand through the trailing flowers and your fingers come away trailing gossamer threads. A maiden in pale purple tends to it. The emperors used to say this tree understood beauty better than any artist at court.",
    descriptionTH:
      "วิสทีเรียจากสวนจักรพรรดิที่ดอกร่วงทอตัวเองเป็นเส้นไหมก่อนจะถึงพื้น ช่อดอกห้อยระย้าดั่งม่านสีม่วง หนักและหอม แกว่งไกวในสายลมที่เหมือนมีอยู่เพื่อต้นนี้เท่านั้น ลูบมือผ่านช่อดอกแล้วนิ้วจะมีเส้นไหมบางเบาติดมา สาวน้อยในชุดม่วงอ่อนคอยดูแลมัน จักรพรรดิเคยตรัสว่าต้นนี้เข้าใจความงามดีกว่าจิตรกรคนใดในราชสำนัก",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 414,
    folder: "frostbirch",
    name: "Frost Birch",
    rarity: "rare",
    descriptionEN:
      "A birch from the frozen heart of the Kalevala, where winter never fully leaves. Its bark is silver-white and cold to the touch even in summer. The leaves are thin as ice and ring softly when the wind blows through them — a sound the Finns call 'the singing of the frost.' The tree grows slowly, stubbornly, as if it has made peace with the cold and decided to make something beautiful out of it. A maiden in white watches over it. When the aurora appears, the leaves catch the light and the whole tree glows green and violet.",
    descriptionTH:
      "เบิร์ชจากใจกลางดินแดน Kalevala ที่หนาวไม่เคยจากไปจริงๆ เปลือกสีขาวเงินเย็นเมื่อสัมผัสแม้ในฤดูร้อน ใบบางเฉียบดั่งน้ำแข็งและส่งเสียงดังเบาๆ เมื่อลมพัดผ่าน — เสียงที่ชาวฟินน์เรียกว่า 'เพลงของน้ำค้างแข็ง' ต้นไม้โตช้า ดื้อด้าน ราวกับมันทำใจกับความหนาวได้แล้วและตัดสินใจจะทำอะไรสวยๆ จากมัน สาวในชุดขาวเฝ้าดูแลอยู่ เมื่อแสงเหนือปรากฏ ใบจะจับแสงจนทั้งต้นเรืองสีเขียวกับม่วง",
    collection: SpeciesCollection.CelestialCourt,
  },
  // ── Celestial Court — Batch 2: Rare (multi-culture) ──────────────────
  {
    id: 415,
    folder: "goldenreed",
    name: "Golden Reed",
    rarity: "rare",
    descriptionEN:
      "A reed that grows where the Nile touches sacred ground. Its plumes are actual gold — not gold-colored, not golden, but the metal itself somehow growing like grain. The Egyptians believed Isis wove these reeds into her crown on the day she reassembled Osiris. The stalks are warm even at night, and sacred ibises refuse to nest anywhere else. A priestess in white linen and a golden usekh collar tends to it. When the sun hits the plumes at the right angle, the whole riverbank looks like it's on fire.",
    descriptionTH:
      "กกที่ขึ้นตรงจุดที่แม่น้ำไนล์สัมผัสดินศักดิ์สิทธิ์ ช่อดอกเป็นทองคำจริงๆ — ไม่ใช่สีทอง ไม่ใช่เหลืองทอง แต่เป็นโลหะทองที่งอกขึ้นมาเหมือนข้าว ชาวอียิปต์เชื่อว่าเทพีไอซิสทอกกนี้เป็นมงกุฎในวันที่นางประกอบร่างโอซิริส ลำต้นอุ่นแม้ในยามค่ำ และนกไอบิสศักดิ์สิทธิ์ไม่ยอมทำรังที่อื่น นักบวชหญิงในชุดลินินขาวกับปลอกคออูเซคทองดูแลมัน เมื่อแสงอาทิตย์กระทบช่อดอกในมุมที่ใช่ ริมแม่น้ำทั้งฝั่งดูเหมือนกำลังลุกไหม้",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 416,
    folder: "moonorchid",
    name: "Moon Orchid",
    rarity: "rare",
    descriptionEN:
      "An orchid from the Himmapan forest that blooms only when the moon is full. Its petals are silvery-blue, thin enough to see through, and they give off a cool glow that makes the air around them shimmer. The roots don't touch soil — they hang in the air and somehow drink moonlight instead of water. Kinnaree birds circle overhead when it blooms, and the fragrance is subtle — like rain on jasmine, but colder. A celestial dancer in a golden Chada crown tends to it with gestures that look more like dance than gardening.",
    descriptionTH:
      "กล้วยไม้จากป่าหิมพานต์ที่บานเฉพาะคืนพระจันทร์เต็มดวง กลีบสีเงินอมฟ้า บางจนมองทะลุ ส่องแสงเย็นจนอากาศรอบมันเป็นประกายระยิบ รากไม่แตะดิน — ห้อยอยู่กลางอากาศแล้วดื่มแสงจันทร์แทนน้ำ กินนรีบินวนเมื่อดอกบาน และกลิ่นหอมนั้นเบาบาง — คล้ายฝนบนมะลิ แต่เย็นกว่า นางรำสวรรค์ในชฎาทองดูแลมันด้วยท่าทางที่ดูเหมือนการรำมากกว่าการทำสวน",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 417,
    folder: "druidoak",
    name: "Druid Oak",
    rarity: "rare",
    descriptionEN:
      "An oak so old the druids claim it was already ancient when they first found it. The trunk is wide enough to hide inside, the bark carved with ogham script that nobody alive can fully read. Mistletoe grows at every fork — the real kind, the kind the druids said could cure death and open doors between worlds. The acorns are heavy and golden, and animals come from miles away to eat them. A woman in green robes tends to it. Touch the bark and you'll feel a hum, deep and steady, like the earth's own heartbeat.",
    descriptionTH:
      "โอ๊คที่เก่าจนดรูอิดอ้างว่ามันเก่าแก่อยู่แล้วตั้งแต่ตอนพวกเขาพบมัน ลำต้นกว้างพอจะซ่อนตัวข้างใน เปลือกสลักอักษรออกัมที่ไม่มีใครมีชีวิตอยู่อ่านได้ครบ มิสเซิลโทขึ้นทุกง่าม — ชนิดจริงๆ ชนิดที่ดรูอิดว่ารักษาความตายได้และเปิดประตูระหว่างโลก ลูกโอ๊คหนักและเป็นสีทอง สัตว์มาจากไกลหลายไมล์เพื่อกิน สตรีในอาภรณ์เขียวดูแลมัน แตะเปลือกแล้วจะรู้สึกถึงเสียงครางต่ำ สม่ำเสมอ เหมือนจังหวะหัวใจของแผ่นดินเอง",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 418,
    folder: "desertrose",
    name: "Desert Rose",
    rarity: "rare",
    descriptionEN:
      "A rose that has no business blooming in the middle of a desert, yet here it is. The petals are deep crimson fading to copper at the edges, and the stems grow through crystalline mineral formations that look like natural jewelry. The story goes that a djinn princess wept for the stars she could never reach, and where her tears hit the sand, these roses grew. A girl in copper-and-gold silk tends to it with a brass oil lamp whose smoke curls protectively around the blooms. The flowers smell of saffron, cardamom, and the first cool hour after sunset.",
    descriptionTH:
      "กุหลาบที่ไม่มีเหตุผลจะบานกลางทะเลทราย แต่มันก็บานอยู่ดี กลีบสีแดงเข้มไล่เป็นทองแดงที่ขอบ ลำต้นโผล่ผ่านผลึกแร่ที่ดูเหมือนเครื่องประดับจากธรรมชาติ เล่ากันว่าเจ้าหญิงจินน์ร้องไห้เพราะคิดถึงดวงดาวที่ไม่มีวันเอื้อมถึง ตรงที่น้ำตาหยดลงบนทราย กุหลาบเหล่านี้ก็ขึ้น สาวน้อยในชุดไหมสีทองแดงดูแลมันด้วยตะเกียงทองเหลืองที่ควันลอยวนปกป้องดอกไม้ ดอกมีกลิ่นหญ้าฝรั่น กระวาน และชั่วโมงแรกที่เย็นลงหลังพระอาทิตย์ตก",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 419,
    folder: "jadebamboo",
    name: "Jade Bamboo",
    rarity: "rare",
    descriptionEN:
      "Bamboo that looks like it was carved from jade, except it's alive and growing. The stalks are translucent green, and when morning light passes through them, the whole grove glows from within. The leaves make a sound like wind chimes in even the slightest breeze. Korean legend says the god Dangun sheltered under bamboo like this when he first descended from heaven to walk the earth. A maiden in a hanbok tends to it. The morning mist seems to come to this grove on purpose, as if it knows it looks better here.",
    descriptionTH:
      "ไผ่ที่ดูเหมือนแกะจากหยก ยกเว้นว่ามันมีชีวิตและกำลังโต ลำต้นสีเขียวโปร่งแสง เมื่อแดดเช้าส่องผ่านจะทำให้ทั้งกอเรืองแสงจากข้างใน ใบส่งเสียงคล้ายกระดิ่งลมแม้ลมแค่แผ่วเบา ตำนานเกาหลีเล่าว่าเทพดันกุนหลบใต้ไผ่แบบนี้เมื่อเสด็จลงจากสวรรค์มาเดินบนโลกครั้งแรก สาวในชุดฮันบกดูแลมัน หมอกเช้าดูเหมือนจะมาที่กอนี้โดยเฉพาะ ราวกับรู้ว่าตัวเองดูดีกว่าเมื่ออยู่ตรงนี้",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 420,
    folder: "firebirdfern",
    name: "Firebird Fern",
    rarity: "rare",
    descriptionEN:
      "A fern that only blooms on one night a year — the night of Ivan Kupala, when Slavic legend says the boundary between the natural and supernatural dissolves. The fronds glow ember-orange from the tips down, and actual sparks drift upward from the leaves like inverse snowfall. Whoever finds a blooming firebird fern is said to gain the sight to see buried treasure. A maiden in a red sarafan and pearl kokoshnik watches over it. The firebird itself sometimes perches nearby, drawn to the only plant whose flames match its own.",
    descriptionTH:
      "เฟิร์นที่บานเพียงคืนเดียวในหนึ่งปี — คืนอีวานกุปาลา เมื่อตำนานสลาฟว่าขอบเขตระหว่างโลกธรรมชาติกับเหนือธรรมชาติเลือนหาย ใบเรืองแสงสีส้มถ่านจากปลายลงมา และประกายไฟลอยขึ้นจากใบเหมือนหิมะกลับหัว ผู้ใดพบเฟิร์นนกไฟบาน ว่ากันว่าจะได้ตาทิพย์มองเห็นสมบัติฝังดิน สาวในชุดซาราฟานแดงกับโคคอชนิกไข่มุกเฝ้าดูแล นกไฟตัวจริงบางทีก็มาเกาะใกล้ๆ ถูกดึงดูดโดยต้นไม้เดียวที่เปลวไฟเข้าคู่กับมัน",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 421,
    folder: "dreamgum",
    name: "Dream Gum",
    rarity: "rare",
    descriptionEN:
      "A ghost gum from the Australian Dreamtime whose white trunk glows in the dark like bone under moonlight. The Aboriginal people say this tree stands at the crossing point where the Dreaming meets the waking world. Its silver leaves rustle with stories — creation songs that have been playing on loop since before time was a thing. Touch the bark and you might see ochre lines tracing paths across the land. A keeper with dot-painted skin watches over it under the Southern Cross.",
    descriptionTH:
      "ยูคาลิปตัสผีจาก Dreamtime ที่ลำต้นสีขาวเรืองแสงในความมืดเหมือนกระดูกใต้แสงจันทร์ ชาวอะบอริจินว่าต้นนี้ยืนอยู่ตรงจุดตัดที่ Dreaming พบกับโลกตื่น ใบสีเงินกรอบกรอบด้วยเรื่องราว — เพลงแห่งการสร้างโลกที่เล่นวนมาตั้งแต่ก่อนเวลาจะมีอยู่ แตะเปลือกแล้วอาจเห็นเส้นสีดินลากเป็นเส้นทางข้ามแผ่นดิน ผู้เฝ้าร่างทาลายจุดดูแลมันใต้กลุ่มดาวกางเขนใต้",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 422,
    folder: "starjasmine",
    name: "Star Jasmine",
    rarity: "rare",
    descriptionEN:
      "A jasmine from the gardens of Eram whose white star-shaped flowers open only after dark. The fragrance is the real attraction — thick, sweet, and somehow visible as a golden mist that hangs in the night air like something you could grab. Persian poets wrote entire ghazals about this scent alone. The vine climbs anything nearby — walls, columns, sleeping garden cats. A woman in turquoise silk reads poetry beneath it, the pages scented by proximity alone. They say if you fall asleep under this jasmine, your dreams will be in verse.",
    descriptionTH:
      "มะลิจากสวนเอรัมที่ดอกรูปดาวสีขาวบานเฉพาะหลังมืด กลิ่นหอมคือพระเอกตัวจริง — เข้มข้น หวาน และมองเห็นได้เป็นหมอกทองที่แขวนอยู่ในอากาศยามค่ำราวกับจับต้องได้ กวีเปอร์เซียเขียนกาซัลทั้งบทเกี่ยวกับกลิ่นนี้อย่างเดียว เถาไต่ทุกอย่างที่อยู่ใกล้ — กำแพง เสา แมวสวนที่หลับอยู่ สตรีในชุดไหมเทอร์ควอยซ์อ่านบทกวีใต้มัน หน้ากระดาษหอมติดแค่เพราะอยู่ใกล้ ว่ากันว่าถ้าหลับใต้มะลินี้ ความฝันจะเป็นกลอน",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 423,
    folder: "spiritcedar",
    name: "Spirit Cedar",
    rarity: "rare",
    descriptionEN:
      "A red cedar from the Pacific Northwest old-growth forest, so massive and old that the First Nations people say it was one of the original trees planted when Raven created the world. The bark is deeply furrowed and reddish-brown, and the boughs smell of something clean and ancient. Spirit animals — eagle, bear, salmon, raven — appear as amber shapes among the branches on foggy mornings. A keeper in a cedar bark cloak leaves offerings at the roots. The totem pole beside it tells the tree's story in a language older than words.",
    descriptionTH:
      "ซีดาร์แดงจากป่าดิบแปซิฟิกตะวันตกเฉียงเหนือ ใหญ่และเก่าจน First Nations เล่าว่าเป็นหนึ่งในต้นไม้แรกที่เรเวนปลูกเมื่อสร้างโลก เปลือกเป็นร่องลึกสีน้ำตาลแดง กิ่งมีกลิ่นสะอาดและเก่าแก่ สัตว์วิญญาณ — อินทรี หมี แซลมอน อีกา — ปรากฏเป็นรูปร่างสีอำพันท่ามกลางกิ่งก้านในเช้าที่มีหมอก ผู้เฝ้าในเสื้อคลุมเปลือกซีดาร์วางเครื่องบูชาที่โคนต้น เสาโทเท็มข้างมันเล่าเรื่องของต้นไม้ในภาษาที่เก่าแก่กว่าคำพูด",
    collection: SpeciesCollection.CelestialCourt,
  },
  {
    id: 424,
    folder: "tibetanblue",
    name: "Tibetan Blue Poppy",
    rarity: "rare",
    descriptionEN:
      "A poppy that grows only above the snow line in the Himalayas, where the air is so thin and pure that colors look different — more real somehow. The petals are blue in a way that doesn't exist at lower altitudes, as if they borrowed their color directly from the sky. The flower is papery and fragile-looking, but it survives conditions that would kill almost anything else. A woman in a red chuba strikes a singing bowl near the roots, and the petals vibrate in harmony — visible sound waves rippling through the blue like stones dropped in water.",
    descriptionTH:
      "ดอกป๊อปปี้ที่ขึ้นเฉพาะเหนือแนวหิมะในหิมาลัย ที่ที่อากาศบางและบริสุทธิ์จนสีสันดูต่างออกไป — จริงกว่าปกติ กลีบเป็นสีน้ำเงินแบบที่ไม่มีอยู่ในที่ต่ำกว่า ราวกับยืมสีมาจากท้องฟ้าโดยตรง ดอกบางเบาดูเปราะ แต่มันอยู่รอดในสภาวะที่ฆ่าเกือบทุกอย่างได้ สตรีในชุดชุบาแดงตีขันสิงห์ใกล้โคนต้น กลีบสั่นสะเทือนเข้าจังหวะ — คลื่นเสียงที่มองเห็นได้กระเพื่อมผ่านสีน้ำเงินเหมือนก้อนหินหล่นลงน้ำ",
    collection: SpeciesCollection.CelestialCourt,
  },
];

export default series;
