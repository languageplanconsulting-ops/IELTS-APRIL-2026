import { useState } from 'react'
import {
  SPEAKING_PART_INFO,
  SPEAKING_CRITERIA,
  SPEAKING_MONTHLY_QUESTIONS_2026,
  SPEAKING_SAMPLE_ANSWER,
  LOCKED_SAMPLE_TEASERS,
  type SpeakingMonthGroup,
  type SampleAnswerHighlight
} from './landingSpeakingData'
import './LandingSpeakingPage.css'

// ── Real-video types (mirror the server-side shape) ────────────────────────

export type LandingSpeakingSubtitleNote = {
  id: string
  phrase: string
  kind?: 'vocabulary' | 'grammar'
  thaiMeaning?: string
  grammarRule?: string
  exampleSentence?: string
  detail?: string
}

export type LandingSpeakingSubtitleCue = {
  id: string
  startSeconds: number
  endSeconds: number
  text: string
  notes?: LandingSpeakingSubtitleNote[]
}

export type LandingSpeakingVideoSample = {
  topicId: string
  topicTitle: string
  videoUrl: string
  subtitles?: LandingSpeakingSubtitleCue[]
}

type LandingSpeakingPageProps = {
  onBack: () => void
  /** Real uploaded video sample from the server. When provided, replaces the static sample. */
  featuredVideo?: LandingSpeakingVideoSample | null
}

function HighlightChip({ h }: { h: SampleAnswerHighlight }) {
  const [open, setOpen] = useState(false)
  return (
    <span
      className={`lspHighlight lspHighlight-${h.kind} ${open ? 'is-open' : ''}`}
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
      aria-expanded={open}
    >
      <span className="lspHighlightPhrase">{h.phrase}</span>
      {open && (
        <span className="lspHighlightPopover">
          <strong>{h.labelTh}</strong>
          <span>{h.descTh}</span>
          {h.exampleTh && <em>ตัวอย่าง: {h.exampleTh}</em>}
        </span>
      )}
    </span>
  )
}

function AnnotatedSegment({ segment }: { segment: { id: string; text: string; highlights: SampleAnswerHighlight[] } }) {
  const parts: Array<{ type: 'text' | 'highlight'; content: string; highlight?: SampleAnswerHighlight }> = []
  let remaining = segment.text

  // Sort highlights by position in text
  const sorted = [...segment.highlights].sort(
    (a, b) => remaining.indexOf(a.phrase) - remaining.indexOf(b.phrase)
  )

  for (const h of sorted) {
    const idx = remaining.indexOf(h.phrase)
    if (idx < 0) continue
    if (idx > 0) parts.push({ type: 'text', content: remaining.slice(0, idx) })
    parts.push({ type: 'highlight', content: h.phrase, highlight: h })
    remaining = remaining.slice(idx + h.phrase.length)
  }
  if (remaining) parts.push({ type: 'text', content: remaining })

  return (
    <p className="lspSampleSegment">
      {parts.map((part, i) =>
        part.type === 'highlight' && part.highlight ? (
          <HighlightChip key={`${segment.id}-h-${i}`} h={part.highlight} />
        ) : (
          <span key={`${segment.id}-t-${i}`}>{part.content}</span>
        )
      )}
    </p>
  )
}

function MonthAccordion({ group }: { group: SpeakingMonthGroup }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`lspMonthBlock ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="lspMonthToggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="lspMonthLabel">{group.monthTh}</span>
        <span className="lspMonthCount">{group.sets.length} ชุด</span>
        <span className="lspMonthChevron" aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="lspMonthContent">
          {group.sets.map((set, index) => (
            <article key={set.id} className="lspTopicCard">
              <div className="lspTopicCardHead">
                <span className="lspTopicNum">ชุดที่ {index + 1}</span>
                <span className="lspTopicBadge">Part 2</span>
              </div>
              <h4 className="lspTopicPrompt">{set.part2}</h4>
              <ul className="lspCueList">
                {set.cues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
              <div className="lspPart3Sample">
                <span className="lspPart3Label">Part 3 ตัวอย่าง</span>
                <p>{set.part3Sample}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Real-video transcript renderer ────────────────────────────────────────

function RealVideoSample({ video }: { video: LandingSpeakingVideoSample }) {
  const [activeNote, setActiveNote] = useState<LandingSpeakingSubtitleNote | null>(null)
  const cuesWithNotes = (video.subtitles || []).filter(
    (cue) => cue.notes && cue.notes.length > 0
  )
  const allNotes = cuesWithNotes.flatMap((c) => c.notes || [])
  const vocabNotes = allNotes.filter((n) => n.kind === 'vocabulary' || (!n.kind && n.thaiMeaning))
  const grammarNotes = allNotes.filter((n) => n.kind === 'grammar' || n.grammarRule)

  return (
    <div className="lspRealVideoWrap">

      {/* Video player */}
      <div className="lspVideoPlayer">
        <video
          src={video.videoUrl}
          controls
          className="lspVideoEl"
          playsInline
          preload="metadata"
        />
      </div>

      {/* Transcript with inline note highlights */}
      {video.subtitles && video.subtitles.length > 0 && (
        <div className="lspTranscriptWrap">
          <div className="lspTranscriptHead">
            <p className="lspTranscriptLabel">Transcript — คลิกคำที่ขีดเส้นเพื่อดูคำอธิบาย</p>
            <p className="lspTranscriptHint">
              <span className="lspLegendDot lspLegendDot-vocab" />vocab&nbsp;&nbsp;
              <span className="lspLegendDot lspLegendDot-grammar" />grammar
            </p>
          </div>
          <div className="lspTranscript">
            {video.subtitles.map((cue) => (
              <RealCueSegment
                key={cue.id}
                cue={cue}
                activeNote={activeNote}
                onNoteClick={setActiveNote}
              />
            ))}
          </div>
          {activeNote && (
            <div className="lspNotePanel">
              <div className="lspNotePanelHead">
                <span className={`lspNoteKindBadge lspNoteKindBadge-${activeNote.kind || 'vocabulary'}`}>
                  {activeNote.kind === 'grammar' ? 'Grammar' : 'Vocabulary'}
                </span>
                <button
                  type="button"
                  className="lspNotePanelClose"
                  onClick={() => setActiveNote(null)}
                  aria-label="ปิด"
                >
                  ✕
                </button>
              </div>
              <p className="lspNotePanelPhrase">"{activeNote.phrase}"</p>
              {activeNote.thaiMeaning && (
                <p className="lspNotePanelThai"><strong>ความหมาย:</strong> {activeNote.thaiMeaning}</p>
              )}
              {(activeNote.detail || activeNote.grammarRule) && (
                <p className="lspNotePanelDetail">{activeNote.detail || activeNote.grammarRule}</p>
              )}
              {activeNote.exampleSentence && (
                <p className="lspNotePanelExample"><em>ตัวอย่าง: {activeNote.exampleSentence}</em></p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Note summary chips */}
      {(vocabNotes.length > 0 || grammarNotes.length > 0) && (
        <div className="lspHighlightSummary">
          {vocabNotes.length > 0 && (
            <div className="lspHighlightGroup">
              <p className="lspHighlightGroupLabel">คำศัพท์ที่ควรจำ</p>
              <div className="lspHighlightChips">
                {vocabNotes.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="lspSummaryChip lspSummaryChip-vocab"
                    onClick={() => setActiveNote(n)}
                  >
                    {n.phrase}
                    {n.thaiMeaning && (
                      <span className="lspSummaryChipThai">— {n.thaiMeaning}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {grammarNotes.length > 0 && (
            <div className="lspHighlightGroup">
              <p className="lspHighlightGroupLabel">โครงสร้างไวยากรณ์</p>
              <div className="lspHighlightChips">
                {grammarNotes.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="lspSummaryChip lspSummaryChip-grammar"
                    onClick={() => setActiveNote(n)}
                  >
                    {n.phrase}
                    {n.grammarRule && (
                      <span className="lspSummaryChipThai">— {n.grammarRule}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RealCueSegment({
  cue,
  activeNote,
  onNoteClick
}: {
  cue: LandingSpeakingSubtitleCue
  activeNote: LandingSpeakingSubtitleNote | null
  onNoteClick: (note: LandingSpeakingSubtitleNote) => void
}) {
  const notes = cue.notes || []
  if (notes.length === 0) {
    return <p className="lspSampleSegment">{cue.text}</p>
  }

  // Split text by note phrases
  const parts: Array<{ type: 'text' | 'note'; content: string; note?: LandingSpeakingSubtitleNote }> = []
  let remaining = cue.text
  const sorted = [...notes].sort(
    (a, b) => remaining.toLowerCase().indexOf(a.phrase.toLowerCase()) - remaining.toLowerCase().indexOf(b.phrase.toLowerCase())
  )
  for (const note of sorted) {
    const idx = remaining.toLowerCase().indexOf(note.phrase.toLowerCase())
    if (idx < 0) continue
    if (idx > 0) parts.push({ type: 'text', content: remaining.slice(0, idx) })
    parts.push({ type: 'note', content: remaining.slice(idx, idx + note.phrase.length), note })
    remaining = remaining.slice(idx + note.phrase.length)
  }
  if (remaining) parts.push({ type: 'text', content: remaining })

  return (
    <p className="lspSampleSegment">
      {parts.map((part, i) => {
        if (part.type === 'note' && part.note) {
          const isActive = activeNote?.id === part.note.id
          return (
            <span
              key={i}
              className={`lspHighlight lspHighlight-${part.note.kind || 'vocabulary'} ${isActive ? 'is-open' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => onNoteClick(part.note!)}
              onKeyDown={(e) => e.key === 'Enter' && onNoteClick(part.note!)}
            >
              <span className="lspHighlightPhrase">{part.content}</span>
            </span>
          )
        }
        return <span key={i}>{part.content}</span>
      })}
    </p>
  )
}

export function LandingSpeakingPage({ onBack, featuredVideo }: LandingSpeakingPageProps) {
  const sample = SPEAKING_SAMPLE_ANSWER
  const hasRealVideo = Boolean(featuredVideo?.videoUrl)

  return (
    <div className="lspShell">

      {/* ── Back nav ─────────────────────────────────────────── */}
      <button type="button" className="lspBackBtn" onClick={onBack}>
        ← กลับหน้าหลัก
      </button>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="lspHero">
        <p className="lspKicker">IELTS Speaking · English Plan Institute · 2026</p>
        <h1 className="lspHeroH1">
          หัวข้อ IELTS Speaking 2026<br />
          รวมโจทย์จากการสอบจริงในประเทศไทย
        </h1>
        <p className="lspHeroLead">
          รวบรวมหัวข้อ Part 1, 2 และ 3 จากการสอบ IELTS ในไทยและภูมิภาค APAC
          มกราคม–มิถุนายน 2566 พร้อมตัวอย่างคำตอบ Band 7+ อธิบายคำศัพท์และไวยากรณ์เป็นภาษาไทย
        </p>
        <div className="lspHeroMeta">
          <span>6 เดือน</span>
          <span className="lspDot" />
          <span>30 ชุดโจทย์</span>
          <span className="lspDot" />
          <span>ตัวอย่างคำตอบ Band 7+ โดยพี่ดอย</span>
        </div>
      </section>

      {/* ── Format explanation ────────────────────────────────── */}
      <section className="lspSection">
        <div className="lspSectionHead">
          <p className="lspSectionKicker">รูปแบบการสอบ · IELTS Speaking Format</p>
          <h2 className="lspSectionH2">การสอบ IELTS Speaking มีอะไรบ้าง?</h2>
          <p className="lspSectionLead">
            การสอบ Speaking ใช้เวลารวมประมาณ 11–14 นาที แบ่งเป็น 3 ส่วน
            โดยกรรมการจะบันทึกเสียงตลอดการสอบ
          </p>
        </div>

        <div className="lspPartGrid">
          {SPEAKING_PART_INFO.map((part) => (
            <article key={part.id} className="lspPartCard">
              <div className="lspPartCardTop">
                <span className="lspPartBadge">{part.part}</span>
                <span className="lspPartDuration">{part.duration}</span>
              </div>
              <h3 className="lspPartTitle">{part.titleTh}</h3>
              <p className="lspPartDesc">{part.descTh}</p>
              <div className="lspPartTip">
                <span className="lspPartTipLabel">เทคนิค</span>
                <p>{part.tipTh}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Scoring criteria ─────────────────────────────────── */}
      <section className="lspSection lspSection-criteria">
        <div className="lspSectionHead">
          <p className="lspSectionKicker">เกณฑ์การให้คะแนน · Band Descriptors</p>
          <h2 className="lspSectionH2">กรรมการให้คะแนนจากอะไร?</h2>
          <p className="lspSectionLead">คะแนนรวมคิดเฉลี่ยจาก 4 criteria นี้เท่าๆ กัน</p>
        </div>
        <div className="lspCriteriaGrid">
          {SPEAKING_CRITERIA.map((c) => (
            <article key={c.id} className="lspCriterionCard">
              <div className="lspCriterionHead">
                <span className="lspCriterionLabel">{c.labelTh}</span>
                <span className="lspCriterionWeight">{c.weight}</span>
              </div>
              <p className="lspCriterionDesc">{c.descTh}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Monthly questions ─────────────────────────────────── */}
      <section className="lspSection">
        <div className="lspSectionHead">
          <p className="lspSectionKicker">โจทย์จากการสอบจริง · January – June 2026</p>
          <h2 className="lspSectionH2">หัวข้อ IELTS Speaking 2026<br />มกราคม – มิถุนายน</h2>
          <p className="lspSectionLead">
            แต่ละเดือนมี 5 ชุดโจทย์ที่รวบรวมจากการสอบ IELTS ในประเทศไทย
            แต่ละชุดมีหัวข้อ Part 2 (cue card) และตัวอย่างคำถาม Part 3
          </p>
        </div>

        <div className="lspMonthList">
          {SPEAKING_MONTHLY_QUESTIONS_2026.map((group) => (
            <MonthAccordion key={group.month} group={group} />
          ))}
        </div>
      </section>

      {/* ── Featured Sample Answer ────────────────────────────── */}
      <section className="lspSection lspSection-sample">
        <div className="lspSectionHead">
          <p className="lspSectionKicker">ตัวอย่างคำตอบ Band 7+ · โดยพี่ดอย</p>
          <h2 className="lspSectionH2">
            {hasRealVideo ? featuredVideo!.topicTitle : sample.topicLabel}
          </h2>
          <p className="lspSectionLead">
            {hasRealVideo
              ? 'ดูวิดีโอตัวอย่างจริง แล้วกด คำที่ขีดเส้น ในข้อความด้านล่างเพื่อดูคำอธิบายคำศัพท์และไวยากรณ์เป็นภาษาไทย'
              : <>กด <strong>คำที่ขีดเส้น</strong> เพื่อดูคำอธิบายคำศัพท์และไวยากรณ์เป็นภาษาไทย</>
            }
          </p>
        </div>

        {hasRealVideo ? (
          /* ── Real uploaded video path ── */
          <RealVideoSample video={featuredVideo!} />
        ) : (
          /* ── Static fallback path ── */
          <>
            <div className="lspSampleWrap">

              {/* Cue card */}
              <div className="lspCueCard">
                <div className="lspCueCardTop">
                  <span className="lspCueCardLabel">IELTS Speaking Cue Card</span>
                  <span className="lspCueBand">{sample.band}</span>
                </div>
                <h3 className="lspCueCardPrompt">{sample.topicLabel}</h3>
                <p className="lspCueCardInstruction">You should say:</p>
                <ul className="lspCueCardList">
                  {sample.cueCard.map((cue) => (
                    <li key={cue}>{cue}</li>
                  ))}
                </ul>
                <div className="lspCueMeta">
                  <span>1 นาทีเตรียม</span>
                  <span className="lspDot" />
                  <span>{sample.durationLabel} พูด</span>
                </div>
              </div>

              {/* Annotated transcript */}
              <div className="lspTranscriptWrap">
                <div className="lspTranscriptHead">
                  <p className="lspTranscriptLabel">คำตอบ Band 7+ — แบบเต็ม</p>
                  <p className="lspTranscriptHint">กดคำที่มีสีเพื่อดูคำอธิบาย</p>
                </div>
                <div className="lspTranscript">
                  {sample.segments.map((seg) => (
                    <AnnotatedSegment key={seg.id} segment={seg} />
                  ))}
                </div>
              </div>

            </div>

            {/* Summary chips */}
            <div className="lspHighlightSummary">
              <div className="lspHighlightGroup">
                <p className="lspHighlightGroupLabel">คำศัพท์ที่ควรจำ</p>
                <div className="lspHighlightChips">
                  {sample.vocabHighlights.map((h) => (
                    <span key={h.phrase} className="lspSummaryChip lspSummaryChip-vocab">
                      {h.phrase}
                      <span className="lspSummaryChipThai">— {h.descTh}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="lspHighlightGroup">
                <p className="lspHighlightGroupLabel">โครงสร้างไวยากรณ์</p>
                <div className="lspHighlightChips">
                  {sample.grammarHighlights.map((h) => (
                    <span key={h.phrase} className="lspSummaryChip lspSummaryChip-grammar">
                      {h.phrase}
                      <span className="lspSummaryChipThai">— {h.descTh}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ── Locked samples ────────────────────────────────────── */}
      <section className="lspSection lspSection-locked">
        <div className="lspSectionHead">
          <p className="lspSectionKicker">ตัวอย่างเพิ่มเติม · English Plan Students Only</p>
          <h2 className="lspSectionH2">มีตัวอย่างอีก 60+ ชุด โดยพี่ดอย</h2>
          <p className="lspSectionLead">
            ตัวอย่างคำตอบ Band 7+ ที่วิเคราะห์คำศัพท์ ไวยากรณ์ และ intonation
            ให้ access ได้สำหรับนักเรียน English Plan เท่านั้น
          </p>
        </div>

        <div className="lspLockedGrid">
          {LOCKED_SAMPLE_TEASERS.map((teaser) => (
            <article key={teaser.id} className="lspLockedCard">
              <div className="lspLockedOverlay">
                <span className="lspLockIcon" aria-hidden="true">🔒</span>
                <p className="lspLockedMsg">สำหรับนักเรียน English Plan</p>
                <p className="lspLockedSub">เข้าถึงได้เฉพาะผู้เรียนในคอร์ส</p>
              </div>
              <div className="lspLockedCardInner" aria-hidden="true">
                <div className="lspLockedCardHead">
                  <span className="lspLockedBadge">Part 2</span>
                  <span className="lspLockedBand">{teaser.bandLabel}</span>
                </div>
                <p className="lspLockedTopic">{teaser.topic}</p>
                <p className="lspLockedDuration">{teaser.durationLabel} · พี่ดอย</p>
                <div className="lspLockedBlurBar" />
                <div className="lspLockedBlurBar lspLockedBlurBar-short" />
              </div>
            </article>
          ))}
        </div>

        {/* Upgrade CTA */}
        <div className="lspUpgradeCta">
          <div className="lspUpgradeCtaContent">
            <p className="lspUpgradeKicker">English Plan IELTS Course</p>
            <h3 className="lspUpgradeH3">
              เข้าถึงตัวอย่างทั้งหมด + เทคนิคเฉพาะ<br />
              ที่ช่วยแก้ปัญหา Speaking ของคนไทย
            </h3>
            <ul className="lspUpgradeList">
              <li>60+ Speaking samples Band 7+ โดยพี่ดอย พร้อมคำอธิบายภาษาไทย</li>
              <li>Mock Speaking + AI report ที่ชี้จุดอ่อนเฉพาะบุคคล</li>
              <li>เทคนิค Fluency, Vocabulary และ Grammar ที่ใช้ได้จริงในห้องสอบ</li>
              <li>ชุมชนนักเรียนและ feedback จากผู้สอนโดยตรง</li>
            </ul>
            <button type="button" className="lspUpgradeBtn">
              ดูรายละเอียดคอร์ส →
            </button>
          </div>
          <div className="lspUpgradeStats">
            <div className="lspUpgradeStat">
              <strong>60+</strong>
              <span>Speaking samples</span>
            </div>
            <div className="lspUpgradeStat">
              <strong>Band 7+</strong>
              <span>ทุกตัวอย่าง</span>
            </div>
            <div className="lspUpgradeStat">
              <strong>6 ปี</strong>
              <span>ประสบการณ์สอน</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
