import { useEffect, useMemo, useState } from 'react'
import {
  WRITING_MAP_PRACTICE_PROMPTS,
  WRITING_MIXED_PRACTICE_PROMPTS,
  WRITING_PROCESS_PRACTICE_PROMPTS,
  WRITING_SNAPSHOT_PRACTICE_PROMPTS,
  WRITING_TIMELINE_PRACTICE_PROMPTS,
  type WritingTask1PracticePrompt
} from '../writingGuideData'
import { assembleGuidedEssay, getWritingGuidedBuilder, type WgbStep } from '../writingGuidedBuilder'
import { renderPromptChart } from '../writingTask1Charts'
import './Task1QaReview.css'

type Task1QaReviewProps = {
  accessToken?: string
}

type EssayParagraph = { role: WgbStep['role']; labelTh: string; text: string }

type QaComment = {
  id: string
  promptId: string
  role: string
  quote: string
  note: string
  status: 'open' | 'resolved'
  createdAt: string | null
}

const KIND_LABEL: Record<WritingTask1PracticePrompt['kind'], string> = {
  timeline: 'Timeline',
  snapshot: 'Snapshot (no-timeline)',
  mixed: 'Mixed',
  map: 'Map',
  process: 'Process'
}

const ROLE_LABEL: Record<string, string> = {
  intro: 'Introduction',
  overview: 'Overview',
  body1: 'Body 1',
  body2: 'Body 2',
  general: 'General'
}

const fetchJson = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    const message = payload?.error?.message || payload?.error || `Request failed (${response.status})`
    throw new Error(String(message))
  }
  return response.json() as Promise<T>
}

export function Task1QaReview({ accessToken }: Task1QaReviewProps) {
  const prompts = useMemo<WritingTask1PracticePrompt[]>(
    () => [
      ...WRITING_TIMELINE_PRACTICE_PROMPTS,
      ...WRITING_SNAPSHOT_PRACTICE_PROMPTS,
      ...WRITING_MIXED_PRACTICE_PROMPTS,
      ...WRITING_MAP_PRACTICE_PROMPTS,
      ...WRITING_PROCESS_PRACTICE_PROMPTS
    ],
    []
  )

  const [index, setIndex] = useState(0)
  const [comments, setComments] = useState<QaComment[]>([])
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [draftRole, setDraftRole] = useState<string | null>(null)
  const [draftNote, setDraftNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const prompt = prompts[index]

  const paragraphs = useMemo<EssayParagraph[]>(() => {
    const exercise = getWritingGuidedBuilder(prompt.id)
    if (!exercise) return []
    return assembleGuidedEssay(exercise)
  }, [prompt.id])

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setIsLoading(true)
    setLoadError('')
    fetchJson<{ comments: QaComment[] }>('/api/admin/task1-qa-comments', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then((payload) => {
        if (!cancelled) setComments(Array.isArray(payload.comments) ? payload.comments : [])
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Could not load the QA queue.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [accessToken])

  const commentsByPrompt = useMemo(() => {
    const map = new Map<string, QaComment[]>()
    comments.forEach((comment) => {
      const list = map.get(comment.promptId) || []
      list.push(comment)
      map.set(comment.promptId, list)
    })
    return map
  }, [comments])

  const currentComments = commentsByPrompt.get(prompt.id) || []

  const promptStatusDot = (candidate: WritingTask1PracticePrompt) => {
    const list = commentsByPrompt.get(candidate.id) || []
    if (list.length === 0) return 'none'
    return list.every((c) => c.status === 'resolved') ? 'resolved' : 'open'
  }

  const openDraft = (role: string) => {
    setDraftRole(role)
    setDraftNote('')
  }

  const cancelDraft = () => {
    setDraftRole(null)
    setDraftNote('')
  }

  const saveDraft = async () => {
    if (!accessToken || !draftRole || !draftNote.trim()) return
    const paragraph = paragraphs.find((p) => p.role === draftRole)
    setIsSaving(true)
    try {
      const payload = await fetchJson<{ comment: QaComment }>('/api/admin/task1-qa-comments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          promptId: prompt.id,
          role: draftRole,
          quote: paragraph?.text || '',
          note: draftNote.trim()
        })
      })
      setComments((prev) => [payload.comment, ...prev])
      cancelDraft()
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not save the note.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleResolved = async (comment: QaComment) => {
    if (!accessToken) return
    const nextStatus = comment.status === 'resolved' ? 'open' : 'resolved'
    try {
      const payload = await fetchJson<{ comment: QaComment }>(`/api/admin/task1-qa-comments/${comment.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status: nextStatus })
      })
      setComments((prev) => prev.map((c) => (c.id === comment.id ? payload.comment : c)))
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Could not update the note.')
    }
  }

  const goNext = () => {
    setStatusMessage('')
    cancelDraft()
    setIndex((i) => Math.min(i + 1, prompts.length - 1))
  }

  const goPrev = () => {
    setStatusMessage('')
    cancelDraft()
    setIndex((i) => Math.max(i - 1, 0))
  }

  if (!accessToken) {
    return <p className="meta">Sign in as an admin to use the Task 1 QA review tool.</p>
  }

  return (
    <div className="task1QaReview">
      <div className="task1QaToolbar">
        <div className="task1QaProgress">
          {index + 1} / {prompts.length}
          <span className="task1QaKind">{KIND_LABEL[prompt.kind]}</span>
        </div>
        <select
          value={prompt.id}
          onChange={(event) => {
            const nextIndex = prompts.findIndex((p) => p.id === event.target.value)
            if (nextIndex >= 0) {
              cancelDraft()
              setStatusMessage('')
              setIndex(nextIndex)
            }
          }}
        >
          {prompts.map((p, i) => {
            const dot = promptStatusDot(p)
            const marker = dot === 'open' ? '● open — ' : dot === 'resolved' ? '✓ resolved — ' : ''
            return (
              <option key={p.id} value={p.id}>
                {i + 1}. {marker}
                {p.id}
              </option>
            )
          })}
        </select>
        <div className="task1QaNavButtons">
          <button type="button" onClick={goPrev} disabled={index === 0}>
            Prev
          </button>
          <button type="button" onClick={goNext} disabled={index === prompts.length - 1}>
            Next
          </button>
        </div>
      </div>

      {isLoading && <p className="meta">Loading QA queue…</p>}
      {loadError && <p className="error">{loadError}</p>}
      {statusMessage && <p className="error">{statusMessage}</p>}

      <div className="task1QaBody">
        <div className="task1QaChartPane">{renderPromptChart(prompt)}</div>

        <div className="task1QaEssayPane">
          {paragraphs.map((paragraph) => {
            const paragraphComments = currentComments.filter((c) => c.role === paragraph.role)
            return (
              <div key={paragraph.role} className="task1QaParagraph">
                <div className="task1QaParagraphHeader">
                  <span className="task1QaRoleLabel">{ROLE_LABEL[paragraph.role] || paragraph.role}</span>
                  <button type="button" className="task1QaAddNoteBtn" onClick={() => openDraft(paragraph.role)}>
                    Add note
                  </button>
                </div>
                <p className="task1QaParagraphText">{paragraph.text}</p>

                {draftRole === paragraph.role && (
                  <div className="task1QaDraft">
                    <textarea
                      autoFocus
                      value={draftNote}
                      onChange={(event) => setDraftNote(event.target.value)}
                      placeholder="What's wrong, or what should change?"
                    />
                    <div className="task1QaDraftButtons">
                      <button type="button" onClick={saveDraft} disabled={isSaving || !draftNote.trim()}>
                        Save note
                      </button>
                      <button type="button" onClick={cancelDraft}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {paragraphComments.length > 0 && (
                  <div className="task1QaNotes">
                    {paragraphComments.map((comment) => (
                      <div key={comment.id} className={`task1QaNoteChip task1QaNoteChip-${comment.status}`}>
                        <span>{comment.note}</span>
                        <button type="button" onClick={() => toggleResolved(comment)}>
                          {comment.status === 'resolved' ? 'Reopen' : 'Mark resolved'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="task1QaFooter">
        <button type="button" onClick={goNext} disabled={index === prompts.length - 1}>
          Next question →
        </button>
      </div>
    </div>
  )
}
