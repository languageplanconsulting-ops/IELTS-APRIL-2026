/**
 * Upgrades Short Thai Explanation + Paraphrased Vocabulary for Jan 2026 Passage 3 imports
 * to match the established logic used in delayed-adulthood / manatee explanations:
 * - question phrase → passage evidence mapping
 * - common trap / wrong paragraph or wrong option rejection where useful
 * - ONE WORD ONLY grammar lock for summary blanks
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const importsDir = path.resolve(__dirname, '../cambridge-reading-imports')

const patchAnswerKey = (rawAnswerKey, patches) => {
  let result = rawAnswerKey
  for (const [num, { shortThai, paraphrased, exactPortion }] of Object.entries(patches)) {
    const blockRe = new RegExp(
      `(Question ${num}:[\\s\\S]*?Short Thai Explanation:\\s*)([\\s\\S]*?)(\\n\\nParaphrased Vocabulary:\\s*)([\\s\\S]*?)(\\n\\nQuestion |$)`,
      'i'
    )
    if (!blockRe.test(result)) {
      throw new Error(`Could not find Question ${num} block`)
    }
    result = result.replace(blockRe, (_, before, _oldThai, mid, _oldPara, after) => {
      let block = `${before}${shortThai}${mid}${paraphrased}\n\n`
      if (exactPortion) {
        const exactRe = /Exact Portion:\s*[\s\S]*?(?=\n\nShort Thai Explanation:)/i
        block = block.replace(exactRe, () => '') // noop - fix below
      }
      return `${before}${shortThai}${mid}${paraphrased}\n\n${after}`
    })
    if (exactPortion) {
      const exactRe = new RegExp(
        `(Question ${num}:[\\s\\S]*?Exact Portion:\\s*)([\\s\\S]*?)(\\n\\nShort Thai Explanation:)`,
        'i'
      )
      result = result.replace(exactRe, `$1${exactPortion}$3`)
    }
  }
  return result
}

const FILES = {
  'ielts-academic-reading-jan-2026-passage-3-productive-power-of-boredom.json': {
    27: {
      exactPortion:
        'When external stimulation drops, the brain activates the Default Mode Network (DMN)*. "When the DMN turns on, the brain\'s energy consumption barely drops," Tanaka notes.',
      shortThai:
        'คำตอบคือ E เพราะย่อหน้า E อธิบายชัดว่าเมื่อ external stimulation ลดลง สมองจะ activate Default Mode Network (DMN) ซึ่งเป็น neural system ที่ทำงานเมื่อจิตใจว่าง โจทย์ใช้คำว่า "specific neural system" และ "mind is unoccupied" ซึ่งตรงกับ DMN ไม่ใช่ย่อหน้า B ที่พูด hippocampus ของ Spiers หรือย่อหน้า D ที่พูด smartphone ไม่เกี่ยวกับระบบประสาทเมื่อว่าง',
      paraphrased:
        'specific neural system = Default Mode Network (DMN); mind is unoccupied = external stimulation drops; activates = the brain activates'
    },
    28: {
      shortThai:
        'คำตอบคือ F เพราะย่อหน้า F อธิบายว่าคนที่มี boredom proneness สูงมัก engage in hazardous habits เช่น gambling, substance abuse และ reckless driving เพื่อหนีความเบื่อที่ทนไม่ได้ โจทย์พูดถึง "avoiding the feeling of boredom" ที่นำไปสู่ dangerous activities ซึ่ง paraphrase จากการหลีกเลี่ยง boredom ด้วย adrenaline spikes อันตราย ไม่ใช่ย่อหน้า D ที่พูดแค่กด boredom ด้วย smartphone',
      paraphrased:
        'avoiding boredom → dangerous activities = require massive, often dangerous, spikes of adrenaline to escape; hazardous habits = compulsive gambling / substance abuse / reckless driving'
    },
    29: {
      shortThai:
        'คำตอบคือ C เพราะย่อหน้า C บรรยาย experiment ของ Dr. Sandi Mann ที่ให้กลุ่มหนึ่ง copy numbers from a phone book ก่อนทำ creative task และพบว่ากลุ่มนี้ให้ innovative uses มากกว่า โจทย์ถาม "experiment" และ "tedious activities enhance innovative thinking" ตรงกับ empirical study ในย่อหน้า C ไม่ใช่ย่อหน้า C ของ passage อื่น—ที่นี่คือ Mann ใน C เท่านั้น',
      paraphrased:
        'experiment = empirical study; tedious activities = copying numbers out of a phone book; enhance innovative thinking = far more innovative and divergent uses'
    },
    30: {
      shortThai:
        'คำตอบคือ D เพราะย่อหน้า D เปรียบเทียบการใช้ smartphone กับการได้ temporary relief จาก boredom alarm ผ่าน dopamine hit แต่ short-circuits biological mechanism ที่ควรผลักดัน meaningful action โจทย์ใช้คำว่า "digital devices" และ "temporary relief from an evolutionary drive" ซึ่งตรงกับ localized dopamine hit และ biological mechanism ในย่อหน้า D',
      paraphrased:
        'digital devices = smartphones; temporary relief = temporarily turns off the boredom alarm; evolutionary drive = biological mechanism'
    },
    31: {
      exactPortion:
        'According to Vartanian, if early humans had been perfectly content staring at the walls of a cave day after day, they would never have felt the psychological friction required to explore new territories, invent new tools, or forge new social structures. Survival relied heavily on dissatisfaction with the routine.',
      shortThai:
        'คำตอบคือ B เพราะย่อหน้า B กล่าวถึง early humans ที่ต้องมี psychological friction เพื่อ explore และสรุปว่า Survival relied heavily on dissatisfaction with the routine โจทย์ถาม early human survival ที่พึ่ง dissatisfaction with routine ตรงประโยคท้ายย่อหน้า B ไม่ใช่ย่อหน้า A ที่เป็นแค่ introduction เรื่อง GPS/outsourcing',
      paraphrased:
        'early human survival = Survival; dissatisfaction with routine = dissatisfaction with the routine; relied on = relied heavily on'
    },
    32: {
      shortThai:
        'คำตอบคือ A เพราะโจทย์พูดถึงคนที่ struggle with boredom มากที่สุด (boredom proneness) ที่ engage in hazardous habits ซึ่ง Vartanian เป็นผู้ชี้ประเด็นนี้ในย่อหน้า F ไม่ใช่ Mann (creative task) หรือ Tanaka (DMN)',
      paraphrased:
        'struggle with boredom = boredom proneness; hazardous behaviors = hazardous habits; researcher = Vartanian is quick to point out'
    },
    33: {
      shortThai:
        'คำตอบคือ B เพราะโจทย์พูด dull activity → original problem-solving ซึ่งตรงกับ Dr. Sandi Mann ที่วัด relationship between tedious activities and original thinking ผ่าน phone book experiment ไม่ใช่ Vartanian (pain alarm) หรือ Tanaka (MRI/DMN)',
      paraphrased:
        'dull activity = tedious activities; original problem-solving = original thinking / creative uses; researcher = Dr. Sandi Mann'
    },
    34: {
      shortThai:
        'คำตอบคือ C เพราะโจทย์พูด bored mind ไม่ inactive แต่เตรียม future scenarios ซึ่งตรงกับ Dr. Hiroshi Tanaka ที่บอก bored brain is not a resting brain และ busily imagining future scenarios ไม่ใช่ Spiers (cognitive map) หรือ Mann',
      paraphrased:
        'bored mind = bored brain; preparing for future scenarios = imagining future scenarios; not inactive = not a resting brain; researcher = Tanaka'
    },
    35: {
      shortThai:
        'คำตอบคือ A เพราะโจทย์พูด discomfort of boredom เป็น biological prompt ให้ seek new experiences ซึ่งตรงกับ Julian Vartanian ที่เปรียบ boredom เป็น emotional alarm bell และ explore new territories ไม่ใช่ Mann หรือ Tanaka',
      paraphrased:
        'discomfort of boredom = emotional alarm bell / psychological equivalent of physical pain; biological prompt = necessary to force you to move; seek new experiences = explore new territories'
    },
    36: {
      shortThai:
        'คำตอบคือ smartphones เพราะ summary ถามว่าคน reach for อะไรเมื่อ boredom โดย passage ระบุ pull out their smartphones คำเดียวที่ตรง blank และเป็น ONE WORD ONLY จากบทความ ไม่ใช่ pockets หรือ screens',
      paraphrased:
        'reach for = pull out their; escape uncomfortable feeling = at the first twinge of an unoccupied mind; ONE WORD = smartphones'
    },
    37: {
      shortThai:
        'คำตอบคือ symptom เพราะ summary ใช้ addresses the ___ of the issue ซึ่ง paraphrase ตรงจาก treating the symptom rather than addressing the cause คำอื่นเช่น cause หรือ problem ไม่ใช่คำเดียวที่ passage วางไว้ในประโยคนี้',
      paraphrased:
        'addresses = treating; of the issue = rather than addressing the cause; ONE WORD = symptom'
    },
    38: {
      shortThai:
        'คำตอบคือ network เพราะ summary ถาม neural ___ ซึ่งมาจาก Default Mode Network (DMN) ใน passage ต้องตอบ network เท่านั้น ไม่ใช่ mode หรือ DMN เพราะโจทย์กำหนด ONE WORD ONLY',
      paraphrased:
        'neural ___ = Default Mode Network (DMN); turning on = activates; ONE WORD = network'
    },
    39: {
      shortThai:
        'คำตอบคือ reflection เพราะ summary ถาม innate capacity for true ___ ซึ่ง paraphrase จาก deep reflection and long-term planning ในย่อหน้า E คำว่า imagination ในย่อหน้า G ไม่ตรง blank นี้เพราะ summary โฟกัสการ interrupt DMN ไม่ใช่ข้อสรุปท้ายบท',
      paraphrased:
        'true ___ = deep reflection; innate capacity = crucial downtime; destroying = deprive their brains of; ONE WORD = reflection'
    },
    40: {
      shortThai:
        'คำตอบคือ A เพราะทั้งบทความโต้แย้งมุมมองเชิงลบต่อ boredom และสรุปว่าควร tolerate productive discomfort แทนการ suppress ทันที ตัวเลือก B จำกัดแค่ teenagers ที่ passage ไม่ได้กล่าว ตัวเลือก C พูดเรื่อง intelligence ที่ไม่มีหลักฐาน ตัวเลือก D พูด hunter-gatherer lifestyle ที่ไม่มีในบทความ',
      paraphrased:
        'main purpose = essential biological catalyst / embrace boredom; A = argue boredom should be embraced; B/C/D = not supported by passage'
    }
  },
  'ielts-academic-reading-jan-2026-passage-3-urban-evolution.json': {
    27: {
      shortThai:
        'คำตอบคือ C เพราะย่อหน้า C อธิบาย Urban Heat Island และ heat-absorbing building materials ที่ทำให้เมืองร้อนกว่าชนบท โจทย์ถาม concentrated human activity + building materials → alter temperatures ตรงกับ microclimates จาก human activity ในย่อหน้า C ไม่ใช่ย่อหน้า A ที่เป็น overview',
      paraphrased:
        'building materials = heat-absorbing building materials; alter local temperatures = significantly warmer than surrounding rural areas'
    },
    28: {
      shortThai:
        'คำตอบคือ D เพราะย่อหน้า D Tanaka เตือนว่า genetic variation ลดลงทำให้ urban creatures vulnerable เมื่อ environment changes abruptly โจทย์ถาม long-term vulnerability ของ highly specialized city-dwelling creatures ตรงกับย่อหน้า D ไม่ใช่ย่อหน้า C ที่เน้นแค่ adaptation สำเร็จ',
      paraphrased:
        'long-term vulnerability = incredibly vulnerable / no longer have the genetic tools; highly specialized = highly specialized to a man-made environment'
    },
    29: {
      shortThai:
        'คำตอบคือ F เพราะย่อหน้า F ระบุว่า conservation efforts historically focused almost exclusively on preserving pristine, untouched wilderness ก่อนเสนอ reconciliation ecology โจทย์ถาม traditional protection ที่เน้น untouched wilderness มากเกินไป ตรงย่อหน้า F',
      paraphrased:
        'traditional environmental protection = conservation efforts historically; untouched wilderness = pristine, untouched wilderness'
    },
    30: {
      shortThai:
        'คำตอบคือ E เพราะย่อหน้า E เปรียบ behavioral change (altered pitch) กับ permanent genetic mutation (cortisol) ของ Clark โจทย์ถาม contrast ระหว่าง behavioral modification กับ internal body chemistry ตรงย่อหน้า E ไม่ใช่ย่อหน้า B ที่เป็นแค่ anatomy ของกิ้งก่า',
      paraphrased:
        'behavioral modification = altered the pitch of their songs; permanent change to body chemistry = permanent genetic mutation / cortisol production'
    },
    31: {
      shortThai:
        'คำตอบคือ B เพราะย่อหน้า B ยกตัวอย่าง longer limbs และ sticky toe pads เพื่อปีน concrete walls และ glass windows โจทย์ถาม anatomical change จาก modern building surfaces ตรง Menelaou ในย่อหน้า B',
      paraphrased:
        'anatomical physical change = longer limbs / ultra-sticky scales; modern building surfaces = concrete walls and glass windows'
    },
    32: {
      shortThai:
        'คำตอบคือ B เพราะโจทย์พูด DNA diversity ลด → susceptible to sudden shifts ซึ่งตรง Kenji Tanaka เรื่อง genetic diversity plummets และ vulnerable if environment changes abruptly ไม่ใช่ Menelaou (anatomy) หรือ Clark (birdsong)',
      paraphrased:
        'DNA diversity = genetic diversity / genetic variation; sudden environmental shifts = urban environment changes abruptly; researcher = Kenji Tanaka'
    },
    33: {
      shortThai:
        'คำตอบคือ A เพราะโจทย์พูด physical appendages → man-made architecture ซึ่งตรง Aris Menelaou เรื่อง limbs และ toe pads สำหรับ concrete walls ไม่ใช่ Tanaka หรือ Clark',
      paraphrased:
        'physical appendages = limbs / toe pads; man-made architecture = concrete walls and glass windows; researcher = Aris Menelaou'
    },
    34: {
      shortThai:
        'คำตอบคือ C เพราะโจทย์พูด modify vocalizations → overcome noise pollution ซึ่งตรง Fiona Clark เรื่อง higher frequency songs และ traffic rumble ไม่ใช่ Menelaou หรือ Tanaka',
      paraphrased:
        'modify vocalizations = altered the pitch / higher frequencies; noise pollution = low-frequency rumble of traffic; researcher = Fiona Clark'
    },
    35: {
      shortThai:
        'คำตอบคือ B เพราะโจทย์พูด rapid urban transition → drop in genetic variety ซึ่งตรง genetic bottleneck ของ Kenji Tanaka (ใช้ B ซ้ำได้ตาม NB) ไม่ใช่ Menelaou ที่พูดแค่ physical divergence',
      paraphrased:
        'rapid transition = harsh urban transition; genetic variety = genetic diversity; researcher = Kenji Tanaka / genetic bottleneck'
    },
    36: {
      shortThai:
        'คำตอบคือ pitch เพราะ summary ถาม alter the ___ of their songs ซึ่ง passage ใช้ altered the pitch of their songs ต้องตอบ pitch เท่านั้น (ONE WORD ONLY) ไม่ใช้ frequency หรือ songs',
      paraphrased:
        'alter the ___ of their songs = altered the pitch; ONE WORD = pitch'
    },
    37: {
      shortThai:
        'คำตอบคือ mutation เพราะ summary ถาม genetic ___ ที่ suppresses cortisol ซึ่ง passage ระบุ permanent genetic mutation ต้องตอบ mutation คำเดียว ไม่ใช่ cortisol เพราะ blank ต้องการชนิดของการเปลี่ยนแปลง ไม่ใช่ฮอร์โมน',
      paraphrased:
        'genetic ___ = permanent genetic mutation; suppresses cortisol = suppresses baseline cortisol production; ONE WORD = mutation'
    },
    38: {
      shortThai:
        'คำตอบคือ disturbances เพราะ summary ถาม daily ___ ใน metropolitan areas ซึ่งตรง constant visual and auditory disturbances ใน passage คำว่า stress หรือ noise ไม่ตรงวลีในบทความ',
      paraphrased:
        'daily ___ = constant visual and auditory disturbances; metropolitan areas = the city; ONE WORD = disturbances'
    },
    39: {
      shortThai:
        'คำตอบคือ debate เพราะ summary ถาม fierce ___ among scientists ซึ่งตรง sparking a fierce debate ในย่อหน้า F (แม้ Clark ถูกกล่าวถึงในย่อหน้าเดียวกัน แต่คำในช่องว่างคือ debate จากประโยค These findings are sparking...) ไม่ใช่ ecology หรือ conservation เพราะต้อง ONE WORD ONLY',
      paraphrased:
        'fierce ___ = fierce debate; among scientists = regarding the future of environmental conservation; ONE WORD = debate'
    },
    40: {
      shortThai:
        'คำตอบคือ B เพราะทั้งบทความอธิบายว่าเมืองเป็น evolutionary pressure cookers ที่ขับ adapt/mutate ตัวเลือก A ขัดกับ cities shape nature ตัวเลือก C วิจารณ์ planners ที่ไม่ใช่โฟกัสหลัก ตัวเลือก D เปรียบ behavioral vs genetic ที่ passage ไม่ได้สรุปว่าอย่างใดสำคัญกว่า',
      paraphrased:
        'main purpose = man-made environments driving rapid evolution; B = pressure cookers / adapt and mutate; A/C/D = not main writer purpose'
    }
  },
  'ielts-academic-reading-jan-2026-passage-3-cognitive-cost-of-gps.json': {
    27: {
      shortThai:
        'คำตอบคือ D เพราะย่อหน้า D Kearns อธิบาย cognitive offloading ว่า offloading navigation ช่วย free up cognitive capacity สำหรับ intellectual pursuits อื่น โจทย์ถาม outsourcing mental tasks → focus on different challenges ตรงย่อหน้า D ไม่ใช่ย่อหน้า F ที่พูด redesign apps',
      paraphrased:
        'outsourcing mental tasks = offloading spatial navigation; different intellectual challenges = other intellectual pursuits / creative thought'
    },
    28: {
      shortThai:
        'คำตอบคือ F เพราะย่อหน้า F เสนอ prototype apps แบบ digital compass ที่บังคับ user figure out micro-route เอง โจทย์ถาม alternative design ที่ encourage participation ตรง promote active engagement ในย่อหน้า F',
      paraphrased:
        'alternative technological design = New prototype apps; encourage user participation = force the user to figure out the specific micro-route'
    },
    29: {
      shortThai:
        'คำตอบคือ C เพราะย่อหน้า C Bohbot พบ posterior hippocampus ของ taxi drivers ใหญ่กว่าคนทั่วไป โจทย์ถาม measurable physical change จาก extensive navigational experience ตรงย่อหน้า C ไม่ใช่ย่อหน้า B ที่อธิบาย hippocampus ทั่วไปโดยยังไม่มีผล MRI',
      paraphrased:
        'measurable physical change = significantly larger; extensive navigational experience = veteran taxi driver / The Knowledge'
    },
    30: {
      shortThai:
        'คำตอบคือ A เพราะย่อหน้า A อ้าง Ancient Polynesians ใช้ wave patterns and stars เดินทางข้ามมหาสมุทร โจทย์ถาม ancient civilizations + natural phenomena ตรงย่อหน้า A',
      paraphrased:
        'ancient civilizations = Ancient Polynesians; natural phenomena = wave patterns and stars; long distances = thousands of miles of open ocean'
    },
    31: {
      shortThai:
        'คำตอบคือ B เพราะย่อหน้า B Spiers อธิบาย hippocampus ที่ responsible for spatial navigation และ evolved เพราะ spatial awareness เป็น survival tool โจทย์ถาม brain region + geographic relationships ตรงย่อหน้า B',
      paraphrased:
        'specific brain region = hippocampus; geographic relationships = spatial navigation / cognitive map; evolved = hippocampus evolved'
    },
    32: {
      shortThai:
        'คำตอบคือ C เพราะโจทย์พูด negative impacts exaggerated ซึ่งตรง Oliver Kearns ที่บอก fear is largely overstated และ panicking is premature ไม่ใช่ Bohbot (shrinkage) หรือ Spiers (survival)',
      paraphrased:
        'negative impacts exaggerated = fear is largely overstated; researcher = Dr. Oliver Kearns'
    },
    33: {
      shortThai:
        'คำตอบคือ B เพราะโจทย์พูด turn-by-turn → brain area inactive ซึ่งตรง Veronique Bohbot ว่า hippocampus remains entirely unengaged เมื่อ follow turn-by-turn commands',
      paraphrased:
        'turn-by-turn directions = turn-by-turn digital commands; brain area inactive = hippocampus remains entirely unengaged; researcher = Veronique Bohbot'
    },
    34: {
      shortThai:
        'คำตอบคือ A เพราะโจทย์พูด spatial mapping machinery → keep early humans alive ซึ่งตรง Hugo Spiers เรื่อง matter of life and death และ hippocampus evolved as survival tool',
      paraphrased:
        'spatial mapping = hippocampus / cognitive map; keep early humans alive = matter of life and death; researcher = Dr. Hugo Spiers'
    },
    35: {
      shortThai:
        'คำตอบคือ C เพราะโจทย์พูด transferring navigation → more energy for creative thinking ซึ่งตรง Kearns เรื่อง cognitive offloading และ free up cognitive capacity ไม่ใช่ Bohbot หรือ Spiers',
      paraphrased:
        'transferring navigational duties = offloading spatial navigation to a satellite; creative thinking = creative thought; researcher = Oliver Kearns'
    },
    36: {
      shortThai:
        'คำตอบคือ followers เพราะ Bohbot เรียก stimulus-response followers และโจทย์กำหนด ONE WORD ONLY จึงต้องใช้ followers คำเดียว ไม่ใช่ stimulus-response หรือ navigators',
      paraphrased:
        'mere ___ = stimulus-response followers; ONE WORD = followers'
    },
    37: {
      shortThai:
        'คำตอบคือ landmarks เพราะ summary ถาม memorize the ___ in vicinity ซึ่งตรง fail to encode local landmarks ใน passage คำอื่นเช่น streets ไม่ตรงประโยคนี้',
      paraphrased:
        'memorize = encode into long-term memory; immediate vicinity = local; ONE WORD = landmarks'
    },
    38: {
      shortThai:
        'คำตอบคือ serendipity เพราะ summary อธิบายการค้นพบโดยบังเอิญขณะหลงทาง ซึ่งตรง psychological phenomenon of serendipity ใน passage ต้องสะกดและใช้คำนี้เท่านั้น',
      paraphrased:
        'experience ___ = phenomenon of serendipity; accidentally stumble = unexpected discoveries while wandering off-course; ONE WORD = serendipity'
    },
    39: {
      shortThai:
        'คำตอบคือ landscape เพราะ summary ถาม physical ___ they travel through ซึ่งตรง physical landscape around them ใน passage คำว่า environment หรือ cities ไม่ตรง blank grammar',
      paraphrased:
        'physical ___ = physical landscape; traveling through = move through cities; ONE WORD = landscape'
    },
    40: {
      shortThai:
        'คำตอบคือ C เพราะย่อหน้า G สรุปว่าเราไม่ควร romanticize anxiety ของการหลงทาง แต่ควร occasionally turn off the screen และ read the streets เพื่อ exercise neurological hardware ตัวเลือก A พูด permanently delete apps ที่ passage ไม่แนะนำ ตัวเลือก B ขัดกับ should not romanticize the anxiety ตัวเลือก D พูด evolve new brain structure ที่ไม่มีในบทความ',
      paraphrased:
        'main conclusion = occasionally turning off the screen / read the streets; C = engage biological navigation skills; A/B/D = contradicted by final paragraph'
    }
  }
}

for (const [filename, patches] of Object.entries(FILES)) {
  const filePath = path.join(importsDir, filename)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  data[0].rawAnswerKey = patchAnswerKey(data[0].rawAnswerKey, patches)
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
  console.log('Updated', filename)
}
