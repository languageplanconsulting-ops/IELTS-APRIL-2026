/**
 * Upgrades Short Thai Explanation + Paraphrased Vocabulary for March 2026 Passage 3 imports.
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

const FORGETTING = {
  27: {
    shortThai:
      'คำตอบคือ B เพราะ scene เปิดเรื่องให้ parent พูดว่า You just need to remember more และ Schools reward recall ซึ่ง paraphrase ว่าคนส่วนใหญ่เชื่อว่าการเรียนรู้ขึ้นกับการจำมากขึ้น ตัวเลือก A ผิดเพราะ passage ไม่ได้บอกว่าวิธีเรียนของนักเรียนไม่มีประสิทธิภาพ ตัวเลือก C ไม่ได้พูดว่าพ่อแม่เข้าใจวิชาผิด ตัวเลือก D ไม่ได้เปรียบเทียบว่าวิชาประวัติศาสตร์จำยากกว่าวิชาอื่น',
    paraphrased:
      'assume learning depends on remembering more = You just need to remember more / Schools reward recall; kitchen table scene = opening student example; answer signal = B'
  },
  28: {
    exactPortion:
      'these examples can lead to a misleading conclusion: that the best possible mind would be one that kept everything. A mind unable to let go of irrelevant material would soon become crowded with details that no longer help it act. The point is not that forgetting is always good, but that memory without selection would be almost unusable.',
    shortThai:
      'คำตอบคือ C เพราะย่อหน้าสองชี้ว่า mind ที่เก็บทุกอย่างจะ crowded และ memory without selection would be almost unusable ซึ่งตรง remembering everything would not necessarily be useful ตัวเลือก A ผิดเพราะ passage บอก forgetting มี reputation แย่แต่ไม่ได้สรุปว่า harmful มากกว่าที่คิด ตัวเลือก B ผิดเพราะไม่ได้สนับสนุนการเก็บรายละเอียดเล็ก ๆ ตัวเลือก D ผิดเพราะแยก ordinary forgetting จาก carelessness ในย่อหน้าถัดไป ไม่ใช่ย่อหน้านี้',
    paraphrased:
      'remembering everything = kept everything; not necessarily useful = almost unusable / crowded with irrelevant details; answer signal = C'
  },
  29: {
    exactPortion:
      'Dr Lena Roth... describes useful forgetting as a kind of "cognitive housekeeping". By this she does not mean that the mind throws away information at random. Rather, it weakens access to material that is outdated, distracting, or no longer connected to present goals.',
    shortThai:
      'คำตอบคือ A เพราะ Roth อธิบาย cognitive housekeeping ว่า mind weakens access to outdated or distracting material ไม่ใช่ทิ้งข้อมูลแบบสุ่ม ตัวเลือก B ผิดเพราะไม่ได้พูดถึงลำดับความจำแบบคงที่ ตัวเลือก C ผิดเพราะไม่ได้เชื่อมกับความเหนื่อยล้าทางกาย ตัวเลือก D ผิดเพราะ passage แยก ordinary forgetting จาก mental decline ชัดเจน',
    paraphrased:
      'reduce access to no longer useful information = weakens access to outdated material; cognitive housekeeping = sorting not random throwing away; answer signal = A'
  },
  30: {
    exactPortion:
      'In the final navigation task, this second group was slower at the beginning, but by the end they made fewer wrong turns and adapted better to the changed layout. Innes did not claim that forgetting makes people more intelligent. His conclusion was more cautious: when circumstances change, deliberately weakening old responses may make new learning more flexible.',
    shortThai:
      'คำตอบคือ B เพราะ Innes สรุปอย่างระมัดระวังว่า deliberately weakening old responses may make new learning more flexible ซึ่งตรง outdated responses deliberately weakened ตัวเลือก A ผิดเพราะ passage ระบุชัดว่า Innes did not claim that forgetting makes people more intelligent และไม่ได้ใช้คำว่า always ตัวเลือก C ผิดเพราะไม่ได้เปรียบ digital กับ real-world navigation ตัวเลือก D ผิดเพราะทั้งสองกลุ่มถูกบอกว่า museum renovated',
    paraphrased:
      'outdated responses weakened = describe old routes and deliberately avoid using them; new learning more flexible = adapted better to the changed layout; answer signal = B'
  },
  31: {
    shortThai:
      'คำตอบคือ B เพราะ Mendez พบว่า technicians ลำบากเพราะ persistence of knowledge that once worked well ไม่ใช่ lack of knowledge ซึ่งตรง previous knowledge may interfere with adaptation ตัวเลือก A ผิดเพราะไม่ได้บอกว่า resist training เพราะ dislike technology ตัวเลือก C ผิดเพราะ passage บอก previous expertise still has value ตัวเลือก D ผิดเพราะปัญหาคือ old habits ไม่ใช่ poor safety instructions',
    paraphrased:
      'previous knowledge interferes = persistence of knowledge that once worked well; adaptation = replaced machine / warning sound no longer produced; answer signal = B'
  },
  32: {
    shortThai:
      'คำตอบคือ A (addition) เพราะ summary ถาม ___ of new facts ซึ่งตรง Learning is often described as the addition of new facts ใน word bank ต้องเลือก A ไม่ใช่ G expertise หรือ I confidence ที่ไม่มีในประโยคนี้',
    paraphrased:
      '___ of new facts = addition of new facts; word bank trap = G expertise / I confidence; answer signal = A'
  },
  33: {
    shortThai:
      'คำตอบคือ B (misconceptions) เพราะ students ต้อง loosen their grip on earlier misconceptions ตรง move away from earlier ___ ตัวเลือก F punishment ผิดเพราะ passage บอก aim is not to shame them',
    paraphrased:
      'move away from earlier ___ = loosen their grip on earlier misconceptions; word bank = B misconceptions'
  },
  34: {
    shortThai:
      'คำตอบคือ E (contradictions) เพราะ teachers ask students to mark the contradictions in their original explanation ตรง identify the ___ ไม่ใช่ D revision ที่เป็นผลลัพธ์ของขั้นตอนนี้',
    paraphrased:
      'identify the ___ = mark the contradictions; revision = later step (blank 35); answer signal = E'
  },
  35: {
    shortThai:
      'คำตอบคือ D (revision) เพราะ old idea available for revision หลังระบุ contradictions ไม่ใช่ E contradictions ที่ใช้ไปแล้วในข้อ 34',
    paraphrased:
      'available for ___ = available for revision; word bank = D revision'
  },
  36: {
    shortThai:
      'คำตอบคือ C (weak memory) เพราะ passage ระบุ forgetting is not a sign of weak memory ตรง not evidence of ___ ไม่ใช่ F punishment หรือ B misconceptions',
    paraphrased:
      'not evidence of ___ = not a sign of weak memory; word bank = C weak memory'
  },
  37: {
    exactPortion:
      'The point is not that forgetting is always good... None of this should romanticise memory loss. Forgetting can be painful, especially when it affects identity, relationships, or health.',
    shortThai:
      'คำตอบคือ FALSE เพราะ passage บอกชัดว่า The point is not that forgetting is always good และไม่ควร romanticise memory loss ขัดกับ all forms of forgetting are beneficial ถ้าเลือก TRUE จะข้ามประโยคปฏิเสธนี้',
    paraphrased:
      'all forms beneficial = forgetting is always good; contradicts = forgetting can be painful / should not romanticise memory loss'
  },
  38: {
    shortThai:
      'คำตอบคือ TRUE เพราะ second group (avoid old routes) by the end made fewer wrong turns แม้ช้ากว่าตอนต้นก็ตาม ตัวเลือก FALSE ผิดถ้าเอา slower at the beginning มาตีความว่าทำได้แย่กว่าโดยรวม',
    paraphrased:
      'avoid old routes = describe old routes and deliberately avoid using them; fewer wrong turns by the end = made fewer wrong turns by the end'
  },
  39: {
    shortThai:
      'คำตอบคือ NOT GIVEN เพราะ passage อธิบาย seventy-two volunteers และผล navigation แต่ไม่กล่าวเรื่อง payment ตาม accuracy คำว่า paid/accuracy ไม่ปรากฏในบทความ แม้มี volunteers ก็ไม่ตอบข้อนี้',
    paraphrased:
      'paid according to accuracy = not mentioned; NOT GIVEN = volunteers described but no payment'
  },
  40: {
    exactPortion:
      'Their difficulty is not lack of knowledge but the persistence of knowledge that once worked well... people may need not only to acquire knowledge, but also to release knowledge that has stopped serving them.',
    shortThai:
      'คำตอบคือ TRUE เพราะ writer สรุปว่าต้อง release knowledge that has stopped serving them และตัวอย่าง technicians แสดง old knowledge ขัดกับการปรับตัว ตรง keeping outdated knowledge can prevent adapting',
    paraphrased:
      'keeping outdated knowledge = persistence of knowledge that once worked well; prevent adapting = struggle when machine replaced / release knowledge'
  }
}

const IMPERFECT = {
  27: {
    shortThai:
      'คำตอบคือ A เพราะ wobbling table ทำให้ the small fault has made the object visible และคนเห็น parts, balance, age and history ตรง small faults can make people notice how objects work ตัวเลือก B ผิดเพราะไม่ได้สรุปว่าเฟอร์นิเจอร์สาธารณะดูแลไม่ดี ตัวเลือก C ผิดเพราะไม่ได้เปรียบความรู้ลูกค้ากับเจ้าของ ตัวเลือก D ผิดเพราะไม่ได้พูดว่าวัตถุเก่าสวยกว่าใหม่',
    paraphrased:
      'notice how objects work = made the object visible / thing with parts; small faults = small fault; answer signal = A'
  },
  28: {
    shortThai:
      'คำตอบคือ B เพราะย่อหน้าสองบอก smooth design ช่วย reduce errors และ make technology available to people who lack specialist knowledge ตรง easier for non-specialists ตัวเลือก A ผิดเพราะไม่ได้พูดเรื่องดูแพง ตัวเลือก C ผิดเพราะ passage บอก reduce errors ไม่ใช่ increase errors ตัวเลือก D ผิดเพราะไม่ได้กล่าวว่าคนใช้เทคโนโลยีไม่ชอบ',
    paraphrased:
      'easier for non-specialists = available to people who lack specialist knowledge; smooth design = smooth, sealed and effortless; answer signal = B'
  },
  29: {
    exactPortion:
      'When an object hides all signs of how it works, users may become efficient but helpless... They give people access, but not agency.',
    shortThai:
      'คำตอบคือ B เพราะ sealed convenience หมายถึง users ได้ access แต่ไม่มี agency/understanding เมื่อซ่อนวิธีทำงาน ตัวเลือก A ผิดเพราะหลักการใช้กับ software และ domestic ตัวเลือก C ผิดเพราะไม่ได้พูดป้องกันความเสียหายทางกาย ตัวเลือก D ผิดเพราะ design นี้ทำให้ helpless เมื่อเสีย ไม่ใช่ช่วยซ่อมเอง',
    paraphrased:
      'access but little understanding = access, but not agency; sealed convenience = hides all signs of how it works; answer signal = B'
  },
  30: {
    shortThai:
      'คำตอบคือ B เพราะ second group (visible parts) ระบุ loose connection ได้ดีกว่าใน later task ตัวเลือก A ผิดเพราะ first group เร็วกว่าในขั้นแรก ไม่ได้เข้าใจ lamp ที่สองดีกว่า ตัวเลือก C ผิดเพราะ second group สำเร็จกว่า ไม่เท่ากัน ตัวเลือก D ผิดเพราะไม่ได้พูด preference',
    paraphrased:
      'visible parts = visible screws, labelled parts; later repair task = different lamp with loose internal connection; answer signal = B'
  },
  31: {
    shortThai:
      'คำตอบคือ A (frustration) เพราะ first group reported less frustration ตรง less ___ ใน summary ไม่ใช่ H attractive appearance หรือ G specialist training',
    paraphrased:
      'less ___ = less frustration; word bank = A frustration'
  },
  32: {
    shortThai:
      'คำตอบคือ B (minor wiring error) เพราะ second group มี minor wiring error that could be corrected ตรง ___ that could be fixed ไม่ใช่ I permanent failure',
    paraphrased:
      '___ that could be fixed = minor wiring error; word bank = B minor wiring error'
  },
  33: {
    shortThai:
      'คำตอบคือ C (practical) เพราะ researchers ว่า friction ช่วย develop a practical understanding ตรง more ___ understanding ไม่ใช่ E understanding ที่เป็นผลในข้อ 35',
    paraphrased:
      'more ___ understanding = practical understanding; word bank = C practical'
  },
  34: {
    shortThai:
      'คำตอบคือ D (later errors) เพราะ users better at detecting later errors ใน accounting software ไม่ใช่ B minor wiring error ที่เป็นตัวอย่าง lamp',
    paraphrased:
      'detecting ___ = detecting later errors; word bank = D later errors'
  },
  35: {
    shortThai:
      'คำตอบคือ E (understanding) เพราะ interruption to smoothness created understanding ตรง create ___ ไม่ใช่ C practical ที่เป็นคำคุณในข้อ 33',
    paraphrased:
      'create ___ = created understanding; word bank = E understanding'
  },
  36: {
    shortThai:
      'คำตอบคือ NO เพราะ researchers did not conclude that products should be made difficult ขัดกับ all products should be more difficult ถ้า YES จะข้ามประโยคปฏิเสธนี้',
    paraphrased:
      'all products more difficult = products should be made difficult; writer claim = NO'
  },
  37: {
    shortThai:
      'คำตอบคือ YES เพราะ writer บอกเมื่อ hides all signs of how it works users become helpless และ have little idea what to do when it fails ตรง less able to respond when something goes wrong',
    paraphrased:
      'hidden processes = hides all signs of how it works; less able to respond = helpless / little idea what to do when it fails'
  },
  38: {
    shortThai:
      'คำตอบคือ NOT GIVEN เพราะ passage พูด Time, cost and safety matter และ repair is possible แต่ไม่เปรียบเทียบว่า repair always spends less than replace คำว่า always less money ไม่มีหลักฐาน',
    paraphrased:
      'always spend less = not compared; NOT GIVEN = cost matters but no repair vs replace comparison'
  },
  39: {
    shortThai:
      'คำตอบคือ YES เพราะ badly designed medical device, transport system or public website cannot be defended on the grounds that it teaches patience ตรงข้อความโจทย์',
    paraphrased:
      'badly designed public systems = medical device, transport system, public website; create difficulty = teaches patience'
  },
  40: {
    shortThai:
      'คำตอบคือ NO เพราะ thoughtful designers ไม่ worship smoothness only และ imperfection carefully designed can be a form of invitation ขัดกับ remove every sign of imperfection',
    paraphrased:
      'remove every imperfection = worship either smoothness only; best designers = most thoughtful designers'
  }
}

const ARCHIVE = {
  27: {
    shortThai:
      'คำตอบคือ B เพราะ recipe ที่ดู trivial อาจ more revealing than diary และ archive is full of such reversals ตรง minor objects can become historically significant ตัวเลือก A ผิดเพราะไม่ได้เปรียบความแม่นยำ official vs personal ตัวเลือก C ผิดเพราะไม่ได้บอกว่า recipes เป็นแหล่งที่เชื่อถือที่สุด ตัวเลือก D ผิดเพราะไม่ได้แนะนำให้เลี่ยง public records',
    paraphrased:
      'minor objects historically significant = recipe more revealing than diary / such reversals; answer signal = B'
  },
  28: {
    shortThai:
      'คำตอบคือ C เพราะ no archive can keep everything และ archive is an argument about what might matter in the future ตรง involve choices ตัวเลือก A ผิดเพราะ passage ปฏิเสธ neutral storehouses ตัวเลือก B ผิดเพราะ abundance ไม่ได้ทำให้มีค่ามากขึ้นเสมอ ตัวเลือก D ผิดเพราะบอก This does not make archives dishonest',
    paraphrased:
      'choices about future = argument about what might matter; involve choices = someone must decide what is collected; answer signal = C'
  },
  29: {
    shortThai:
      'คำตอบคือ B เพราะ abundance can bury meaning และ million unlabelled files ไม่จำเป็นต้อง useful กว่า carefully described box ตัวเลือก A ผิดเพราะ digital age ทำปัญหาซับซ้อนขึ้น ไม่ได้แก้ปัญหา ตัวเลือก C ผิดเพราะไม่ได้บอก physical archives ไม่จำเป็น ตัวเลือก D ผิดเพราะ keeping everything may sound democratic',
    paraphrased:
      'useful meaning harder to find = bury meaning; digital abundance = enormous quantities / unlabelled files; answer signal = B'
  },
  30: {
    shortThai:
      'คำตอบคือ C เพราะ orphaned object คือ technically present but separated from conditions that would make it understandable ตัวเลือก A ผิดเพราะไม่ได้บอก deliberately deleted ตัวเลือก B ผิดเพราะไม่ได้พูด too damaged ตัวเลือก D ผิดเพราะเป็น digital file without metadata ไม่ใช่ family collection',
    paraphrased:
      'separated from context = separated from conditions that would make it understandable; orphaned object = digital file without metadata; answer signal = C'
  },
  31: {
    shortThai:
      'คำตอบคือ A เพราะย่อหน้าห้าให้ Different specialists define the work in different ways ผ่าน Markov, Ordu, Bell, Lykke, Shah เพื่อ compare definitions ตัวเลือก B ผิดเพราะไม่ได้อ้าง legal archives สำคัญที่สุด ตัวเลือก C ผิดเพราะไม่ได้เปรียบ digital กับ paper ว่า reliable กว่า ตัวเลือก D ผิดเพราะ oral history ไม่ได้แทนที่ written documents',
    paraphrased:
      'compare definitions = Different specialists define the work in different ways; answer signal = A'
  },
  32: {
    shortThai:
      'คำตอบคือ A เพราะ writer drawn to records of ordinary people ที่ become important when a new question makes them visible ตัวเลือก B ผิดเพราะสนใจ ordinary ไม่ใช่ official papers ตัวเลือก C ผิดเพราะ Lykke พูดถึง marks of decay ไม่ใช่ complete undamaged only ตัวเลือก D ผิดเพราะ digital abundance เปลี่ยนความยาก ไม่ใช่สนใจจำนวนไฟล์มาก',
    paraphrased:
      'ordinary lives + new questions = records of ordinary people / new question makes them visible; answer signal = A'
  },
  33: {
    shortThai:
      'คำตอบคือ B เพราะ James Ordu ว่า materials should return knowledge to the communities from which they came ไม่ใช่ Markov (verification) หรือ Bell (metadata)',
    paraphrased:
      'returning knowledge = return knowledge to the communities; specialist = James Ordu; answer signal = B'
  },
  34: {
    shortThai:
      'คำตอบคือ C เพราะ Nina Bell บอก metadata can be as important as the object itself ไม่ใช่ Ordu (communities) หรือ Markov (evidence checked)',
    paraphrased:
      'contextual information = metadata / context; as important as item = as important as the object itself; specialist = Nina Bell'
  },
  35: {
    shortThai:
      'คำตอบคือ A เพราะ Alina Markov ว่า archive is a promise that evidence can be checked และ essential issue is verification ไม่ใช่ Shah (silence) หรือ Lykke (permanence illusion)',
    paraphrased:
      'checking evidence = evidence can be checked / verification; specialist = Alina Markov; answer signal = A'
  },
  36: {
    shortThai:
      'คำตอบคือ E เพราะ Priya Shah สนใจ silence: voices never recorded, letters never saved ไม่ใช่ Ordu (return knowledge) หรือ Bell (metadata)',
    paraphrased:
      'never recorded = voices were never recorded; specialist = Priya Shah; answer signal = E'
  },
  37: {
    shortThai:
      'คำตอบคือ D เพราะ Soren Lykke warns preservation can create an illusion of permanence ซึ่ง paraphrase false impression nothing has changed ไม่ใช่ Bell (meaning disappears) ที่เน้นคนละมุม',
    paraphrased:
      'false impression nothing changed = illusion of permanence; specialist = Soren Lykke; answer signal = D'
  },
  38: {
    shortThai:
      'คำตอบคือ ordinary people เพราะ I am drawn to the records of ordinary people ต้องตอบสองคำจาก passage (NO MORE THAN TWO WORDS) ไม่ใช้ shopping lists หรือ historian',
    paraphrased:
      'records of ___ = records of ordinary people; TWO WORDS = ordinary people'
  },
  39: {
    shortThai:
      'คำตอบคือ digital abundance เพราะ The age of digital abundance has changed the difficulty ต้องตอบสองคำตรง phrase ใน passage ไม่ใช้ digital age หรือ enormous quantities',
    paraphrased:
      'age of ___ = age of digital abundance; TWO WORDS = digital abundance'
  },
  40: {
    shortThai:
      'คำตอบคือ interpretation เพราะ central challenge is no longer only preservation, but interpretation ต้องคำเดียวจาก passage ไม่ใช้ preservation ซ้ำหรือ difficulty',
    paraphrased:
      'not only preservation but = no longer only preservation, but interpretation; ONE WORD = interpretation'
  }
}

const FILES = {
  'ielts-academic-reading-march-2026-passage-3-quiet-skill-of-forgetting.json': FORGETTING,
  'ielts-academic-reading-march-2026-passage-3-imperfect-design.json': IMPERFECT,
  'ielts-academic-reading-march-2026-passage-3-good-archive.json': ARCHIVE
}

for (const [filename, patches] of Object.entries(FILES)) {
  const filePath = path.join(importsDir, filename)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  data[0].rawAnswerKey = patchAnswerKey(data[0].rawAnswerKey, patches)
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`Updated ${filename}`)
}
