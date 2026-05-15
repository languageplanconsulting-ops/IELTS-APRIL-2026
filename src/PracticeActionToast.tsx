import { useEffect } from 'react'
import './PracticeActionToast.css'

export type PracticeActionToastState = {
  id: number
  message: string
  variant: 'celebrate' | 'notebook'
} | null

type PracticeActionToastProps = {
  toast: PracticeActionToastState
  onDismiss: () => void
}

export function PracticeActionToast({ toast, onDismiss }: PracticeActionToastProps) {
  useEffect(() => {
    if (!toast) return
    const duration = toast.variant === 'celebrate' ? 3200 : 2800
    const timer = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div
      key={toast.id}
      className={`practiceActionToast practiceActionToast--${toast.variant}`}
      role="status"
      aria-live="polite"
    >
      {toast.variant === 'celebrate' && <span className="practiceActionToastBadge">Outstanding</span>}
      <p className="practiceActionToastMessage">{toast.message}</p>
    </div>
  )
}

type ParaphraseBridgeActionsProps = {
  onKnewIt: () => void
  onSaveToNotebook: () => void
  knewLabel?: string
  saveLabel?: string
  className?: string
}

export function ParaphraseBridgeActions({
  onKnewIt,
  onSaveToNotebook,
  knewLabel = 'Yes, I knew it',
  saveLabel = 'Save to Notebook',
  className = ''
}: ParaphraseBridgeActionsProps) {
  return (
    <div className={`paraphraseBridgeActions ${className}`.trim()}>
      <button type="button" className="secondary" onClick={onKnewIt}>
        {knewLabel}
      </button>
      <button type="button" onClick={onSaveToNotebook}>
        {saveLabel}
      </button>
    </div>
  )
}
