import type { SpeciesDef } from "./types";
import { SpeciesCollection } from "./types";

const series: readonly SpeciesDef[] = [
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
];

export default series;
