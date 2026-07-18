// Printable-looking "Writing report" shown when a student opens a saved Task 2 essay from
// their notebook. Parallel to WritingReportView.tsx (Task 1), but there is no chart to
// re-render and the essay text is shown plain (Task 2 blanks resolve to one fixed model
// answer, so there is nothing to highlight as "your answer vs. correct answer").

import type { WritingTask2ReportSnapshot } from './writingReportTypes'
import { VocabHighlightText } from './VocabHighlightText'
import './WritingReportView.css'
import './WritingTask2ReportView.css'

export function WritingTask2ReportView({
  snapshot,
  onClose,
  onSaveVocab,
  savedWords
}: {
  snapshot: WritingTask2ReportSnapshot
  onClose?: () => void
  onSaveVocab?: (item: { word: string; thaiMeaning: string; example?: string }) => void
  savedWords?: Set<string>
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
          <p className="wgReportKicker">
            IELTS {snapshot.track === 'general-training' ? 'General Training' : 'Academic'} Writing · Task 2 · English Plan
          </p>
          {onClose ? (
            <button type="button" className="wgReportClose" onClick={onClose}>
              ✕ ปิด
            </button>
          ) : null}
        </div>
        <h2 className="wgReportTitle">{snapshot.questionTitle}</h2>
        <div className="wgReportMeta">
          <span className="wgReportBadge">Question {snapshot.questionNumber}</span>
          <span className="wgReportBadge">{snapshot.typeTitle}</span>
          <span className="wgReportBadge wgReportBadge-score">
            {correct}/{total} · {pct}%
          </span>
          <span className="wgReportDate">บันทึกเมื่อ {savedLabel}</span>
        </div>
      </header>

      <section className="wgReportEssayWrap">
        <article className="wgReportEssay">
          <p className="wgt2ReportVocabHint">
            คำที่<b>ขีดเส้นใต้</b>คือคำศัพท์/collocation สำคัญ — แตะเพื่อดูความหมายภาษาไทย
          </p>
          {snapshot.paragraphs.map((para) => (
            <div key={para.role} className="wgReportPara">
              <span className="wgReportParaLabel">{para.labelTh}</span>
              <p className="wgReportParaText">
                <VocabHighlightText
                  text={para.text}
                  vocab={snapshot.vocab}
                  savedWords={savedWords}
                  onSave={onSaveVocab}
                />
              </p>
            </div>
          ))}
        </article>

        {snapshot.vocab.length ? (
          <div className="wgt2ReportVocab">
            <p className="wgt2ReportVocabHead">คำศัพท์น่าเก็บจากเรียงความนี้ ({snapshot.vocab.length} คำ)</p>
            {snapshot.vocab.map((item) => (
              <div key={item.word} className="wgt2ReportVocabItem">
                <span className="wgt2ReportVocabWord">{item.word}</span>
                <span className="wgt2ReportVocabMeaning">{item.thaiMeaning}</span>
                {item.example ? <span className="wgt2ReportVocabExample">{item.example}</span> : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}
