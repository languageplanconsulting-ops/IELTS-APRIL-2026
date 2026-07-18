import type { Wgb2Exercise } from '../writingTask2Builder'
import { resolveWritingTask2Builder } from '../writingTask2Builder'
import { densifyWritingTask2Exercise } from '../writingTask2QuestionDensity'
import { WGB2_EXERCISE_T2_TWE_3 } from './t2-twe-3'
import { T2_TWE_4_DENSE } from './t2-twe-4'
import { t2Twe5DenseExercise } from './t2-twe-5'
import { t2Twe6DenseExercise } from './t2-twe-6'
import { GENERAL_TRAINING_TASK2_BUILDERS } from '../writingGeneralTask2Builders'

/** Dense 50-type + 70-select overrides — take priority over sparse WGB2_EXERCISES entries. */
export const WGB2_DENSE_OVERRIDES: Wgb2Exercise[] = [
  WGB2_EXERCISE_T2_TWE_3,
  T2_TWE_4_DENSE,
  t2Twe5DenseExercise,
  t2Twe6DenseExercise
]

export const getDenseWritingTask2Builder = (promptId: string): Wgb2Exercise | null => {
  const exercise = resolveWritingTask2Builder(promptId, [
    ...WGB2_DENSE_OVERRIDES,
    ...GENERAL_TRAINING_TASK2_BUILDERS
  ])
  return exercise ? densifyWritingTask2Exercise(exercise) : null
}
