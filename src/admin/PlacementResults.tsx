/**
 * Admin view of placement-test submissions.
 *
 * The point of keeping these is the follow-up: when a visitor who took the free
 * test later registers for a course, an admin should be able to open their
 * original attempt and see exactly what they could and could not do — every
 * answer, the paragraph they wrote, what they actually said, and the detectors
 * behind each band.
 */
import { useCallback, useEffect, useState } from 'react'
import './PlacementResults.css'
import { PLACEMENT_BAND_LABELS, type PlacementBandKey } from '../placementTestData'

type ResultRow = {
  id: string
  student_name: string
  contact: string | null
  overall_band: string | null
  reading_band: PlacementBandKey | null
  listening_band: PlacementBandKey | null
  writing_band: PlacementBandKey | null
  speaking_band: PlacementBandKey | null
  speaking_pending: boolean
  created_at: string
}

type ResultDetail = ResultRow & {
  detail: {
    answers?: Record<string, string>
    wrong?: Array<{ skill: string; question: string; given: string; answer: string; why: string }>
    speakingTranscripts?: Array<{ question: string; response: string }>
    speakingSignals?: Record<string, unknown> | null
    speakingReasons?: string[]
    essayParagraph?: string
    essaySignals?: {
      tenseErrorCount: number
      vocabularyIssueCount: number
      transitionsUsed: string[]
      logicIsSound: boolean
      reasonsThai: string[]
    } | null
    gates?: Record<string, unknown>
  }
}

const bandLabel = (band: PlacementBandKey | null) => (band ? PLACEMENT_BAND_LABELS[band] : '—')

const formatDate = (value: string) =>
  new Date(value).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })

export function PlacementResults({ authToken }: { authToken: string }) {
  const [rows, setRows] = useState<ResultRow[]>([])
  const [selected, setSelected] = useState<ResultDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const headers = { Authorization: `Bearer ${authToken}` }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/admin/placement/results', { headers })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('โหลดรายการไม่สำเร็จ'))))
      .then((payload) => { if (!cancelled) setRows(payload.results || []) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken])

  const openResult = useCallback((id: string) => {
    setError('')
    fetch(`/api/admin/placement/results/${id}`, { headers })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('เปิดผลไม่สำเร็จ'))))
      .then((payload) => setSelected(payload.result))
      .catch((err) => setError(err.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken])

  const visible = rows.filter((row) => {
    if (!search.trim()) return true
    const needle = search.trim().toLowerCase()
    return row.student_name.toLowerCase().includes(needle) || (row.contact || '').toLowerCase().includes(needle)
  })

  if (selected) {
    const detail = selected.detail || {}
    return (
      <div className="plcAdmin">
        <button type="button" className="plcAdminBack" onClick={() => setSelected(null)}>← กลับไปที่รายการ</button>

        <header className="plcAdminHead">
          <div>
            <h3>{selected.student_name}</h3>
            <p className="plcAdminMeta">{selected.contact || 'ไม่ได้ให้ช่องทางติดต่อ'} · {formatDate(selected.created_at)}</p>
          </div>
          <div className="plcAdminOverall">{selected.overall_band || '—'}</div>
        </header>

        <div className="plcAdminBands">
          {([['การอ่าน', selected.reading_band], ['การฟัง', selected.listening_band],
            ['การเขียน', selected.writing_band], ['การพูด', selected.speaking_band]] as const).map(([label, band]) => (
            <div className="plcAdminBand" key={label}>
              <span>{label}</span>
              <strong>{bandLabel(band)}</strong>
            </div>
          ))}
        </div>
        {selected.speaking_pending ? <p className="plcAdminWarn">การพูดยังไม่ได้ตรวจอัตโนมัติ — ต้องฟังและให้คะแนนเอง</p> : null}

        {detail.essayParagraph ? (
          <section className="plcAdminSection">
            <h4>ย่อหน้า Task 2 ที่เขียน</h4>
            <blockquote className="plcAdminQuote">{detail.essayParagraph}</blockquote>
            {detail.essaySignals ? (
              <div className="plcAdminSignals">
                <span>tense/conjugation ผิด {detail.essaySignals.tenseErrorCount}</span>
                <span>คำศัพท์ {detail.essaySignals.vocabularyIssueCount}</span>
                <span>คำเชื่อม {detail.essaySignals.transitionsUsed.length}</span>
                <span>ตรรกะ {detail.essaySignals.logicIsSound ? 'ผ่าน' : 'ไม่ผ่าน'}</span>
              </div>
            ) : null}
            {detail.essaySignals?.reasonsThai?.length ? (
              <ul className="plcAdminList">{detail.essaySignals.reasonsThai.map((r) => <li key={r}>{r}</li>)}</ul>
            ) : null}
          </section>
        ) : null}

        {detail.speakingTranscripts?.length ? (
          <section className="plcAdminSection">
            <h4>สิ่งที่พูด (ถอดเสียง)</h4>
            {detail.speakingTranscripts.map((item, index) => (
              <div key={index} className="plcAdminQa">
                <p className="plcAdminQ">{item.question}</p>
                <blockquote className="plcAdminQuote">{item.response}</blockquote>
              </div>
            ))}
            {detail.speakingReasons?.length ? (
              <ul className="plcAdminList">{detail.speakingReasons.map((r) => <li key={r}>{r}</li>)}</ul>
            ) : null}
          </section>
        ) : null}

        {detail.wrong?.length ? (
          <section className="plcAdminSection">
            <h4>ข้อที่ตอบผิด ({detail.wrong.length})</h4>
            {detail.wrong.map((item, index) => (
              <div key={index} className="plcAdminQa">
                <span className="plcAdminTag">{item.skill}</span>
                <p className="plcAdminQ">{item.question}</p>
                <p className="plcAdminMeta">ตอบ: <strong>{item.given}</strong> · ที่ถูก: <strong>{item.answer}</strong></p>
              </div>
            ))}
          </section>
        ) : null}

        <section className="plcAdminSection">
          <h4>คำตอบทั้งหมด</h4>
          <pre className="plcAdminRaw">{JSON.stringify({ answers: detail.answers, gates: detail.gates }, null, 2)}</pre>
        </section>
      </div>
    )
  }

  return (
    <div className="plcAdmin">
      <header className="plcAdminHead">
        <div>
          <h3>ผลแบบทดสอบวัดระดับ</h3>
          <p className="plcAdminMeta">คนที่ทำแบบทดสอบฟรีไว้ ใช้เปิดดูตอนเขาสมัครคอร์ส</p>
        </div>
        <input
          type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อหรือช่องทางติดต่อ" className="plcAdminSearch"
        />
      </header>

      {error ? <p className="plcAdminWarn">{error}</p> : null}
      {loading ? <p className="plcAdminMeta">กำลังโหลด…</p> : null}
      {!loading && !visible.length ? <p className="plcAdminMeta">ยังไม่มีใครทำแบบทดสอบครับ</p> : null}

      {visible.length ? (
        <table className="plcAdminTable">
          <thead>
            <tr>
              <th>ชื่อ</th><th>ติดต่อ</th><th>รวม</th>
              <th>อ่าน</th><th>ฟัง</th><th>เขียน</th><th>พูด</th><th>วันที่</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} onClick={() => openResult(row.id)}>
                <td><strong>{row.student_name}</strong></td>
                <td>{row.contact || '—'}</td>
                <td><strong>{row.overall_band || '—'}</strong></td>
                <td>{bandLabel(row.reading_band)}</td>
                <td>{bandLabel(row.listening_band)}</td>
                <td>{bandLabel(row.writing_band)}</td>
                <td>{row.speaking_pending ? 'รอตรวจ' : bandLabel(row.speaking_band)}</td>
                <td>{formatDate(row.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}
