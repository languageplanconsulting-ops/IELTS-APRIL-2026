import fs from 'node:fs'

const SOURCES = {
  2: '/Users/natchanon/.cursor/projects/Users-natchanon-IELTS-SPEAKING/agent-tools/8a57e399-481b-4f1d-9ac1-104e9c30b8ae.txt',
  3: '/Users/natchanon/.cursor/projects/Users-natchanon-IELTS-SPEAKING/agent-tools/bca03efc-2658-4540-bc3e-126a003d1c51.txt',
  4: '/Users/natchanon/.cursor/projects/Users-natchanon-IELTS-SPEAKING/agent-tools/f796b050-af9e-4b39-a0b1-e60634b681b9.txt'
}

const clean = (s) =>
  s
    .replace(/\d+Drop heading here\n?/g, '')
    .replace(/^-+$/gm, '')
    .replace(/\* The personal names[\s\S]*$/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const extractLettered = (text, startTitle, endTitle) => {
  const start = text.indexOf(startTitle)
  const end = endTitle ? text.indexOf(endTitle, start + 1) : text.length
  if (start < 0) return ''
  return clean(text.slice(start, end < 0 ? text.length : end))
}

const extractPlain = (text, startTitle, endTitle) => {
  const start = text.indexOf(startTitle)
  const end = text.indexOf(endTitle, start + 1)
  if (start < 0) return ''
  return clean(text.slice(start, end < 0 ? text.length : end))
}

export const extractTest2 = () => {
  const raw = fs.readFileSync(SOURCES[2], 'utf8')
  return {
    p1: extractLettered(raw, 'The risks agriculture faces in developing countries', 'The Lost City'),
    p2: extractLettered(raw, 'The Lost City', 'The Benefits of Being Bilingual'),
    p3: extractLettered(raw, 'The Benefits of Being Bilingual', '## Questions 1-3')
  }
}

export const extractTest3 = () => {
  const raw = fs.readFileSync(SOURCES[3], 'utf8')
  return {
    p1: extractLettered(raw, 'Flying tortoises', 'The Intersection of Health Sciences and Geography'),
    p2: extractLettered(raw, 'The Intersection of Health Sciences and Geography', 'Music and the emotions'),
    p3: extractPlain(raw, 'Music and the emotions', '## Questions 1-7')
  }
}

export const extractTest4 = () => {
  const raw = fs.readFileSync(SOURCES[4], 'utf8')
  return {
    p1: extractPlain(raw, 'The History of Glass', 'Bring back the big cats'),
    p2: extractPlain(raw, 'Bring back the big cats', 'UK companies need more effective boards of directors'),
    p3: extractLettered(raw, 'UK companies need more effective boards of directors', '## Questions 1-8')
  }
}
