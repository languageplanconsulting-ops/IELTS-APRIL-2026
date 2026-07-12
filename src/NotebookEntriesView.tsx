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
      <div className="notebookTabs">
        {notebookSectionTabs.map((sectionName) => (
          <button
            key={sectionName}
            type="button"
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
          <p>No saved items in this section yet.</p>
          <p>Use "Add to Notebook" in any "+1 band" recommendation.</p>
        </div>
      ) : (
        <div className="notebookGrid">
          {filteredNotebookEntries.map((entry) => (
            <article key={entry.id} className="notebookEntry">
              <div className="notebookEntryMeta">
                <span>{entry.section === 'custom' ? entry.customSectionName : entry.section}</span>
                <span>{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
              <h3>{entry.criterion}</h3>
              <p className="meta">Topic: {entry.topicTitle}</p>
              {entry.savedReportSnapshot ? (
                <>
                  <p className="entryOriginal">"{entry.quote}"</p>
                  <p className="entryBetter">{entry.fix}</p>
                  <div className="controls">
                    <button
                      type="button"
                      className="primaryNextBtn"
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
                  <p className="entryOriginal">"{entry.quote}"</p>
                  <p className="entryBetter">{entry.fix}</p>
                  {entry.thaiMeaning && <p className="meta">TH: {entry.thaiMeaning}</p>}
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
                  ) : (
                    entry.personalNote ? <p className="meta">Note: {entry.personalNote}</p> : null
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
