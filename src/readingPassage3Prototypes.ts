import type { ReadingPassagePrototype } from './readingPassage1Prototypes'

export type ReadingPassage3Prototype = ReadingPassagePrototype & {
  questionTypes: string[]
  requirements: string
}

export const READING_PASSAGE_3_PROTOTYPE_PATTERN_NOTES = `Passage 3 prototype pattern:
- Length is usually about 850-1,100 words, with 7-10 developed paragraphs, or 7 labelled sections (A-G) when matching-information questions are used.
- Tone is IELTS Academic high difficulty: argumentative, evaluative, abstract, and conceptually dense. It often presents a debate, competing expert views, research findings, unintended consequences, or a shift from old assumptions to a more nuanced conclusion.
- Paragraphs should not merely list facts. Each paragraph needs a reasoning function: framing a dilemma, describing evidence, interpreting an experiment, presenting a counterargument, showing implications, or qualifying an earlier claim.
- Question numbers run 27-40. Common mixes are:
  - Multiple Choice + Matching Sentence Endings + YES/NO/NOT GIVEN.
  - YES/NO/NOT GIVEN + Summary Completion with word bank + Multiple Choice.
  - Matching Experts/Features + Matching Sentence Endings + Multiple Choice.
  - Matching Information + Matching People/Features + ONE WORD ONLY summary completion.
- Good Passage 3 models test writer claims, implications, paragraph purpose, expert stance, and logical relationships. Avoid Passage 1-style scanning unless it is part of a final summary completion set.
- Distractors should be intelligent: true details answering the wrong question, extreme versions of qualified claims, real-world facts not claimed by the writer, or paraphrases attached to the wrong expert/paragraph.
- Keep the final paragraph rhetorically useful. It should resolve the debate, show a broader implication, or offer a cautious optimistic/negative conclusion.`

export const READING_PASSAGE_3_PROTOTYPES: ReadingPassage3Prototype[] = [
  {
    id: 'stress-judgement-research-model',
    title: 'Passage 3 Model 1 - Research argument with behavioural experiments',
    questionTypes: ['multiple-choice', 'matching-sentence-endings', 'yes-no-not-given'],
    requirements: [
      'Model shape: a research-led argument that begins with a universal decision-making dilemma, then introduces field and lab experiments.',
      'Use 9-10 unlettered paragraphs. Move from everyday problem, to research design, to findings, to brain/physiological mechanism, to modern social implications.',
      'Question mix: 4 Multiple Choice questions on paragraph purpose and writer point; 5 Matching Sentence Endings questions on experiment findings; 5 YES/NO/NOT GIVEN questions on claims and implications.',
      'Make the science readable but conceptually hard: include perceived threat, unexpected evidence, physiological switching, contagion of emotion, and collective behaviour.',
      'The hardest traps should distinguish what the writer claims from what could be true in real life.'
    ].join('\n'),
    text: `READING PASSAGE 3 MODEL
Research argument with behavioural experiments

Use this as a structural model only. Generate a completely new topic.

Paragraph pattern:
1. Open with a universal problem: people must make important judgements under pressure, uncertainty, or changing information.
2. Introduce the researchers and explain why a real-world group with fluctuating pressure levels is an ideal study population.
3. State the headline finding in a compact, surprising way.
4. Describe the field-study methodology clearly enough for questions about methodology.
5. Compare relaxed and stressed behaviour, emphasizing a change in response to negative information while positive information remains similar.
6. Add a lab replication with a different participant group and a manufactured stressor.
7. Explain the brain or physiological mechanism behind the behavioural switch.
8. Give an evolutionary or historical reason why the mechanism could once have been useful, then qualify it with a modern downside.
9. Explain how emotional states spread socially, including through online information.
10. End with a broader public consequence and a constructive conclusion.

Question pattern:
Questions 27-30: Multiple Choice, A-D. Test writer purpose, why the study population was suitable, what a paragraph is doing, and what the brain mechanism causes.
Questions 31-35: Matching Sentence Endings, A-G. Test the experimental findings and the condition under which negative information is processed better.
Questions 36-40: YES/NO/NOT GIVEN. Test social contagion, technology/stress claims, public-event overreaction, unnecessary precautions, and possible positive use.`
  },
  {
    id: 'technology-judgement-in-sport-model',
    title: 'Passage 3 Model 2 - Technology, judgement, and human discretion',
    questionTypes: ['yes-no-not-given', 'summary-completion', 'multiple-choice'],
    requirements: [
      'Model shape: a discursive argument about a new technology replacing a human judgement call in a cultural or professional activity.',
      'Use 8-9 unlettered paragraphs. Start with a concrete incident, then explain the old human judgement, the controversy, official justification, objections, proposed system-level benefits, comparison with related technologies, and a reflective ending.',
      'Question mix: 6 YES/NO/NOT GIVEN questions; 5 Summary Completion questions with a phrase/word-bank list; 3 Multiple Choice questions on implication and author purpose.',
      'The core tension must be accuracy versus human discretion, not simply old versus new.',
      'Include quotes from at least three stakeholders: an official/administrator, a practitioner, and a critic.'
    ].join('\n'),
    text: `READING PASSAGE 3 MODEL
Technology, judgement, and human discretion

Use this as a structural model only. Generate a completely new topic.

Paragraph pattern:
1. Begin with a vivid first use of a technological system that takes over a judgement previously made by a person.
2. Explain the rule, boundary, or judgement being automated, including why it was historically subjective.
3. Show how disputes, rituals, or traditions used to surround that judgement.
4. Present official claims for the system: consistency, accuracy, reduced controversy, future flexibility.
5. Present a practitioner objection: the system works as designed but feels unforgiving, overly precise, or culturally damaging.
6. Explain the administrator's larger strategic reason for adopting the technology.
7. Show how the technology allows future rule changes that were previously hard to implement.
8. Compare with similar technologies in other fields, while explaining why this case is less straightforward.
9. Finish with critics who argue that perfection may remove some of the pleasure, meaning, or human texture of the activity.

Question pattern:
Questions 27-32: YES/NO/NOT GIVEN. Test whether the system shared decisions, whether amendments were made, whether money/accuracy is justified, whether a trend increased excitement, whether internal debate occurred, and whether shape/rule changes are feasible.
Questions 33-37: Summary Completion with A-H options. Summarize the old human judgement role and the first technology-assisted event.
Questions 38-40: Multiple Choice, A-D. Test what the writer suggests, the administrator's reason, and why critic views are included.`
  },
  {
    id: 'expert-panel-robotics-model',
    title: 'Passage 3 Model 3 - Expert panel on future technology ethics',
    questionTypes: ['matching-features', 'matching-sentence-endings', 'multiple-choice'],
    requirements: [
      'Model shape: a multi-expert Q&A passage where three named experts answer four big questions about technology, ethics, risk, and fiction/future thinking.',
      'Use 11-13 compact unlettered paragraphs. Organize the passage by question rather than by expert biography.',
      'Question mix: 7 Matching Features/Experts questions; 3 Matching Sentence Endings questions comparing pairs of experts; 4 Multiple Choice questions on one expert’s argument and the function of a comment.',
      'Each expert must have a distinct intellectual style and a recurring stance, so matching questions require tracking viewpoints across the passage.',
      'Include overlap and disagreement between experts. At least two questions should require comparing two experts, not merely identifying one quote.'
    ].join('\n'),
    text: `READING PASSAGE 3 MODEL
Expert panel on future technology ethics

Use this as a structural model only. Generate a completely new topic.

Paragraph pattern:
1. Introduce three experts from different disciplines and the broad theme.
2-4. Question 1: each expert responds to a practical/ethical use of technology or science.
5-7. Question 2: each expert responds to when or whether a future capability may exceed human ability.
8-10. Question 3: each expert responds to whether society should fear the advance.
11-13. Question 4: each expert responds to what speculative fiction, imagination, or public narratives can teach us.

Expert design:
- Expert A: cautious, cosmic/long-term, worried about control and future autonomy.
- Expert B: empirical and practical, distinguishes narrow technical ability from full human intelligence, usually weighs benefit against harm.
- Expert C: social/ethical, argues that fear often comes from human projection, language, power, or cultural assumptions.

Question pattern:
Questions 27-33: Match statements with Expert A, B, or C. Use any letter more than once.
Questions 34-36: Match sentence endings A-D. Require comparisons such as A and C share a view on ethics, A and B share a view on current limits, B disagrees with C about existing harm.
Questions 37-40: Multiple Choice, A-D. Test a subtle claim from one expert, a concern from another, the emphasis in a science-fiction answer, and the purpose of a reality/fantasy comment.`
  },
  {
    id: 'conservation-intervention-model',
    title: 'Passage 3 Model 4 - Labelled conservation intervention with trade-offs',
    questionTypes: ['matching-information', 'matching-features', 'summary-completion'],
    requirements: [
      'Model shape: a labelled, seven-section conservation/science passage about a traditional method being revived for a new role, with strong evidence and ecological trade-offs.',
      'Use paragraphs A-G. Move from historical background, to how the method works, to evidence of success, to conservation benefits, to doubts about self-reported evidence, to unintended ecological costs, to cautious optimism.',
      'Question mix: 5 Matching Information questions; 5 Matching People/Features questions; 4 ONE WORD ONLY Summary Completion questions.',
      'The labelled paragraphs must each have a distinct function so matching-information questions are fair but not obvious.',
      'The final summary completion should focus on unintended effects and require exact one-word answers from one or two late paragraphs.'
    ].join('\n'),
    text: `READING PASSAGE 3 MODEL
Labelled conservation intervention with trade-offs

Use this as a structural model only. Generate a completely new topic.

Paragraph pattern:
A. Historical background: a traditional practice declined, then unexpectedly returned because conditions changed.
B. Mechanism and training: explain exactly how the method works and why training must be specific.
C. Evidence of effectiveness: cite two studies or regions and include positive statistics plus a researcher quote.
D. New conservation role: explain how reducing one conflict can protect a threatened species or ecosystem.
E. Methodological caution: self-reports may be unreliable, and limited adoption may move the problem elsewhere.
F. Unintended ecological effects: protecting one species may harm another; include disease, competition, food, or behavioural impacts.
G. Balanced conclusion: consequences are not always negative; give an unexpected benefit and a cautious optimistic future.

Question pattern:
Questions 27-31: Matching Information, paragraphs A-G. Include NB that letters may be used more than once.
Questions 32-36: Matching People/Features, A-E. Match paraphrased claims to named people.
Questions 37-40: ONE WORD ONLY summary completion. Focus on unintended ecological effects and a possible benefit.`
  }
]
