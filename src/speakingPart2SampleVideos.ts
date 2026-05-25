export type SpeakingPart2SampleVideo = {
  id: string
  shortLabel: string
  topicLabel: string
  driveFileId?: string
  videoUrl?: string
  sourceLabel?: string
  uploadedAt?: string
  trimStartSeconds?: number
  trimEndSeconds?: number
  transcript?: string
  subtitles?: SpeakingPart2SampleSubtitleCue[]
  subtitleStyle?: SpeakingPart2SampleSubtitleStyle
  videoFlipHorizontal?: boolean
  topicIds: string[]
  matchPatterns: RegExp[]
}

export type SpeakingPart2SampleSubtitleCue = {
  id: string
  startSeconds: number
  endSeconds: number
  text: string
  notes?: SpeakingPart2SampleSubtitleNote[]
}

export type SpeakingPart2SampleSubtitleNote = {
  id: string
  phrase: string
  detail?: string
  kind?: 'vocabulary' | 'grammar'
  partOfSpeech?: string
  thaiMeaning?: string
  grammarRule?: string
  exampleSentence?: string
}

export type SpeakingPart2SampleSubtitleStyle = {
  fontFamily?: string
  textColor?: string
  backgroundColor?: string
  fontSize?: number
  boxWidthPercent?: number
  verticalPositionPercent?: number
  horizontalPositionPercent?: number
  textAlign?: 'left' | 'center' | 'right'
  videoFlipHorizontal?: boolean
}

export const SPEAKING_PART2_SAMPLE_VIDEOS: SpeakingPart2SampleVideo[] = [
  {
    id: 'building',
    shortLabel: 'Building',
    topicLabel: 'Describe a building that you particularly like',
    driveFileId: '1BpAe7PqfE3ZiyvCtFh2vOYs5izQhy9X4',
    topicIds: ['building-like'],
    matchPatterns: [/\bbuilding\b/i, /\barchitecture\b/i]
  },
  {
    id: 'old-person',
    shortLabel: 'Old person',
    topicLabel: 'Describe an old person that you know',
    driveFileId: '1fhhUfVsTWGSvHFethJ9O8ALnr7ETUsuR',
    topicIds: ['person-old'],
    matchPatterns: [/\bold person\b/i, /\belderly\b/i, /\bolder person\b/i]
  },
  {
    id: 'workplace',
    shortLabel: 'Visit workplace',
    topicLabel: 'Describe a time when you visited someone at their workplace',
    driveFileId: '1trPqLOe58PUm6WLQkqBRhb06CftQ0tc3',
    topicIds: ['cam12-t1-p2'],
    matchPatterns: [/\bworkplace\b/i, /visited.*workplace/i, /visit.*workplace/i]
  }
]

export type SpeakingPart2TopicRef = {
  id: string
  title?: string
  prompt?: string
}

export const getSpeakingPart2SampleEmbedUrl = (fileId: string) =>
  `https://drive.google.com/file/d/${fileId}/preview`

export const getSpeakingPart2SampleThumbUrl = (fileId: string) =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w960`

export const createUploadedSpeakingPart2SampleVideo = ({
  topicId,
  topicTitle,
  videoUrl,
  uploadedAt,
  trimStartSeconds,
  trimEndSeconds,
  transcript,
  subtitles,
  subtitleStyle,
  videoFlipHorizontal
}: {
  topicId: string
  topicTitle: string
  videoUrl: string
  uploadedAt?: string
  trimStartSeconds?: number
  trimEndSeconds?: number
  transcript?: string
  subtitles?: SpeakingPart2SampleSubtitleCue[]
  subtitleStyle?: SpeakingPart2SampleSubtitleStyle
  videoFlipHorizontal?: boolean
}): SpeakingPart2SampleVideo => ({
  id: `uploaded-${topicId}`,
  shortLabel: 'Admin sample',
  topicLabel: topicTitle,
  videoUrl,
  sourceLabel: 'Uploaded admin sample',
  uploadedAt,
  trimStartSeconds,
  trimEndSeconds,
  transcript,
  subtitles,
  subtitleStyle,
  videoFlipHorizontal: Boolean(videoFlipHorizontal || subtitleStyle?.videoFlipHorizontal),
  topicIds: [topicId],
  matchPatterns: []
})

export const resolveSpeakingPart2SampleVideo = (topic: SpeakingPart2TopicRef): SpeakingPart2SampleVideo | null => {
  const haystack = `${topic.id} ${topic.title || ''} ${topic.prompt || ''}`.trim()
  const byId = SPEAKING_PART2_SAMPLE_VIDEOS.find((sample) => sample.topicIds.includes(topic.id))
  if (byId) return byId
  return (
    SPEAKING_PART2_SAMPLE_VIDEOS.find((sample) => sample.matchPatterns.some((pattern) => pattern.test(haystack))) ||
    null
  )
}

export const topicHasSpeakingPart2Sample = (topic: SpeakingPart2TopicRef) =>
  Boolean(resolveSpeakingPart2SampleVideo(topic))
