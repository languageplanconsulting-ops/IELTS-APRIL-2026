import { useId, useState, type MouseEvent, type ReactNode } from 'react'
import {
  WRITING_COACH_RULE_BY_ID,
  type CoachExample,
  type CoachRule,
  type CoachRuleSelection
} from './writingCoachRules'

const highlight = (text: string, mark?: string): ReactNode => {
  if (!mark) return text
  const index = text.indexOf(mark)
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <mark>{mark}</mark>
      {text.slice(index + mark.length)}
    </>
  )
}

function ExampleList({ task, rule, examples }: { task: 1 | 2; rule: CoachRule; examples: CoachExample[] }) {
  return (
    <div className="wgbRuleExampleGroup">
      <p className="wgbRuleSub">
        <span className={`wgbRuleTaskTag is-task${task}`}>Task {task}</span>
        ตัวอย่าง {examples.length} ประโยค
      </p>
      <ol className="wgbRuleExamples">
        {examples.map((example) => (
          <li key={example.en}>
            {example.before ? (
              <span className="wgbRuleBefore">
                {rule.beforeLabelTh || 'ประโยคก่อนหน้า'}: {example.before}
              </span>
            ) : null}
            <span className="wgbRuleEn">{highlight(example.en, example.mark)}</span>
            {example.noteTh ? <span className="wgbRuleNote">👉 {example.noteTh}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * Click-to-open rule cards under P'Doy's coach bubble. Everything starts closed so the coach
 * stays short; the learner opens a rule only when they want to see how to use it.
 *
 * It deliberately keeps no state keyed to the focused blank, so it survives the coach message
 * changing as the learner moves between blanks.
 */
export function WritingCoachRules({
  task,
  selection,
  defaultListOpen = false,
  defaultOpenRuleId = null
}: {
  task: 1 | 2
  selection: CoachRuleSelection
  /** Start with the list / one rule already open (used by the render check in the validator). */
  defaultListOpen?: boolean
  defaultOpenRuleId?: string | null
}) {
  const baseId = useId()
  const [listOpen, setListOpen] = useState(defaultListOpen)
  const [openRuleId, setOpenRuleId] = useState<string | null>(defaultOpenRuleId)

  const rules = selection.ids
    .map((id) => WRITING_COACH_RULE_BY_ID[id])
    .filter((rule): rule is CoachRule => Boolean(rule))
  if (!rules.length) return null

  // Pressing a button would normally pull focus out of the blank the learner is typing in, which
  // makes the coach forget which blank it was explaining. Keep focus where it is. (Only on the
  // buttons, so the example sentences stay selectable.)
  const keepBlankFocus = (event: MouseEvent) => event.preventDefault()

  const hasFocusRules = selection.focusIds.length > 0
  const otherTask: 1 | 2 = task === 1 ? 2 : 1

  return (
    <div className="wgbRules">
      <button
        type="button"
        className="wgbRulesToggle"
        onMouseDown={keepBlankFocus}
        aria-expanded={listOpen}
        aria-controls={`${baseId}-list`}
        onClick={() => setListOpen((open) => !open)}
      >
        <span aria-hidden="true">📖</span>
        <span className="wgbRulesToggleText">
          {hasFocusRules ? 'ดูกฎของช่องนี้ + ตัวอย่าง' : 'ดูกฎ + ตัวอย่าง'}
        </span>
        <span className="wgbRulesCount">{rules.length} กฎ</span>
        <span className="wgbRulesChevron" aria-hidden="true">
          {listOpen ? '▴' : '▾'}
        </span>
      </button>

      {listOpen ? (
        <div id={`${baseId}-list`} className="wgbRulesList">
          {rules.map((rule) => {
            const isOpen = openRuleId === rule.id
            const isFocus = selection.focusIds.includes(rule.id)
            const panelId = `${baseId}-${rule.id}`
            const own = task === 1 ? rule.task1 : rule.task2
            const other = otherTask === 1 ? rule.task1 : rule.task2
            return (
              <div key={rule.id} className={`wgbRule ${isOpen ? 'is-open' : ''} ${isFocus ? 'is-focus' : ''}`.trim()}>
                <button
                  type="button"
                  className="wgbRuleHead"
                  onMouseDown={keepBlankFocus}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenRuleId(isOpen ? null : rule.id)}
                >
                  <span className="wgbRuleIcon" aria-hidden="true">
                    {rule.icon}
                  </span>
                  <span className="wgbRuleText">
                    <strong>{rule.titleTh}</strong>
                    <small>{rule.oneLineTh}</small>
                  </span>
                  {isFocus ? <span className="wgbRuleTag">ช่องนี้</span> : null}
                  <span className="wgbRuleChevron" aria-hidden="true">
                    ▾
                  </span>
                </button>

                {isOpen ? (
                  <div id={panelId} className="wgbRuleBody" role="region" aria-label={rule.titleTh}>
                    <p className="wgbRuleSub">วิธีใช้ ทีละขั้น</p>
                    <ol className="wgbRuleSteps">
                      {rule.stepsTh.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                    {own?.length ? (
                      <ExampleList task={task} rule={rule} examples={own} />
                    ) : (
                      <p className="wgbRuleOnly">กฎนี้ใช้กับ Task {otherTask} เท่านั้น — ดูตัวอย่างด้านล่าง</p>
                    )}
                    {other?.length ? <ExampleList task={otherTask} rule={rule} examples={other} /> : null}
                    {rule.avoidTh ? <p className="wgbRuleAvoid">⚠️ {rule.avoidTh}</p> : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
