/**
 * Illustrations for the placement test.
 *
 * Drawn inline as SVG rather than shipped as files: they are small, they inherit
 * the brand blue and yellow directly, and they stay sharp at any size on a page
 * that has to work on both a phone and a laptop.
 *
 * The character artwork, once it arrives, replaces the per-skill illustration on
 * the intro screens — see `.plcMascot` in PlacementTestPage.css.
 */
import type { JSX } from 'react'

const BLUE = '#004aad'
const YELLOW = '#ffcc00'
const PALE = '#8fb0e4'
const SHADOW = '#e8f0fc'

export const PlacementArt = {
  clock: (
    <svg className="plcArt" viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="142" rx="66" ry="9" fill={SHADOW} />
      <circle cx="100" cy="74" r="52" fill="#fff6d6" stroke={BLUE} strokeWidth="5" />
      <path d="M100 44v32l22 13" stroke={BLUE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="74" r="6" fill={YELLOW} />
      <path d="M56 26 42 14M144 26l14-12" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  book: (
    <svg className="plcArt" viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="144" rx="70" ry="8" fill={SHADOW} />
      <circle cx="150" cy="36" r="20" fill={YELLOW} />
      <circle cx="142" cy="30" r="17" fill="#fffdf7" />
      <path d="M34 44c22-10 44-10 66 4v82c-22-14-44-14-66-4V44Z" fill="#fff" stroke={BLUE} strokeWidth="5" strokeLinejoin="round" />
      <path d="M166 44c-22-10-44-10-66 4v82c22-14 44-14 66-4V44Z" fill={SHADOW} stroke={BLUE} strokeWidth="5" strokeLinejoin="round" />
      <path d="M50 66h34M50 84h30M116 66h34M116 84h30" stroke={PALE} strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  headphones: (
    <svg className="plcArt" viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="146" rx="60" ry="8" fill={SHADOW} />
      <path d="M46 104V80a54 54 0 0 1 108 0v24" stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
      <rect x="30" y="96" width="30" height="44" rx="14" fill={YELLOW} stroke={BLUE} strokeWidth="5" />
      <rect x="140" y="96" width="30" height="44" rx="14" fill={YELLOW} stroke={BLUE} strokeWidth="5" />
      <path d="M176 96c10 8 10 26 0 34M186 86c16 14 16 46 0 60" stroke={PALE} strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  chart: (
    <svg className="plcArt" viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="146" rx="66" ry="8" fill={SHADOW} />
      <rect x="34" y="24" width="132" height="106" rx="14" fill="#fff" stroke={BLUE} strokeWidth="5" />
      <path d="M54 108V86M82 108V70M110 108V54M138 108V38" stroke={YELLOW} strokeWidth="11" strokeLinecap="round" />
      <path d="M48 114h108" stroke={PALE} strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  mic: (
    <svg className="plcArt" viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="146" rx="52" ry="8" fill={SHADOW} />
      <rect x="80" y="20" width="40" height="66" rx="20" fill={YELLOW} stroke={BLUE} strokeWidth="5" />
      <path d="M60 74a40 40 0 0 0 80 0M100 114v22M78 138h44" stroke={BLUE} strokeWidth="6" strokeLinecap="round" />
      <path d="M36 56c-8 12-8 26 0 38M164 56c8 12 8 26 0 38" stroke={PALE} strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  cheer: (
    <svg className="plcArt" viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <path d="M100 26l14 30 33 5-24 23 6 33-29-16-29 16 6-33-24-23 33-5 14-30Z" fill={YELLOW} stroke={BLUE} strokeWidth="5" strokeLinejoin="round" />
      <path d="M36 40l-9-9M164 40l9-9M28 92l-12 4M172 92l12 4" stroke={BLUE} strokeWidth="5" strokeLinecap="round" />
      <path d="M62 132h76" stroke={PALE} strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  done: (
    <svg className="plcArt" viewBox="0 0 200 160" fill="none" aria-hidden="true">
      <ellipse cx="100" cy="146" rx="58" ry="8" fill={SHADOW} />
      <circle cx="100" cy="74" r="50" fill="#e4f6ec" stroke={BLUE} strokeWidth="5" />
      <path d="M78 74l16 16 30-32" stroke="#1a8a55" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 24l-8-8M160 24l8-8" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
} satisfies Record<string, JSX.Element>

/** The Task 1 chart the writing questions describe. */
export const PlacementChart = (): JSX.Element => {
  const gridValues = [0, 20, 40, 60, 80, 100]
  const xs = [62, 337, 612]
  const yOf = (value: number) => 292 - (value / 100) * 236
  const series = [
    { name: 'UK', colour: '#004aad', points: [25, 55, 75] },
    { name: 'Germany', colour: '#1a8a55', points: [20, 52, 78] },
    { name: 'France', colour: '#d9a800', points: [12, 40, 65] },
    { name: 'Italy', colour: '#cf4436', points: [15, 33, 55] }
  ]
  return (
    <svg viewBox="0 0 640 350" role="img" aria-label="Line graph of household internet access, 2000 to 2010">
      <text x="320" y="20" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1b2230">
        Households with internet access, 2000–2010
      </text>
      <g stroke="#ece9e0" strokeWidth="1">
        {gridValues.map((v) => <line key={v} x1="62" y1={yOf(v)} x2="612" y2={yOf(v)} />)}
      </g>
      <g fontSize="12" fill="#6b7488" textAnchor="end">
        {gridValues.map((v) => <text key={v} x="54" y={yOf(v) + 4}>{v}%</text>)}
      </g>
      <line x1="62" y1="292" x2="612" y2="292" stroke="#9aa3ba" strokeWidth="1.5" />
      <line x1="62" y1="54" x2="62" y2="292" stroke="#9aa3ba" strokeWidth="1.5" />
      <g fontSize="12" fill="#6b7488" textAnchor="middle">
        <text x="62" y="313">2000</text>
        <text x="337" y="313">2005</text>
        <text x="612" y="313">2010</text>
      </g>
      {series.map((s) => (
        <g key={s.name}>
          <polyline
            points={s.points.map((v, i) => `${xs[i]},${yOf(v)}`).join(' ')}
            fill="none" stroke={s.colour} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"
          />
          {s.points.map((v, i) => <circle key={i} cx={xs[i]} cy={yOf(v)} r="5" fill={s.colour} />)}
        </g>
      ))}
      <g fontSize="12.5">
        {series.map((s, i) => (
          <g key={s.name}>
            <rect x={86 + i * 132} y="332" width="16" height="4" rx="2" fill={s.colour} />
            <text x={108 + i * 132} y="337" fill="#1b2230">{s.name}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}
