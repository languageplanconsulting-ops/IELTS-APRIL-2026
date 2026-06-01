import type { CambridgeSpeakingTopic } from './speakingCambridge1213Data'
import {
  SPEAKING_CURATED_FULL_EXAM_TOPICS,
  SPEAKING_CURATED_PART1_TOPICS,
  SPEAKING_CURATED_PART3_TOPICS
} from './speakingCambridge1213Data'
import { LEGACY_FULL_EXAM_TOPICS } from './speakingLegacyFullExamTopics'
import { LEGACY_PART1_TOPICS, LEGACY_PART3_TOPICS } from './speakingLegacyPart13Topics'

export type SpeakingTopicRecord = CambridgeSpeakingTopic

export { SPEAKING_CURATED_PART1_TOPICS, SPEAKING_CURATED_PART3_TOPICS, SPEAKING_CURATED_FULL_EXAM_TOPICS }

export const mergeSpeakingTopicsWithRecordedSamples = (
  curated: SpeakingTopicRecord[],
  legacy: SpeakingTopicRecord[],
  hasSample: (topic: SpeakingTopicRecord) => boolean
): SpeakingTopicRecord[] => {
  const curatedIds = new Set(curated.map((topic) => topic.id))
  const extras = legacy.filter((topic) => !curatedIds.has(topic.id) && hasSample(topic))
  return [...curated, ...extras]
}

export const buildSpeakingPart1TopicBank = (hasSample: (topic: SpeakingTopicRecord) => boolean) =>
  mergeSpeakingTopicsWithRecordedSamples(SPEAKING_CURATED_PART1_TOPICS, LEGACY_PART1_TOPICS, hasSample)

export const buildSpeakingPart3TopicBank = (hasSample: (topic: SpeakingTopicRecord) => boolean) =>
  mergeSpeakingTopicsWithRecordedSamples(SPEAKING_CURATED_PART3_TOPICS, LEGACY_PART3_TOPICS, hasSample)

export const buildSpeakingFullExamTopicBank = (hasSample: (topic: SpeakingTopicRecord) => boolean) =>
  mergeSpeakingTopicsWithRecordedSamples(SPEAKING_CURATED_FULL_EXAM_TOPICS, LEGACY_FULL_EXAM_TOPICS, hasSample)
