import type { WgbExercise, WgbSegment, WgbFocus, WgbStep } from './writingGuidedBuilder'

const t = (text: string): WgbSegment => ({ kind: 'text', text })
const sel = (
  id: string,
  options: string[],
  answer: string,
  focus: WgbFocus,
  explain?: string
): WgbSegment => ({ kind: 'blank', blank: { kind: 'select', id, options, answer, focus, explain } })
const typ = (
  id: string,
  base: string,
  answers: string[],
  focus: WgbFocus,
  explain?: string
): WgbSegment => ({ kind: 'blank', blank: { kind: 'type', id, base, answers, focus, explain } })

const ROLE_LABEL_TH: Record<WgbStep['role'], string> = {
  intro: 'Introduction',
  overview: 'Overview',
  body1: 'Body Paragraph 1',
  body2: 'Body Paragraph 2'
}

const HINT_PARAPHRASE = 'เลือกคำ paraphrase ที่เหมาะสมที่สุด (ความหมายเดียวกับโจทย์)'
const HINT_CONJUGATE = 'พิมพ์คำกริยาที่ผันรูปให้ถูกต้อง — คำในวงเล็บคือรูปพื้นฐาน'

type MapExerciseSpec = {
  id: string
  promptId: string
  /** Full place phrase used after “transformation of …” e.g. "Grange Park" / "the village of Elmford" */
  placePhrase: string
  from: string
  to: string
  introFocus: string
  addition: string
  demolition: string
  transformation: string
  body1PassiveSubject: string
  body1PassiveBy: string
  body1SecondClause: string
  body1WhileClause: string
  demolishSubject: string
  replaceWith: string
  contrastBecame: string
  whereasBecame: string
}

function buildMapExercise(spec: MapExerciseSpec): WgbExercise {
  const p = spec.id.replace(/^gb-/, 'm')
  return {
    id: spec.id,
    promptId: spec.promptId,
    steps: [
      {
        id: `${p}-intro`,
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The maps '),
          sel(
            `${p}-i1`,
            ['compare', 'argue', 'promise'],
            'compare',
            'paraphrase',
            'compare the transformation = เปรียบเทียบการเปลี่ยนแปลงตามแบบแผนแผนที่'
          ),
          t(' the '),
          sel(
            `${p}-i2`,
            ['transformation', 'celebration', 'temperature'],
            'transformation',
            'paraphrase',
            'transformation = การเปลี่ยนแปลงของสถานที่ ตรงแบบแผนแผนที่'
          ),
          t(` of ${spec.placePhrase} from ${spec.from} to ${spec.to}, `),
          typ(
            `${p}-i3`,
            'focus',
            ['focusing'],
            'ving-clause',
            'หลังคอมมาใช้ V-ing (focusing) — complex เดียวของบทนำ'
          ),
          t(` on ${spec.introFocus}.`)
        ]
      },
      {
        id: `${p}-overview`,
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, a number of '),
          sel(
            `${p}-o1`,
            ['transformations', 'temperatures', 'celebrations'],
            'transformations',
            'word-choice',
            'transformations = การเปลี่ยนแปลงหลายจุด ตามแบบแผน overview ของแผนที่'
          ),
          t(' '),
          typ(
            `${p}-o2`,
            'observe',
            ['can be observed'],
            'v3-clause',
            'passive เดียวของ overview: can be observed'
          ),
          t(', including the '),
          sel(
            `${p}-o3`,
            ['addition', 'additioning', 'add'],
            'addition',
            'word-choice',
            'the addition of = การเพิ่มสิ่งก่อสร้างใหม่'
          ),
          t(` of ${spec.addition}, the `),
          sel(
            `${p}-o4`,
            ['demolition', 'decoration', 'declaration'],
            'demolition',
            'word-choice',
            'demolition = การรื้อถอน'
          ),
          t(` of ${spec.demolition}, and the `),
          sel(
            `${p}-o5`,
            ['transformation', 'transportation', 'translation'],
            'transformation',
            'word-choice',
            'transformation of X into Y = การเปลี่ยนรูปพื้นที่'
          ),
          t(` of ${spec.transformation}.`)
        ]
      },
      {
        id: `${p}-body1`,
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(
            `${p}-b1`,
            ['Interestingly', 'Therefore', 'For example'],
            'Interestingly',
            'transition',
            'เปิดด้วย transition ที่อนุญาต'
          ),
          t(`, ${spec.body1PassiveSubject} `),
          typ(
            `${p}-b2`,
            'occupy',
            ['was occupied'],
            'v3-clause',
            'complex #1: past passive'
          ),
          t(` by ${spec.body1PassiveBy}. `),
          sel(
            `${p}-b3`,
            ['Likewise', 'Therefore', 'For example'],
            'Likewise',
            'transition',
            'Likewise = ในทำนองเดียวกัน'
          ),
          t(`, ${spec.body1SecondClause}, `),
          sel(
            `${p}-b4`,
            ['while', 'because', 'unless'],
            'while',
            'transition',
            'complex #2: while เท่านั้น'
          ),
          t(` ${spec.body1WhileClause}.`)
        ]
      },
      {
        id: `${p}-body2`,
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(
            `${p}-c1`,
            ['However', 'Therefore', 'For example'],
            'However',
            'transition',
            'However = เปลี่ยนไปสู่สภาพหลังพัฒนา'
          ),
          t(`, ${spec.demolishSubject} `),
          typ(
            `${p}-c2`,
            'demolish',
            ['were demolished'],
            'v3-clause',
            'complex #1: were demolished'
          ),
          t(', '),
          typ(
            `${p}-c3`,
            'replace',
            ['replaced'],
            'v3-clause',
            'comma + V3 (replaced by …)'
          ),
          t(` by ${spec.replaceWith}. `),
          sel(
            `${p}-c4`,
            ['In contrast', 'Therefore', 'For example'],
            'In contrast',
            'transition',
            'In contrast = เทียบการเปลี่ยนแปลงอื่น'
          ),
          t(`, ${spec.contrastBecame}, `),
          sel(
            `${p}-c5`,
            ['whereas', 'because', 'so'],
            'whereas',
            'transition',
            'complex #2: whereas'
          ),
          t(` ${spec.whereasBecame}.`)
        ]
      }
    ]
  }
}

export const EXTRA_MAP_GUIDED_BUILDERS: WgbExercise[] = [
  buildMapExercise({
    id: 'gb-grange-park',
    promptId: 'map-grange-park',
    placePhrase: 'Grange Park',
    from: '1920',
    to: 'today',
    introFocus: 'key changes to its layout and facilities',
    addition: 'a café and a west entrance',
    demolition: 'the stage seating areas',
    transformation: 'the rose garden into a children’s play area',
    body1PassiveSubject: 'the centre of the park',
    body1PassiveBy: 'a fountain',
    body1SecondClause: 'stage seating stood on the east and west sides',
    body1WhileClause: 'a rose garden and a glasshouse lay to the south',
    demolishSubject: 'the stage seating areas',
    replaceWith: 'an amphitheatre and a café',
    contrastBecame: 'the rose garden became a children’s play area',
    whereasBecame: 'the main entrance was moved to Eldon Street'
  }),
  buildMapExercise({
    id: 'gb-riverside-village',
    promptId: 'map-riverside-village',
    placePhrase: 'the village of Elmford',
    from: '1990',
    to: '2015',
    introFocus: 'key changes beside the River Lea',
    addition: 'a supermarket and a leisure centre',
    demolition: 'the farmland north of the village',
    transformation: 'open farmland into a housing estate',
    body1PassiveSubject: 'the north of Elmford',
    body1PassiveBy: 'farmland',
    body1SecondClause: 'houses and a small shop stood south of the road',
    body1WhileClause: 'a bridge crossed the River Lea to the east',
    demolishSubject: 'the farmland and warehouses on the north side',
    replaceWith: 'a large housing estate',
    contrastBecame: 'the old shop became a supermarket with a leisure centre',
    whereasBecame: 'the bridge across the river remained unchanged'
  }),
  buildMapExercise({
    id: 'gb-school-campus',
    promptId: 'map-school-campus',
    placePhrase: 'a school campus',
    from: '2000',
    to: '2020',
    introFocus: 'key changes to buildings and outdoor areas',
    addition: 'a sports hall, a science block and a library',
    demolition: 'the playground',
    transformation: 'the garden into a science block',
    body1PassiveSubject: 'the middle of the campus',
    body1PassiveBy: 'the main building',
    body1SecondClause: 'a playground covered the north side',
    body1WhileClause: 'a garden and a southern car park completed the site',
    demolishSubject: 'the playground and the southern car park',
    replaceWith: 'a sports hall and a new library',
    contrastBecame: 'the garden became a science block',
    whereasBecame: 'the staff car park was moved to the west side'
  }),
  buildMapExercise({
    id: 'gb-hospital-site',
    promptId: 'map-hospital-site',
    placePhrase: "St Mary's Hospital",
    from: '1985',
    to: 'today',
    introFocus: 'key changes to buildings, parking and gardens',
    addition: 'an outpatient wing and a café garden',
    demolition: 'the old east-side staff car park',
    transformation: 'the former car-park site into an outpatient wing',
    body1PassiveSubject: 'the centre of the site',
    body1PassiveBy: 'the main hospital building',
    body1SecondClause: 'a staff car park filled the east side',
    body1WhileClause: 'gardens lined the north of the hospital',
    demolishSubject: 'the east-side staff parking spaces',
    replaceWith: 'a new outpatient wing',
    contrastBecame: 'gardens expanded beside a new café',
    whereasBecame: 'the staff car park was relocated to the west'
  }),
  buildMapExercise({
    id: 'gb-harbour-town',
    promptId: 'map-harbour-town',
    placePhrase: 'the harbour of Porthaven',
    from: '1995',
    to: '2010',
    introFocus: 'key changes along the waterfront',
    addition: 'a marina, a hotel and shops',
    demolition: 'the fishing docks and fish market',
    transformation: 'open land into a car park and public gardens',
    body1PassiveSubject: 'the waterfront',
    body1PassiveBy: 'fishing docks and a fish market',
    body1SecondClause: 'open land and warehouses covered the inland side',
    body1WhileClause: 'Quay Road ran between the land and the harbour',
    demolishSubject: 'the fishing docks and the fish market',
    replaceWith: 'a marina, a hotel and a row of shops',
    contrastBecame: 'the open land became a car park with public gardens',
    whereasBecame: 'the harbour water itself remained in place'
  })
]
