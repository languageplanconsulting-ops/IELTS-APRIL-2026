import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { auditReadingQuestionDisplayPlan } from '../src/readingQuestionDisplay.ts'

const issues = []

for (let stage = 1; stage <= 20; stage++) {
  const exam = buildIntensiveJourneyExam(stage)
  if (!exam?.parsedPayload?.passages) continue
  for (const passage of exam.parsedPayload.passages) {
    const { issues: passageIssues } = auditReadingQuestionDisplayPlan(
      passage,
      passage.questions || [],
      `journey-stage-${stage}`
    )
    for (const issue of passageIssues) {
      if (issue.kind !== 'mcq-no-options') continue
      const q = passage.questions?.find((item) => item.number === issue.question)
      const group = q?.answerGroup || ''
      if (!/Choose the correct letter/i.test(group) && !/Choose the correct letter/i.test(passage.questionSectionText || '')) {
        continue
      }
      issues.push(`Stage ${stage} P${passage.number} Q${issue.question}: ${issue.kind} — ${issue.detail || ''}`)
    }
  }
}

console.log(issues.length ? issues.join('\n') : 'OK: no standard MCQ missing option text (stages 1–20)')
process.exit(issues.length ? 1 : 0)
