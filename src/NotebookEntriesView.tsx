type NotebookEntryLike = {
  id: string
  section: string
  customSectionName?: string
  topicTitle: string
  criterion: string
  quote: string
  fix: string
  thaiMeaning?: string
  personalNote?: string
  savedReportSnapshot?: unknown
  createdAt: string
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
            return (
              <article
                key={entry.id}
                className={`notebookEntry notebookEntry-${tone}${index === 0 && hasReport ? ' notebookEntry-featured' : ''}`}
              >
                <div className="notebookEntryMeta">
                  <span className="notebookEntryBadge">{label}</span>
                  <span className="notebookEntryDate">{new Date(entry.createdAt).toLocaleString()}</span>
                </div>

                <p className="notebookEntryCriterion">{entry.criterion}</p>
                <h3 className="notebookEntryTopic">Topic: {entry.topicTitle}</h3>

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
                    {entry.quote ? <p className="entryOriginal">"{entry.quote}"</p> : null}
                    {entry.fix ? <p className="entryBetter">{entry.fix}</p> : null}
                    {entry.thaiMeaning ? <p className="notebookEntryThai">TH: {entry.thaiMeaning}</p> : null}
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
