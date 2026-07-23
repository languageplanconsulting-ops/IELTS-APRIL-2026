import { deriveNotebookFacets, type NotebookNoteKind } from './notebookFacets'

type NotebookEntryLike = {
  id: string
  section: string
  customSectionName?: string
  topicTitle: string
  criterion: string
  quote: string
  fix: string
  sourceQuestion?: string
  thaiMeaning?: string
  personalNote?: string
  noteKind?: NotebookNoteKind
  primaryText?: string
  secondaryText?: string
  savedReportSnapshot?: unknown
  createdAt: string
}

/** Short human label for the facet kind, shown as a chip on each card. */
const KIND_LABEL: Record<NotebookNoteKind, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  paraphrase: 'Paraphrase',
  report: 'Report',
  note: 'Note'
}

export type NotebookEntriesViewProps = {
  notebookSectionTabs: string[]
  selectedSection: string
  onSelectSection: (section: string) => void
  filteredNotebookEntries: NotebookEntryLike[]
  readOnly?: boolean
  onRemoveEntry?: (entryId: string) => void
  onUpdateNote?: (entryId: string, note: string) => void
  onOpenSavedReport?: (snapshot: any) => void
  onCreateCustomSection?: { value: string; onChange: (value: string) => void; onSubmit: () => void }
}

const sectionTone = (section: string) => {
  const key = section.toLowerCase()
  if (key.includes('essay')) return 'yellow'
  if (key.includes('writing')) return 'blue'
  if (key.includes('speaking')) return 'ink'
  if (key.includes('reading')) return 'soft'
  if (key.includes('listening')) return 'white'
  return 'soft'
}

export function NotebookEntriesView({
  notebookSectionTabs,
  selectedSection,
  onSelectSection,
  filteredNotebookEntries,
  readOnly = false,
  onRemoveEntry,
  onUpdateNote,
  onOpenSavedReport,
  onCreateCustomSection
}: NotebookEntriesViewProps) {
  return (
    <>
      <div className="notebookTabs" role="tablist" aria-label="Notebook sections">
        {notebookSectionTabs.map((sectionName) => (
          <button
            key={sectionName}
            type="button"
            role="tab"
            aria-selected={selectedSection === sectionName}
            className={selectedSection === sectionName ? 'active' : ''}
            onClick={() => onSelectSection(sectionName)}
          >
            {sectionName}
          </button>
        ))}
      </div>

      {!readOnly && onCreateCustomSection ? (
        <div className="customSectionRow">
          <input
            type="text"
            placeholder="Create custom section (e.g. Business English)"
            value={onCreateCustomSection.value}
            onChange={(event) => onCreateCustomSection.onChange(event.target.value)}
          />
          <button type="button" onClick={onCreateCustomSection.onSubmit}>
            Create
          </button>
        </div>
      ) : null}

      {filteredNotebookEntries.length === 0 ? (
        <div className="emptyNotebook">
          <p className="emptyNotebookTitle">ยังไม่มีรายการในหมวดนี้</p>
          <p>กด “Add to Notebook” จากคำแนะนำ +1 band หรือบันทึกเรียงความจาก Writing Practice</p>
        </div>
      ) : (
        <div className="notebookGrid">
          {filteredNotebookEntries.map((entry, index) => {
            const label = entry.section === 'custom' ? entry.customSectionName || 'Custom' : entry.section
            const tone = sectionTone(String(label))
            const hasReport = Boolean(entry.savedReportSnapshot)
            const facets = deriveNotebookFacets(entry)
            return (
              <article
                key={entry.id}
                className={`notebookEntry notebookEntry-${tone}${index === 0 && hasReport ? ' notebookEntry-featured' : ''}`}
              >
                <div className="notebookEntryMeta">
                  <span className="notebookEntryBadge">{label}</span>
                  {!hasReport ? (
                    <span className={`notebookEntryKindChip kind-${facets.kind}`}>
                      {KIND_LABEL[facets.kind]}
                    </span>
                  ) : null}
                  <span className="notebookEntryDate">{new Date(entry.createdAt).toLocaleString()}</span>
                </div>

                {/* Prioritized headline: vocabulary leads with the English word,
                    grammar with the rule, paraphrase with the A ↔ B pair. */}
                {!hasReport ? (
                  facets.kind === 'vocabulary' ? (
                    <div className="notebookEntryFacet">
                      <h3 className="notebookEntryWord">{facets.primary || entry.fix}</h3>
                      {facets.secondary ? (
                        <p className="notebookEntryThai">
                          <span>ความหมาย</span> {facets.secondary}
                        </p>
                      ) : null}
                    </div>
                  ) : facets.kind === 'grammar' ? (
                    <div className="notebookEntryFacet">
                      <p className="notebookEntryRule">{facets.primary || entry.criterion}</p>
                      {facets.secondary && facets.secondary !== facets.primary ? (
                        <p className="notebookEntryInstance">{facets.secondary}</p>
                      ) : null}
                    </div>
                  ) : facets.kind === 'paraphrase' ? (
                    <div className="notebookEntryFacet">
                      <div className="notebookEntryPairHighlight">
                        <span className="notebookEntryPairA">{facets.primary}</span>
                        <span className="notebookEntryPairEq">=</span>
                        <span className="notebookEntryPairB">{facets.secondary}</span>
                      </div>
                      {facets.thai ? (
                        <p className="notebookEntryThai">
                          <span>ความหมาย</span> {facets.thai}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="notebookEntryFacet">
                      <p className="notebookEntryCriterion">{entry.criterion}</p>
                      {entry.fix ? <h3 className="notebookEntryWord">{entry.fix}</h3> : null}
                    </div>
                  )
                ) : (
                  <p className="notebookEntryCriterion">{entry.criterion}</p>
                )}
                <p className="notebookEntryTopicLine">
                  {entry.topicTitle?.trim() || 'General vocabulary'}
                </p>

                {hasReport ? (
                  <>
                    {entry.quote ? <p className="entryOriginal">"{entry.quote}"</p> : null}
                    {entry.fix ? <p className="entryBetter">{entry.fix}</p> : null}
                    <div className="notebookEntryControls">
                      <button
                        type="button"
                        className="notebookPrimaryBtn"
                        onClick={() => onOpenSavedReport?.(entry.savedReportSnapshot)}
                      >
                        Open Full Saved Report
                      </button>
                      {!readOnly ? (
                        <button
                          type="button"
                          className="removeNotebookBtn"
                          onClick={() => onRemoveEntry?.(entry.id)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Meaning is already surfaced in the prioritized headline for
                        vocabulary/paraphrase; only show the raw Thai here as a
                        fallback for notes that had no facet meaning. */}
                    {entry.thaiMeaning && facets.kind !== 'vocabulary' && facets.kind !== 'paraphrase' ? (
                      <p className="notebookEntryThai">
                        <span>คำแปล</span> {entry.thaiMeaning}
                      </p>
                    ) : null}
                    {entry.quote || entry.sourceQuestion ? (
                      <details className="notebookEntryQuestion">
                        <summary>คำถามโจทย์: {entry.quote}</summary>
                        {entry.sourceQuestion ? (
                          <p className="notebookEntryQuestionBody">{entry.sourceQuestion}</p>
                        ) : (
                          <p className="notebookEntryQuestionBody is-empty">
                            ยังไม่ได้บันทึกข้อความโจทย์ของข้อนี้
                          </p>
                        )}
                      </details>
                    ) : null}
                    {!readOnly ? (
                      <>
                        <label className="noteFieldLabel">
                          Personal note
                          <textarea
                            value={entry.personalNote || ''}
                            onChange={(event) => onUpdateNote?.(entry.id, event.target.value)}
                            placeholder="Write your own reminder, vocabulary note, or speaking strategy..."
                          />
                        </label>
                        <button
                          type="button"
                          className="removeNotebookBtn"
                          onClick={() => onRemoveEntry?.(entry.id)}
                        >
                          Remove
                        </button>
                      </>
                    ) : entry.personalNote ? (
                      <p className="notebookEntryThai">Note: {entry.personalNote}</p>
                    ) : null}
                  </>
                )}
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
