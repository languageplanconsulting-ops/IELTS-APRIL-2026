import { useMemo, useState, type CSSProperties } from 'react'
import './WritingGuidePage.css'
import {
  getWritingGuidedBuilder,
  assembleGuidedEssay,
  ROLE_LABEL_TH,
  STEP_COACH_TH,
  BLANK_COACH_TH,
  type WgbExercise,
  type WgbStep,
  type WgbBlank,
  type WgbSegment
} from './writingGuidedBuilder'
import {
  WRITING_TASK1_SECTIONS,
  WRITING_TASK2_TYPES,
  WRITING_TIMELINE_PRACTICE_PROMPTS,
  WRITING_TASK1_TYPE_INFO,
  WRITING_BAND7_TASK1_SAMPLE,
  WRITING_BAND7_TASK2_SAMPLE,
  IELTS_TASK1_SUMMARY_INSTRUCTION,
  IELTS_TASK1_TIME_NOTE,
  IELTS_TASK1_WORD_LIMIT,
  getIeltsTask1OpeningLine,
  getIeltsTask1SnapshotOpeningLine,
  getIeltsTask1MixedOpeningLine,
  getIeltsTask1MapOpeningLine,
  getIeltsTask1ProcessOpeningLine,
  type WritingGuideChipGroup,
  type WritingGuideStructure,
  type WritingTask1Section,
  type WritingTimelinePracticePrompt,
  type WritingSnapshotPracticePrompt,
  type WritingMixedPracticePrompt,
  type WritingMixedPanel,
  type WritingMapPracticePrompt,
  type WritingProcessPracticePrompt,
  type WritingTask1PracticePrompt,
  type WritingLineSeries,
  type WritingBand7Highlight,
  type WritingBand7Sample
} from './writingGuideData'
import { WRITING_RECALL, WRITING_PREDICT, type ExamItem } from './writingExamRecalls'

type WritingGuidePageProps = {
  onBackHome: () => void
}

type WritingFlow =
  | { step: 'hub' }
  | { step: 'latest'; filter: 'all' | 'task1' | 'task2' }
  | { step: 'task1-categories' }
  | { step: 'task1-questions'; categoryId: string }
  | { step: 'task1-exam'; categoryId: string; promptId: string }
  | { step: 'task1-drill'; categoryId: string; promptId: string }
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

function xPositionsFor(n: number) {
  const plotWidth = CHART_SIZE.width - CHART_PAD.left - CHART_PAD.right
  return Array.from({ length: n }, (_, index) =>
    CHART_PAD.left + (n <= 1 ? plotWidth / 2 : (index / (n - 1)) * plotWidth)
  )
}

function buildPlotPoints(values: number[], yMax: number) {
  const plotHeight = CHART_SIZE.height - CHART_PAD.top - CHART_PAD.bottom
  const xPositions = xPositionsFor(values.length)

  return values.map((value, index) => {
    const y = CHART_PAD.top + plotHeight - (value / yMax) * plotHeight
    return { x: xPositions[index], y, value }
  })
}

function WritingIeltsYAxis({
  ticks,
  yMax,
  label,
  xAxisLabel = 'Year'
}: {
  ticks: number[]
  yMax: number
  label: string
  xAxisLabel?: string
}) {
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
        {xAxisLabel}
      </text>
    </>
  )
}

function WritingLineGraphSvg({ prompt }: { prompt: WritingTimelinePracticePrompt }) {
  const seriesList: WritingLineSeries[] = prompt.series?.length
    ? prompt.series
    : [{ label: prompt.valueLabel, color: '#111827', values: prompt.values }]

  const { max: yMax, ticks } = getNiceYScale(seriesList.flatMap((s) => s.values))
  const xPositions = xPositionsFor(prompt.years.length)
  const isMultiSeries = seriesList.length > 1

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
        {xPositions.map((x, index) => (
          <text
            key={prompt.years[index]}
            x={x}
            y={CHART_SIZE.height - CHART_PAD.bottom + 22}
            className="writingIeltsChartTick"
            textAnchor="middle"
          >
            {prompt.years[index]}
          </text>
        ))}
        {seriesList.map((series) => {
          const points = buildPlotPoints(series.values, yMax)
          const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
          const color = isMultiSeries ? series.color : undefined
          return (
            <g key={series.label}>
              <path
                d={linePath}
                className="writingIeltsChartLine"
                style={color ? { stroke: color } : undefined}
              />
              {points.map((point, index) => (
                <rect
                  key={`${series.label}-${prompt.years[index]}`}
                  x={point.x - 4}
                  y={point.y - 4}
                  width={8}
                  height={8}
                  className="writingIeltsChartMarker"
                  style={color ? { fill: color } : undefined}
                />
              ))}
            </g>
          )
        })}
      </svg>
      {isMultiSeries ? (
        <div className="writingIeltsChartLegend">
          {seriesList.map((series) => (
            <span key={series.label} className="writingIeltsChartLegendItem">
              <span className="writingIeltsChartLegendSwatch" style={{ background: series.color }} />
              {series.label}
            </span>
          ))}
        </div>
      ) : null}
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

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function pieSlicePath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToXY(cx, cy, r, start)
  const e = polarToXY(cx, cy, r, end)
  const large = end - start > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)} Z`
}

function WritingPieChartSvg({ prompt }: { prompt: WritingSnapshotPracticePrompt }) {
  const pies = prompt.pies || []
  const n = Math.max(pies.length, 1)
  const R = n > 1 ? 78 : 100
  const cy = 132
  const centers =
    n > 1
      ? Array.from({ length: n }, (_, i) => (CHART_SIZE.width / (n + 1)) * (i + 1))
      : [CHART_SIZE.width / 2]

  return (
    <figure className="writingIeltsFigure">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <svg
        viewBox={`0 0 ${CHART_SIZE.width} ${CHART_SIZE.height}`}
        className="writingIeltsChartSvg"
        role="img"
        aria-label={`Pie chart showing ${prompt.chartCaption}`}
      >
        {pies.map((pie, pieIndex) => {
          const cx = centers[pieIndex]
          const total = pie.slices.reduce((sum, slice) => sum + slice.value, 0) || 1
          let cursor = 0
          return (
            <g key={pie.title}>
              <text x={cx} y={cy - R - 16} textAnchor="middle" className="writingIeltsPieChartTitle">
                {pie.title}
              </text>
              {pie.slices.map((slice) => {
                const sweep = (slice.value / total) * 360
                const path = pieSlicePath(cx, cy, R, cursor, cursor + sweep)
                const mid = cursor + sweep / 2
                const labelPos = polarToXY(cx, cy, R * 0.62, mid)
                const percent = Math.round((slice.value / total) * 100)
                cursor += sweep
                return (
                  <g key={slice.label}>
                    <path d={path} fill={slice.color} stroke="#fff" strokeWidth={1.5} />
                    {percent >= 6 ? (
                      <text
                        x={labelPos.x}
                        y={labelPos.y + 4}
                        textAnchor="middle"
                        className="writingIeltsPieChartSliceLabel"
                      >
                        {percent}%
                      </text>
                    ) : null}
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
      <div className="writingIeltsPieChartLegend">
        {pies.map((pie) => (
          <div key={pie.title} className="writingIeltsPieChartLegendGroup">
            <span className="writingIeltsPieChartLegendTitle">{pie.title}</span>
            <div className="writingIeltsChartLegend">
              {pie.slices.map((slice) => (
                <span key={slice.label} className="writingIeltsChartLegendItem">
                  <span className="writingIeltsChartLegendSwatch" style={{ background: slice.color }} />
                  {slice.label} ({slice.value})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="writingIeltsTableNote">Units: {prompt.unit}</p>
    </figure>
  )
}

function WritingSnapshotBarChartSvg({ prompt }: { prompt: WritingSnapshotPracticePrompt }) {
  const categories = prompt.categories || []
  const seriesList = prompt.series || []
  const { max: yMax, ticks } = getNiceYScale(seriesList.flatMap((s) => s.values))
  const plotHeight = CHART_SIZE.height - CHART_PAD.top - CHART_PAD.bottom
  const barWidth = 26
  const barGap = 6
  const clusterGap = 30
  const seriesCount = Math.max(seriesList.length, 1)
  const clusterWidth = seriesCount * barWidth + (seriesCount - 1) * barGap
  const totalWidth = categories.length * clusterWidth + (categories.length - 1) * clusterGap
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
        <WritingIeltsYAxis ticks={ticks} yMax={yMax} label={prompt.unit} xAxisLabel="Category" />
        {categories.map((category, categoryIndex) => {
          const clusterX = startX + categoryIndex * (clusterWidth + clusterGap)
          return (
            <g key={category} className="writingIeltsChartBarGroup">
              {seriesList.map((series, seriesIndex) => {
                const value = series.values[categoryIndex] ?? 0
                const height = (value / yMax) * plotHeight
                const x = clusterX + seriesIndex * (barWidth + barGap)
                const y = CHART_PAD.top + plotHeight - height
                return (
                  <rect
                    key={series.label}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    className="writingIeltsChartBar"
                    style={{ fill: series.color }}
                  />
                )
              })}
              <text
                x={clusterX + clusterWidth / 2}
                y={CHART_SIZE.height - CHART_PAD.bottom + 22}
                className="writingIeltsChartTick"
                textAnchor="middle"
              >
                {category}
              </text>
            </g>
          )
        })}
      </svg>
      {seriesList.length > 1 ? (
        <div className="writingIeltsChartLegend">
          {seriesList.map((series) => (
            <span key={series.label} className="writingIeltsChartLegendItem">
              <span className="writingIeltsChartLegendSwatch" style={{ background: series.color }} />
              {series.label}
            </span>
          ))}
        </div>
      ) : null}
    </figure>
  )
}

function WritingSnapshotTable({ prompt }: { prompt: WritingSnapshotPracticePrompt }) {
  const headers = prompt.tableHeaders || []
  const rows = prompt.tableRows || []
  return (
    <figure className="writingIeltsFigure writingIeltsFigure-table">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <table className="writingIeltsTable">
        <thead>
          <tr>
            <th scope="col" />
            {headers.map((header) => (
              <th scope="col" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.entity}>
              <th scope="row">{row.entity}</th>
              {row.values.map((value, index) => (
                <td key={`${row.entity}-${index}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

function renderMixedPanel(prompt: WritingMixedPracticePrompt, panel: WritingMixedPanel, index: number) {
  const panelId = `${prompt.id}-panel-${index}`
  if (panel.kind === 'snapshot') {
    const snapshotPrompt: WritingSnapshotPracticePrompt = {
      id: panelId,
      number: prompt.number,
      kind: 'snapshot',
      chartType: panel.chartType,
      chartTypeLabel: '',
      title: '',
      chartCaption: panel.chartCaption,
      subjectPhrase: '',
      unit: panel.unit,
      valueLabel: panel.valueLabel,
      mainFeature: '',
      pies: panel.pies,
      categories: panel.categories,
      series: panel.series,
      tableHeaders: panel.tableHeaders,
      tableRows: panel.tableRows
    }
    if (panel.chartType === 'pie-chart') return <WritingPieChartSvg key={panelId} prompt={snapshotPrompt} />
    if (panel.chartType === 'bar-chart') return <WritingSnapshotBarChartSvg key={panelId} prompt={snapshotPrompt} />
    return <WritingSnapshotTable key={panelId} prompt={snapshotPrompt} />
  }
  const timelinePrompt: WritingTimelinePracticePrompt = {
    id: panelId,
    number: prompt.number,
    kind: 'timeline',
    chartType: panel.chartType,
    chartTypeLabel: '',
    title: '',
    chartCaption: panel.chartCaption,
    subjectPhrase: '',
    unit: panel.unit,
    yAxisLabel: panel.yAxisLabel,
    valueLabel: panel.valueLabel,
    years: panel.years,
    values: panel.values,
    mainTrend: '',
    series: panel.series
  }
  if (panel.chartType === 'line-graph') return <WritingLineGraphSvg key={panelId} prompt={timelinePrompt} />
  if (panel.chartType === 'bar-chart') return <WritingBarChartSvg key={panelId} prompt={timelinePrompt} />
  return <WritingTableChart key={panelId} prompt={timelinePrompt} />
}

const MAP_BASE_W = 100
const MAP_BASE_H = 80

function zoneIcon(label: string) {
  const key = label.toLowerCase()
  if (key.includes('resident') || key.includes('hous')) return '\u{1F3E0}'
  if (key.includes('mall') || key.includes('shop')) return '\u{1F6CD}\u{FE0F}'
  if (key.includes('market')) return '\u{1F9FA}'
  if (key.includes('industrial') || key.includes('factory')) return '\u{1F3ED}'
  if (key.includes('tech')) return '\u{1F4BB}'
  if (key.includes('car park') || key.includes('parking')) return 'P'
  if (key.includes('library')) return '\u{1F4DA}'
  if (key.includes('park') || key.includes('open space') || key.includes('garden')) return '\u{1F333}'
  if (key.includes('civic') || key.includes('hall') || key.includes('centre') || key.includes('center')) return '\u{1F3DB}\u{FE0F}'
  if (key.includes('school')) return '\u{1F3EB}'
  if (key.includes('hospital')) return '\u{1F3E5}'
  return '\u{1F4CD}'
}

function WritingMapDiagramSvg({ prompt }: { prompt: WritingMapPracticePrompt }) {
  const W = CHART_SIZE.width
  const mapW = 270
  const mapH = 188
  const gap = 46
  const x1 = (W - (mapW * 2 + gap)) / 2
  const x2 = x1 + mapW + gap
  const y0 = 30
  const scaleX = mapW / MAP_BASE_W
  const scaleY = mapH / MAP_BASE_H
  const roadStep = 34

  const legendEntries: { label: string; color: string }[] = []
  const seenLabels = new Set<string>()
  ;[...prompt.before.zones, ...prompt.after.zones].forEach((zone) => {
    const key = zone.label.replace(/\n/g, ' ')
    if (!seenLabels.has(key)) {
      seenLabels.add(key)
      legendEntries.push({ label: key, color: zone.color })
    }
  })

  const verticals: number[] = []
  for (let rx = roadStep; rx < MAP_BASE_W; rx += roadStep) verticals.push(rx)
  const horizontals: number[] = []
  for (let ry = roadStep; ry < MAP_BASE_H; ry += roadStep) horizontals.push(ry)

  return (
    <figure className="writingIeltsFigure">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${y0 + mapH + 40}`}
        className="writingIeltsChartSvg writingIeltsMapDiagram"
        role="img"
        aria-label={`Map diagram showing ${prompt.chartCaption}`}
      >
        <g transform={`translate(${W - 34}, 26)`}>
          <circle r={16} fill="#fff" stroke="#94a3b8" strokeWidth={1.2} />
          <path d="M0,-12 L3.5,0 L0,12 L-3.5,0 Z" fill="#334155" />
          <text y={-19} textAnchor="middle" fontSize={9} fontWeight={700} fill="#334155">
            N
          </text>
        </g>

        <text x={(x1 + mapW + x2) / 2} y={y0 + mapH / 2 + 6} textAnchor="middle" fontSize={22} fill="#94a3b8">
          →
        </text>

        {[prompt.before, prompt.after].map((panel, pi) => {
          const ox = pi === 0 ? x1 : x2
          return (
            <g key={pi}>
              <text x={ox + mapW / 2} y={y0 - 10} textAnchor="middle" className="writingIeltsMapYear">
                {panel.year}
              </text>
              <rect x={ox} y={y0} width={mapW} height={mapH} className="writingIeltsMapGround" rx={5} />
              {verticals.map((rx) => (
                <line
                  key={`v-${rx}`}
                  x1={ox + rx * scaleX}
                  y1={y0}
                  x2={ox + rx * scaleX}
                  y2={y0 + mapH}
                  className="writingIeltsMapRoad"
                />
              ))}
              {horizontals.map((ry) => (
                <line
                  key={`h-${ry}`}
                  x1={ox}
                  y1={y0 + ry * scaleY}
                  x2={ox + mapW}
                  y2={y0 + ry * scaleY}
                  className="writingIeltsMapRoad"
                />
              ))}
              {panel.zones.map((zone, zi) => {
                const zx = ox + zone.x * scaleX
                const zy = y0 + zone.y * scaleY
                const zw = zone.w * scaleX
                const zh = zone.h * scaleY
                const lines = zone.label.split('\n')
                const icon = zoneIcon(zone.label)
                const labelStartY = zy + zh / 2 - ((lines.length - 1) * 6) + 12
                return (
                  <g key={zi}>
                    <rect x={zx} y={zy} width={zw} height={zh} fill={zone.color} stroke="#fff" strokeWidth={2} rx={4} />
                    <text x={zx + zw / 2} y={zy + zh / 2 - 8} textAnchor="middle" fontSize={15}>
                      {icon}
                    </text>
                    {lines.map((line, li) => (
                      <text
                        key={li}
                        x={zx + zw / 2}
                        y={labelStartY + li * 11}
                        textAnchor="middle"
                        className="writingIeltsMapZoneLabel"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                )
              })}
              <rect x={ox} y={y0} width={mapW} height={mapH} className="writingIeltsMapBorder" rx={5} />
            </g>
          )
        })}
      </svg>
      <div className="writingIeltsChartLegend">
        {legendEntries.map((entry) => (
          <span key={entry.label} className="writingIeltsChartLegendItem">
            <span className="writingIeltsChartLegendSwatch" style={{ background: entry.color }} />
            {entry.label}
          </span>
        ))}
      </div>
    </figure>
  )
}

function WritingProcessDiagramSvg({ prompt }: { prompt: WritingProcessPracticePrompt }) {
  const columns = 4
  const boxW = 148
  const boxH = 74
  const gapX = 26
  const gapY = 44
  const rows = Math.ceil(prompt.stages.length / columns)
  const totalW = columns * boxW + (columns - 1) * gapX
  const totalH = rows * boxH + (rows - 1) * gapY
  const startX = (CHART_SIZE.width - totalW) / 2

  const positions = prompt.stages.map((stage, index) => {
    const row = Math.floor(index / columns)
    const isReverseRow = row % 2 === 1
    const colInRow = index % columns
    const col = isReverseRow ? columns - 1 - colInRow : colInRow
    const x = startX + col * (boxW + gapX)
    const y = row * (boxH + gapY)
    return { stage, x, y, row, col, isReverseRow }
  })

  return (
    <figure className="writingIeltsFigure">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <svg
        viewBox={`0 0 ${CHART_SIZE.width} ${totalH + 20}`}
        className="writingIeltsChartSvg writingIeltsProcessDiagram"
        role="img"
        aria-label={`Process diagram showing ${prompt.chartCaption}`}
      >
        {positions.map((pos, index) => {
          if (index === positions.length - 1) return null
          const next = positions[index + 1]
          const sameRow = next.row === pos.row
          if (sameRow) {
            const fromX = pos.isReverseRow ? pos.x : pos.x + boxW
            const toX = next.isReverseRow ? next.x + boxW : next.x
            const midY = pos.y + boxH / 2
            return (
              <path
                key={`arrow-${index}`}
                d={`M${fromX},${midY} L${toX - 8},${midY}`}
                className="writingIeltsProcessArrow"
                markerEnd="url(#writingIeltsProcessArrowHead)"
              />
            )
          }
          const fromX = pos.x + boxW / 2
          const fromY = pos.y + boxH
          const toX = next.x + boxW / 2
          const toY = next.y
          return (
            <path
              key={`arrow-${index}`}
              d={`M${fromX},${fromY} L${fromX},${fromY + gapY / 2} L${toX},${fromY + gapY / 2} L${toX},${toY - 8}`}
              fill="none"
              className="writingIeltsProcessArrow"
              markerEnd="url(#writingIeltsProcessArrowHead)"
            />
          )
        })}

        <defs>
          <marker id="writingIeltsProcessArrowHead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#0f53c9" />
          </marker>
        </defs>

        {positions.map((pos, index) => (
          <g key={pos.stage.id}>
            <rect x={pos.x} y={pos.y} width={boxW} height={boxH} className="writingIeltsProcessBox" rx={8} />
            <text x={pos.x + boxW / 2} y={pos.y + 20} textAnchor="middle" className="writingIeltsProcessStageNumber">
              {index + 1}. {pos.stage.label}
            </text>
            {wrapProcessDetail(pos.stage.detail).map((line, li) => (
              <text
                key={li}
                x={pos.x + boxW / 2}
                y={pos.y + 38 + li * 13}
                textAnchor="middle"
                className="writingIeltsProcessStageDetail"
              >
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </figure>
  )
}

function wrapProcessDetail(detail: string) {
  const words = detail.split(' ')
  const lines: string[] = []
  let current = ''
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > 24) {
      if (current) lines.push(current)
      current = word
    } else {
      current = candidate
    }
  })
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

function renderPromptChart(prompt: WritingTask1PracticePrompt) {
  if (prompt.kind === 'timeline') {
    if (prompt.chartType === 'line-graph') return <WritingLineGraphSvg prompt={prompt} />
    if (prompt.chartType === 'bar-chart') return <WritingBarChartSvg prompt={prompt} />
    return <WritingTableChart prompt={prompt} />
  }
  if (prompt.kind === 'mixed') {
    return (
      <div className="writingIeltsMixedChartGroup">
        {prompt.panels.map((panel, index) => renderMixedPanel(prompt, panel, index))}
      </div>
    )
  }
  if (prompt.kind === 'map') return <WritingMapDiagramSvg prompt={prompt} />
  if (prompt.kind === 'process') return <WritingProcessDiagramSvg prompt={prompt} />
  if (prompt.chartType === 'pie-chart') return <WritingPieChartSvg prompt={prompt} />
  if (prompt.chartType === 'bar-chart') return <WritingSnapshotBarChartSvg prompt={prompt} />
  return <WritingSnapshotTable prompt={prompt} />
}

function WritingIeltsTask1Paper({
  prompt,
  answer,
  onAnswerChange
}: {
  prompt: WritingTask1PracticePrompt
  answer: string
  onAnswerChange: (value: string) => void
}) {
  const openingLine =
    prompt.kind === 'timeline'
      ? getIeltsTask1OpeningLine(prompt)
      : prompt.kind === 'snapshot'
        ? getIeltsTask1SnapshotOpeningLine(prompt)
        : prompt.kind === 'mixed'
          ? getIeltsTask1MixedOpeningLine(prompt)
          : prompt.kind === 'map'
            ? getIeltsTask1MapOpeningLine(prompt)
            : getIeltsTask1ProcessOpeningLine(prompt)

  return (
    <article className="writingIeltsPaper">
      <header className="writingIeltsPaperHead">
        <p className="writingIeltsTaskLabel">Writing Task 1</p>
        <p className="writingIeltsTimeNote">{IELTS_TASK1_TIME_NOTE}</p>
      </header>

      <div className="writingIeltsPaperBody">
        <p className="writingIeltsPromptLine">{openingLine}</p>
        <p className="writingIeltsPromptLine">{IELTS_TASK1_SUMMARY_INSTRUCTION}</p>
        <p className="writingIeltsPromptLine writingIeltsPromptLine-limit">{IELTS_TASK1_WORD_LIMIT}</p>

        {renderPromptChart(prompt)}
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

const WGB_STEP_SHORT: Record<WgbStep['role'], string> = {
  intro: 'Intro',
  overview: 'Overview',
  body1: 'Body 1',
  body2: 'Body 2'
}

const wgbNormalize = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

function WgbCoachBubble({ coachKey, message, isBlankFocus }: { coachKey: string; message: string; isBlankFocus: boolean }) {
  return (
    <div key={coachKey} className={`wgbCoach ${isBlankFocus ? 'is-blank-focus' : ''}`}>
      <span className="wgbCoachAvatar" aria-hidden="true">
        {isBlankFocus ? '💭' : '🧑‍🏫'}
      </span>
      <div className="wgbCoachBody">
        <p className="wgbCoachLabel">โค้ชแนะนำ</p>
        <p className="wgbCoachMessage">{message}</p>
      </div>
    </div>
  )
}

function WritingGuidedBuilder({
  prompt,
  exercise
}: {
  prompt: WritingTask1PracticePrompt
  exercise: WgbExercise
}) {
  const steps = exercise.steps
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => new Set())
  const [checkedNow, setCheckedNow] = useState(false)
  const [showEssay, setShowEssay] = useState(false)
  const [activeBlankId, setActiveBlankId] = useState<string | null>(null)

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const isBlankCorrect = (blank: WgbBlank): boolean => {
    const value = values[blank.id]
    if (value == null || value.trim() === '') return false
    if (blank.kind === 'select') return value === blank.answer
    return blank.answers.some((answer) => wgbNormalize(answer) === wgbNormalize(value))
  }

  const stepBlanks = useMemo(
    () =>
      step.segments
        .filter((segment): segment is Extract<WgbSegment, { kind: 'blank' }> => segment.kind === 'blank')
        .map((segment) => segment.blank),
    [step]
  )
  const stepScore = stepBlanks.filter(isBlankCorrect).length
  const stepDone = checkedSteps.has(step.id)
  const allDone = steps.every((item) => checkedSteps.has(item.id))

  const totalBlanks = useMemo(
    () => steps.reduce((sum, item) => sum + item.segments.filter((s) => s.kind === 'blank').length, 0),
    [steps]
  )

  const setValue = (id: string, value: string) => {
    setCheckedNow(false)
    setValues((current) => ({ ...current, [id]: value }))
  }

  const checkStep = () => {
    setCheckedNow(true)
    if (stepBlanks.every(isBlankCorrect)) {
      setCheckedSteps((current) => {
        const next = new Set(current)
        next.add(step.id)
        return next
      })
    }
  }

  const goToStep = (index: number) => {
    const reachable = index === 0 || checkedSteps.has(steps[index - 1].id) || checkedSteps.has(steps[index].id)
    if (!reachable) return
    setStepIndex(index)
    setCheckedNow(false)
    setActiveBlankId(null)
  }

  const goNext = () => {
    if (!isLastStep) goToStep(stepIndex + 1)
  }

  const resetAll = () => {
    setStepIndex(0)
    setValues({})
    setCheckedSteps(new Set())
    setCheckedNow(false)
    setShowEssay(false)
    setActiveBlankId(null)
  }

  const model = useMemo(() => assembleGuidedEssay(exercise), [exercise])

  const activeBlank = activeBlankId ? stepBlanks.find((blank) => blank.id === activeBlankId) ?? null : null
  const coachMessage = activeBlank ? BLANK_COACH_TH[activeBlank.focus] : STEP_COACH_TH[step.role]
  const coachKey = activeBlank ? activeBlank.id : `step-${step.id}`

  return (
    <div className="wgbShell">
      <div className="wgbChart">{renderPromptChart(prompt)}</div>

      <div className="wgbPanel">
        <ol className="wgbRail">
          {steps.map((item, index) => {
            const done = checkedSteps.has(item.id)
            const reachable = index === 0 || checkedSteps.has(steps[index - 1].id) || done
            const current = index === stepIndex
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`wgbRailStep ${current ? 'is-current' : ''} ${done ? 'is-done' : ''} ${
                    reachable ? '' : 'is-locked'
                  }`}
                  onClick={() => goToStep(index)}
                  disabled={!reachable}
                >
                  <span className="wgbRailDot">{done ? '✓' : index + 1}</span>
                  <span className="wgbRailLabel">{WGB_STEP_SHORT[item.role]}</span>
                </button>
              </li>
            )
          })}
        </ol>

        <WgbCoachBubble coachKey={coachKey} message={coachMessage} isBlankFocus={!!activeBlank} />

        <div key={step.id} className="wgbStepCard">
          <p className="wgbStepEyebrow">{ROLE_LABEL_TH[step.role]}</p>
          {step.hintTh ? <p className="wgbStepHint">{step.hintTh}</p> : null}

          <p className="wgbSentence">
            {step.segments.map((segment, index) => {
              if (segment.kind === 'text') return <span key={index}>{segment.text}</span>
              const blank = segment.blank
              const value = values[blank.id] ?? ''
              const correct = isBlankCorrect(blank)
              const stateClass = !checkedNow ? '' : correct ? 'is-correct' : 'is-incorrect'
              if (blank.kind === 'select') {
                return (
                  <span key={blank.id} className="wgbBlankWrap">
                    <select
                      className={`wgbSelect ${stateClass} ${value ? 'is-filled' : ''}`}
                      value={value}
                      onChange={(event) => setValue(blank.id, event.target.value)}
                      onFocus={() => setActiveBlankId(blank.id)}
                      onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                    >
                      <option value="">— เลือก —</option>
                      {blank.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {checkedNow && !correct ? (
                      <em className="wgbReveal">{blank.answer}</em>
                    ) : null}
                  </span>
                )
              }
              const widthCh = Math.max(blank.base.length + 3, ...blank.answers.map((a) => a.length + 1), 7)
              return (
                <span key={blank.id} className="wgbBlankWrap">
                  <input
                    type="text"
                    className={`wgbInput ${stateClass} ${value ? 'is-filled' : ''}`}
                    value={value}
                    placeholder={`(${blank.base})`}
                    style={{ width: `${widthCh}ch` }}
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onChange={(event) => setValue(blank.id, event.target.value)}
                    onFocus={() => setActiveBlankId(blank.id)}
                    onBlur={() => setActiveBlankId((current) => (current === blank.id ? null : current))}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') checkStep()
                    }}
                  />
                  {checkedNow && !correct ? <em className="wgbReveal">{blank.answers[0]}</em> : null}
                </span>
              )
            })}
          </p>

          <div className="wgbStepToolbar">
            <button type="button" className="wlpBtn wlpBtn-primary" onClick={checkStep}>
              ตรวจคำตอบ
            </button>
            <span className={`wgbStepScore ${checkedNow ? 'is-revealed' : ''}`}>
              {stepScore} / {stepBlanks.length}
            </span>
            {stepDone && !isLastStep ? (
              <button type="button" className="wlpBtn wlpBtn-primary wgbNextBtn" onClick={goNext}>
                ถัดไป →
              </button>
            ) : null}
          </div>

          {checkedNow ? (
            stepBlanks.every(isBlankCorrect) ? (
              <div className="wgbFeedback is-good" role="status">
                {isLastStep ? 'เยี่ยมมาก! เขียนครบทุกย่อหน้าแล้ว 🎉' : 'ถูกทุกช่อง! กด “ถัดไป” เพื่อเขียนย่อหน้าถัดไป ✅'}
              </div>
            ) : (
              <div className="wgbFeedback is-retry" role="status">
                ยังมีช่องที่ต้องแก้ ลองดูคำใบ้แล้วปรับใหม่อีกครั้ง 🙂
              </div>
            )
          ) : null}
        </div>

        {allDone ? (
          <div className="wgbFinish">
            <div className="wgbFinishHead">
              <p className="wgbFinishTitle">จบแล้ว! คุณประกอบเรียงความครบ {totalBlanks} ช่อง 🎉</p>
              <div className="wgbFinishBtns">
                <button type="button" className="wlpBtn wlpBtn-primary" onClick={() => setShowEssay((v) => !v)}>
                  {showEssay ? 'ซ่อนเรียงความเต็ม' : 'ดูเรียงความเต็ม'}
                </button>
                <button type="button" className="wlpBtn wlpBtn-secondary" onClick={resetAll}>
                  เริ่มใหม่
                </button>
              </div>
            </div>
            {showEssay ? (
              <article className="wgbEssay">
                {model.map((para) => (
                  <div key={para.role} className="wgbEssayPara">
                    <span className="wgbEssayLabel">{para.labelTh}</span>
                    <p>{para.text}</p>
                  </div>
                ))}
              </article>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
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

// ── Latest exam recall / prediction cards ────────────────────────────────

const matchesTaskFilter = (item: ExamItem, filter: 'all' | 'task1' | 'task2') => {
  if (filter === 'all') return true
  return item.tag.includes(filter === 'task1' ? 'Task 1' : 'Task 2')
}

function WritingLatestItem({ item }: { item: ExamItem }) {
  return (
    <div className="wgLatestItem">
      <span className="wgLatestItemTag">{item.tag}</span>
      <p className="wgLatestItemTitle">
        {item.title}
        {item.isNew ? <span className="wgLatestNew">ใหม่</span> : null}
      </p>
      {item.bullets ? (
        <ul className="wgLatestBullets">
          {item.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      <p className="wgLatestItemMeta">{item.meta}</p>
    </div>
  )
}

function WritingLatestSection({
  filter,
  onPracticeTask1,
  onPracticeTask2
}: {
  filter: 'all' | 'task1' | 'task2'
  onPracticeTask1: () => void
  onPracticeTask2: () => void
}) {
  const recall = WRITING_RECALL.filter((item) => matchesTaskFilter(item, filter))
  const predict = WRITING_PREDICT.filter((item) => matchesTaskFilter(item, filter))

  return (
    <div className="wgLatestShell">
      <section className="wgLatestBlock">
        <h3 className="wgLatestBlockTitle">หัวข้อที่เพิ่งออกสอบ</h3>
        <p className="wgLatestBlockLead">รายงานจากผู้สอบจริง · ไม่ใช่ข้อสอบทางการ</p>
        {recall.length ? (
          <div className="wgLatestGrid">
            {recall.map((item, i) => (
              <WritingLatestItem key={i} item={item} />
            ))}
          </div>
        ) : (
          <p className="wgLatestEmpty">ยังไม่มีข้อมูลในหมวดนี้</p>
        )}
      </section>

      <section className="wgLatestBlock wgLatestBlock-predict">
        <h3 className="wgLatestBlockTitle">เก็งข้อสอบเดือนนี้</h3>
        <p className="wgLatestBlockLead">แนวโน้มจากสถิติย้อนหลัง · เป็นการคาดการณ์ ไม่ใช่ข้อสอบจริง</p>
        {predict.length ? (
          <div className="wgLatestGrid">
            {predict.map((item, i) => (
              <WritingLatestItem key={i} item={item} />
            ))}
          </div>
        ) : (
          <p className="wgLatestEmpty">ยังไม่มีข้อมูลในหมวดนี้</p>
        )}
      </section>

      <div className="wgLatestCta">
        {filter !== 'task2' ? (
          <button type="button" className="wgLatestCtaBtn" onClick={onPracticeTask1}>
            ฝึกเขียน Task 1 ตอนนี้ →
          </button>
        ) : null}
        {filter !== 'task1' ? (
          <button type="button" className="wgLatestCtaBtn wgLatestCtaBtn-t2" onClick={onPracticeTask2}>
            ฝึกเขียน Task 2 ตอนนี้ →
          </button>
        ) : null}
      </div>
    </div>
  )
}

// ── Band 7 sample helper components ──────────────────────────────────────

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

export function WritingGuidePage({ onBackHome }: WritingGuidePageProps) {
  const [flow, setFlow] = useState<WritingFlow>({ step: 'hub' })
  const [timelineAnswers, setTimelineAnswers] = useState<Record<string, string>>({})
  const [showHelper, setShowHelper] = useState(false)

  const activeCategory = useMemo(() => {
    if (
      flow.step === 'hub' ||
      flow.step === 'latest' ||
      flow.step === 'task2-types' ||
      flow.step === 'task1-categories'
    ) {
      return null
    }
    return WRITING_TASK1_SECTIONS.find((section) => section.id === flow.categoryId) || null
  }, [flow])

  const activePrompt = useMemo(() => {
    if (flow.step !== 'task1-exam' && flow.step !== 'task1-drill') return null
    const prompts = activeCategory?.practicePrompts || WRITING_TIMELINE_PRACTICE_PROMPTS
    return prompts.find((prompt) => prompt.id === flow.promptId) || null
  }, [flow, activeCategory])

  const goBack = () => {
    setShowHelper(false)
    if (flow.step === 'hub') {
      onBackHome()
      return
    }
    if (flow.step === 'latest') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'task1-categories' || flow.step === 'task2-types') {
      setFlow({ step: 'hub' })
      return
    }
    if (flow.step === 'task1-questions' || flow.step === 'task1-guide') {
      setFlow({ step: 'task1-categories' })
      return
    }
    if (flow.step === 'task1-exam') {
      setFlow({ step: 'task1-questions', categoryId: flow.categoryId })
      return
    }
    if (flow.step === 'task1-drill') {
      setFlow({ step: 'task1-exam', categoryId: flow.categoryId, promptId: flow.promptId })
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

      {flow.step !== 'hub' ? (
        <header className="writingGuideHeader">
          <div>
            <p className="sectionLabel">English Plan Writing</p>
            <h2>IELTS Writing Practice</h2>
            <p className="writingGuideLead">เลือก Task → หมวด → ข้อสอบ ทีละขั้น</p>
          </div>
        </header>
      ) : null}

      <div className="writingGuideFlowStage">
        {flow.step === 'hub' ? (
          <div className="writingGuideHubShell">
            <div className="writingGuideHubIntro">
              <p className="wlpKicker">IELTS Academic Writing · English Plan Institute</p>
              <h1 className="writingGuideHubH1">เลือกสิ่งที่อยากฝึกวันนี้</h1>
              <p className="writingGuideHubLead">
                ดูข้อสอบจริงล่าสุดจากผู้สอบ หรือฝึกเขียนทีละขั้นตอน — เลือกได้เลย
              </p>
            </div>
            <div className="writingGuideMegaGrid writingGuideMegaGrid-hub">
              <button
                type="button"
                className="writingGuideMegaCard writingGuideMegaCard-hub writingGuideMegaCard-hub-a"
                onClick={() => setFlow({ step: 'latest', filter: 'all' })}
              >
                <span className="writingGuideMegaBadge">ใหม่</span>
                <strong>ข้อสอบล่าสุด</strong>
                <span className="writingGuideMegaSub">โจทย์จริง Task 1 และ Task 2 จากผู้สอบเดือนนี้</span>
              </button>
              <button
                type="button"
                className="writingGuideMegaCard writingGuideMegaCard-hub writingGuideMegaCard-hub-b"
                onClick={() => setFlow({ step: 'latest', filter: 'task1' })}
              >
                <span className="writingGuideMegaBadge">Task 1</span>
                <strong>Task 1 ล่าสุด</strong>
                <span className="writingGuideMegaSub">โจทย์ Task 1 ที่เพิ่งออกสอบจริง</span>
              </button>
              <button
                type="button"
                className="writingGuideMegaCard writingGuideMegaCard-hub writingGuideMegaCard-hub-c"
                onClick={() => setFlow({ step: 'latest', filter: 'task2' })}
              >
                <span className="writingGuideMegaBadge">Task 2</span>
                <strong>Task 2 ล่าสุด</strong>
                <span className="writingGuideMegaSub">โจทย์ Task 2 ที่เพิ่งออกสอบจริง</span>
              </button>
              <button
                type="button"
                className="writingGuideMegaCard writingGuideMegaCard-hub writingGuideMegaCard-hub-d"
                onClick={() => setFlow({ step: 'task1-categories' })}
              >
                <span className="writingGuideMegaBadge">แบบฝึกหัด</span>
                <strong>แบบฝึกหัด Task 1</strong>
                <span className="writingGuideMegaSub">ฝึกเขียนทีละขั้นตอน 5 ประเภทกราฟ · 14 ข้อ</span>
              </button>
              <button
                type="button"
                className="writingGuideMegaCard writingGuideMegaCard-hub writingGuideMegaCard-hub-e"
                onClick={() => setFlow({ step: 'task2-types' })}
              >
                <span className="writingGuideMegaBadge">แบบฝึกหัด</span>
                <strong>แบบฝึกหัด Task 2</strong>
                <span className="writingGuideMegaSub">ดูประเภทคำถามและแนวทางการเขียนแต่ละแบบ</span>
              </button>
            </div>
          </div>
        ) : null}

        {flow.step === 'latest' ? (
          <div className="writingGuideMegaShell">
            <WritingFlowHead
              eyebrow={
                flow.filter === 'all' ? 'ข้อสอบล่าสุด' : flow.filter === 'task1' ? 'Task 1 · ล่าสุด' : 'Task 2 · ล่าสุด'
              }
              title={
                flow.filter === 'all'
                  ? 'ข้อสอบ Writing ล่าสุด'
                  : flow.filter === 'task1'
                  ? 'โจทย์ Task 1 ล่าสุด'
                  : 'โจทย์ Task 2 ล่าสุด'
              }
              subtitle="รวบรวมจากผู้สอบจริง อัปเดตทุกสัปดาห์ · ไม่ใช่ข้อสอบทางการ"
              onBack={goBack}
              backLabel="Home"
            />
            <WritingLatestSection
              filter={flow.filter}
              onPracticeTask1={() => setFlow({ step: 'task1-categories' })}
              onPracticeTask2={() => setFlow({ step: 'task2-types' })}
            />
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
            <div className="wlpTypeGrid">
              {WRITING_TASK1_TYPE_INFO.map((type) => (
                <article key={type.id} className="wlpTypeCard">
                  <span className="wlpTypeTag">{type.badge}</span>
                  <h3 className="wlpTypeTitle">{type.titleTh}</h3>
                  <p className="wlpTypeDesc">{type.descTh}</p>
                </article>
              ))}
            </div>
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
            <div className="wlpBand7Tabs wlpBand7Tabs-single">
              <p className="wlpSectionKicker">ตัวอย่างคำตอบ · Band 7 Model Answer</p>
              <Band7SampleView sample={WRITING_BAND7_TASK1_SAMPLE} />
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
                    {prompt.kind === 'timeline'
                      ? `${prompt.chartTypeLabel} · ${prompt.years[0]}–${prompt.years[prompt.years.length - 1]}`
                      : prompt.chartTypeLabel}
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
              {getWritingGuidedBuilder(activePrompt.id) ? (
                <button
                  type="button"
                  className="writingGuideHelperBtn"
                  onClick={() =>
                    setFlow({ step: 'task1-drill', categoryId: activeCategory.id, promptId: activePrompt.id })
                  }
                >
                  ฝึกเขียนทีละย่อหน้า
                </button>
              ) : null}
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

        {flow.step === 'task1-drill' && activePrompt ? (
          (() => {
            const exercise = getWritingGuidedBuilder(activePrompt.id)
            return (
              <div className="writingGuideExamShell">
                <div className="writingGuideExamToolbar">
                  <button type="button" className="writingGuideFlowBack" onClick={goBack}>
                    ← Back to exam
                  </button>
                </div>
                {exercise ? (
                  <WritingGuidedBuilder key={exercise.id} prompt={activePrompt} exercise={exercise} />
                ) : (
                  <div className="writingGuideComingSoon">
                    <p>Guided writing practice for this question is not ready yet.</p>
                  </div>
                )}
              </div>
            )
          })()
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
            <div className="wlpBand7Tabs wlpBand7Tabs-single">
              <p className="wlpSectionKicker">ตัวอย่างคำตอบ · Band 7 Model Answer</p>
              <Band7SampleView sample={WRITING_BAND7_TASK2_SAMPLE} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
