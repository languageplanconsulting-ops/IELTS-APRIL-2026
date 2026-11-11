import assert from 'node:assert/strict'
import React, { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { WritingCoachRules } from '../src/WritingCoachRulesPanel'
import {
  WRITING_COACH_RULES,
  WRITING_COACH_RULE_BY_ID,
  getTask1CoachRules,
  getTask2CoachRules,
  type CoachExample
} from '../src/writingCoachRules'
import { BLANK_COACH_TH, STEP_COACH_TH } from '../src/writingGuidedBuilder'
import { WGB2_BLANK_COACH_TH, WGB2_STEP_COACH_TH } from '../src/writingTask2Builder'

// tsx uses the classic JSX transform for the component file, which expects React in scope.
;(globalThis as { React?: unknown }).React = React

// ── structure ───────────────────────────────────────────────────────────────────────────
const ids = WRITING_COACH_RULES.map((rule) => rule.id)
assert.equal(new Set(ids).size, ids.length, 'Rule ids must be unique.')

// Task 1 SOP (CLAUDE.md): body sentences open with a taught opener or one of the 8 transitions.
const ALLOWED_TASK1_STARTS = [
  'Starting with',
  'In terms of',
  'Starting in',
  'Whereas',
  'However,',
  'On the other hand,',
  'In contrast,',
  'Likewise,',
  'Similarly,',
  'Interestingly,',
  'Surprisingly,',
  'It is interesting to note that ',
  'Overall, it can be clearly observed that '
]
const BANNED_TASK1_STARTS =
  /^(By contrast|By comparison|Notably|Together|Meanwhile|Moreover|Furthermore|In addition|Although|While|The remaining|This gap)\b/
const OVERVIEW_OPENER = 'Overall, it can be clearly observed that '

const checkExamples = (ruleId: string, task: 1 | 2, examples: CoachExample[] | undefined) => {
  if (!examples) return
  assert.equal(examples.length, 3, `${ruleId}: Task ${task} must have exactly 3 examples.`)
  examples.forEach((example) => {
    const where = `${ruleId} / Task ${task}: "${example.en.slice(0, 50)}…"`
    assert.ok(example.en.trim().length > 10, `${where} is empty.`)
    if (example.mark) assert.ok(example.en.includes(example.mark), `${where} — mark "${example.mark}" is not in the sentence.`)
    if (/respectively/i.test(example.en)) {
      assert.ok(/, respectively/.test(example.en), `${where} — "respectively" needs a comma before it.`)
    }
    if (task !== 1) return

    assert.ok(!BANNED_TASK1_STARTS.test(example.en), `${where} — opener is not on the SOP list.`)
    if (ruleId === 'overview' || ruleId === 'trend') {
      assert.ok(example.en.startsWith(OVERVIEW_OPENER), `${where} — an Overview must open with "${OVERVIEW_OPENER}…".`)
      assert.ok(!/\d/.test(example.en), `${where} — an Overview has no numbers.`)
      assert.ok(!/contrasting with|leaving other sources/i.test(example.en), `${where} — banned Overview phrase.`)
    } else if (ruleId === 'intro' || ruleId === 'paraphrase') {
      assert.ok(example.en.startsWith('The '), `${where} — an Introduction starts with "The [chart]".`)
      assert.ok(!/[.!?]\s+[A-Z]/.test(example.en), `${where} — an Introduction is ONE sentence.`)
      assert.ok(!/presenting|allowing|highlighting/i.test(example.en), `${where} — no extra clause after the Introduction.`)
    } else {
      assert.ok(
        ALLOWED_TASK1_STARTS.some((start) => example.en.startsWith(start)),
        `${where} — Task 1 body sentences must start with a taught opener or an allowed transition.`
      )
    }
  })
}

WRITING_COACH_RULES.forEach((rule) => {
  assert.ok(rule.titleTh && rule.oneLineTh, `${rule.id}: needs a title and a one-line summary.`)
  assert.ok(rule.stepsTh.length >= 2, `${rule.id}: needs at least 2 how-to steps.`)
  assert.ok(rule.task1 || rule.task2, `${rule.id}: needs examples for at least one task.`)
  checkExamples(rule.id, 1, rule.task1)
  checkExamples(rule.id, 2, rule.task2)

  // Letter-hint examples: the visible letters + the dashes must add up to the answer.
  if (rule.id === 'letter-hint') {
    ;[...(rule.task1 || []), ...(rule.task2 || [])].forEach((example) => {
      const hint = /([A-Za-z]+)(_(?: _)*)/.exec(example.en)
      const answer = /→ (\w+)/.exec(example.noteTh || '')?.[1]
      assert.ok(hint && answer, `letter-hint: could not read "${example.en}".`)
      const [, shown, dashes] = hint as RegExpExecArray
      assert.ok(answer!.startsWith(shown), `letter-hint: "${shown}" is not the start of "${answer}".`)
      assert.equal(shown.length + (dashes.match(/_/g) || []).length, answer!.length, `letter-hint: wrong dash count for "${answer}".`)
    })
  }
})

// ── every step and every blank type resolves to real rules that fit the task ───────────────
const TASK1_ROLES = ['intro', 'overview', 'body1', 'body2'] as const
const TASK1_FOCUS = [
  'paraphrase', 'word-choice', 'transition', 'referencing', 'trend-phrase', 'verb-tense',
  'ving-clause', 'v3-clause', 'degree-adverb', 'article', 'letter-hint'
] as const
const TASK2_ROLES = ['intro', 'body1', 'body2', 'body3', 'conclusion'] as const
const TASK2_FOCUS = [
  'verb-tense', 'plural', 'noun', 'adjective', 'adverb', 'transition', 'article', 'comma',
  'participle', 'punct', 'word-choice', 'letter-hint'
] as const

TASK1_ROLES.forEach((role) =>
  [null, ...TASK1_FOCUS].forEach((focus) => {
    const picked = getTask1CoachRules(role, focus)
    assert.ok(picked.ids.length > 0, `Task 1 ${role}/${focus}: no rules.`)
    picked.ids.forEach((id) => {
      assert.ok(WRITING_COACH_RULE_BY_ID[id], `Task 1 ${role}/${focus}: unknown rule "${id}".`)
      assert.ok(WRITING_COACH_RULE_BY_ID[id].task1, `Task 1 ${role}/${focus}: "${id}" has no Task 1 examples.`)
    })
    picked.focusIds.forEach((id) => assert.ok(picked.ids.includes(id), `focus rule "${id}" must be listed.`))
    if (focus) assert.ok(picked.focusIds.length > 0, `Task 1 ${role}/${focus}: a focused blank must highlight a rule.`)
  })
)
TASK2_ROLES.forEach((role) =>
  [null, ...TASK2_FOCUS].forEach((focus) => {
    const picked = getTask2CoachRules(role, focus)
    assert.ok(picked.ids.length > 0, `Task 2 ${role}/${focus}: no rules.`)
    picked.ids.forEach((id) => {
      assert.ok(WRITING_COACH_RULE_BY_ID[id], `Task 2 ${role}/${focus}: unknown rule "${id}".`)
      assert.ok(WRITING_COACH_RULE_BY_ID[id].task2, `Task 2 ${role}/${focus}: "${id}" has no Task 2 examples.`)
    })
    if (focus) assert.ok(picked.focusIds.length > 0, `Task 2 ${role}/${focus}: a focused blank must highlight a rule.`)
  })
)

// ── coach one-liners stay short and plain (the old ones were walls of text) ───────────────
const MAX_COACH_CHARS = 260
const checkCoach = (label: string, map: Record<string, string>, keys: readonly string[]) =>
  keys.forEach((key) => {
    const text = map[key]
    assert.ok(text && text.trim().length > 0, `${label}.${key}: missing coach text.`)
    assert.ok(text.length <= MAX_COACH_CHARS, `${label}.${key}: ${text.length} chars — keep it under ${MAX_COACH_CHARS}.`)
  })
checkCoach('STEP_COACH_TH', STEP_COACH_TH, TASK1_ROLES)
checkCoach('BLANK_COACH_TH', BLANK_COACH_TH, TASK1_FOCUS)
checkCoach('WGB2_STEP_COACH_TH', WGB2_STEP_COACH_TH, TASK2_ROLES)
checkCoach('WGB2_BLANK_COACH_TH', WGB2_BLANK_COACH_TH, TASK2_FOCUS)

// ── the dropdown actually renders (closed → list → rule open) ─────────────────────────────
const selection = getTask1CoachRules('body1', 'transition')
const closed = renderToStaticMarkup(createElement(WritingCoachRules, { task: 1, selection }))
assert.ok(closed.includes('ดูกฎของช่องนี้ + ตัวอย่าง'), 'Closed state shows the toggle button.')
assert.ok(!closed.includes('wgbRuleHead'), 'Rules stay hidden until the learner opens the list.')

const listOpen = renderToStaticMarkup(createElement(WritingCoachRules, { task: 1, selection, defaultListOpen: true }))
assert.equal((listOpen.match(/class="wgbRuleHead"/g) || []).length, selection.ids.length, 'One row per rule.')
assert.ok(listOpen.includes('ช่องนี้'), 'The rule for the focused blank is tagged.')
assert.ok(!listOpen.includes('wgbRuleBody'), 'No rule is expanded until it is clicked.')

const bothTasks = renderToStaticMarkup(
  createElement(WritingCoachRules, { task: 1, selection, defaultListOpen: true, defaultOpenRuleId: 'link-contrast' })
)
assert.equal((bothTasks.match(/wgbRuleEn/g) || []).length, 6, 'link-contrast shows 3 Task 1 + 3 Task 2 examples.')
assert.ok(bothTasks.includes('<mark>However,</mark>'), 'The key phrase is highlighted.')
assert.ok(bothTasks.indexOf('is-task1') < bothTasks.indexOf('is-task2'), 'Task 1 comes first on a Task 1 page.')

const task2Page = renderToStaticMarkup(
  createElement(WritingCoachRules, {
    task: 2,
    selection: getTask2CoachRules('body1', null),
    defaultListOpen: true,
    defaultOpenRuleId: 'link-contrast'
  })
)
assert.ok(task2Page.indexOf('is-task2') < task2Page.indexOf('is-task1'), 'Task 2 comes first on a Task 2 page.')

const oneSided = renderToStaticMarkup(
  createElement(WritingCoachRules, {
    task: 2,
    selection: { focusIds: [], ids: ['overview'] },
    defaultListOpen: true,
    defaultOpenRuleId: 'overview'
  })
)
assert.ok(oneSided.includes('กฎนี้ใช้กับ Task 1 เท่านั้น'), 'A Task 1-only rule says so on a Task 2 page.')
assert.equal((oneSided.match(/wgbRuleEn/g) || []).length, 3, 'A one-sided rule shows only its own 3 examples.')

console.log(`Writing coach rules validation passed (${WRITING_COACH_RULES.length} rules).`)
