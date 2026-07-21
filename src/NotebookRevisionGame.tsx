import { useEffect, useMemo, useState } from 'react'
import type { RevisionItem } from './notebookFacets'

type Props = {
  vocabulary: RevisionItem[]
  paraphrase: RevisionItem[]
  onClose: () => void
}

type Pair = { pairId: string; left: string; right: string }

const BATCH_SIZE = 10

const shuffle = <T,>(input: T[]): T[] => {
  const array = [...input]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const chunk = <T,>(input: T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < input.length; i += size) out.push(input.slice(i, i + size))
  return out
}

/**
 * The Notebook revision game: a click-to-match drill over the learner's own
 * saved items. Two modes —
 *   Vocabulary  → English word (left)  ↔  Thai meaning (right)
 *   Paraphrase  → phrasing A (left)    ↔  equivalent phrasing B (right)
 * Ten pairs a round; the right column is shuffled. Match the whole pool to win.
 */
export function NotebookRevisionGame({ vocabulary, paraphrase, onClose }: Props) {
  const [mode, setMode] = useState<'menu' | 'vocabulary' | 'paraphrase'>('menu')
  const [batchIndex, setBatchIndex] = useState(0)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [wrongId, setWrongId] = useState<string | null>(null)

  const activeItems = mode === 'vocabulary' ? vocabulary : mode === 'paraphrase' ? paraphrase : []

  const batches = useMemo<Pair[][]>(() => {
    if (mode === 'menu') return []
    const pairs: Pair[] = shuffle(activeItems).map((item, index) => ({
      pairId: `${item.id}-${index}`,
      left: item.left,
      right: item.right
    }))
    return chunk(pairs, BATCH_SIZE)
    // Rebuild only when the mode (and therefore the pool) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // Right column is shuffled independently of the left column's order.
  const rightColumn = useMemo(() => {
    const batch = batches[batchIndex] || []
    return shuffle(batch)
  }, [batches, batchIndex])

  const currentBatch = batches[batchIndex] || []
  const totalPairs = activeItems.length
  const totalMatched = batchIndex * BATCH_SIZE + matched.size
  const isFinished = mode !== 'menu' && totalPairs > 0 && totalMatched >= totalPairs

  useEffect(() => {
    if (!wrongId) return
    const timer = window.setTimeout(() => setWrongId(null), 460)
    return () => window.clearTimeout(timer)
  }, [wrongId])

  const startMode = (next: 'vocabulary' | 'paraphrase') => {
    setMode(next)
    setBatchIndex(0)
    setMatched(new Set())
    setSelectedLeft(null)
    setWrongId(null)
  }

  const backToMenu = () => {
    setMode('menu')
    setBatchIndex(0)
    setMatched(new Set())
    setSelectedLeft(null)
    setWrongId(null)
  }

  const handleRightClick = (pair: Pair) => {
    if (matched.has(pair.pairId)) return
    // Left-first flow: pick an English word/phrase, then its match on the right.
    if (!selectedLeft) return
    if (selectedLeft === pair.pairId) {
      const nextMatched = new Set(matched)
      nextMatched.add(pair.pairId)
      setMatched(nextMatched)
      setSelectedLeft(null)
      if (nextMatched.size >= currentBatch.length && batchIndex < batches.length - 1) {
        window.setTimeout(() => {
          setBatchIndex((index) => index + 1)
          setMatched(new Set())
          setSelectedLeft(null)
        }, 520)
      }
    } else {
      setWrongId(pair.pairId)
      setSelectedLeft(null)
    }
  }

  const handleLeftClick = (pair: Pair) => {
    if (matched.has(pair.pairId)) return
    setSelectedLeft((current) => (current === pair.pairId ? null : pair.pairId))
  }

  return (
    <div className="nbGameOverlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="nbGameCard" onClick={(event) => event.stopPropagation()}>
        <header className="nbGameHeader">
          <div>
            <p className="nbGameEyebrow">Notebook Revision</p>
            <h3>ทบทวน Notebook แบบเกมจับคู่</h3>
          </div>
          <button type="button" className="nbGameClose" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        {mode === 'menu' ? (
          <div className="nbGameMenu">
            <p className="nbGameMenuLead">
              เลือกโหมดที่อยากทบทวน — จับคู่ให้ครบทุกคู่แล้วจะได้คำชมนะครับ 🎯
            </p>
            <div className="nbGameModeGrid">
              <button
                type="button"
                className="nbGameModeCard"
                disabled={vocabulary.length === 0}
                onClick={() => startMode('vocabulary')}
              >
                <span className="nbGameModeIcon">📖</span>
                <span className="nbGameModeTitle">Vocabulary</span>
                <span className="nbGameModeDesc">จับคู่คำศัพท์อังกฤษ ↔ ความหมายไทย</span>
                <span className="nbGameModeCount">{vocabulary.length} คำ</span>
                <span className="nbGameModeUse">สำหรับ Writing &amp; Speaking</span>
              </button>
              <button
                type="button"
                className="nbGameModeCard"
                disabled={paraphrase.length === 0}
                onClick={() => startMode('paraphrase')}
              >
                <span className="nbGameModeIcon">🔁</span>
                <span className="nbGameModeTitle">Paraphrasing</span>
                <span className="nbGameModeDesc">จับคู่สำนวนที่มีความหมายเท่ากัน</span>
                <span className="nbGameModeCount">{paraphrase.length} คู่</span>
                <span className="nbGameModeUse">สำหรับ Reading &amp; Listening</span>
              </button>
            </div>
            {vocabulary.length === 0 && paraphrase.length === 0 ? (
              <p className="nbGameEmpty">
                ยังไม่มีคำศัพท์หรือพาราเฟรสใน Notebook — กด “บันทึกลง Notebook” จากรายงานหรือบทเรียนก่อนนะครับ
              </p>
            ) : null}
          </div>
        ) : isFinished ? (
          <div className="nbGameDone">
            <div className="nbGameDoneBadge">🏆</div>
            <h4>ยอดเยี่ยมมากครับ!</h4>
            <p>
              คุณทบทวน{mode === 'vocabulary' ? 'คำศัพท์' : 'พาราเฟรส'}ครบทั้ง {totalPairs}{' '}
              {mode === 'vocabulary' ? 'คำ' : 'คู่'}เรียบร้อยแล้ว 🎉
            </p>
            <div className="nbGameDoneActions">
              <button type="button" className="nbGamePrimaryBtn" onClick={backToMenu}>
                เลือกโหมดอื่น
              </button>
              <button type="button" className="nbGameGhostBtn" onClick={() => startMode(mode)}>
                เล่นซ้ำ
              </button>
            </div>
          </div>
        ) : (
          <div className="nbGamePlay">
            <div className="nbGameProgressRow">
              <button type="button" className="nbGameBackBtn" onClick={backToMenu}>
                ← โหมด
              </button>
              <div className="nbGameProgressBar">
                <div
                  className="nbGameProgressFill"
                  style={{ width: `${totalPairs ? (totalMatched / totalPairs) * 100 : 0}%` }}
                />
              </div>
              <span className="nbGameProgressText">
                {totalMatched}/{totalPairs}
              </span>
            </div>
            <p className="nbGameHint">
              {selectedLeft ? 'ตอนนี้เลือกอยู่ — กดคู่ที่ถูกต้องอีกฝั่ง' : 'กดฝั่งซ้าย แล้วกดคู่ที่ถูกต้องฝั่งขวา'}
              {batches.length > 1 ? ` · ชุดที่ ${batchIndex + 1}/${batches.length}` : ''}
            </p>
            <div className="nbGameColumns">
              <ul className="nbGameColumn nbGameColumnLeft">
                {currentBatch.map((pair) => {
                  const isMatched = matched.has(pair.pairId)
                  const isSelected = selectedLeft === pair.pairId
                  return (
                    <li key={`l-${pair.pairId}`}>
                      <button
                        type="button"
                        className={`nbGameTile${isMatched ? ' is-matched' : ''}${
                          isSelected ? ' is-selected' : ''
                        }`}
                        disabled={isMatched}
                        onClick={() => handleLeftClick(pair)}
                      >
                        {pair.left}
                      </button>
                    </li>
                  )
                })}
              </ul>
              <ul className="nbGameColumn nbGameColumnRight">
                {rightColumn.map((pair) => {
                  const isMatched = matched.has(pair.pairId)
                  const isWrong = wrongId === pair.pairId
                  return (
                    <li key={`r-${pair.pairId}`}>
                      <button
                        type="button"
                        className={`nbGameTile nbGameTileRight${isMatched ? ' is-matched' : ''}${
                          isWrong ? ' is-wrong' : ''
                        }`}
                        disabled={isMatched}
                        onClick={() => handleRightClick(pair)}
                      >
                        {pair.right}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
