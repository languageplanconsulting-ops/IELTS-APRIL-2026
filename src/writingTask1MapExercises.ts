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

type MapChangeVerb =
  | 'changed'
  | 'transformed'
  | 'replaced'
  | 'repurposed'
  | 'demolished'
  | 'destroyed'
  | 'added'
  | 'constructed'
  | 'built'

type MapContrast = 'while' | 'whereas' | 'although'

type MapSentenceStarter =
  | 'Interestingly'
  | 'However'
  | 'Surprisingly'
  | 'It is interesting to note that'
  | 'On the other hand'

type MapExerciseSpec = {
  id: string
  promptId: string
  placePhrase: string
  from: string
  to: string
  introFocus: string
  addition: string
  demolition: string
  transformation: string
  body1Area: 'the northern part of the map' | 'the western part of the map'
  body2Area:
    | 'the eastern side of the map'
    | 'the eastern section of the map'
    | 'the southern section of the map'
  body1Contrast: MapContrast
  body1ChangedSubject: string
  body1ChangedPlural: boolean
  body1ChangeVerb: MapChangeVerb
  body1ChangeInto: string
  body1UnchangedSubject: string
  body1UnchangedPlace: string
  body1Starter: MapSentenceStarter
  body1Extra: string
  body2Contrast: MapContrast
  body2ChangedSubject: string
  body2ChangedPlural: boolean
  body2ChangedPlace: string
  body2ChangeVerb: MapChangeVerb
  body2ChangeInto: string
  body2OtherSubject: string
  body2OtherPlace: string
  body2OtherVerb: MapChangeVerb
  body2OtherInto: string
  body2Starter: MapSentenceStarter
  body2Extra: string
}

const CONTRASTS: MapContrast[] = ['while', 'whereas', 'although']

const STARTERS: MapSentenceStarter[] = [
  'Interestingly',
  'However',
  'Surprisingly',
  'It is interesting to note that',
  'On the other hand'
]

const perfectPassive = (plural: boolean, verb: MapChangeVerb) =>
  plural ? `have been ${verb}` : `has been ${verb}`

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
          t('The '),
          sel(`${p}-i0`, ['maps', 'charts', 'tables'], 'maps', 'paraphrase', 'แผนที่เปรียบเทียบใช้ maps ตามแบบเรียน map question'),
          t(' '),
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
          t(' of '),
          typ(`${p}-i2a`, 'place', [spec.placePhrase], 'word-choice', `เติมชื่อสถานที่ “${spec.placePhrase}”`),
          t(' from '),
          sel(`${p}-i2b`, [spec.from, '1900', '2050'], spec.from, 'word-choice', `ปี/ช่วงเริ่มต้นคือ ${spec.from}`),
          t(' to '),
          sel(`${p}-i2c`, [spec.to, 'yesterday', 'never'], spec.to, 'word-choice', `ปี/ช่วงสิ้นสุดคือ ${spec.to}`),
          t(', '),
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
          t('Overall, a '),
          sel(`${p}-o0`, ['number', 'nature', 'nation'], 'number', 'word-choice', 'a number of = หลาย ๆ อย่าง'),
          t(' of '),
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
            'the addition of = การเพิ่มสิ่งก่อสร้างใหม่ (จาก add/construct/build)'
          ),
          t(` of ${spec.addition}, the `),
          sel(
            `${p}-o4`,
            ['demolition', 'decoration', 'declaration'],
            'demolition',
            'word-choice',
            'demolition = การรื้อถอน จาก demolish/destroy'
          ),
          t(` of ${spec.demolition}, and the `),
          sel(
            `${p}-o5`,
            ['transformation', 'transportation', 'translation'],
            'transformation',
            'word-choice',
            'transformation of X into Y = การเปลี่ยนรูปพื้นที่ จาก transform/change/repurpose'
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
            ['Starting with', 'In terms of', 'Despite'],
            'Starting with',
            'transition',
            'Map Body 1 ต้องเปิดด้วย Starting with + ทิศทางเท่านั้น'
          ),
          t(' '),
          sel(
            `${p}-b1a`,
            [
              'the northern part of the map',
              'the western part of the map',
              'the eastern section of the map',
              'the southern section of the map'
            ],
            spec.body1Area,
            'word-choice',
            'Body 1 ใช้ northern หรือ western part of the map ตามแบบเรียน'
          ),
          t(', '),
          sel(
            `${p}-b2`,
            CONTRASTS,
            spec.body1Contrast,
            'transition',
            'ใช้ while / whereas / although เท่านั้น ตามโครงสร้าง S+V, S+V'
          ),
          t(` ${spec.body1ChangedSubject} `),
          typ(
            `${p}-b3`,
            'change',
            [perfectPassive(spec.body1ChangedPlural, spec.body1ChangeVerb)],
            'v3-clause',
            `present perfect passive: ${perfectPassive(spec.body1ChangedPlural, spec.body1ChangeVerb)}`
          ),
          t(' into '),
          typ(`${p}-b4`, 'feature', [spec.body1ChangeInto], 'word-choice', `เติม “${spec.body1ChangeInto}”`),
          t(', '),
          typ(`${p}-b5`, 'feature', [spec.body1UnchangedSubject], 'word-choice', `เติม “${spec.body1UnchangedSubject}”`),
          t(' '),
          sel(
            `${p}-b6`,
            ['located in', 'situated in', 'placed on'],
            'located in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(` ${spec.body1UnchangedPlace} `),
          typ(`${p}-b6a`, 'remain', ['has remained'], 'verb-tense', 'present perfect: has remained'),
          t(' '),
          sel(
            `${p}-b6b`,
            ['unchanged', 'unchange', 'changing'],
            'unchanged',
            'word-choice',
            'remained unchanged = ไม่เปลี่ยนแปลง'
          ),
          t('. '),
          sel(
            `${p}-b7`,
            STARTERS,
            spec.body1Starter,
            'transition',
            'เปิดประโยคถัดไปด้วย Interestingly / However / Surprisingly / It is interesting to note that / On the other hand เท่านั้น'
          ),
          t(spec.body1Starter === 'It is interesting to note that' ? ' ' : ', '),
          typ(`${p}-b8`, 'detail', [spec.body1Extra], 'word-choice', `เติม “${spec.body1Extra}”`),
          t('.')
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
            ['In terms of', 'Starting with', 'Despite'],
            'In terms of',
            'transition',
            'Map Body 2 ต้องเปิดด้วย In terms of + ทิศทางเท่านั้น'
          ),
          t(' '),
          sel(
            `${p}-c1a`,
            [
              'the eastern side of the map',
              'the eastern section of the map',
              'the southern section of the map',
              'the northern part of the map',
              'the western part of the map'
            ],
            spec.body2Area,
            'word-choice',
            'Body 2 ใช้ eastern side/section หรือ southern section of the map ตามแบบเรียน'
          ),
          t(', '),
          sel(
            `${p}-c2`,
            CONTRASTS,
            spec.body2Contrast,
            'transition',
            'ใช้ while / whereas / although เท่านั้น'
          ),
          t(` ${spec.body2ChangedSubject} `),
          sel(
            `${p}-c3`,
            ['located in', 'situated in', 'placed on'],
            'located in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(` ${spec.body2ChangedPlace} `),
          typ(
            `${p}-c4`,
            'change',
            [perfectPassive(spec.body2ChangedPlural, spec.body2ChangeVerb)],
            'v3-clause',
            `present perfect passive: ${perfectPassive(spec.body2ChangedPlural, spec.body2ChangeVerb)}`
          ),
          t(' into '),
          typ(`${p}-c5`, 'feature', [spec.body2ChangeInto], 'word-choice', `เติม “${spec.body2ChangeInto}”`),
          t(', '),
          typ(`${p}-c6`, 'feature', [spec.body2OtherSubject], 'word-choice', `เติม “${spec.body2OtherSubject}”`),
          t(' '),
          sel(
            `${p}-c7`,
            ['located in', 'situated in', 'placed on'],
            'situated in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(` ${spec.body2OtherPlace} `),
          typ(
            `${p}-c8`,
            'change',
            [perfectPassive(false, spec.body2OtherVerb)],
            'v3-clause',
            `present perfect passive: ${perfectPassive(false, spec.body2OtherVerb)}`
          ),
          t(' into '),
          typ(`${p}-c9`, 'feature', [spec.body2OtherInto], 'word-choice', `เติม “${spec.body2OtherInto}”`),
          t('. '),
          sel(
            `${p}-c10`,
            STARTERS,
            spec.body2Starter,
            'transition',
            'เปิดประโยคถัดไปด้วย Interestingly / However / Surprisingly / It is interesting to note that / On the other hand เท่านั้น'
          ),
          t(spec.body2Starter === 'It is interesting to note that' ? ' ' : ', '),
          typ(`${p}-c11`, 'detail', [spec.body2Extra], 'word-choice', `เติม “${spec.body2Extra}”`),
          t('.')
        ]
      }
    ]
  }
}

const ARTICLE_EXPLAIN: Record<'a' | 'an' | 'the', string> = {
  a: 'ใช้ a หน้าคำนามนับได้เอกพจน์ที่ยังไม่เจาะจง และขึ้นต้นด้วยเสียงพยัญชนะ',
  an: 'ใช้ an หน้าคำนามนับได้เอกพจน์ที่ยังไม่เจาะจง และขึ้นต้นด้วยเสียงสระ',
  the: 'ใช้ the เมื่อพูดถึงสิ่งที่เจาะจงหรือถูกกล่าวถึงแล้วในแผนที่/ประโยค'
}

type ArticleHit = {
  start: number
  length: number
  surface: string
  canonical: 'a' | 'an' | 'the'
  globalIndex: number
}

/** Turn ~50% of a/an/the in map essays into select or fill-in quizzes. Idempotent. */
export function quizMapArticles(exercise: WgbExercise): WgbExercise {
  const alreadyQuizzed = exercise.steps.some((step) =>
    step.segments.some(
      (segment) => segment.kind === 'blank' && segment.blank.focus === 'article'
    )
  )
  if (alreadyQuizzed) return exercise

  let globalArticleIndex = 0
  let blankSerial = 0

  const steps = exercise.steps.map((step) => ({
    ...step,
    segments: step.segments.flatMap((segment) => {
      if (segment.kind !== 'text') return [segment]

      const hits: ArticleHit[] = []
      for (const match of segment.text.matchAll(/\b(a|an|the)\b/gi)) {
        if (match.index === undefined) continue
        hits.push({
          start: match.index,
          length: match[0].length,
          surface: match[0],
          canonical: match[0].toLowerCase() as 'a' | 'an' | 'the',
          globalIndex: globalArticleIndex
        })
        globalArticleIndex += 1
      }

      const selected = hits.filter((hit) => hit.globalIndex % 2 === 1)
      if (!selected.length) return [segment]

      const pieces: WgbSegment[] = []
      let cursor = 0
      for (const hit of selected) {
        if (hit.start > cursor) {
          pieces.push({ kind: 'text', text: segment.text.slice(cursor, hit.start) })
        }
        blankSerial += 1
        const blankId = `${exercise.id}-article-${blankSerial}`
        if (blankSerial % 2 === 1) {
          pieces.push({
            kind: 'blank',
            blank: {
              kind: 'select',
              id: blankId,
              options: [...new Set(['a', 'an', 'the', hit.surface])],
              answer: hit.surface,
              focus: 'article',
              explain: ARTICLE_EXPLAIN[hit.canonical]
            }
          })
        } else {
          pieces.push({
            kind: 'blank',
            blank: {
              kind: 'type',
              id: blankId,
              base: 'a/an/the',
              answers: [hit.surface],
              focus: 'article',
              explain: ARTICLE_EXPLAIN[hit.canonical]
            }
          })
        }
        cursor = hit.start + hit.length
      }
      if (cursor < segment.text.length) {
        pieces.push({ kind: 'text', text: segment.text.slice(cursor) })
      }
      return pieces
    })
  }))

  return { ...exercise, steps }
}

export const EXTRA_MAP_GUIDED_BUILDERS: WgbExercise[] = [
  buildMapExercise({
    id: 'gb-grange-park',
    promptId: 'map-grange-park',
    placePhrase: 'Grange Park',
    from: '1920',
    to: 'today',
    introFocus: 'key changes to its layout and facilities',
    addition: 'a café, an amphitheatre and a west entrance',
    demolition: 'the stage seating areas',
    transformation: 'the rose garden into a children’s play area',
    body1Area: 'the western part of the map',
    body2Area: 'the eastern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the stage and seats',
    body1ChangedPlural: true,
    body1ChangeVerb: 'changed',
    body1ChangeInto: 'a café',
    body1UnchangedSubject: 'the glasshouse',
    body1UnchangedPlace: 'the southern part',
    body1Starter: 'Interestingly',
    body1Extra: 'at the centre the fountain has been repurposed into a water feature for visitors',
    body2Contrast: 'although',
    body2ChangedSubject: 'the stage and seats',
    body2ChangedPlural: true,
    body2ChangedPlace: 'the northern part',
    body2ChangeVerb: 'repurposed',
    body2ChangeInto: 'an amphitheatre',
    body2OtherSubject: 'the rose garden',
    body2OtherPlace: 'the south',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a children’s play area',
    body2Starter: 'Surprisingly',
    body2Extra: 'the entrance from Arnold Avenue has also been demolished and replaced by a garden area with trees'
  }),
  buildMapExercise({
    id: 'gb-riverside-village',
    promptId: 'map-riverside-village',
    placePhrase: 'the village of Elmford',
    from: '1990',
    to: '2015',
    introFocus: 'key changes beside the River Lea and around the village centre',
    addition: 'a supermarket and a leisure centre',
    demolition: 'the farmland north of the village centre',
    transformation: 'open farmland into a large housing estate',
    body1Area: 'the northern part of the map',
    body2Area: 'the southern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the farmland',
    body1ChangedPlural: false,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'a housing estate',
    body1UnchangedSubject: 'the bridge',
    body1UnchangedPlace: 'the eastern part',
    body1Starter: 'Interestingly',
    body1Extra: 'new houses have been constructed across the former fields beside the river',
    body2Contrast: 'whereas',
    body2ChangedSubject: 'the old shop',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'repurposed',
    body2ChangeInto: 'a supermarket',
    body2OtherSubject: 'an open plot',
    body2OtherPlace: 'the southern part',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a leisure centre',
    body2Starter: 'However',
    body2Extra: 'more houses have also been built beside the road near the new supermarket'
  }),
  buildMapExercise({
    id: 'gb-school-campus',
    promptId: 'map-school-campus',
    placePhrase: 'a school campus',
    from: '2000',
    to: '2020',
    introFocus: 'key changes to buildings, outdoor areas and parking facilities',
    addition: 'a sports hall, a science block and a library',
    demolition: 'the old playground area',
    transformation: 'the garden into a science block',
    body1Area: 'the northern part of the map',
    body2Area: 'the eastern side of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the playground',
    body1ChangedPlural: false,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'a sports hall',
    body1UnchangedSubject: 'the main building',
    body1UnchangedPlace: 'the centre',
    body1Starter: 'Interestingly',
    body1Extra: 'a new library has been constructed on the northern side of the campus',
    body2Contrast: 'although',
    body2ChangedSubject: 'the garden',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the eastern part',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'a science block',
    body2OtherSubject: 'the southern car park',
    body2OtherPlace: 'the south',
    body2OtherVerb: 'replaced',
    body2OtherInto: 'a smaller parking area',
    body2Starter: 'Surprisingly',
    body2Extra: 'the car park has also been replaced and constructed on the western side of the site'
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
    body1Area: 'the western part of the map',
    body2Area: 'the eastern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the gardens',
    body1ChangedPlural: true,
    body1ChangeVerb: 'transformed',
    body1ChangeInto: 'a café garden',
    body1UnchangedSubject: 'the main hospital building',
    body1UnchangedPlace: 'the centre',
    body1Starter: 'It is interesting to note that',
    body1Extra: 'a café has been added beside the gardens',
    body2Contrast: 'although',
    body2ChangedSubject: 'the staff car park',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the eastern part',
    body2ChangeVerb: 'replaced',
    body2ChangeInto: 'an outpatient wing',
    body2OtherSubject: 'an open western plot',
    body2OtherPlace: 'the west',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a new staff car park',
    body2Starter: 'However',
    body2Extra: 'the outpatient wing has been built on the former parking site'
  }),
  buildMapExercise({
    id: 'gb-harbour-town',
    promptId: 'map-harbour-town',
    placePhrase: 'the harbour of Porthaven',
    from: '1995',
    to: '2010',
    introFocus: 'key changes along the waterfront and inland harbour area',
    addition: 'a marina, a hotel and shops',
    demolition: 'the fishing docks and fish market',
    transformation: 'open land into a car park and public gardens',
    body1Area: 'the northern part of the map',
    body2Area: 'the southern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the fishing docks',
    body1ChangedPlural: true,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'a marina',
    body1UnchangedSubject: 'the harbour water',
    body1UnchangedPlace: 'the centre',
    body1Starter: 'Interestingly',
    body1Extra: 'a hotel has been constructed beside the marina for visiting tourists',
    body2Contrast: 'whereas',
    body2ChangedSubject: 'the fish market',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'replaced',
    body2ChangeInto: 'shops',
    body2OtherSubject: 'the open land',
    body2OtherPlace: 'the inland side',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a car park and public gardens',
    body2Starter: 'On the other hand',
    body2Extra: 'new shops have also been added along the waterfront near the harbour'
  }),
  buildMapExercise({
    id: 'gb-city-library',
    promptId: 'map-city-library',
    placePhrase: 'a city library',
    from: '2010',
    to: '2024',
    introFocus: 'key changes to rooms, facilities and visitor services',
    addition: 'a café, a children’s section and computer stations',
    demolition: 'the newspaper room and storage area',
    transformation: 'storage space into a children’s section',
    body1Area: 'the western part of the map',
    body2Area: 'the eastern side of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the newspaper room',
    body1ChangedPlural: false,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'a café',
    body1UnchangedSubject: 'the office',
    body1UnchangedPlace: 'the southeast corner',
    body1Starter: 'Interestingly',
    body1Extra: 'computer stations have been added in the main reading hall for public use',
    body2Contrast: 'although',
    body2ChangedSubject: 'the storage area',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'a children’s section',
    body2OtherSubject: 'part of the book area',
    body2OtherPlace: 'the east',
    body2OtherVerb: 'repurposed',
    body2OtherInto: 'a computer zone',
    body2Starter: 'Surprisingly',
    body2Extra: 'the children’s section has been built inside the former storage space at the back'
  }),
  buildMapExercise({
    id: 'gb-farm-site',
    promptId: 'map-farm-site',
    placePhrase: 'a farmland site',
    from: '1995',
    to: '2020',
    introFocus: 'key changes after redevelopment into a mixed residential area',
    addition: 'housing, a shopping centre and a park with a lake',
    demolition: 'most of the crop fields and the barn',
    transformation: 'farmland into a residential and commercial area',
    body1Area: 'the northern part of the map',
    body2Area: 'the southern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the crop fields',
    body1ChangedPlural: true,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'housing',
    body1UnchangedSubject: 'the eastern track line',
    body1UnchangedPlace: 'the east',
    body1Starter: 'Interestingly',
    body1Extra: 'a shopping centre has been constructed beside the new houses in the north',
    body2Contrast: 'whereas',
    body2ChangedSubject: 'the barn',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'replaced',
    body2ChangeInto: 'a car park',
    body2OtherSubject: 'the farmhouse site',
    body2OtherPlace: 'the south',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a park with a lake',
    body2Starter: 'However',
    body2Extra: 'a lake has also been added in the eastern park area for local residents'
  }),
  buildMapExercise({
    id: 'gb-sports-centre',
    promptId: 'map-sports-centre',
    placePhrase: 'a sports centre',
    from: '2005',
    to: '2025',
    introFocus: 'key changes to sports facilities and visitor services',
    addition: 'an indoor pool, a gym and a café',
    demolition: 'the outdoor tennis courts',
    transformation: 'the south car park edge into a gym and café',
    body1Area: 'the western part of the map',
    body2Area: 'the eastern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the outdoor tennis courts',
    body1ChangedPlural: true,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'an indoor swimming pool',
    body1UnchangedSubject: 'the main hall',
    body1UnchangedPlace: 'the northern part',
    body1Starter: 'Interestingly',
    body1Extra: 'changing rooms have been constructed beside the pool for swimmers',
    body2Contrast: 'although',
    body2ChangedSubject: 'part of the car park',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'a gym',
    body2OtherSubject: 'the car-park edge',
    body2OtherPlace: 'the south',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a café',
    body2Starter: 'Surprisingly',
    body2Extra: 'the gym has been constructed on the former parking edge near the hall'
  }),
  buildMapExercise({
    id: 'gb-university-campus',
    promptId: 'map-university-campus',
    placePhrase: 'part of a university campus',
    from: '2000',
    to: '2020',
    introFocus: 'key changes to buildings, open space and student facilities',
    addition: 'student flats, a research lab and a bike shelter',
    demolition: 'the open grass area',
    transformation: 'the canteen into a student hub',
    body1Area: 'the northern part of the map',
    body2Area: 'the southern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the open grass area',
    body1ChangedPlural: false,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'student flats',
    body1UnchangedSubject: 'the lecture hall',
    body1UnchangedPlace: 'the northwest',
    body1Starter: 'Interestingly',
    body1Extra: 'a research lab has been constructed beside the flats for science students',
    body2Contrast: 'whereas',
    body2ChangedSubject: 'the canteen',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'repurposed',
    body2ChangeInto: 'a student hub',
    body2OtherSubject: 'the car park',
    body2OtherPlace: 'the south',
    body2OtherVerb: 'replaced',
    body2OtherInto: 'a bike shelter',
    body2Starter: 'On the other hand',
    body2Extra: 'the bike shelter has been built on the former parking site near the hub'
  }),
  buildMapExercise({
    id: 'gb-seaside-village',
    promptId: 'map-seaside-village',
    placePhrase: 'a seaside village',
    from: '1980',
    to: 'today',
    introFocus: 'key changes along the waterfront and inland housing areas',
    addition: 'a hotel, restaurants, holiday apartments and a new promenade',
    demolition: 'the fishing docks and some older houses',
    transformation: 'many houses into modern holiday apartments',
    body1Area: 'the western part of the map',
    body2Area: 'the eastern side of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the fishing docks',
    body1ChangedPlural: true,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'restaurants and a promenade',
    body1UnchangedSubject: 'the beach',
    body1UnchangedPlace: 'the coastal edge',
    body1Starter: 'Interestingly',
    body1Extra: 'a large hotel has been constructed beside the waterfront for visiting tourists',
    body2Contrast: 'although',
    body2ChangedSubject: 'many houses',
    body2ChangedPlural: true,
    body2ChangedPlace: 'the inland side',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'holiday apartments',
    body2OtherSubject: 'a shop',
    body2OtherPlace: 'the village centre',
    body2OtherVerb: 'repurposed',
    body2OtherInto: 'a restaurant',
    body2Starter: 'Surprisingly',
    body2Extra: 'the new promenade has also been added along the former docks for public walking access'
  }),
  buildMapExercise({
    id: 'gb-shopping-mall',
    promptId: 'map-shopping-mall',
    placePhrase: 'a shopping mall',
    from: '2012',
    to: '2024',
    introFocus: 'key changes to retail floors and parking facilities',
    addition: 'a cinema, food court and roof garden',
    demolition: 'most of the outdoor car park',
    transformation: 'open parking into a multi-storey car park',
    body1Area: 'the northern part of the map',
    body2Area: 'the southern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'part of the retail floor',
    body1ChangedPlural: false,
    body1ChangeVerb: 'repurposed',
    body1ChangeInto: 'a cinema',
    body1UnchangedSubject: 'the department store',
    body1UnchangedPlace: 'the northern part',
    body1Starter: 'Interestingly',
    body1Extra: 'a food court has been added inside the shopping mall for shoppers',
    body2Contrast: 'whereas',
    body2ChangedSubject: 'the outdoor car park',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'a multi-storey car park',
    body2OtherSubject: 'the top level',
    body2OtherPlace: 'the roof',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a roof garden',
    body2Starter: 'However',
    body2Extra: 'a smaller outdoor parking strip has remained beside the new multi-storey building'
  }),
  buildMapExercise({
    id: 'gb-train-station',
    promptId: 'map-train-station',
    placePhrase: 'a train station',
    from: '2000',
    to: '2020',
    introFocus: 'key changes to passenger facilities and station access',
    addition: 'a main concourse, coffee shops and bike parking',
    demolition: 'the old ticket hall building',
    transformation: 'the ticket hall into a modern concourse',
    body1Area: 'the western part of the map',
    body2Area: 'the eastern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the old ticket hall',
    body1ChangedPlural: false,
    body1ChangeVerb: 'transformed',
    body1ChangeInto: 'a main concourse',
    body1UnchangedSubject: 'the waiting room',
    body1UnchangedPlace: 'the eastern side',
    body1Starter: 'Interestingly',
    body1Extra: 'new coffee shops have been added inside the main concourse for passengers',
    body2Contrast: 'although',
    body2ChangedSubject: 'an open platform edge',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the east',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'bike parking',
    body2OtherSubject: 'the entrance area',
    body2OtherPlace: 'the west',
    body2OtherVerb: 'replaced',
    body2OtherInto: 'a wider passenger hall',
    body2Starter: 'Surprisingly',
    body2Extra: 'the main platforms have remained unchanged in the southern part of the train station'
  }),
  buildMapExercise({
    id: 'gb-zoo-site',
    promptId: 'map-zoo-site',
    placePhrase: 'a zoo',
    from: '1990',
    to: '2015',
    introFocus: 'key changes to animal habitats and visitor facilities across the site',
    addition: 'a visitor centre, café and larger habitats',
    demolition: 'the small animal cages',
    transformation: 'open yards into safari and wetland habitats',
    body1Area: 'the northern part of the map',
    body2Area: 'the southern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the small cages',
    body1ChangedPlural: true,
    body1ChangeVerb: 'replaced',
    body1ChangeInto: 'safari habitats',
    body1UnchangedSubject: 'the northern trees',
    body1UnchangedPlace: 'the north edge',
    body1Starter: 'Interestingly',
    body1Extra: 'a visitor centre has been constructed at the main entrance for zoo guests',
    body2Contrast: 'whereas',
    body2ChangedSubject: 'the open yards',
    body2ChangedPlural: true,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'wetland habitats',
    body2OtherSubject: 'the bird house',
    body2OtherPlace: 'the east',
    body2OtherVerb: 'repurposed',
    body2OtherInto: 'a larger aviary',
    body2Starter: 'On the other hand',
    body2Extra: 'a café has also been added beside the new visitor centre for visitors'
  }),
  buildMapExercise({
    id: 'gb-factory-site',
    promptId: 'map-factory-site',
    placePhrase: 'a factory site',
    from: '2005',
    to: '2022',
    introFocus: 'key changes after industrial conversion into creative housing',
    addition: 'loft apartments, art studios and a riverside walkway',
    demolition: 'the old loading bay',
    transformation: 'factory buildings into loft apartments and studios',
    body1Area: 'the western part of the map',
    body2Area: 'the eastern side of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the factory and warehouse',
    body1ChangedPlural: true,
    body1ChangeVerb: 'transformed',
    body1ChangeInto: 'loft apartments and art studios',
    body1UnchangedSubject: 'the riverside edge',
    body1UnchangedPlace: 'the east',
    body1Starter: 'Interestingly',
    body1Extra: 'a small café has been added near the river beside the new walkway',
    body2Contrast: 'although',
    body2ChangedSubject: 'the loading bay',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the waterfront',
    body2ChangeVerb: 'replaced',
    body2ChangeInto: 'a riverside walkway',
    body2OtherSubject: 'an empty riverside plot',
    body2OtherPlace: 'the same area',
    body2OtherVerb: 'transformed',
    body2OtherInto: 'a shop',
    body2Starter: 'However',
    body2Extra: 'the riverside walkway has been built along the former loading bay for pedestrians'
  }),
  buildMapExercise({
    id: 'gb-community-centre',
    promptId: 'map-community-centre',
    placePhrase: 'a community centre',
    from: '1998',
    to: 'today',
    introFocus: 'key changes to community facilities and outdoor spaces',
    addition: 'a youth club and outdoor playground',
    demolition: 'the old storage room layout inside',
    transformation: 'storage into a multipurpose hall',
    body1Area: 'the northern part of the map',
    body2Area: 'the southern section of the map',
    body1Contrast: 'while',
    body1ChangedSubject: 'the former storage room',
    body1ChangedPlural: false,
    body1ChangeVerb: 'transformed',
    body1ChangeInto: 'a multipurpose hall',
    body1UnchangedSubject: 'the main hall',
    body1UnchangedPlace: 'the northern part',
    body1Starter: 'Interestingly',
    body1Extra: 'a new youth club has been added beside the main hall for local teenagers',
    body2Contrast: 'whereas',
    body2ChangedSubject: 'the open yard',
    body2ChangedPlural: false,
    body2ChangedPlace: 'the southern part',
    body2ChangeVerb: 'transformed',
    body2ChangeInto: 'an outdoor playground',
    body2OtherSubject: 'the car park',
    body2OtherPlace: 'the east',
    body2OtherVerb: 'replaced',
    body2OtherInto: 'a smaller parking strip',
    body2Starter: 'Surprisingly',
    body2Extra: 'the outdoor playground has been built on the former open yard for local children'
  })
].map(quizMapArticles)
