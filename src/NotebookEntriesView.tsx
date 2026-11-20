import { highlightPhrasesInText } from './PastelHighlight'
import {
  READING_RELATION_LABELS,
  parseLegacyParaphraseEntry,
  type ReadingParaphraseNote
} from './readingParaphrase'

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
  paraphrase?: ReadingParaphraseNote
  savedReportSnapshot?: unknown
  createdAt: string
}

export type NotebookEntriesViewProps = {
  notebookSectionTabs: string[]
  selectedSection: string
  onSelectSection: (section: string) => void
  filteredNotebookEntries: NotebookEntryLike[]
  /** Per-tab totals, so the tabs show where the saved work actually is. */
  sectionCounts?: Record<string, number>
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
  sectionCounts,
  readOnly = false,
  onRemoveEntry,
  onUpdateNote,
  onOpenSavedReport,
  onCreateCustomSection
}: NotebookEntriesViewProps) {
  return (
    <>
      <div className="notebookTabs" role="tablist" aria-label="Notebook sections">
        {notebookSectionTabs.map((sectionName) => {
          const count = sectionCounts?.[sectionName] ?? 0
          return (
            <button
              key={sectionName}
              type="button"
              role="tab"
              aria-selected={selectedSection === sectionName}
              className={selectedSection === sectionName ? 'active' : ''}
              onClick={() => onSelectSection(sectionName)}
            >
              {sectionName}
              {count > 0 && <span className="notebookTabCount">{count}</span>}
            </button>
          )
        })}
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
            // Reading paraphrase pairs get their own card: question words ↔ passage words.
            const pair: ReadingParaphraseNote | null =
              !hasReport && entry.paraphrase?.q && entry.paraphrase?.p
                ? entry.paraphrase
                : !hasReport
                  ? parseLegacyParaphraseEntry(entry)
                  : null
            if (pair) {
              const relation = pair.relation || 'same'
              const relationLabel = READING_RELATION_LABELS[relation]
              const thai = pair.th || entry.thaiMeaning || ''
              return (
                <article key={entry.id} className={`notebookEntry notebookEntry-${tone} notebookEntry-paraphrase`}>
                  <div className="notebookEntryMeta">
                    <span className="notebookEntryBadge">{label}</span>
                    <span className="notebookEntryDate">{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="notebookEntryCriterion">{entry.criterion}</p>

                  <div className={`ppCard is-${relation}`}>
                    <div className="ppCardSide">
                      <span className="ppCardSideLabel">❓ คำในโจทย์</span>
                      <span className="ppChip pp-q">{pair.q}</span>
                    </div>
                    <div className={`ppCardSign is-${relation}`}>
                      <strong aria-hidden="true">{relationLabel.sign}</strong>
                      <span>{relationLabel.text}</span>
                    </div>
                    <div className="ppCardSide">
                      <span className="ppCardSideLabel">📖 คำในบทความ</span>
                      <span className="ppChip pp-p">{pair.p}</span>
                    </div>
                  </div>

                  {thai ? (
                    <p className="notebookEntryThai">
                      <span>ความหมาย</span> {thai}
                    </p>
                  ) : null}
                  {pair.note ? <p className="ppWhy">💡 {pair.note}</p> : null}

                  {pair.questionText || pair.passageText ? (
                    <details className="notebookEntryQuestion">
                      <summary>ดูคำนี้ในประโยคจริง</summary>
                      {pair.questionText ? (
                        <p className="ppContext">
                          <span className="ppContextLabel">❓ โจทย์</span>
                          {highlightPhrasesInText(pair.questionText, [{ text: pair.q, className: 'pp-q' }])}
                        </p>
                      ) : null}
                      {pair.passageText ? (
                        <p className="ppContext">
                          <span className="ppContextLabel">📖 บทความ</span>
                          {highlightPhrasesInText(pair.passageText, [{ text: pair.p, className: 'pp-p' }])}
                        </p>
                      ) : null}
                    </details>
                  ) : null}

                  {!readOnly ? (
                    <>
                      <label className="noteFieldLabel">
                        โน้ตของฉัน
                        <textarea
                          value={entry.personalNote || ''}
                          onChange={(event) => onUpdateNote?.(entry.id, event.target.value)}
                          placeholder="ลองแต่งประโยคเองด้วยคำคู่นี้ หรือจดคำอื่นที่ความหมายเหมือนกัน..."
                        />
                      </label>
                      <button type="button" className="removeNotebookBtn" onClick={() => onRemoveEntry?.(entry.id)}>
                        Remove
                      </button>
                    </>
                  ) : entry.personalNote ? (
                    <p className="notebookEntryThai">Note: {entry.personalNote}</p>
                  ) : null}
                </article>
              )
            }
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
                {/* The saved word is the reason this card exists, so it leads.
                    The topic is context and is deliberately quieter. */}
                {!hasReport && entry.fix ? <h3 className="notebookEntryWord">{entry.fix}</h3> : null}
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
                    {entry.thaiMeaning ? (
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
