import { formatThaiDate } from './enrollment'

export type AdminTodayReport = {
  id: string
  learnerName: string
  topicTitle: string
  testMode: string
  overallBand: number
  createdAt: string | null
}

export type AdminTodaySupport = {
  id: string
  reporterName: string
  message: string
  status: string
  createdAt: string | null
}

const timeAgo = (iso: string | null, now: number) => {
  if (!iso) return ''
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000))
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

const MODE_LABEL: Record<string, string> = { part1: 'Part 1', part2: 'Part 2', part3: 'Part 3', full: 'Full mock' }

/**
 * Admin start page: what needs attention today, in one screen. Every card opens the section
 * where you deal with it.
 */
export function AdminToday({
  todoCount,
  todoPreview,
  liveStudents,
  endingThisWeek,
  openSupport,
  reports,
  now,
  onOpen
}: {
  todoCount: number
  todoPreview: string[]
  liveStudents: number
  endingThisWeek: number
  openSupport: AdminTodaySupport[]
  reports: AdminTodayReport[]
  now: number
  onOpen: (section: 'learners' | 'support' | 'reports' | 'analytics') => void
}) {
  const weekAgo = now - 7 * 864e5
  const reportsThisWeek = reports.filter((report) => report.createdAt && new Date(report.createdAt).getTime() >= weekAgo)
  const latest = reports.slice(0, 5)
  return (
    <div className="admToday">
      <div className="admTodayStats">
        <button type="button" className={`admStat ${todoCount ? 'is-alert' : ''}`} onClick={() => onOpen('learners')}>
          <span>Enrollment to-do</span>
          <strong>{todoCount}</strong>
          <small>{todoCount ? 'needs you' : 'all done'}</small>
        </button>
        <button type="button" className={`admStat ${openSupport.length ? 'is-alert' : ''}`} onClick={() => onOpen('support')}>
          <span>Messages to answer</span>
          <strong>{openSupport.length}</strong>
          <small>{openSupport.length ? 'waiting for a reply' : 'inbox clear'}</small>
        </button>
        <button type="button" className="admStat" onClick={() => onOpen('learners')}>
          <span>Students with access</span>
          <strong>{liveStudents}</strong>
          <small>{endingThisWeek ? `${endingThisWeek} end this week` : 'none ending this week'}</small>
        </button>
        <button type="button" className="admStat" onClick={() => onOpen('reports')}>
          <span>Speaking tests this week</span>
          <strong>{reportsThisWeek.length}</strong>
          <small>{new Set(reportsThisWeek.map((report) => report.learnerName)).size} students</small>
        </button>
      </div>

      <div className="admTodayCols">
        <section className="admCard">
          <header className="admCardHead">
            <h3>Enrollment to-do</h3>
            <button type="button" className="admLink" onClick={() => onOpen('learners')}>
              Open Learners →
            </button>
          </header>
          {todoPreview.length ? (
            <ul className="admLines">
              {todoPreview.map((line) => (
                <li key={line}>{line}</li>
              ))}
              {todoCount > todoPreview.length ? <li className="admMuted">+ {todoCount - todoPreview.length} more</li> : null}
            </ul>
          ) : (
            <p className="admEmpty">✅ Nothing to do.</p>
          )}
        </section>

        <section className="admCard">
          <header className="admCardHead">
            <h3>Messages to answer</h3>
            <button type="button" className="admLink" onClick={() => onOpen('support')}>
              Open inbox →
            </button>
          </header>
          {openSupport.length ? (
            <ul className="admLines">
              {openSupport.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <strong>{item.reporterName}</strong> · <span className="admMuted">{timeAgo(item.createdAt, now)}</span>
                  <p className="admClamp">{item.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admEmpty">✅ No open messages.</p>
          )}
        </section>

        <section className="admCard admCard-wide">
          <header className="admCardHead">
            <h3>Latest speaking tests</h3>
            <button type="button" className="admLink" onClick={() => onOpen('reports')}>
              All reports →
            </button>
          </header>
          {latest.length ? (
            <table className="admTable">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Test</th>
                  <th>Band</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((report) => (
                  <tr key={report.id}>
                    <td>{report.learnerName}</td>
                    <td>
                      <span className="admMuted">{MODE_LABEL[report.testMode] || report.testMode} · </span>
                      {report.topicTitle}
                    </td>
                    <td>
                      <strong>{Number(report.overallBand || 0).toFixed(1)}</strong>
                    </td>
                    <td className="admMuted">{report.createdAt ? `${formatThaiDate(report.createdAt)} · ${timeAgo(report.createdAt, now)}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="admEmpty">No speaking tests yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
