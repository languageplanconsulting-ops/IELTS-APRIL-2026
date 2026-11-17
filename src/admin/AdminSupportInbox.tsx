import { useState } from 'react'
import { formatThaiDate } from './enrollment'

export type SupportItem = {
  id: string
  reporterName: string
  reporterEmail: string
  pageContext: string
  category: string
  message: string
  status: string
  adminNote: string
  createdAt: string | null
  updatedAt: string | null
  resolvedAt: string | null
}

type Tab = 'open' | 'in_progress' | 'done' | 'all'
const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Resolved' },
  { key: 'all', label: 'All' }
]

const inTab = (item: SupportItem, tab: Tab) =>
  tab === 'all' ? true : tab === 'done' ? item.status === 'resolved' || item.status === 'closed' : item.status === tab

/**
 * Support inbox as a short list: one line per message, click to open it, reply-status and a
 * private note inside. (It used to be one long wall of open forms.)
 */
export function AdminSupportInbox({
  items,
  categoryLabels,
  statusLabels,
  onNoteChange,
  onSave
}: {
  items: SupportItem[]
  categoryLabels: Record<string, string>
  statusLabels: Record<string, string>
  onNoteChange: (id: string, note: string) => void
  onSave: (id: string, patch: { status: string; adminNote: string }) => Promise<void> | void
}) {
  const [tab, setTab] = useState<Tab>(() => (items.some((item) => item.status === 'open') ? 'open' : 'all'))
  const [openId, setOpenId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const visible = items
    .filter((item) => inTab(item, tab))
    .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))

  return (
    <div className="admInbox">
      <div className="admTabs" role="tablist" aria-label="Filter messages">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            className={`admTab ${tab === item.key ? 'is-on' : ''}`}
            onClick={() => setTab(item.key)}
          >
            {item.label} <span>{items.filter((entry) => inTab(entry, item.key)).length}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? <p className="admEmpty">✅ Nothing here.</p> : null}

      <ul className="admInboxList">
        {visible.map((item) => {
          const isOpen = openId === item.id
          return (
            <li key={item.id} className={`admInboxItem ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="admInboxRow"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className={`admDot admDot-${item.status}`} aria-hidden="true" />
                <span className="admInboxWho">
                  <strong>{item.reporterName}</strong>
                  <small>{formatThaiDate(item.createdAt)}</small>
                </span>
                <span className="admInboxPreview">{item.message}</span>
                <span className="admPill">{categoryLabels[item.category] || item.category}</span>
                <span className={`admPill admPill-${item.status}`}>{statusLabels[item.status] || item.status}</span>
              </button>
              {isOpen ? (
                <div className="admInboxDetail">
                  <p className="admMuted">
                    {item.reporterEmail} · page: {item.pageContext || '—'}
                    {item.resolvedAt ? ` · resolved ${formatThaiDate(item.resolvedAt)}` : ''}
                  </p>
                  <blockquote className="admMessage">{item.message}</blockquote>
                  <div className="admInboxControls">
                    <label>
                      Status
                      <select
                        value={item.status}
                        onChange={(event) => void onSave(item.id, { status: event.target.value, adminNote: item.adminNote })}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="admGrow">
                      Private note (only admins see this)
                      <textarea
                        rows={3}
                        value={item.adminNote}
                        placeholder="What you checked, fixed or told the student…"
                        onChange={(event) => {
                          setSavedId(null)
                          onNoteChange(item.id, event.target.value)
                        }}
                      />
                    </label>
                  </div>
                  <div className="admRow">
                    <button
                      type="button"
                      className="admBtn"
                      onClick={async () => {
                        await onSave(item.id, { status: item.status, adminNote: item.adminNote })
                        setSavedId(item.id)
                      }}
                    >
                      Save note
                    </button>
                    {item.status !== 'resolved' ? (
                      <button
                        type="button"
                        className="admBtn admBtn-ghost"
                        onClick={() => void onSave(item.id, { status: 'resolved', adminNote: item.adminNote })}
                      >
                        Mark resolved
                      </button>
                    ) : null}
                    {savedId === item.id ? <span className="admMuted">Saved ✓</span> : null}
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
