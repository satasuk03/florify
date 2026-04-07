import type { SpeciesDef } from "./types";
import { SpeciesCollection } from "./types";

const series: readonly SpeciesDef[] = [
  {
    id: 200,
    folder: "bloomleaf",
    name: "Bloomleaf",
    rarity: "rare",
    descriptionEN:
      "Said to be the shed skin of a flower that outgrow its bloom. It carries the memory of fullness, and those who keep it never quite accept scarcity as permanent.",
    descriptionTH:
      "ว่ากันว่าเป็นกลีบที่ผลัดออกมาจากดอกไม้ที่เติบโตเกินกว่าการเบ่งบานปกติ มันเก็บงำความทรงจำแห่งความพรั่งพร้อมไว้ ผู้ที่ครอบครองจะไม่มีวันยอมจำนนต่อความขาดแคลนว่าเป็นเรื่องถาวร",
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
      "ใบของมันมีสีสันดั่งผลไม้ในชั่วขณะก่อนจะสุกงอม มันสอนศิลปะแห่งความอดทนผ่านการดำรงอยู่ บ้านที่มีเฟิร์นนี้จะค่อยๆ อบอวลด้วยความอ่อนโยนตามกาลเวลา",
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
      "ดอกไม้ซ้อนในดอกไม้ การคลี่บานแต่ละชั้นเผยให้เห็นการปฏิเสธที่นุ่มนวลซ้อนอยู่อีกชั้น นักเล่นแร่แปรธาตุอ้างว่าสารสกัดของมันสอนความลับของการลบเลือนตัวตนโดยไม่จางหายไป",
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
      "งดงามราวกับถูกสลักเสลา มันคงรูปอยู่นานหลังจากกลีบปกติโรยราไปแล้ว เหล่าผู้นิยมความสมบูรณ์แบบเก็บไว้เพื่อดูเป้าหมายที่ตนไล่ตาม ส่วนผู้มีปัญญาเก็บไว้เพื่อเตือนตนว่าเมื่อใดควรหยุด",
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
      "เติบโตเป็นวงกลมสมบูรณ์ที่ไม่ขยายหรือหดตัวแม้ฤดูกาลจะผันแปรเหล่านักบวชพิจารณาว่ากอมอสนี้คือภาพจำลองของสมาธิที่ปรากฏให้เห็นเป็นรูปธรรม",
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
      "กักเก็บสุ้มเสียงแห่งความลับ ทำให้ทุกเสียงกระซิบที่เอ่ยใกล้มันฟังดูใกล้ชิดอย่างลึกซึ้งทว่าก็ห่างไกลแสนไกลในคราวเดียว คู่รักมักใช้มันเพื่อฝึกเอ่ยถ้อยคำที่พูดยากที่สุด",
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
      "ใบของมันจะย้ำเตือนความในใจสุดท้ายที่ถูกบอกเล่า ในวันที่ฤดูกาลเปลี่ยนผ่านและผู้พูดเกือบจะลืมเลือนไปแล้ว สิ่งนี้เคยนำมาซึ่งทั้งการคืนดีที่น่าอัศจรรย์และการจากลาที่เหนือความคาดหมาย",
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
      "บานเป็นรูปทรงคล้ายริมฝีปากที่เผยอออกเตรียมจะเอ่ยคำ ทว่ากลับเงียบงันตลอดกาล ผู้ที่ตั้งใจฟังอย่างแน่วแน่สาบานว่าพวกเขาได้ยินสิ่งที่ 'ไม่เคยถูกพูดออกไป'",
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
      "อุ่นดั่งถ้อยคำที่เกือบจะถูกเอ่ย มันแบกรับร่องรอยของเจตจำนงที่เพิ่งถูกละทิ้ง หากถือไว้นานพอ คุณจะจำสิ่งที่ตนเองเกือบจะสารภาพออกมาได้",
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
      "ขึ้นตามผนังถ้ำที่คู่รักเคยจารึกข้อความไว้บนหิน มันจะเรืองแสงจางๆ ในคืนที่มีคนใหม่กำลังอ่านคำประกาศรักที่เก่าก่อน",
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
      "พรมด้วยหยาดน้ำค้างยามเช้าตลอดปีและรวมแสงดั่งเลนส์แก้ว เมื่อวางลงบนบาดแผลที่กำลังสมาน มันจะเร่งให้ใจลืมเลือนความเจ็บปวด แม้รอยแผลเป็นจะยังคงอยู่ก็ตาม",
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
      "ปลายใบแต่ละใบมีหยดน้ำที่ไม่มีวันร่วงหล่น ค้างคาอยู่ระหว่างความปรารถนาที่จะคืนกลับและความจำเป็นที่ต้องอยู่ต่อ การมีอยู่ของมันยุติข้อถกเถียงว่าการตัดสินใจใดๆ เคยเป็นจุดจบที่แท้จริงหรือไม่",
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
      "บานเฉพาะในชั่วโมงก่อนรุ่งสาง กลีบแต่ละกลีบประดับด้วยแสงสะท้อนที่ไม่เป็นของดาวดวงใด สวนที่เคยผ่านความโศกเศร้ามักปลูกมันไว้ เพื่อให้หยาดน้ำค้างย้ำเตือนถึงเช้าวันที่ดีกว่า",
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
      "เย็นใสและเก็บความทรงจำของฝนหยดแรกที่ตกลงมาในยามที่ใครบางคนต้องการมันที่สุด การลิ้มรสกลีบน้ำค้างคือการระลึกว่าความเมตตาบางครั้งก็เกิดขึ้นเองโดยธรรมชาติ",
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
      "งอกงามเฉพาะบนหินที่เคยมีการให้สัตย์ปฏิญาณและรักษาไว้อย่างดี เพื่อเก็บรับรางวัลยามเช้าแห่งความซื่อสัตย์ มอสนี้จะเรืองรองที่สุดในวันที่ใครบางคนเลือกความซื่อตรงเหนือความสบายส่วนตัว",
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
      "ดักจับแสงและหักเหเป็นสีสันที่ไม่มีอยู่จริง สอนให้ดวงตารู้ซึ้งว่าความพิศวงก็คือการรับรู้รูปแบบหนึ่ง นักดาราศาสตร์ที่ผิดหวังในรักมักเก็บไว้เพื่อเตือนใจว่าเหตุใดการ 'เฝ้ามอง' จึงสำคัญ",
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
      "ใบของมันส่งเสียงเปรี๊ยะแผ่วๆ ด้วยไฟฟ้าสถิตที่ดึงดูดผู้มีใจใฝ่รู้ เฟิร์นจะงอกงามในโรงทำงานที่มีคนกำลังเรียนรู้ที่จะสร้างความงามจากวัสดุที่แสนธรรมดา",
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
      "บานพร้อมเสียงดังกรุ๊งกริ๊งดั่งระฆังจิ๋ว ปล่อยแสงวาบสั้นๆ ที่จะติดตรึงอยู่หลังเปลือกตา แม้หันไปทางอื่นแสงนั้นยังคงค้างอยู่ และทุกครั้งที่มองมันใหม่ แสงนั้นจะเปลี่ยนไปไม่เคยซ้ำ",
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
      "สะท้อนแสงไปทุกทิศทางที่มันถูกถือไว้ ราวกับพยายามดึงดูดสายตาจากทุกมุมในคราวเดียว หากมอบให้เป็นของขวัญ มันมีความหมายนัยสำคัญว่า 'อย่าได้หันมองไปทางอื่นเลย'",
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
      "เรืองรองด้วยแสงแห่งความพึงพอใจ สว่างไสวที่สุดในจุดที่มีคนเพิ่งทำงานยากลำบากเสร็จสิ้นด้วยน้ำพักน้ำแรง เป็นมอสที่บ่งชี้ความเชี่ยวชาญอันเงียบเชียบ",
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
      "โปร่งแสงพอจะอ่านข้อความผ่านได้ แต่ไม่ใสจนกระจ่างตา มันสอนศิลปะแห่งการซ่อนเร้นโดยไม่ต้องใช้การหลอกลวง ซึ่งเป็นสิ่งที่แตกต่างกันโดยสิ้นเชิง",
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
      "ใบของมันจัดเรียงตัวเป็นลวดลายบางเบาดั่งผ้าคลุมหน้า งดงามทว่ายากจะจับโฟกัส หากสวมเป็นผ้าคลุม มันจะช่วยให้ผู้สวมมองเห็นทุกสิ่งได้โดยไม่ถูกมองเห็น",
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
      "บานเป็นดอกไม้ที่อ่อนละมุนจนดูเหมือนจะสลายกลายเป็นอากาศ ธาตุแท้สร้างจากสายหมอกแทนกลีบดอกไม้ ผู้ที่ไว้ทุกข์อย่างเงียบงันมักเก็บไว้เพื่อเป็นเพื่อนกับบางสิ่งที่เงียบเหงาเท่ากัน",
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
      "บางเบาจนเหมือนทำจากอากาศธาตุ มันแบกรับน้ำหนักของความลับที่ซ่อนไว้อย่างแผ่วเบา เมื่อวางทาบบนริมฝีปาก มันจะทำให้คำพูดถัดไปที่เอ่ยออกมาดูนุ่มนวลทว่าเศร้าสร้อย",
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
      "เติบโตเป็นม่านบางๆ แทนที่จะเป็นกอมอส คลุมผนังราวกับผิวหนังชั้นที่สอง สัมผัสมันแล้วคุณจะรู้ซึ้งว่าเคยมีบางสิ่งอยู่ที่นี่และต้องการจากไปอย่างนุ่มนวลที่สุด",
    collection: SpeciesCollection.Original,
  },
  {
    id: 225,
    folder: "heartleaf",
    name: "Heartleaf",
    rarity: "rare",
    descriptionEN:
      "Shaped like an opened chest, and it beats faintly in its center when held in a living hand. It teaches that vulnerability is a kind of strength.",
    descriptionTH:
      "รูปทรงคล้ายทรวงอกที่เปิดออก และเต้นแผ่วๆ ตรงกึ่งกลางเมื่อถูกถือด้วยมือที่มีชีวิต มันสอนให้รู้ว่าความเปราะบางก็คือพลังความเข้มแข็งรูปแบบหนึ่ง",
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
      "ใบแต่ละใบเป็นดั่งเส้นเลือดใหญ่ที่ส่งผ่านข้อความระหว่างรากและแผ่นฟ้า มันจะเติบโตเฉพาะในบ้านที่มีคนมอบความรักให้ผู้อื่นมากกว่าที่ปกป้องตัวเอง",
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
      "ผลิบานในเสี้ยววินาทีที่ใครบางคนตัดสินใจได้ว่าตนเอง 'คู่ควรแก่การถูกรัก' ไม่ว่าอดีตจะเป็นอย่างไร ดอกจะเริ่มจางลงหากความเชื่อมั่นนั้นสั่นคลอน",
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
      "อุ่นด้วยไอความร้อนของความโศกเศร้าที่เพิ่งแปรเปลี่ยนไป มันแบกรับน้ำหนักของการมีชีวิตรอดจากสิ่งที่เคยคิดว่าทนไม่ไหว การมอบให้เป็นของขวัญถือเป็นความเมตตาที่ลึกซึ้งที่สุด",
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
      "งอกหนาเป็นสีแดงฉานบนหินในจุดที่มีการให้อภัยเกิดขึ้น แม้สีจะค่อยๆ จางไปตามปี แต่ตัวมอสจะจดจำการให้อภัยนั้นไว้นานแสนนาน",
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
      "คงความอุ่นและชื้นดั่งลมหายใจที่มีชีวิต ราวกับต้นไม้เพิ่งสูดอากาศเข้าตัวไป มันสอนว่าชีวิตไม่ใช่เรื่องของความคงทนถาวร แต่คือการแลกเปลี่ยนหมุนเวียน",
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
      "ใบของมันขยายและหดตัวตามฤดูกาลดั่งปอดของผืนแผ่นดิน คอยรักษาให้อากาศรอบตัวบริสุทธิ์และทรงพลัง โรงพยาบาลที่ปลูกเฟิร์นนี้ไว้มักพบว่าอัตราการรอดชีวิตของคนไข้ดีขึ้นอย่างเงียบเชียบ",
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
      "บานและหุบด้วยจังหวะที่แม้มิใช่ลมหายใจเดียวกับผู้มอง แต่ก็ใกล้เคียงพอจะปลอบใจที่กังวล นางผดุงครรภ์มักวางไว้เพื่อให้หญิงที่กำลังคลอดกำหนดลมหายใจตามจังหวะชีพจรของดอกไม้",
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
      "เบาหวิวดั่งถ้อยคำสุดท้ายของการอำลา ว่ากันว่ามันบรรจุลมหายใจเฮือกเล็กๆ ของคนที่รักไว้ เมื่อกำไว้ที่หน้าอก มันจะช่วยให้คุณจำความรู้สึกยามพวกเขายังอยู่ได้อย่างแม่นยำ",
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
      "เต้นตุบๆ แผ่วๆ ราวกับหินข้างใต้มันยังมีลมหายใจ เติบโตเฉพาะในที่ที่อากาศถ่ายเทได้สะดวก มันสอนว่าชีวิตจะดำรงอยู่ได้ในจุดที่มีการไหลเวียน",
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
      "ฮัมเสียงด้วยความถี่เดียวกับความสุข แม้จะไม่มีใครตกลงกันได้ว่าความสุขนั้นฟังดูเป็นเช่นไร นักดนตรีมักเก็บไว้ข้างเครื่องดนตรีเพื่อใช้เทียบเสียง",
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
      "ใบของมันประพันธ์ทำนองยามต้องลม และท่วงทำนองจะเปลี่ยนไปเมื่อคนในบ้านเริ่มเรียนรู้ที่จะให้อภัยตัวเอง ว่ากันว่าเสียงเพลงของมันคือเสียงของความปิติในยามที่ไร้ที่ไป",
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
      "บานพร้อมเสียงที่ประสานเข้ากับทุกท่วงทำนองในบริเวณนั้น ทำให้แม้แต่เพลงแห่ศพก็ยังฟังดูคล้ายคำสวดอธิษฐาน หัวหน้าวงขับร้องประสานเสียงเคยถึงขั้นทำสงครามกันเพื่อแย่งชิงดอกไม้นี้เพียงดอกเดียว",
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
      "ฮัมเพลงในฝ่ามือด้วยเสียงที่คงที่ เพื่อดึงรั้งเสียงที่หลงลืมให้คืนกลับสู่ระดับเสียง ความจริง และจุดศูนย์ถ่วง หากมอบให้นักร้อง มันมีความหมายนัยว่า 'อย่าได้หลงลืมตัวตน'",
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
      "เติบโตตามอัฒจันทร์โบราณ คอยขยายทุกเสียงที่ผ่านไปให้ไพเราะยิ่งขึ้น มอสนี้จดจำทุกเสียงที่เคยขับขานให้มันฟัง และเสียงนั้นจะไม่มีวันจางหายไป",
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
      "เมื่อเขียนด้วยหมึกจะไม่ปรากฏถ้อยคำใด แต่ในแสงเทียนตัวอักษรจะเรืองแสงราวกับมันอยู่ตรงนั้นเสมอมา มันสอนว่าความจริงบางประการจะปรากฏเฉพาะภายใต้แสงที่เหมาะสมเท่านั้น",
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
      "ใบของมันไหวติงในทิศทางที่สวนกระแสลมตามกฎฟิสิกส์โบราณ มันจะเติบโตเฉพาะในบ้านของเหล่านั้นที่เชื่อมั่นว่าเจตจำนงของตนทรงพลัง",
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
      "บานเป็นรูปทรงที่ไม่มีชื่อเรียกในภาษาใดๆ ดำรงอยู่ในช่องว่างระหว่างความตั้งใจและการลงมือทำ การมีอยู่ของมันทำให้เรื่องที่ดูเป็นไปไม่ได้เริ่มมีความเป็นไปได้ขึ้นมาเล็กน้อย",
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
      "เปลี่ยนผิวสัมผัสตามความคิดของผู้ถือ นุ่มนวลดั่งคำอธิษฐานเมื่อเคลือบแคลงสงสัย และแข็งแกร่งดั่งความศรัทธาเมื่อมีความเชื่อมั่น มันสอนว่าเจตจำนงสามารถขึ้นรูปสสารได้",
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
      "เผยร่องรอยของเส้นทางพลังงานที่ไหลผ่านสถานที่ และจะมองเห็นได้เฉพาะเมื่อจงใจค้นหา สถาปนิกมักใช้มันเป็นต้นแบบในการวางตำแหน่งผนังรับน้ำหนัก",
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
      "พื้นผิวถูกจารึกด้วยสัญลักษณ์ที่ขยับเขยื้อนตามฤดูกาล ราวกับกำลังเล่าเรื่องราวโบราณผ่านภาษาของลมฟ้าอากาศ การได้ครอบครองหมายความว่าคุณต้องรับผิดชอบต่อเรื่องเล่านั้น",
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
      "ใบแต่ละใบเขียนเรื่องราวของตนเองในภาษาที่เก่าแก่เกินกว่าความทรงจำของมนุษย์ นักปราชญ์ที่แปลใบไม้ได้เพียงใบเดียวจะได้รับปัญญาที่ไม่มีใครอื่นเข้าใจหรือขอบคุณเลย",
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
      "บานพร้อมลวดลายที่เล่าประวัติศาสตร์ของคนปลูกผ่านทุกเส้นใบและกลีบดอก ว่ากันว่านี่คือชีวประวัติชนิดเดียวที่สามารถอ่านออกได้แต่กลับไม่มีวันทำความเข้าใจได้",
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
      "จารึกด้วยตัวอักษรหนึ่งตัวจากภาษาที่สาบสูญไปเมื่อสามพันปีก่อน หากรวบรวมกลีบทั้งห้าได้ครบ จะสามารถสะกดชื่อของบางสิ่งที่ดับสูญไปเนิ่นนานแล้ว",
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
      "งอกเป็นวงก้นหอยที่สะกดความจริงด้วยไวยากรณ์เก่าแก่กว่าภาษาใดๆ นักทำแผนที่มักใช้มันเพื่อวาดอาณาเขตที่ไม่ปรากฏในแผนที่เล่มใดอีกแล้ว",
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
      "สั่นไหวด้วยความขบขันที่เกือบจะกลั้นไว้ไม่อยู่ สัมผัสมันแล้วคุณจะจำครั้งสุดท้ายที่ความสุขบริสุทธิ์เคยมาเยือนใจได้ มันจะเติบโตในบ้านที่มีคนเพิ่งปาดน้ำตาหยุดร้องไห้",
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
      "ใบของมันสั่นไหวเป็นจังหวะเดียวกับการหัวเราะแม้อากาศจะนิ่งสงบ บ้านที่มีเฟิร์นนี้มักมีเรื่องทะเลาะกันน้อยลง และมีคำขอโทษให้กันมากขึ้นอย่างเห็นได้ชัด",
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
      "บานเป็นรูปทรงดั่งการสรวลเสเฮฮา กลีบแผ่สลับซ้อนราวกับตัวดอกไม้กำลังพบเจอเรื่องขบขันที่บอกใครไม่ได้ การเฝ้าดูมันคลี่ตัวคือการย้ำเตือนว่าความสุขนั้นเคยเป็นไปได้เสมอ",
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
      "รสชาติเหมือนความหมายนัยของมุกตลกที่คนส่วนใหญ่ไม่เข้าใจ การกินมันเข้าไปจะทำให้คุณหัวเราะให้กับเรื่องราวในอดีต และเยียวยามันได้ในที่สุด",
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
      "หนาตัวขึ้นตามที่ที่ผู้คนมาชุมนุมสรวลเสด้วยกัน มอสแต่ละชั้นคือบันทึกของการเฉลิมฉลองแต่ละครั้ง มอสจะหนาที่สุดในจุดที่ความสุขคงอยู่ยาวนานที่สุด",
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
      "หลังใบดำสนิทและหน้าใบสีเงิน มันสั่นไหวเพื่อเฝ้ารอพายุที่ยังไม่ก่อตัว การปลูกมันช่วยสอนให้คนเราถ่อมตนว่าความจริงแล้วเราควบคุมสิ่งต่างๆ ได้น้อยเพียงใด",
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
      "ใบของมันนำกระแสอัสนีเป็นลวดลายซับซ้อนทว่าไม่ไหม้เกรียม สอนให้รู้ว่าพลังงานบางอย่างเราสามารถเต้นรำไปกับมันได้แทนการต่อต้าน ชาวเรือมักเก็บไว้เพื่อเตือนใจว่าพายุย่อมมีวันผ่านไป",
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
      "บานเฉพาะใจกลางพายุ ในเสี้ยวนาทีที่สายฟ้าฟาดใกล้ที่สุดและฟ้าร้องดังที่สุด ผู้ที่เคยเห็นมันบานในช่วงวิกฤตของพายุต่างกล่าวว่าไม่มีดอกไม้ใดงามเกินไปกว่านี้อีกแล้ว",
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
      "รูปทรงคล้ายกำปั้นที่แน่นหนาและแข็งดั่งหิน ทว่ามันจะนุ่มลงเมื่อมือที่ถือคลายแรงกดออก มันสอนให้รู้ว่าการโอนอ่อนผ่อนตามมิใช่สิ่งที่ตรงข้ามกับความเข้มแข็ง",
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
      "งอกงามบนหินในจุดที่เคยมีที่หลบภัยตั้งอยู่ ว่ากันว่าการมีอยู่ของมันจะช่วยปัดเป่าพายุให้ออกห่างจากผู้ที่เปราะบาง มอสนี้เปรียบดั่งคำสวดอธิษฐานในตัวมันเอง",
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
      "ขึ้นเป็นกลุ่มก้อนราวกับปฏิเสธที่จะอยู่อย่างเดี่ยวพรรณ รากของมันหยั่งลึกจนจดจำผืนป่าที่สาบสูญไปแล้วได้ ผู้ที่เลี้ยงมันไว้จะมีความรู้สึกเรื่องเวลาที่ทำให้คนรีบร้อนต้องกระวนกระวาย",
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
      "ใบของมันสร้างเสียงลมพัดผ่านป่าใหญ่แม้อากาศจะนิ่งสงัด สัตว์ป่ามักรู้สึกปลอดภัยเมื่ออยู่ใกล้มัน การฟังเสียงของมันคือการระลึกถึงสันติสุขที่เก่าแก่ที่สุดเท่าที่คุณเคยรู้จัก",
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
      "บานเป็นดอกไม้ขนาดใหญ่ยักษ์จนกล่าวกันว่ามันทอดเงาได้ด้วยตัวเอง การพักผ่อนใต้มันจะช่วยให้รู้ซึ้งถึงความสบายใจยามที่ตัวเราเล็กลงท่ามกลางสถานที่ที่แสนเก่าแก่",
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
      "นุ่มนวลดั่งมอสและหยั่งรากในกาลเวลา มอบความสงบให้กับจิตใจที่ไม่หยุดวางแผน หากพกไว้ในกระเป๋า มันจะเตือนใจว่าบางสิ่งมีอยู่เพื่อปกป้องคุณ ไม่ใช่มีอยู่เพื่อให้คุณใช้ประโยชน์",
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
      "ปูพรมพื้นป่าด้วยอายุขัยของมันเอง และจะเติบโตเฉพาะในที่ที่ต้นไม้เก่าพอจะจำได้ว่าตนเคยเป็นเมล็ดมาก่อน กอมอสที่เก่าแก่ที่สุดกล่าวกันว่าอยู่มานานกว่าความทรงจำของมนุษย์",
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
      "เป็นตัวนำเสียงแทนที่จะสร้างเสียงเอง ใบโพรงเพียงใบเดียวสามารถขยายเสียงกระซิบให้ชัดแจ้งได้ ผู้ที่เข้าใจมันจะรู้ซึ้งว่ารูปทรงของความว่างเปล่านั้นสำคัญเพียงใด",
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
      "ใบของมันโค้งเข้าหาศูนย์กลาง สร้างห้องเล็กๆ ที่ความเงียบงันจะมาบรรจบและจัดระเบียบตัวมันเอง เหล่านักสืบสวนหรือผู้แสวงหาความวิเวกมักใช้มันเพื่อค้นหารูปแบบแห่งความโดดเดี่ยวของตน",
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
      "บานเป็นที่ว่างที่กลวงเปล่าจนเหมือนจะส่งเสียงสะท้อนจากการไร้สุ้มเสียง ดอกไม้ที่สร้างขึ้นจากการยับยั้งชั่งใจ การได้พบมันคือการเข้าใจว่าบางครั้งความงามก็คือ 'สิ่งที่เจ้าเลือกจะไม่ทำ'",
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
      "กลีบที่ส่งเสียงสะท้อนคำพูดสุดท้ายในระยะสิบก้าว ทว่าเสียงนั้นกลับอู้อี้ราวกับมาจากที่ไกลโพ้น มันสอนให้รู้ว่าเราสามารถสร้างระยะห่างได้โดยไม่ต้องก้าวเดินจากไป",
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
      "เติบโตเป็นกอวงกลมที่ว่างเปล่าตรงใจกลาง สร้างเป็นวงแหวนบ่งบอกอาณาเขตของดวงวิญญาณที่พบความสงบแล้ว การก้าวเข้าไปตรงกลางคือการหลุดพ้นจากพันธนาการแห่งกาลเวลาชั่วขณะหนึ่ง",
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
      "เกิดจากสายน้ำไร้ความจำ และสอนศิลปะแห่งการลืมโดยจงใจ ใบเพียงใบเดียวที่หล่นลงสระน้ำจะชำระล้างผิวน้ำให้ราบเรียบ ราวกับลบเลือนเรื่องราวที่เคยถูกบอกเล่ามาทั้งหมด",
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
      "ใบของมันเติบโตในมุมที่ท้าทายเรขาคณิตมาตรฐาน การทำตามตรรกะของมันคือการเรียนรู้วิธีใหม่ในการนำทางผ่านความไม่แน่นอน เฟิร์นนี้รู้วิธีหยั่งรากในขณะที่ยังล่องลอยไปตามน้ำ",
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
      "บานบนพื้นดินที่ไม่แข็งและไม่เหลว ในสีสันที่มีอยู่เฉพาะในช่วงรอยต่อระหว่างวันและพลบค่ำ การเห็นมันบานคือการเข้าใจว่า 'พรมแดน' นั้นเป็นสิ่งชั่วคราวเสมอ",
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
      "หนักเท่าราคาของการตัดสินใจ และจะเบาลงยิ่งคุณถือไว้นานขึ้น ราวกับน้ำหนักของการเลือกคือสิ่งที่วางลงได้ หากมอบให้เป็นของขวัญ มันหมายถึง 'ฉันเชื่อในการตัดสินใจของเจ้า'",
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
      "งอกงามตามแนวตะเข็บระหว่างผืนดินและผิวน้ำ เป็นมอสที่เป็นของทั้งสองและไม่เป็นของใคร บันทึกการเปลี่ยนแปลงของชายฝั่งไว้ในวงชั้น มอสแต่ละชั้นบ่งบอกว่าน้ำเคยสูงถึงเพียงใด",
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
      "เติบโตจากสิ่งเน่าเปื่อยและสร้างความอุดมสมบูรณ์จากซากซากความตาย สอนให้รู้ว่าจุดจบไม่ใช่สิ่งที่ตรงข้ามกับจุดเริ่มต้น ผู้ที่เลี้ยงมันไว้จะเลิกกลัวมุมมืดในสวนของตนเอง",
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
      "ใบของมันสลายสิ่งที่สัมผัสและคืนสู่ผืนดินในชั่วอึดใจ ก่อนจะเติบโตขึ้นใหม่ แสดงให้เห็นว่าการแปรเปลี่ยนและการเกิดใหม่นั้นเกิดขึ้นในจังหวะเวลาเดียวกัน",
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
      "บานเป็นดอกไม้ที่มีกลิ่นอายของทั้งชีวิตและจุดสิ้นสุด กลิ่นที่ไม่เป็นของฤดูกาลใดๆ ของมนุษย์ การได้กลิ่นมันคือการรู้ซึ้งว่าตัวคุณเองก็เป็นส่วนหนึ่งของบางสิ่งที่กว้างใหญ่และหมุนวนตลอดกาล",
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
      "นุ่มและมืดมิด ดูดซับของเหลวที่พบโดยไม่ดูเปียกชื้น หากวางไว้ในใจที่วุ่นวาย มันจะดึงเอาความรู้สึกส่วนเกินออกไปโดยไม่ต้องร้องขอคำอธิบาย",
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
      "งอกงามในพื้นที่รอยต่อระหว่างสิ่งมีชีวิตและการย่อยสลาย มิใช่ราและมิใช่พืช กล่าวกันว่ามันบรรจุปัญญาของสิ่งที่ไม่หลงเหลือตัวตนเดิมแล้ว เป็นมอสที่บ่งชี้ว่าการเปลี่ยนผ่านกำลังดำเนินอยู่",
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
      "ใบไม้ใบสุดท้ายของต้นไม้ที่มอดไหม้ไปเมื่อพันปีก่อน ยังคงอุ่นและสมบูรณ์ มันบรรทุกความทรงจำของผืนป่าที่ปฏิเสธการถูกลบเลือน ผู้ที่ถือครองจะกลายเป็นผู้พิทักษ์แห่งการยืนหยัดนั้น",
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
      "กำเนิดจากเถ้าถ่านและรอดชีวิตจากความสูญสิ้น ใบแต่ละใบคือปาฏิหาริย์ของการคงอยู่ งอกงามเฉพาะในที่ที่บางสิ่งปฏิเสธความตาย และเฟิร์นจะจดจำการยืนหยัดนั้นนานกว่าตัวตนเดิมของมันเสียอีก",
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
      "บานครั้งเดียวในรอบพันปี ในคืนที่มีคนซึ่งสูญเสียทุกสิ่งหยุดวิ่งหนีความจริงในที่สุด ดอกไม้จะบานเพื่อให้คนผู้นั้นได้เห็นว่าความสูญเสียมิใช่บทอวสานของเรื่องราวเสมอไป",
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
      "ดำสนิทดั่งถ่านที่ร้อนจัดและอุ่นดั่งคำอธิษฐานถึงผู้สาบสูญ ผู้ที่สัมผัสมันจะไม่นึกถึงความสูญเสีย ทว่าจะจำเสี้ยววินาทีที่ตัดสินใจได้ว่าความสูญเสียนั้นไม่มีสิทธิ์มานิยามตัวตนของพวกเขา",
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
      "งอกงามเฉพาะบนผืนดินไหม้เกรียมที่อารยธรรมหนึ่งยอมล่มสลายแทนการยอมสยบ มอสจดจำทางเลือกนั้นและพร่ำสอนถึงความกระจ่างแจ้งอันน่าครั่นคร้ามที่มาจากการตัดสินใจเด็ดขาด",
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
      "รวบรวมสีสันทั้งหมดที่เคยมีมา และบางสีที่ยังไม่หาทางมาสู่โลก ผู้ครอบครองจะมองเห็นตัวตนที่แท้จริงของทุกคนที่พบเจอ ทว่าพวกเขามักเลือกที่จะลืมสิ่งที่เห็น—อย่างชาญฉลาด",
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
      "ใบแต่ละใบมีสีต่างกันตามมุมของแสง สอนให้รู้ว่าความจริงเดียวสามารถปรากฏต่างกันไปตามทิศทางที่มอง เฟิร์นรู้อยู่เสมอว่าทุกมุมมองสามารถเป็นความจริงได้ในตัวมันเอง",
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
      "บานเป็นดอกไม้ที่บรรจุแสงสว่างของชั่วขณะนับพันในคราวเดียว แสดงทุกความเป็นไปได้ที่คุณสามารถเป็นได้ ผู้ที่เคยเห็นมันบานเพียงครั้งเดียวจะไม่มีวันเป็นคนเดิมอีกต่อไป",
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
      "แสดงสีต่างกันให้แก่ทุกคนที่มอง และไม่มีใครเห็นพ้องตรงกันในสิ่งที่เห็น มันสอนว่าความจริงที่ทรงพลังที่สุดไม่อาจเอ่ยออกมาเป็นคำพูด ทำได้เพียงแค่เฝ้ามองด้วยตาเท่านั้น",
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
      "งอกงามเฉพาะในจุดที่เคยมีกระจกตั้งอยู่และเคยบันทึกภาพสะท้อนของบุคคลสำคัญ มอสนี้จะดักจับแสงและสะท้อนกลับมา โดยไม่มีมุมใดซ้ำเดิมเป็นครั้งที่สอง",
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
      "สีทองอำพันและอุ่นด้วยความร้อนจากเบื้องลึกของโลก เรืองแสงจางๆ แม้ในความมืดมิดสนิท การถือมันคือการเชื่อมั่นชั่วขณะว่าความสูญเสียทั้งหมดจะหวนกลับมาในรูปแบบที่ดีกว่าเดิม",
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
      "ใบของมันดักจับแสงและส่องไปข้างหน้า ราวกับต้นไม้กำลังพยายามนำทางคุณผ่านความมืดมิด กล่าวกันว่าเฟิร์นจะยิ่งเรืองรองสว่างไสวขึ้นตามความต้องการของผู้ใช้",
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
      "ผลิบานในวินาทีที่ใครบางคนเข้าใจได้ในที่สุดว่าแสงสว่างในตัวเขาไม่เคยจากไปไหน ดอกจะคงอยู่ตราบนานเท่านานที่ความเข้าใจนั้นยังคงอยู่ ซึ่งมักจะนานเกินกว่าที่ใครคาดคิด",
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
      "อุ่นและเรืองแสง การกลืนกินมันจะทำให้คุณรู้ซึ้งถึงคุณค่าที่แท้จริงของตนเองโดยไร้ข้อกังขาเป็นเวลาหนึ่งวัน แม้ความกระจ่างจะจางไปในยามเย็น แต่ความทรงจำที่ว่าครั้งหนึ่งเคยรู้จะคงอยู่ตลอดกาล",
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
      "งอกงามเฉพาะบนหินที่อาบแสงแดดมานานนับหมื่นวัน ว่ากันว่ามันเป็นเครื่องหมายบ่งชี้สถานที่ที่แสงตะวันเลือกที่จะสถิตอยู่ตลอดไป เป็นมอสแห่งการแปรเปลี่ยนผ่านความแน่วแน่",
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
      "ถือกำเนิดในจุดที่ดาวตกจมสู่ก้นบึ้งของมหาสมุทร แตกกิ่งก้านดั่งเขาวงกตแห่งความทรงจำ เติบโตเป็นโครงสร้างที่เก่าแก่กว่าภาษาใดๆ การดูแลมันคือภาระหน้าที่ต่อความต่อเนื่องของยุคสมัยที่คุณไม่มีวันเข้าใจได้ทั้งหมด",
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
      "ใบของมันสมบูรณ์แบบราวกับสลักเสลาโดยช่างฝีมือโบราณ บรรทุกความทรงจำของอารยธรรมที่สร้างอนุสาวรีย์เพื่อบูชาความงาม การดูแลมันคือการเข้าร่วมในพันธสัญญาที่มีมาตั้งแต่ก่อนคุณเกิด",
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
      "ผลิบานในยามที่ 'สิ่งเป็นไปไม่ได้' กลายเป็น 'สิ่งจำเป็น' ตัวดอกพร่ำสอนว่าความเมตตาจะมาถึงเมื่อเราหมดสิ้นทุกหนทางแล้วจริงๆ การได้เห็นมันบานคือการเชื่อมั่นในความรอดพ้น",
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
      "กลีบดอกที่ร่วงหล่นจากดอกไม้ใต้ทะเลลึกเมื่อหมื่นปีก่อน ยังคงเย็นกว่าเหมันต์และแข็งกว่ามุก การถือมันไว้คือการครอบครองชั่วขณะแห่งความสง่างามอันเป็นนิรันดร์",
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
      "งอกงามเฉพาะในส่วนลึกที่สุดของมหาสมุทรที่แสงตะวันไปไม่ถึง เรืองรองด้วยแสงที่ไม่เป็นของดาวดวงใด การพบกอมอสนี้นับว่าเป็นการค้นพบความลับที่โลกยังไม่รู้เสียด้วยซ้ำว่าตนเองซ่อนไว้",
    collection: SpeciesCollection.Original,
  },
];

export default series;
