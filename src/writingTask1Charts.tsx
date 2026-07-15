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
  WritingLineSeries,
  Task1MapDecor,
  Task1MapPanel,
  Task1MapZone
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
  const rows = prompt.series?.length
    ? prompt.series
    : [{ label: prompt.valueLabel, color: '#0f53c9', values: prompt.values }]
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
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.values.map((value, index) => (
                <td key={`${prompt.id}-${row.label}-${prompt.years[index]}`}>{value}</td>
              ))}
            </tr>
          ))}
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

function pointsToPath(points: [number, number][], ox: number, y0: number, scaleX: number, scaleY: number) {
  return points
    .map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${ox + px * scaleX},${y0 + py * scaleY}`)
    .join(' ')
}

function MapTreeIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={4.2} fill="#86efac" stroke="#15803d" strokeWidth={0.7} />
      <circle cx={-2.2} cy={-1.5} r={2.8} fill="#4ade80" stroke="#15803d" strokeWidth={0.5} />
      <circle cx={2.4} cy={-1.2} r={2.6} fill="#22c55e" stroke="#15803d" strokeWidth={0.5} />
      <rect x={-0.7} y={3} width={1.4} height={4} fill="#854d0e" rx={0.4} />
    </g>
  )
}

function zoneHatchPattern(style: Task1MapZone['style'], id: string) {
  if (style === 'farm') {
    return (
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#65a30d" strokeWidth="1" opacity="0.35" />
      </pattern>
    )
  }
  if (style === 'parking') {
    return (
      <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M1,7 L7,1" stroke="#64748b" strokeWidth="1" opacity="0.45" />
      </pattern>
    )
  }
  if (style === 'forest') {
    return (
      <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="4" r="2" fill="#16a34a" opacity="0.35" />
        <circle cx="7" cy="7" r="1.6" fill="#15803d" opacity="0.3" />
      </pattern>
    )
  }
  return null
}

function renderMapDecor(
  decor: Task1MapDecor[],
  ox: number,
  y0: number,
  scaleX: number,
  scaleY: number,
  panelKey: string
) {
  return decor.map((item, i) => {
    const key = `${panelKey}-d-${i}`
    if (item.kind === 'water') {
      const d = `${pointsToPath(item.points, ox, y0, scaleX, scaleY)} Z`
      const labelAt = item.labelAt
      return (
        <g key={key}>
          <path d={d} fill="#bae6fd" stroke="#0284c7" strokeWidth={1.2} opacity={0.95} />
          {item.label && labelAt ? (
            <text
              x={ox + labelAt[0] * scaleX}
              y={y0 + labelAt[1] * scaleY}
              textAnchor="middle"
              className="writingIeltsMapSoftLabel"
            >
              {item.label}
            </text>
          ) : null}
        </g>
      )
    }
    if (item.kind === 'road') {
      const d = pointsToPath(item.points, ox, y0, scaleX, scaleY)
      const mid = item.points[Math.floor(item.points.length / 2)]
      return (
        <g key={key}>
          <path
            d={d}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={(item.width || 2.8) + 2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={d}
            fill="none"
            stroke="#64748b"
            strokeWidth={item.width || 2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={d}
            fill="none"
            stroke="#f8fafc"
            strokeWidth={0.7}
            strokeDasharray="3 4"
            strokeLinecap="round"
          />
          {item.label && mid ? (
            <text
              x={ox + mid[0] * scaleX}
              y={y0 + mid[1] * scaleY - 6}
              textAnchor="middle"
              className="writingIeltsMapSoftLabel"
            >
              {item.label.replace('\\n', ' ')}
            </text>
          ) : null}
        </g>
      )
    }
    if (item.kind === 'path') {
      return (
        <path
          key={key}
          d={pointsToPath(item.points, ox, y0, scaleX, scaleY)}
          fill="none"
          stroke="#a8a29e"
          strokeWidth={1.4}
          strokeDasharray="3 2"
          strokeLinecap="round"
        />
      )
    }
    if (item.kind === 'trees') {
      return (
        <g key={key}>
          {item.positions.map(([tx, ty], ti) => (
            <MapTreeIcon key={ti} x={ox + tx * scaleX} y={y0 + ty * scaleY} />
          ))}
        </g>
      )
    }
    if (item.kind === 'bridge') {
      return (
        <g key={key}>
          <rect
            x={ox + item.x * scaleX}
            y={y0 + item.y * scaleY}
            width={item.w * scaleX}
            height={item.h * scaleY}
            fill="#e7e5e4"
            stroke="#57534e"
            strokeWidth={1.2}
            rx={1.5}
          />
          {item.label ? (
            <text
              x={ox + (item.x + item.w / 2) * scaleX}
              y={y0 + (item.y + item.h / 2) * scaleY + 3}
              textAnchor="middle"
              className="writingIeltsMapZoneLabel"
            >
              {item.label}
            </text>
          ) : null}
        </g>
      )
    }
    return (
      <text
        key={key}
        x={ox + item.x * scaleX}
        y={y0 + item.y * scaleY}
        textAnchor="middle"
        className="writingIeltsMapTitleLabel"
      >
        {item.text}
      </text>
    )
  })
}

function WritingMapDiagramSvg({ prompt }: { prompt: WritingMapPracticePrompt }) {
  const W = CHART_SIZE.width
  const mapW = 286
  const mapH = 210
  const gap = 40
  const x1 = (W - (mapW * 2 + gap)) / 2
  const x2 = x1 + mapW + gap
  const y0 = 34
  const scaleX = mapW / MAP_BASE_W
  const scaleY = mapH / MAP_BASE_H
  const roadStep = 34
  const legendY = y0 + mapH + 18

  const legendEntries: { label: string; color: string }[] = []
  const seenLabels = new Set<string>()
  ;[...prompt.before.zones, ...prompt.after.zones].forEach((zone) => {
    const key = zone.label.replace(/\n/g, ' ')
    if (!seenLabels.has(key)) {
      seenLabels.add(key)
      legendEntries.push({ label: key, color: zone.color })
    }
  })

  const renderPanel = (panel: Task1MapPanel, pi: number) => {
    const ox = pi === 0 ? x1 : x2
    const showGrid = panel.showGrid !== false && !(panel.decor && panel.decor.length)
    const verticals: number[] = []
    const horizontals: number[] = []
    if (showGrid) {
      for (let rx = roadStep; rx < MAP_BASE_W; rx += roadStep) verticals.push(rx)
      for (let ry = roadStep; ry < MAP_BASE_H; ry += roadStep) horizontals.push(ry)
    }

    return (
      <g key={pi}>
        <text x={ox + mapW / 2} y={y0 - 12} textAnchor="middle" className="writingIeltsMapYear">
          {panel.year}
        </text>
        <rect x={ox} y={y0} width={mapW} height={mapH} className="writingIeltsMapGround" rx={4} />

        {/* Base ground wash */}
        <rect x={ox + 1} y={y0 + 1} width={mapW - 2} height={mapH - 2} fill="#f1f5f9" rx={3} />

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

        {panel.decor ? renderMapDecor(panel.decor, ox, y0, scaleX, scaleY, `p${pi}`) : null}

        <defs>
          {panel.zones.map((zone, zi) => zoneHatchPattern(zone.style, `hatch-${pi}-${zi}`))}
        </defs>

        {panel.zones.map((zone, zi) => {
          const zx = ox + zone.x * scaleX
          const zy = y0 + zone.y * scaleY
          const zw = zone.w * scaleX
          const zh = zone.h * scaleY
          const lines = zone.label.split('\n')
          const labelStartY = zy + zh / 2 - ((lines.length - 1) * 5.5) + 3
          const isWater = zone.style === 'water'
          const hatchId = `hatch-${pi}-${zi}`
          const hasHatch = zone.style === 'farm' || zone.style === 'parking' || zone.style === 'forest'
          return (
            <g key={zi}>
              <rect
                x={zx}
                y={zy}
                width={zw}
                height={zh}
                fill={zone.color}
                stroke={isWater ? '#0284c7' : '#334155'}
                strokeWidth={isWater ? 1.2 : 1.4}
                rx={zone.style === 'building' || !zone.style ? 2 : 3}
                opacity={0.96}
              />
              {hasHatch ? (
                <rect x={zx} y={zy} width={zw} height={zh} fill={`url(#${hatchId})`} rx={3} />
              ) : null}
              {zone.style === 'parking' ? (
                <text
                  x={zx + zw / 2}
                  y={zy + 12}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={800}
                  fill="#475569"
                >
                  P
                </text>
              ) : null}
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={zx + zw / 2}
                  y={labelStartY + li * 10}
                  textAnchor="middle"
                  className="writingIeltsMapZoneLabel"
                >
                  {line}
                </text>
              ))}
            </g>
          )
        })}

        <rect x={ox} y={y0} width={mapW} height={mapH} className="writingIeltsMapBorder" rx={4} />
      </g>
    )
  }

  return (
    <figure className="writingIeltsFigure">
      <figcaption className="writingIeltsFigureCaption">{prompt.chartCaption}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${legendY + 8}`}
        className="writingIeltsChartSvg writingIeltsMapDiagram"
        role="img"
        aria-label={`Map diagram showing ${prompt.chartCaption}`}
      >
        <g transform={`translate(${W - 34}, 26)`}>
          <circle r={15} fill="#fff" stroke="#0f172a" strokeWidth={1.6} />
          <path d="M0,-10 L3,1 L0,11 L-3,1 Z" fill="#0f172a" />
          <text y={-17} textAnchor="middle" fontSize={9} fontWeight={800} fill="#0f172a">
            N
          </text>
        </g>

        <g transform={`translate(${(x1 + mapW + x2) / 2}, ${y0 + mapH / 2})`}>
          <circle r={12} fill="#fff" stroke="#0f172a" strokeWidth={1.5} />
          <path d="M-5,0 L4,0" stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
          <path d="M1,-4 L6,0 L1,4" fill="none" stroke="#0f172a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {renderPanel(prompt.before, 0)}
        {renderPanel(prompt.after, 1)}
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
