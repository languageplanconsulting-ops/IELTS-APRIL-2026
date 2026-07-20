import type { ListeningFoundationSet } from './listeningFoundationData'

export type ListeningBankBookFilter = number | 'all'

export type ListeningFoundationSetMeta = {
  book: number
  test: number
  section: number
  topicTitle: string
  cardTitle: string
  cardSubtitle: string
}

export const parseListeningFoundationSetMeta = (set: ListeningFoundationSet): ListeningFoundationSetMeta => {
  const fromTitle = set.title.match(/Cam\s*(\d+)\s*Test\s*(\d+)\s*·\s*Section\s*(\d+)/i)
  const fromId = set.id.match(/cambridge-(\d+)-section-(\d+)-test(\d+)/i)

  const book = Number(fromTitle?.[1] || fromId?.[1] || 0)
  const test = Number(fromTitle?.[2] || fromId?.[3] || 0)
  const section = Number(fromTitle?.[3] || fromId?.[2] || set.section || 0)

  const topicTitle = set.title
    .replace(/^Cam\s*\d+\s*Test\s*\d+\s*·\s*Section\s*\d+\s*-\s*/i, '')
    .replace(/\s*Skill Drill\s*$/i, '')
    .trim()

  return {
    book,
    test,
    section,
    topicTitle,
    cardTitle: book ? `Test ${test} · Section ${section}` : set.title,
    cardSubtitle: topicTitle || set.levelLabel
  }
}

export const groupFoundationSetsByBook = (
  sets: ListeningFoundationSet[],
  bookFilter: ListeningBankBookFilter
) => {
  const filtered =
    bookFilter === 'all' ? sets : sets.filter((set) => parseListeningFoundationSetMeta(set).book === bookFilter)

  const byBook = new Map<number, ListeningFoundationSet[]>()
  for (const set of filtered) {
    const book = parseListeningFoundationSetMeta(set).book || 0
    if (!byBook.has(book)) byBook.set(book, [])
    byBook.get(book)!.push(set)
  }

  return [...byBook.entries()]
    .sort(([a], [b]) => {
      if (a === 0 && b !== 0) return 1
      if (b === 0 && a !== 0) return -1
      return a - b
    })
    .map(([book, bookSets]) => ({
      book,
      sets: [...bookSets].sort((a, b) => {
        const metaA = parseListeningFoundationSetMeta(a)
        const metaB = parseListeningFoundationSetMeta(b)
        if (metaA.test !== metaB.test) return metaA.test - metaB.test
        return metaA.section - metaB.section
      })
    }))
}

export const listFoundationBooks = (sets: ListeningFoundationSet[]) =>
  [...new Set(sets.map((set) => parseListeningFoundationSetMeta(set).book).filter(Boolean))].sort((a, b) => a - b)

export type ListeningBuilderPackSummary = {
  id: string
  title: string
  bookNumber?: number | null
  sectionNumber?: number | null
  testNumbers: number[]
  taskCount: number
}

export const groupBuilderPacksByBook = <T extends ListeningBuilderPackSummary>(
  packs: T[],
  bookFilter: ListeningBankBookFilter
) => {
  const filtered =
    bookFilter === 'all' ? packs : packs.filter((pack) => (pack.bookNumber || 0) === bookFilter)

  const byBook = new Map<number, T[]>()
  for (const pack of filtered) {
    const book = pack.bookNumber || 0
    if (!byBook.has(book)) byBook.set(book, [])
    byBook.get(book)!.push(pack)
  }

  return [...byBook.entries()]
    .sort(([a], [b]) => a - b)
    .map(([book, bookPacks]) => ({
      book,
      packs: [...bookPacks].sort((a, b) => (a.sectionNumber || 0) - (b.sectionNumber || 0))
    }))
}

export const listBuilderBooks = (packs: ListeningBuilderPackSummary[]) =>
  [...new Set(packs.map((pack) => pack.bookNumber).filter((book): book is number => Boolean(book)))].sort(
    (a, b) => a - b
  )
