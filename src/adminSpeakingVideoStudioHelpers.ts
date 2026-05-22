export type AdminVideoStudioStep = 'setup' | 'record' | 'review' | 'subtitles' | 'publish'
export type AdminVideoPreviewMode = 'student' | 'source' | 'trimmed' | 'noSubtitles' | 'styledSubtitles'
export type AdminResponsivePreviewMode = 'desktop' | 'tablet' | 'mobile'

export const ADMIN_VIDEO_STUDIO_STEPS: Array<{
  id: AdminVideoStudioStep
  label: string
  description: string
}> = [
  { id: 'setup', label: 'Setup', description: 'Topic & devices' },
  { id: 'record', label: 'Record', description: 'Capture your take' },
  { id: 'review', label: 'Review', description: 'Trim & preview' },
  { id: 'subtitles', label: 'Subtitles', description: 'Captions & style' },
  { id: 'publish', label: 'Publish', description: 'Save & upload' }
]

export const getAdminVideoStatusLabel = (
  status: 'idle' | 'recording' | 'preview' | 'uploading',
  countdown: number | null
) => {
  if (countdown !== null && countdown > 0) return `Starting in ${countdown}…`
  switch (status) {
    case 'recording':
      return 'Recording…'
    case 'preview':
      return 'Review your take'
    case 'uploading':
      return 'Uploading…'
    default:
      return 'Ready to record'
  }
}

export const shouldEnforceTrimInPreview = (mode: AdminVideoPreviewMode) => mode !== 'source'

export const shouldShowSubtitleOverlay = (
  mode: AdminVideoPreviewMode,
  hasCue: boolean,
  hasVideo: boolean
) =>
  Boolean(hasVideo && hasCue) &&
  mode !== 'source' &&
  mode !== 'noSubtitles' &&
  mode !== 'trimmed'

export const getPreviewModeDescription = (mode: AdminVideoPreviewMode) => {
  switch (mode) {
    case 'student':
      return 'How learners see it — trim + styled captions'
    case 'source':
      return 'Full raw recording — no trim, no captions'
    case 'trimmed':
      return 'Trimmed playback only — no captions'
    case 'noSubtitles':
      return 'Trimmed video without captions'
    case 'styledSubtitles':
      return 'Trim + captions with your style settings'
    default:
      return ''
  }
}

export type UploadChecklistItem = {
  id: string
  label: string
  ok: boolean
  hint?: string
}

export const buildUploadChecklist = (input: {
  hasVideo: boolean
  trimDuration: number
  subtitleCount: number
  timingIssues: { overlaps: number; outsideTrim: number }
  qualityIssues: { longLines: number; tooFast: number }
  previewedAsStudent: boolean
  editMode: 'fresh' | 'existing'
}): UploadChecklistItem[] => [
  {
    id: 'video',
    label: input.hasVideo ? 'Video ready' : 'Record or load a video',
    ok: input.hasVideo,
    hint: input.hasVideo ? undefined : 'Complete the Record step first.'
  },
  {
    id: 'trim',
    label: input.trimDuration >= 5 ? `Trim segment (${Math.round(input.trimDuration)}s)` : 'Valid trim segment (min 5s)',
    ok: input.trimDuration >= 5,
    hint: 'Adjust start/end so the sample is at least 5 seconds.'
  },
  {
    id: 'subtitles',
    label: input.subtitleCount > 0 ? `${input.subtitleCount} subtitle lines` : 'Subtitles recommended',
    ok: input.subtitleCount > 0,
    hint: 'Use free local auto-sync or add lines manually.'
  },
  {
    id: 'timing',
    label:
      input.timingIssues.overlaps === 0 && input.timingIssues.outsideTrim === 0
        ? 'Subtitle timing looks good'
        : 'Fix subtitle timing issues',
    ok: input.timingIssues.overlaps === 0 && input.timingIssues.outsideTrim === 0,
    hint: 'Use Fix gaps / overlaps or Align to trim start.'
  },
  {
    id: 'quality',
    label:
      input.qualityIssues.longLines === 0 && input.qualityIssues.tooFast === 0
        ? 'Readable caption pace'
        : 'Some captions may be hard to read',
    ok: input.qualityIssues.longLines === 0 && input.qualityIssues.tooFast <= 2,
    hint: 'Try Shorten lines or Balance timing.'
  },
  {
    id: 'preview',
    label: input.previewedAsStudent ? 'Previewed as student' : 'Preview as student (recommended)',
    ok: input.previewedAsStudent,
    hint: 'Open full-screen student preview before publishing.'
  }
]

export const canPublishFromChecklist = (items: UploadChecklistItem[]) =>
  items.filter((item) => item.id === 'video' || item.id === 'trim').every((item) => item.ok)

export const adminStudioStepRequiresVideo = (step: AdminVideoStudioStep) =>
  step === 'review' || step === 'subtitles' || step === 'publish'

export const canAccessAdminStudioStep = (step: AdminVideoStudioStep, hasVideo: boolean) =>
  !adminStudioStepRequiresVideo(step) || hasVideo
