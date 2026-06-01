import type { CSSProperties } from 'react'
import {
  isGrammarSubtitleNote,
  parseSpeakingSampleSubtitleNote,
  SPEAKING_SAMPLE_NOTE_DISPLAY_SECONDS,
  type ParsedSpeakingSampleSubtitleNote,
  type SpeakingSampleSubtitleNote
} from './speakingSampleSubtitleNotes'

type SpeakingSampleKnowledgeOverlayProps = {
  notes: Array<SpeakingSampleSubtitleNote & { cueId?: string; revealSeconds?: number }>
  videoTime?: number
  className?: string
  cardClassName?: string
}

export function SpeakingSampleKnowledgeOverlay({
  notes,
  videoTime = 0,
  className = 'speakingSampleKnowledgeStack',
  cardClassName = 'speakingSampleKnowledgeCard'
}: SpeakingSampleKnowledgeOverlayProps) {
  const parsedNotes = notes
    .filter((note) => !isGrammarSubtitleNote(note))
    .map((note) => parseSpeakingSampleSubtitleNote(note))
    .filter((parsed): parsed is ParsedSpeakingSampleSubtitleNote => Boolean(parsed && parsed.kind === 'vocabulary'))

  if (!parsedNotes.length) return null

  return (
    <div className={className} aria-label="Vocabulary and grammar notes">
      <div className={`${className}Rail`} aria-hidden="true" />
      {parsedNotes.map((note, index) => {
        const sourceNote = notes.find((item) => item.id === note.id) || notes[index]
        const revealSeconds = Number(sourceNote?.revealSeconds || 0)
        const secondsLeft =
          revealSeconds > 0
            ? Math.max(0, revealSeconds + SPEAKING_SAMPLE_NOTE_DISPLAY_SECONDS - videoTime)
            : SPEAKING_SAMPLE_NOTE_DISPLAY_SECONDS
        const isFading = secondsLeft <= 2.5

        return (
        <article
          key={note.id}
          className={`${cardClassName} ${cardClassName}--vocabulary ${isFading ? `${cardClassName}--fading` : ''}`.trim()}
          style={
            {
              animationDelay: `${Math.min(index, 3) * 90}ms`,
              zIndex: index + 1
            } as CSSProperties
          }
        >
          <span className={`${cardClassName}Kind`}>
            Collocation
          </span>
          <strong>{note.headline}</strong>
          <p>{note.body}</p>
          {note.example ? (
            <p className={`${cardClassName}Example`}>
              &ldquo;{note.example.replace(/^["'“]|["'”]$/g, '')}&rdquo;
            </p>
          ) : null}
        </article>
      )})}
    </div>
  )
}
