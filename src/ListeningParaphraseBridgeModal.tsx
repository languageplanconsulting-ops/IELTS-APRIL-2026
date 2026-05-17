import { useEffect } from 'react'
import { ParaphraseBridgeActions } from './PracticeActionToast'
import './ListeningParaphraseBridgeModal.css'

export type ListeningParaphraseBridgeModalProps = {
  passageKeyword: string
  questionKeyword: string
  thaiMeaning: string
  explanationThai: string
  onKnewIt: () => void
  onSaveToNotebook: () => void
  onClose: () => void
}

export function ListeningParaphraseBridgeModal({
  passageKeyword,
  questionKeyword,
  thaiMeaning,
  explanationThai,
  onKnewIt,
  onSaveToNotebook,
  onClose
}: ListeningParaphraseBridgeModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="listeningParaphraseBridgeOverlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="listeningParaphraseBridgeModal listeningFoundationWordCheck"
        role="dialog"
        aria-modal="true"
        aria-labelledby="listening-paraphrase-bridge-title"
        onClick={(event) => event.stopPropagation()}
      >
        <p id="listening-paraphrase-bridge-title" className="listeningParaphraseBridgeModalTitle">
          Do you know this word?
        </p>
        <div className="listeningFoundationWordEquation listeningParaphraseBridgeEquation">
          <span title="In the script">{passageKeyword}</span>
          <b>=</b>
          <span title="In the question">{questionKeyword}</span>
          <b>=</b>
          <span title="Thai meaning">{thaiMeaning}</span>
        </div>
        {explanationThai ? <small className="listeningParaphraseBridgeExplanation">{explanationThai}</small> : null}
        <ParaphraseBridgeActions
          className="listeningParaphraseBridgeActions"
          onKnewIt={onKnewIt}
          onSaveToNotebook={onSaveToNotebook}
        />
      </div>
    </div>
  )
}
