import type { CSSProperties } from 'react'
import {
  parseSpeakingSampleSubtitleNote,
  type ParsedSpeakingSampleSubtitleNote,
  type SpeakingSampleSubtitleNote
} from './speakingSampleSubtitleNotes'

type SpeakingSampleKnowledgeOverlayProps = {
  notes: Array<SpeakingSampleSubtitleNote & { cueId?: string; revealSeconds?: number }>
  className?: string
  cardClassName?: string
}

export function SpeakingSampleKnowledgeOverlay({
  notes,
  className = 'speakingSampleKnowledgeStack',
  cardClassName = 'speakingSampleKnowledgeCard'
}: SpeakingSampleKnowledgeOverlayProps) {
  const parsedNotes = notes
    .map((note) => parseSpeakingSampleSubtitleNote(note))
    .filter(Boolean) as ParsedSpeakingSampleSubtitleNote[]

  if (!parsedNotes.length) return null

  return (
    <div className={className} aria-label="Vocabulary and grammar notes">
      <div className={`${className}Rail`} aria-hidden="true" />
      {parsedNotes.map((note, index) => (
        <article
          key={note.id}
          className={`${cardClassName} ${note.kind === 'grammar' ? `${cardClassName}--grammar` : `${cardClassName}--vocabulary`}`.trim()}
          style={
            {
              animationDelay: `${Math.min(index, 3) * 90}ms`,
              zIndex: index + 1
            } as CSSProperties
          }
        >
          <span className={`${cardClassName}Kind`}>
            {note.kind === 'grammar' ? 'Grammar' : 'Vocabulary'}
          </span>
          <strong>{note.headline}</strong>
          <p>{note.body}</p>
          {note.example ? (
            <p className={`${cardClassName}Example`}>
              &ldquo;{note.example.replace(/^["'“]|["'”]$/g, '')}&rdquo;
            </p>
          ) : null}
        </article>
      ))}
    </div>
  )
}
