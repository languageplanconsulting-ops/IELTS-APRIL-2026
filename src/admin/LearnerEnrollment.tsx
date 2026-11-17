import { useMemo, useState } from 'react'
import { SKILL_MODULES, type SkillModule } from '../moduleAccess'
import {
  LEARNER_FILTERS,
  STATUS_META,
  buildEnrollmentInbox,
  daysUntil,
  defaultEnrollMode,
  enrollmentStatus,
  formatThaiDate,
  fromDateInput,
  matchesFilter,
  packageOnRecord,
  previewEnrollment,
  skillsLabel,
  sortLearners,
  suggestPackage,
  toDateInput,
  type EnrollmentLearner,
  type EnrollmentPackage,
  type EnrollmentRecords,
  type InboxAction,
  type InboxItem,
  type LearnerEnrollmentRecord,
  type LearnerFilter
} from './enrollment'
import { enrollmentApi as api, toEnrollmentRecords as toRecords, type ApiRecord } from './enrollmentApi'

/** Package dropdown for the "Grant Course Access" form: picking one fills skills, credits and end date. */
export function PackagePicker({
  packages,
  value,
  onPick
}: {
  packages: EnrollmentPackage[]
  value: string
  onPick: (pkg: EnrollmentPackage | null) => void
}) {
  if (!packages.length) return null
  return (
    <label className="enrPackagePicker">
      Package
      <select
        value={value}
        onChange={(event) => onPick(packages.find((pkg) => pkg.id === event.target.value) || null)}
      >
        <option value="">— Choose a package (fills the boxes below) —</option>
        {packages.map((pkg) => (
          <option key={pkg.id} value={pkg.id}>
            {pkg.name}
          </option>
        ))}
      </select>
    </label>
  )
}

// ── enrol / renew window ────────────────────────────────────────────────────────────────

function EnrollDialog({
  learner,
  records,
  startMode,
  accessToken,
  onClose,
  onSaved
}: {
  learner: EnrollmentLearner
  records: EnrollmentRecords
  startMode: 'start' | 'renew'
  accessToken: string
  onClose: () => void
  onSaved: (learner: EnrollmentLearner, record: LearnerEnrollmentRecord) => void
}) {
  const [packageId, setPackageId] = useState(() => suggestPackage(learner, records)?.id || '')
  const [mode, setMode] = useState<'start' | 'renew'>(startMode)
  const [startDate, setStartDate] = useState(() => toDateInput(new Date().toISOString()))
  const [endDateOverride, setEndDateOverride] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<LearnerEnrollmentRecord | undefined>(records.learners[learner.id])

  const pkg = records.packages.find((item) => item.id === packageId) || null
  const startsAtIso = mode === 'start' && startDate ? new Date(`${startDate}T00:00:00+07:00`).toISOString() : undefined
  const preview = pkg ? previewEnrollment(pkg, mode, learner, new Date(), startsAtIso) : null
  const endDate = endDateOverride ?? toDateInput(preview?.expiresAt || null)
  const status = enrollmentStatus(learner)

  const save = async () => {
    if (!pkg) return
    setSaving(true)
    setError('')
    try {
      const payload = await api<{ learner: EnrollmentLearner; record: LearnerEnrollmentRecord }>(
        `/api/admin/learners/${encodeURIComponent(learner.id)}/enroll`,
        accessToken,
        {
          method: 'POST',
          body: {
            packageId: pkg.id,
            mode,
            startsAt: startsAtIso,
            expiresAt: endDate ? fromDateInput(endDate) : undefined,
            note: note.trim() || undefined
          }
        }
      )
      onSaved(payload.learner, payload.record)
      onClose()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    try {
      const payload = await api<{ record: LearnerEnrollmentRecord }>(
        `/api/admin/learners/${encodeURIComponent(learner.id)}/note`,
        accessToken,
        { method: 'POST', body: { text: newNote.trim() } }
      )
      setHistory(payload.record)
      setNewNote('')
      onSaved(learner, payload.record)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save the note.')
    }
  }

  return (
    <div className="enrDialogBackdrop" role="dialog" aria-modal="true" aria-label={`Enrollment for ${learner.name}`}>
      <div className="enrDialog">
        <header className="enrDialogHead">
          <div>
            <p className="enrEyebrow">{mode === 'renew' ? 'Renew access' : status === 'waiting' ? 'Approve sign-up' : 'Switch on access'}</p>
            <h3>{learner.name}</h3>
            <p className="enrMuted">{learner.email}</p>
          </div>
          <button type="button" className="enrIconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="enrDialogBody">
          <label className="enrField">
            Package
            <select
              value={packageId}
              onChange={(event) => {
                setPackageId(event.target.value)
                setEndDateOverride(null)
              }}
            >
              {records.packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          {status !== 'waiting' ? (
            <div className="enrSegment" role="radiogroup" aria-label="How to apply it">
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'renew'}
                className={mode === 'renew' ? 'is-on' : ''}
                onClick={() => {
                  setMode('renew')
                  setEndDateOverride(null)
                }}
              >
                Renew (add time + credits)
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'start'}
                className={mode === 'start' ? 'is-on' : ''}
                onClick={() => {
                  setMode('start')
                  setEndDateOverride(null)
                }}
              >
                Start fresh from a date
              </button>
            </div>
          ) : null}

          <div className="enrDates">
            {mode === 'start' ? (
              <label className="enrField">
                Starts
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value)
                    setEndDateOverride(null)
                  }}
                />
              </label>
            ) : null}
            <label className="enrField">
              Ends
              <input type="date" value={endDate} onChange={(event) => setEndDateOverride(event.target.value)} />
            </label>
          </div>

          {pkg && preview ? (
            <ul className="enrPreview">
              <li>
                <span>Access</span>
                <strong>
                  {formatThaiDate(learner.expiresAt)} → {endDate ? formatThaiDate(fromDateInput(endDate)) : 'ไม่มีวันหมดอายุ'}
                </strong>
              </li>
              <li>
                <span>Feedback credits</span>
                <strong>
                  {learner.feedbackRemaining} → {preview.feedbackCredits}
                </strong>
              </li>
              <li>
                <span>Full mock credits</span>
                <strong>
                  {learner.fullMockRemaining} → {preview.fullMockCredits}
                </strong>
              </li>
              <li>
                <span>Skills</span>
                <strong>{skillsLabel(preview.enabledModules)}</strong>
              </li>
              {status !== 'active' && status !== 'ending' ? (
                <li className="enrPreviewNote">The student gets the "access granted" email.</li>
              ) : null}
            </ul>
          ) : (
            <p className="enrWarn">Add a package first (Packages panel above the list).</p>
          )}

          <label className="enrField">
            Note for the history (optional)
            <input value={note} placeholder="e.g. paid by bank transfer 18 Nov" onChange={(event) => setNote(event.target.value)} />
          </label>

          {error ? <p className="enrError">{error}</p> : null}
          <div className="enrDialogActions">
            <button type="button" className="enrBtn enrBtn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="enrBtn" disabled={!pkg || saving} onClick={() => void save()}>
              {saving ? 'Saving…' : mode === 'renew' ? 'Renew' : status === 'waiting' ? 'Approve' : 'Switch on'}
            </button>
          </div>

          <section className="enrHistory">
            <h4>History</h4>
            <div className="enrNoteRow">
              <input value={newNote} placeholder="Add a note…" onChange={(event) => setNewNote(event.target.value)} />
              <button type="button" className="enrBtn enrBtn-ghost" disabled={!newNote.trim()} onClick={() => void addNote()}>
                Add
              </button>
            </div>
            {history?.events?.length ? (
              <ol>
                {history.events
                  .slice()
                  .reverse()
                  .map((event, index) => (
                    <li key={`${event.at}-${index}`}>
                      <span className="enrMuted">
                        {formatThaiDate(event.at)}
                        {event.by ? ` · ${event.by}` : ''}
                      </span>
                      <p>{event.text}</p>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className="enrMuted">No history yet. New changes are recorded from now on.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

// ── packages panel ──────────────────────────────────────────────────────────────────────

const blankPackage = (): EnrollmentPackage => ({
  id: '',
  name: 'New package',
  months: 3,
  enabledModules: ['speaking', 'listening', 'reading'],
  feedbackCredits: 20,
  fullMockCredits: 10,
  thinkificCourseIds: [],
  isDefault: false
})

function PackagesPanel({
  records,
  accessToken,
  onSaved
}: {
  records: EnrollmentRecords
  accessToken: string
  onSaved: (records: EnrollmentRecords) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<EnrollmentPackage[] | null>(null)
  const [message, setMessage] = useState('')
  const list = draft ?? records.packages

  const update = (index: number, patch: Partial<EnrollmentPackage>) =>
    setDraft(list.map((pkg, i) => (i === index ? { ...pkg, ...patch } : patch.isDefault ? { ...pkg, isDefault: false } : pkg)))

  const save = async () => {
    try {
      const payload = await api<ApiRecord>('/api/admin/enrollment/packages', accessToken, { method: 'PUT', body: { packages: list } })
      onSaved(toRecords(payload))
      setDraft(null)
      setMessage('Packages saved.')
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not save packages.')
    }
  }

  return (
    <section className="enrPanel">
      <button type="button" className="enrPanelToggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span>📦 Packages ({records.packages.length})</span>
        <small>What each course gives: skills, credits and length. Enrol and renew use these.</small>
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open ? (
        <div className="enrPackages">
          {list.map((pkg, index) => (
            <div key={pkg.id || `new-${index}`} className="enrPackageRow">
              <label className="enrField enrField-wide">
                Name
                <input value={pkg.name} onChange={(event) => update(index, { name: event.target.value })} />
              </label>
              <label className="enrField">
                Months (0 = never ends)
                <input type="number" min={0} max={36} value={pkg.months} onChange={(event) => update(index, { months: Number(event.target.value) })} />
              </label>
              <label className="enrField">
                Feedback credits
                <input
                  type="number"
                  min={0}
                  value={pkg.feedbackCredits}
                  onChange={(event) => update(index, { feedbackCredits: Number(event.target.value) })}
                />
              </label>
              <label className="enrField">
                Full mock credits
                <input
                  type="number"
                  min={0}
                  value={pkg.fullMockCredits}
                  onChange={(event) => update(index, { fullMockCredits: Number(event.target.value) })}
                />
              </label>
              <div className="enrField enrField-wide">
                Skills
                <div className="enrChecks">
                  {SKILL_MODULES.map((module) => (
                    <label key={module.key}>
                      <input
                        type="checkbox"
                        checked={pkg.enabledModules.includes(module.key)}
                        onChange={(event) =>
                          update(index, {
                            enabledModules: event.target.checked
                              ? [...pkg.enabledModules, module.key]
                              : pkg.enabledModules.filter((key: SkillModule) => key !== module.key)
                          })
                        }
                      />
                      {module.label}
                    </label>
                  ))}
                </div>
              </div>
              <label className="enrField enrField-wide">
                Thinkific course IDs (comma separated — purchases of these use this package)
                <input
                  value={pkg.thinkificCourseIds.join(', ')}
                  placeholder="e.g. 2345678"
                  onChange={(event) =>
                    update(index, {
                      thinkificCourseIds: event.target.value
                        .split(',')
                        .map((id) => id.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </label>
              <div className="enrPackageFoot">
                <label>
                  <input type="radio" name="enr-default-package" checked={pkg.isDefault} onChange={() => update(index, { isDefault: true })} />
                  Default for new sign-ups
                </label>
                <button
                  type="button"
                  className="enrLinkBtn"
                  disabled={list.length <= 1}
                  onClick={() => {
                    if (window.confirm(`Delete the package "${pkg.name}"? Students keep their current access.`)) {
                      setDraft(list.filter((_, i) => i !== index))
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="enrPackageActions">
            <button type="button" className="enrBtn enrBtn-ghost" onClick={() => setDraft([...list, blankPackage()])}>
              + Add package
            </button>
            <button type="button" className="enrBtn" disabled={!draft} onClick={() => void save()}>
              Save packages
            </button>
            {draft ? (
              <button type="button" className="enrLinkBtn" onClick={() => setDraft(null)}>
                Undo changes
              </button>
            ) : null}
            {message ? <span className="enrMuted">{message}</span> : null}
          </div>
        </div>
      ) : null}
    </section>
  )
}

// ── inbox + learner list ────────────────────────────────────────────────────────────────

export function LearnerDirectory({
  accessToken,
  learners,
  records,
  setRecords,
  search,
  onSearchChange,
  onLearnerUpdated,
  quickUpdate,
  onView
}: {
  accessToken: string
  learners: EnrollmentLearner[]
  records: EnrollmentRecords
  setRecords: (updater: (current: EnrollmentRecords) => EnrollmentRecords) => void
  search: string
  onSearchChange: (value: string) => void
  onLearnerUpdated: (learner: EnrollmentLearner) => void
  quickUpdate: (learner: EnrollmentLearner, updates: Partial<EnrollmentLearner>) => Promise<void>
  onView: (learner: EnrollmentLearner) => void
}) {
  const [filter, setFilter] = useState<LearnerFilter>('all')
  const [dialog, setDialog] = useState<{ learnerId: string; mode: 'start' | 'renew' } | null>(null)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  // One clock per visit to the page: statuses only depend on dates, not on the second.
  const [now] = useState(() => new Date())

  const students = useMemo(() => learners.filter((learner) => learner.role !== 'admin'), [learners])
  const inbox = useMemo(() => buildEnrollmentInbox(students, records, now), [students, records, now])
  const counts = useMemo(
    () => Object.fromEntries(LEARNER_FILTERS.map((item) => [item.key, students.filter((learner) => matchesFilter(learner, item.key, now)).length])),
    [students, now]
  )
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return sortLearners(
      students.filter(
        (learner) =>
          matchesFilter(learner, filter, now) &&
          (!query || [learner.name, learner.email].some((value) => String(value || '').toLowerCase().includes(query)))
      ),
      now
    )
  }, [students, filter, search, now])

  const dialogLearner = dialog ? students.find((learner) => learner.id === dialog.learnerId) || null : null
  const openDialog = (learner: EnrollmentLearner, mode?: 'start' | 'renew') =>
    setDialog({ learnerId: learner.id, mode: mode || defaultEnrollMode(learner, now) })

  const dismiss = async (key: string, days: number) => {
    try {
      const payload = await api<{ dismissed: Record<string, string> }>('/api/admin/enrollment/dismiss', accessToken, {
        method: 'POST',
        body: { key, days }
      })
      setRecords((current) => ({ ...current, dismissed: payload.dismissed }))
    } catch (caught) {
      setNotice(caught instanceof Error ? caught.message : 'Could not hide that item.')
    }
  }

  const runAction = async (item: InboxItem, action: InboxAction) => {
    const first = students.find((learner) => learner.id === item.learnerIds[0])
    if (action.kind === 'approve' && first) return openDialog(first, 'start')
    if (action.kind === 'renew' && first) return openDialog(first, 'renew')
    if (action.kind === 'open' && first) return openDialog(first)
    if (action.kind === 'dismiss') return dismiss(item.key, action.days)
    if (action.kind === 'filter') {
      if (action.search === 'status:expired') {
        setFilter('expired')
        onSearchChange('')
      } else {
        setFilter('all')
        onSearchChange(action.search)
      }
      return
    }
    if (action.kind === 'add-feedback' && first) {
      setBusy(item.key)
      await quickUpdate(first, { feedbackRemaining: first.feedbackRemaining + action.amount })
      setBusy('')
      return
    }
    if (action.kind === 'end-all-expired') {
      const targets = students.filter((learner) => item.learnerIds.includes(learner.id))
      if (!window.confirm(`Mark ${targets.length} expired students as ended? They already can't use the app; this only tidies their status. You can renew anyone later.`)) return
      setBusy(item.key)
      for (const [index, learner] of targets.entries()) {
        setNotice(`Marking as ended… ${index + 1} / ${targets.length}`)
        await quickUpdate(learner, { status: 'inactive' })
      }
      setNotice(`Done: ${targets.length} students marked as ended.`)
      setBusy('')
    }
  }

  const toggleSkill = (learner: EnrollmentLearner, key: SkillModule) => {
    const on = learner.enabledModules.includes(key)
    const label = SKILL_MODULES.find((module) => module.key === key)?.label || key
    if (!window.confirm(`${on ? 'Turn OFF' : 'Turn ON'} ${label} for ${learner.name}?`)) return
    void quickUpdate(learner, {
      enabledModules: on ? learner.enabledModules.filter((item) => item !== key) : [...learner.enabledModules, key]
    })
  }

  return (
    <div className="enr">
      <section className="enrInbox" aria-label="Enrollment to-do">
        <header>
          <h3>To do {inbox.length ? <span className="enrCount">{inbox.length}</span> : null}</h3>
          <p className="enrMuted">Only what needs you. When this list is empty, you’re done.</p>
        </header>
        {inbox.length ? (
          <ul>
            {inbox.map((item) => (
              <li key={item.key} className="enrTask">
                <span className="enrTaskIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="enrTaskText">
                  <strong>{item.title}</strong>
                  <span className="enrMuted">{item.detail}</span>
                </div>
                <div className="enrTaskActions">
                  {item.actions.map((action, index) => (
                    <button
                      key={action.label}
                      type="button"
                      className={`enrBtn ${index === 0 ? '' : 'enrBtn-ghost'}`}
                      disabled={busy === item.key}
                      onClick={() => void runAction(item, action)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="enrDone">✅ Nothing to do right now.</p>
        )}
        {notice ? <p className="enrMuted">{notice}</p> : null}
      </section>

      <PackagesPanel records={records} accessToken={accessToken} onSaved={(next) => setRecords(() => next)} />

      <section className="enrListHead">
        <div className="enrFilters" role="tablist" aria-label="Filter students">
          {LEARNER_FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={filter === item.key}
              className={`enrChip ${filter === item.key ? 'is-on' : ''}`}
              onClick={() => setFilter(item.key)}
            >
              {item.label} <span>{counts[item.key] ?? 0}</span>
            </button>
          ))}
        </div>
        <input
          className="enrSearch"
          value={search}
          placeholder="Search name or email"
          aria-label="Search students"
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </section>

      <div className="enrList">
        {visible.length === 0 ? <p className="enrMuted">No students match.</p> : null}
        {visible.map((learner) => {
          const status = enrollmentStatus(learner, now)
          const meta = STATUS_META[status]
          const pkg = packageOnRecord(learner, records)
          const left = daysUntil(learner.expiresAt, now)
          return (
            <article key={learner.id} className={`enrCard enrCard-${status}`}>
              <div className="enrCardTop">
                <div>
                  <h4>{learner.name}</h4>
                  <p className="enrMuted">{learner.email}</p>
                </div>
                <div className="enrBadges">
                  <span className={`enrStatus enrTone-${meta.tone}`}>{meta.label}</span>
                  <span className="enrPkg">{pkg ? pkg.name : 'No package yet'}</span>
                </div>
              </div>
              <p className="enrFacts">
                <span>
                  {status === 'waiting'
                    ? `Signed up ${formatThaiDate(learner.createdAt)}`
                    : `${formatThaiDate(learner.startsAt)} → ${formatThaiDate(learner.expiresAt)}`}
                  {left !== null && status !== 'waiting' && status !== 'off'
                    ? left > 0
                      ? ` · ${left} day${left === 1 ? '' : 's'} left`
                      : ` · ended ${Math.abs(left)} day${Math.abs(left) === 1 ? '' : 's'} ago`
                    : ''}
                </span>
                <span>Feedback {learner.feedbackRemaining}</span>
                <span>Full mock {learner.fullMockRemaining}</span>
              </p>
              <div className="enrSkills">
                {SKILL_MODULES.map((module) => {
                  const on = learner.enabledModules.includes(module.key)
                  return (
                    <button
                      key={module.key}
                      type="button"
                      className={`enrSkill ${on ? 'is-on' : ''}`}
                      aria-pressed={on}
                      title={`${on ? 'Turn off' : 'Turn on'} ${module.label}`}
                      onClick={() => toggleSkill(learner, module.key)}
                    >
                      {module.label}
                    </button>
                  )
                })}
              </div>
              <div className="enrCardActions">
                <button type="button" className="enrBtn" onClick={() => openDialog(learner)}>
                  {status === 'waiting' ? 'Approve…' : status === 'off' ? 'Switch on…' : 'Renew…'}
                </button>
                <button
                  type="button"
                  className="enrBtn enrBtn-ghost"
                  onClick={() => void quickUpdate(learner, { feedbackRemaining: learner.feedbackRemaining + 10 })}
                >
                  +10 Feedback
                </button>
                <button
                  type="button"
                  className="enrBtn enrBtn-ghost"
                  onClick={() => void quickUpdate(learner, { fullMockRemaining: learner.fullMockRemaining + 5 })}
                >
                  +5 Full Mock
                </button>
                <button type="button" className="enrBtn enrBtn-ghost" onClick={() => openDialog(learner, status === 'waiting' ? 'start' : 'renew')}>
                  Dates, package & history
                </button>
                <button type="button" className="enrBtn enrBtn-ghost" onClick={() => onView(learner)}>
                  View
                </button>
                {learner.status === 'active' ? (
                  <button
                    type="button"
                    className="enrLinkBtn enrDanger"
                    onClick={() => {
                      if (window.confirm(`Switch OFF access for ${learner.name}? They won't be able to use the app.`)) {
                        void quickUpdate(learner, { status: 'inactive' })
                      }
                    }}
                  >
                    Deactivate
                  </button>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>

      {dialog && dialogLearner ? (
        <EnrollDialog
          key={`${dialogLearner.id}-${dialog.mode}`}
          learner={dialogLearner}
          records={records}
          startMode={dialog.mode}
          accessToken={accessToken}
          onClose={() => setDialog(null)}
          onSaved={(learner, record) => {
            onLearnerUpdated(learner)
            setRecords((current) => ({ ...current, learners: { ...current.learners, [learner.id]: record } }))
          }}
        />
      ) : null}
    </div>
  )
}
