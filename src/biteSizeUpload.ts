/**
 * Minimal TUS 1.0.0 client for browser -> Bunny Stream uploads.
 *
 * The API server mints a signature scoped to a single video guid, so the Bunny
 * API key never reaches the browser, and the file bypasses our serverless
 * function entirely (it has a small request-body cap).
 */

export type BiteSizeUploadTicket = {
  videoGuid: string
  libraryId: string
  cdnHostname: string
  tusEndpoint: string
  expiration: number
  signature: string
  title: string
}

export type BiteSizeUploadOptions = {
  ticket: BiteSizeUploadTicket
  file: File | Blob
  fileName?: string
  chunkSize?: number
  onProgress?: (percent: number, uploadedBytes: number, totalBytes: number) => void
  signal?: AbortSignal
}

const TUS_VERSION = '1.0.0'
const DEFAULT_CHUNK_BYTES = 8 * 1024 * 1024

const encodeMetadataValue = (value: string): string => {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

const buildUploadMetadata = (fileName: string, mimeType: string, title: string): string =>
  [
    `filetype ${encodeMetadataValue(mimeType || 'video/mp4')}`,
    `filename ${encodeMetadataValue(fileName)}`,
    `title ${encodeMetadataValue(title)}`
  ].join(',')

const buildTusHeaders = (ticket: BiteSizeUploadTicket): Record<string, string> => ({
  'Tus-Resumable': TUS_VERSION,
  AuthorizationSignature: ticket.signature,
  AuthorizationExpire: String(ticket.expiration),
  VideoId: ticket.videoGuid,
  LibraryId: ticket.libraryId
})

/** PATCH one chunk via XHR so we get real upload progress events. */
const patchChunk = (
  uploadUrl: string,
  chunk: Blob,
  offset: number,
  totalBytes: number,
  onProgress?: BiteSizeUploadOptions['onProgress'],
  signal?: AbortSignal
): Promise<number> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PATCH', uploadUrl, true)
    xhr.setRequestHeader('Tus-Resumable', TUS_VERSION)
    xhr.setRequestHeader('Upload-Offset', String(offset))
    xhr.setRequestHeader('Content-Type', 'application/offset+octet-stream')

    const abort = () => xhr.abort()
    signal?.addEventListener('abort', abort)

    const cleanup = () => signal?.removeEventListener('abort', abort)

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return
      const uploaded = Math.min(totalBytes, offset + event.loaded)
      onProgress(Math.round((uploaded / totalBytes) * 100), uploaded, totalBytes)
    }

    xhr.onload = () => {
      cleanup()
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`Bunny upload failed (${xhr.status}). ${xhr.responseText || ''}`.trim()))
        return
      }
      const nextOffset = Number(xhr.getResponseHeader('Upload-Offset') || 0)
      resolve(Number.isFinite(nextOffset) && nextOffset > offset ? nextOffset : offset + chunk.size)
    }

    xhr.onerror = () => {
      cleanup()
      reject(new Error('Network error while uploading to Bunny Stream.'))
    }

    xhr.onabort = () => {
      cleanup()
      reject(new DOMException('Upload cancelled', 'AbortError'))
    }

    xhr.send(chunk)
  })

export async function uploadBiteSizeVideo({
  ticket,
  file,
  fileName = 'bite-size.mp4',
  chunkSize = DEFAULT_CHUNK_BYTES,
  onProgress,
  signal
}: BiteSizeUploadOptions): Promise<{ videoGuid: string }> {
  const totalBytes = file.size
  if (!totalBytes) throw new Error('That file looks empty.')

  const createResponse = await fetch(ticket.tusEndpoint, {
    method: 'POST',
    headers: {
      ...buildTusHeaders(ticket),
      'Upload-Length': String(totalBytes),
      'Upload-Metadata': buildUploadMetadata(fileName, file.type, ticket.title)
    },
    signal
  })

  if (createResponse.status !== 201) {
    const detail = await createResponse.text().catch(() => '')
    throw new Error(
      `Bunny would not start the upload (${createResponse.status}). ${detail}`.trim()
    )
  }

  const location = createResponse.headers.get('Location') || createResponse.headers.get('location')
  if (!location) throw new Error('Bunny did not return an upload URL.')
  const uploadUrl = new URL(location, ticket.tusEndpoint).toString()

  onProgress?.(0, 0, totalBytes)

  let offset = 0
  while (offset < totalBytes) {
    if (signal?.aborted) throw new DOMException('Upload cancelled', 'AbortError')
    const chunk = file.slice(offset, Math.min(offset + chunkSize, totalBytes))
    offset = await patchChunk(uploadUrl, chunk, offset, totalBytes, onProgress, signal)
  }

  onProgress?.(100, totalBytes, totalBytes)
  return { videoGuid: ticket.videoGuid }
}

/** Grabs a single frame from a local file so the cover picker can preview it. */
export function captureLocalVideoFrame(video: HTMLVideoElement): string | null {
  if (!video.videoWidth || !video.videoHeight) return null
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const context = canvas.getContext('2d')
  if (!context) return null
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  try {
    return canvas.toDataURL('image/jpeg', 0.82)
  } catch {
    return null
  }
}
