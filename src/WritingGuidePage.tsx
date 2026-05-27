import { useMemo, useState, type CSSProperties } from 'react'
import './WritingGuidePage.css'
import {
  WRITING_TASK1_SECTIONS,
  WRITING_TASK2_TYPES,
  WRITING_TIMELINE_PRACTICE_PROMPTS,
  WRITING_TASK1_TYPE_INFO,
  WRITING_TASK2_TYPE_INFO,
  WRITING_FEATURED_TASK1,
  WRITING_FEATURED_TASK2,
  WRITING_MONTHLY_SETS_2026,
  WRITING_BAND7_TASK1_SAMPLE,
  WRITING_BAND7_TASK2_SAMPLE,
  IELTS_TASK1_SUMMARY_INSTRUCTION,
  IELTS_TASK1_TIME_NOTE,
  IELTS_TASK1_WORD_LIMIT,
  getIeltsTask1OpeningLine,
  type WritingGuideChipGroup,
  type WritingGuideStructure,
  type WritingTask1Section,
  type WritingTimelinePracticePrompt,
  type WritingBand7Highlight,
  type WritingBand7Sample
} from './writingGuideData'

type WritingGuidePageProps = {
  onBackHome: () => void
}

type WritingFlow =
  | { step: 'task-pick' }
  | { step: 'task1-categories' }
  | { step: 'task1-questions'; categoryId: string }
  | { step: 'task1-exam'; categoryId: string; promptId: string }
  | { step: 'task1-guide'; categoryId: string }
  | { step: 'task2-types' }

const accentClass = (accent: WritingTask1Section['accent']) => `writingGuideAccent-${accent}`

const CHART_SIZE = { width: 680, height: 280 }
const CHART_PAD = { top: 36, right: 28, bottom: 48, left: 64 }

const getNiceYScale = (values: number[]) => {
  const dataMax = Math.max(...values, 1)
  const roughTop = dataMax * 1.12
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughTop)))
  const top = Math.ceil(roughTop / magnitude) * magnitude
  const step = top / 4
  const ticks = Array.from({ length: 5 }, (_, index) => Math.round(step * index))
  return { min: 0, max: top, ticks }
}

function buildPlotPoints(values: number[], yMax: number) {
  const plotWidth = CHART_SIZE.width - CHART_PAD.left - CHART_PAD.right
  const plotHeight = CHART_SIZE.height - CHART_PAD.top - CHART_PAD.bottom

  return values.map((value, index) => {
    const x =
      CHART_PAD.left + (values.length <= 1 ? plotWidth / 2 : (index / (values.length - 1)) * plotWidth)
    const y = CHART_PAD.top + plotHeight - (value / yMax) * plotHeight
    return { x, y, value }
  })
}

function WritingIeltsYAxis({ ticks, yMax, label }: { ticks: number[]; yMax: number; label: string }) {
  const plotHeight = CHART_SIZE.height - CHART_PAD.top - CHART_PAD.bottom
  return (
    <>
      {ticks.map((tick) => {
        const y = CHART_PAD.top + plotHeight - (tick / yMax) * plotHeight
        return (
          <g key={tick}>
            <line
              x1={CHART_PAD.left}
              y1={y}
              x2={CHART_SIZE.width - CHART_PAD.right}
              y2={y}
              className="writingIeltsChartGridLine"
            />
            <text x={CHART_PAD.left - 8} y={y + 4} className="writingIeltsChartTick" textAnchor="end">
              {tick}
            </text>
          </g>
        )
      })}
      <text
        x={16}
        y={CHART_PAD.top + plotHeight / 2}
        className="writingIeltsChartAxisTitle"
        textAnchor="middle"
        transform={`rotate(-90 16 ${CHART_PAD.top + plotHeight / 2})`}
      >
        {label}
      </text>
      <line
        x1={CHART_PAD.left}
        y1={CHART_PAD.top}
        x2={CHART_PAD.left}
        y2={CHART_SIZE.height - CHART_PAD.bottom}
        className="writingIeltsChartAxisLine"
      />
      <line
        x1={CHART_PAD.left}
        y1={CHART_SIZE.height - CHART_PAD.bottom}
        x2={CHART_SIZE.width - CHART_PAD.right}
        y2={CHART_SIZE.height - CHART_PAD.bottom}
        className="writingIeltsChartAxisLine"
      />
      <text
        x={(CHART_PAD.left + CHART_SIZE.width - CHART_PAD.right) / 2}
        y={CHART_SIZE.height - 8}
        className="writingIeltsChartAxisTitle"
        textAnchor="middle"
      >
        Year
      </text>
    </>
  )
}

function WritingLineGraphSvg({ prompt }: { prompt: WritingTimelinePracticePrompt }) {
  const { max: yMax, ticks } = getNiceYScale(prompt.values)
  const points = buildPlotPoints(prompt.values, yMax)
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

  return (
    <figure className="writingIeltsFigure">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <svg
        viewBox={`0 0 ${CHART_SIZE.width} ${CHART_SIZE.height}`}
        className="writingIeltsChartSvg"
        role="img"
        aria-label={`Line graph showing ${prompt.chartCaption}`}
      >
        <WritingIeltsYAxis ticks={ticks} yMax={yMax} label={prompt.yAxisLabel} />
        <path d={linePath} className="writingIeltsChartLine" />
        {points.map((point, index) => (
          <g key={`${prompt.years[index]}-${point.value}`}>
            <rect x={point.x - 4} y={point.y - 4} width={8} height={8} className="writingIeltsChartMarker" />
            <text
              x={point.x}
              y={CHART_SIZE.height - CHART_PAD.bottom + 22}
              className="writingIeltsChartTick"
              textAnchor="middle"
            >
              {prompt.years[index]}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

function WritingBarChartSvg({ prompt }: { prompt: WritingTimelinePracticePrompt }) {
  const { max: yMax, ticks } = getNiceYScale(prompt.values)
  const barWidth = 52
  const gap = 26
  const plotHeight = CHART_SIZE.height - CHART_PAD.top - CHART_PAD.bottom
  const totalWidth = prompt.values.length * barWidth + (prompt.values.length - 1) * gap
  const startX = (CHART_SIZE.width - totalWidth) / 2

  return (
    <figure className="writingIeltsFigure">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <svg
        viewBox={`0 0 ${CHART_SIZE.width} ${CHART_SIZE.height}`}
        className="writingIeltsChartSvg"
        role="img"
        aria-label={`Bar chart showing ${prompt.chartCaption}`}
      >
        <WritingIeltsYAxis ticks={ticks} yMax={yMax} label={prompt.yAxisLabel} />
        {prompt.values.map((value, index) => {
          const height = (value / yMax) * plotHeight
          const x = startX + index * (barWidth + gap)
          const y = CHART_PAD.top + plotHeight - height
          return (
            <g key={prompt.years[index]}>
              <rect x={x} y={y} width={barWidth} height={height} className="writingIeltsChartBar" />
              <text
                x={x + barWidth / 2}
                y={CHART_SIZE.height - CHART_PAD.bottom + 22}
                className="writingIeltsChartTick"
                textAnchor="middle"
              >
                {prompt.years[index]}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

function WritingTableChart({ prompt }: { prompt: WritingTimelinePracticePrompt }) {
  return (
    <figure className="writingIeltsFigure writingIeltsFigure-table">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <table className="writingIeltsTable">
        <thead>
          <tr>
            <th scope="col">Year</th>
            {prompt.years.map((year) => (
              <th scope="col" key={year}>
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{prompt.valueLabel}</th>
            {prompt.values.map((value, index) => (
              <td key={`${prompt.id}-${prompt.years[index]}`}>{value}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="writingIeltsTableNote">Units: {prompt.unit}</p>
    </figure>
  )
}

function WritingIeltsTask1Paper({
  prompt,
  answer,
  onAnswerChange
}: {
  prompt: WritingTimelinePracticePrompt
  answer: string
  onAnswerChange: (value: string) => void
}) {
  return (
    <article className="writingIeltsPaper">
      <header className="writingIeltsPaperHead">
        <p className="writingIeltsTaskLabel">Writing Task 1</p>
        <p className="writingIeltsTimeNote">{IELTS_TASK1_TIME_NOTE}</p>
      </header>

      <div className="writingIeltsPaperBody">
        <p className="writingIeltsPromptLine">{getIeltsTask1OpeningLine(prompt)}</p>
        <p className="writingIeltsPromptLine">{IELTS_TASK1_SUMMARY_INSTRUCTION}</p>
        <p className="writingIeltsPromptLine writingIeltsPromptLine-limit">{IELTS_TASK1_WORD_LIMIT}</p>

        {prompt.chartType === 'line-graph' ? <WritingLineGraphSvg prompt={prompt} /> : null}
        {prompt.chartType === 'bar-chart' ? <WritingBarChartSvg prompt={prompt} /> : null}
        {prompt.chartType === 'table' ? <WritingTableChart prompt={prompt} /> : null}
      </div>

      <label className="writingIeltsAnswerSheet">
        <span>Your response</span>
        <textarea
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="Write your Task 1 report here…"
          rows={12}
        />
      </label>
    </article>
  )
}

function WritingVocabularyHelper({
  chipGroups,
  structures
}: {
  chipGroups?: WritingGuideChipGroup[]
  structures?: WritingGuideStructure[]
}) {
  return (
    <div className="writingGuideHelperPanel">
      <p className="writingGuideHelperIntro">คำศัพท์และโครงสร้างแนะนำ — เปิดเมื่อต้องการตัวช่วยเท่านั้น</p>
      {chipGroups?.length ? (
        <div className="writingGuideChipGroups">
          {chipGroups.map((group) => (
            <article key={group.id} className="writingGuideChipGroup">
              <div className="writingGuideChipGroupHead">
                <h4>{group.label}</h4>
                {group.hint ? <p>{group.hint}</p> : null}
              </div>
              <div className="writingGuideChipRow">
                {group.chips.map((chip) => (
                  <span key={chip} className="writingGuideChip">
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {structures?.length ? (
        <div className="writingGuideStructureBlock">
          <p className="writingGuideStructureEyebrow">Complex structures</p>
          <div className="writingGuideStructureGrid">
            {structures.map((item) => (
              <article key={item.id} className="writingGuideStructureCard">
                <span className="writingGuideStructureLabel">{item.label}</span>
                <code>{item.template}</code>
                {item.note ? <p>{item.note}</p> : null}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function WritingFlowHead({
  eyebrow,
  title,
  subtitle,
  onBack,
  backLabel
}: {
  eyebrow: string
  title: string
  subtitle?: string
  onBack: () => void
  backLabel: string
}) {
  return (
    <div className="writingGuideFlowHead">
      <button type="button" className="writingGuideFlowBack" onClick={onBack}>
        ← {backLabel}
      </button>
      <div>
        <p className="writingGuideStructureEyebrow">{eyebrow}</p>
        <h3 className="writingGuideFlowTitle">{title}</h3>
        {subtitle ? <p className="writingGuideFlowSub">{subtitle}</p> : null}
      </div>
    </div>
  )
}

// ── Band 7 sample helper components ──────────────────────────────────────

const CHART_TYPE_ICON: Record<string, string> = {
  'line-graph': '📈',
  'bar-chart': '📊',
  'pie-chart': '🥧',
  'table': '📋',
  'map': '🗺',
  'process': '⚙'
}

function WlpHighlightInline({ text, highlights }: { text: string; highlights: WritingBand7Highlight[] }) {
  const [openPhrase, setOpenPhrase] = useState<string | null>(null)
  const parts: Array<{ type: 'text' | 'mark'; content: string; h?: WritingBand7Highlight }> = []
  let remaining = text
  const sorted = [...highlights].sort(
    (a, b) => text.indexOf(a.phrase) - text.indexOf(b.phrase)
  )
  for (const h of sorted) {
    const idx = remaining.indexOf(h.phrase)
    if (idx < 0) continue
    if (idx > 0) parts.push({ type: 'text', content: remaining.slice(0, idx) })
    parts.push({ type: 'mark', content: h.phrase, h })
    remaining = remaining.slice(idx + h.phrase.length)
  }
  if (remaining) parts.push({ type: 'text', content: remaining })

  return (
    <span className="wlpSegmentText">
      {parts.map((part, i) => {
        if (part.type === 'mark' && part.h) {
          const isOpen = openPhrase === part.content
          return (
            <span key={i} className="wlpInlineWrap">
              <mark
                className={`wlpMark wlpMark-${part.h.kind} ${isOpen ? 'is-open' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => setOpenPhrase(isOpen ? null : part.content)}
                onKeyDown={(e) => e.key === 'Enter' && setOpenPhrase(isOpen ? null : part.content)}
              >
                {part.content}
              </mark>
              {isOpen && (
                <span className="wlpMarkPopover">
                  <strong>{part.h.labelTh}</strong>
                  <span>{part.h.descTh}</span>
                  {part.h.exampleTh && <em>ตัวอย่าง: {part.h.exampleTh}</em>}
                </span>
              )}
            </span>
          )
        }
        return <span key={i}>{part.content}</span>
      })}
    </span>
  )
}

function Band7SampleView({ sample }: { sample: WritingBand7Sample }) {
  return (
    <div className="wlpBand7Sample">
      <div className="wlpBand7Header">
        <div className="wlpBand7HeaderLeft">
          <span className="wlpBand7Badge">Band {sample.band} · {sample.questionTypeTh}</span>
          <p className="wlpBand7Meta">{sample.wordCount} คำ · {sample.timeNote}</p>
        </div>
        <div className="wlpBand7LegendRow">
          <span className="wlpBand7Legend wlpBand7Legend-vocab">คำศัพท์</span>
          <span className="wlpBand7Legend wlpBand7Legend-grammar">ไวยากรณ์</span>
          <span className="wlpBand7Legend wlpBand7Legend-structure">โครงสร้าง</span>
        </div>
      </div>

      <div className="wlpBand7Prompt">
        <p className="wlpBand7PromptLabel">โจทย์</p>
        <p className="wlpBand7PromptText">{sample.promptText}</p>
      </div>

      <div className="wlpBand7Segments">
        {sample.segments.map((seg) => (
          <div key={seg.id} className="wlpBand7Segment">
            <p className="wlpBand7SegLabel">{seg.labelTh}</p>
            <div className="wlpBand7SegText">
              <WlpHighlightInline text={seg.text} highlights={seg.highlights} />
            </div>
          </div>
        ))}
      </div>

      <div className="wlpBand7Tips">
        <p className="wlpBand7TipsLabel">สรุปเทคนิคที่ใช้</p>
        <ul className="wlpBand7TipsList">
          {sample.summaryPoints.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function WlpBand7Tabs() {
  const [activeTask, setActiveTask] = useState<1 | 2>(1)
  return (
    <div className="wlpBand7TabsWrap">
      <div className="wlpBand7TabRow">
        <button
          type="button"
          className={`wlpBand7Tab ${activeTask === 1 ? 'is-active' : ''}`}
          onClick={() => setActiveTask(1)}
        >
          Task 1 — Line Graph
        </button>
        <button
          type="button"
          className={`wlpBand7Tab ${activeTask === 2 ? 'is-active' : ''}`}
          onClick={() => setActiveTask(2)}
        >
          Task 2 — Discuss Both Views
        </button>
      </div>
      <Band7SampleView sample={activeTask === 1 ? WRITING_BAND7_TASK1_SAMPLE : WRITING_BAND7_TASK2_SAMPLE} />
    </div>
  )
}

export function WritingGuidePage({ onBackHome }: WritingGuidePageProps) {
  const [flow, setFlow] = useState<WritingFlow>({ step: 'task-pick' })
  const [timelineAnswers, setTimelineAnswers] = useState<Record<string, string>>({})
  const [showHelper, setShowHelper] = useState(false)

  const activeCategory = useMemo(() => {
    if (
      flow.step === 'task-pick' ||
      flow.step === 'task2-types' ||
      flow.step === 'task1-categories'
    ) {
      return null
    }
    return WRITING_TASK1_SECTIONS.find((section) => section.id === flow.categoryId) || null
  }, [flow])

  const activePrompt = useMemo(() => {
    if (flow.step !== 'task1-exam') return null
    const prompts = activeCategory?.practicePrompts || WRITING_TIMELINE_PRACTICE_PROMPTS
    return prompts.find((prompt) => prompt.id === flow.promptId) || null
  }, [flow, activeCategory])

  const goBack = () => {
    setShowHelper(false)
    if (flow.step === 'task-pick') {
      onBackHome()
      return
    }
    if (flow.step === 'task1-categories' || flow.step === 'task2-types') {
      setFlow({ step: 'task-pick' })
      return
    }
    if (flow.step === 'task1-questions' || flow.step === 'task1-guide') {
      setFlow({ step: 'task1-categories' })
      return
    }
    if (flow.step === 'task1-exam') {
      setFlow({ step: 'task1-questions', categoryId: flow.categoryId })
    }
  }

  const openCategory = (section: WritingTask1Section) => {
    setShowHelper(false)
    if (section.practicePrompts?.length) {
      setFlow({ step: 'task1-questions', categoryId: section.id })
      return
    }
    setFlow({ step: 'task1-guide', categoryId: section.id })
  }

  return (
    <section className="writingGuidePage">
      <div className="writingGuideAmbient" aria-hidden="true">
        <span className="writingGuideOrb writingGuideOrb-a" />
        <span className="writingGuideOrb writingGuideOrb-b" />
        <span className="writingGuideGridGlow" />
      </div>

      {flow.step !== 'task-pick' ? (
        <header className="writingGuideHeader">
          <div>
            <p className="sectionLabel">English Plan Writing</p>
            <h2>IELTS Writing Practice</h2>
            <p className="writingGuideLead">เลือก Task → หมวด → ข้อสอบ ทีละขั้น</p>
          </div>
        </header>
      ) : null}

      <div className="writingGuideFlowStage">
        {flow.step === 'task-pick' ? (
          <div className="wlpShell">

            {/* ── Hero ─────────────────────────────────────── */}
            <section className="wlpHero">
              <p className="wlpKicker">IELTS Academic Writing · English Plan Institute</p>
              <h1 className="wlpHeroH1">ฝึก IELTS Academic Writing<br />อย่างเป็นระบบ ตรงกับข้อสอบจริง</h1>
              <p className="wlpHeroLead">
                รวมโจทย์ Task 1 และ Task 2 จากการสอบจริง พร้อมคำอธิบายประเภทคำถาม
                และโครงสร้างการเขียนที่ช่วยให้ได้คะแนน Band 7+
              </p>
              <div className="wlpHeroActions">
                <button
                  type="button"
                  className="wlpBtn wlpBtn-primary"
                  onClick={() => setFlow({ step: 'task1-categories' })}
                >
                  เริ่มฝึก Task 1
                </button>
                <button
                  type="button"
                  className="wlpBtn wlpBtn-secondary"
                  onClick={() => setFlow({ step: 'task2-types' })}
                >
                  เริ่มฝึก Task 2
                </button>
              </div>
              <div className="wlpHeroMeta">
                <span>Task 1 · 150 คำ · ~20 นาที</span>
                <span className="wlpHeroMetaDot" />
                <span>Task 2 · 250 คำ · ~40 นาที</span>
                <span className="wlpHeroMetaDot" />
                <span>Academic Track</span>
              </div>
            </section>

            {/* ── Task 1 — Question Types ──────────────────── */}
            <section className="wlpSection">
              <div className="wlpSectionHead">
                <p className="wlpSectionKicker">Task 1 · Academic Writing</p>
                <h2 className="wlpSectionH2">ประเภทคำถาม Task 1 ที่ออกสอบจริง</h2>
                <p className="wlpSectionLead">
                  Task 1 ให้เวลา 20 นาที เขียนอย่างน้อย 150 คำ บรรยายข้อมูลจากกราฟหรือแผนภาพที่กำหนดให้
                </p>
              </div>
              <div className="wlpTypeGrid">
                {WRITING_TASK1_TYPE_INFO.map((type) => (
                  <article key={type.id} className="wlpTypeCard">
                    <span className="wlpTypeTag">{type.badge}</span>
                    <h3 className="wlpTypeTitle">{type.titleTh}</h3>
                    <p className="wlpTypeDesc">{type.descTh}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* ── Task 2 — Question Types ──────────────────── */}
            <section className="wlpSection">
              <div className="wlpSectionHead">
                <p className="wlpSectionKicker">Task 2 · Academic Writing</p>
                <h2 className="wlpSectionH2">ประเภทคำถาม Task 2 ที่ออกสอบจริง</h2>
                <p className="wlpSectionLead">
                  Task 2 ให้เวลา 40 นาที เขียนอย่างน้อย 250 คำ คิดเป็น 2 ใน 3 ของคะแนน Writing ทั้งหมด
                </p>
              </div>
              <div className="wlpTypeGrid wlpTypeGrid-task2">
                {WRITING_TASK2_TYPE_INFO.map((type) => (
                  <article key={type.id} className="wlpTypeCard wlpTypeCard-task2">
                    <span className="wlpTypeTag wlpTypeTag-task2">Task 2</span>
                    <h3 className="wlpTypeTitle">{type.titleTh}</h3>
                    <p className="wlpTypeDesc">{type.descTh}</p>
                    <ul className="wlpTypeFocus">
                      {type.focusTh.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            {/* ── Recent Practice Questions ─────────────────── */}
            <section className="wlpSection wlpSection-recent">
              <div className="wlpSectionHead">
                <p className="wlpSectionKicker">โจทย์ประจำเดือน · January – June 2026</p>
                <h2 className="wlpSectionH2">โจทย์จากการสอบจริง มกราคม – มิถุนายน 2566</h2>
                <p className="wlpSectionLead">
                  ตัวอย่างโจทย์ IELTS Academic Writing ที่รวบรวมจากการสอบในประเทศไทยและภูมิภาค APAC
                </p>
              </div>

              <div className="wlpRecentGrid">

                {/* Task 1 card */}
                <article className="wlpRecentCard">
                  <div className="wlpRecentCardHead">
                    <span className="wlpRecentBadge wlpRecentBadge-task1">Task 1</span>
                    <span className="wlpRecentChartBadge">{WRITING_FEATURED_TASK1.chartTypeLabel}</span>
                    <span className="wlpRecentMonth">{WRITING_FEATURED_TASK1.month}</span>
                  </div>
                  <h3 className="wlpRecentTitle">{WRITING_FEATURED_TASK1.prompt.title}</h3>
                  <p className="wlpRecentPrompt">{WRITING_FEATURED_TASK1.promptLine}</p>
                  <p className="wlpRecentInstruction">{WRITING_FEATURED_TASK1.instruction}</p>
                  <p className="wlpRecentWordLimit">{WRITING_FEATURED_TASK1.wordLimit}</p>

                  {/* Inline line graph preview */}
                  <div className="wlpChartWrap" aria-hidden="true">
                    <WritingLineGraphSvg prompt={WRITING_FEATURED_TASK1.prompt} />
                  </div>

                  <button
                    type="button"
                    className="wlpRecentAction"
                    onClick={() => {
                      setFlow({ step: 'task1-categories' })
                    }}
                  >
                    ฝึกทำ Task 1 →
                  </button>
                </article>

                {/* Task 2 card */}
                <article className="wlpRecentCard wlpRecentCard-task2">
                  <div className="wlpRecentCardHead">
                    <span className="wlpRecentBadge wlpRecentBadge-task2">Task 2</span>
                    <span className="wlpRecentChartBadge">{WRITING_FEATURED_TASK2.questionTypeTh}</span>
                    <span className="wlpRecentMonth">{WRITING_FEATURED_TASK2.month}</span>
                  </div>
                  <h3 className="wlpRecentTitle">Essay — Opinion &amp; Discussion</h3>
                  <blockquote className="wlpRecentEssayPrompt">
                    "{WRITING_FEATURED_TASK2.promptText}"
                  </blockquote>
                  <p className="wlpRecentInstruction">{WRITING_FEATURED_TASK2.instruction}</p>
                  <p className="wlpRecentWordLimit">{WRITING_FEATURED_TASK2.wordLimit}</p>

                  <div className="wlpTask2Hint">
                    <p className="wlpTask2HintLabel">แนวทางการเขียน</p>
                    <ul>
                      <li>Introduction: แสดงจุดยืนชัดเจน + paraphrase โจทย์</li>
                      <li>Body 1: View A พร้อม evidence</li>
                      <li>Body 2: View B พร้อม evidence</li>
                      <li>Conclusion: ยืนยัน opinion + สรุป</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="wlpRecentAction wlpRecentAction-task2"
                    onClick={() => setFlow({ step: 'task2-types' })}
                  >
                    ดูประเภทคำถาม Task 2 →
                  </button>
                </article>

              </div>
            </section>

            {/* ── Monthly question sets Jan–Dec 2026 ───────── */}
            <section className="wlpSection">
              <div className="wlpSectionHead">
                <p className="wlpSectionKicker">โจทย์จากการสอบจริง · มกราคม – ธันวาคม 2569</p>
                <h2 className="wlpSectionH2">IELTS Writing 2026<br />Task 1 + Task 2 รายเดือน</h2>
                <p className="wlpSectionLead">
                  รวบรวมโจทย์ IELTS Academic Writing จากการสอบในประเทศไทยและภูมิภาค APAC
                  มกราคม–มิถุนายน 2569 (ข้อมูลจริง) และโจทย์คาดการณ์ กรกฎาคม–ธันวาคม 2569
                </p>
              </div>
              <div className="wlpMonthGrid">
                {WRITING_MONTHLY_SETS_2026.map((set) => (
                  <article
                    key={set.id}
                    className={`wlpMonthCard ${set.isScheduled ? 'wlpMonthCard-scheduled' : ''}`}
                  >
                    <div className="wlpMonthCardHead">
                      <span className="wlpMonthBadge">
                        {set.isScheduled ? '🗓 กำลังจะมา' : '✅ ข้อสอบจริง'}
                      </span>
                      <span className="wlpMonthPeriod">{set.period}</span>
                    </div>
                    <h3 className="wlpMonthTitle">{set.monthTh}</h3>

                    {set.isScheduled ? (
                      <p className="wlpMonthScheduled">{set.scheduledDateTh}</p>
                    ) : (
                      <>
                        <div className="wlpMonthTask">
                          <div className="wlpMonthTaskHead">
                            <span className="wlpMonthTaskLabel">Task 1</span>
                            <span className="wlpMonthChartBadge">
                              {CHART_TYPE_ICON[set.task1.chartType] || '📊'} {set.task1.chartTypeTh}
                            </span>
                          </div>
                          <p className="wlpMonthTaskPrompt">{set.task1.promptText}</p>
                        </div>
                        <div className="wlpMonthTask wlpMonthTask-t2">
                          <div className="wlpMonthTaskHead">
                            <span className="wlpMonthTaskLabel wlpMonthTaskLabel-t2">Task 2</span>
                            <span className="wlpMonthChartBadge wlpMonthChartBadge-t2">{set.task2.questionTypeTh}</span>
                          </div>
                          <p className="wlpMonthTaskPrompt">{set.task2.promptText}</p>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            </section>

            {/* ── Band 7 Sample Answers ─────────────────────── */}
            <section className="wlpSection wlpSection-band7">
              <div className="wlpSectionHead">
                <p className="wlpSectionKicker">ตัวอย่างคำตอบ · Band 7 Model Answer</p>
                <h2 className="wlpSectionH2">ดูว่า Band 7 เขียนยังไง<br />พร้อมคำอธิบายภาษาไทย</h2>
                <p className="wlpSectionLead">
                  กด <strong>คำที่ขีดเส้นใต้</strong> เพื่อดูคำอธิบายคำศัพท์และโครงสร้างไวยากรณ์เป็นภาษาไทย
                </p>
              </div>

              <div className="wlpBand7Tabs">
                <WlpBand7Tabs />
              </div>
            </section>

            {/* ── CTA row ──────────────────────────────────── */}
            <section className="wlpCtaRow">
              <div className="wlpCtaInner">
                <p className="wlpCtaKicker">English Plan IELTS Institute</p>
                <h2 className="wlpCtaH2">พร้อมฝึกจริงแล้วหรือยัง?</h2>
                <p className="wlpCtaLead">เลือก Task ที่ต้องการฝึกด้านล่าง แล้วเริ่มทำโจทย์ได้เลย</p>
                <div className="wlpCtaActions">
                  <button
                    type="button"
                    className="wlpBtn wlpBtn-primary"
                    onClick={() => setFlow({ step: 'task1-categories' })}
                  >
                    Task 1 — กราฟและแผนภาพ
                  </button>
                  <button
                    type="button"
                    className="wlpBtn wlpBtn-secondary"
                    onClick={() => setFlow({ step: 'task2-types' })}
                  >
                    Task 2 — เรียงความ
                  </button>
                </div>
              </div>
            </section>

          </div>
        ) : null}

        {flow.step === 'task1-categories' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1"
              title="Choose a question type"
              subtitle="Pick the chart or diagram category you want to practise"
              onBack={goBack}
              backLabel="Tasks"
            />
            <div className="writingGuideMegaGrid writingGuideMegaGrid-categories">
              {WRITING_TASK1_SECTIONS.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  className={`writingGuideMegaCard writingGuideMegaCard-category ${accentClass(section.accent)}`}
                  style={{ '--motion-stagger': index } as CSSProperties}
                  onClick={() => openCategory(section)}
                >
                  <span className="writingGuideMegaBadge">
                    {section.practicePrompts?.length ? `${section.practicePrompts.length} exams` : 'Vocabulary'}
                  </span>
                  <strong>{section.title}</strong>
                  <span className="writingGuideMegaSub">{section.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {flow.step === 'task1-questions' && activeCategory ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · Practice"
              title={activeCategory.title}
              subtitle="เลือก 1 ข้อเพื่อเริ่มทำข้อสอบ"
              onBack={goBack}
              backLabel="Categories"
            />
            <div className="writingGuideExamList">
              {(activeCategory.practicePrompts || []).map((prompt, index) => (
                <button
                  key={prompt.id}
                  type="button"
                  className="writingGuideExamListItem"
                  style={{ '--motion-stagger': index } as CSSProperties}
                  onClick={() => {
                    setShowHelper(false)
                    setFlow({ step: 'task1-exam', categoryId: activeCategory.id, promptId: prompt.id })
                  }}
                >
                  <span className="writingGuideExamListNum">Question {prompt.number}</span>
                  <strong>{prompt.title}</strong>
                  <span className="writingGuideExamListMeta">
                    {prompt.chartTypeLabel} · {prompt.years[0]}–{prompt.years[prompt.years.length - 1]}
                  </span>
                  <span className="writingGuideExamListAction">Start exam →</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {flow.step === 'task1-exam' && activeCategory && activePrompt ? (
          <div className="writingGuideExamShell">
            <div className="writingGuideExamToolbar">
              <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                ← Question list
              </button>
              <button
                type="button"
                className={`writingGuideHelperBtn ${showHelper ? 'is-open' : ''}`}
                onClick={() => setShowHelper((open) => !open)}
                aria-expanded={showHelper}
              >
                ตัวช่วย
              </button>
            </div>
            {showHelper ? (
              <WritingVocabularyHelper
                chipGroups={activeCategory.chipGroups}
                structures={activeCategory.structures}
              />
            ) : null}
            <WritingIeltsTask1Paper
              prompt={activePrompt}
              answer={timelineAnswers[activePrompt.id] || ''}
              onAnswerChange={(value) =>
                setTimelineAnswers((current) => ({ ...current, [activePrompt.id]: value }))
              }
            />
          </div>
        ) : null}

        {flow.step === 'task1-guide' && activeCategory ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 1 · Vocabulary"
              title={activeCategory.title}
              subtitle="Practice exams coming soon — use ตัวช่วย vocabulary for now"
              onBack={goBack}
              backLabel="Categories"
            />
            <div className="writingGuideExamToolbar writingGuideExamToolbar-inline">
              <button
                type="button"
                className={`writingGuideHelperBtn ${showHelper ? 'is-open' : ''}`}
                onClick={() => setShowHelper((open) => !open)}
                aria-expanded={showHelper}
              >
                ตัวช่วย
              </button>
            </div>
            {showHelper ? (
              <WritingVocabularyHelper
                chipGroups={activeCategory.chipGroups}
                structures={activeCategory.structures}
              />
            ) : (
              <div className="writingGuideComingSoon">
                <p>Exam questions for this category are not ready yet.</p>
                <p>Tap <strong>ตัวช่วย</strong> to view recommended vocabulary and structures.</p>
              </div>
            )}
          </div>
        ) : null}

        {flow.step === 'task2-types' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Task 2"
              title="Choose an essay type"
              subtitle="Review the focus points for each Task 2 question format"
              onBack={goBack}
              backLabel="Tasks"
            />
            <div className="writingGuideMegaGrid writingGuideMegaGrid-categories">
              {WRITING_TASK2_TYPES.map((item, index) => (
                <article
                  key={item.id}
                  className="writingGuideMegaCard writingGuideMegaCard-static writingGuideMegaCard-task2type"
                  style={{ '--motion-stagger': index } as CSSProperties}
                >
                  <span className="writingGuideMegaBadge">Task 2</span>
                  <strong>{item.title}</strong>
                  <span className="writingGuideMegaSub">{item.subtitle}</span>
                  <ul className="writingGuideMegaList">
                    {item.focus.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
