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
  // ── Celestial Court — Batch 3: Chinese Legend Characters ─────────────
  {
    id: 425,
    folder: "baimudan",
    name: "Bai Mudan",
    rarity: "legendary",
    descriptionEN:
      "The most beautiful courtesan in all of Luoyang, said to be the earthly incarnation of the white peony flower fairy herself. Her tower is lit by crimson lanterns and scented with the breath of a thousand springs — where travelers, scholars, and even cultivators come to test, or lose, their discipline. She pours tea with a smile that could unmake empires and plays the pipa with fingers that remember every petal that has ever fallen. The peony beside her blooms impossibly full, impossibly white. When it sheds its petals, they never touch the ground.",
    descriptionTH:
      "นางคณิกาผู้งามที่สุดในลั่วหยาง ว่ากันว่าคือร่างจุติของภูติดอกโบตั๋นขาวเอง หอคอยของนางประดับโคมสีเลือดและอบอวลด้วยลมหายใจของฤดูใบไม้ผลินับพัน — ที่ที่นักเดินทาง บัณฑิต และแม้แต่นักพรตเซียนต่างมาพิสูจน์ หรือสูญเสีย วินัยของตน นางรินชาด้วยรอยยิ้มที่ทำลายอาณาจักรได้ และบรรเลงผีผาด้วยนิ้วที่จำกลีบดอกทุกกลีบที่เคยร่วงได้ ดอกโบตั๋นข้างกายนางบานเต็มที่ขาวบริสุทธิ์อย่างไม่น่าเป็นไปได้ เมื่อกลีบร่วง กลีบไม่เคยถึงพื้น",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Flower Spirit of Luoyang",
      th: "ภูติโบตั๋นแห่งลั่วหยาง",
    },
  },
  {
    id: 426,
    folder: "huamulan",
    name: "Hua Mu Lan",
    rarity: "legendary",
    descriptionEN:
      "The daughter of the Hua family who took her father's place in the emperor's army when the conscription scroll arrived and he was too old to march. For twelve years she rode, fought, and was mistaken for a man. When the war ended, she returned home to her loom, changed into women's robes, and the soldiers who had served beside her stood speechless. The magnolia tree beside her grew from the flower-name her mother chose, and its petals — pale violet and ivory — are said never to fall during wartime.",
    descriptionTH:
      "บุตรีแห่งตระกูลฮัวผู้เข้ารบแทนบิดาเมื่อราชหมายเกณฑ์มาถึง และบิดาแก่เกินจะเดินทัพ สิบสองปีที่นางขี่ม้า ออกรบ และถูกเข้าใจว่าเป็นบุรุษ เมื่อสงครามสงบ นางกลับบ้านสู่กี่ทอผ้า เปลี่ยนเป็นอาภรณ์สตรี ทหารที่เคยรบเคียงข้างต่างยืนตะลึงพูดไม่ออก ต้นแมกโนเลียข้างกายนางเติบโตจากชื่อดอกไม้ที่มารดาตั้งให้ และกลีบสีม่วงอ่อนกับงาช้างนั้น ว่ากันว่าไม่เคยร่วงในยามสงคราม",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Maiden Who Rode as a Man",
      th: "นารีผู้ขี่ม้าแทนบุรุษ",
    },
  },
  {
    id: 427,
    folder: "guihua",
    name: "Gui Hua",
    rarity: "legendary",
    descriptionEN:
      "An osmanthus tree that grows only on the moon, tended eternally by the immortal Wu Gang — frozen in his youth as part of his sentence, condemned to chop the tree down for having sought heaven before his time. Each stroke of his divine axe heals as fast as it cuts, and so the work never ends. The tiny golden blossoms release a fragrance that travels on moonlight alone, falling to earth only on clear autumn nights. Those who catch it in their sleep are said to remember people they have loved in lives they no longer recall.",
    descriptionTH:
      "ต้นกุ้ยฮวาที่ขึ้นเฉพาะบนดวงจันทร์ ดูแลชั่วนิรันดร์โดยเซียนหวูกัง — ถูกตรึงไว้ในวัยหนุ่มเป็นส่วนหนึ่งของคำสาป ต้องโค่นมันตลอดกาลเพราะแสวงหาสวรรค์ก่อนเวลาอันควร ทุกครั้งที่ขวานทิพย์ลง บาดแผลของต้นสมานทันที งานจึงไม่มีวันเสร็จ ดอกเล็กสีทองปล่อยกลิ่นหอมที่เดินทางตามแสงจันทร์ ร่วงลงสู่โลกเฉพาะในคืนฤดูใบไม้ร่วงที่ท้องฟ้าแจ่ม ผู้ใดได้กลิ่นในความฝัน ว่ากันว่าจะระลึกถึงคนที่เคยรักในชาติที่ไม่อาจจำได้",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Axe of the Eternal Moon",
      th: "ขวานนิรันดร์เหนือดวงจันทร์",
    },
  },
  {
    id: 428,
    folder: "zijing",
    name: "Zi Jing",
    rarity: "legendary",
    descriptionEN:
      "When the three Tian brothers decided to divide their father's estate, the last possession they could not agree on was the redbud tree in the courtyard. They resolved to chop it into three equal pieces at dawn — and that very night, the tree withered and died from grief. Seeing this, the brothers wept, reconciled, and vowed never to divide their family. At first light the redbud bloomed again, more riotously than ever, every branch heavy with magenta flowers. Since then, it blooms only where siblings dwell beneath one roof.",
    descriptionTH:
      "เมื่อสามพี่น้องตระกูลเถียนตัดสินใจแบ่งมรดกของบิดา สิ่งสุดท้ายที่ตกลงกันไม่ได้คือต้นจื่อจิงกลางลาน พวกเขาจึงตัดสินใจจะโค่นและแบ่งเป็นสามส่วนเท่ากันในยามรุ่งสาง — คืนนั้นเอง ต้นไม้เหี่ยวตายด้วยความโศก เมื่อเห็นเช่นนั้น ทั้งสามร้องไห้ คืนดีกัน และปฏิญาณว่าจะไม่แบ่งแยกครอบครัวอีก พอแสงแรกของวัน จื่อจิงก็บานขึ้นใหม่ บานเกินกว่าที่เคย ทุกกิ่งหนักด้วยดอกสีบานเย็น นับแต่นั้น มันบานเฉพาะที่ที่พี่น้องอาศัยใต้หลังคาเดียวกัน",
    collection: SpeciesCollection.CelestialCourt,
    epithet: {
      en: "Redbud of Unbroken Kinship",
      th: "จื่อจิงแห่งสายเลือดไม่แยก",
    },
  },
  // ── Chinese Garden — Classical Chinese Plants ────────────────────────
  {
    id: 429,
    folder: "mudan",
    name: "Mu Dan",
    rarity: "legendary",
    descriptionEN:
      "The queen of flowers, cultivated in the Tang imperial gardens and painted into more poems than any other bloom. A maiden in Tang-era crimson Qixiong ruqun and gold tends to it — her hair piled high, her sleeves wide enough to hide a small empire. When the peony opens, the other flowers in the garden quietly turn away, embarrassed by their own modesty. Emperors have been known to dismiss court and spend whole days beside a single blooming peony, doing nothing but looking.",
    descriptionTH:
      "ราชินีแห่งดอกไม้ ปลูกในสวนจักรพรรดิยุคถังและถูกวาดลงในบทกวีมากกว่าดอกไม้ใด นางในชุดฉีเซียงหรู่เฉวียนสีเลือดกับทองคอยดูแล — เกล้าผมสูง ชายแขนเสื้อกว้างพอซ่อนอาณาจักรเล็กๆ ได้ เมื่อโบตั๋นบาน ดอกไม้อื่นในสวนหันหน้าหลบเงียบๆ อายในความถ่อมตนของตน จักรพรรดิหลายพระองค์เลิกออกว่าราชการและนั่งข้างโบตั๋นดอกเดียวทั้งวัน โดยไม่ทำอะไรนอกจากมอง",
    collection: SpeciesCollection.ChineseGarden,
    epithet: {
      en: "Queen of Ten Thousand Flowers",
      th: "ราชินีแห่งหมื่นบุปผา",
    },
  },
  {
    id: 430,
    folder: "yinxing",
    name: "Yin Xing",
    rarity: "rare",
    descriptionEN:
      "A ginkgo older than most dynasties, its fan-shaped leaves turning so yellow in autumn that temples are sometimes mistaken for being on fire. A Ming-era maiden in deep-gold Ao Qun tends to it, brushing fallen leaves into a small poem of her own composition. The ginkgo, being patient by nature, waits through empires. It has already outlived three capitals and does not plan to stop.",
    descriptionTH:
      "แปะก๊วยที่แก่กว่าราชวงศ์ส่วนใหญ่ ใบรูปพัดเปลี่ยนเป็นสีเหลืองจนมีผู้เข้าใจผิดว่าอารามกำลังลุกไหม้ในฤดูใบไม้ร่วง นางในชุดเอ้าฉุนยุคหมิงสีทองเข้มคอยดูแล กวาดใบร่วงเป็นบทกวีที่นางแต่งเอง แปะก๊วยอดทนเป็นธรรมชาติ รอผ่านอาณาจักร มันมีอายุยืนกว่าเมืองหลวงสามแห่งแล้ว และไม่คิดจะหยุด",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 431,
    folder: "haitang",
    name: "Hai Tang",
    rarity: "rare",
    descriptionEN:
      "The crabapple Yang Guifei leaned against the morning the emperor could not bear to wake her. A Republic-era maiden in blush-pink Qipao tends to it, silver fan in hand, a wistful smile playing at the corner of her mouth. The blossoms are the colour of a blush someone tried and failed to hide. It is said the tree remembers every sorrow a woman has ever told it, and refuses to repeat a single one.",
    descriptionTH:
      "ต้นไห่ถังที่หยางกุ้ยเฟยเอนกายพิงในเช้าที่จักรพรรดิทรงไม่กล้าปลุก นางในชุดเฉิงซามสมัยสาธารณรัฐสีชมพูระเรื่อคอยดูแล มีพัดเงินในมือ รอยยิ้มครุ่นคิดอยู่ที่มุมปาก ดอกมีสีอายที่ใครสักคนพยายามซ่อนแต่ซ่อนไม่ได้ ว่ากันว่าต้นจำความโศกทุกเรื่องที่สตรีเคยเล่าให้ฟัง และไม่ยอมเล่าซ้ำแม้สักเรื่อง",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 432,
    folder: "taohua",
    name: "Tao Hua",
    rarity: "common",
    descriptionEN:
      "A peach tree from a Tang orchard where the petals fall for thirty days straight every spring and no one ever sweeps them away. A maiden in blush-pink Qixiong ruqun tends to it with a round fan. To pass beneath a blooming peach tree was once said to promise you an unexpected love by summer. The orchard has never been empty of young poets pretending to stroll.",
    descriptionTH:
      "ต้นท้อจากสวนถังที่กลีบร่วงต่อเนื่องสามสิบวันทุกฤดูใบไม้ผลิ และไม่มีใครเคยกวาด นางในชุดฉีเซียงหรู่เฉวียนสีชมพูระเรื่อคอยดูแล มีพัดกลมในมือ เดินลอดต้นท้อที่กำลังบานเคยเชื่อว่าจะได้พบรักไม่คาดฝันก่อนเข้าฤดูร้อน สวนนี้ไม่เคยว่างเว้นจากกวีหนุ่มที่แกล้งเดินเล่น",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 433,
    folder: "juhua",
    name: "Ju Hua",
    rarity: "common",
    descriptionEN:
      "The chrysanthemum Tao Yuanming picked by his eastern fence the day he quit the emperor's service for good. A Han-era maiden in warm-ochre Quju tends to it, a bamboo-slip scroll in hand. The flower smells of autumn, ink, and the particular satisfaction of having walked away from something you did not want. Scholars have been trying to capture its exact yellow in paint for fifteen hundred years.",
    descriptionTH:
      "เก็กฮวยที่เต๋าเยวี้ยนหมิงเด็ดริมรั้วฝั่งตะวันออกในวันที่ลาออกจากราชการถาวร นางในชุดชวีจวีว์ยุคฮั่นสีน้ำตาลอบอุ่นคอยดูแล มีไม้ไผ่แกะบทกวีในมือ ดอกมีกลิ่นฤดูใบไม้ร่วง กลิ่นหมึก และความพอใจเฉพาะตัวของการได้เดินจากสิ่งที่ไม่ต้องการ บัณฑิตพยายามจับสีเหลืองนี้ลงบนผ้าใบมาหนึ่งพันห้าร้อยปีแล้ว",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 434,
    folder: "lanhua",
    name: "Lan Hua",
    rarity: "common",
    descriptionEN:
      "An orchid from a scholar's studio — not a garden flower, a private one, meant to be looked at by someone who already knows how to sit still. A Han-era maiden in ivory Quju tends to it near a guqin, her fingers never quite at rest. Confucius said the orchid blooms alone in an empty valley and lets its fragrance out anyway. The flower has been making the same argument ever since.",
    descriptionTH:
      "กล้วยไม้จากห้องทำงานบัณฑิต — ไม่ใช่ดอกไม้ประจำสวน แต่เป็นของส่วนตัว สำหรับผู้ที่รู้จักนั่งนิ่งแล้ว นางในชุดชวีจวีว์ยุคฮั่นสีงาช้างคอยดูแลข้างกู่ฉิน นิ้วไม่เคยว่างจริง ขงจื่อว่ากล้วยไม้บานอยู่ลำพังในหุบเขาว่าง และปล่อยกลิ่นหอมของมันออกอยู่ดี ดอกนี้ยืนยันข้อโต้แย้งเดิมมาตั้งแต่นั้น",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 435,
    folder: "meigui",
    name: "Mei Gui",
    rarity: "common",
    descriptionEN:
      "A Chinese rose cultivated since the Southern Song — older than any rose the West would recognise, and with fewer apologies. A Republic-era maiden in crimson Qipao tends to it with a folding fan, confident in the way only someone who has already been painted knows how to be. The scent is deep red in a way most perfumes cannot imitate without embarrassing themselves.",
    descriptionTH:
      "กุหลาบจีนที่ปลูกตั้งแต่ซ่งใต้ — เก่าแก่กว่ากุหลาบใดที่ตะวันตกรู้จัก และมีคำขอโทษน้อยกว่า นางในชุดเฉิงซามสมัยสาธารณรัฐสีเลือดคอยดูแล มีพัดพับในมือ มั่นใจในแบบที่เฉพาะผู้ที่เคยถูกวาดเท่านั้นจะรู้วิธีเป็น กลิ่นเป็นสีแดงเข้มในแบบที่น้ำหอมส่วนใหญ่เลียนแบบไม่ได้โดยไม่เขินอาย",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 436,
    folder: "xinghua",
    name: "Xing Hua",
    rarity: "common",
    descriptionEN:
      "The apricot blossoms in a Tang orchard are the colour of a dream right before you wake up. A maiden in ivory Qixiong ruqun tends to it with a round fan, and when the wind shifts the air fills with a smell so specifically of spring that some travelers turn around and go home. In ancient times medical students studied under apricot trees — so the flower has been quietly associated with healing ever since.",
    descriptionTH:
      "ดอกแอปริคอตในสวนถังมีสีของความฝันก่อนตื่น นางในชุดฉีเซียงหรู่เฉวียนสีงาช้างคอยดูแล มีพัดกลมในมือ เมื่อลมเปลี่ยนทิศ อากาศเต็มไปด้วยกลิ่นของฤดูใบไม้ผลิที่เฉพาะเจาะจงจนนักเดินทางบางคนหันหลังกลับบ้าน ในสมัยโบราณ นักเรียนแพทย์เรียนใต้ต้นแอปริคอต — ดอกนี้จึงเชื่อมโยงกับการรักษามาอย่างเงียบๆ นับแต่นั้น",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 437,
    folder: "lihua",
    name: "Li Hua",
    rarity: "common",
    descriptionEN:
      "Pear blossoms so white they make snow look dingy. A Song imperial-garden maiden in ivory Ao Qun tends to it, round silk fan half-raised, her gaze soft and downcast. The old poem said a pear blossom with a raindrop on it is a woman crying — the tree has always liked the comparison but never quite confirmed it. It blooms best in years of imperial sorrow, which is most of them.",
    descriptionTH:
      "ดอกสาลี่ขาวจนหิมะดูหมองลง นางในชุดเอ้าฉุนสวนพระราชวังซ่งสีงาช้างคอยดูแล มีพัดกลมยกขึ้นครึ่ง สายตานุ่มและทอดลง กวีเก่าว่าดอกสาลี่ที่มีเม็ดฝนบนกลีบคือสตรีที่กำลังร้องไห้ — ต้นชอบการเปรียบนี้มาเสมอ แต่ไม่เคยยืนยัน มันบานสวยที่สุดในปีที่ราชสำนักเศร้า ซึ่งแทบทุกปี",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 438,
    folder: "shuixian",
    name: "Shui Xian",
    rarity: "common",
    descriptionEN:
      "The Chinese narcissus blooms for the lunar New Year without fail, as if it owes somebody money and is determined to pay on time. A Ming-era maiden in pale-gold Ao Qun tends to it, bronze incense burner in hand. The fragrance is cold and auspicious — the particular smell of a year that has not yet let you down, because it has not yet begun.",
    descriptionTH:
      "นาซิสซัสจีนบานตรงเทศกาลตรุษจีนทุกปีไม่พลาด ราวกับติดหนี้ใครและตั้งใจจะชำระตรงเวลา นางในชุดเอ้าฉุนยุคหมิงสีทองอ่อนคอยดูแล มีกระถางธูปทองเหลืองในมือ กลิ่นเย็นและเป็นมงคล — กลิ่นเฉพาะของปีที่ยังไม่ทำให้คุณผิดหวัง เพราะยังไม่ได้เริ่ม",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 439,
    folder: "baihe",
    name: "Bai He",
    rarity: "common",
    descriptionEN:
      "A lily from a garden designed around the idea that silence is its own kind of music. A maiden in pale-blue Hanfu tends to it, basket in hand, never quite hurrying. The flower has six petals because in Chinese numerology six means a hundred-year peaceful union. Weddings steal them constantly. The lily does not mind.",
    descriptionTH:
      "ลิลลี่จากสวนที่ออกแบบรอบความเชื่อว่าความเงียบเป็นดนตรีแบบหนึ่ง นางในชุดฮั่นฝูสีฟ้าอ่อนคอยดูแล มีตะกร้าในมือ ไม่เคยรีบ ดอกมีหกกลีบเพราะในเลขศาสตร์จีน หกหมายถึงการครองคู่สงบสุขร้อยปี งานแต่งขโมยมันประจำ ลิลลี่ไม่ว่าอะไร",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 440,
    folder: "songshu",
    name: "Song Shu",
    rarity: "common",
    descriptionEN:
      "A pine from a Taoist mountain where the fog does not lift so much as rearrange itself. A young immortal in deep-green robes tends to it, carved bamboo staff in hand, ageless the way only those who have stopped counting years can be. White cranes circle the peak. The pine is the plant emperors plant when they want to be remembered. The mountain has cooperated so far.",
    descriptionTH:
      "ต้นสนจากภูเขาเต๋าที่หมอกไม่ได้จางหาย แต่จัดเรียงตัวใหม่ เซียนหนุ่มในอาภรณ์เขียวเข้มคอยดูแล มีไม้เท้าไผ่แกะสลักในมือ ไร้วัยในแบบที่เฉพาะผู้เลิกนับปีแล้วเท่านั้นจะเป็นได้ นกกระเรียนขาววนรอบยอดเขา สนคือต้นไม้ที่จักรพรรดิปลูกเมื่ออยากถูกจดจำ ภูเขาร่วมมือด้วยจนถึงตอนนี้",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 441,
    folder: "baishu",
    name: "Bai Shu",
    rarity: "common",
    descriptionEN:
      "A cypress from an imperial academy courtyard, grown by scholars who assumed someone eventually would read what they had written. A Ming-era scholar in sage-green Hanfu tends to it, ink brush poised over an unrolled scroll. The cypress does not mind being forgotten. It is quietly certain of its own usefulness and is never wrong.",
    descriptionTH:
      "ไซเปรสจากลานสถาบันหลวง ปลูกโดยบัณฑิตที่สมมติว่าสักวันจะมีใครอ่านสิ่งที่พวกเขาเขียน บัณฑิตหนุ่มในชุดฮั่นฝูยุคหมิงสีเขียวเสจคอยดูแล มีพู่กันพร้อมเขียนเหนือม้วนกระดาษที่คลี่ออก ไซเปรสไม่รังเกียจการถูกลืม มันแน่ใจอย่างเงียบๆ ในประโยชน์ของตน และไม่เคยคิดผิด",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 442,
    folder: "wutong",
    name: "Wu Tong",
    rarity: "common",
    descriptionEN:
      "The phoenix tree. Legend says the fenghuang will only perch on wutong — no other bough is dignified enough. A Tang-era maiden in lavender Qixiong ruqun tends to it, jade flute in hand, as if rehearsing a song the phoenix might arrive in time to hear. The phoenix has not yet come. The tree, unbothered, keeps growing anyway.",
    descriptionTH:
      "ต้นหงส์ ตำนานว่าฟ่งหวงจะลงเกาะเฉพาะบนอู๋ถง — กิ่งอื่นไม่มีศักดิ์ศรีพอ นางในชุดฉีเซียงหรู่เฉวียนยุคถังสีม่วงอ่อนคอยดูแล มีขลุ่ยหยกในมือ ราวกับซ้อมบทเพลงที่ฟ่งหวงอาจมาถึงทันฟัง ฟ่งหวงยังไม่มา ต้นไม้ไม่รำคาญ และเติบโตต่อไปอยู่ดี",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 443,
    folder: "shiliu",
    name: "Shi Liu",
    rarity: "common",
    descriptionEN:
      "A pomegranate tree a Ming bride once planted in a courtyard because the fruit has a hundred seeds and the in-laws had been hinting for a year. A Ming-era maiden in vermilion Ao Qun tends to it, red-lacquered basket in hand. The blossoms are the colour of a wedding veil in a village where weddings mean something. The fruit splits itself open every autumn, generously.",
    descriptionTH:
      "ต้นทับทิมที่เจ้าสาวสมัยหมิงปลูกในลานบ้านเพราะผลมีร้อยเมล็ด และญาติสามีใบ้มาทั้งปี นางในชุดเอ้าฉุนยุคหมิงสีแดงชาดคอยดูแล มีตะกร้าแดงในมือ ดอกมีสีเดียวกับผ้าคลุมหน้าเจ้าสาวในหมู่บ้านที่งานแต่งมีความหมาย ผลแตกตัวเองทุกฤดูใบไม้ร่วง อย่างใจกว้าง",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 444,
    folder: "furong",
    name: "Fu Rong",
    rarity: "common",
    descriptionEN:
      "A hibiscus beside an old pond, where the water is still enough to reflect any lie. A Republic-era maiden in turquoise Qipao tends to it, fan half-closed in her hand. The flower is pink in the morning, red by afternoon, and white by evening — as if it cannot decide on a mood and has made a whole life of that. The poets approve.",
    descriptionTH:
      "ชบาจีนริมสระเก่า น้ำที่นิ่งพอจะสะท้อนทุกคำโกหก นางในชุดเฉิงซามสมัยสาธารณรัฐสีเทอร์ควอยซ์คอยดูแล มีพัดปิดครึ่งในมือ ดอกเป็นสีชมพูในยามเช้า สีแดงในบ่าย และขาวในยามเย็น — ราวกับตัดสินใจไม่ได้ว่าจะอยู่อารมณ์ไหน และทำทั้งชีวิตไปกับเรื่องนี้ กวีเห็นด้วย",
    collection: SpeciesCollection.ChineseGarden,
  },
  {
    id: 445,
    folder: "yelaixiang",
    name: "Ye Lai Xiang",
    rarity: "common",
    descriptionEN:
      "A night-blooming flower that opens only after the lanterns are lit, releasing a fragrance so thick you can almost see it drifting through the evening air. A Republic-era maiden in midnight-blue Qipao tends to it, silver lantern in hand, fireflies forming small constellations around her shoulders. The flower closes at dawn as if embarrassed to be caught doing something so sincere.",
    descriptionTH:
      "ดอกหอมกลางคืนที่บานหลังโคมถูกจุดเท่านั้น ปล่อยกลิ่นเข้มจนแทบเห็นเป็นไอลอยในอากาศยามค่ำ นางในชุดเฉิงซามสมัยสาธารณรัฐสีน้ำเงินเที่ยงคืนคอยดูแล มีตะเกียงเงินในมือ หิ่งห้อยรวมกลุ่มคล้ายกลุ่มดาวเล็กๆ รอบบ่า ดอกหุบยามรุ่งสางราวกับเขินที่ถูกจับได้ว่ากำลังทำสิ่งจริงใจขนาดนั้น",
    collection: SpeciesCollection.ChineseGarden,
  },
];

export default series;
