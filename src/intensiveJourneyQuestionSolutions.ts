export type IntensiveQuestionSolution = {
  passageKeyword: string
  questionKeyword: string
  thaiMeaning: string
}

/** Local question numbers 1–13 (before journey remap). Stages 6–10. */
import { INTENSIVE_SOLUTIONS_STAGE_11_15 } from './intensiveJourneyQuestionSolutions11to15.ts'

const mergeStageSolutions = (
  base: Record<number, Record<1 | 2, Record<number, IntensiveQuestionSolution>>>,
  extra: Record<number, Record<1 | 2, Record<number, IntensiveQuestionSolution>>>
) => {
  const merged = { ...base }
  for (const [stageKey, slots] of Object.entries(extra)) {
    const stage = Number(stageKey)
    merged[stage] = {
      ...(merged[stage] || {}),
      1: { ...(merged[stage]?.[1] || {}), ...(slots[1] || {}) },
      2: { ...(merged[stage]?.[2] || {}), ...(slots[2] || {}) }
    }
  }
  return merged
}

const INTENSIVE_SOLUTIONS_BASE: Record<
  number,
  Record<1 | 2, Record<number, IntensiveQuestionSolution>>
> = {
  6: {
    1: {
      1: { passageKeyword: 'tectonic plate boundaries', questionKeyword: 'where tectonic plates meet', thaiMeaning: 'แผ่นเปลือกโลก' },
      2: { passageKeyword: 'lower global temperatures', questionKeyword: 'reduce worldwide temperatures', thaiMeaning: 'อุณหภูมิโลก' },
      3: { passageKeyword: 'exceptionally fertile soils', questionKeyword: 'highly productive farmland', thaiMeaning: 'ดินบนภูเขาไฟ' },
      4: { passageKeyword: 'impending eruption', questionKeyword: 'upcoming volcanic outburst', thaiMeaning: 'การปะทุ' },
      5: { passageKeyword: 'Explosive eruptions', questionKeyword: 'violent explosive events', thaiMeaning: 'การระเบิด / ปะทุรุนแรง' },
      6: { passageKeyword: 'majority of the world\'s active volcanoes', questionKeyword: 'most of the world\'s dormant volcanoes', thaiMeaning: 'ภูเขาไฟที่ยัง active' },
      7: { passageKeyword: 'fluid lava that flows steadily', questionKeyword: 'fluid lava that flows steadily', thaiMeaning: 'ลาวาไหล' },
      8: { passageKeyword: 'contributed to the infamous year without a summer', questionKeyword: 'caused permanent cooling of the entire planet', thaiMeaning: 'ปีที่ไม่มีฤดูร้อน' },
      9: { passageKeyword: 'providing renewable electricity', questionKeyword: 'provide renewable electricity', thaiMeaning: 'ไฟฟ้าพลังงานความร้อนใต้พิภพ' },
      10: { passageKeyword: 'Contrasting eruption styles', questionKeyword: 'Paragraph B', thaiMeaning: 'รูปแบบการปะทุที่ต่างกัน' },
      11: { passageKeyword: 'Volcanic ash poses serious hazards', questionKeyword: 'Paragraph C', thaiMeaning: 'อันตรายจากเถ้าภูเขาไฟ' },
      12: { passageKeyword: 'ecological and economic benefits', questionKeyword: 'Paragraph D', thaiMeaning: 'ประโยชน์ทางเศรษฐกิจและนิเวศ' },
      13: { passageKeyword: 'International agencies also share', questionKeyword: 'Paragraph F', thaiMeaning: 'ความร่วมมือระหว่างประเทศ' }
    },
    2: {
      1: { passageKeyword: 'religious festival honoring Zeus', questionKeyword: 'celebration dedicated to Zeus', thaiMeaning: 'เทพซีอุส' },
      2: { passageKeyword: 'nearly rule-free combat sport', questionKeyword: 'almost unrestricted fighting', thaiMeaning: 'การต่อสู้' },
      3: { passageKeyword: 'crowned with olive wreaths', questionKeyword: 'crowns made from olive', thaiMeaning: 'มะกอก' },
      4: { passageKeyword: 'pan-Hellenic meeting place', questionKeyword: 'shared Greek gathering point', thaiMeaning: 'สถานที่พบปะ' },
      5: { passageKeyword: 'rediscovered the site in the nineteenth century', questionKeyword: 'rediscovered during the nineteenth century', thaiMeaning: 'ศตวรรษที่ 19' },
      6: { passageKeyword: 'held every four years', questionKeyword: 'held every four years seamlessly', thaiMeaning: 'ทุกสี่ปี' },
      7: { passageKeyword: 'only freeborn Greek men were permitted', questionKeyword: 'female athletes from Sparta regularly competed', thaiMeaning: 'เฉพาะชายชาวกรีก' },
      8: { passageKeyword: 'received no gold medals', questionKeyword: 'received large cash prizes', thaiMeaning: 'ไม่มีเหรียญทอง' },
      9: { passageKeyword: 'archaeologists rediscovered the site', questionKeyword: 'archaeologists rediscovered', thaiMeaning: 'นักโบราณคดี' },
      10: { passageKeyword: 'Beginning in 776 BCE', questionKeyword: 'Paragraph A', thaiMeaning: 'จุดเริ่มต้นของเทศกาล' },
      11: { passageKeyword: 'expanded to include wrestling', questionKeyword: 'Paragraph B', thaiMeaning: 'การแข่งขันที่หลากหลาย' },
      12: { passageKeyword: 'functioned as a pan-Hellenic meeting place', questionKeyword: 'Paragraph D', thaiMeaning: 'ศูนย์กลางการเมืองและการค้า' },
      13: { passageKeyword: 'revived in 1896', questionKeyword: 'Paragraph F', thaiMeaning: 'การฟื้นฟูโอลิมปิกสมัยใหม่' }
    }
  },
  7: {
    1: {
      1: { passageKeyword: 'immune to smallpox', questionKeyword: 'protected against smallpox', thaiMeaning: 'ฝีดาท' },
      2: { passageKeyword: 'Latin word for cow', questionKeyword: 'Latin name for cow', thaiMeaning: 'วัว' },
      3: { passageKeyword: 'vaccines against rabies and anthrax', questionKeyword: 'immunizations for rabies and anthrax', thaiMeaning: 'แอนแทรกซ์' },
      4: { passageKeyword: 'lose herd immunity', questionKeyword: 'weaken herd immunity', thaiMeaning: 'ภูมิคุ้มกันของประชากร' },
      5: { passageKeyword: 'messenger RNA platforms', questionKeyword: 'messenger RNA technology', thaiMeaning: 'อาร์เอ็นเอ' },
      6: { passageKeyword: 'unethical by modern standards', questionKeyword: 'meet current ethical guidelines', thaiMeaning: 'มาตรฐานจริยธรรม' },
      7: { passageKeyword: 'many doctors distrusted the procedure', questionKeyword: 'many doctors were initially skeptical', thaiMeaning: 'ความไม่ไว้วางใจ' },
      8: { passageKeyword: 'weakened microbes', questionKeyword: 'using only synthetic chemicals', thaiMeaning: 'เชื้อจุลชีพที่อ่อนแอลง' },
      9: { passageKeyword: 'equitable distribution', questionKeyword: 'fair access in poorer countries', thaiMeaning: 'การแบ่งปันที่เป็นธรรม' },
      10: { passageKeyword: 'milkmaids who contracted cowpox', questionKeyword: 'Paragraph A', thaiMeaning: 'การสังเกตของเจนเนอร์' },
      11: { passageKeyword: 'extended the concept to other illnesses', questionKeyword: 'Paragraph D', thaiMeaning: 'การขยายไปยังโรคอื่น' },
      12: { passageKeyword: 'vaccine hesitancy has resurfaced', questionKeyword: 'Paragraph E', thaiMeaning: 'ความลังเลในการฉีดวัคซีน' },
      13: { passageKeyword: 'Researchers continue developing', questionKeyword: 'Paragraph F', thaiMeaning: 'นวัตกรรมวัคซีนใหม่' }
    },
    2: {
      1: { passageKeyword: 'modified wine press', questionKeyword: 'adapted wine press', thaiMeaning: 'เครื่องพิมพ์' },
      2: { passageKeyword: 'new wooden block for every page', questionKeyword: 'separate wooden block per page', thaiMeaning: 'แผ่นไม้แกะสลัก' },
      3: { passageKeyword: 'Literacy rates climbed', questionKeyword: 'reading ability increased', thaiMeaning: 'อัตรารู้หนังสือ' },
      4: { passageKeyword: 'fueling the Protestant Reformation', questionKeyword: 'sparked the Protestant Reformation', thaiMeaning: 'การปฏิรูปศาสนาโปรเตสแตนต์' },
      5: { passageKeyword: 'compare to the modern internet', questionKeyword: 'compared to the modern internet', thaiMeaning: 'อินเทอร์เน็ต' },
      6: { passageKeyword: 'Latin Bible', questionKeyword: 'Hebrew rather than Latin', thaiMeaning: 'พระคัมภีร์ภาษาละติน' },
      7: { passageKeyword: 'letters could be rearranged', questionKeyword: 'letters could be reused', thaiMeaning: 'ตัวอักษรเคลื่อนย้ายได้' },
      8: { passageKeyword: 'craftsman from Mainz', questionKeyword: 'first city was Venice', thaiMeaning: 'เมนทซ์' },
      9: { passageKeyword: 'censored presses', questionKeyword: 'attempted to censor', thaiMeaning: 'การเซ็นเซอร์' },
      10: { passageKeyword: 'adjustable letter blocks', questionKeyword: 'Paragraph A', thaiMeaning: 'องค์ประกอบของเทคนิคกูเทนเบิร์ก' },
      11: { passageKeyword: 'spread along trade routes', questionKeyword: 'Paragraph C', thaiMeaning: 'การแพร่กระจายในยุโรป' },
      12: { passageKeyword: 'intensified political and religious conflict', questionKeyword: 'Paragraph D', thaiMeaning: 'ผลทางการเมือง' },
      13: { passageKeyword: 'Standardized typefaces', questionKeyword: 'Paragraph E', thaiMeaning: 'ผลต่อภาษาและความรู้' }
    }
  },
  8: {
    1: {
      1: { passageKeyword: 'After unifying China', questionKeyword: 'after conquering China', thaiMeaning: 'จีน' },
      2: { passageKeyword: 'reinforced walls with brick', questionKeyword: 'strengthened with brick', thaiMeaning: 'อิฐ' },
      3: { passageKeyword: 'regulated trade along the Silk Road', questionKeyword: 'controlled Silk Road trade', thaiMeaning: 'เส้นทางสายไหม' },
      4: { passageKeyword: 'died from exhaustion or harsh winters', questionKeyword: 'died from exhaustion or severe winters', thaiMeaning: 'ฤดูหนาว' },
      5: { passageKeyword: 'designated several sites', questionKeyword: 'listed several sites', thaiMeaning: 'แห่งมรดกโลก' },
      6: { passageKeyword: 'not a single continuous structure', questionKeyword: 'built all at once during the Ming', thaiMeaning: 'ไม่ใช่สิ่งก่อสร้างเส้นเดียว' },
      7: { passageKeyword: 'signal approaching armies', questionKeyword: 'communicate using smoke or fire', thaiMeaning: 'สัญญาณควัน/ไฟ' },
      8: { passageKeyword: 'limited evidence supporting the myth', questionKeyword: 'confirmed thousands were buried', thaiMeaning: 'หลักฐานจำกัด' },
      9: { passageKeyword: 'appear as low earthen ridges', questionKeyword: 'appear as low earthen ridges', thaiMeaning: 'สันเนินดิน' },
      10: { passageKeyword: 'Ming engineers reinforced', questionKeyword: 'Paragraph B', thaiMeaning: 'การสร้างสมัยหมิง' },
      11: { passageKeyword: 'regulated trade along the Silk Road', questionKeyword: 'Paragraph C', thaiMeaning: 'บทบาททางเศรษฐกิจ' },
      12: { passageKeyword: 'Construction imposed enormous human costs', questionKeyword: 'Paragraph D', thaiMeaning: 'ค่าใช้จ่ายด้านแรงงาน' },
      13: { passageKeyword: 'symbolizes national unity', questionKeyword: 'Paragraph F', thaiMeaning: 'ความหมายทางวัฒนธรรมวันนี้' }
    },
    2: {
      1: { passageKeyword: 'communities in New Orleans', questionKeyword: 'originated in New Orleans', thaiMeaning: 'นิวออร์ลีนส์' },
      2: { passageKeyword: 'syncopated melodies', questionKeyword: 'strongly rhythmic melodies', thaiMeaning: 'ทำนอง' },
      3: { passageKeyword: 'moved to Chicago, Detroit, and New York', questionKeyword: 'spread to northern cities', thaiMeaning: 'เมืองทางเหนือ' },
      4: { passageKeyword: 'arranged sections for saxophones, trumpets', questionKeyword: 'arranged trumpet sections', thaiMeaning: 'ทรัมเป็ต' },
      5: { passageKeyword: 'intricate chord changes', questionKeyword: 'complex chord changes', thaiMeaning: 'การเปลี่ยนคอร์ด' },
      6: { passageKeyword: 'Blending African rhythms', questionKeyword: 'combined African rhythms', thaiMeaning: 'จังหวะแอฟริกัน' },
      7: { passageKeyword: 'Ragtime piano music', questionKeyword: 'primarily known as trumpet soloist', thaiMeaning: 'แร็กไทม์' },
      8: { passageKeyword: 'transformed jazz into an international art form', questionKeyword: 'performed only in New Orleans', thaiMeaning: 'ศิลปะสากล' },
      9: { passageKeyword: 'intangible cultural heritage', questionKeyword: 'acknowledges jazz as heritage', thaiMeaning: 'มรดกทางวัฒนธรรม' },
      10: { passageKeyword: 'musical traditions of African American', questionKeyword: 'Paragraph A', thaiMeaning: 'รากฐานในนิวออร์ลีนส์' },
      11: { passageKeyword: 'carried jazz northward', questionKeyword: 'Paragraph C', thaiMeaning: 'การอพยพสู่เหนือ' },
      12: { passageKeyword: 'pursued greater complexity through bebop', questionKeyword: 'Paragraph E', thaiMeaning: 'ยุค bebop' },
      13: { passageKeyword: 'preserve the tradition', questionKeyword: 'Paragraph F', thaiMeaning: 'การอนุรักษ์วันนี้' }
    }
  },
  9: {
    1: {
      1: { passageKeyword: 'animals called polyps', questionKeyword: 'tiny polyps deposit skeletons', thaiMeaning: 'พอลิป' },
      2: { passageKeyword: 'energy through photosynthesis', questionKeyword: 'power via photosynthesis', thaiMeaning: 'การสังเคราะห์แสง' },
      3: { passageKeyword: 'protecting coastal communities from storm surges', questionKeyword: 'shield coasts from storm surges', thaiMeaning: 'คลื่นพายุ' },
      4: { passageKeyword: 'trigger coral bleaching', questionKeyword: 'cause coral bleaching', thaiMeaning: 'ปะการังฟอกขาว' },
      5: { passageKeyword: 'transplant survivors onto damaged sites', questionKeyword: 'replant onto damaged reefs', thaiMeaning: 'การปลูกถ่าย' },
      6: { passageKeyword: 'less than one percent of the ocean floor', questionKeyword: 'more than ten percent', thaiMeaning: 'พื้นที่ปะการัง' },
      7: { passageKeyword: 'expel their algae partners', questionKeyword: 'lose symbiotic algae', thaiMeaning: 'สาหร่ายที่อยู่ร่วม' },
      8: { passageKeyword: 'Marine protected areas restrict fishing', questionKeyword: 'eliminated blast fishing worldwide', thaiMeaning: 'พื้นที่คุ้มครอง' },
      9: { passageKeyword: 'report data through smartphone apps', questionKeyword: 'use smartphone apps', thaiMeaning: 'แอปมือถือ' },
      10: { passageKeyword: 'polyps secrete calcium carbonate', questionKeyword: 'Paragraph A', thaiMeaning: 'การก่อตัวของแนวปะการัง' },
      11: { passageKeyword: 'Today reefs face multiple stresses', questionKeyword: 'Paragraph C', thaiMeaning: 'ภัยคุกคามหลายประการ' },
      12: { passageKeyword: 'cultivate coral fragments', questionKeyword: 'Paragraph D', thaiMeaning: 'การฟื้นฟู' },
      13: { passageKeyword: 'Public education campaigns', questionKeyword: 'Paragraph F', thaiMeaning: 'การรณรงค์สาธารณะ' }
    },
    2: {
      1: { passageKeyword: 'transported from Wales', questionKeyword: 'brought from Wales', thaiMeaning: 'เวลส์' },
      2: { passageKeyword: 'wooden sledges, ropes', questionKeyword: 'sledges and ropes', thaiMeaning: 'เชือก' },
      3: { passageKeyword: 'heel stone avenue', questionKeyword: 'heel stone alignment', thaiMeaning: 'หิน heel' },
      4: { passageKeyword: 'Pig bones suggest communal barbecues', questionKeyword: 'feasting on pigs', thaiMeaning: 'หมู' },
      5: { passageKeyword: 'timber circles', questionKeyword: 'wooden circles', thaiMeaning: 'วงไม้' },
      6: { passageKeyword: 'Construction occurred in several phases', questionKeyword: 'completed in a single year by Romans', thaiMeaning: 'หลายยุคสมัย' },
      7: { passageKeyword: 'move multi-ton blocks', questionKeyword: 'transport very heavy stones', thaiMeaning: 'ย้ายหินขนาดใหญ่' },
      8: { passageKeyword: 'rising sun aligns with the heel stone', questionKeyword: 'summer solstice alignment', thaiMeaning: 'ทิวทัศน์วันครีษมายัน' },
      9: { passageKeyword: 'controlled visitor access', questionKeyword: 'unlimited public access to touch', thaiMeaning: 'การควบคุมนักท่องเที่ยว' },
      10: { passageKeyword: 'wooden sledges, ropes', questionKeyword: 'Paragraph B', thaiMeaning: 'วิธีขนย้ายหิน' },
      11: { passageKeyword: 'summer solstice', questionKeyword: 'Paragraph C', thaiMeaning: 'ปฏิทินทางดาราศาสตร์' },
      12: { passageKeyword: 'Durrington Walls reveal feasting', questionKeyword: 'Paragraph E', thaiMeaning: 'หลักฐานงานเลี้ยง' },
      13: { passageKeyword: 'Ground-penetrating radar', questionKeyword: 'Paragraph F', thaiMeaning: 'การสำรวจสมัยใหม่' }
    }
  },
  10: {
    1: {
      1: { passageKeyword: 'Sputnik in 1957', questionKeyword: 'satellite launched in 1957', thaiMeaning: 'ปี 1957' },
      2: { passageKeyword: 'culminated in 1969', questionKeyword: 'Moon landing in 1969', thaiMeaning: 'ปี 1969' },
      3: { passageKeyword: 'human bone loss', questionKeyword: 'loss of bone mass', thaiMeaning: 'กระดูก' },
      4: { passageKeyword: 'ancient microbial life', questionKeyword: 'signs of microbial life', thaiMeaning: 'สิ่งมีชีวิตจุลภาค' },
      5: { passageKeyword: 'Reusable boosters lower costs', questionKeyword: 'reusable rockets cut costs', thaiMeaning: 'ต้นทุน' },
      6: { passageKeyword: '1961 orbital flight', questionKeyword: 'first human journey in 1961', thaiMeaning: 'การบินรอบโลก' },
      7: { passageKeyword: 'Six subsequent missions', questionKeyword: 'visited the Moon only once', thaiMeaning: 'ภารกิจหลายครั้ง' },
      8: { passageKeyword: 'James Webb observe distant galaxies', questionKeyword: 'orbits Mars to photograph', thaiMeaning: 'กล้องโทรทรรศน์' },
      9: { passageKeyword: 'ferry astronauts to orbit', questionKeyword: 'carry astronauts to orbit', thaiMeaning: 'บริษัทเอกชน' },
      10: { passageKeyword: 'Cold War competition', questionKeyword: 'Paragraph A', thaiMeaning: 'จุดเริ่มยุคอวกาศ' },
      11: { passageKeyword: 'walked on the Moon', questionKeyword: 'Paragraph B', thaiMeaning: 'โปรแกรม Apollo' },
      12: { passageKeyword: 'Robotic probes have explored', questionKeyword: 'Paragraph D', thaiMeaning: 'ยานไร้คนขับ' },
      13: { passageKeyword: 'Private companies now launch', questionKeyword: 'Paragraph E', thaiMeaning: 'ภาคเอกชน' }
    },
    2: {
      1: { passageKeyword: 'connect university computers', questionKeyword: 'link university computers', thaiMeaning: 'มหาวิทยาลัย' },
      2: { passageKeyword: 'breaks messages into small chunks', questionKeyword: 'splits data into chunks', thaiMeaning: 'ชิ้นส่วนข้อมูล' },
      3: { passageKeyword: 'invented the World Wide Web in 1989 at CERN', questionKeyword: 'created the web at CERN', thaiMeaning: 'CERN' },
      4: { passageKeyword: 'funded through targeted advertising', questionKeyword: 'earn money from advertising', thaiMeaning: 'โฆษณา' },
      5: { passageKeyword: 'Digital divides persist', questionKeyword: 'digital divide', thaiMeaning: 'ช่องว่างดิจิทัล' },
      6: { passageKeyword: 'kept communication functioning', questionKeyword: 'maintain communication after damage', thaiMeaning: 'การสื่อสารทนทาน' },
      7: { passageKeyword: 'Email became an essential tool', questionKeyword: 'email appeared only after the web', thaiMeaning: 'อีเมล' },
      8: { passageKeyword: 'invented the World Wide Web in 1989 at CERN', questionKeyword: 'developed at a physics laboratory', thaiMeaning: 'ห้องปฏิบัติการฟิสิกส์' },
      9: { passageKeyword: 'Governments debate how to regulate', questionKeyword: 'single global law banning misinformation', thaiMeaning: 'การกำกับดูแล' },
      10: { passageKeyword: 'packet switching', questionKeyword: 'Paragraph A', thaiMeaning: 'ต้นกำเนิด ARPANET' },
      11: { passageKeyword: 'World Wide Web in 1989', questionKeyword: 'Paragraph C', thaiMeaning: 'การเกิดเว็บ' },
      12: { passageKeyword: 'Broadband connections', questionKeyword: 'Paragraph D', thaiMeaning: 'ยุคบรอดแบนด์' },
      13: { passageKeyword: 'privacy, cybercrime, and misinformation', questionKeyword: 'Paragraph E', thaiMeaning: 'ความเสี่ยงทางสังคม' }
    }
  }
}

export const INTENSIVE_SOLUTIONS_BY_STAGE = mergeStageSolutions(
  INTENSIVE_SOLUTIONS_BASE,
  INTENSIVE_SOLUTIONS_STAGE_11_15
)

export const applyIntensiveQuestionSolutions = (
  passage: { questions: Array<{ number: number; paraphrasedVocabulary: string; explanationThai: string }> },
  solutions: Record<number, IntensiveQuestionSolution> | undefined
) => {
  if (!solutions) return
  for (const question of passage.questions) {
    const solution = solutions[question.number]
    if (!solution) continue
    question.paraphrasedVocabulary = `${solution.passageKeyword} = ${solution.questionKeyword}`
    question.explanationThai = `${solution.passageKeyword} = ${solution.questionKeyword} = ${solution.thaiMeaning}`
  }
}
