import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'
import { CAMBRIDGE_10_SECTION_2_EXAM_SET } from './listeningBuilderCambridge10Section2'
import { CAMBRIDGE_10_SECTION_4_EXAM_SET } from './listeningBuilderCambridge10Section4'
import { builderExamSetToFoundationSets } from './listeningFoundationFromBuilder'
import {
  CAM10_TEST4_SECTION3_SCRIPT,
  CAM20_TEST1_SECTION2_POTTERY_SCRIPT
} from './listeningFoundationSectionScripts'

const withFoundationId = (
  set: ListeningFoundationSet,
  id: string,
  title: string
): ListeningFoundationSet => ({
  ...set,
  id,
  title
})

const builderSetForTest = (
  examSet: Parameters<typeof builderExamSetToFoundationSets>[0],
  category: 'essential' | 'advanced',
  testNumber: number
) => {
  const set = builderExamSetToFoundationSets(examSet, category).find((item) =>
    item.title.includes(`Test ${testNumber}`)
  )
  if (!set) throw new Error(`Missing builder foundation set for test ${testNumber}`)
  return set
}

const MANHAM_PORT_DRILL = withFoundationId(
  builderSetForTest(CAMBRIDGE_10_SECTION_2_EXAM_SET, 'essential', 4),
  'foundation-essential-cam10-test4-section2-port-drill',
  'Cam 10 Test 4 · Section 2 - Manham Port Skill Drill'
)

const NANOTECHNOLOGY_DRILL = withFoundationId(
  builderSetForTest(CAMBRIDGE_10_SECTION_4_EXAM_SET, 'advanced', 4),
  'foundation-advanced-cam10-test4-section4-nanotechnology-drill',
  'Cam 10 Test 4 · Section 4 - Nanotechnology Skill Drill'
)

const q = (
  setKey: string,
  section: number,
  number: number,
  question: string,
  passage: string,
  evidence: string,
  correctAnswer: string,
  options: Array<{ key: string; text: string }>,
  passageKeyword: string,
  questionKeyword: string,
  thaiMeaning: string,
  explanationThai: string
): ListeningFoundationQuestion => ({
  id: `${setKey}-s${section}-q${number}-${question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 34)}`,
  number,
  section,
  question,
  passage,
  evidence,
  correctAnswer,
  options,
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai
})

const audio = (test: string, section: number) =>
  `https://ieltstrainingonline.com/wp-content/uploads/2021/07/${test}-Section${section}.mp3`

export const CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS: ListeningFoundationSet[] = [
  MANHAM_PORT_DRILL,
  {
    id: 'foundation-advanced-cam10-test4-section3-work-placement-drill',
    category: 'advanced',
    title: 'Cam 10 Test 4 · Section 3 - Work Placement Skill Drill',
    section: 3,
    levelLabel: 'Advanced · Cam 10 Test 4 style',
    audioUrl: audio('Cam10-Test4', 3),
    questions: [
      q('cam10t4-placement', 3, 21, 'Laura says she improved her ability to manage time and _____.', CAM10_TEST4_SECTION3_SCRIPT, 'any better at managing your time and prioritizing things', 'A', [{ key: 'A', text: 'prioritise tasks' }, { key: 'B', text: 'design brochures' }, { key: 'C', text: 'take photographs' }], 'managing your time and prioritizing', 'prioritise tasks', 'จัดลำดับความสำคัญ', 'Managing time and prioritizing things means prioritising tasks.'),
      q('cam10t4-placement', 3, 22, 'Laura also got better at explaining things and _____.', CAM10_TEST4_SECTION3_SCRIPT, 'explaining things and asserting my opinions', 'B', [{ key: 'A', text: 'cutting costs' }, { key: 'B', text: 'asserting her opinions' }, { key: 'C', text: 'using new software' }], 'asserting my opinions', 'asserting opinions', 'แสดงความคิดเห็นอย่างมั่นใจ', 'Asserting opinions is stated directly in the script.'),
      q('cam10t4-placement', 3, 23, 'The company saved money because Laura’s work cost much less than using _____.', CAM10_TEST4_SECTION3_SCRIPT, 'if they’d used a professional advertising agency to produce their brochure instead of doing it in-house, presumably they’d have paid a lot more', 'A', [{ key: 'A', text: 'an advertising agency' }, { key: 'B', text: 'a photographer' }, { key: 'C', text: 'university staff' }], 'professional advertising agency', 'advertising agency', 'บริษัทโฆษณา', 'The comparison is with a professional advertising agency.'),
      q('cam10t4-placement', 3, 24, 'Laura thought the new brochure would help the company by improving its _____.', CAM10_TEST4_SECTION3_SCRIPT, 'The new brochure looks really professional; it enhances the image of the company straight away.', 'B', [{ key: 'A', text: 'staff numbers' }, { key: 'B', text: 'public image' }, { key: 'C', text: 'office location' }], 'enhances the image', 'public image', 'ภาพลักษณ์ต่อสาธารณะ', 'Enhances the image means improves the public image.'),
      q('cam10t4-placement', 3, 25, 'Tim should collect the STEP booklet from the _____.', CAM10_TEST4_SECTION3_SCRIPT, 'they’ve got copies in the psychology department', 'A', [{ key: 'A', text: 'psychology department' }, { key: 'B', text: 'careers office' }, { key: 'C', text: 'marketing manager' }, { key: 'D', text: 'company personnel office' }], 'psychology department', 'collect booklet from', 'ภาควิชาจิตวิทยา', 'Tim will pick up the booklet from the psychology department.'),
      q('cam10t4-placement', 3, 26, 'Laura advises Tim to discuss his options with _____.', CAM10_TEST4_SECTION3_SCRIPT, 'One of the career officers would be better', 'B', [{ key: 'A', text: 'his personal tutor' }, { key: 'B', text: 'a career officer' }, { key: 'C', text: 'his mentor' }, { key: 'D', text: 'a company manager' }], 'career officers', 'career officer', 'เจ้าหน้าที่งานอาชีพ', 'Laura recommends a career officer rather than the tutor.'),
      q('cam10t4-placement', 3, 27, 'Laura says Tim should check the STEP website for new _____.', CAM10_TEST4_SECTION3_SCRIPT, 'get updates yourself by checking the website for new placement alerts', 'C', [{ key: 'A', text: 'training courses' }, { key: 'B', text: 'reference letters' }, { key: 'C', text: 'placement alerts' }, { key: 'D', text: 'salary details' }], 'placement alerts', 'placement alerts', 'ประกาศตำแหน่งฝึกงาน', 'Placement alerts are what Tim should look for on the website.'),
      q('cam10t4-placement', 3, 28, 'Companies usually contact applicants by _____.', CAM10_TEST4_SECTION3_SCRIPT, 'You get a letter of invitation or an email from personnel departments.', 'D', [{ key: 'A', text: 'telephone only' }, { key: 'B', text: 'the careers office' }, { key: 'C', text: 'STEP headquarters' }, { key: 'D', text: 'letter or email' }], 'letter of invitation or an email', 'letter or email', 'จดหมายหรืออีเมล', 'A letter of invitation or an email means letter or email.'),
      q('cam10t4-placement', 3, 29, 'After an interview Tim should tell his mentor the _____.', CAM10_TEST4_SECTION3_SCRIPT, 'once you’ve had an interview you should let your mentor know what the outcome is', 'A', [{ key: 'A', text: 'outcome' }, { key: 'B', text: 'interview questions' }, { key: 'C', text: 'company address' }, { key: 'D', text: 'travel costs' }], 'outcome', 'tell mentor outcome', 'ผลการสัมภาษณ์', 'The mentor needs to know the outcome of the interview.'),
      q('cam10t4-placement', 3, 30, 'Tim should ask his _____. to provide a reference.', CAM10_TEST4_SECTION3_SCRIPT, 'that’s something you should ask your own tutor to provide', 'C', [{ key: 'A', text: 'mentor' }, { key: 'B', text: 'career officer' }, { key: 'C', text: 'tutor' }, { key: 'D', text: 'employer' }], 'your own tutor', 'tutor', 'อาจารย์ที่ปรึกษา', 'Laura says the tutor should provide the reference.')
    ]
  },
  NANOTECHNOLOGY_DRILL,
  {
    id: 'foundation-essential-cam20-test1-section2-pottery-drill',
    category: 'essential',
    title: 'Cam 20 Test 1 · Section 2 - Pottery Class Skill Drill',
    section: 2,
    levelLabel: 'Essential · Cam 20 Test 1 style',
    audioUrl: audio('Cam20-Test1', 2),
    questions: [
      q('cam20t1-pottery', 2, 11, 'Heather says pottery differs from other art forms because it _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'it stands the test of time. Things like baskets and pictures don’t survive on the earth in the same way that pots do.', 'A', [{ key: 'A', text: 'lasts longer in the ground' }, { key: 'B', text: 'is practised by more people' }, { key: 'C', text: 'can be repaired more easily' }, { key: 'D', text: 'uses fewer tools' }], 'stands the test of time', 'lasts longer', 'อยู่ได้นานกว่า', 'Standing the test of time means pottery lasts longer in the ground.'),
      q('cam20t1-pottery', 2, 12, 'Archaeologists identify the use of ancient pottery from _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'by examining the impressions on the clay, the scratches from tools', 'B', [{ key: 'A', text: 'the clay it was made with' }, { key: 'B', text: 'the marks on it' }, { key: 'C', text: 'the basic shape of it' }, { key: 'D', text: 'its colour' }], 'scratches from tools', 'marks on it', 'รอยบนเนื้อดิน', 'Impressions and scratches are marks on the pottery.'),
      q('cam20t1-pottery', 2, 13, 'Some people join Heather’s class because they want to _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'they hope that something they create will also last longer than they do', 'C', [{ key: 'A', text: 'create an item that looks very old' }, { key: 'B', text: 'find something they are good at' }, { key: 'C', text: 'make something that will outlive them' }, { key: 'D', text: 'sell their work' }], 'last longer than they do', 'outlive them', 'มีชีวิตอยู่นานกว่าตน', 'Lasting longer than they do means outliving them.'),
      q('cam20t1-pottery', 2, 14, 'What does Heather value most about being a potter?', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'what I love most is the concentration you need to make a good pot. That focus takes you away from the stresses of everyday life.', 'A', [{ key: 'A', text: 'its calming effect' }, { key: 'B', text: 'its messy nature' }, { key: 'C', text: 'its physical benefits' }, { key: 'D', text: 'its low cost' }], 'takes you away from the stresses', 'calming effect', 'ช่วยให้ผ่อนคลาย', 'Focus that removes stress has a calming effect.'),
      q('cam20t1-pottery', 2, 15, 'Most visitors to Edelman Pottery _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'Like nearly everyone who comes here, I’m sure this is the first time you will have tried the art', 'B', [{ key: 'A', text: 'bring friends to join courses' }, { key: 'B', text: 'have never made a pot before' }, { key: 'C', text: 'try to learn techniques too quickly' }, { key: 'D', text: 'work as professional potters' }], 'first time you will have tried', 'never made a pot', 'ไม่เคยปั้นดินมาก่อน', 'The first time trying the art means they have never made a pot before.'),
      q('cam20t1-pottery', 2, 16, 'Heather reminds visitors that they should _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'please remove any watches, necklaces, etc.', 'C', [{ key: 'A', text: 'put on their aprons' }, { key: 'B', text: 'change their clothes' }, { key: 'C', text: 'take off their jewellery' }, { key: 'D', text: 'pay in advance' }], 'remove any watches, necklaces', 'take off jewellery', 'ถอดเครื่องประดับ', 'Watches and necklaces are jewellery to remove.'),
      q('cam20t1-pottery', 2, 17, 'Heather explains that a kiln’s main function is to _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'a kiln removes the water from clay at temperatures of around 1000 degrees Celsius', 'A', [{ key: 'A', text: 'remove water from clay' }, { key: 'B', text: 'add colour to pots' }, { key: 'C', text: 'shape clay into bowls' }, { key: 'D', text: 'store finished pots' }], 'removes the water from clay', 'remove water', 'ขจัดน้ำออกจากดิน', 'Removing water from clay is the kiln’s main function.'),
      q('cam20t1-pottery', 2, 18, 'Heather says domestic ovens are unsuitable because they _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'domestic ovens don’t really get hot enough and eventually the clay will crack and fall apart', 'B', [{ key: 'A', text: 'use too much electricity' }, { key: 'B', text: 'are not hot enough' }, { key: 'C', text: 'are too large' }, { key: 'D', text: 'release toxic compounds' }], 'don’t really get hot enough', 'not hot enough', 'ไม่ร้อนพอ', 'Not getting hot enough makes domestic ovens unsuitable.'),
      q('cam20t1-pottery', 2, 19, 'Heather says some potter’s tools are _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'there are some basic tools that you will need to handle the clay on the wheel', 'C', [{ key: 'A', text: 'hard to hold' }, { key: 'B', text: 'worth buying immediately' }, { key: 'C', text: 'essential items' }, { key: 'D', text: 'only for experts' }], 'basic tools that you will need', 'essential', 'จำเป็นต้องมี', 'Tools you will need are essential items.'),
      q('cam20t1-pottery', 2, 20, 'Heather tells participants they should not buy tools yet because the studio _____.', CAM20_TEST1_SECTION2_POTTERY_SCRIPT, 'We can provide these and I wouldn’t recommend spending money on them yet.', 'D', [{ key: 'A', text: 'sells them at a discount' }, { key: 'B', text: 'does not allow outside tools' }, { key: 'C', text: 'only lends tools for one day' }, { key: 'D', text: 'can provide them' }], 'We can provide these', 'studio can provide', 'จัดหาให้ได้', 'The studio can provide the tools, so buying them is unnecessary.')
    ]
  },
  {
    id: 'foundation-advanced-cam20-test1-section3-loneliness-drill',
    category: 'advanced',
    title: 'Cam 20 Test 1 · Section 3 - Loneliness Research Skill Drill',
    section: 3,
    levelLabel: 'Advanced · Cam 20 Test 1 style',
    questions: [
      q('cam20t1-lonely', 3, 21, 'The students agree that loneliness is different from _____.', 'They point out that a person can be alone without feeling lonely, and can feel lonely in a crowd.', 'alone without feeling lonely', 'A', [{ key: 'A', text: 'being physically alone' }, { key: 'B', text: 'being unhappy' }, { key: 'C', text: 'being shy' }], 'alone without feeling lonely', 'physically alone', 'อยู่คนเดียวทางกายภาพ', 'Being alone is not always the same as feeling lonely.'),
      q('cam20t1-lonely', 3, 22, 'The survey was criticised because it relied on _____.', 'The sample was rather narrow because most responses came from students at one university.', 'most responses came from students at one university', 'B', [{ key: 'A', text: 'too many age groups' }, { key: 'B', text: 'a limited sample' }, { key: 'C', text: 'unclear questions' }], 'rather narrow sample', 'limited sample', 'กลุ่มตัวอย่างจำกัด', 'A narrow sample is a limited sample.'),
      q('cam20t1-lonely', 3, 23, 'One useful part of the research was its focus on _____.', 'The strongest section looked at how online messages can increase contact but still fail to create close relationships.', 'online messages can increase contact', 'C', [{ key: 'A', text: 'housing costs' }, { key: 'B', text: 'diet' }, { key: 'C', text: 'digital communication' }], 'online messages', 'digital communication', 'การสื่อสารดิจิทัล', 'Online messages are a form of digital communication.'),
      q('cam20t1-lonely', 3, 24, 'The tutor advises the students to define their key _____.', 'Before presenting the findings, you need to explain exactly what you mean by terms such as isolation and social support.', 'explain exactly what you mean by terms', 'A', [{ key: 'A', text: 'terms' }, { key: 'B', text: 'graphs' }, { key: 'C', text: 'dates' }], 'terms', 'define key terms', 'นิยามคำสำคัญ', 'Explain what terms mean means define key terms.'),
      q('cam20t1-lonely', 3, 25, 'The final presentation should include more _____.', 'At the moment the talk has plenty of theory, but it would be stronger with more real examples from interviews.', 'more real examples from interviews', 'B', [{ key: 'A', text: 'statistics' }, { key: 'B', text: 'examples' }, { key: 'C', text: 'definitions' }], 'real examples', 'include more examples', 'ตัวอย่าง', 'Real examples from interviews are examples.'),
      q('cam20t1-lonely', 3, 26, 'Older adults are mentioned in relation to _____.', 'Older adults in rural areas may face extra loneliness when public transport is poor.', 'public transport is poor', 'D', [{ key: 'A', text: 'employment' }, { key: 'B', text: 'technology' }, { key: 'C', text: 'family size' }, { key: 'D', text: 'transport' }], 'public transport', 'transport', 'การเดินทาง / ขนส่ง', 'The issue mentioned is poor public transport.'),
      q('cam20t1-lonely', 3, 27, 'Young adults are mentioned in relation to _____.', 'Some young adults have many online contacts but still lack close emotional support.', 'many online contacts', 'B', [{ key: 'A', text: 'housing' }, { key: 'B', text: 'technology' }, { key: 'C', text: 'health services' }, { key: 'D', text: 'retirement' }], 'online contacts', 'technology', 'เทคโนโลยี', 'Online contacts point to technology.'),
      q('cam20t1-lonely', 3, 28, 'New parents are mentioned in relation to _____.', 'New parents can feel isolated because caring duties make it hard to meet friends regularly.', 'caring duties make it hard to meet friends', 'C', [{ key: 'A', text: 'transport' }, { key: 'B', text: 'technology' }, { key: 'C', text: 'family responsibilities' }, { key: 'D', text: 'retirement' }], 'caring duties', 'family responsibilities', 'หน้าที่ครอบครัว', 'Caring duties are family responsibilities.'),
      q('cam20t1-lonely', 3, 29, 'Shift workers are mentioned in relation to _____.', 'People who work irregular hours may miss social events because their schedule changes every week.', 'work irregular hours', 'A', [{ key: 'A', text: 'work patterns' }, { key: 'B', text: 'housing' }, { key: 'C', text: 'public transport' }, { key: 'D', text: 'health services' }], 'irregular hours', 'work patterns', 'รูปแบบการทำงาน', 'Irregular hours are a work pattern.'),
      q('cam20t1-lonely', 3, 30, 'People who recently moved house are mentioned in relation to _____.', 'People who move into a new neighbourhood often need time to rebuild local friendships.', 'move into a new neighbourhood', 'B', [{ key: 'A', text: 'retirement' }, { key: 'B', text: 'housing changes' }, { key: 'C', text: 'online habits' }, { key: 'D', text: 'physical illness' }], 'new neighbourhood', 'housing changes', 'การเปลี่ยนที่อยู่อาศัย', 'Moving to a new neighbourhood is a housing change.')
    ]
  },
  {
    id: 'foundation-advanced-cam20-test1-section4-urban-rivers-drill',
    category: 'advanced',
    title: 'Cam 20 Test 1 · Section 4 - Reclaiming Urban Rivers Skill Drill',
    section: 4,
    levelLabel: 'Advanced · Cam 20 Test 1 style',
    questions: [
      q('cam20t1-rivers', 4, 31, 'In the past, city rivers were often used for _____.', 'For many years, urban rivers were treated as channels for waste from homes and factories.', 'channels for waste', 'A', [{ key: 'A', text: 'waste' }, { key: 'B', text: 'tourism' }, { key: 'C', text: 'education' }, { key: 'D', text: 'sport' }], 'waste', 'used for waste', 'ของเสีย', 'Channels for waste means used for waste.'),
      q('cam20t1-rivers', 4, 32, 'Concrete banks increased the risk of _____.', 'Straight concrete banks made water move faster downstream, increasing the danger of flooding after heavy rain.', 'increasing the danger of flooding', 'C', [{ key: 'A', text: 'drought' }, { key: 'B', text: 'noise' }, { key: 'C', text: 'flooding' }, { key: 'D', text: 'pollution' }], 'danger of flooding', 'risk of flooding', 'น้ำท่วม', 'Danger and risk have the same meaning here.'),
      q('cam20t1-rivers', 4, 33, 'Restoration projects often create new _____.', 'When rivers are restored, parks and footpaths are often built beside the water.', 'parks and footpaths', 'D', [{ key: 'A', text: 'factories' }, { key: 'B', text: 'car parks' }, { key: 'C', text: 'shopping centres' }, { key: 'D', text: 'public spaces' }], 'parks and footpaths', 'public spaces', 'พื้นที่สาธารณะ', 'Parks and footpaths are public spaces.'),
      q('cam20t1-rivers', 4, 34, 'Planting along river banks helps improve _____.', 'Native plants along the banks provide shade and create habitats for insects and birds.', 'create habitats for insects and birds', 'B', [{ key: 'A', text: 'traffic' }, { key: 'B', text: 'biodiversity' }, { key: 'C', text: 'lighting' }, { key: 'D', text: 'parking' }], 'habitats for insects and birds', 'biodiversity', 'ความหลากหลายทางชีวภาพ', 'Habitats for insects and birds improve biodiversity.'),
      q('cam20t1-rivers', 4, 35, 'One challenge is removing old _____.', 'Before the river can be opened up, engineers often have to remove old pipes and other underground infrastructure.', 'remove old pipes', 'C', [{ key: 'A', text: 'bridges' }, { key: 'B', text: 'trees' }, { key: 'C', text: 'pipes' }, { key: 'D', text: 'benches' }], 'old pipes', 'removing pipes', 'ท่อเก่า', 'The old item to remove is pipes.'),
      q('cam20t1-rivers', 4, 36, 'Local people may worry about _____.', 'Residents sometimes worry that an attractive riverside will push up rents and make the area less affordable.', 'push up rents', 'A', [{ key: 'A', text: 'higher rents' }, { key: 'B', text: 'less sunlight' }, { key: 'C', text: 'fewer visitors' }, { key: 'D', text: 'shorter paths' }], 'push up rents', 'higher rents', 'ค่าเช่าสูงขึ้น', 'Push up rents means make rents higher.'),
      q('cam20t1-rivers', 4, 37, 'Successful projects need cooperation between planners and _____.', 'The most successful schemes involve city planners working closely with local communities.', 'working closely with local communities', 'D', [{ key: 'A', text: 'tourists' }, { key: 'B', text: 'drivers' }, { key: 'C', text: 'advertisers' }, { key: 'D', text: 'communities' }], 'local communities', 'cooperation with communities', 'ชุมชนท้องถิ่น', 'Working closely with communities means cooperation with them.'),
      q('cam20t1-rivers', 4, 38, 'Monitoring water quality requires regular _____.', 'Scientists take samples every month to check whether pollution levels are falling.', 'take samples every month', 'B', [{ key: 'A', text: 'photographs' }, { key: 'B', text: 'sampling' }, { key: 'C', text: 'painting' }, { key: 'D', text: 'advertising' }], 'take samples', 'sampling', 'การเก็บตัวอย่าง', 'Taking samples is sampling.'),
      q('cam20t1-rivers', 4, 39, 'River restoration can support local _____.', 'Cleaner rivers can attract cafes, boat hire and walking tours, bringing money into the local economy.', 'bringing money into the local economy', 'C', [{ key: 'A', text: 'exams' }, { key: 'B', text: 'weather' }, { key: 'C', text: 'economy' }, { key: 'D', text: 'language' }], 'local economy', 'support economy', 'เศรษฐกิจท้องถิ่น', 'Bringing money into the local economy supports it.'),
      q('cam20t1-rivers', 4, 40, 'The lecturer says river projects should be judged over the _____.', 'The real benefits may only appear after several years, so projects need to be assessed in the long term.', 'assessed in the long term', 'A', [{ key: 'A', text: 'long term' }, { key: 'B', text: 'first week' }, { key: 'C', text: 'holiday season' }, { key: 'D', text: 'morning' }], 'long term', 'over the long term', 'ระยะยาว', 'Judged over the long term means assessed after a long period.')
    ]
  },
  {
    id: 'foundation-essential-cam20-test2-section2-volunteering-drill',
    category: 'essential',
    title: 'Cam 20 Test 2 · Section 2 - Community Volunteering Skill Drill',
    section: 2,
    levelLabel: 'Essential · Cam 20 Test 2 style',
    questions: [
      q('cam20t2-volunteer', 2, 11, 'The volunteer programme is mainly for people who can commit to _____.', 'The centre needs volunteers who can come every week, because occasional help is hard to plan around.', 'come every week', 'A', [{ key: 'A', text: 'regular attendance' }, { key: 'B', text: 'full-time work' }, { key: 'C', text: 'overnight stays' }, { key: 'D', text: 'paid training' }], 'come every week', 'regular attendance', 'การเข้าร่วมสม่ำเสมอ', 'Coming every week shows regular attendance.'),
      q('cam20t2-volunteer', 2, 12, 'New volunteers first receive _____.', 'Before starting, all volunteers attend a short introduction to the centre and its safety procedures.', 'a short introduction to the centre', 'B', [{ key: 'A', text: 'a uniform' }, { key: 'B', text: 'an introduction' }, { key: 'C', text: 'a salary' }, { key: 'D', text: 'a certificate' }], 'short introduction', 'first receive introduction', 'การปฐมนิเทศ', 'A short introduction is the first thing volunteers receive.'),
      q('cam20t2-volunteer', 2, 13, 'The community garden project needs help with _____.', 'In the garden, volunteers mainly water plants, collect leaves and prepare beds for new vegetables.', 'water plants, collect leaves and prepare beds', 'C', [{ key: 'A', text: 'teaching music' }, { key: 'B', text: 'fixing computers' }, { key: 'C', text: 'gardening tasks' }, { key: 'D', text: 'driving buses' }], 'water plants', 'gardening tasks', 'งานสวน', 'Watering plants and preparing beds are gardening tasks.'),
      q('cam20t2-volunteer', 2, 14, 'The lunch club is especially short of people on _____.', 'The lunch club has enough helpers on Mondays, but Friday is always difficult.', 'Friday is always difficult', 'D', [{ key: 'A', text: 'Monday' }, { key: 'B', text: 'Tuesday' }, { key: 'C', text: 'Wednesday' }, { key: 'D', text: 'Friday' }], 'Friday is difficult', 'short of people on Friday', 'วันศุกร์', 'If Friday is difficult, they are short of people then.'),
      q('cam20t2-volunteer', 2, 15, 'Volunteers working with children must complete a _____.', 'Anyone helping with children has to complete a background check before joining sessions.', 'complete a background check', 'A', [{ key: 'A', text: 'background check' }, { key: 'B', text: 'driving test' }, { key: 'C', text: 'language exam' }, { key: 'D', text: 'medical degree' }], 'background check', 'must complete check', 'การตรวจประวัติ', 'Complete a background check answers the question.'),
      q('cam20t2-volunteer', 2, 16, 'Travel costs can be _____.', 'The centre cannot pay wages, but reasonable bus and train fares can be refunded.', 'bus and train fares can be refunded', 'C', [{ key: 'A', text: 'ignored' }, { key: 'B', text: 'increased' }, { key: 'C', text: 'refunded' }, { key: 'D', text: 'taxed' }], 'fares can be refunded', 'costs refunded', 'คืนเงินค่าเดินทาง', 'Refunded means paid back.'),
      q('cam20t2-volunteer', 2, 17, 'The training session lasts _____.', 'The first training session takes two hours, including a short break.', 'takes two hours', 'B', [{ key: 'A', text: 'thirty minutes' }, { key: 'B', text: 'two hours' }, { key: 'C', text: 'one day' }, { key: 'D', text: 'six weeks' }], 'takes two hours', 'lasts two hours', 'ใช้เวลาสองชั่วโมง', 'Takes two hours means lasts two hours.'),
      q('cam20t2-volunteer', 2, 18, 'Volunteers should use the side entrance after _____.', 'After six in the evening, the main door is locked, so volunteers should use the side entrance.', 'After six in the evening', 'D', [{ key: 'A', text: 'three' }, { key: 'B', text: 'four' }, { key: 'C', text: 'five' }, { key: 'D', text: 'six' }], 'after six', 'after six', 'หลังหกโมง', 'The side entrance is used after six.'),
      q('cam20t2-volunteer', 2, 19, 'The coordinator asks volunteers to update their _____.', 'Please tell us if your phone number or email address changes, so our contact details stay current.', 'phone number or email address changes', 'A', [{ key: 'A', text: 'contact details' }, { key: 'B', text: 'uniform size' }, { key: 'C', text: 'bank account' }, { key: 'D', text: 'garden tools' }], 'phone number or email', 'contact details', 'ข้อมูลติดต่อ', 'Phone number and email are contact details.'),
      q('cam20t2-volunteer', 2, 20, 'Volunteers can ask for support from a _____.', 'Every new volunteer is paired with an experienced mentor during the first month.', 'paired with an experienced mentor', 'C', [{ key: 'A', text: 'customer' }, { key: 'B', text: 'driver' }, { key: 'C', text: 'mentor' }, { key: 'D', text: 'cook' }], 'experienced mentor', 'support from mentor', 'พี่เลี้ยง / ผู้ให้คำแนะนำ', 'A mentor provides support.'),
    ]
  },
  {
    id: 'foundation-advanced-cam20-test2-section3-human-geography-drill',
    category: 'advanced',
    title: 'Cam 20 Test 2 · Section 3 - Human Geography Skill Drill',
    section: 3,
    levelLabel: 'Advanced · Cam 20 Test 2 style',
    questions: [
      q('cam20t2-geo', 3, 21, 'The students decide their project should focus on _____.', 'They agree that instead of studying a whole country, they should examine one neighbourhood in detail.', 'examine one neighbourhood in detail', 'A', [{ key: 'A', text: 'a local area' }, { key: 'B', text: 'an entire nation' }, { key: 'C', text: 'a transport company' }], 'one neighbourhood', 'local area', 'พื้นที่ท้องถิ่น', 'One neighbourhood is a local area.'),
      q('cam20t2-geo', 3, 22, 'Their first source of data will be _____.', 'The tutor recommends starting with census tables because they already contain useful population figures.', 'starting with census tables', 'B', [{ key: 'A', text: 'interviews' }, { key: 'B', text: 'census data' }, { key: 'C', text: 'newspapers' }], 'census tables', 'census data', 'ข้อมูลสำมะโนประชากร', 'Census tables are census data.'),
      q('cam20t2-geo', 3, 23, 'The students are warned that maps may be _____.', 'Older maps can be misleading because road names and boundaries may have changed.', 'Older maps can be misleading', 'C', [{ key: 'A', text: 'too colourful' }, { key: 'B', text: 'too expensive' }, { key: 'C', text: 'unreliable' }], 'misleading', 'unreliable', 'ไม่น่าเชื่อถือ', 'Misleading maps are unreliable.'),
      q('cam20t2-geo', 3, 24, 'The interviews should include people of different _____.', 'For the interviews, make sure you speak to residents from several age groups, not just students.', 'several age groups', 'A', [{ key: 'A', text: 'ages' }, { key: 'B', text: 'nationalities' }, { key: 'C', text: 'income levels' }], 'age groups', 'different ages', 'ช่วงอายุต่างกัน', 'Several age groups means different ages.'),
      q('cam20t2-geo', 3, 25, 'The presentation needs a clearer _____.', 'The evidence is interesting, but the argument will be stronger if the central question is stated more clearly.', 'central question is stated more clearly', 'B', [{ key: 'A', text: 'bibliography' }, { key: 'B', text: 'research question' }, { key: 'C', text: 'photograph' }], 'central question', 'research question', 'คำถามวิจัย', 'A central question is the research question.'),
      q('cam20t2-geo', 3, 26, 'They will compare old and new _____.', 'To show how the area has changed, they will compare photographs from the 1970s with recent images.', 'compare photographs from the 1970s with recent images', 'D', [{ key: 'A', text: 'prices' }, { key: 'B', text: 'bus routes' }, { key: 'C', text: 'laws' }, { key: 'D', text: 'photographs' }], 'photographs', 'images', 'ภาพถ่าย', 'Photographs and images are the same evidence type here.'),
      q('cam20t2-geo', 3, 27, 'They will use a graph to show changes in _____.', 'A line graph will show how the local population has risen and fallen over time.', 'local population has risen and fallen', 'A', [{ key: 'A', text: 'population' }, { key: 'B', text: 'rainfall' }, { key: 'C', text: 'rent' }, { key: 'D', text: 'traffic' }], 'population', 'graph shows population', 'ประชากร', 'The graph shows population changes.'),
      q('cam20t2-geo', 3, 28, 'They will add a table about _____.', 'A small table comparing rent levels will help explain why some residents have moved away.', 'table comparing rent levels', 'C', [{ key: 'A', text: 'jobs' }, { key: 'B', text: 'schools' }, { key: 'C', text: 'rent' }, { key: 'D', text: 'weather' }], 'rent levels', 'rent', 'ค่าเช่า', 'A table comparing rent levels is about rent.'),
      q('cam20t2-geo', 3, 29, 'The tutor asks them to reduce the amount of _____.', 'There is too much background history, and some of it should be cut so the analysis has more space.', 'too much background history', 'B', [{ key: 'A', text: 'data' }, { key: 'B', text: 'history' }, { key: 'C', text: 'maps' }, { key: 'D', text: 'interviews' }], 'background history', 'reduce history', 'ประวัติความเป็นมา', 'Too much history means they should reduce the history section.'),
      q('cam20t2-geo', 3, 30, 'Their final slide should discuss _____.', 'End by explaining what the case study suggests for future urban planning.', 'future urban planning', 'D', [{ key: 'A', text: 'exam marks' }, { key: 'B', text: 'holiday plans' }, { key: 'C', text: 'museum displays' }, { key: 'D', text: 'urban planning' }], 'future urban planning', 'discuss urban planning', 'การวางผังเมือง', 'The final slide should discuss future urban planning.')
    ]
  },
  {
    id: 'foundation-advanced-cam20-test2-section4-food-trends-drill',
    category: 'advanced',
    title: 'Cam 20 Test 2 · Section 4 - Food Trends Skill Drill',
    section: 4,
    levelLabel: 'Advanced · Cam 20 Test 2 style',
    questions: [
      q('cam20t2-food', 4, 31, 'A major influence on food choice is _____.', 'One powerful influence on what people buy is convenience: many consumers want food that saves time.', 'convenience', 'B', [{ key: 'A', text: 'tradition' }, { key: 'B', text: 'convenience' }, { key: 'C', text: 'weather' }, { key: 'D', text: 'advertising' }], 'convenience', 'saves time', 'ความสะดวก', 'Food that saves time appeals because of convenience.'),
      q('cam20t2-food', 4, 32, 'Ready meals became popular because more people had less time for _____.', 'As working hours changed, many households had less time available for cooking from basic ingredients.', 'less time available for cooking', 'A', [{ key: 'A', text: 'cooking' }, { key: 'B', text: 'shopping' }, { key: 'C', text: 'exercise' }, { key: 'D', text: 'travel' }], 'less time for cooking', 'less time to cook', 'เวลาทำอาหารน้อยลง', 'Less time available for cooking answers the gap.'),
      q('cam20t2-food', 4, 33, 'Consumers are increasingly interested in food with health _____.', 'Labels now often emphasise health benefits, such as added fibre or reduced sugar.', 'health benefits', 'C', [{ key: 'A', text: 'risks' }, { key: 'B', text: 'prices' }, { key: 'C', text: 'benefits' }, { key: 'D', text: 'colours' }], 'health benefits', 'health benefits', 'ประโยชน์ต่อสุขภาพ', 'The passage directly gives health benefits.'),
      q('cam20t2-food', 4, 34, 'Plant-based foods are often marketed as better for the _____.', 'Many plant-based products are promoted as choices that create less damage to the environment.', 'less damage to the environment', 'D', [{ key: 'A', text: 'family' }, { key: 'B', text: 'economy' }, { key: 'C', text: 'restaurant' }, { key: 'D', text: 'environment' }], 'less damage to the environment', 'better for environment', 'ดีต่อสิ่งแวดล้อม', 'Less damage to the environment means better for it.'),
      q('cam20t2-food', 4, 35, 'Price remains a barrier for some _____.', 'Although interest is growing, higher prices still stop some consumers from buying new food products.', 'higher prices still stop some consumers', 'B', [{ key: 'A', text: 'researchers' }, { key: 'B', text: 'consumers' }, { key: 'C', text: 'farmers' }, { key: 'D', text: 'drivers' }], 'consumers', 'barrier for consumers', 'ผู้บริโภค', 'Higher prices stop consumers, so price is a barrier for consumers.'),
      q('cam20t2-food', 4, 36, 'Social media can spread food trends very _____.', 'A new recipe can become popular online within days, so trends now spread extremely quickly.', 'spread extremely quickly', 'A', [{ key: 'A', text: 'quickly' }, { key: 'B', text: 'quietly' }, { key: 'C', text: 'locally' }, { key: 'D', text: 'secretly' }], 'extremely quickly', 'very quickly', 'เร็วมาก', 'Extremely quickly and very quickly are the same.'),
      q('cam20t2-food', 4, 37, 'Companies use packaging to signal _____.', 'Packaging with simple colours and natural images is often used to suggest freshness.', 'suggest freshness', 'C', [{ key: 'A', text: 'danger' }, { key: 'B', text: 'tradition' }, { key: 'C', text: 'freshness' }, { key: 'D', text: 'distance' }], 'suggest freshness', 'signal freshness', 'ความสดใหม่', 'Suggest and signal mean show indirectly.'),
      q('cam20t2-food', 4, 38, 'Researchers warn that claims on labels can be _____.', 'Some label claims sound impressive but may be vague and difficult for shoppers to check.', 'vague and difficult for shoppers to check', 'D', [{ key: 'A', text: 'illegal' }, { key: 'B', text: 'traditional' }, { key: 'C', text: 'scientific' }, { key: 'D', text: 'unclear' }], 'vague', 'unclear', 'ไม่ชัดเจน', 'Vague means unclear.'),
      q('cam20t2-food', 4, 39, 'Future diets may depend more on local _____.', 'Analysts predict that future diets may make greater use of crops grown close to where people live.', 'crops grown close to where people live', 'B', [{ key: 'A', text: 'restaurants' }, { key: 'B', text: 'crops' }, { key: 'C', text: 'machines' }, { key: 'D', text: 'ships' }], 'local crops', 'crops grown close', 'พืชผลท้องถิ่น', 'Crops grown close to people are local crops.'),
      q('cam20t2-food', 4, 40, 'The lecturer says food innovation must balance profit with _____.', 'The lecture concludes that successful innovation must consider commercial success as well as public health.', 'commercial success as well as public health', 'A', [{ key: 'A', text: 'public health' }, { key: 'B', text: 'private cars' }, { key: 'C', text: 'school exams' }, { key: 'D', text: 'tourist numbers' }], 'public health', 'balance profit with health', 'สุขภาพของประชาชน', 'Commercial success means profit; it should be balanced with public health.')
    ]
  }
]
