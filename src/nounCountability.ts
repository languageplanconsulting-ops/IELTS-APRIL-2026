// Countable / uncountable tagging for Writing vocabulary (Academic + General).
// Keyed by the singular head noun so one entry covers every collocation that
// ends in that noun. Unknown nouns return null → no badge (never guess).

export type Countability = 'C' | 'U' | 'C/U'

export const COUNTABILITY_LABEL_TH: Record<Countability, string> = {
  C: 'นับได้ (countable)',
  U: 'นับไม่ได้ (uncountable)',
  'C/U': 'นับได้/ไม่ได้ (both)'
}

const IRREGULAR_SINGULAR: Record<string, string> = {
  people: 'person',
  children: 'child',
  men: 'man',
  women: 'woman',
  feet: 'foot',
  teeth: 'tooth',
  lives: 'life',
  wives: 'wife',
  knives: 'knife',
  leaves: 'leaf',
  shelves: 'shelf',
  halves: 'half',
  criteria: 'criterion',
  data: 'datum',
  media: 'medium',
  analyses: 'analysis',
  crises: 'crisis'
}

// Words that end in "s" but are already singular / not a plural.
const NON_PLURAL_S = new Set([
  'business', 'access', 'progress', 'illness', 'awareness', 'fitness', 'stress',
  'success', 'address', 'process', 'series', 'species', 'news', 'campus', 'status',
  'bus', 'gas', 'plus', 'focus', 'virus', 'bonus', 'surplus', 'goods', 'means'
])

export const singularizeWord = (word: string): string => {
  const lower = word.toLowerCase()
  if (IRREGULAR_SINGULAR[lower]) return matchCase(word, IRREGULAR_SINGULAR[lower])
  if (NON_PLURAL_S.has(lower)) return word
  if (/[^aeiou]ies$/.test(lower)) return matchCase(word, lower.slice(0, -3) + 'y')
  if (/(ses|xes|zes|ches|shes)$/.test(lower)) return matchCase(word, lower.slice(0, -2))
  if (/[^s]s$/.test(lower) && !lower.endsWith('ss') && !lower.endsWith('us') && !lower.endsWith('is')) {
    return matchCase(word, lower.slice(0, -1))
  }
  return word
}

const matchCase = (source: string, sample: string): string =>
  source[0] === source[0]?.toUpperCase() ? sample.charAt(0).toUpperCase() + sample.slice(1) : sample

// ── Head-noun countability dictionary ──────────────────────────────────────
const UNCOUNTABLE = [
  'advice', 'information', 'work', 'working', 'research', 'money', 'transport', 'traffic',
  'equipment', 'furniture', 'accommodation', 'homework', 'knowledge', 'evidence', 'progress',
  'health', 'safety', 'wellbeing', 'pollution', 'behaviour', 'employment', 'education',
  'independence', 'mobility', 'funding', 'income', 'access', 'support', 'technology',
  'infrastructure', 'luggage', 'food', 'water', 'air', 'land', 'weather', 'news', 'leisure',
  'stress', 'freedom', 'machinery', 'staff', 'flexibility', 'reliability', 'stability',
  'confidence', 'motivation', 'attention', 'contact', 'cooperation', 'effort', 'trade',
  'travel', 'housing', 'lighting', 'automation', 'priority', 'poverty', 'wildlife',
  'literacy', 'nature', 'welfare', 'guidance', 'maintenance', 'wealth', 'demand', 'waste',
  'companionship', 'isolation', 'retirement', 'training', 'planning', 'space', 'crime',
  'convenience', 'independence', 'quality', 'weather', 'assistance'
]

const COUNTABLE = [
  'schedule', 'worker', 'budget', 'fare', 'centre', 'life', 'route', 'pass', 'chore',
  'skill', 'product', 'habit', 'shop', 'store', 'retailer', 'town', 'job', 'market',
  'cost', 'service', 'relationship', 'hour', 'journey', 'operator', 'card', 'choice',
  'date', 'portion', 'bank', 'organisation', 'resident', 'commitment', 'expense',
  'burden', 'relative', 'home', 'surrounding', 'nurse', 'activity', 'trip', 'resource',
  'experience', 'fee', 'business', 'visitor', 'alternative', 'applicant', 'destination',
  'room', 'checkout', 'queue', 'transaction', 'payment', 'garden', 'tool', 'group',
  'facility', 'agreement', 'appliance', 'device', 'duty', 'limit', 'centre', 'building',
  'city', 'company', 'course', 'customer', 'employer', 'employee', 'family', 'friend',
  'manager', 'meeting', 'neighbour', 'parent', 'passenger', 'pension', 'plan', 'problem',
  'reason', 'solution', 'student', 'teacher', 'ticket', 'child', 'area', 'benefit',
  'colleague', 'community', 'decision', 'event', 'goal', 'idea', 'lesson', 'option',
  'process', 'project', 'result', 'rule', 'season', 'shift', 'situation', 'space',
  'system', 'task', 'team', 'trip', 'appointment', 'container', 'discount', 'engine',
  'grocery', 'lamp', 'meal', 'note', 'offer', 'order', 'pavement', 'printer', 'qualification',
  'requirement', 'sample', 'shelf', 'staffer', 'stall', 'supply', 'vehicle'
]

const NOUN_COUNTABILITY: Record<string, Countability> = (() => {
  const map: Record<string, Countability> = {}
  for (const noun of UNCOUNTABLE) map[noun] = 'U'
  for (const noun of COUNTABLE) map[noun] = 'C'
  // Nouns that work both ways depending on sense.
  for (const noun of ['space', 'business', 'experience', 'life', 'room', 'coffee', 'light']) {
    map[noun] = 'C/U'
  }
  return map
})()

const headNoun = (phrase: string): string => {
  const words = phrase
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .split(/\s+/)
    .filter(Boolean)
  if (!words.length) return ''
  // "of"-phrases like "nature of the job" → the noun before "of".
  const ofIndex = words.indexOf('of')
  const target = ofIndex > 0 ? words[ofIndex - 1] : words[words.length - 1]
  return singularizeWord(target)
}

export const getCountability = (phrase: string): Countability | null =>
  NOUN_COUNTABILITY[headNoun(phrase)] ?? null
