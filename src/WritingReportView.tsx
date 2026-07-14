// Beautiful, printable-looking "Writing report" shown when a student opens a saved
// Task 1 essay from their notebook. It re-renders the original chart/infographic and the
// full essay, with every answered blank highlighted (green = right first try, amber = missed).

import { renderPromptChart } from './writingTask1Charts'
import type { WritingReportSnapshot } from './writingReportTypes'
import './WritingReportView.css'

const focusLabelTh: Record<string, string> = {
  paraphrase: 'พาราเฟรส',
  'word-choice': 'เลือกคำ',
  transition: 'คำเชื่อม',
  referencing: 'การอ้างถึง',
  'trend-phrase': 'วลีบอกแนวโน้ม',
  'verb-tense': 'รูปกริยา',
  'ving-clause': 'V-ing clause',
  'v3-clause': 'V3 / passive',
  'degree-adverb': 'adverb บอกระดับ'
}

export function WritingReportView({
  snapshot,
  onClose
}: {
  snapshot: WritingReportSnapshot
  onClose?: () => void
}) {
  const { correct, total } = snapshot.score
  const pct = total ? Math.round((correct / total) * 100) : 0
  const savedLabel = (() => {
    try {
      return new Date(snapshot.savedAt).toLocaleString()
    } catch {
      return snapshot.savedAt
    }
  })()

  return (
    <div className="wgReport">
      <header className="wgReportHead">
        <div className="wgReportHeadRow">
          <p className="wgReportKicker">IELTS Academic Writing · Task 1 · English Plan</p>
          {onClose ? (
            <button type="button" className="wgReportClose" onClick={onClose}>
              ✕ ปิด
            </button>
          ) : null}
        </div>
        <h2 className="wgReportTitle">{snapshot.questionTitle}</h2>
        <div className="wgReportMeta">
          <span className="wgReportBadge">Question {snapshot.questionNumber}</span>
          <span className="wgReportBadge">{snapshot.categoryTitle}</span>
          <span className="wgReportBadge wgReportBadge-score">
            {correct}/{total} · {pct}%
          </span>
          <span className="wgReportDate">บันทึกเมื่อ {savedLabel}</span>
        </div>
      </header>

      <section className="wgReportChartWrap">{renderPromptChart(snapshot.prompt)}</section>

      <section className="wgReportEssayWrap">
        <div className="wgReportLegend">
          <span className="wgReportLegendItem">
            <span className="wgReportSwatch is-correct" /> ตอบถูกตั้งแต่แรก
          </span>
          <span className="wgReportLegendItem">
            <span className="wgReportSwatch is-missed" /> เคยตอบผิด / เปิดเฉลย
          </span>
        </div>

        <article className="wgReportEssay">
          {snapshot.paragraphs.map((para) => (
            <div key={para.role} className="wgReportPara">
              <span className="wgReportParaLabel">{para.labelTh}</span>
              <p className="wgReportParaText">
                {para.segments.map((segment, index) => {
                  if (segment.kind === 'text') return <span key={index}>{segment.text}</span>
                  const title =
                    (focusLabelTh[segment.focus] || segment.focus) +
                    (segment.correct
                      ? ''
                      : segment.given
                        ? ` · คุณตอบ: ${segment.given}`
                        : ' · เว้นว่าง / เปิดเฉลย')
                  return (
                    <mark
                      key={index}
                      className={`wgReportBlank ${segment.correct ? 'is-correct' : 'is-missed'}`}
                      title={title}
                    >
                      {segment.text}
                    </mark>
                  )
                })}
              </p>
            </div>
          ))}
        </article>
      </section>
    </div>
  )
}
