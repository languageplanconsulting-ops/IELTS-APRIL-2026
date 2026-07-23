import assert from 'node:assert/strict'
import { assembleTask2Essay } from '../src/writingTask2Builder'
import { getDenseWritingTask2Builder } from '../src/writingTask2Dense'
import {
  getWritingTask2Prompts,
  type WritingTask2TypeId
} from '../src/writingTask2Data'

const typeIds: WritingTask2TypeId[] = [
  'to-what-extent',
  'double-question',
  'discuss-both-views',
  'advantages-disadvantages'
]

const countWords = (text: string) =>
  text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

const splitSentences = (text: string) => text.match(/[^.!?]+[.!?]+/g)?.map((sentence) => sentence.trim()) || []

const assertStarts = (promptId: string, role: string, text: string, starts: Array<string | RegExp>) => {
  const sentences = splitSentences(text)
  assert.equal(sentences.length, starts.length, `${promptId} ${role} must contain ${starts.length} pattern sentences.`)
  starts.forEach((start, index) => {
    if (typeof start === 'string') {
      assert.ok(sentences[index].startsWith(start), `${promptId} ${role} sentence ${index + 1} must start “${start}”.`)
    } else {
      assert.match(sentences[index], start, `${promptId} ${role} sentence ${index + 1} has the wrong pattern opening.`)
    }
  })
}

const QUIZZED_OPENERS = [
  'To begin with',
  'To explain it simply',
  'For example',
  'From this perspective',
  'However',
  'To put it simply',
  'For instance',
  'In this respect',
  'In conclusion',
  'Firstly',
  'Another benefit is that',
  'Another reason is that',
  'Another problem is that',
  'Another cause is that',
  'To illustrate',
  'In terms of the solutions',
  'The first solution is that',
  'The second solution is that',
  'Turning to',
  'Personally',
  'My reasoning is that',
  'The first benefit is that',
  'Another advantage is that',
  'This is because'
]

let promptCount = 0

for (const typeId of typeIds) {
  const prompts = getWritingTask2Prompts(typeId, 'general-training')
  assert.equal(prompts.length, 4, `${typeId} must contain exactly four General Training prompts.`)

  for (const prompt of prompts) {
    promptCount += 1
    assert.equal(prompt.track, 'general-training', `${prompt.id} must use the General Training track.`)
    if (typeId === 'to-what-extent') {
      assert.ok(
        prompt.questionText.endsWith('Do you agree or disagree?'),
        `${prompt.id} must use the General Training “Do you agree or disagree?” wording.`
      )
      assert.doesNotMatch(
        prompt.questionText,
        /to what extent/i,
        `${prompt.id} must not use “To what extent” in General Training.`
      )
    }
    const expectedRoles =
      typeId === 'discuss-both-views'
        ? ['intro', 'body1', 'body2', 'body3', 'conclusion']
        : ['intro', 'body1', 'body2', 'conclusion']
    assert.deepEqual(prompt.paragraphs.map((paragraph) => paragraph.role), expectedRoles, `${prompt.id} role pattern is wrong.`)

    const essay = prompt.paragraphs.map((paragraph) => paragraph.text).join(' ')
    const words = countWords(essay)
    assert.ok(words >= 250 && words <= 290, `${prompt.id} has ${words} words; expected 250–290.`)

    if (typeId === 'to-what-extent' || typeId === 'discuss-both-views') {
      const intro = prompt.paragraphs[0].text
      const sentences = intro.match(/[^.!?]+[.!?]+/g) || []
      assert.equal(sentences.length, 3, `${prompt.id} introduction must contain exactly three sentences.`)
      assert.match(
        intro,
        /^It is widely acknowledged that .+ plays an important role in .+\./,
        `${prompt.id} must use the required acknowledged/important-role opening.`
      )
      assert.match(intro, / However, /, `${prompt.id} must use However in sentence two.`)
      assert.match(
        intro,
        /I believe that .+, and the reasons will be elaborated in this essay\.$/,
        `${prompt.id} must use the required belief/reasons closing sentence.`
      )
    }

    const paragraph = (role: string) => prompt.paragraphs.find((item) => item.role === role)?.text || ''
    if (typeId === 'to-what-extent') {
      assertStarts(prompt.id, 'body1', paragraph('body1'), [
        'To begin with, it might seem reasonable for some to claim that',
        'To explain it simply, this is because',
        'For example,',
        'From this perspective, it is understandable why some people would think that'
      ])
      assertStarts(prompt.id, 'body2', paragraph('body2'), [
        'However, I would personally argue that',
        'To put it simply, this is due to the fact that',
        'For instance,',
        'In this respect, it is evident that'
      ])
    } else if (typeId === 'double-question') {
      assertStarts(prompt.id, 'body1', paragraph('body1'), [
        /^To begin with, there are a number of (benefits|reasons|problems|causes) associated with/,
        'Firstly,',
        'To explain it simply, this is because',
        'For example,',
        /^Another (benefit|reason|problem|cause) is that/,
        'To illustrate,'
      ])
      const body2 = paragraph('body2')
      if (body2.startsWith('In terms of the solutions')) {
        assertStarts(prompt.id, 'body2', body2, [
          'In terms of the solutions, I would argue that there are two main solutions.',
          'The first solution is that',
          'For example,',
          'The second solution is that',
          'For instance,'
        ])
      } else {
        assertStarts(prompt.id, 'body2', body2, [
          'Turning to',
          'Firstly,',
          'To put it simply,',
          'For instance,',
          /^Another .+ is that/,
          'To illustrate,'
        ])
      }
    } else if (typeId === 'discuss-both-views') {
      assertStarts(prompt.id, 'body1', paragraph('body1'), [
        'To begin with, it might seem reasonable for some to claim that',
        'To explain it simply, this is because',
        'For example,'
      ])
      assertStarts(prompt.id, 'body2', paragraph('body2'), [
        'However, some might argue that',
        'To put it simply, this is due to the fact that',
        'For instance,'
      ])
      assertStarts(prompt.id, 'body3', paragraph('body3'), [
        'Personally, I would argue that',
        'My reasoning is that',
        'To illustrate,'
      ])
    } else {
      assertStarts(prompt.id, 'body1', paragraph('body1'), [
        'To begin with, there are a number of benefits associated with',
        'The first benefit is that',
        'For example,',
        'Another advantage is that',
        'For instance,'
      ])
      assertStarts(prompt.id, 'body2', paragraph('body2'), [
        'However, some might be concerned regarding',
        'This is because',
        'To illustrate,',
        'However, this argument is not fully convincing given that',
        'For example,'
      ])
    }
    assertStarts(prompt.id, 'conclusion', paragraph('conclusion'), ['In conclusion, although it is undeniable that'])

    const exercise = getDenseWritingTask2Builder(prompt.id)
    assert.ok(exercise, `${prompt.id} is missing its guided builder.`)
    assert.deepEqual(
      assembleTask2Essay(exercise).map(({ role, text }) => ({ role, text })),
      prompt.paragraphs.map(({ role, text }) => ({ role, text })),
      `${prompt.id} builder must reconstruct the model essay exactly.`
    )

    const dragAnswers = exercise.steps.flatMap((step) =>
      step.segments.flatMap((segment) =>
        segment.kind === 'blank' && segment.blank.kind === 'drag' ? [segment.blank.answer] : []
      )
    )
    for (const opener of QUIZZED_OPENERS) {
      const expectedCount = prompt.paragraphs.reduce(
        (sum, item) => sum + item.text.split(opener).length - 1,
        0
      )
      const actualCount = dragAnswers.filter((answer) => answer === opener).length
      assert.equal(actualCount, expectedCount, `${prompt.id} must quiz every “${opener}” pattern opener by drag and drop.`)
    }

    for (const step of exercise.steps) {
      const blanks = step.segments.flatMap((segment) =>
        segment.kind === 'blank' ? [segment.blank] : []
      )
      const extras = blanks.filter((blank) => blank.id.includes('-density-extra-'))
      assert.equal(extras.length, 4, `${prompt.id} ${step.role} must contain four added questions.`)
      assert.equal(
        extras.filter((blank) => blank.kind === 'type').length,
        2,
        `${prompt.id} ${step.role} must add two fill-in questions.`
      )
      assert.equal(
        extras.filter((blank) => blank.kind === 'select').length,
        2,
        `${prompt.id} ${step.role} must add two multiple-choice questions.`
      )
      const minimum = step.role === 'intro' ? 10 : step.role.startsWith('body') ? 16 : 5
      assert.ok(
        blanks.length >= minimum,
        `${prompt.id} ${step.role} must contain at least ${minimum} questions.`
      )
      for (const segment of step.segments) {
        if (
          segment.kind === 'blank' &&
          (segment.blank.kind === 'select' || segment.blank.kind === 'drag') &&
          ['for example', 'for instance', 'to illustrate'].includes(
            segment.blank.answer.toLowerCase()
          )
        ) {
          const accepted = (segment.blank.acceptedAnswers ?? []).map((answer) =>
            answer.toLowerCase()
          )
          assert.ok(
            ['for example', 'for instance', 'to illustrate'].every((answer) =>
              accepted.includes(answer)
            ),
            `${segment.blank.id} must accept all three example linkers.`
          )
        }
        if (segment.kind !== 'blank' || segment.blank.kind !== 'type') continue
        const answer = segment.blank.answers[0]?.toLowerCase() || ''
        if (/^(passengers|tickets|workers|services|benefits|reasons|problems|solutions|drawbacks|advantages)$/.test(answer)) {
          assert.notEqual(segment.blank.base, answer, `${segment.blank.id} must show a singular base form.`)
        }
      }
    }
  }
}

assert.equal(promptCount, 16)
console.log('General Training Task 2 validation passed: 16 prompts, 4 per type.')
