// Shared IELTS Writing Task 1 chart / diagram renderers.
//
// Extracted from WritingGuidePage so the same infographic can be rendered both in
// the guided practice screen and in the saved "Writing report" inside the notebook.

import type {
  WritingTimelinePracticePrompt,
  WritingSnapshotPracticePrompt,
  WritingMixedPracticePrompt,
  WritingMixedPanel,
  WritingMapPracticePrompt,
  WritingProcessPracticePrompt,
  WritingTask1PracticePrompt,
  WritingLineSeries
} from './writingGuideData'

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

export function renderPromptChart(prompt: WritingTask1PracticePrompt) {
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
