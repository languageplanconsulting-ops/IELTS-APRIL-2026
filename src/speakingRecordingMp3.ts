const mixToMono = (buffer: AudioBuffer): Float32Array => {
  if (buffer.numberOfChannels <= 1) {
    return new Float32Array(buffer.getChannelData(0))
  }
  const left = buffer.getChannelData(0)
  const right = buffer.getChannelData(1)
  const mono = new Float32Array(left.length)
  const scale = Math.sqrt(2)
  for (let index = 0; index < left.length; index += 1) {
    mono[index] = (scale * (left[index] + right[index])) / 2
  }
  return mono
}

const waitForVideoMetadata = (video: HTMLVideoElement) =>
  new Promise<void>((resolve, reject) => {
    if (video.readyState >= 1 && Number.isFinite(video.duration)) {
      resolve()
      return
    }
    video.onloadedmetadata = () => resolve()
    video.onerror = () => reject(new Error('Could not load the recording for MP3 export.'))
  })

const extractAudioViaVideoElement = async (blob: Blob): Promise<{ samples: Float32Array; sampleRate: number }> => {
  const video = document.createElement('video')
  video.preload = 'auto'
  video.playsInline = true
  video.muted = false
  const objectUrl = URL.createObjectURL(blob)
  video.src = objectUrl

  try {
    await waitForVideoMetadata(video)
    const totalDuration = Number.isFinite(video.duration) ? video.duration : 0
    if (totalDuration <= 0) {
      throw new Error('Recording has no playable duration.')
    }

    const sampleRate = 44100
    const frameCount = Math.max(1, Math.ceil(totalDuration * sampleRate))
    const offline = new OfflineAudioContext(1, frameCount, sampleRate)
    const source = (offline as unknown as AudioContext).createMediaElementSource(video)
    source.connect(offline.destination)

    const renderedPromise = offline.startRendering()
    await video.play()
    const rendered = await renderedPromise
    video.pause()

    return { samples: mixToMono(rendered), sampleRate }
  } finally {
    video.pause()
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(objectUrl)
  }
}

const extractAudioSamplesFromBlob = async (blob: Blob): Promise<{ samples: Float32Array; sampleRate: number }> => {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextConstructor) {
    throw new Error('AudioContext is not available in this browser.')
  }

  const context = new AudioContextConstructor()
  try {
    const decoded = await context.decodeAudioData((await blob.arrayBuffer()).slice(0))
    return { samples: mixToMono(decoded), sampleRate: decoded.sampleRate }
  } catch {
    return extractAudioViaVideoElement(blob)
  } finally {
    await context.close().catch(() => undefined)
  }
}

const floatTo16BitPcm = (samples: Float32Array): Int16Array => {
  const pcm = new Int16Array(samples.length)
  for (let index = 0; index < samples.length; index += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[index]))
    pcm[index] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
  }
  return pcm
}

export const convertSpeakingRecordingToMp3 = async (blob: Blob): Promise<Blob> => {
  const { samples, sampleRate } = await extractAudioSamplesFromBlob(blob)
  if (!samples.length) {
    throw new Error('Recording has no audio samples to export.')
  }

  // `lamejs@1.2.1` ships a broken modular entry (`MPEGMode is not defined`) that
  // throws the moment we encode, so the download silently failed. The maintained
  // `@breezystack/lamejs` fork fixes the global wiring and encodes real MP3s.
  const lamejs = await import('@breezystack/lamejs')
  const Mp3Encoder =
    lamejs.Mp3Encoder ||
    (lamejs as unknown as { default?: { Mp3Encoder?: typeof lamejs.Mp3Encoder } }).default?.Mp3Encoder
  if (!Mp3Encoder) {
    throw new Error('MP3 encoder is unavailable in this browser.')
  }

  const encoder = new Mp3Encoder(1, sampleRate, 128)
  const pcm = floatTo16BitPcm(samples)
  const mp3Chunks: BlobPart[] = []
  const blockSize = 1152

  for (let offset = 0; offset < pcm.length; offset += blockSize) {
    const chunk = pcm.subarray(offset, offset + blockSize)
    const encoded = encoder.encodeBuffer(chunk)
    if (encoded.length > 0) mp3Chunks.push(new Uint8Array(encoded))
  }

  const flushed = encoder.flush()
  if (flushed.length > 0) mp3Chunks.push(new Uint8Array(flushed))

  return new Blob(mp3Chunks, { type: 'audio/mpeg' })
}
