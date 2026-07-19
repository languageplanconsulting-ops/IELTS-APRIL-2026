import { ParaphraseBridgeActions } from './PracticeActionToast'
import type { ListeningParaphraseTeaching } from './listeningParaphraseTeaching'
import './ListeningParaphraseBox.css'

type ListeningParaphraseBoxProps = {
  teaching: ListeningParaphraseTeaching
  onKnewIt: () => void
  onSaveToNotebook: () => void
  className?: string
}

/** Report teaching card: audioscript = question wording = Thai + paraphrase method. */
export function ListeningParaphraseBox({
  teaching,
  onKnewIt,
  onSaveToNotebook,
  className = ''
}: ListeningParaphraseBoxProps) {
  return (
    <div className={`listeningParaphraseBox ${className}`.trim()}>
      <div className="listeningParaphraseBoxHead">
        <p className="listeningParaphraseBoxEyebrow">Paraphrase ในข้อนี้</p>
        <span
          className={`listeningParaphraseBoxMethod listeningParaphraseBoxMethod-${teaching.method}`}
        >
          {teaching.methodLabelTh}
        </span>
      </div>

      <div className="listeningParaphraseBoxEquation" aria-label="Audioscript equals question equals Thai">
        <div className="listeningParaphraseBoxCell">
          <span className="listeningParaphraseBoxCellLabel">ใน audioscript</span>
          <strong>{teaching.passageKeyword}</strong>
        </div>
        <span className="listeningParaphraseBoxEquals" aria-hidden="true">
          =
        </span>
        <div className="listeningParaphraseBoxCell">
          <span className="listeningParaphraseBoxCellLabel">ในคำถาม</span>
          <strong>{teaching.questionKeyword}</strong>
        </div>
        <span className="listeningParaphraseBoxEquals" aria-hidden="true">
          =
        </span>
        <div className="listeningParaphraseBoxCell listeningParaphraseBoxCell-thai">
          <span className="listeningParaphraseBoxCellLabel">ความหมายไทย</span>
          <strong>{teaching.thaiMeaning}</strong>
        </div>
      </div>

      <ParaphraseBridgeActions
        variant="report"
        knewLabel="✓ รู้แล้ว"
        saveLabel="+ บันทึก Notebook"
        onKnewIt={onKnewIt}
        onSaveToNotebook={onSaveToNotebook}
      />

      <div className="listeningParaphraseBoxExplain">
        <p className="listeningParaphraseBoxExplainLabel">คำอธิบาย (ทำไมถึง paraphrase แบบนี้)</p>
        <p>{teaching.explanationThai}</p>
      </div>
    </div>
  )
}
