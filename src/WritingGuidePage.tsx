import { useMemo, useState, type CSSProperties } from 'react'
import './WritingGuidePage.css'
import {
  WRITING_TASK1_SECTIONS,
  WRITING_TASK2_TYPES,
  WRITING_TIMELINE_PRACTICE_PROMPTS,
  IELTS_TASK1_SUMMARY_INSTRUCTION,
  IELTS_TASK1_TIME_NOTE,
  IELTS_TASK1_WORD_LIMIT,
  getIeltsTask1OpeningLine,
  type WritingGuideChipGroup,
  type WritingGuideStructure,
  type WritingTask1Section,
  type WritingTimelinePracticePrompt
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

      <header className="writingGuideHeader">
        <div>
          <p className="sectionLabel">English Plan Writing</p>
          <h2>IELTS Writing Practice</h2>
          <p className="writingGuideLead">เลือก Task → หมวด → ข้อสอบ ทีละขั้น</p>
        </div>
        {flow.step === 'task-pick' ? (
          <button type="button" className="writingGuideBackBtn" onClick={onBackHome}>
            Back Home
          </button>
        ) : null}
      </header>

      <div className="writingGuideFlowStage">
        {flow.step === 'task-pick' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow="Start here"
              title="Choose your writing task"
              subtitle="Select Task 1 or Task 2 to continue"
              onBack={onBackHome}
              backLabel="Home"
            />
            <div className="writingGuideMegaGrid writingGuideMegaGrid-2">
              <button
                type="button"
                className="writingGuideMegaCard writingGuideMegaCard-task1"
                style={{ '--motion-stagger': 0 } as CSSProperties}
                onClick={() => setFlow({ step: 'task1-categories' })}
              >
                <span className="writingGuideMegaBadge">Academic</span>
                <strong>Task 1</strong>
                <span className="writingGuideMegaSub">Report · charts, maps &amp; processes</span>
                <small>150 words · ~20 minutes</small>
              </button>
              <button
                type="button"
                className="writingGuideMegaCard writingGuideMegaCard-task2"
                style={{ '--motion-stagger': 1 } as CSSProperties}
                onClick={() => setFlow({ step: 'task2-types' })}
              >
                <span className="writingGuideMegaBadge">Academic</span>
                <strong>Task 2</strong>
                <span className="writingGuideMegaSub">Essay · opinion &amp; discussion</span>
                <small>250 words · ~40 minutes</small>
              </button>
            </div>
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
