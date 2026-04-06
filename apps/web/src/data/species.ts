import type { Rarity } from "@florify/shared";

export enum SpeciesCollection {
  Original = "original",
}

/**
 * The 300-species catalogue.
 *
 * Each entry is hand-written: display name, rarity, and EN/TH lore
 * descriptions live directly on the object. There is no template /
 * builder — edits here are content edits.
 *
 * `id` is a stable integer key (0..299) that lives in save data and must
 * equal the entry's index. `folder` matches `public/floras/{folder}/` and
 * must stay in lock-step with `FLORA_NAMES` so the stage webps still
 * resolve. The integrity check at the bottom of this file guards both
 * invariants.
 *
 * Rarity bands follow the drop pool in `gameStore`: ids 0..199 common,
 * 200..279 rare, 280..299 legendary.
 */

export interface SpeciesDef {
  readonly id: number;
  readonly name: string;
  readonly folder: string;
  readonly rarity: Rarity;
  readonly descriptionEN: string;
  readonly descriptionTH: string;
  readonly collection: SpeciesCollection;
}

export const SPECIES: readonly SpeciesDef[] = [
  {
    id: 0,
    folder: "sunleaf",
    name: "Sunleaf",
    rarity: "common",
    descriptionEN:
      "The first leaf to open its face to the morning, every morning, since the world was new. Sages swear the sun does not truly rise until a single sunleaf unfurls somewhere in the kingdom — and on the dawn it fails to, the sky waits.",
    descriptionTH:
      "ใบไม้แรกที่เปิดหน้ารับยามเช้า ทุกเช้า นับแต่โลกยังใหม่ ปราชญ์โบราณสาบานว่าดวงอาทิตย์จะยังไม่ขึ้นจริง จนกว่าใบสุริยันใบหนึ่งจะคลี่บานที่ใดสักแห่งในราชอาณาจักร — และในรุ่งอรุณใดที่มันไม่คลี่ ท้องฟ้าจะรอคอย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 1,
    folder: "sunfern",
    name: "Sunfern",
    rarity: "common",
    descriptionEN:
      "Unfurls one new frond each dawn and lets yesterday's quietly yellow and fall, a tidy little ritual of moving on. Gardeners say a house with a sunfern in it never dwells on yesterday's quarrels for long.",
    descriptionTH:
      "คลี่ใบใหม่หนึ่งใบทุกเช้า และปล่อยให้ใบของเมื่อวานค่อย ๆ เหลืองร่วงลง ราวกับพิธีกรรมเล็ก ๆ แห่งการก้าวต่อ ชาวสวนเล่ากันว่าบ้านใดมีเฟิร์นสุริยันอยู่ ความข้องใจของเมื่อวานจะไม่ค้างอยู่ในบ้านนั้นนาน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 2,
    folder: "sunbloom",
    name: "Sunbloom",
    rarity: "common",
    descriptionEN:
      "A flower that only opens for someone it thinks deserves the morning; the rest of the day it sulks shut. Temple acolytes kneel before closed sunblooms at dawn, and those who rise holding an open one are said to be worth a little trouble for.",
    descriptionTH:
      "ดอกไม้ที่บานให้เฉพาะคนซึ่งมันเห็นว่าคู่ควรกับเช้าวันใหม่ นอกนั้นจะงอนหุบตัวทั้งวัน ลูกศิษย์วัดคุกเข่าต่อหน้าดอกที่ยังปิดในยามรุ่งอรุณ และผู้ที่ลุกขึ้นพร้อมดอกบานในมือ ว่ากันว่าเป็นคนที่น่าจะยอมลำบากเพื่อสักหน่อย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 3,
    folder: "sunpetal",
    name: "Sunpetal",
    rarity: "common",
    descriptionEN:
      "Children press them into old books to keep the dark out of the page, and mostly it works. Unfolded again after a winter, a sunpetal still smells faintly of the morning it was picked.",
    descriptionTH:
      "เด็ก ๆ ชอบเอาไปอัดไว้ในสมุดเก่าเพื่อกันความมืดเล็ดลอดเข้าสู่หน้ากระดาษ และส่วนใหญ่ก็ได้ผล คลี่ออกมาอีกครั้งหลังผ่านฤดูหนาวไปแล้ว กลีบสุริยันยังหอมจาง ๆ เป็นกลิ่นของเช้าวันที่ถูกเด็ดมา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 4,
    folder: "sunmoss",
    name: "Sunmoss",
    rarity: "common",
    descriptionEN:
      "Grows only on the eastern face of stones, mapping the direction of every sunrise since the stone was laid. Travelers who have lost their way kneel and read the moss the way others read stars.",
    descriptionTH:
      "งอกเฉพาะด้านตะวันออกของก้อนหิน บันทึกทิศของอรุณทุกครั้งตั้งแต่วันที่หินนั้นถูกวางลง ผู้เดินทางที่หลงทางจะคุกเข่าลงอ่านมอสนี้ เหมือนที่คนอื่นอ่านดวงดาว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 5,
    folder: "moonleaf",
    name: "Moonleaf",
    rarity: "common",
    descriptionEN:
      "Its underside silvers only when someone nearby is lying. Midwives used to tuck one beneath a birthing-bed so the room would hold only truth while the child's name was chosen.",
    descriptionTH:
      "ด้านใต้ของใบจะเงาเป็นสีเงินเฉพาะเมื่อมีคนใกล้ ๆ กำลังโกหก นางผดุงครรภ์สมัยก่อนจะซุกไว้ใต้เตียงคลอด ให้ในห้องนั้นมีแต่ความจริงในเวลาที่ชื่อของทารกถูกเลือก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 6,
    folder: "moonfern",
    name: "Moonfern",
    rarity: "common",
    descriptionEN:
      "It only unfurls by moonlight, and folds up so fast when you light a lantern that foragers nicknamed it 'the shy cousin'. One frond steeped in cold water is said to trade you an hour of dreamless sleep.",
    descriptionTH:
      "คลี่ตัวเฉพาะใต้แสงจันทร์ และหุบเร็วจนนักเก็บสมุนไพรเรียกมันเล่น ๆ ว่า 'ลูกพี่ลูกน้องขี้อาย' หากจุดตะเกียงเข้าใกล้ ใบหนึ่งใบแช่น้ำเย็นว่ากันว่าแลกได้กับการหลับไร้ฝันหนึ่งชั่วโมงพอดี",
    collection: SpeciesCollection.Original,
  },
  {
    id: 7,
    folder: "moonbloom",
    name: "Moonbloom",
    rarity: "common",
    descriptionEN:
      "Opens at moonrise and closes the instant the first bird sings, as if embarrassed to be seen in daylight. Its pollen, caught on a silver pin, is the traditional gift a witch gives her chosen successor.",
    descriptionTH:
      "บานเมื่อจันทร์ขึ้นและหุบทันทีที่นกตัวแรกขับขาน ราวกับอายที่จะถูกเห็นในแสงวัน เกสรของมันที่รองด้วยเข็มเงินคือของขวัญดั้งเดิมที่แม่มดมอบให้แก่ทายาทที่เลือกไว้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 8,
    folder: "moonpetal",
    name: "Moonpetal",
    rarity: "common",
    descriptionEN:
      "Each petal is said to be a single good dream that lost its way to a sleeper. Carry one in your pocket and tonight you may dream someone else's happy ending.",
    descriptionTH:
      "ว่ากันว่ากลีบแต่ละกลีบคือความฝันดี ๆ หนึ่งฝันที่หลงทางระหว่างเดินไปหาผู้หลับใหล พกไว้ในกระเป๋าสักกลีบ คืนนี้เจ้าอาจได้ฝันตอนจบอันเป็นสุขของใครสักคน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 9,
    folder: "moonmoss",
    name: "Moonmoss",
    rarity: "common",
    descriptionEN:
      "It grows only on stones struck by unbroken moonlight for a hundred nights, which is rarer than it sounds. Step on a patch at midnight and your shadow will not step with you again until dawn.",
    descriptionTH:
      "งอกเฉพาะบนหินที่ต้องแสงจันทร์ต่อเนื่องหนึ่งร้อยคืนโดยไม่ขาด ซึ่งหายากกว่าที่คิด เหยียบกอของมันยามเที่ยงคืน เงาของเจ้าจะไม่ก้าวตามไปอีกจนกว่ารุ่งสาง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 10,
    folder: "starleaf",
    name: "Starleaf",
    rarity: "common",
    descriptionEN:
      "Every vein maps a real constellation, though the constellation shifts as the leaf ages. Children who memorize a starleaf at seven grow up unable to get lost on any clear night.",
    descriptionTH:
      "เส้นใบทุกเส้นคือแผนที่ของกลุ่มดาวจริง ทว่ากลุ่มดาวนั้นจะค่อย ๆ เปลี่ยนไปตามอายุของใบ เด็กที่จดจำใบดาราได้ตอนอายุเจ็ดขวบ จะโตขึ้นโดยไม่เคยหลงในคืนฟ้าใส",
    collection: SpeciesCollection.Original,
  },
  {
    id: 11,
    folder: "starfern",
    name: "Starfern",
    rarity: "common",
    descriptionEN:
      "Glints faintly when wishes are made within earshot, brightest for the foolish ones. Hermits grow a row along their doorways as an unkind but honest porch-light.",
    descriptionTH:
      "ส่องประกายจาง ๆ เมื่อมีการขอพรในระยะที่ได้ยิน และสว่างที่สุดเมื่อเป็นคำอธิษฐานโง่เขลา นักบวชสันโดษปลูกมันเรียงเป็นแถวหน้าประตู ใช้เป็นไฟต้อนรับที่ไม่เกรงใจแต่ซื่อสัตย์",
    collection: SpeciesCollection.Original,
  },
  {
    id: 12,
    folder: "starbloom",
    name: "Starbloom",
    rarity: "common",
    descriptionEN:
      "Its seven petals open one by one across seven nights, matching the phases of a small private moon only it can see. Pick it on the seventh night and any wish you speak into the bloom stays spoken for a year.",
    descriptionTH:
      "กลีบทั้งเจ็ดจะค่อย ๆ บานทีละกลีบตลอดเจ็ดคืน ตรงกับข้างขึ้นข้างแรมของจันทร์น้อยส่วนตัวที่มีเพียงมันเห็น เด็ดมันในคืนที่เจ็ดและคำอธิษฐานใดที่เจ้ากระซิบลงในดอก จะยังถูกเอ่ยไว้นานหนึ่งปี",
    collection: SpeciesCollection.Original,
  },
  {
    id: 13,
    folder: "starpetal",
    name: "Starpetal",
    rarity: "common",
    descriptionEN:
      "Said to be starlight that fell too slowly and grew roots on its way down. Place one on a child's eyelid and, for a heartbeat, they will see what the sky looked like before the stars were named.",
    descriptionTH:
      "ว่ากันว่าคือแสงดาวที่ร่วงลงมาช้าเกินไป และงอกรากเสียระหว่างทาง วางไว้บนเปลือกตาเด็กสักกลีบ เพียงชั่วเต้นของหัวใจ เด็กคนนั้นจะได้เห็นว่าท้องฟ้ามีหน้าตาอย่างไรก่อนที่ดวงดาวทั้งปวงจะมีชื่อ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 14,
    folder: "starmoss",
    name: "Starmoss",
    rarity: "common",
    descriptionEN:
      "Grows in tiny pinpricks across damp stone like a miniature night sky. Astronomers have been caught charting patches of it instead of the real thing on cloudy weeks, and no one has complained about their maps.",
    descriptionTH:
      "งอกเป็นจุดเล็ก ๆ บนหินชื้นราวกับท้องฟ้ายามราตรีจำลอง นักดูดาวเคยถูกจับได้ว่าแอบจดแผนที่จากกอของมันแทนของจริงในสัปดาห์ที่ฟ้ามืดครึ้ม และไม่มีใครท้วงแผนที่เหล่านั้นเลยสักราย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 15,
    folder: "dawnleaf",
    name: "Dawnleaf",
    rarity: "common",
    descriptionEN:
      "Unfolds at the exact moment the horizon first separates from the sky, so reliably that shepherds use them as clocks. A leaf plucked at that instant is said to stay warm all day, even in winter hands.",
    descriptionTH:
      "คลี่ตัวตรงเสี้ยวเวลาที่เส้นขอบฟ้าแยกจากผืนฟ้าเป็นครั้งแรก แม่นจนคนเลี้ยงแกะใช้มันแทนนาฬิกา ใบที่ถูกเด็ดในเสี้ยววินาทีนั้นว่ากันว่าอุ่นอยู่ตลอดทั้งวัน แม้อยู่ในมือที่หนาวเหน็บ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 16,
    folder: "dawnfern",
    name: "Dawnfern",
    rarity: "common",
    descriptionEN:
      "A fern that refuses to have ever been young — even its first fronds uncoil already looking slightly nostalgic. Brewed into tea, it settles hearts that woke up afraid of the day ahead.",
    descriptionTH:
      "เฟิร์นที่ปฏิเสธการมีวัยเยาว์ ใบแรกของมันก็ยังคลี่ออกมาพร้อมท่าทีคิดถึงอดีตเล็กน้อย ชงเป็นชา ช่วยให้หัวใจที่ตื่นขึ้นมาพร้อมความกลัววันข้างหน้าสงบลงได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 17,
    folder: "dawnbloom",
    name: "Dawnbloom",
    rarity: "common",
    descriptionEN:
      "Said to be the very first flower the world ever tried, and it has never quite gotten over the praise. Its scent, faint as it is, can coax a grieving person out of bed on a morning when nothing else can.",
    descriptionTH:
      "ว่ากันว่าเป็นดอกไม้ดอกแรกที่โลกเคยลองทำขึ้น และก็ยังเก็บคำชมจากครั้งนั้นไว้ในใจเสมอ กลิ่นอันแผ่วเบาของมันชักจูงให้คนที่กำลังเศร้าลุกจากเตียงได้ในเช้าวันที่ไม่มีอะไรอื่นทำได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 18,
    folder: "dawnpetal",
    name: "Dawnpetal",
    rarity: "common",
    descriptionEN:
      "Glows gold for the first hour after sunrise, then turns plain cream for the rest of the day as if catching its breath. Alchemists save the gold phase in tiny sealed jars and sell it, dishonestly, as bottled morning.",
    descriptionTH:
      "เรืองเป็นสีทองในหนึ่งชั่วโมงแรกหลังดวงอาทิตย์ขึ้น จากนั้นก็ค่อย ๆ จางเป็นสีครีมธรรมดาไปตลอดวัน ราวกับกำลังพักหายใจ นักเล่นแร่แปรธาตุเก็บช่วงเวลาทองคำนี้ใส่ขวดเล็ก ๆ แล้วขาย—อย่างไม่สุจริตนัก—ในนาม 'ยามเช้าบรรจุขวด'",
    collection: SpeciesCollection.Original,
  },
  {
    id: 19,
    folder: "dawnmoss",
    name: "Dawnmoss",
    rarity: "common",
    descriptionEN:
      "Only grows where an old sorrow was finally let go of at sunrise. Cartographers who specialize in healing trails follow patches of it instead of roads.",
    descriptionTH:
      "งอกเฉพาะจุดที่ความเศร้าเก่า ๆ ถูกปล่อยวางไปในยามอรุณรุ่ง นักทำแผนที่ที่ชำนาญเส้นทางเยียวยาใจเดินตามกอของมันแทนที่จะเดินตามถนน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 20,
    folder: "duskleaf",
    name: "Duskleaf",
    rarity: "common",
    descriptionEN:
      "Turns the colour of whichever sky it saw last, so no two are ever quite alike. Hung above a doorway, it reminds the house which evening it is in case the house forgets.",
    descriptionTH:
      "เปลี่ยนสีไปตามท้องฟ้าผืนสุดท้ายที่มันได้เห็น ไม่มีใบใดเหมือนกันเลยสักใบ แขวนเหนือประตู มันจะคอยเตือนบ้านว่าตอนนี้เป็นเย็นของคืนไหน เผื่อว่าบ้านจะหลงลืม",
    collection: SpeciesCollection.Original,
  },
  {
    id: 21,
    folder: "duskfern",
    name: "Duskfern",
    rarity: "common",
    descriptionEN:
      "Closes fronds one by one as the light drains from the sky, like fingers curling around a cooling cup. The last frond to close is the one that remembers the day best, and a mourner who sleeps beside it will dream kindly.",
    descriptionTH:
      "หุบใบทีละใบขณะที่แสงระบายออกจากท้องฟ้า ราวกับนิ้วมือที่ค่อย ๆ กำรอบถ้วยซึ่งเย็นลง ใบใบสุดท้ายที่หุบคือใบที่จดจำวันนั้นได้ดีที่สุด และผู้โศกเศร้าที่หลับข้างมันจะได้ฝันอย่างอ่อนโยน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 22,
    folder: "duskbloom",
    name: "Duskbloom",
    rarity: "common",
    descriptionEN:
      "Only opens during the seven minutes when the sky is neither day nor night, a window it seems to find on its own. People born during that same window feel the flower tug at them, gently, whenever it blooms.",
    descriptionTH:
      "บานเฉพาะในเจ็ดนาทีที่ฟ้าไม่ใช่ทั้งกลางวันและกลางคืน ช่วงเวลาที่มันดูเหมือนจะรู้จักหาเองได้ ผู้ที่เกิดในช่วงเวลาเดียวกันนั้นจะรู้สึกว่ามันเรียกหาอย่างแผ่ว ๆ ทุกครั้งที่บาน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 23,
    folder: "duskpetal",
    name: "Duskpetal",
    rarity: "common",
    descriptionEN:
      "Smells exactly like the evening you remember as the best of your childhood, even if you cannot quite place why. Scholars argue whether the petal changes for each person or if all childhoods smell alike.",
    descriptionTH:
      "หอมเหมือนเย็นวันที่เจ้าจำได้ว่าเป็นวันที่ดีที่สุดในวัยเด็ก แม้จะบอกไม่ถูกว่าทำไม นักปราชญ์ยังถกเถียงกันว่ากลีบของมันเปลี่ยนกลิ่นไปตามคนที่ดม หรือว่าที่จริงแล้ววัยเด็กทุกคนมีกลิ่นเดียวกัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 24,
    folder: "duskmoss",
    name: "Duskmoss",
    rarity: "common",
    descriptionEN:
      "Takes on the exact shade of regret at the hour the regret first happened, though it keeps the secret to itself. Pressed between fingers, it smells quietly of unsent letters.",
    descriptionTH:
      "ซึมสีเข้มเป็นเงาของความเสียดายในชั่วโมงที่ความเสียดายนั้นเกิดขึ้น ทว่ามันเก็บความลับไว้กับตัวเสมอ ถูกบี้เบา ๆ ระหว่างนิ้วมือ กลิ่นของมันจะชวนให้นึกถึงจดหมายที่ไม่เคยถูกส่ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 25,
    folder: "nightleaf",
    name: "Nightleaf",
    rarity: "common",
    descriptionEN:
      "Black as deep water and cool to the touch even in summer. Laid on a fevered forehead it draws the heat out in slow sips, and the leaf itself turns a little warmer for hours afterwards.",
    descriptionTH:
      "ดำสนิทดั่งน้ำลึก และสัมผัสเย็นยะเยือกแม้ในฤดูร้อน วางลงบนหน้าผากของผู้มีไข้ มันจะค่อย ๆ ดูดความร้อนออกทีละน้อย และตัวใบเองจะอุ่นขึ้นเล็กน้อยไปอีกหลายชั่วโมงหลังจากนั้น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 26,
    folder: "nightfern",
    name: "Nightfern",
    rarity: "common",
    descriptionEN:
      "Grows in the deepest corner of any room it is placed in, no matter how much you move it. Thieves will not enter a house with a mature nightfern — not because it tells, but because it remembers.",
    descriptionTH:
      "งอกในมุมที่มืดที่สุดของห้องไม่ว่าจะถูกย้ายไปตรงไหน โจรจะไม่เข้าบ้านที่มีเฟิร์นราตรีซึ่งโตเต็มที่ — ไม่ใช่เพราะมันจะฟ้อง แต่เพราะมันจำได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 27,
    folder: "nightbloom",
    name: "Nightbloom",
    rarity: "common",
    descriptionEN:
      "Opens only in perfect darkness, so most gardeners have never seen it bloom. The ones who have describe its colour afterwards, and agree on every detail, and still cannot name it.",
    descriptionTH:
      "บานเฉพาะในความมืดสนิท จนชาวสวนส่วนใหญ่ไม่เคยเห็นมันบานเลย ผู้ที่เคยเห็นจะเล่าถึงสีของมันในภายหลัง ตรงกันทุกรายละเอียด และทุกคนยังคงเรียกสีนั้นไม่ถูก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 28,
    folder: "nightpetal",
    name: "Nightpetal",
    rarity: "common",
    descriptionEN:
      "Each petal is the exact darkness of the moment before a secret is told. Bards drop one into their wine before telling a story they want remembered, and remembered it is, though not always kindly.",
    descriptionTH:
      "กลีบแต่ละกลีบเป็นความมืดเท่ากับชั่วขณะก่อนที่ความลับจะถูกเล่าออกมา กวีจรจะหย่อนกลีบหนึ่งลงในเหล้าก่อนเล่าเรื่องที่อยากให้ถูกจดจำ และมันก็ถูกจดจำจริง แม้จะไม่ใช่ในทางที่ดีเสมอไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 29,
    folder: "nightmoss",
    name: "Nightmoss",
    rarity: "common",
    descriptionEN:
      "So dark green it looks black, and it swallows footfalls so completely that children practice sneaking on it for the hide-and-seek tournaments of summer. Adults who step on it too often lose the habit of announcing themselves in other rooms.",
    descriptionTH:
      "เขียวเข้มจนดูดำ และกลืนเสียงฝีเท้าจนมิด เด็ก ๆ มักซ้อมย่องบนมันเพื่อแข่งซ่อนหาช่วงฤดูร้อน ผู้ใหญ่ที่เหยียบมันบ่อยเกินไปมักเผลอเลิกนิสัยที่จะประกาศตัวเวลาเข้าห้องอื่น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 30,
    folder: "dreamleaf",
    name: "Dreamleaf",
    rarity: "common",
    descriptionEN:
      "A leaf that rustles when nobody is in the room, as if replaying a conversation it overheard in someone's sleep. Pressed under a pillow it gently borrows back the dream you had last night and shows it to you again, fixed.",
    descriptionTH:
      "ใบที่ไหวเสียงซู่ซ่าเมื่อไม่มีใครอยู่ในห้อง ราวกับกำลังเล่นซ้ำบทสนทนาที่มันแอบได้ยินในยามใครบางคนหลับ อัดไว้ใต้หมอน มันจะแอบยืมฝันของเจ้าเมื่อคืนคืน แล้วฉายให้ดูใหม่ในแบบที่ถูกซ่อมเสียแล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 31,
    folder: "dreamfern",
    name: "Dreamfern",
    rarity: "common",
    descriptionEN:
      "Its fronds curl in the exact shape of whatever the grower is thinking about most that week. Analysts have cheerfully used it to diagnose their friends, with mixed diplomatic results.",
    descriptionTH:
      "ก้านใบของมันขดเป็นรูปร่างของสิ่งที่คนปลูกคิดถึงมากที่สุดในสัปดาห์นั้น นักวิเคราะห์ใช้มันวินิจฉัยจิตใจเพื่อนฝูงอย่างร่าเริง ด้วยผลทางการทูตที่ปนเปกันไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 32,
    folder: "dreambloom",
    name: "Dreambloom",
    rarity: "common",
    descriptionEN:
      "Opens different colours for each person who looks at it, and never the same colour twice for the same person in one lifetime. The colour you see it today, witches say, is the shape your next dream will take.",
    descriptionTH:
      "บานเป็นสีต่างกันให้แต่ละคนที่มอง และจะไม่ซ้ำสีเดิมสำหรับคนเดียวกันเลยตลอดชีวิต แม่มดเชื่อว่าสีที่เจ้ามองเห็นในวันนี้คือรูปทรงของฝันครั้งถัดไปของเจ้า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 33,
    folder: "dreampetal",
    name: "Dreampetal",
    rarity: "common",
    descriptionEN:
      "Weightless in the hand but heavier in the heart the longer you hold it. Keep it too long and you will sleep three days in a row and wake up having decided something important.",
    descriptionTH:
      "เบาหวิวในฝ่ามือแต่หนักอึ้งในอกยิ่งถืออยู่นาน ถือไว้นานเกินไปแล้วเจ้าจะหลับสามวันสามคืน และตื่นขึ้นมาพร้อมการตัดสินใจเรื่องสำคัญบางอย่างแล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 34,
    folder: "dreammoss",
    name: "Dreammoss",
    rarity: "common",
    descriptionEN:
      "Feels the way waking from a good dream feels, soft in a way that has nothing to do with texture. Sleepwalkers who cross it in bare feet wake up exactly where they should have been going.",
    descriptionTH:
      "สัมผัสของมันคือความรู้สึกที่เราตื่นจากฝันดี อ่อนนุ่มในแบบที่ไม่เกี่ยวข้องกับเนื้อสัมผัสเลย คนที่เดินละเมอแล้วก้าวผ่านกอของมันด้วยเท้าเปล่า จะตื่นขึ้น ณ จุดที่ตัวเองควรกำลังมุ่งไปพอดี",
    collection: SpeciesCollection.Original,
  },
  {
    id: 35,
    folder: "mistleaf",
    name: "Mistleaf",
    rarity: "common",
    descriptionEN:
      "Blurs at the edges as if it has not fully decided whether to be a leaf today. Grasp it quickly — hesitate and you will be holding air, and an apology nobody spoke.",
    descriptionTH:
      "ขอบใบพร่ามัวราวกับมันยังไม่ตัดสินใจว่าวันนี้จะเป็นใบไม้หรือไม่ ต้องรีบคว้า หากลังเล เจ้าจะกำอากาศไว้ พร้อมคำขอโทษที่ไม่มีใครเอ่ยขึ้นมา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 36,
    folder: "mistfern",
    name: "Mistfern",
    rarity: "common",
    descriptionEN:
      "Looks solid from a distance and translucent up close, as if the act of seeing it clearly undoes it a little. Herbalists harvest it by feel, eyes closed, or they come home empty-handed.",
    descriptionTH:
      "มองจากไกลเห็นเป็นตัวตนชัดเจน แต่พอเข้าใกล้กลับโปร่งแสง ราวกับการเพ่งมองมันชัดเจนนั้นคือสิ่งที่ทำให้มันจางไปทีละนิด หมอยาจะเก็บมันด้วยสัมผัส หลับตา มิเช่นนั้นก็จะกลับบ้านมือเปล่า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 37,
    folder: "mistbloom",
    name: "Mistbloom",
    rarity: "common",
    descriptionEN:
      "Its petals never quite settle — they blur at the edges as if the flower has not yet decided whether to exist. Travelers who pluck one at dawn find their footsteps grow quieter for seven days, long enough to slip past any sentinel.",
    descriptionTH:
      "กลีบของมันไม่เคยหยุดนิ่ง ขอบเบลอราวกับดอกไม้ยังไม่ตัดสินใจว่าจะมีตัวตน ผู้เดินทางที่เด็ดมันยามรุ่งอรุณจะพบว่าฝีเท้าของตนเงียบลงอยู่เจ็ดวัน นานพอจะลอดผ่านสายตายามทุกคน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 38,
    folder: "mistpetal",
    name: "Mistpetal",
    rarity: "common",
    descriptionEN:
      "Falls off the flower not downwards but sideways, drifting into whichever direction holds the next wanderer. Catch one on your sleeve and you have been adopted by a road you have not yet walked.",
    descriptionTH:
      "กลีบร่วงจากดอกไม่ใช่ลงเบื้องล่าง แต่ล่องไปข้าง ๆ สู่ทิศที่นักเดินทางคนต่อไปอยู่ ได้มาติดที่ชายเสื้อสักกลีบหนึ่ง หมายความว่าเจ้าถูกรับเป็นลูกบุญธรรมโดยถนนที่ยังไม่ได้เดิน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 39,
    folder: "mistmoss",
    name: "Mistmoss",
    rarity: "common",
    descriptionEN:
      "Grows where a path has been forgotten for exactly a generation — any shorter and it will not take, any longer and it turns to ordinary moss. Follow a trail of it and you will find a place nobody alive remembers except, dimly, you.",
    descriptionTH:
      "งอกบนเส้นทางที่ถูกลืมมาพอดีหนึ่งช่วงอายุคน หากสั้นกว่านั้นมันจะไม่งอก หากนานกว่านั้นมันจะกลายเป็นมอสธรรมดา เดินตามรอยของมันไป แล้วเจ้าจะไปถึงสถานที่ที่ไม่มีใครยังมีชีวิตอยู่จำได้ — ยกเว้นเจ้า อย่างรำไร",
    collection: SpeciesCollection.Original,
  },
  {
    id: 40,
    folder: "stormleaf",
    name: "Stormleaf",
    rarity: "common",
    descriptionEN:
      "Crackles faintly when held against a coming weather change, like a letter arriving early. Farmers used to nail a stormleaf to the barn door as an honest forecast that outlasted any almanac.",
    descriptionTH:
      "ดังกรอบแกรบแผ่ว ๆ เมื่อถืออยู่ใกล้การเปลี่ยนแปลงของสภาพอากาศที่กำลังมา เหมือนจดหมายที่มาถึงก่อนเวลา ชาวนาสมัยก่อนจะตอกใบพายุไว้ที่ประตูยุ้งฉาง ใช้เป็นคำพยากรณ์ตรง ๆ ที่แม่นกว่าปฏิทินใดเล่มใด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 41,
    folder: "stormfern",
    name: "Stormfern",
    rarity: "common",
    descriptionEN:
      "Each frond uncoils with a small flash of static, not enough to hurt but enough to notice. Kept in a workshop, it keeps tempers a hair's breadth from snapping into proper lightning.",
    descriptionTH:
      "ใบทุกใบคลี่ตัวพร้อมประกายไฟฟ้าสถิตเล็ก ๆ ไม่มากพอจะเจ็บแต่มากพอจะรู้สึกได้ เก็บไว้ในห้องทำงานช่าง มันจะกันอารมณ์ร้าย ๆ ไม่ให้ลั่นกลายเป็นฟ้าผ่าจริง ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 42,
    folder: "stormbloom",
    name: "Stormbloom",
    rarity: "common",
    descriptionEN:
      "Only flowers after true thunder has passed directly overhead, and the bloom lasts only as long as the storm's memory in the soil. Ships carry one in a glass jar to taste the weather a day before the wind.",
    descriptionTH:
      "ออกดอกหลังจากสายฟ้าจริงผ่านเหนือศีรษะเท่านั้น และดอกจะคงอยู่เท่ากับความทรงจำของพายุลูกนั้นในผืนดิน เรือสำเภาจะบรรจุมันไว้ในโหลแก้ว เพื่อชิมลมฟ้าล่วงหน้าสักหนึ่งวันก่อนลมจริง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 43,
    folder: "stormpetal",
    name: "Stormpetal",
    rarity: "common",
    descriptionEN:
      "Each petal is the exact shade the sky took on a moment before lightning struck somewhere important. Pressed to the ear, an old stormpetal still carries a rumble that may or may not be yours.",
    descriptionTH:
      "กลีบแต่ละกลีบคือสีท้องฟ้าในชั่วขณะก่อนที่สายฟ้าจะฟาดลงบนสถานที่สำคัญแห่งใดแห่งหนึ่ง แนบแน่นกับหู กลีบพายุเก่า ๆ ยังส่งเสียงคำรามแผ่ว ๆ ออกมา — เสียงซึ่งอาจเป็นของเจ้าหรือไม่ก็ได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 44,
    folder: "stormmoss",
    name: "Stormmoss",
    rarity: "common",
    descriptionEN:
      "Grows only on wood that has been struck by lightning and survived. Laid under a sleeping dog, it keeps the dog from barking at thunder for the rest of its life.",
    descriptionTH:
      "งอกเฉพาะบนเนื้อไม้ที่ถูกสายฟ้าฟาดแล้วยังไม่ตาย วางไว้ใต้สุนัขที่หลับ มันจะกันสุนัขตัวนั้นไม่ให้เห่าฟ้าร้องอีกเลยตลอดชีวิต",
    collection: SpeciesCollection.Original,
  },
  {
    id: 45,
    folder: "tideleaf",
    name: "Tideleaf",
    rarity: "common",
    descriptionEN:
      "Rolls itself up and unrolls twice a day in time with a distant sea, even if you carry it inland. Sailors' widows keep one in a bowl of water as a tether to somewhere a ship once went.",
    descriptionTH:
      "ม้วนตัวและคลี่ออกวันละสองครั้งตามจังหวะของทะเลซึ่งอยู่ไกลโพ้น แม้จะถูกพาเข้ามาไว้ในแผ่นดินลึกก็ตาม แม่ม่ายของชาวเรือเก็บมันไว้ในชามน้ำ เป็นเชือกเส้นหนึ่งที่ยังผูกโยงไปยังที่ซึ่งเรือลำหนึ่งเคยล่องไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 46,
    folder: "tidefern",
    name: "Tidefern",
    rarity: "common",
    descriptionEN:
      "Its fronds sway even in still air, as if swimming in a current only it can feel. Fishermen swear one tucked in the boat steers the nets toward fish too polite to be caught otherwise.",
    descriptionTH:
      "ใบของมันโอนเอนแม้ในอากาศนิ่งสนิท ราวกับว่ายน้ำอยู่ในกระแสที่มีเพียงมันรู้สึกได้ ชาวประมงสาบานว่าเก็บมันไว้ในเรือสักใบ อวนจะถูกดึงไปหาปลาที่สุภาพเกินกว่าจะถูกจับด้วยวิธีอื่น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 47,
    folder: "tidebloom",
    name: "Tidebloom",
    rarity: "common",
    descriptionEN:
      "Opens at high tide and closes at low, wherever in the world it was seeded. Gardeners far from any sea use them as the most reliable — and saddest — clocks on their shelves.",
    descriptionTH:
      "บานตอนน้ำขึ้นและหุบตอนน้ำลง ไม่ว่าเมล็ดของมันจะถูกหว่านลงที่ใดในโลก ชาวสวนที่อยู่ไกลจากทะเลใช้มันเป็นนาฬิกาที่แม่นยำที่สุด — และเศร้าที่สุด — บนชั้นเก็บของ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 48,
    folder: "tidepetal",
    name: "Tidepetal",
    rarity: "common",
    descriptionEN:
      "Damp to the touch no matter how long it has been picked, faintly salty, and always a little restless. Slipped into a lover's collar at the docks, it promises that they will think of you twice a day.",
    descriptionTH:
      "สัมผัสชื้นเสมอไม่ว่าถูกเด็ดมานานเท่าใด มีรสเค็มจาง ๆ และกระสับกระส่ายอยู่ในที สอดไว้ที่คอเสื้อของคนรักยามส่งเรือ มันให้คำมั่นว่าคนคนนั้นจะนึกถึงเจ้าวันละสองครั้ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 49,
    folder: "tidemoss",
    name: "Tidemoss",
    rarity: "common",
    descriptionEN:
      "Retreats from any stone at exactly the hour the sea pulls back from its farthest rock, even if that rock is a continent away. Watching it move is considered bad luck, and watching it for an hour is considered a confession.",
    descriptionTH:
      "ถอยร่นจากก้อนหินในชั่วโมงเดียวกับที่ทะเลถอยจากหินริมสุดของตน แม้หินก้อนนั้นจะอยู่ข้ามทวีป เฝ้ามองการเคลื่อนของมันถือเป็นลางไม่ดี และเฝ้ามองติดต่อกันหนึ่งชั่วโมงถือเป็นการสารภาพ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 50,
    folder: "emberleaf",
    name: "Emberleaf",
    rarity: "common",
    descriptionEN:
      "Warm to the touch long after the last fire in the house has gone out, as if remembering it on behalf of the hearth. A leaf tucked inside a winter coat is said to make the cold forget your name.",
    descriptionTH:
      "สัมผัสยังอุ่นอยู่นานหลังกองไฟสุดท้ายในบ้านมอดดับ ราวกับจดจำไฟนั้นไว้แทนเตาไฟ ใบที่ซุกไว้ในเสื้อหนาวฤดูหนาวว่ากันว่าทำให้ความเย็นลืมชื่อของเจ้า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 51,
    folder: "emberfern",
    name: "Emberfern",
    rarity: "common",
    descriptionEN:
      "Glows faint orange along its spine when someone nearby is telling a story worth hearing. A dim emberfern in a tavern is considered the politest possible hint to wrap it up.",
    descriptionTH:
      "เรืองสีส้มจาง ๆ ตามแนวกลางใบเมื่อมีคนใกล้ ๆ กำลังเล่าเรื่องที่น่าฟัง เฟิร์นถ่านอันสลัวในโรงเตี๊ยมถือเป็นคำใบ้ที่สุภาพที่สุดว่าถึงเวลาจบเรื่องได้แล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 52,
    folder: "emberbloom",
    name: "Emberbloom",
    rarity: "common",
    descriptionEN:
      "Opens in the shape of a small cupped hand holding a single coal you can almost but not quite feel. Grieving parents used to keep one lit by the doorway on winter nights, in case.",
    descriptionTH:
      "บานเป็นรูปมือเล็ก ๆ ที่โอบถ่านหนึ่งก้อน — ถ่านที่เจ้าเกือบจะสัมผัสได้แต่ไม่ถึง พ่อแม่ที่สูญเสียลูกจะวางดอกนี้ไว้ให้ติดไฟอยู่ที่ประตูในค่ำคืนฤดูหนาว เผื่อเอาไว้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 53,
    folder: "emberpetal",
    name: "Emberpetal",
    rarity: "common",
    descriptionEN:
      "Falls from the flower still warm, and cools only when it lands on something that needs warming. Swept into a beggar's bowl on a cold evening, it stays hot until the bowl is full.",
    descriptionTH:
      "ร่วงจากดอกในสภาพยังอุ่น และจะเย็นลงเมื่อมันตกลงบนสิ่งที่ต้องการความอบอุ่น ปัดตกลงในบาตรของขอทานในค่ำคืนที่หนาว มันจะอุ่นอยู่เช่นนั้นจนกว่าบาตรจะเต็ม",
    collection: SpeciesCollection.Original,
  },
  {
    id: 54,
    folder: "embermoss",
    name: "Embermoss",
    rarity: "common",
    descriptionEN:
      "Grows in the ashes of any fire that warmed more than one person in the same night. Travellers scrape a patch into a tin and carry it as a promise that they will share the next one too.",
    descriptionTH:
      "งอกในกองขี้เถ้าของไฟที่เคยให้ความอบอุ่นแก่คนมากกว่าหนึ่งในคืนเดียวกัน นักเดินทางจะขูดมันใส่กระป๋อง พกติดตัวเป็นสัญญาว่าจะแบ่งไฟกองหน้าด้วย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 55,
    folder: "frostleaf",
    name: "Frostleaf",
    rarity: "common",
    descriptionEN:
      "The veins hold thin rimes of ice all year round, even in summer, and snap with a sound like a tiny bell. Apothecaries grind it into winter-lung tinctures for people who can no longer be cold and cannot admit why.",
    descriptionTH:
      "เส้นใบมีน้ำแข็งบาง ๆ เกาะอยู่ตลอดปี แม้ในฤดูร้อน และหักออกพร้อมเสียงเหมือนกระดิ่งเล็ก ๆ หมอสมุนไพรบดมันเป็นยาสำหรับปอดฤดูหนาว มอบให้ผู้ที่ทนหนาวไม่ได้อีกต่อไป และไม่อาจยอมรับว่าเพราะเหตุใด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 56,
    folder: "frostfern",
    name: "Frostfern",
    rarity: "common",
    descriptionEN:
      "Each frond draws itself along a windowpane the first cold night of the year, sometimes before anyone has planted it. Gardeners do not know whether they cultivate frostfern or are cultivated by it.",
    descriptionTH:
      "ใบทุกใบวาดตัวเองลงบนกระจกหน้าต่างในคืนที่หนาวคืนแรกของปี บางครั้งก่อนที่จะมีใครปลูกมันเสียด้วยซ้ำ ชาวสวนยังไม่แน่ใจว่าเป็นผู้ปลูกเฟิร์นน้ำค้างแข็ง หรือถูกเฟิร์นน้ำค้างแข็งปลูกไว้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 57,
    folder: "frostbloom",
    name: "Frostbloom",
    rarity: "common",
    descriptionEN:
      "Only opens when the air is cold enough to see your own breath, and closes the moment it warms. It is the traditional flower pressed into a promise nobody intends to break — because it will not forgive a warm room.",
    descriptionTH:
      "บานเมื่ออากาศเย็นพอจะเห็นลมหายใจของตนเอง และหุบทันทีที่อุ่นขึ้น เป็นดอกไม้ดั้งเดิมที่ถูกอัดไว้ในคำสัญญาซึ่งไม่มีใครคิดจะผิด — เพราะมันไม่ให้อภัยห้องที่อุ่น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 58,
    folder: "frostpetal",
    name: "Frostpetal",
    rarity: "common",
    descriptionEN:
      "Cold as a swallow of well-water, and it keeps everything near it honest in the way true cold does. Slipped onto a tongue, it silences a lie half-spoken and leaves behind a taste of clean winter air.",
    descriptionTH:
      "เย็นเท่ากับน้ำบาดาลที่ดื่มอึกเดียว และทำให้ทุกสิ่งรอบข้างตรงไปตรงมาในแบบที่ความเย็นแท้ ๆ เท่านั้นทำได้ วางลงบนลิ้น มันจะทำให้คำโกหกที่เอ่ยได้ครึ่งหนึ่งเงียบลง และทิ้งรสของอากาศฤดูหนาวอันบริสุทธิ์ไว้แทน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 59,
    folder: "frostmoss",
    name: "Frostmoss",
    rarity: "common",
    descriptionEN:
      "Feels like stepping on the first morning of winter, even in a cellar in midsummer. Bereaved travelers kneel in a patch of it to remember exactly how cold a specific day had been, and leave warmer than they came.",
    descriptionTH:
      "เหยียบลงแล้วให้ความรู้สึกของเช้าวันแรกของฤดูหนาว แม้จะอยู่ในห้องใต้ดินกลางฤดูร้อน ผู้เดินทางที่กำลังโศกเศร้าจะคุกเข่าบนกอของมันเพื่อระลึกว่าวันเฉพาะวันนั้นในอดีตหนาวเพียงใด และลุกขึ้นในสภาพอบอุ่นกว่าตอนมาถึง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 60,
    folder: "glowleaf",
    name: "Glowleaf",
    rarity: "common",
    descriptionEN:
      "Shines just enough to read by, and just enough to be read by — pages turned over one at midnight seem, in the morning, to have a few new lines. Scholars who keep one nearby sometimes wake up smarter than they went to sleep.",
    descriptionTH:
      "เรืองแสงพอเหลือจะอ่านหนังสือได้ และพอจะถูกหนังสืออ่านเจ้าได้ หน้าที่พลิกกลับยามเที่ยงคืนดูเหมือนจะมีบรรทัดใหม่เพิ่มเข้ามาในเช้าวันถัดไป นักปราชญ์ที่วางมันไว้ใกล้ตัวบางครั้งตื่นขึ้นมาฉลาดกว่าตอนเข้านอน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 61,
    folder: "glowfern",
    name: "Glowfern",
    rarity: "common",
    descriptionEN:
      "Its soft green light brightens when someone speaks kindly in the room. Couples on the edge of a quarrel have been known to buy one and then forget what they were about to say.",
    descriptionTH:
      "แสงสีเขียวนุ่มของมันสว่างขึ้นเมื่อมีคนเอ่ยถ้อยคำอ่อนโยนในห้อง คู่รักที่กำลังจะทะเลาะกันเคยซื้อมันมาเลี้ยง และหลังจากนั้นก็ลืมไปว่ากำลังจะพูดเรื่องอะไรอยู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 62,
    folder: "glowbloom",
    name: "Glowbloom",
    rarity: "common",
    descriptionEN:
      "Opens with a gentle light that rises and falls like slow breathing. Watching it for long enough calms a racing heart and, occasionally, a running nose.",
    descriptionTH:
      "บานพร้อมแสงอ่อน ๆ ที่ขึ้นลงราวกับลมหายใจเชื่องช้า เฝ้ามองมันนานพอจะทำให้หัวใจที่เต้นระส่ำระสายสงบลง และบางครั้งก็ทำให้อาการน้ำมูกไหลสงบลงด้วย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 63,
    folder: "glowpetal",
    name: "Glowpetal",
    rarity: "common",
    descriptionEN:
      "Each petal stores a little of the day's sunlight and gives it back just before you need to blow out your candle. Children pin them to their collars to ward off the dark, and mostly the dark is polite about it.",
    descriptionTH:
      "กลีบแต่ละกลีบเก็บแสงอาทิตย์ของวันไว้นิดหน่อย และคืนให้เราในช่วงก่อนที่จะเป่าเทียนนอน เด็ก ๆ จะติดมันไว้ที่คอเสื้อเพื่อกันความมืด และโดยมากความมืดก็สุภาพกับมันเสียด้วย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 64,
    folder: "glowmoss",
    name: "Glowmoss",
    rarity: "common",
    descriptionEN:
      "Lines the walls of caves that have been kind to lost travelers, and darkens, quietly, in ones that have not. Spelunkers learn to read the light the way sailors read the sky.",
    descriptionTH:
      "ขึ้นเป็นแพตามผนังถ้ำที่เคยมีน้ำใจกับผู้หลงทาง และมืดลงเงียบ ๆ ในถ้ำที่ไม่เคยมี นักสำรวจถ้ำเรียนรู้ที่จะอ่านแสงของมันในแบบที่นักเดินเรืออ่านท้องฟ้า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 65,
    folder: "shadowleaf",
    name: "Shadowleaf",
    rarity: "common",
    descriptionEN:
      "Casts a shadow a little too long for its size, as if remembering a taller self. Laid on a desk at noon, it shows the hour as a sundial from a century you cannot name.",
    descriptionTH:
      "ทอดเงายาวเกินกว่าขนาดของมันเล็กน้อย ราวกับจดจำร่างตัวเองที่เคยสูงกว่านี้ วางบนโต๊ะยามเที่ยง มันจะบอกชั่วโมงดั่งนาฬิกาแดดจากศตวรรษที่เจ้าบอกชื่อไม่ถูก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 66,
    folder: "shadowfern",
    name: "Shadowfern",
    rarity: "common",
    descriptionEN:
      "Its fronds unfurl only in the shade of something already older than the fern. Temples grow them along the feet of their oldest statues, to prove the statues are still keeping watch.",
    descriptionTH:
      "ใบของมันคลี่ตัวได้เฉพาะในเงาของสิ่งที่แก่กว่าตัวเฟิร์นเอง วัดวาอารามจะปลูกมันไว้ใต้ฐานรูปปั้นที่เก่าแก่ที่สุด เพื่อพิสูจน์ว่ารูปปั้นเหล่านั้นยังคงเฝ้าดูอยู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 67,
    folder: "shadowbloom",
    name: "Shadowbloom",
    rarity: "common",
    descriptionEN:
      "Opens away from the light, turning its face into whatever gloom is deepest in the room. Those who sleep beside it stop being afraid of their own corners, which is a cure some would rather not have.",
    descriptionTH:
      "บานหันหน้าหนีจากแสง หันหาความมืดที่ลึกที่สุดในห้อง ผู้ที่หลับข้างมันจะเลิกกลัวมุมของตัวเอง — ซึ่งเป็นการรักษาที่บางคนไม่อยากได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 68,
    folder: "shadowpetal",
    name: "Shadowpetal",
    rarity: "common",
    descriptionEN:
      "Darker than any ink, and it will not make a mark — as if the page it touches is already part of what it remembers. Pressed to a wound it takes the pain away, but also takes the memory of how the wound was earned.",
    descriptionTH:
      "ดำยิ่งกว่าหมึกใด ๆ และเขียนไม่ติดเลย ราวกับว่าหน้ากระดาษที่มันแตะเป็นส่วนหนึ่งของสิ่งที่มันจดจำไว้แล้ว แนบกับบาดแผล มันจะพรากความเจ็บไป — พร้อมกับความทรงจำว่าบาดแผลนั้นเกิดขึ้นได้อย่างไร",
    collection: SpeciesCollection.Original,
  },
  {
    id: 69,
    folder: "shadowmoss",
    name: "Shadowmoss",
    rarity: "common",
    descriptionEN:
      "Grows only in the prints left by things that should not have been walking. If you find a patch of it, count your shadows before stepping away — and keep counting until the number agrees with the light.",
    descriptionTH:
      "งอกขึ้นเฉพาะในรอยเท้าของสิ่งที่ไม่ควรได้เดินไหว หากเจ้าพบกอของมัน จงนับเงาของตนเสียก่อนก้าวจากไป และนับต่อไปจนกว่าจำนวนจะตรงกับแสง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 70,
    folder: "silverleaf",
    name: "Silverleaf",
    rarity: "common",
    descriptionEN:
      "Reflects whoever looks at it a hair older than they are, as a gentle reminder that time is always saving a seat. Rings set with silverleaf essence do not tarnish, but neither does the hand they sit on — at least not visibly.",
    descriptionTH:
      "สะท้อนภาพของผู้ที่มองมัน ให้แก่กว่าตัวจริงอยู่เล็กน้อย เสมือนเตือนอย่างนุ่มนวลว่ากาลเวลายังจองที่นั่งไว้ให้เสมอ แหวนที่ฝังน้ำสกัดใบเงินจะไม่หมองคล้ำ แต่มือที่สวมมันก็เช่นกัน — อย่างน้อยก็ไม่เห็นชัด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 71,
    folder: "silverfern",
    name: "Silverfern",
    rarity: "common",
    descriptionEN:
      "Every frond is threaded with a hair-thin line of pure silver that cannot be extracted without killing the plant. Thieves have tried. The fern keeps the silver; the thieves keep the lesson.",
    descriptionTH:
      "ใบทุกใบมีเส้นเงินบริสุทธิ์เล็กเส้นหนึ่งร้อยอยู่ ซึ่งสกัดออกมาไม่ได้โดยไม่ทำให้ต้นตาย โจรเคยลอง เฟิร์นยังเก็บเงินไว้ โจรก็เก็บบทเรียนไว้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 72,
    folder: "silverbloom",
    name: "Silverbloom",
    rarity: "common",
    descriptionEN:
      "Its petals ring, faintly, like wind-chimes when someone speaks the truth in its presence. In the old courts a silverbloom was kept in a pot behind the judge's chair, and it saved more innocents than any advocate.",
    descriptionTH:
      "กลีบของมันส่งเสียงกังวานแผ่ว ๆ คล้ายกระดิ่งลมเมื่อมีคนพูดความจริงใกล้ ๆ ในศาลยุคเก่า ดอกเงินจะถูกปลูกไว้ในกระถางหลังเก้าอี้ผู้พิพากษา และมันช่วยชีวิตคนบริสุทธิ์ได้มากกว่าทนายคนใด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 73,
    folder: "silverpetal",
    name: "Silverpetal",
    rarity: "common",
    descriptionEN:
      "So bright-white under moonlight that night-hunters have mistaken a field of them for snow, and turned back. Tucked into a belt-pouch, one petal keeps the wearer polite to strangers for a full day.",
    descriptionTH:
      "ขาวเงางามใต้แสงจันทร์จนนักล่ายามค่ำเคยเห็นทุ่งของมันเป็นหิมะและหันหลังกลับ ใส่ไว้ในถุงคาดเอวหนึ่งกลีบ จะทำให้ผู้สวมสุภาพกับคนแปลกหน้าไปตลอดทั้งวัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 74,
    folder: "silvermoss",
    name: "Silvermoss",
    rarity: "common",
    descriptionEN:
      "Carpets stones near wells that have never gone dry, and changes colour — very slightly — on days the water tastes wrong. Villagers learned to trust the moss before they learned to trust each other.",
    descriptionTH:
      "ปูพรมบนหินใกล้บ่อน้ำที่ไม่เคยแห้ง และเปลี่ยนสีเล็กน้อยในวันที่น้ำในบ่อมีรสชาติผิดแปลก ชาวบ้านเรียนรู้ที่จะเชื่อใจมอสก่อนที่จะเรียนรู้ที่จะเชื่อใจกันเอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 75,
    folder: "goldleaf",
    name: "Goldleaf",
    rarity: "common",
    descriptionEN:
      "Heavier than a leaf has any right to be, and warm in the way gold never quite is. Pressed between the pages of a ledger, it inclines the numbers to be a little gentler to whoever is reading them.",
    descriptionTH:
      "หนักกว่าใบไม้ใด ๆ ควรจะเป็น และอุ่นในแบบที่ทองคำไม่เคยอุ่นจริง ๆ อัดไว้ระหว่างหน้าของสมุดบัญชี มันจะทำให้ตัวเลขอ่อนโยนต่อผู้ที่กำลังอ่านมันขึ้นอีกนิดหน่อย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 76,
    folder: "goldfern",
    name: "Goldfern",
    rarity: "common",
    descriptionEN:
      "Its fronds shed flakes so fine that dust-motes in a sunbeam keep mistaking them for relatives. Old accountants bottle the flakes, label them 'hope', and give them as wedding gifts.",
    descriptionTH:
      "ใบของมันผลัดเกล็ดละเอียดจนละอองฝุ่นในลำแสงแดดเข้าใจผิดคิดว่าเป็นญาติอยู่เนือง ๆ นักบัญชีเฒ่าจะเก็บเกล็ดเหล่านั้นใส่ขวดเล็ก ติดป้ายว่า 'ความหวัง' และให้เป็นของขวัญแต่งงาน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 77,
    folder: "goldbloom",
    name: "Goldbloom",
    rarity: "common",
    descriptionEN:
      "Said to be coaxed into flowering only by the songs of people who have never been rich. In the villages it was once considered a reliable way to tell which children were telling the truth about their families.",
    descriptionTH:
      "ว่ากันว่ามันจะยอมออกดอกเฉพาะจากเสียงเพลงของคนที่ไม่เคยร่ำรวย ในหมู่บ้านเก่า ๆ มันเคยเป็นวิธีที่น่าเชื่อถือในการบอกว่าเด็กคนไหนพูดความจริงเกี่ยวกับฐานะของครอบครัว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 78,
    folder: "goldpetal",
    name: "Goldpetal",
    rarity: "common",
    descriptionEN:
      "Falls from the flower already warm, as if it has been resting in someone's hand all week. A single petal in a beggar's bowl will not feed anyone, but the bowl starts attracting people who do.",
    descriptionTH:
      "ร่วงจากดอกในสภาพอุ่น ราวกับว่าเพิ่งนอนอยู่ในฝ่ามือของใครสักคนมาทั้งสัปดาห์ กลีบหนึ่งกลีบในบาตรของขอทานไม่อาจเลี้ยงปากท้องใครได้ แต่บาตรใบนั้นเริ่มดึงดูดคนที่ทำได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 79,
    folder: "goldmoss",
    name: "Goldmoss",
    rarity: "common",
    descriptionEN:
      "Grows in cracks where a coin was dropped and never picked up. Follow a trail of it long enough and you may find a purse, or a lesson, depending on how much you need each.",
    descriptionTH:
      "งอกในรอยแยกที่เคยมีเหรียญร่วงลงไปและไม่มีใครเก็บขึ้นมา เดินตามแนวของมันไปนานพอ เจ้าอาจจะพบถุงเงิน หรือบทเรียน — ขึ้นอยู่กับว่าเจ้าต้องการอะไรมากกว่ากัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 80,
    folder: "crimsonleaf",
    name: "Crimsonleaf",
    rarity: "common",
    descriptionEN:
      "The red of a heart you have not yet given away, and it will not be given away for you. Pressed between two palms it warms both evenly, even if one palm is afraid.",
    descriptionTH:
      "สีแดงของหัวใจที่เจ้ายังไม่ได้มอบให้ใคร และไม่มีใครจะมอบแทนเจ้าได้ อัดไว้ระหว่างฝ่ามือสองข้าง มันจะทำให้ทั้งสองข้างอุ่นเท่ากัน แม้ว่าข้างหนึ่งกำลังกลัวอยู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 81,
    folder: "crimsonfern",
    name: "Crimsonfern",
    rarity: "common",
    descriptionEN:
      "Its fronds curl toward any wound in the room, as if apologising on behalf of the sharp thing that made it. Healers keep one by the door of every sickroom, mostly for the comfort of visitors.",
    descriptionTH:
      "ใบของมันม้วนหันเข้าหาบาดแผลทุกแผลในห้อง ราวกับกำลังขอโทษแทนของมีคมที่ทำให้เกิดแผลขึ้น หมอรักษาจะตั้งมันไว้ที่ประตูห้องคนไข้ทุกห้อง ส่วนใหญ่เพื่อปลอบใจของผู้มาเยี่ยม",
    collection: SpeciesCollection.Original,
  },
  {
    id: 82,
    folder: "crimsonbloom",
    name: "Crimsonbloom",
    rarity: "common",
    descriptionEN:
      "Opens when two people in the same room finally stop lying to each other. It has been the ruin of several marriages and the making of several others.",
    descriptionTH:
      "บานเมื่อคนสองคนในห้องเดียวกันในที่สุดเลิกโกหกกันและกัน มันเคยเป็นจุดแตกหักของคู่สามีภรรยาหลายคู่ และเป็นจุดเริ่มต้นที่งดงามของหลายคู่เช่นกัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 83,
    folder: "crimsonpetal",
    name: "Crimsonpetal",
    rarity: "common",
    descriptionEN:
      "Each petal is the colour a sunset gets when it has been watched by someone in love. A single petal carried in a locket is said to make you recognizable to a stranger you have not yet met.",
    descriptionTH:
      "แต่ละกลีบมีสีเดียวกับอาทิตย์อัสดงในยามที่มีคนซึ่งกำลังรักมองดู กลีบหนึ่งกลีบที่พกไว้ในล็อกเก็ตว่ากันว่าทำให้เจ้ากลายเป็นคนที่คนแปลกหน้าที่ยังไม่ได้พบจะจำได้ทันที",
    collection: SpeciesCollection.Original,
  },
  {
    id: 84,
    folder: "crimsonmoss",
    name: "Crimsonmoss",
    rarity: "common",
    descriptionEN:
      "Grows where a promise was once made with hands clasped. The deeper the red, the longer the promise was kept; no one knows how to read the pale patches, and few wish to.",
    descriptionTH:
      "งอกตรงที่เคยมีคนจับมือกันแล้วให้สัญญา ยิ่งสีเข้ม สัญญานั้นยิ่งถูกรักษาไว้นาน ไม่มีใครรู้จะอ่านรอยสีซีดอย่างไร และน้อยคนอยากจะรู้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 85,
    folder: "violetleaf",
    name: "Violetleaf",
    rarity: "common",
    descriptionEN:
      "Changes hue slightly depending on who is looking at it, settling on the shade of purple their mother loved best. Orphans see it in a colour nobody has ever been able to name.",
    descriptionTH:
      "เปลี่ยนสีเล็กน้อยตามคนที่มอง มาจบที่เฉดม่วงซึ่งแม่ของคนคนนั้นชอบที่สุด เด็กกำพร้าจะเห็นมันในสีที่ไม่มีใครเคยเรียกชื่อได้เลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 86,
    folder: "violetfern",
    name: "Violetfern",
    rarity: "common",
    descriptionEN:
      "Its scent is the one that comes through an open window in a house where someone is just finishing their last book of the night. Scholars keep one for company and then, slowly, for companionship.",
    descriptionTH:
      "กลิ่นของมันคือกลิ่นที่ลอยผ่านหน้าต่างเปิดในบ้านที่มีใครบางคนกำลังอ่านหนังสือเล่มสุดท้ายของค่ำคืนจบ นักอ่านจะเก็บมันไว้เพื่อเป็นเพื่อน และค่อย ๆ กลายเป็นคู่ชีวิต",
    collection: SpeciesCollection.Original,
  },
  {
    id: 87,
    folder: "violetbloom",
    name: "Violetbloom",
    rarity: "common",
    descriptionEN:
      "Opens wide enough that the whole flower tips to one side under the weight of its own colour. Poets say it is the flower language uses when language finds itself without words.",
    descriptionTH:
      "บานกว้างจนทั้งดอกเอียงไปข้างหนึ่งด้วยน้ำหนักของสีตัวเอง กวีกล่าวว่ามันคือดอกไม้ที่ภาษาหยิบยืม ในยามที่ภาษาพบว่าตัวเองไม่มีถ้อยคำเหลืออยู่เลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 88,
    folder: "violetpetal",
    name: "Violetpetal",
    rarity: "common",
    descriptionEN:
      "Bruises easily, and each bruise becomes a slightly darker violet until the whole petal is the colour of a very good evening. Pressed into letters, it helps the reader hear the tone you meant.",
    descriptionTH:
      "ช้ำง่ายมาก และแต่ละรอยช้ำจะกลายเป็นสีม่วงเข้มขึ้นทีละน้อย จนทั้งกลีบเป็นสีของค่ำคืนที่ดีเยี่ยม อัดไว้ในจดหมาย มันช่วยให้ผู้อ่านได้ยินน้ำเสียงที่เจ้าตั้งใจสื่อจริง ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 89,
    folder: "violetmoss",
    name: "Violetmoss",
    rarity: "common",
    descriptionEN:
      "Unlike most moss it prefers to grow on the shelf where a book has sat, unread, for exactly a decade. Picking it up is taken as a promise to read the book, and the moss remembers who has broken that promise.",
    descriptionTH:
      "ต่างจากมอสทั่วไป มันชอบงอกบนชั้นหนังสือตรงที่หนังสือเล่มหนึ่งถูกวางไว้โดยไม่ได้อ่านพอดีหนึ่งทศวรรษ เก็บมันขึ้นถือเป็นสัญญาว่าจะอ่านเล่มนั้น และมอสจดจำได้ว่าใครผิดสัญญา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 90,
    folder: "azureleaf",
    name: "Azureleaf",
    rarity: "common",
    descriptionEN:
      "The exact blue of a sky you once looked up at without any particular reason, on a day that turned out to matter. Held against a window, it makes ordinary weather look a little more forgiving.",
    descriptionTH:
      "เป็นสีฟ้าของท้องฟ้าที่เจ้าเคยเงยมองโดยไม่มีเหตุผลใดเป็นพิเศษ ในวันที่กลายเป็นวันสำคัญในภายหลัง แนบกับหน้าต่าง มันทำให้อากาศธรรมดาดูให้อภัยได้ง่ายขึ้นอีกนิด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 91,
    folder: "azurefern",
    name: "Azurefern",
    rarity: "common",
    descriptionEN:
      "Each frond is the colour of distance itself, and the plant thrives in windowsills and on rooftops. Caged birds placed near it stop trying to sing about the cage.",
    descriptionTH:
      "ใบทุกใบเป็นสีของระยะทาง และต้นของมันเจริญงอกงามบนขอบหน้าต่างและหลังคา นกในกรงที่ถูกวางไว้ใกล้มันจะเลิกร้องเพลงถึงกรง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 92,
    folder: "azurebloom",
    name: "Azurebloom",
    rarity: "common",
    descriptionEN:
      "Opens a shade deeper on days when the sky above it is clouded, as if covering for an absent friend. Children on overcast afternoons have been caught talking to it about serious things.",
    descriptionTH:
      "บานเป็นสีเข้มขึ้นในวันที่ท้องฟ้าเหนือมันมีเมฆปกคลุม ราวกับกำลังทำหน้าที่แทนเพื่อนที่ไม่มา เด็ก ๆ ในบ่ายที่ฟ้าหม่นถูกจับได้ว่ากำลังคุยเรื่องจริงจังกับมัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 93,
    folder: "azurepetal",
    name: "Azurepetal",
    rarity: "common",
    descriptionEN:
      "Weightless on the palm and yet it tugs, gently, toward the nearest horizon. Travellers carry one folded in their pocket the first time they leave home, and unfolded the last time they come back.",
    descriptionTH:
      "เบาหวิวในฝ่ามือ ทว่ามันดึงอย่างแผ่วเบาไปทางเส้นขอบฟ้าที่ใกล้ที่สุด นักเดินทางจะพับเก็บไว้ในกระเป๋าในครั้งแรกที่ออกจากบ้าน และคลี่ออกในครั้งสุดท้ายที่กลับคืน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 94,
    folder: "azuremoss",
    name: "Azuremoss",
    rarity: "common",
    descriptionEN:
      "Grows on any rock that has been sat on by a traveller watching the sky at a long rest. The bluer the patch, the longer they sat; scholars have published entire biographies written from a single stone.",
    descriptionTH:
      "งอกบนก้อนหินที่นักเดินทางเคยนั่งมองท้องฟ้ายาวนานในการพักเหนื่อย ยิ่งสีน้ำเงิน ยิ่งบอกว่าเขานั่งอยู่นาน นักปราชญ์เคยเขียนประวัติทั้งเล่มจากก้อนหินเพียงก้อนเดียว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 95,
    folder: "jadeleaf",
    name: "Jadeleaf",
    rarity: "common",
    descriptionEN:
      "Hard as the stone it is named for, yet flexes like any other leaf in the wind. Temple-keepers use it as a bookmark in their oldest sutras, and claim it has never lost a page.",
    descriptionTH:
      "แข็งเท่าหินที่มันตั้งชื่อตาม ทว่าไหวลู่ไปกับลมเหมือนใบไม้ทั่วไป ผู้ดูแลวัดใช้มันเป็นที่คั่นในพระสูตรเก่าแก่ที่สุด และอ้างว่าตั้งแต่ใช้มันมายังไม่เคยทำหน้าใดหายสักหน้า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 96,
    folder: "jadefern",
    name: "Jadefern",
    rarity: "common",
    descriptionEN:
      "Said to have first grown on the slope above a hermitage where a great teacher was kind to a stray cat. Every fern descended from that slope still leans, faintly, toward cats.",
    descriptionTH:
      "ว่ากันว่าเติบโตครั้งแรกบนเนินเหนือสำนักสันโดษที่อาจารย์ผู้ยิ่งใหญ่เคยเมตตาต่อแมวจร เฟิร์นทุกต้นที่สืบสายมาจากเนินนั้นยังคงเอนลำ — อย่างแผ่วเบา — ไปทางแมว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 97,
    folder: "jadebloom",
    name: "Jadebloom",
    rarity: "common",
    descriptionEN:
      "Opens slowly over the course of a full week, each petal the colour of a different lucky year. Keep one on a windowsill and you will notice small coincidences start arriving in pairs.",
    descriptionTH:
      "บานช้า ๆ ตลอดหนึ่งสัปดาห์เต็ม กลีบแต่ละกลีบเป็นสีของปีนักษัตรที่ต่างกัน วางไว้ขอบหน้าต่าง เจ้าจะสังเกตเห็นเรื่องบังเอิญเล็ก ๆ เริ่มมาเป็นคู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 98,
    folder: "jadepetal",
    name: "Jadepetal",
    rarity: "common",
    descriptionEN:
      "Cool as river-stone and smooth as a grandmother's word of advice. Sewn into the hem of a travelling robe, it steadies the legs on a path that tries to be too steep.",
    descriptionTH:
      "เย็นเท่าก้อนหินในลำธาร และลื่นเรียบเท่าคำสอนของย่า เย็บไว้ที่ชายจีวรผู้จาริก มันช่วยทำให้ขาหนักแน่นบนเส้นทางที่พยายามจะชันเกินไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 99,
    folder: "jademoss",
    name: "Jademoss",
    rarity: "common",
    descriptionEN:
      "Grows in the narrow cracks of any carved inscription that has been read aloud for more than a hundred years. Scholars tracing old memorials find the moss leads them to the lines that mattered most.",
    descriptionTH:
      "งอกในรอยแคบของอักษรจารึกที่ถูกอ่านออกเสียงมานานกว่าหนึ่งร้อยปี นักวิชาการที่ตามอนุสรณ์เก่า ๆ จะพบว่ามอสพาพวกเขาไปหาบรรทัดที่สำคัญที่สุดเสมอ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 100,
    folder: "rubyleaf",
    name: "Rubyleaf",
    rarity: "common",
    descriptionEN:
      "Glows a banked-coal red from the inside, warming the hand in winter and cooling it in summer, as if it knows what the weather has forgotten. Rings set with its sap are said to keep a lover's heart from wandering, though only if the lover already wishes to stay.",
    descriptionTH:
      "เรืองสีแดงถ่านจากภายใน ให้ความอุ่นกับฝ่ามือในฤดูหนาวและทำให้เย็นในฤดูร้อน ราวกับรู้ในสิ่งที่สภาพอากาศหลงลืมไป แหวนที่ฝังยางของมันว่ากันว่ารักษาหัวใจคนรักไม่ให้เตร็ดเตร่ — แต่เฉพาะเมื่อคนผู้นั้นต้องการอยู่อยู่แล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 101,
    folder: "rubyfern",
    name: "Rubyfern",
    rarity: "common",
    descriptionEN:
      "Each frond unfurls with a little sigh that sounds almost like a word. Keepers of quiet libraries use them to fill the space where conversation would have been, and nobody notices the difference.",
    descriptionTH:
      "ใบทุกใบคลี่ตัวพร้อมเสียงถอนหายใจเบา ๆ ที่ฟังเกือบเป็นถ้อยคำ ผู้ดูแลห้องสมุดเงียบสงบใช้มันเติมที่ว่างซึ่งบทสนทนาควรจะอยู่ และไม่มีใครสังเกตเห็นความต่างเลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 102,
    folder: "rubybloom",
    name: "Rubybloom",
    rarity: "common",
    descriptionEN:
      "Opens only for those who have lost something they will not name out loud. The flower does not ask for the name, and that is considered its deepest kindness.",
    descriptionTH:
      "บานให้เฉพาะผู้ที่สูญเสียบางสิ่งซึ่งเจ้าตัวไม่อยากเอ่ยออกมาดัง ๆ ดอกไม้ไม่เคยถามถึงชื่อของสิ่งนั้น และนั่นถือเป็นความเมตตาที่ลึกที่สุดของมัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 103,
    folder: "rubypetal",
    name: "Rubypetal",
    rarity: "common",
    descriptionEN:
      "Warm in the palm and a little sticky with what might be sap or might be something older. Slipped into a shared cup of wine, it makes a toast mean what it says, even when the speakers did not plan for it to.",
    descriptionTH:
      "อุ่นในฝ่ามือและเหนียวเล็กน้อย — จะด้วยยางไม้หรือสิ่งอื่นที่เก่าแก่กว่านั้น เราไม่รู้ หย่อนลงในแก้วเหล้าที่แบ่งกันดื่ม มันทำให้คำอวยพรมีความหมายจริง แม้ผู้เอ่ยจะไม่ตั้งใจให้เป็นเช่นนั้น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 104,
    folder: "rubymoss",
    name: "Rubymoss",
    rarity: "common",
    descriptionEN:
      "Grows only on hearthstones that have heated the same family for three generations. A bride who carries a pinch of it to her new house is said never to feel like a guest in it.",
    descriptionTH:
      "งอกเฉพาะบนแผ่นเตาไฟที่ให้ความอบอุ่นกับครอบครัวเดียวกันมาสามรุ่น เจ้าสาวที่พกมันหยิบมือไปบ้านใหม่ว่ากันว่าจะไม่รู้สึกเป็นแขกในบ้านนั้นเลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 105,
    folder: "amberleaf",
    name: "Amberleaf",
    rarity: "common",
    descriptionEN:
      "Traps a little of every afternoon it has lived through, like insects in fossil amber, and on long winter evenings it gives an afternoon back to whoever holds it. Some of the afternoons are borrowed; no one has ever asked for one back.",
    descriptionTH:
      "เก็บกักบ่ายอันผ่านมาไว้เล็กน้อยทุกบ่าย ดั่งแมลงในอำพันโบราณ และในค่ำคืนฤดูหนาวอันยาวนาน มันจะคืนบ่ายวันหนึ่งให้ผู้ถือ บางบ่ายเป็นของที่ยืมมา แต่ยังไม่มีใครเคยมาทวงคืนเลยสักครั้ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 106,
    folder: "amberfern",
    name: "Amberfern",
    rarity: "common",
    descriptionEN:
      "Preserves sounds inside itself the way amber preserves insects: a fern grown in a schoolhouse still gives off faint recitations thirty years after the school has closed. Teachers who could not afford tombstones chose this fern instead.",
    descriptionTH:
      "กักเก็บเสียงไว้ในตัวเหมือนที่อำพันเก็บแมลง เฟิร์นที่โตในโรงเรียนยังส่งเสียงท่องบทเรียนจาง ๆ ออกมาแม้โรงเรียนจะปิดไปสามสิบปี ครูที่ไม่มีทุนจะซื้อศิลาหน้าหลุมศพเลือกใช้เฟิร์นต้นนี้แทน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 107,
    folder: "amberbloom",
    name: "Amberbloom",
    rarity: "common",
    descriptionEN:
      "Opens a little more each year of its life and never quite closes again, so by its seventh year it is all bloom and no bud. Grandmothers count years by it, and lie only upward.",
    descriptionTH:
      "บานเพิ่มขึ้นทีละนิดในทุกปีที่มันมีชีวิต และไม่เคยหุบกลับเต็มที่ จนถึงปีที่เจ็ดมันทั้งดอกก็บานเต็มไม่มีตูม ย่า ๆ นับปีของตนจากมัน และโกหกได้เพียงทางเดียว — คือให้น้อยกว่าความจริง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 108,
    folder: "amberpetal",
    name: "Amberpetal",
    rarity: "common",
    descriptionEN:
      "Honey-coloured and faintly sticky, as if time itself has been spilled on it. Folded into a handkerchief, it keeps the grief of an old farewell fresh enough to still mean something.",
    descriptionTH:
      "สีน้ำผึ้งและเหนียวเล็กน้อยราวกับเวลาถูกหยดลงบนมัน พับไว้ในผ้าเช็ดหน้า มันช่วยให้ความโศกจากการลาจากเก่า ๆ สดใหม่พอที่จะยังมีความหมายอยู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 109,
    folder: "ambermoss",
    name: "Ambermoss",
    rarity: "common",
    descriptionEN:
      "Grows on old stumps that once held a house that was loved. Scraped into a small tin and kept on a new mantelpiece, it tells the new house how to be a home.",
    descriptionTH:
      "งอกบนตอไม้เก่าของบ้านที่เคยมีคนรัก ขูดใส่กระป๋องเล็กวางไว้บนหิ้งของบ้านใหม่ มันจะสอนบ้านใหม่ให้รู้จักเป็นบ้านจริง ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 110,
    folder: "pearlleaf",
    name: "Pearlleaf",
    rarity: "common",
    descriptionEN:
      "Smooth as water and cool as a promise kept on time. Rinsed in any bowl, it makes the water taste faintly of an ocean the drinker has never visited but somehow misses.",
    descriptionTH:
      "ลื่นเรียบเท่าน้ำและเย็นเท่าสัญญาที่รักษาตรงเวลา ล้างในชามใด ๆ มันจะทำให้น้ำมีรสของมหาสมุทรที่ผู้ดื่มไม่เคยไปเยือนแต่กลับคิดถึง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 111,
    folder: "pearlfern",
    name: "Pearlfern",
    rarity: "common",
    descriptionEN:
      "Grows in quiet bathrooms and loud kitchens alike, always picking the spot where the household does its honest crying. Nobody asks where the pearlfern came from because everyone already knows.",
    descriptionTH:
      "เจริญงอกงามได้ทั้งในห้องน้ำเงียบ ๆ และในครัวที่จอแจ โดยจะเลือกจุดที่คนในบ้านร้องไห้ด้วยความจริงใจเสมอ ไม่มีใครถามว่ามันมาได้อย่างไร เพราะทุกคนรู้อยู่แล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 112,
    folder: "pearlbloom",
    name: "Pearlbloom",
    rarity: "common",
    descriptionEN:
      "Opens into a shape so close to a cupped palm that orphans from the coastal wars sleep with their cheek against it without remembering why. The flower stays open as long as they need it to.",
    descriptionTH:
      "บานเป็นรูปทรงใกล้เคียงมือที่ห่อหงายจนเด็กกำพร้าจากสงครามชายฝั่งจะหลับโดยแนบแก้มกับมันโดยไม่จำว่าทำไม ดอกไม้จะเปิดอยู่เช่นนั้นนานเท่าที่พวกเขาต้องการ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 113,
    folder: "pearlpetal",
    name: "Pearlpetal",
    rarity: "common",
    descriptionEN:
      "Each petal is the colour of an apology you have not yet worked up the courage to give. Slipped beneath someone's pillow, it delivers the apology for you, imperfectly but honestly.",
    descriptionTH:
      "แต่ละกลีบเป็นสีของคำขอโทษที่เจ้ายังไม่กล้าพอจะเอ่ย ซุกไว้ใต้หมอนของใครสักคน มันจะส่งคำขอโทษนั้นให้แทนเจ้า — ไม่สมบูรณ์ แต่ซื่อสัตย์",
    collection: SpeciesCollection.Original,
  },
  {
    id: 114,
    folder: "pearlmoss",
    name: "Pearlmoss",
    rarity: "common",
    descriptionEN:
      "Grows on stones at the waterline of any river that has ever drowned and forgiven someone. Rub it between your fingers and you will smell exactly the right amount of regret.",
    descriptionTH:
      "งอกบนหินที่ริมน้ำของแม่น้ำที่เคยจมและเคยให้อภัยใครบางคน ถูมันเบา ๆ ระหว่างนิ้วมือ เจ้าจะได้กลิ่นของความเสียดายในปริมาณที่พอดีเป๊ะ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 115,
    folder: "obsidianleaf",
    name: "Obsidianleaf",
    rarity: "common",
    descriptionEN:
      "Black as a closed door, and colder than a closed door ought to be. Witches used to lay one across the threshold of a cursed room to see whether the curse was still home.",
    descriptionTH:
      "ดำดั่งประตูที่ถูกปิด และเย็นกว่าที่ประตูปิดควรเย็น แม่มดสมัยก่อนจะวางมันไว้ขวางธรณีประตูของห้องต้องสาป เพื่อดูว่าคำสาปยังอยู่บ้านหรือไม่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 116,
    folder: "obsidianfern",
    name: "Obsidianfern",
    rarity: "common",
    descriptionEN:
      "Its fronds shine like polished glass and cut just as cleanly if handled without respect. Hermits on mountain paths grow them as a silent test of whether a visitor is the grasping sort.",
    descriptionTH:
      "ใบของมันเงาดั่งแก้วขัดมัน และบาดคมพอ ๆ กันหากจับโดยไร้ความเคารพ ฤๅษีบนเส้นทางภูเขาปลูกมันไว้เป็นการทดสอบเงียบ ๆ ว่าผู้มาเยือนเป็นคนชนิดที่ชอบคว้าหรือไม่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 117,
    folder: "obsidianbloom",
    name: "Obsidianbloom",
    rarity: "common",
    descriptionEN:
      "Opens into a flower so dark that looking directly into it is like leaning over a deep well. People who make a wish into the bloom are answered, but not in the language they spoke.",
    descriptionTH:
      "บานเป็นดอกที่ดำลึกจนมองตรงเข้าไปในกลีบเหมือนโน้มตัวเหนือบ่อลึก ผู้ที่อธิษฐานลงในดอกนั้นจะได้รับคำตอบ — แต่ไม่ใช่ในภาษาที่พวกเขาเอ่ยออกไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 118,
    folder: "obsidianpetal",
    name: "Obsidianpetal",
    rarity: "common",
    descriptionEN:
      "A petal so glossy it reflects the room the moment before you entered, not the moment you are in. Detectives used to be issued one as standard equipment, until the stories got out.",
    descriptionTH:
      "กลีบเงาวาวจนสะท้อนห้องในชั่วขณะก่อนที่เจ้าจะเดินเข้ามา ไม่ใช่ชั่วขณะที่เจ้ากำลังยืนอยู่ สมัยก่อนนักสืบจะได้รับมันเป็นอุปกรณ์มาตรฐาน จนกระทั่งเรื่องเล่าเริ่มแพร่ออกไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 119,
    folder: "obsidianmoss",
    name: "Obsidianmoss",
    rarity: "common",
    descriptionEN:
      "Grows on the rocks of any place where something very old fell very hard. Scrape a little into an hourglass and the sand stops running until someone speaks a true sentence aloud.",
    descriptionTH:
      "งอกบนก้อนหินของสถานที่ซึ่งบางสิ่งที่เก่าแก่มากเคยร่วงลงอย่างรุนแรง ขูดใส่นาฬิกาทรายนิดหน่อย ทรายจะหยุดไหลจนกว่าจะมีใครเอ่ยประโยคจริงออกมาสักประโยค",
    collection: SpeciesCollection.Original,
  },
  {
    id: 120,
    folder: "copperleaf",
    name: "Copperleaf",
    rarity: "common",
    descriptionEN:
      "Turns green at its edges the way old rooftops do, and the greener the rim, the longer it has been loved in one place. Blacksmiths hand one to apprentices on their first day and take it back on their last.",
    descriptionTH:
      "ขอบใบเขียวคล้ำดั่งหลังคาเก่า ยิ่งขอบเขียว ยิ่งบอกว่ามันถูกรักในที่เดียวกันมานาน ช่างตีเหล็กจะส่งให้ลูกศิษย์ในวันแรก และรับคืนในวันสุดท้ายของการฝึก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 121,
    folder: "copperfern",
    name: "Copperfern",
    rarity: "common",
    descriptionEN:
      "Its fronds give off a faint metallic hum when anyone is being particularly patient in the room. Mothers of toddlers buy one as self-defense, or at least as comfort.",
    descriptionTH:
      "ใบของมันส่งเสียงฮัมโลหะแผ่ว ๆ เมื่อมีคนในห้องกำลังอดทนอย่างยิ่งยวด แม่ที่มีลูกเล็กซื้อมันมาเลี้ยงเพื่อเป็นเครื่องมือป้องกันตัว หรืออย่างน้อยก็เป็นเครื่องปลอบใจ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 122,
    folder: "copperbloom",
    name: "Copperbloom",
    rarity: "common",
    descriptionEN:
      "Opens once, makes a sound like a small coin dropped on a wooden floor, and stays open for exactly the life of a promise. Goldsmiths use them in their workshops as the most honest hourglass ever made.",
    descriptionTH:
      "บานเพียงครั้งเดียว ส่งเสียงคล้ายเหรียญเล็ก ๆ หล่นบนพื้นไม้ และเปิดอยู่นานเท่าอายุของสัญญาสักข้อ ช่างทองใช้มันในห้องทำงานเป็นนาฬิกาทรายที่ซื่อตรงที่สุดที่เคยมีมา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 123,
    folder: "copperpetal",
    name: "Copperpetal",
    rarity: "common",
    descriptionEN:
      "Heavy as a well-used coin and just as warm, because both have been held a great deal. Dropped into a lost-and-found, it chooses the owner who has missed the thing longest.",
    descriptionTH:
      "หนักเท่าเหรียญที่ใช้จนชิน และอุ่นเท่ากัน เพราะทั้งคู่ล้วนถูกถือมามาก หย่อนลงในกล่องของหาย มันจะเลือกเจ้าของคนที่คิดถึงของสิ่งนั้นนานที่สุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 124,
    folder: "coppermoss",
    name: "Coppermoss",
    rarity: "common",
    descriptionEN:
      "Grows on any roof that has survived a storm without losing a single shingle. Roofers keep a jar of it in their toolbelt and sprinkle a pinch onto any new beam they raise.",
    descriptionTH:
      "งอกบนหลังคาใดก็ตามที่ผ่านพายุได้โดยไม่สูญเสียกระเบื้องสักแผ่น ช่างมุงหลังคาเก็บไว้ในขวดที่เข็มขัดเครื่องมือ และโปรยหยิบมือหนึ่งลงบนคานใหม่ทุกอันที่ยกขึ้น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 125,
    folder: "crystalleaf",
    name: "Crystalleaf",
    rarity: "common",
    descriptionEN:
      "Transparent as a windowpane, and anything seen through it looks a little more the way it really is. Judges used to consult one in private before sentencing, and nobody made rules against it because nobody wanted them to stop.",
    descriptionTH:
      "ใสดั่งบานกระจก และสิ่งใดก็ตามที่ถูกมองผ่านมัน จะดูใกล้เคียงกับความจริงของมันมากขึ้นอีกนิด สมัยก่อนผู้พิพากษาจะส่องดูเงียบ ๆ ก่อนตัดสิน และไม่มีใครออกกฎห้าม เพราะไม่มีใครอยากให้พวกเขาเลิก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 126,
    folder: "crystalfern",
    name: "Crystalfern",
    rarity: "common",
    descriptionEN:
      "Rings softly when struck, each frond a different note, so a mature plant is its own small orchestra of tuning forks. Composers keep one beside them during the last stage of writing a song.",
    descriptionTH:
      "ส่งเสียงกังวานเบา ๆ เมื่อถูกเคาะ ใบแต่ละใบเป็นโน้ตคนละเสียง ต้นที่โตเต็มที่จึงเป็นวงดนตรีเล็ก ๆ ของส้อมเสียงในตัวเอง นักประพันธ์เพลงวางมันไว้ข้างตัวในช่วงสุดท้ายของการแต่งเพลงแต่ละเพลง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 127,
    folder: "crystalbloom",
    name: "Crystalbloom",
    rarity: "common",
    descriptionEN:
      "Refracts light into colours that do not quite match any known spectrum, and mathematicians love it for that reason alone. Stare too long and a sentence you have been searching for all week arrives fully formed.",
    descriptionTH:
      "หักเหแสงให้เป็นสีที่ไม่ตรงกับสเปกตรัมที่รู้จักเลย และนักคณิตศาสตร์รักมันด้วยเหตุผลเพียงข้อเดียวนั้น จ้องนานเกินไป ประโยคที่เจ้าค้นหามาทั้งสัปดาห์จะมาถึงอย่างครบถ้วน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 128,
    folder: "crystalpetal",
    name: "Crystalpetal",
    rarity: "common",
    descriptionEN:
      "Rings when held to the ear, and the note is the pitch of the listener's true first name, even if they have been using another. Parents have found their children again by crystalpetal alone.",
    descriptionTH:
      "ดังกังวานเมื่อแนบกับหู และเสียงนั้นคือระดับเสียงของชื่อจริงแรกของผู้ฟัง แม้ว่าคนคนนั้นจะใช้ชื่ออื่นอยู่ พ่อแม่เคยตามหาลูกของตนจนเจออีกครั้งด้วยกลีบคริสตัลเพียงกลีบเดียว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 129,
    folder: "crystalmoss",
    name: "Crystalmoss",
    rarity: "common",
    descriptionEN:
      "Covers stones in small clear beads that catch the first light of any morning and the last of any evening equally. Travelling scribes press a patch into their journals as a guard against lies.",
    descriptionTH:
      "ปกคลุมก้อนหินด้วยเม็ดใสเล็ก ๆ ที่กักแสงเช้าแรกของเช้าวันใด ๆ และแสงสุดท้ายของค่ำวันใด ๆ ได้เท่ากัน นักบันทึกพเนจรอัดมันไว้ในสมุดจดของตนเป็นเครื่องป้องกันคำโกหก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 130,
    folder: "velvetleaf",
    name: "Velvetleaf",
    rarity: "common",
    descriptionEN:
      "Soft on one side and softer on the other, as if the plant could not decide which side deserved the kindness. Stroked absentmindedly during an argument, it can turn the temperature of a conversation down by several degrees.",
    descriptionTH:
      "นุ่มด้านหนึ่งและนุ่มกว่าอีกด้านหนึ่ง ราวกับต้นไม้ตัดสินใจไม่ได้ว่าด้านใดสมควรได้รับความอ่อนโยน ลูบเล่นโดยไม่ตั้งใจระหว่างการเถียง มันสามารถลดอุณหภูมิของบทสนทนาลงได้หลายระดับ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 131,
    folder: "velvetfern",
    name: "Velvetfern",
    rarity: "common",
    descriptionEN:
      "Its fronds are fuzzed with the same short hairs as a cat's ear, and cats treat the fern as a distant cousin they still owe respect. Households with both animals and ferns are, statistically, quieter.",
    descriptionTH:
      "ใบของมันมีขนเล็กสั้นเหมือนขนหูแมว และแมวปฏิบัติกับเฟิร์นต้นนี้ราวกับเป็นญาติห่าง ๆ ที่ยังต้องให้ความเคารพ บ้านที่มีทั้งแมวและเฟิร์น ในทางสถิติแล้วเงียบกว่าบ้านทั่วไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 132,
    folder: "velvetbloom",
    name: "Velvetbloom",
    rarity: "common",
    descriptionEN:
      "Opens into a flower that presses itself, gently, against any hand laid alongside it. Bed-ridden elders keep one on the blanket and claim it has the manners of an excellent nurse.",
    descriptionTH:
      "บานเป็นดอกที่ค่อย ๆ เอนเข้าหาฝ่ามือใด ๆ ที่วางเคียง คนชราที่ติดเตียงจะวางไว้บนผ้าห่มและอ้างว่ามันมีมารยาทเหมือนพยาบาลที่เก่งที่สุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 133,
    folder: "velvetpetal",
    name: "Velvetpetal",
    rarity: "common",
    descriptionEN:
      "Touch it once and your fingertips remember the softness for a lifetime; touch it twice and they forget every other texture. Old weavers kept a single petal in their loom-boxes, trusting it to teach the thread what tenderness felt like.",
    descriptionTH:
      "แตะเพียงครั้งเดียว ปลายนิ้วจะจดจำสัมผัสอ่อนนุ่มไปชั่วชีวิต แตะครั้งที่สอง ปลายนิ้วนั้นจะลืมทุกสัมผัสอื่น ช่างทอโบราณเก็บกลีบไว้เพียงกลีบเดียวในกล่องหูก ให้มันสอนเส้นด้ายให้รู้จักความอ่อนโยน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 134,
    folder: "velvetmoss",
    name: "Velvetmoss",
    rarity: "common",
    descriptionEN:
      "Feels like an apology that is finally being accepted. Laid under the knees at a long vigil, it keeps the body from paying what the heart is already spending.",
    descriptionTH:
      "สัมผัสของมันคือความรู้สึกของคำขอโทษที่ในที่สุดก็ถูกยอมรับ ปูรองใต้หัวเข่าในการเฝ้ายามยาวนาน มันกันร่างกายไม่ให้จ่ายสิ่งที่หัวใจกำลังจ่ายอยู่แล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 135,
    folder: "silkleaf",
    name: "Silkleaf",
    rarity: "common",
    descriptionEN:
      "Slides through the fingers like water and never tangles, no matter how carelessly it is grown. Weavers keep one pinned above their loom as a reminder that smoothness is a habit, not an accident.",
    descriptionTH:
      "ลื่นผ่านนิ้วมือเหมือนสายน้ำและไม่เคยพันกัน ไม่ว่าจะถูกปลูกอย่างสะเพร่าเพียงใด ช่างทอหูกจะตรึงมันไว้เหนือกี่เป็นเครื่องเตือนว่าความเรียบลื่นเป็นนิสัย ไม่ใช่อุบัติเหตุ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 136,
    folder: "silkfern",
    name: "Silkfern",
    rarity: "common",
    descriptionEN:
      "Its fronds unfurl in perfect spirals so smooth that dyers keep a frond as a calibration piece. No silkfern has ever been observed to be measurably irregular, and the fact troubles a few honest botanists.",
    descriptionTH:
      "ใบของมันคลี่ตัวเป็นเกลียวสมบูรณ์แบบจนช่างย้อมใช้มันเป็นชิ้นมาตรฐานสำหรับปรับเทียบสี ยังไม่เคยมีเฟิร์นไหมต้นใดถูกบันทึกว่ามีรูปทรงผิดปกติได้อย่างวัดได้ — ความจริงข้อนี้กวนใจนักพฤกษศาสตร์ซื่อ ๆ อยู่ไม่น้อย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 137,
    folder: "silkbloom",
    name: "Silkbloom",
    rarity: "common",
    descriptionEN:
      "Opens so quietly that most people are already looking at it by the time they realise they have turned their head. Patient lovers bring one to a first meeting instead of a speech.",
    descriptionTH:
      "บานอย่างเงียบเชียบจนคนส่วนใหญ่จะกำลังมองมันอยู่ก่อนที่จะรู้ตัวว่าตนหันหน้าไปหาแล้ว คนรักที่อดทนจะหยิบมันไปในวันที่พบกันครั้งแรกแทนที่จะเตรียมคำพูด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 138,
    folder: "silkpetal",
    name: "Silkpetal",
    rarity: "common",
    descriptionEN:
      "Cool on the lips and gone before you taste it, like a secret shared too briefly. Old lovers keep one between the pages of their first shared book, and it keeps that book from ever opening in a stranger's hands.",
    descriptionTH:
      "เย็นแนบริมฝีปากและหายไปก่อนจะลิ้มรส เหมือนความลับที่ถูกแบ่งปันเพียงชั่วครู่ คู่รักเก่าเก็บไว้ระหว่างหน้าของหนังสือเล่มแรกที่ได้อ่านด้วยกัน และมันกันหนังสือเล่มนั้นไม่ให้เปิดในมือของคนแปลกหน้าเลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 139,
    folder: "silkmoss",
    name: "Silkmoss",
    rarity: "common",
    descriptionEN:
      "Grows on the last board of any bed that has held a long, happy marriage, and nowhere else. Carpenters who recognise it decline to break the bed for firewood, no matter how cold the winter.",
    descriptionTH:
      "งอกเฉพาะบนแผ่นกระดานสุดท้ายของเตียงที่เคยรองรับการครองรักอันยาวนานและเป็นสุข และไม่มีที่อื่น ช่างไม้ที่รู้จักมันจะปฏิเสธที่จะทุบเตียงนั้นเป็นฟืน ไม่ว่าฤดูหนาวจะหนาวเพียงใด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 140,
    folder: "flameleaf",
    name: "Flameleaf",
    rarity: "common",
    descriptionEN:
      "Looks like a leaf mid-burn, but it is cool to the touch and the colour never stops moving. Placed in an empty hearth it gives the room the courage a fire would have, on nights when there is no fuel.",
    descriptionTH:
      "ดูเหมือนใบไม้ที่กำลังถูกเผาไหม้ แต่สัมผัสกลับเย็น และสีของมันไม่เคยหยุดเคลื่อน วางในเตาผิงที่ไม่มีฟืน มันจะให้ห้องมีความกล้าเท่ากับไฟ ในคืนที่ไม่มีเชื้อจุดอยู่เลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 141,
    folder: "flamefern",
    name: "Flamefern",
    rarity: "common",
    descriptionEN:
      "Each frond flickers like a small living candle that never goes out, and never catches anything else on fire. Weary travellers dry their clothes at one, and always feel warmer than the fern has any right to make them.",
    descriptionTH:
      "ใบทุกใบระริกระรัวดั่งเทียนเล็กที่มีชีวิต ไม่เคยดับ และไม่เคยเผาสิ่งใดรอบตัว นักเดินทางที่เหนื่อยล้าตากเสื้อผ้าข้างมัน และรู้สึกอุ่นกว่าที่เฟิร์นต้นนี้มีเหตุผลจะทำให้เขาอุ่นได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 142,
    folder: "flamebloom",
    name: "Flamebloom",
    rarity: "common",
    descriptionEN:
      "Opens as if exhaled from a dragon in a good mood. Villagers whose lanterns have gone out set one on the doorstep of a stranger's house, and the stranger is understood to owe them a welcome some day.",
    descriptionTH:
      "บานราวกับมังกรอารมณ์ดีพ่นออกมา ชาวบ้านที่โคมของตนดับจะวางมันไว้ที่หน้าประตูบ้านของคนแปลกหน้า และเป็นที่เข้าใจกันว่าคนแปลกหน้าคนนั้นจะต้องต้อนรับเขาสักวันหนึ่ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 143,
    folder: "flamepetal",
    name: "Flamepetal",
    rarity: "common",
    descriptionEN:
      "Warm the way a hand in yours is warm, not the way a fire is. Held in a closed fist until it cools, it leaves behind a word that was about to be said and almost wasn't.",
    descriptionTH:
      "อุ่นในแบบที่มือของใครสักคนในมือเจ้าอุ่น ไม่ใช่ในแบบที่ไฟอุ่น กำไว้ในกำปั้นจนกว่ามันจะเย็นลง มันจะทิ้งถ้อยคำที่กำลังจะถูกเอ่ย — และเกือบไม่ถูกเอ่ย — ไว้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 144,
    folder: "flamemoss",
    name: "Flamemoss",
    rarity: "common",
    descriptionEN:
      "Glows dim in any room where a long, quiet anger has been set down at last. The glow fades as the anger cools, and no one has ever wished it back.",
    descriptionTH:
      "เรืองแสงริบหรี่ในห้องใดก็ตามที่ความโกรธอันยาวนานและเงียบงันถูกวางลงในที่สุด แสงจะค่อย ๆ จางลงขณะที่ความโกรธเย็นลง และยังไม่เคยมีใครปรารถนาให้มันกลับคืนมา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 145,
    folder: "iceleaf",
    name: "Iceleaf",
    rarity: "common",
    descriptionEN:
      "Stays frozen no matter the weather, as if winter refused to let this one leaf go. Laid on a feverish forehead it draws the heat out slowly and politely, with many small apologies.",
    descriptionTH:
      "คงเย็นเยือกไม่ว่าสภาพอากาศจะเป็นอย่างไร ราวกับฤดูหนาวปฏิเสธที่จะปล่อยใบนี้ใบเดียวไป วางลงบนหน้าผากของผู้เป็นไข้ มันจะดูดความร้อนออกอย่างช้า ๆ และสุภาพ พร้อมคำขอโทษเล็ก ๆ หลายคำ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 146,
    folder: "icefern",
    name: "Icefern",
    rarity: "common",
    descriptionEN:
      "Its fronds form the exact pattern frost draws on windows, only warmer by touch — not much, but the difference is kind. Herbalists grind it into a powder that keeps grief from becoming bitterness.",
    descriptionTH:
      "ใบของมันเป็นลวดลายเดียวกับน้ำค้างแข็งที่วาดบนกระจก เพียงแต่อุ่นกว่านิดหน่อยเมื่อสัมผัส — ไม่มาก แต่ความต่างนั้นแสนใจดี หมอสมุนไพรบดมันเป็นผง ซึ่งกันไม่ให้ความเศร้ากลายเป็นความขมขื่น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 147,
    folder: "icebloom",
    name: "Icebloom",
    rarity: "common",
    descriptionEN:
      "Opens like a held breath finally exhaled into winter air. Its petals last through any number of thaws and refuse to melt, which has made several philosophers reconsider what ice is for.",
    descriptionTH:
      "บานดั่งลมหายใจที่กลั้นไว้ถูกปล่อยออกในอากาศฤดูหนาวในที่สุด กลีบของมันทนผ่านการละลายได้ทุกครั้งและไม่ยอมละลายตาม ซึ่งทำให้นักปรัชญาหลายคนกลับมาคิดใหม่ว่าน้ำแข็งมีไว้เพื่ออะไร",
    collection: SpeciesCollection.Original,
  },
  {
    id: 148,
    folder: "icepetal",
    name: "Icepetal",
    rarity: "common",
    descriptionEN:
      "Cold enough to sting, briefly, and then the sting turns into a kind of clarity. Judges used to hold one in the mouth before passing a difficult sentence.",
    descriptionTH:
      "เย็นพอจะแสบชั่วขณะ แล้วความแสบนั้นกลายเป็นความกระจ่าง ผู้พิพากษาสมัยก่อนจะอมมันไว้ในปากก่อนตัดสินคดีที่ยากลำบาก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 149,
    folder: "icemoss",
    name: "Icemoss",
    rarity: "common",
    descriptionEN:
      "Grows on the north face of stones that have been used as graves, even when the stones have forgotten they were graves. Mourners who kneel in it are remembered by whatever it is the stone used to remember.",
    descriptionTH:
      "งอกด้านเหนือของหินที่เคยถูกใช้เป็นหลุมศพ แม้หินนั้นจะหลงลืมไปแล้วว่าเคยเป็นอะไร ผู้ไว้อาลัยที่คุกเข่าในกอของมันจะถูกจดจำโดยสิ่งใดก็ตามที่หินเคยจดจำไว้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 150,
    folder: "ashleaf",
    name: "Ashleaf",
    rarity: "common",
    descriptionEN:
      "Pale grey as old paper and dusted with something that looks like the memory of smoke. Pressed into a letter, it makes sure the letter survives any house fire long enough to be read.",
    descriptionTH:
      "สีเทาซีดดั่งกระดาษเก่า และมีฝุ่นบาง ๆ ที่ดูเหมือนความทรงจำของควัน อัดลงในจดหมาย มันทำให้จดหมายรอดจากไฟไหม้บ้านได้นานพอจะถูกอ่าน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 151,
    folder: "ashfern",
    name: "Ashfern",
    rarity: "common",
    descriptionEN:
      "Its fronds crumble at the edges, but the crumbs always find their way back. Mourners keep one in the house for exactly a year, then plant it at a crossroads and let it choose.",
    descriptionTH:
      "ขอบใบร่วนหลุดง่าย แต่เศษของมันมักหาทางกลับมาเสมอ ผู้ไว้อาลัยจะเก็บไว้ในบ้านนานหนึ่งปีพอดี แล้วจึงนำไปปลูกที่สี่แยก ปล่อยให้มันเลือกทางของตนเอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 152,
    folder: "ashbloom",
    name: "Ashbloom",
    rarity: "common",
    descriptionEN:
      "Opens once, pale as bone, and releases a single fine dust that settles only on people who have forgiven someone recently. The dust leaves no stain, but the forgiveness is said to stay a little longer.",
    descriptionTH:
      "บานเพียงครั้งเดียวสีขาวซีดดั่งกระดูก และปล่อยละอองฝุ่นละเอียดออกมาหนึ่งครั้ง ซึ่งจะเกาะเฉพาะผู้ที่เพิ่งให้อภัยใครบางคนไป ฝุ่นไม่ทิ้งรอยเปื้อน แต่การให้อภัยนั้นว่ากันว่าอยู่นานกว่าเดิมเล็กน้อย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 153,
    folder: "ashpetal",
    name: "Ashpetal",
    rarity: "common",
    descriptionEN:
      "Light as the flake that rises from a dying fire and just as reluctant to land. Caught between the lips and let go on the next breath, it whispers one thing you needed to say to someone who is gone.",
    descriptionTH:
      "เบาเท่าเถ้าที่ลอยขึ้นจากกองไฟมอดดับ และไม่อยากลงพื้นพอ ๆ กัน อมไว้ระหว่างริมฝีปากและปล่อยออกไปในลมหายใจครั้งถัดไป มันจะกระซิบสิ่งหนึ่งที่เจ้าต้องการบอกคนซึ่งจากไปแล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 154,
    folder: "ashmoss",
    name: "Ashmoss",
    rarity: "common",
    descriptionEN:
      "Colonises old fire-pits after exactly seven winters, never sooner. Foresters use it to tell which campfires were lit by strangers and which by family.",
    descriptionTH:
      "เข้ายึดพื้นที่เตาไฟเก่าหลังผ่านฤดูหนาวไปเจ็ดปีเต็ม ไม่เคยก่อน คนในป่าใช้มันบอกว่ากองไฟกองไหนถูกก่อโดยคนแปลกหน้า และกองไหนโดยครอบครัว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 155,
    folder: "cloudleaf",
    name: "Cloudleaf",
    rarity: "common",
    descriptionEN:
      "White, puffed, and a little slow to respond when pushed, like a polite cloud that has learned manners. Children blow on it and pretend the wind that follows is their own.",
    descriptionTH:
      "ขาว ฟู และตอบสนองช้านิด ๆ เมื่อถูกผลัก ดั่งเมฆที่ได้เรียนมารยาทเมืองหลวงมาแล้ว เด็ก ๆ จะเป่ามัน และทำเป็นว่าลมที่ตามมาเป็นของตัว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 156,
    folder: "cloudfern",
    name: "Cloudfern",
    rarity: "common",
    descriptionEN:
      "Drifts a finger's width above the soil it pretends to grow in, and gardeners tolerate this out of fondness. On clear days it settles down and pretends it never floated.",
    descriptionTH:
      "ลอยเหนือดินที่มันทำทีว่างอกอยู่ห่างราวหนึ่งนิ้วมือ และชาวสวนยอมรับพฤติกรรมนี้ด้วยความรัก ในวันที่ฟ้าใสมันจะลงไปนั่งกับดินและทำเป็นไม่เคยลอยมาก่อน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 157,
    folder: "cloudbloom",
    name: "Cloudbloom",
    rarity: "common",
    descriptionEN:
      "Opens in shapes that recall the things children see in the sky, and the grown-ups around them are briefly reminded how to see such things too. One flower can unmake a whole afternoon's bad mood.",
    descriptionTH:
      "บานเป็นรูปทรงที่ชวนให้นึกถึงสิ่งที่เด็กมองเห็นในท้องฟ้า และผู้ใหญ่รอบ ๆ จะถูกเตือนใจชั่วครู่ว่าเคยมองเห็นแบบเดียวกันได้อย่างไร ดอกเดียวสามารถคลี่คลายอารมณ์เสียของบ่ายทั้งบ่ายได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 158,
    folder: "cloudpetal",
    name: "Cloudpetal",
    rarity: "common",
    descriptionEN:
      "Weighs exactly as much as you feel like it should, a feat nobody has managed to measure honestly. Folded into a pocket on a heavy day, it lightens the walk by about one step in every fifty.",
    descriptionTH:
      "หนักเท่าที่เจ้ารู้สึกว่ามันควรหนัก ซึ่งยังไม่มีใครวัดออกมาได้อย่างซื่อสัตย์ พับเก็บในกระเป๋าในวันหนัก ๆ มันทำให้ก้าวเดินเบาลงประมาณหนึ่งก้าวในทุกห้าสิบก้าว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 159,
    folder: "cloudmoss",
    name: "Cloudmoss",
    rarity: "common",
    descriptionEN:
      "Cushions stones high on mountain passes and takes the edge off of long falls when the wind is kind. Climbers say the patches that look fluffiest are the ones that have saved the most people.",
    descriptionTH:
      "รองก้อนหินบนช่องเขาสูงให้นุ่มลง และช่วยลดแรงกระแทกของการตกยาวเมื่อโชคดีมีลมหนุน นักปีนเขาเล่ากันว่ากอที่ดูฟูที่สุด คือกอที่เคยช่วยชีวิตคนไว้มากที่สุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 160,
    folder: "rainleaf",
    name: "Rainleaf",
    rarity: "common",
    descriptionEN:
      "Stays faintly damp even in drought years, as if it remembers a storm none of the other plants in the garden can. Pressed into a letter sent during a dry summer, it makes the ink run exactly as much as the writer wanted to weep.",
    descriptionTH:
      "คงชื้นจาง ๆ แม้ในปีที่แห้งแล้ง ราวกับจดจำพายุซึ่งต้นไม้อื่นในสวนจำไม่ได้ อัดลงในจดหมายที่ส่งไปในฤดูร้อนที่แห้ง มันทำให้หมึกเลอะเท่ากับที่ผู้เขียนอยากจะร้องไห้พอดี",
    collection: SpeciesCollection.Original,
  },
  {
    id: 161,
    folder: "rainfern",
    name: "Rainfern",
    rarity: "common",
    descriptionEN:
      "Its fronds tick quietly, like drops on a tin roof, even when the sky is dry. Travellers who cannot sleep without rain keep one near the bed and swear by it more than by any lullaby.",
    descriptionTH:
      "ใบของมันเคาะเสียงเบา ๆ เหมือนหยดน้ำบนหลังคาสังกะสี แม้ฟ้าจะแห้ง นักเดินทางที่นอนไม่หลับหากไม่มีเสียงฝนจะวางมันไว้ใกล้เตียง และเชื่อในมันยิ่งกว่าเพลงกล่อมใด ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 162,
    folder: "rainbloom",
    name: "Rainbloom",
    rarity: "common",
    descriptionEN:
      "Opens only in real rain, never in watering-cans — it can tell. Farmers watch a rainbloom in the window the way captains watch a barometer, and are wrong together.",
    descriptionTH:
      "บานเฉพาะในฝนจริง ไม่เคยบานในน้ำจากบัวรดน้ำ — มันรู้ ชาวนาเฝ้ามองดอกฝนที่หน้าต่างราวกับนายเรือเฝ้ามองบารอมิเตอร์ และพลาดไปพร้อม ๆ กัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 163,
    folder: "rainpetal",
    name: "Rainpetal",
    rarity: "common",
    descriptionEN:
      "Smells exactly like a summer rain on a road you have not walked in years. Carried in a pocket it makes old neighbourhoods feel close enough to visit, even if the houses are all gone.",
    descriptionTH:
      "หอมเหมือนฝนฤดูร้อนบนถนนที่เจ้าไม่ได้เดินมาหลายปี พกในกระเป๋า มันทำให้ย่านเก่าแก่รู้สึกใกล้พอจะไปเยี่ยม แม้บ้านเหล่านั้นจะไม่เหลืออยู่สักหลัง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 164,
    folder: "rainmoss",
    name: "Rainmoss",
    rarity: "common",
    descriptionEN:
      "Grows on any eave that has given shelter to a stranger during a downpour. Builders who know a house has a rainmoss under its roof charge nothing extra to fix it, a long tradition.",
    descriptionTH:
      "งอกบนชายคาใดที่เคยให้ที่หลบฝนแก่คนแปลกหน้าในยามฝนเทลงมาหนัก ช่างก่อสร้างที่รู้ว่าบ้านใดมีมอสฝนใต้หลังคาจะไม่คิดค่าซ่อมเพิ่ม — เป็นธรรมเนียมที่สืบต่อกันมายาวนาน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 165,
    folder: "windleaf",
    name: "Windleaf",
    rarity: "common",
    descriptionEN:
      "Trembles at the least breath, including the breath of nearby arguments. In council chambers a potted windleaf is taken as an impartial witness, and its testimony has swayed decisions.",
    descriptionTH:
      "สั่นไหวทันทีที่มีลมหายใจพัดผ่าน รวมถึงลมหายใจของการโต้เถียงที่อยู่ใกล้ ๆ ในห้องประชุมสภา ใบลมในกระถางถือเป็นพยานที่เป็นกลาง และคำให้การของมันเคยเปลี่ยนการตัดสินใจมาแล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 166,
    folder: "windfern",
    name: "Windfern",
    rarity: "common",
    descriptionEN:
      "Its fronds always point toward the direction the next traveller will leave the house. Busy households buy one as a rough schedule; quiet ones buy one as a small melancholy.",
    descriptionTH:
      "ใบของมันชี้ไปทางที่นักเดินทางคนต่อไปจะออกจากบ้านเสมอ ครอบครัวที่วุ่นวายจะซื้อมันมาเป็นตารางแบบคร่าว ๆ ส่วนครอบครัวที่เงียบเหงาจะซื้อมาเป็นความเศร้าเล็ก ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 167,
    folder: "windbloom",
    name: "Windbloom",
    rarity: "common",
    descriptionEN:
      "Opens in the direction of the wind and closes against it, which makes it the worst sundial and the best weathervane. Farmers love it; astronomers do not.",
    descriptionTH:
      "บานไปทางทิศเดียวกับลมและหุบต้านลม ทำให้มันเป็นนาฬิกาแดดที่แย่ที่สุดและเป็นเครื่องบอกทิศลมที่ดีที่สุด ชาวไร่รักมัน นักดาราศาสตร์ไม่เลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 168,
    folder: "windpetal",
    name: "Windpetal",
    rarity: "common",
    descriptionEN:
      "Lifts itself on the slightest draft and lands wherever its journey teaches a small lesson. Children press one to their cheek before making a wish, and the wish travels with the petal.",
    descriptionTH:
      "ลอยขึ้นเพียงลมพัดเบา ๆ และลงจอดในจุดที่การเดินทางของมันจะสอนบทเรียนเล็ก ๆ สักบท เด็ก ๆ จะแนบมันกับแก้มก่อนอธิษฐาน แล้วคำอธิษฐานก็จะเดินทางไปกับกลีบ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 169,
    folder: "windmoss",
    name: "Windmoss",
    rarity: "common",
    descriptionEN:
      "Grows only on stones that face the same wind for more than a hundred years. Travellers use it to tell how old a road's weather is, and therefore, quietly, how long the road will last.",
    descriptionTH:
      "งอกเฉพาะบนหินที่หันหน้ารับลมทิศเดียวกันมาเกินหนึ่งร้อยปี นักเดินทางใช้มันบอกอายุของลมประจำเส้นทาง และโดยนัย ก็บอกได้ว่าเส้นทางนั้นจะคงอยู่อีกนานเท่าไร",
    collection: SpeciesCollection.Original,
  },
  {
    id: 170,
    folder: "echoleaf",
    name: "Echoleaf",
    rarity: "common",
    descriptionEN:
      "Repeats the last word spoken within an arm's length, but quietly, and only after a pause long enough to let you regret the word if you need to. Teachers keep one on the desk for that reason alone.",
    descriptionTH:
      "พูดย้ำคำสุดท้ายที่เอ่ยในระยะเอื้อมแขน แต่ด้วยเสียงเบา และหลังจากเงียบไปนานพอจะให้เจ้าได้รู้สึกเสียดายคำนั้นหากต้องการ ครูจะวางมันไว้บนโต๊ะด้วยเหตุผลนี้เท่านั้น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 171,
    folder: "echofern",
    name: "Echofern",
    rarity: "common",
    descriptionEN:
      "Each frond remembers one sentence spoken in its presence and gives it back years later, unasked, on the morning the listener needed it most. Nobody has ever thanked the fern directly, which it does not seem to mind.",
    descriptionTH:
      "ใบแต่ละใบจดจำหนึ่งประโยคที่ถูกเอ่ยใกล้มัน และคืนให้หลายปีต่อมาโดยไม่ต้องถาม ในเช้าวันที่ผู้ฟังต้องการมันที่สุด ยังไม่เคยมีใครขอบคุณเฟิร์นโดยตรง ซึ่งดูเหมือนมันจะไม่ถือ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 172,
    folder: "echobloom",
    name: "Echobloom",
    rarity: "common",
    descriptionEN:
      "Opens with the faint sound of a laugh that used to belong in the room. Houses that have grown quiet hang one by the kitchen to coax the old laughter into visiting again.",
    descriptionTH:
      "บานพร้อมเสียงหัวเราะแผ่ว ๆ ที่เคยดังอยู่ในห้องนั้นเมื่อก่อน บ้านที่กลายเป็นบ้านเงียบจะแขวนมันไว้ในครัว เพื่อชักชวนให้เสียงหัวเราะเก่ากลับมาเยี่ยมอีกครั้ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 173,
    folder: "echopetal",
    name: "Echopetal",
    rarity: "common",
    descriptionEN:
      "Brushed against the ear, it plays back a fragment of something once said to you out of love, even if you have forgotten it until the moment. Whose love is a matter the petal does not disclose.",
    descriptionTH:
      "ปัดเบา ๆ ที่ใบหู มันจะเล่นเสียงเศษหนึ่งของสิ่งที่เคยถูกเอ่ยให้เจ้าฟังด้วยความรัก แม้เจ้าจะหลงลืมไปจนถึงชั่วขณะนั้น ความรักของใคร — มันไม่ยอมบอก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 174,
    folder: "echomoss",
    name: "Echomoss",
    rarity: "common",
    descriptionEN:
      "Lines canyon walls and returns shouts faster than physics allows, as if the canyon has learned to speak first. Surveyors checking their own bearings use its reply instead of their instruments.",
    descriptionTH:
      "ขึ้นตามผนังหุบเขา และส่งเสียงตะโกนกลับเร็วกว่าที่ฟิสิกส์อนุญาต ราวกับหุบเขาได้เรียนรู้ที่จะพูดขึ้นก่อน นักสำรวจที่ตรวจสอบทิศของตนใช้เสียงตอบของมันแทนเครื่องมือเสียด้วยซ้ำ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 175,
    folder: "ghostleaf",
    name: "Ghostleaf",
    rarity: "common",
    descriptionEN:
      "Translucent as a windowpane left open for a draft that never quite arrives. Placed on the pillow of someone who cannot stop thinking of the dead, it gently changes the thinking into remembering.",
    descriptionTH:
      "โปร่งแสงดั่งบานหน้าต่างที่เปิดรอลมซึ่งไม่เคยมาจริง วางบนหมอนของผู้ที่หยุดคิดถึงคนตายไม่ได้ มันจะค่อย ๆ เปลี่ยนความคิดนั้นให้กลายเป็นการระลึก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 176,
    folder: "ghostfern",
    name: "Ghostfern",
    rarity: "common",
    descriptionEN:
      "Casts no shadow, even at noon, and people who grow them quickly stop finding that odd. Mediums insist the fern hears them back, and some of their letters from the other side have water-marks from its leaves.",
    descriptionTH:
      "ไม่ทอดเงาเลย แม้ในยามเที่ยง และคนที่ปลูกมันก็เลิกเห็นเป็นเรื่องแปลกในไม่ช้า ร่างทรงยืนยันว่าเฟิร์นต้นนี้ได้ยินพวกเขาตอบกลับ และจดหมายบางฉบับจากอีกโลกของพวกเขาก็มีรอยน้ำจากใบของมัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 177,
    folder: "ghostbloom",
    name: "Ghostbloom",
    rarity: "common",
    descriptionEN:
      "Opens in the exact shape of a flower you remember someone loving, even if you never met the someone. Florists have made quiet careers on that trick alone.",
    descriptionTH:
      "บานเป็นรูปทรงของดอกไม้ที่เจ้าจำได้ว่าเคยมีใครบางคนรัก แม้เจ้าจะไม่เคยพบคนคนนั้น ร้านดอกไม้เคยทำมาหากินด้วยกลอุบายเพียงข้อเดียวนี้อย่างเงียบ ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 178,
    folder: "ghostpetal",
    name: "Ghostpetal",
    rarity: "common",
    descriptionEN:
      "Weightless and cold, and a little reluctant to be let go of once picked up. Mourners carry one to the graveside and leave it there, and nobody has ever reported finding one twice.",
    descriptionTH:
      "ไร้น้ำหนักและเย็นเยียบ และไม่เต็มใจจะถูกปล่อยเมื่อถูกหยิบขึ้นแล้ว ผู้ไว้อาลัยจะพกไปที่หลุมศพและวางไว้ตรงนั้น และยังไม่เคยมีใครรายงานว่าได้พบกลีบเดียวกันเป็นครั้งที่สอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 179,
    folder: "ghostmoss",
    name: "Ghostmoss",
    rarity: "common",
    descriptionEN:
      "Grows on gravestones that still get visitors. The thickness of the patch is considered a reliable measure of how much love a name still holds, but no one mentions this in front of the thin patches.",
    descriptionTH:
      "งอกบนศิลาหน้าหลุมศพที่ยังมีผู้มาเยี่ยม ความหนาของกอถือเป็นเครื่องวัดความรักที่ชื่อนั้นยังได้รับ แต่ไม่มีใครเอ่ยถึงเรื่องนี้ต่อหน้ากอที่บาง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 180,
    folder: "faeleaf",
    name: "Faeleaf",
    rarity: "common",
    descriptionEN:
      "Plays small pranks on whoever holds it too long — colours shift, warmth wanders, and the seeker begins to forget which way is home. Kept as a bookmark, it ensures a reader never reaches the last page until they want to.",
    descriptionTH:
      "หลอกเล่นคนที่ถือมันนานเกินไป — สีหายไป ความอุ่นเคลื่อนที่ บ่อนการจะจำทางกลับบ้านไม่ได้ เก็บไว้เป็นที่คั่นหนังสือ มันจะทำให้ผู้อ่านไม่ถึงหน้าสุดท้ายจนกว่าจะต้องการ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 181,
    folder: "faefern",
    name: "Faefern",
    rarity: "common",
    descriptionEN:
      "Its fronds rearrange themselves when no one is looking — careful gardeners insist this is not a prank but a lesson in letting go. It grows fastest in houses where someone is learning to say goodbye.",
    descriptionTH:
      "ใบของมันจัดเรียงตัวใหม่เมื่อไม่มีใครมอง — ชาวสวนที่เอาใจใส่ยืนยันว่านี่ไม่ใช่หลอกเล่น แต่เป็นบทเรียนในการปล่อยวาง เติบโตเร็วสุดในบ้านที่มีคนกำลังเรียนรู้ที่จะบอกลา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 182,
    folder: "faebloom",
    name: "Faebloom",
    rarity: "common",
    descriptionEN:
      "Said to be the spare laughter of the twilight court, shed whenever a fae-lord tells a joke too small to keep. Eat one and you will know, for exactly one hour, what the rabbits are gossiping about.",
    descriptionTH:
      "ว่ากันว่าคือเสียงหัวเราะส่วนเกินของราชสำนักสนธยา ร่วงลงทุกครั้งที่เจ้าภูตเล่ามุกตลกเล็กเกินกว่าจะเก็บไว้ หากเจ้ากินมันเข้าไปกลีบหนึ่ง จะรู้ว่าเหล่ากระต่ายกำลังนินทาอะไรกันตลอดหนึ่งชั่วโมงพอดี",
    collection: SpeciesCollection.Original,
  },
  {
    id: 183,
    folder: "faepetal",
    name: "Faepetal",
    rarity: "common",
    descriptionEN:
      "Said to be the spare laughter of the twilight court, shed whenever a fae-lord tells a joke too small to keep. Eat one and you will know, for exactly one hour, what the rabbits are gossiping about.",
    descriptionTH:
      "ว่ากันว่าคือเสียงหัวเราะส่วนเกินของราชสำนักสนธยา ร่วงลงทุกครั้งที่เจ้าภูตเล่ามุกตลกเล็กเกินกว่าจะเก็บไว้ หากเจ้ากินมันเข้าไปกลีบหนึ่ง จะรู้ว่าเหล่ากระต่ายกำลังนินทาอะไรกันตลอดหนึ่งชั่วโมงพอดี",
    collection: SpeciesCollection.Original,
  },
  {
    id: 184,
    folder: "faemoss",
    name: "Faemoss",
    rarity: "common",
    descriptionEN:
      "Never stays in one place if tended with earnest hands — it migrates to where mischief is needed next. Leave it alone and it settles, softly amused, as an observer of chaos.",
    descriptionTH:
      "ไม่เคยอยู่ที่เดียวหากถูกแนบเนียมด้วยมือที่ใจจริง — มันเคลื่อนไปตรงที่ต้องการปีติแรมพลิก ปล่อยให้อยู่เฉย ๆ มันจะตั้งตัวลง หัวเราะเบา ๆ เป็นผู้สังเกตการณ์แห่งความวุ่นวาย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 185,
    folder: "wispleaf",
    name: "Wispleaf",
    rarity: "common",
    descriptionEN:
      "Glimmers with a light that has no source, leading the eye wherever it wants to go. Thieves say a handful tucked in the lining of a coat makes guards look the other way.",
    descriptionTH:
      "เรืองแสงที่ไม่มีต้นกำเนิด นำสายตาไปทางที่มันอยากให้ไป โจรเล่ากันว่าหยิบมือหนึ่งซุกในซับเสื้อ ทำให้ยามจะมองอีกทาง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 186,
    folder: "wispfern",
    name: "Wispfern",
    rarity: "common",
    descriptionEN:
      "Its fronds trace out the same paths in the air each night, and those who follow them describe landscapes that do not appear in any map. Navigators have gotten lost following its patterns, but none of them regret it.",
    descriptionTH:
      "ใบของมันวาดลวดลายเดียวกันในอากาศทุกคืน และผู้ตามตามรอยของมันบรรยายภูมิทัศน์ที่ไม่ปรากฏในแผนที่ใด ผู้นำทางได้หลงตามรูปแบบของมันแล้ว แต่ไม่มีใครเสียดายเลย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 187,
    folder: "wispbloom",
    name: "Wispbloom",
    rarity: "common",
    descriptionEN:
      "Opens into a light so gentle that the lost have been known to follow it for miles, emerging relieved in a place they did not intend. Some say it is mercy; some say it is distraction.",
    descriptionTH:
      "บานเป็นแสงอ่อน ๆ จนคนหลงทางจะตามมันไปได้หลายไมล์ โผล่ออกมาในสถานที่ไม่ตั้งใจ บางคนว่ามันคือเมตตา บางคนว่ามันคือการเบี่ยงเบนความสนใจ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 188,
    folder: "wisppetal",
    name: "Wisppetal",
    rarity: "common",
    descriptionEN:
      "Trails a light as it falls, rewriting the story of the moment it was plucked. Caught mid-air, a wisppetal becomes a small lie that only affects the catcher, and only for one night.",
    descriptionTH:
      "ทำให้แสงตามไปขณะร่วง เขียนเรื่องราวของชั่วขณะที่ถูกเด็ด ถูกจับกลางอากาศ มันกลายเป็นความเท็จเล็ก ๆ ที่เกี่ยวกับผู้จับเท่านั้น และเพียงคืนเดียว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 189,
    folder: "wispmoss",
    name: "Wispmoss",
    rarity: "common",
    descriptionEN:
      "Glows in the dark and hums a note that matches no instrument, leading careless wanderers away from cliffs and toward shelter. The hum changes if danger approaches from a direction the wanderer cannot yet see.",
    descriptionTH:
      "เรืองแสงในความมืด และฮัมเสียงที่ไม่ตรงกับเครื่องดนตรีใด นำผู้เดินน่องไม่ระวังห่างจาก崖ไปหาที่หลบ เสียงจะเปลี่ยนหากอันตรายเข้ามาจากทิศที่ผู้เดินยังมองไม่เห็น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 190,
    folder: "thornleaf",
    name: "Thornleaf",
    rarity: "common",
    descriptionEN:
      "Edged with small sharp points that protect more than they wound, like a careful answer to a rude question. Placed on a windowsill it gently reminds burglars that easier houses exist elsewhere.",
    descriptionTH:
      "ขอบแหลมเล็ก ๆ ที่ปกป้องมากกว่าบาด ราวกับคำตอบที่ดีต่อคำถามหยาบคาย วางบนขอบหน้าต่าง มันจะเตือนโจรอย่างนุ่มนวลว่ามีบ้านที่ง่ายกว่าอยู่ที่อื่น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 191,
    folder: "thornfern",
    name: "Thornfern",
    rarity: "common",
    descriptionEN:
      "Its fronds defend a small space around itself so thoroughly that even insects learn to respect the boundary. Grown in a library, it keeps the books from being disturbed by anything less than genuine interest.",
    descriptionTH:
      "ใบของมันปกป้องพื้นที่เล็ก ๆ รอบตัวจนแม้แต่แมลงก็เรียนรู้ที่จะเคารพขอบเขต ปลูกในห้องสมุด มันจะรักษาหนังสือให้ไม่ถูกรบกวนเว้นแต่มีจริง ๆ ที่สนใจ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 192,
    folder: "thornbloom",
    name: "Thornbloom",
    rarity: "common",
    descriptionEN:
      "Opens with petals that cut anyone rude enough to try to pick it, bloodlessly. Placed on a desk it teaches visitors which questions are worth asking.",
    descriptionTH:
      "บานด้วยกลีบที่บาดใครใจเสื้อพอจะลองเด็ด โดยไม่มีเลือดไหล วางบนโต๊ะ มันจะสอนผู้มาเยี่ยมว่าคำถามไหนคุ้มค่าที่ถามจริง ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 193,
    folder: "thornpetal",
    name: "Thornpetal",
    rarity: "common",
    descriptionEN:
      "Needle-thin and sharp, and it draws a small bead of blood from any hand but the one it was cut for. Given as a gift, it marks you as one worth defending.",
    descriptionTH:
      "บางเล็กและแหลม ทำให้เลือดเคลื่อนจากมือทั้งหมด นอกจากมือคนที่มันถูกเด็ดเพื่อมอบให้ มอบให้เป็นของขวัญ มันบ่งชี้ว่าเจ้าเป็นคนที่คู่ควรป้องกัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 194,
    folder: "thornmoss",
    name: "Thornmoss",
    rarity: "common",
    descriptionEN:
      "Grows on the stones of old battlefields, and its density marks zones of heaviest fighting. Monks who tend the graves listen to where the moss grows thickest and plant prayer there.",
    descriptionTH:
      "งอกบนหินของสนามรบเก่า และความหนาแน่นของมันบ่งบอกจุดการต่อสู้ที่รุนแรง พระภิกษุที่ดูแลหลุมศพฟังว่ามอสเติบโตหนาที่ใด และปลูกการอธิษฐานไว้ที่นั่น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 195,
    folder: "briarleaf",
    name: "Briarleaf",
    rarity: "common",
    descriptionEN:
      "Tangled in itself without any help, and it teaches a twisted kind of beauty to those patient enough to read its edges. Worn as a bookmark, it makes the reader more aware of the thorns in any argument.",
    descriptionTH:
      "พันกันเองโดยไม่ต้องได้ความช่วยเหลือ และสอนความงามแบบเจือจังให้กับผู้ที่อดทนพอจะอ่านขอบของมัน ใส่เป็นที่คั่นหนังสือ มันทำให้ผู้อ่านตั้งสติต่อหนามของข้อโต้แย้ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 196,
    folder: "briarfern",
    name: "Briarfern",
    rarity: "common",
    descriptionEN:
      "Its fronds tangle with each other so completely that no single strand can be straightened, but together they are strong. Gardeners say the fern teaches what marriage is, for those willing to watch.",
    descriptionTH:
      "ใบของมันพันกันจนไม่สามารถแกะออกเดี่ยว ๆ ได้ แต่รวมกันแล้วแข็งแรง ชาวสวนเล่ากันว่าเฟิร์นสอนว่าการแต่งงานคืออะไร สำหรับผู้ที่อดทนพอจะเฝ้าดู",
    collection: SpeciesCollection.Original,
  },
  {
    id: 197,
    folder: "briarbloom",
    name: "Briarbloom",
    rarity: "common",
    descriptionEN:
      "Opens among its own thorns, unreachable, which is somehow a comfort to the lonely who see themselves in it. The bloom lasts longer in houses where someone refused to be tamed.",
    descriptionTH:
      "บานท่ามกลางหนามของตัวเอง ยังไม่สามารถหยิบได้ ซึ่งเป็นความปลอบใจให้คนเดียวดายที่เห็นตัวเองในมัน ดอกจะคงอยู่นานกว่าในบ้านที่มีคนปฏิเสธที่จะยอมปรับตัว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 198,
    folder: "briarpetal",
    name: "Briarpetal",
    rarity: "common",
    descriptionEN:
      "Wrapped in smaller thorns that protect it from every angle, and you have to want it very badly to unwrap it. Given freely, it becomes a promise that someone believed you were worth the difficulty.",
    descriptionTH:
      "ห่อด้วยหนามเล็ก ๆ ที่ปกป้องจากทุกมุม เจ้าต้องต้องการมันมากจริง ๆ ถึงจะค่อย ๆ แกะ มอบให้อย่างไม่บังคับ มันกลายเป็นสัญญาว่าใครบางคนเชื่อว่าเจ้าคุ้มค่ากับความยากลำบาก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 199,
    folder: "briarmoss",
    name: "Briarmoss",
    rarity: "common",
    descriptionEN:
      "Grows so thickly that animals learn to respect the barrier it makes, but climbers swear it guides the foot better than any path. Those who have walked through briar and lived speak of it like a teacher.",
    descriptionTH:
      "เติบโตหนาจนสัตว์เรียนรู้ที่จะเคารพกำแพงที่มันสร้าง แต่นักปีนเขาสาบานว่ามันนำเท้าได้ดีกว่าเส้นทางใด ผู้ที่เคยเดินผ่านไม้ไผ่ร้ายแรงและรอดชีวิตพูดถึงมันดั่งครูผู้สอน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 200,
    folder: "bloomleaf",
    name: "Bloomleaf",
    rarity: "rare",
    descriptionEN:
      "Said to be the shed skin of a flower that outgrew its bloom. It carries the memory of fullness, and those who keep it never quite accept scarcity as permanent.",
    descriptionTH:
      "ว่ากันว่าคือเปลือกหลุดของดอกไม้ที่โตออกจากการบาน มันบรรทุกความทรงจำของความเต็มเปี่ยม และผู้ที่เก็บไว้จะไม่ยอมรับความขาดแคลนว่าเป็นเรื่องถาวร",
    collection: SpeciesCollection.Original,
  },
  {
    id: 201,
    folder: "bloomfern",
    name: "Bloomfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds are the color of fruit at the exact moment before it ripens, and it teaches the art of patience by example. Houses that keep one grow softer with time.",
    descriptionTH:
      "ใบของมันเป็นสีของผลไม้ในชั่วขณะก่อนที่จะสุก มันสอนศิลปะของการอดทนด้วยตัวอย่าง บ้านที่เก็บไว้จะค่อย ๆ มีความอ่อนโยนมากขึ้นตามเวลา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 202,
    folder: "bloombloom",
    name: "Bloombloom",
    rarity: "rare",
    descriptionEN:
      "Flowers within flowers, each opening revealing another layer of delicate refusal. Alchemists claim its essence teaches the secret of becoming less visible without disappearing.",
    descriptionTH:
      "ดอกในดอก เพชฌฉายการหลีกมองแต่ละครั้งด้วยลวดลายอ่อนโยน นักแร่แปรธาตุอ้างว่าสารสกัดของมันสอนความลับของการมองไม่เห็นโดยไม่หายไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 203,
    folder: "bloompetal",
    name: "Bloompetal",
    rarity: "rare",
    descriptionEN:
      "So perfect it looks carved, and it holds its shape long after a normal petal would have begun to fade. Perfectionists keep one to know what they are chasing; wise ones keep one to know when to stop.",
    descriptionTH:
      "สวยงามจนดูเหมือนสลัก และรักษารูปทรงนานหลังจากกลีบธรรมดาเริ่มจาง คนที่นิยมความสมบูรณ์แบบเก็บไว้ดูว่าตนไล่ตามอะไร คนฉลาดเก็บไว้ดูว่าเมื่อไรควรหยุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 204,
    folder: "bloommoss",
    name: "Bloommoss",
    rarity: "rare",
    descriptionEN:
      "Grows in a perfect circle that never expands or contracts, even as seasons change. Monks consider a patch a meditation made visible.",
    descriptionTH:
      "เติบโตเป็นวงกลมสมบูรณ์ที่ไม่ขยายหรือหดตัวตามฤดูกาล ฤษีพิจารณาถือว่ากอนี้คือสัญญานของธรรมชาติอนัตตา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 205,
    folder: "whisperleaf",
    name: "Whisperleaf",
    rarity: "rare",
    descriptionEN:
      "Carries the acoustics of a secret, making any whisper spoken near it sound both intimately close and infinitely far away. Lovers use it to practice saying difficult things.",
    descriptionTH:
      "บรรทุกเสียงอะคูสติกของความลับ ทำให้กระซิบใดก็ตามที่เอ่ยใกล้มันฟังเหมือนใกล้ชิดมาก และไกลพอ ๆ กัน คู่รักใช้มันซ้อมการพูดเรื่องยากลำบาก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 206,
    folder: "whisperfern",
    name: "Whisperfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds repeat the last confidence shared near them, only after the season has changed and the teller has nearly forgotten. This has caused both miraculous reconciliations and surprising estrangements.",
    descriptionTH:
      "ใบของมันพูดย้ำความไว้วางใจสุดท้ายที่ถูกแบ่งปันใกล้เคียง หลังจากฤดูกาลเปลี่ยน และผู้ที่เอ่ยลืมไปแล้ว นี่ทำให้เกิดการหลอมหลายหลายครั้งและการลาจากบ้านประจำที่ที่น่าแปลกใจ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 207,
    folder: "whisperbloom",
    name: "Whisperbloom",
    rarity: "rare",
    descriptionEN:
      "Opens into a shape that suggests a mouth forever opening to speak but never quite beginning. Those who listen very carefully swear they hear what was never said.",
    descriptionTH:
      "บานเป็นรูปทรงของปากที่กำลังจะพูดตลอดไป แต่ไม่เคยเริ่มจริง ผู้ที่ฟังระมัดระวังมากสาบานว่าได้ยินสิ่งที่ไม่เคยถูกเอ่ยออกมา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 208,
    folder: "whisperpetal",
    name: "Whisperpetal",
    rarity: "rare",
    descriptionEN:
      "Warm as a word almost spoken, and it carries the ghost of an intention that was just abandoned. Held long enough, you remember what you were about to confess.",
    descriptionTH:
      "อุ่นเท่าคำที่เกือบจะพูด บรรทุกความลางลับของจิตสำนึกที่ถูกวางลง ถือไว้นานพอจะจำความสารภาพที่เจ้าเกือบจะเอ่ยออกมา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 209,
    folder: "whispermoss",
    name: "Whispermoss",
    rarity: "rare",
    descriptionEN:
      "Lines the walls of caves where lovers have left messages carved in stone. It glows faintly on nights when someone new is reading an old declaration.",
    descriptionTH:
      "ขึ้นเป็นแพตามผนังถ้ำที่คู่รักเคยปล่อยข้อความสลักไว้บนหิน เรืองแสงจาง ๆ ในคืนที่มีคนใหม่กำลังอ่านการประกาศอันเก่า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 210,
    folder: "dewleaf",
    name: "Dewleaf",
    rarity: "rare",
    descriptionEN:
      "Stays beaded with morning dew no matter the season, collecting light like a lens. Laid upon a sleeping wound, it hastens the forgetting of hurt, though the scar remains.",
    descriptionTH:
      "คงชื้นด้วยน้ำค้างเช้าตลอดปี เก็บแสงเหมือนเลนส์ วางบนแผลของคนที่หลับ มันเร่งการหลงลืมความเจ็บปวด แม้แผลจะเหลืออยู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 211,
    folder: "dewfern",
    name: "Dewfern",
    rarity: "rare",
    descriptionEN:
      "Each frond is tipped with a droplet that never quite falls, suspended between wanting to return and needing to stay. Its presence settles arguments about whether decisions are ever truly final.",
    descriptionTH:
      "ปลายใบแต่ละใบเป็นละอองที่ไม่เคยร่วงลง ศูนย์กลางระหว่างความต้องการกลับและความต้องการอยู่ การมีอยู่ของมันแก้ความถกเถียงว่าการตัดสินใจสักข้อเคยเป็นสิ่งสุดท้ายจริง ๆ หรือไม่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 212,
    folder: "dewbloom",
    name: "Dewbloom",
    rarity: "rare",
    descriptionEN:
      "Opens only in the hour before sunrise, each petal jeweled with reflected light that belongs to no star. Gardens that have known sorrow keep one, and the dew reminds them of better mornings.",
    descriptionTH:
      "บานเฉพาะในชั่วโมงก่อนรุ่งอรุณ กลีบแต่ละกลีบประดับด้วยแสงสะท้อนซึ่งไม่เป็นของดวงดาวดวงใด สวนที่เคยรู้จักความเศร้าจะเก็บไว้ และน้ำค้างทำให้นึกถึงเช้าวันที่ดีกว่า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 213,
    folder: "dewpetal",
    name: "Dewpetal",
    rarity: "rare",
    descriptionEN:
      "Cool and clear, and it holds the memory of the first rain that fell on someone who needed it most. To taste one is to remember that mercy is sometimes automatic.",
    descriptionTH:
      "เย็นและใส ครอบครัวความทรงจำของฝนแรกที่ตกบนผู้ที่ต้องการมันมากที่สุด การลิ้มรสกลีบหนึ่ง คืออยากระลึกว่าเมตตานั้นบางครั้งเกิดขึ้นอัตโนมัติ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 214,
    folder: "dewmoss",
    name: "Dewmoss",
    rarity: "rare",
    descriptionEN:
      "Grows only on stones where an oath was sworn and kept, collecting the morning reward of honesty. The moss is brightest on days when someone chooses integrity over comfort.",
    descriptionTH:
      "งอกเฉพาะบนหินที่เคยมีการสาบาน และเคารพสัญญา เก็บผลประโยชน์เช้าของความ truthful ยา่งค่อย ๆ สร่างเป็นเมื่อใครเลือกสติตำหนัก มากกว่าสะดวกสบาย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 215,
    folder: "sparkleaf",
    name: "Sparkleaf",
    rarity: "rare",
    descriptionEN:
      "Catches light and breaks it into colours that should not exist, teaching the eye that wonder is a kind of knowing. Astronomers in failed love affairs keep one to remember why seeing matters.",
    descriptionTH:
      "จับแสงและแบ่งออกเป็นสีที่ไม่ควรมีอยู่ สอนตาว่าความเหลือ ushroom คือวิธีหนึ่งในการรู้ นักดาราศาสตร์ที่ความรักล้มเหลวเก็บไว้เพื่อจำว่าการสังเกตสำคัญเพราะอะไร",
    collection: SpeciesCollection.Original,
  },
  {
    id: 216,
    folder: "sparkfern",
    name: "Sparkfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds crackle faintly with a dry electricity that magnetises the curious. The fern thrives in workshops where someone is learning to make something beautiful from simple materials.",
    descriptionTH:
      "ใบของมันแตกเสียงแผ่ว ๆ ด้วยไฟฟ้าสถิตแห้งที่ดึงดูดผู้อยากรู้ เฟิร์นเจริญงอกงามในห้องทำงานที่มีคนกำลังเรียนรู้ที่จะสร้างสิ่งงามจากวัสดุธรรมดา",
    collection: SpeciesCollection.Original,
  },
  {
    id: 217,
    folder: "sparkbloom",
    name: "Sparkbloom",
    rarity: "rare",
    descriptionEN:
      "Opens with a sound like a tiny struck bell, releasing a brief flash of light that imprints itself on the back of the eyelid. Look away and the flash lingers; look again and it is different every time.",
    descriptionTH:
      "บานพร้อมเสียงเหมือนกระดิ่งเล็ก ๆ ถูกเคาะ ปล่อยแสงวาบเล็ก ๆ ที่ตรึงตัวไว้ที่หลังของปัปิลลา หันหน้าห่าง แสงจะค่อยจางไป มองใหม่มันต่างไปทุกครั้ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 218,
    folder: "sparkpetal",
    name: "Sparkpetal",
    rarity: "rare",
    descriptionEN:
      "Throws light at every angle it is held, as if trying to catch the eye from every direction at once. Given as a gift, it is understood to mean: do not look away.",
    descriptionTH:
      "ส่องแสงไปทุกมุมที่ถือ ราวกับพยายามจับสายตาจากทุกทิศพร้อม ๆ มอบให้เป็นของขวัญ มันหมายถึง อย่าหันหน้าห่าง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 219,
    folder: "sparkmoss",
    name: "Sparkmoss",
    rarity: "rare",
    descriptionEN:
      "Glows with the light of satisfaction, brightest in places where someone has just completed difficult work with their own hands. It is the moss that marks mastery in silence.",
    descriptionTH:
      "เรืองแสงของความพึงพอใจ สว่างสุดในจุดที่มีคนเพิ่งทำงานยากลำบากเสร็จด้วยมือของตน เป็นมอสที่บ่งชี้ความเชี่ยวชาญในการเงียบสงบ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 220,
    folder: "veilleaf",
    name: "Veilleaf",
    rarity: "rare",
    descriptionEN:
      "Translucent enough to read through, but not enough to be clear. It teaches the art of concealment without deception, which is very different.",
    descriptionTH:
      "โปร่งพอจะอ่านข้อความผ่านได้ แต่ไม่พอจะชัดเจน มันสอนศิลปะของการซ่อนโดยไม่โกหก ซึ่งต่างกันมาก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 221,
    folder: "veilfern",
    name: "Veilfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds arrange themselves in gauzy patterns, beautiful but impossible to focus on directly. Wore as a veil, it allows the wearer to see everything without being seen.",
    descriptionTH:
      "ใบของมันจัดเรียงตัวเป็นลวดลายบางเบา สวยงาม แต่มองไม่ตรง สวมเป็นผ้าคลุม มันให้ผู้สวมสามารถมองเห็นทุกอย่างโดยไม่ถูกมอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 222,
    folder: "veilbloom",
    name: "Veilbloom",
    rarity: "rare",
    descriptionEN:
      "Opens into a flower so soft it looks like it might dissolve into the air, made of mist instead of petals. Those mourning in silence keep one for the company of something equally quiet.",
    descriptionTH:
      "บานเป็นดอกอ่อนจนดูเหมือนละลายเป็นอากาศได้ สร้างจากหมอกแทนกลีบ ผู้ที่โศกเศร้าเงียบ ๆ เก็บไว้เพื่อเป็นสหาย ที่เงียบเท่ากัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 223,
    folder: "veilpetal",
    name: "Veilpetal",
    rarity: "rare",
    descriptionEN:
      "So impossibly thin it seems to be made of air itself, and it carries the weight of something hidden very gently. Placed on the lips, it makes the next words emerge soft and sad.",
    descriptionTH:
      "บางมากเหมือนทำจากอากาศตัวเอง บรรทุกน้ำหนักของสิ่งที่ซ่อนอย่างนุ่มนวล วางบนริมฝีปาก มันทำให้คำพูดครั้งถัดไปออกมานุ่มและเศร้า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 224,
    folder: "veilmoss",
    name: "Veilmoss",
    rarity: "rare",
    descriptionEN:
      "Grows in sheer curtains rather than patches, draping walls like a second skin. Touch it and you understand something was here and wanted to leave softly.",
    descriptionTH:
      "เติบโตเป็นม่านบาง ๆ แทนที่จะเป็นกอ คลุมผนังเหมือนผิวชั้นที่สอง สัมผัสมันแล้วรู้ว่ามีบางสิ่งอยู่ที่นี่และต้องการจากไปอย่างนุ่มนวล",
    collection: SpeciesCollection.Original,
  },
  {
    id: 225,
    folder: "heartleaf",
    name: "Heartleaf",
    rarity: "rare",
    descriptionEN:
      "Shaped like an opened chest, and it beats faintly in its center when held in a living hand. It teaches that vulnerab ility is a kind of strength.",
    descriptionTH:
      "รูปทรงเหมือนหน้าอกที่เปิด และเต้นแผ่ว ๆ ตรงกลางเมื่อถูกถือด้วยมือที่มีชีวิต มันสอนว่าความเปราะบาง คือพลังแบบหนึ่ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 226,
    folder: "heartfern",
    name: "Heartfern",
    rarity: "rare",
    descriptionEN:
      "Each frond is a small artery carrying messages between the roots and sky, and it grows only in houses where someone loves more than they protect themselves.",
    descriptionTH:
      "ใบแต่ละใบเป็นหลอดเลือดเล็ก ๆ ที่ขนส่งข้อความระหว่างรากและท้องฟ้า เติบโตเฉพาะในบ้านที่มีคนรักมากกว่าที่ปกป้องตัวเอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 227,
    folder: "heartbloom",
    name: "Heartbloom",
    rarity: "rare",
    descriptionEN:
      "Flowers at the exact moment someone decides they are worth loving, regardless of who they have been or what they have done. The bloom fades if the decision begins to waver.",
    descriptionTH:
      "บานตรงเสี้ยวที่มีคนตัดสินใจว่าตนควรได้รับความรัก ไม่ว่าเขาเคยเป็นใครหรือทำอะไรมา ดอกจะจางลงหากการตัดสินใจเริ่มสั่นคลอน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 228,
    folder: "heartpetal",
    name: "Heartpetal",
    rarity: "rare",
    descriptionEN:
      "Warm with the heat of grief recently transformed, and it carries the weight of surviving something you did not think you could survive. Given as a gift, it is the deepest kindness.",
    descriptionTH:
      "อุ่นด้วยความร้อนของความเศร้าที่กลับเป็นมาเพิ่งหน้า บรรทุกน้ำหนักของการมีชีวิตรอดจากสิ่งที่เจ้าไม่คิดว่าจะรอดได้ มอบให้เป็นของขวัญ มันคือความเมตตาที่ลึกที่สุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 229,
    folder: "heartmoss",
    name: "Heartmoss",
    rarity: "rare",
    descriptionEN:
      "Grows thick and red on stones where an act of forgiveness recently took place. The color fades yearly, but the moss remembers for a very long time.",
    descriptionTH:
      "เติบโตหนาและแดงบนหินที่มีการให้อภัยเพิ่งเกิดขึ้น สีจะค่อย ๆ จางลงทุกปี แต่มอสจดจำได้นาน ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 230,
    folder: "breathleaf",
    name: "Breathleaf",
    rarity: "rare",
    descriptionEN:
      "Stays warm as living breath and slightly moist, as if the plant has just taken air into itself. It teaches that life is less about permanence and more about exchange.",
    descriptionTH:
      "คงอุ่นเท่าลมหายใจที่มีชีวิตและชื้นเล็กน้อย ราวกับต้นไม้เพิ่งหายใจเอาอากาศเข้าตัว มันสอนว่าชีวิตไม่ใช่เรื่องของความคงอยู่ แต่เป็นเรื่องของการแลกเปลี่ยน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 231,
    folder: "breathfern",
    name: "Breathfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds expand and contract with the seasons, like lungs of the land, and it keeps the air around it alive and thinking. Hospitals that adopt one see their survival rates quietly improve.",
    descriptionTH:
      "ใบของมันขยายและหดตามฤดูกาล ดั่งปอดของดินแดน เก็บอากาศรอบตัวให้มีชีวิตและคิด โรงพยาบาลที่รับเลี้ยงมันจะเห็นอัตราการรอดชีวิตดีขึ้นเงียบ ๆ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 232,
    folder: "breathbloom",
    name: "Breathbloom",
    rarity: "rare",
    descriptionEN:
      "Opens and closes with a rhythm that is not quite the breath of the beholder, but close enough to calm the anxious heart. Midwives place them on ledges so the labouring can match their breathing to the flowers' pulse.",
    descriptionTH:
      "บานและหุบตามจังหวะที่ไม่ตรงกับลมหายใจของผู้มอง แต่ใกล้เคียงพอจะทำให้หัวใจกังวลสงบลง นางผดุงครรภ์วางไว้บนหิ้งเพื่อให้ผู้คลอดจะจับการหายใจให้ตรงกับจังหวะของดอก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 233,
    folder: "breathpetal",
    name: "Breathpetal",
    rarity: "rare",
    descriptionEN:
      "Light as the last word of a final goodbye, and it is said to contain a small breath of the beloved. Held to the chest, it lets you remember exactly how their presence felt.",
    descriptionTH:
      "เบาเท่าคำสุดท้ายของการลาที่ปลายสุด ว่ากันว่าบรรจุลมหายใจเล็ก ๆ ของคนที่รัก กำไว้ที่อก มันให้เจ้าจำความรู้สึกของการมีอยู่ของพวกเขาได้อย่างแม่นยำ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 234,
    folder: "breathmoss",
    name: "Breathmoss",
    rarity: "rare",
    descriptionEN:
      "Pulses faintly, as if the stone beneath it is still breathing. It grows only where the air moves freely, and it teaches that life persists where there is flow.",
    descriptionTH:
      "เต้นแผ่ว ๆ ราวกับหินใต้มันหายใจอยู่ เติบโตเฉพาะตรงที่อากาศไหลอย่างอิสระ มันสอนว่าชีวิตคงอยู่เมื่อมีการหมุนเวียน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 235,
    folder: "songleaf",
    name: "Songleaf",
    rarity: "rare",
    descriptionEN:
      "Hums a note that vibrates at the exact frequency of joy, though no one agrees what joy sounds like. Musicians keep one tuned beside their instruments.",
    descriptionTH:
      "ฮัมเสียงที่เต้นที่ความถี่ที่แม่นยำของความสุข แม้ว่าไม่มีใครเห็นด้วยว่าความสุขฟังเป็นอย่างไร นักดนตรีเก็บไว้ปรับเสียงข้างเครื่องดนตรี",
    collection: SpeciesCollection.Original,
  },
  {
    id: 236,
    folder: "songfern",
    name: "Songfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds compose a melody in the wind, and the tune changes when someone in the house is learning to forgive themselves. The song is said to be what joy sounds like when it has nowhere else to go.",
    descriptionTH:
      "ใบของมันประพันธ์เมโลดี้ในลม แล้วทำนองจะเปลี่ยนเมื่อมีคนในบ้านกำลังเรียนรู้ให้อภัยตัวเอง เพลงว่ากันว่าเป็นเสียงของความสุขเมื่อไม่มีที่ไหนให้ไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 237,
    folder: "songbloom",
    name: "Songbloom",
    rarity: "rare",
    descriptionEN:
      "Opens with a note that harmonises with whatever song is being played or sung nearby, making even a dirge sound like a prayer. Choir masters have fought wars over a single bloom.",
    descriptionTH:
      "บานพร้อมเสียงที่สมควรกับเพลงใด ๆ ที่ถูกเล่นหรือร้องใกล้เคียง ทำให้แม้กระทั่งเพลงสำหรับผู้ตายฟังเหมือนการอธิษฐาน หัวหน้าวงโครงสร้างก็เคยทำสงครามเพื่อดอกหนึ่งดอก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 238,
    folder: "songpetal",
    name: "Songpetal",
    rarity: "rare",
    descriptionEN:
      "Hums in the palm, a steady tone that anchors any wandering voice to pitch, to truth, to gravity. Given to a singer, it is understood to mean: do not lose yourself.",
    descriptionTH:
      "ฮัมในฝ่ามือ เสียงคงที่ที่ยึดเสียงใด ๆ ไว้ที่ระดับเสียง ความจริง ความถ่วง มอบให้นักร้องอย่างเข้าใจกันว่า ห้ามหลงตัวเอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 239,
    folder: "songmoss",
    name: "Songmoss",
    rarity: "rare",
    descriptionEN:
      "Grows in the amphitheatres of ancient ruins, and it amplifies any sound that passes over it beautifully. The moss remembers every voice that has sung to it, and the sound is never diminished.",
    descriptionTH:
      "เติบโตในระบายเสียงของซากปรักหักรินเก่า แล้วขยายเสียงใด ๆ ที่ผ่านไปด้วยความสวยงาม มอสจดจำเสียงใครทุกคนที่ร้องให้มัน และเสียงนั้นไม่เคยลดลง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 240,
    folder: "spellleaf",
    name: "Spellleaf",
    rarity: "rare",
    descriptionEN:
      "Written on in ink it does not show the words, but in candlelight the letters glow as if they had always been glowing. It teaches that some truths only appear under certain light.",
    descriptionTH:
      "เขียนด้วยหมึกแล้วคำไม่ปรากฏ แต่ในแสงเทียนตัวอักษรเรืองราวกับมันเรืองมาตั้งแต่เดิม มันสอนว่าความจริงบางอย่างปรากฏเฉพาะในแสงแบบใดแบบหนึ่ง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 241,
    folder: "spellfern",
    name: "Spellfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds move in defiance of wind, according to some older physics. It grows only in the homes of those who believe their will matters.",
    descriptionTH:
      "ใบของมันเคลื่อนไปในทิศตรงข้ามกับลม ตามฟิสิกส์รูปแบบเก่า เติบโตเฉพาะในบ้านของผู้ที่เชื่อว่าจิตใจของตนสำคัญ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 242,
    folder: "spellbloom",
    name: "Spellbloom",
    rarity: "rare",
    descriptionEN:
      "Opens into a shape that has no name in any language, existing in the space between intention and action. Its presence makes small impossibilities feel slightly possible.",
    descriptionTH:
      "บานเป็นรูปทรงที่ไม่มีชื่อในภาษาใด ๆ มีตัวตนในช่องว่างระหว่างจิตสำนึกและการกระทำ การมีอยู่ของมันทำให้ความเป็นไปไม่ได้เล็ก ๆ รู้สึกไปได้เล็กน้อย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 243,
    folder: "spellpetal",
    name: "Spellpetal",
    rarity: "rare",
    descriptionEN:
      "Changes texture depending on what the holder is thinking, soft as a wish when held with doubt, hard as conviction when certainty hardens it. It teaches that intention shapes matter.",
    descriptionTH:
      "เปลี่ยนเนื้อสัมผัสตามที่ผู้ถือคิด นุ่มเท่าความปรารถนาเมื่อถืด้วยความสงสัย แข็งเท่าความมั่นใจเมื่อความแน่นอนทำให้แข็ง มันสอนว่าจิตสำนึกขึ้นรูปสสาร",
    collection: SpeciesCollection.Original,
  },
  {
    id: 244,
    folder: "spellmoss",
    name: "Spellmoss",
    rarity: "rare",
    descriptionEN:
      "Traces the path that power takes through a place, visible only when looked for. Architects have used it as a blueprint for where to place load-bearing walls.",
    descriptionTH:
      "ลากเส้นทางที่พลังเดินผ่านสถานที่ มองเห็นได้เฉพาะเมื่อมองหา สถาปนิกใช้มันเป็นแบบวาดเพื่อบอกว่าต้องวางผนังรับน้ำหนักไว้ที่ไหน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 245,
    folder: "runeleaf",
    name: "Runeleaf",
    rarity: "rare",
    descriptionEN:
      "Its surface is etched with marks that shift slightly with the seasons, as if recounting an ancient story in a language the seasons speak. To possess one is to be responsible for its tale.",
    descriptionTH:
      "พื้นผิวของมันมีรอยเคาะซึ่งเปลี่ยนไปเล็กน้อยตามฤดูกาล ราวกับกำลังเล่าเรื่องเก่าแก่ในภาษาที่ฤดูกาลพูด เพื่อมีครอบครองหมายความว่ามีหน้าที่รับผิดชอบต่อเรื่องราว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 246,
    folder: "runefern",
    name: "Runefern",
    rarity: "rare",
    descriptionEN:
      "Each frond writes its own story in languages that predate human memory. Scholars who translate even a single frond gain wisdom that earns them no thanks whatsoever.",
    descriptionTH:
      "ใบแต่ละใบเขียนเรื่องของมันเองในภาษาที่อยู่ก่อนความทรงจำของมนุษย์ นักวิชาการที่แปลแม้กระทั่งใบเดียวก็ได้เลือดแต่ไม่ได้ขอบคุณเลยแม้แต่น้อย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 247,
    folder: "runebloom",
    name: "Runebloom",
    rarity: "rare",
    descriptionEN:
      "Opens with markings that tell the history of the gardener who grew it, written in every line and petal. It is said to be the only autobiography that can be read but not understood.",
    descriptionTH:
      "บานพร้อมเครื่องหมายที่เล่าประวัติศาสตร์ของชาวสวนผู้ปลูก เขียนอยู่ในทุกเส้นและกลีบ ว่ากันว่าเป็นชีวประวัติชนิดเดียวที่อ่านได้แต่ไม่เข้าใจ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 248,
    folder: "runepetal",
    name: "Runepetal",
    rarity: "rare",
    descriptionEN:
      "Etched with one letter from an alphabet that has been lost for three thousand years, and each petal carries a different letter. To assemble all five petals is to spell the name of something that stopped existing long ago.",
    descriptionTH:
      "จารึกด้วยตัวอักษรหนึ่งตัวจากตัวอักษรที่หายไปสามพันปีแล้ว กลีบแต่ละกลีบมีตัวอักษรต่างกัน เก็บกลีบทั้งห้าแล้ว จะสามารถสะกดชื่อของบางสิ่งที่หยุดมีอยู่นานแล้ว",
    collection: SpeciesCollection.Original,
  },
  {
    id: 249,
    folder: "runemoss",
    name: "Runemoss",
    rarity: "rare",
    descriptionEN:
      "Grows in spirals that spell out truths in a grammar older than language. Cartographers use it to map territories that no longer appear on any map.",
    descriptionTH:
      "เติบโตเป็นเกลียวที่สะกดความจริงในไวยากรณ์ที่เก่ากว่าภาษา นักทำแผนที่ใช้มันวาดแผนที่อาณาเขตที่ไม่ปรากฏในแผนที่ใด ๆ อีกต่อไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 250,
    folder: "mirthleaf",
    name: "Mirthleaf",
    rarity: "rare",
    descriptionEN:
      "Ripples with barely suppressed laughter, and to touch it is to remember the last time pure joy visited your ribcage. It grows in houses where someone has just stopped crying.",
    descriptionTH:
      "คลื่นไปด้วยหัวเราะที่พยายามกดเก็บแล้ว สัมผัสมันจะระลึกวาหลังครั้งสุดท้ายที่ความสุขบริสุทธิ์มาเยี่ยมซี่โครงของเจ้า เติบโตในบ้านที่มีคนเพิ่งเลิกร้องไห้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 251,
    folder: "mirthfern",
    name: "Mirthfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds tremble in the exact rhythm of laughter, even when the air is still. Homes where one grows report far fewer arguments and far more apologies.",
    descriptionTH:
      "ใบของมันสั่นไหวในจังหวะที่แม่นยำของหัวเราะ แม้อากาศจะนิ่ง บ้านที่มีมันตั้งอยู่มีการทะเลาะน้อยกว่า และมีการขอโทษมากกว่า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 252,
    folder: "mirthbloom",
    name: "Mirthbloom",
    rarity: "rare",
    descriptionEN:
      "Opens into the shape of a laugh, petals flaring and folding as if the flower itself finds something unspeakably funny. To watch it unfold is to remember that joy was ever possible.",
    descriptionTH:
      "บานเป็นรูปหัวเราะ กลีบแผ่และหักเหมือนดอกไม้หาเรื่องตลกที่พูดไม่ออก เฝ้ามองมันคลี่ตัว คืออยากระลึกว่าความสุขเคยเป็นไปได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 253,
    folder: "mirthpetal",
    name: "Mirthpetal",
    rarity: "rare",
    descriptionEN:
      "Tastes like the inside of a joke you have never quite understood, and eating one makes you laugh at something that happened years ago in a way that finally heals it.",
    descriptionTH:
      "รสชาติเหมือนข้างในของมุกตลกที่เจ้าไม่เคยเข้าใจ กินกลีบหนึ่งแล้วหัวเราะเรื่องที่เกิดเมื่อปีที่แล้วในแบบที่รักษาได้ในที่สุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 254,
    folder: "mirthmoss",
    name: "Mirthmoss",
    rarity: "rare",
    descriptionEN:
      "Grows thickly where people gather to laugh together, each new layer a record of a different celebration. The moss is deepest where the joy has been longest.",
    descriptionTH:
      "เติบโตหนาแน่นตรงที่คนมาชุมนุมเพื่อหัวเราะด้วยกัน ชั้นใหม่แต่ละชั้นบันทึกการเฉลิมฉลองครั้งต่าง ๆ มอสหนาที่สุดตรงที่ความสุขคงอยู่นานที่สุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 255,
    folder: "tempestleaf",
    name: "Tempestleaf",
    rarity: "rare",
    descriptionEN:
      "Black-backed and silver-palmed, and it trembles in anticipation of storms that have not yet formed. Growing one teaches humility about how little you control.",
    descriptionTH:
      "หลังดำและฝ่ามืออาร์เจนต์ สั่นไหวคาดหวังพายุที่ยังไม่เกิด ปลูกมันเป็นการสอนความต่อจองเกี่ยวกับว่าเจ้าควบคุมได้น้อยเพียงใด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 256,
    folder: "tempestfern",
    name: "Tempestfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds conduct lightning in complex patterns but do not burn, teaching that some energies can be danced with instead of resisted. Sailors keep one to remember that storms pass.",
    descriptionTH:
      "ใบของมันนำไฟฟ้าในรูปแบบซับซ้อน แต่ไม่ไหม้ สอนว่าพลังงานบางอย่างสามารถเต้นรำไปกับได้แทนที่จะต้านทาน ชาวเรือเก็บไว้เพื่อจำว่าพายุผ่านไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 257,
    folder: "tempestbloom",
    name: "Tempestbloom",
    rarity: "rare",
    descriptionEN:
      "Opens only during the heart of a storm, when the lightning is closest and the thunder loudest. Those who have watched it bloom in the storm's peak say there is no flower more beautiful.",
    descriptionTH:
      "บานเฉพาะตรงหัวใจของพายุ เมื่อสายฟ้าใกล้สุด และสายฟ้าคะนองดังสุด ผู้ที่เคยเฝ้าดูมันบานในยอดพายุบอกว่าไม่มีดอกไม้งดงามกว่า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 258,
    folder: "tempestpetal",
    name: "Tempestpetal",
    rarity: "rare",
    descriptionEN:
      "Shaped like a clenched fist and hard as stone, but softening as the hand of the holder relaxes. It teaches that surrender is not the opposite of strength.",
    descriptionTH:
      "รูปทรงเหมือนหมัดแน่น และแข็งเท่าหิน แต่นุ่มลงขณะที่ฝ่ามือผู้ถือหลวม มันสอนว่าการยอมแพ้ไม่ใช่ตรงข้ามของกำลัง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 259,
    folder: "tempestmoss",
    name: "Tempestmoss",
    rarity: "rare",
    descriptionEN:
      "Grows on stones where a shelter once stood, and its presence is said to draw storms away from the vulnerable. The moss is its own kind of prayer.",
    descriptionTH:
      "เติบโตบนหินที่เคยมีที่หลบอยู่ การมีอยู่ของมันว่ากันว่าดึงพายุห่างจากผู้อ่อนแอ มอสเป็นการอธิษฐานแบบของมันเอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 260,
    folder: "groveleaf",
    name: "Groveleaf",
    rarity: "rare",
    descriptionEN:
      "Grows in clusters as if refusing to be a single plant, and it takes deep roots so old they remember forests that vanished. Those who keep one develop a sense of time that disturbs the hurried.",
    descriptionTH:
      "เติบโตเป็นกลุ่มราวกับปฏิเสธที่จะเป็นต้นเดียว หยั่งรากลึกแล้วจดจำป่าที่หายไปแล้ว ผู้เก็บไว้พัฒนาความรู้สึกเรื่องเวลาที่ทำให้คนรีบร้อนวิตกกังวล",
    collection: SpeciesCollection.Original,
  },
  {
    id: 261,
    folder: "grovefern",
    name: "Grovefern",
    rarity: "rare",
    descriptionEN:
      "Its fronds create the sound of wind through a great forest even when the air is still, and animals feel safe near it. To listen to it is to remember the oldest peace you have ever known.",
    descriptionTH:
      "ใบของมันสร้างเสียงลมผ่านป่าใหญ่แม้อากาศจะนิ่ง สัตว์รู้สึกปลอดภัยใกล้มัน ฟังมันคืออยากระลึกสันติภาพเก่าแก่ที่สุดที่เจ้าเคยรู้จัก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 262,
    folder: "grovebloom",
    name: "Grovebloom",
    rarity: "rare",
    descriptionEN:
      "Opens into a flower so vast that it is said to cast its own shade, and to rest beneath it is to know the comfort of being small in a very old place.",
    descriptionTH:
      "บานเป็นดอกใหญ่จนเล่ากันว่าทอดเงาของตัวเอง พักอยู่ใต้มันคืออยากรู้ความสะดวกสบายของการเป็นคนเล็กในสถานที่แก่มาก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 263,
    folder: "grovepetal",
    name: "Grovepetal",
    rarity: "rare",
    descriptionEN:
      "Soft as moss and rooted in time, and it gives what peace feels like to a mind that cannot stop planning. Carried in a pocket, it reminds you that some things exist to shelter you, not to be useful.",
    descriptionTH:
      "นุ่มเหมือนมอส แล้วหยั่งรากในเวลา ให้ความรู้สึกว่าความสงบเป็นอย่างไรแก่จิตใจที่วิตกกังวล พกในกระเป๋า มันเตือนเจ้าว่าบางสิ่งมีอยู่เพื่อปกป้อง ไม่ใช่เพื่อมีประโยชน์",
    collection: SpeciesCollection.Original,
  },
  {
    id: 264,
    folder: "grovemoss",
    name: "Grovemoss",
    rarity: "rare",
    descriptionEN:
      "Carpets the forest floor in its own age, and it grows only where the trees are old enough to remember when they were seeds. The oldest patches are said to predate human memory.",
    descriptionTH:
      "ปูพรมพื้นป่าด้วยอายุของตัวเอง และเติบโตเฉพาะตรงที่ต้นไม้แก่พอจะจำตอนมันเป็นเมล็ด กอที่เก่าแก่ที่สุดว่ากันว่าอยู่ก่อนความทรงจำของมนุษย์",
    collection: SpeciesCollection.Original,
  },
  {
    id: 265,
    folder: "hollowleaf",
    name: "Hollowleaf",
    rarity: "rare",
    descriptionEN:
      "Channels sound rather than creating it, and a single hollow leaf can amplify a whisper into clarity. Those who understand it learn that the shape of emptiness matters very much.",
    descriptionTH:
      "นำเสียงแทนที่จะสร้าง ใบโพรงเดียวสามารถขยายกระซิบให้ชัดเจน ผู้ที่เข้าใจมันเรียนรู้ว่ารูปทรงของความว่างนั้นสำคัญมาก",
    collection: SpeciesCollection.Original,
  },
  {
    id: 266,
    folder: "hollowfern",
    name: "Hollowfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds curve inward, creating chambers where silence gathers and organizes itself. Hermits retreat into a room with one to find the shape of their solitude.",
    descriptionTH:
      "ใบของมันโค้งเข้าด้านใน สร้างห้องเล็ก ๆ ที่ความเงียบสะสมและจัดระเบียบตัวเอง ฤษีถอยลงมาในห้องกับมันเพื่อหารูปทรงของความเดียวดายของตน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 267,
    folder: "hollowbloom",
    name: "Hollowbloom",
    rarity: "rare",
    descriptionEN:
      "Opens into a space so hollow it seems to echo with the absence of sound, a flower made entirely of restraint. To encounter one is to understand that sometimes beauty is what you do not do.",
    descriptionTH:
      "บานเป็นพื้นที่โพรงจนดูเหมือนส่งเสียงตอบของการไม่มีเสียง ดอกที่ทำจากการงดเว้นอย่างสิ้นเชิง เผชิญหน้ากับมันคืออยากเข้าใจว่าความงามบางครั้งเป็นสิ่งที่เจ้าไม่ทำ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 268,
    folder: "hollowpetal",
    name: "Hollowpetal",
    rarity: "rare",
    descriptionEN:
      "A petal that echoes the last word spoken within ten paces of it, but the echo is muffled, as if coming from very far away. It teaches that distance can be created without leaving.",
    descriptionTH:
      "กลีบที่ส่องเสียงคำสุดท้ายที่เอ่ยในระยะสิบก้าว แต่เสียงลดทอน ราวกับมาจากไกลมาก มันสอนว่าระยะทางสามารถสร้างได้โดยไม่ต้องจากไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 269,
    folder: "hollowmoss",
    name: "Hollowmoss",
    rarity: "rare",
    descriptionEN:
      "Grows in circular patches that are perfectly empty in their centres, creating rings that mark the territories of spirits that have found peace. To step into the centre is to step out of time for a moment.",
    descriptionTH:
      "เติบโตเป็นกอวงกลมที่ว่างเปล่าสมบูรณ์ตรงกลาง สร้างแหวนที่บ่งชี้อาณาเขตของวิญญาณที่พบความสงบ ก้าวเข้าไปตรงกลาง คือก้าวออกนอกเวลาสักครู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 270,
    folder: "fenleaf",
    name: "Fenleaf",
    rarity: "rare",
    descriptionEN:
      "Born from water that holds no memory, and it teaches the art of forgetting on purpose. A single leaf dropped into a pond erases its surface entirely, as if wiping away a story told.",
    descriptionTH:
      "เกิดจากน้ำที่ไม่มีความทรงจำ สอนศิลปะของการลืมโดยจงใจ ใบเดียวทิ้งลงในบ่อน้ำขจัดพื้นผิวทั้งหมด ราวกับเช็ดเรื่องที่บอกออกไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 271,
    folder: "fenfern",
    name: "Fenfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds grow at angles that defy standard geometry, and to follow its logic is to learn a new way of navigating uncertainty. The fern knows how to be rooted while adrift.",
    descriptionTH:
      "ใบของมันโตในมุมที่ท้าทายเรขาคณิตมาตรฐาน ตามตรรกะของมันคือเรียนรู้วิธีใหม่ในการนำทางความไม่แน่นอน เฟิร์นรู้จักวิธีการหยั่งรากขณะลอยไปตาม",
    collection: SpeciesCollection.Original,
  },
  {
    id: 272,
    folder: "fenbloom",
    name: "Fenbloom",
    rarity: "rare",
    descriptionEN:
      "Opens on ground that is neither solid nor liquid, in a color that exists only during the transition from day to dusk. To see one bloom is to understand that borders are always temporary.",
    descriptionTH:
      "บานบนพื้นที่ไม่แข็งไม่เหลว ในสีที่มีอยู่เฉพาะในช่วงเปลี่ยนจากกลางวันเป็นสนธยา มองเห็นมันบานคืออยากเข้าใจว่าขอบเขตเป็นสิ่งชั่วคราวเสมอ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 273,
    folder: "fenpetal",
    name: "Fenpetal",
    rarity: "rare",
    descriptionEN:
      "Weighs exactly what a decision costs, and it grows lighter the longer you hold it as if the weight of choosing is something you can set down. Given as a gift, it means: I believe in your choice.",
    descriptionTH:
      "หนักเท่าราคาของการตัดสินใจ และเบาลงยิ่งถืออยู่นาน ราวกับน้ำหนักของการเลือกคือสิ่งที่เจ้าสามารถวางลงได้ มอบให้เป็นของขวัญหมายถึง ฉันเชื่อในการเลือกของเจ้า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 274,
    folder: "fenmoss",
    name: "Fenmoss",
    rarity: "rare",
    descriptionEN:
      "Grows on the boundary between earth and water, a moss that belongs to both and neither. It records the shifting shoreline in its rings, each layer marking where the water was.",
    descriptionTH:
      "เติบโตบนเขตแดนระหว่างดินแดนและน้ำ มอสที่เป็นของทั้งสองและไม่เป็นของทั้งสอง บันทึกชายฝั่งที่เปลี่ยนแปลงในแหวนของมัน ชั้นแต่ละชั้นบอกว่าน้ำเคยอยู่ที่ไหน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 275,
    folder: "marshleaf",
    name: "Marshleaf",
    rarity: "rare",
    descriptionEN:
      "Thrives in rot and generates its own fertility from decay, teaching that endings are not opposites of beginnings. Those who keep one learn to not fear the dark parts of their own gardens.",
    descriptionTH:
      "เจริญงอกงามในการเน่า สร้างความอุดมสมบูรณ์ของตัวเอง มันสอนว่าจุดจบไม่ใช่ตรงข้ามของจุดเริ่มต้น ผู้เก็บไว้เรียนรู้ที่จะไม่กลัวส่วนมืดของสวนของตนเอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 276,
    folder: "marshfern",
    name: "Marshfern",
    rarity: "rare",
    descriptionEN:
      "Its fronds break down what touches them, returning it to the ground in a single breath, and then grow again. It demonstrates that transformation and renewal happen on the same schedule.",
    descriptionTH:
      "ใบของมันสลายสิ่งที่สัมผัสในลมหายใจครั้งเดียว คืนให้พื้นดิน แล้วปลูกใหม่ มันแสดงว่าการเปลี่ยนแปลงและการต่ออายุเกิดขึ้นในตารางเวลาเดียวกัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 277,
    folder: "marshbloom",
    name: "Marshbloom",
    rarity: "rare",
    descriptionEN:
      "Opens into a flower that smells of both life and its ending, a scent that belongs to no human season. To smell it is to know that you yourself are part of something vast and turning.",
    descriptionTH:
      "บานเป็นดอกที่มีกลิ่นของชีวิตและจุดสิ้นสุด กลิ่นที่ไม่เป็นของฤดูกาลใด ๆ ของมนุษย์ กลิ่มมันคืออยากรู้ว่าตัวเจ้าเองเป็นส่วนหนึ่งของบางสิ่งที่กว้างใหญ่และหมุนวน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 278,
    folder: "marshpetal",
    name: "Marshpetal",
    rarity: "rare",
    descriptionEN:
      "Soft and dark, and it absorbs any liquid it encounters without appearing to become wet. Placed in a troubled mind, it draws out the excess feeling without demanding explanation.",
    descriptionTH:
      "นุ่มและมืด ดูดซึมของเหลวใด ๆ ที่เผชิญหน้าโดยไม่ดูเหมือนเปียก วางในจิตใจที่วุ่นวาย มันดึงความรู้สึกส่วนเกินออกไปโดยไม่ต้องอ้างเหตุผล",
    collection: SpeciesCollection.Original,
  },
  {
    id: 279,
    folder: "marshmoss",
    name: "Marshmoss",
    rarity: "rare",
    descriptionEN:
      "Grows in the space between the living and the decomposing, neither fungus nor plant, and it is said to hold the wisdom of things that are no longer themselves. It is the moss that marks transformation in progress.",
    descriptionTH:
      "เติบโตในพื้นที่ระหว่างสิ่งมีชีวิตและการสลายตัว ไม่ใช่เชื้อรา ไม่ใช่ต้นไม้ ว่ากันว่าบรรจุปัญญาของสิ่งที่ไม่เป็นตัวตนแล้ว เป็นมอสที่บ่งชี้การเปลี่ยนแปลงที่กำลังดำเนิน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 280,
    folder: "cinderleaf",
    name: "Cinderleaf",
    rarity: "legendary",
    descriptionEN:
      "The last leaf of a tree that burned a thousand years ago, still warm, still whole. It carries the memory of an entire forest that refused to be erased, and those who hold it become keepers of that refusal.",
    descriptionTH:
      "ใบสุดท้ายของต้นไม้ที่ถูกไฟจวนพันปีที่แล้ว ยังอุ่น ยังสมบูรณ์ มันบรรทุกความทรงจำของป่าเต็มที่ปฏิเสธที่จะถูกลบ ผู้ถือมันกลายเป็นผู้รักษาการปฏิเสธนั้น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 281,
    folder: "cinderfern",
    name: "Cinderfern",
    rarity: "legendary",
    descriptionEN:
      "Born from ash and surviving against the oldest of odds, each frond is a small miracle of persistence. It grows only where something refused to die, and the fern remembers the refusal for longer than the thing itself.",
    descriptionTH:
      "เกิดจากเถ้า รอดจากแรงต้านที่เก่าแก่ที่สุด ใบแต่ละใบเป็นปาฏิหาริย์เล็ก ๆ ของการคงอยู่ เติบโตเฉพาะตรงที่มีบางสิ่งปฏิเสธที่จะตาย และเฟิร์นจดจำการปฏิเสธนั้นนานกว่าตัวสิ่งนั้นเอง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 282,
    folder: "cinderbloom",
    name: "Cinderbloom",
    rarity: "legendary",
    descriptionEN:
      "Opens once in a thousand years, on a night when someone who has lost everything finally stops running. The flower blooms and the person sees that the loss was never the end of the story.",
    descriptionTH:
      "บานครั้งเดียวในพันปี ในคืนที่มีคนซึ่งสูญเสียทั้งสิ้นในที่สุดก็เลิกวิ่ง ดอกบาน และคนนั้นเห็นว่าการสูญเสียไม่เคยเป็นจุดจบของเรื่อง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 283,
    folder: "cinderpetal",
    name: "Cinderpetal",
    rarity: "legendary",
    descriptionEN:
      "Black as the hottest coal and warm as a prayer for the lost. Those who touch it remember not their losses, but the exact moment they decided the losses would not define them.",
    descriptionTH:
      "ดำเท่าถ่านแดง และอุ่นเท่าการอธิษฐานสำหรับผู้หลง ผู้ที่สัมผัสจะจำ — ไม่ใช่ความสูญเสีย — แต่ชั่วขณะที่ตัดสินใจว่าความสูญเสียจะไม่นิยาม",
    collection: SpeciesCollection.Original,
  },
  {
    id: 284,
    folder: "cindermoss",
    name: "Cindermoss",
    rarity: "legendary",
    descriptionEN:
      "Grows only on the scorched earth where a civilization chose to end itself rather than yield. The moss remembers that choice and teaches the terrible clarity that comes from deciding.",
    descriptionTH:
      "เติบโตเฉพาะบนผืนดินไหม้ที่อารยธรรมเลือกจบตัวแทนที่จะยอมแพ้ มอสจดจำการเลือกนั้นและสอนความชัดเจนที่น่ากลัว ของการตัดสินใจ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 285,
    folder: "opalleaf",
    name: "Opalleaf",
    rarity: "legendary",
    descriptionEN:
      "It holds all the colors that have ever existed, and some that have not yet found their way to the world. Those who keep one are said to be able to see the true face of anyone they meet, and they choose, wisely, to forget what they see.",
    descriptionTH:
      "ถือสีทั้งหมดที่เคยมีอยู่ และบางสีที่ยังไม่ได้หาทางมาสู่โลก ผู้เก็บไว้ว่ากันว่าสามารถเห็นใจจริงของใครก็ได้ที่พบ และพวกเขาเลือก — อย่างฉลาด — ที่จะลืมสิ่งที่เห็น",
    collection: SpeciesCollection.Original,
  },
  {
    id: 286,
    folder: "opalfern",
    name: "Opalfern",
    rarity: "legendary",
    descriptionEN:
      "Each frond is a different color depending on the angle of the light, and it teaches that a single truth can appear different from different directions. The fern knows that all viewpoints can be true.",
    descriptionTH:
      "ใบแต่ละใบมีสีต่างกันตามมุมของแสง มันสอนว่าความจริงเดียวสามารถปรากฏต่างไปจากทิศต่างก็ได้ เฟิร์นรู้ว่ามุมมองทั้งหมดสามารถเป็นจริงได้",
    collection: SpeciesCollection.Original,
  },
  {
    id: 287,
    folder: "opalbloom",
    name: "Opalbloom",
    rarity: "legendary",
    descriptionEN:
      "Opens into a flower that contains the light of a thousand different moments, all at once, showing you every possibility you could have been in a single bloom. Those who see it once are never quite the same.",
    descriptionTH:
      "บานเป็นดอกที่บรรจุแสงของชั่วขณะต่างกันพันครั้ง พร้อม ๆ กัน แสดงให้คุณเห็นความเป็นไปได้ทั้งหมดที่คุณอาจจะเป็นได้ในดอกเดียว ผู้ที่เห็นครั้งเดียวจะไม่เหมือนเดิม",
    collection: SpeciesCollection.Original,
  },
  {
    id: 288,
    folder: "opalpetal",
    name: "Opalpetal",
    rarity: "legendary",
    descriptionEN:
      "Shows a different color to every eye that beholds it, and no two people agree on what they saw. It teaches that the most powerful truths cannot be spoken, only witnessed.",
    descriptionTH:
      "แสดงสีต่างกันให้แต่ละตาที่มอง และไม่มีสองคนสอมพอใจในสิ่งที่พวกเขาเห็น มันสอนว่าความจริงที่ทรงพลังที่สุดไม่อาจเอ่ย เพียงแต่บรรลัย",
    collection: SpeciesCollection.Original,
  },
  {
    id: 289,
    folder: "opalmoss",
    name: "Opalmoss",
    rarity: "legendary",
    descriptionEN:
      "Grows only where a mirror once sat and held the reflection of someone who mattered very much. The moss captures the light and returns it, never quite the same angle twice.",
    descriptionTH:
      "เติบโตเฉพาะตรงที่กระจกเคยนั่งและเก็บสะท้อนของคนที่สำคัญมากถูกบันทึกในรูปร่างเพราะสถานที่เก่า... เขียนใหม่ อย่างชัดเจน: เติบโตเฉพาะตรงที่เคยมีกระจก และทำให้สะท้อนของคนที่สำคัญมาก มอสจับแสงและคืนมา ไม่เคยในมุมเดียวกัน",
    collection: SpeciesCollection.Original,
  },
  {
    id: 290,
    folder: "topazleaf",
    name: "Topazleaf",
    rarity: "legendary",
    descriptionEN:
      "Golden-amber and warm with a heat that comes from deep within the earth, and it glows faintly even in complete darkness. To hold one is to believe, for a moment, that all losses will eventually return as something better.",
    descriptionTH:
      "สีทองเหลืองอำพัน และอุ่นด้วยความร้อนจากลึกของโลก เรืองแสงจาง ๆ แม้ในความมืดสนิท การถือมันคือเชื่อ สักครู่ว่าการสูญเสียทั้งหมดจะกลับมาในรูปที่ดีกว่า",
    collection: SpeciesCollection.Original,
  },
  {
    id: 291,
    folder: "topazfern",
    name: "Topazfern",
    rarity: "legendary",
    descriptionEN:
      "Its fronds catch the light and throw it forward, as if the plant itself is trying to show you the way through the dark. The fern is said to grow brighter the more it is needed.",
    descriptionTH:
      "ใบของมันจับแสงและโยนมันไปข้างหน้า ราวกับต้นไม้พยายามแสดงเส้นทางผ่านความมืด เฟิร์นว่ากันว่าเรืองแสงสว่างขึ้นยิ่งต้องการ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 292,
    folder: "topazbloom",
    name: "Topazbloom",
    rarity: "legendary",
    descriptionEN:
      "Opens at the exact moment when someone finally understands that their own light has never left them. The bloom lasts as long as the understanding holds, which is always longer than expected.",
    descriptionTH:
      "บานในชั่วขณะที่มีคนในที่สุดก็เข้าใจว่าแสงของตนไม่เคยจากไป ดอกคงอยู่นานเท่ากับความเข้าใจยึดไว้ ซึ่งนานเกินที่คาดไว้เสมอ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 293,
    folder: "topazpetal",
    name: "Topazpetal",
    rarity: "legendary",
    descriptionEN:
      "Warm and glowing, and to swallow one is to know, for a single day, the truth of your own worth without doubt. The clarity fades by evening, but the memory of having known remains forever.",
    descriptionTH:
      "อุ่นและเรือง กลืนกลีบหนึ่ง คือรู้ — สักหนึ่งวัน — ความจริงของคุณค่าของตนเองโดยไม่สงสัย ความชัดเจนจะจาง โดยเย็น แต่ความทรงจำที่รู้ยังคงอยู่ตลอดไป",
    collection: SpeciesCollection.Original,
  },
  {
    id: 294,
    folder: "topazmoss",
    name: "Topazmoss",
    rarity: "legendary",
    descriptionEN:
      "Grows only on stones warmed by the sun for ten thousand days, and its presence is said to mark places where the light has chosen to stay. It is the moss of transformation through constancy.",
    descriptionTH:
      "เติบโตเฉพาะบนหินที่ถูกอาทิตย์อบอุ่นมาหมื่นวัน การมีอยู่ของมันว่ากันว่าบ่งชี้สถานที่ที่แสงตัดสินใจอยู่ เป็นมอสของการเปลี่ยนแปลงผ่านความคงอยู่",
    collection: SpeciesCollection.Original,
  },
  {
    id: 295,
    folder: "coralleaf",
    name: "Coralleaf",
    rarity: "legendary",
    descriptionEN:
      "Born where a drowned star fell into deep water, it branches like memory itself, growing into architectures that predate any known language. To tend one is to be responsible for continuity across epochs that you will never fully understand.",
    descriptionTH:
      "เกิดจากดวงดาวจมลงสู่ห้วงน้ำลึก แผ่กิ่งก้านดั่งความทรงจำเอง เติบโตเป็นสถาปัตยกรรมที่เก่ากว่าภาษาใด ๆ ที่รู้จัก การดูแลมันคืออยู่รับผิดชอบต่อความต่อเนื่องข้ามยุคที่เจ้าจะไม่เข้าใจอย่างสมบูรณ์",
    collection: SpeciesCollection.Original,
  },
  {
    id: 296,
    folder: "coralfern",
    name: "Coralfern",
    rarity: "legendary",
    descriptionEN:
      "Its fronds are so perfect they look carved by ancient artisans, and they carry the memories of civilizations that built monuments to beauty. To tend one is to participate in a covenant made before your birth.",
    descriptionTH:
      "ใบของมันสมบูรณ์จนดูเหมือนสลักโดยช่างโบราณ บรรทุกความทรงจำของอารยธรรมที่สร้างอนุสรณ์ให้ความงาม การดูแลมันคือเข้าร่วมพันธสัญญาที่ทำก่อนเกิด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 297,
    folder: "coralbloom",
    name: "Coralbloom",
    rarity: "legendary",
    descriptionEN:
      "Flowers at the moment when the impossible becomes necessary, and the bloom itself teaches that grace arrives when we have truly exhausted every other way. To witness one is to believe in salvation.",
    descriptionTH:
      "บานในชั่วขณะที่สิ่งเป็นไปไม่ได้กลายเป็นสิ่งจำเป็น ดอกสอนว่าเมตตามาถึงเมื่อเราปล่อยทุกทางอื่นจริง ๆ มองเห็นมันคืออยากเชื่อในการช่วยเหลือ",
    collection: SpeciesCollection.Original,
  },
  {
    id: 298,
    folder: "coralpetal",
    name: "Coralpetal",
    rarity: "legendary",
    descriptionEN:
      "A petal that fell from a flower blooming on the ocean floor ten thousand years ago, still colder than winter and harder than pearl. To hold it is to hold one instant of absolute grace, unchanged and unchanging.",
    descriptionTH:
      "กลีบที่ร่วงจากดอกที่บานบนพื้นมหาสมุทรสิบพันปีที่แล้ว เย็นกว่าฤดูหนาว และแข็งกว่าไข่มุก การถือมันคืออยู่ถือเวลาหนึ่งของเมตตาสมบูรณ์ ไม่เปลี่ยนและไม่เปลี่ยนแปลง",
    collection: SpeciesCollection.Original,
  },
  {
    id: 299,
    folder: "coralmoss",
    name: "Coralmoss",
    rarity: "legendary",
    descriptionEN:
      "Grows only in the deepest ocean places where light has never arrived, glowing with light that belongs to no star. To find a patch is to have already discovered a secret the world does not yet know it has.",
    descriptionTH:
      "เติบโตเฉพาะในลึกมหาสมุทรที่ไม่เคยมีแสง เรืองด้วยแสงซึ่งไม่เป็นของดวงดาวดวงใด การหากอหนึ่ง คือการค้นพบความลับที่โลกยังไม่รู้ว่าตนเองมี",
    collection: SpeciesCollection.Original,
  },
];

// Integrity: catch id/ordering drift early — the app fails to boot rather
// than quietly rendering the wrong image for a saved tree.
if (SPECIES.length !== 300) {
  throw new Error(`expected 300 species, got ${SPECIES.length}`);
}
for (let i = 0; i < SPECIES.length; i++) {
  const s = SPECIES[i]!;
  if (s.id !== i) {
    throw new Error(`species[${i}].id is ${s.id}, expected ${i}`);
  }
}

export const SPECIES_BY_RARITY: Record<Rarity, readonly SpeciesDef[]> = {
  common: SPECIES.filter((s) => s.rarity === "common"),
  rare: SPECIES.filter((s) => s.rarity === "rare"),
  legendary: SPECIES.filter((s) => s.rarity === "legendary"),
};
