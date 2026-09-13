import type { GardenDoc } from './types'

// All requests go through the app's own admin API, which talks to Supabase with
// the service-role key. The browser only ever holds the admin access token.
function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export async function loadGarden(token: string): Promise<GardenDoc | null> {
  const res = await fetch('/api/admin/idea-garden', { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`Could not load garden (${res.status})`)
  const data = await res.json()
  return (data?.garden as GardenDoc) || null
}

export async function saveGarden(token: string, garden: GardenDoc): Promise<GardenDoc> {
  const res = await fetch('/api/admin/idea-garden', {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ garden })
  })
  if (!res.ok) throw new Error(`Could not save garden (${res.status})`)
  const data = await res.json()
  return data.garden as GardenDoc
}

export type UploadedFile = {
  path: string
  name: string
  type: string
  size: number
  url: string
}

export async function uploadFile(token: string, file: File): Promise<UploadedFile> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/admin/idea-garden/file', {
    method: 'POST',
    headers: authHeaders(token),
    body: form
  })
  if (!res.ok) throw new Error(`Could not upload file (${res.status})`)
  return (await res.json()) as UploadedFile
}

// Fetch a fresh signed URL for a stored attachment (signed URLs expire).
export async function signFile(token: string, path: string): Promise<string> {
  const res = await fetch(`/api/admin/idea-garden/file?path=${encodeURIComponent(path)}`, {
    headers: authHeaders(token)
  })
  if (!res.ok) throw new Error(`Could not open file (${res.status})`)
  const data = await res.json()
  return String(data?.url || '')
}
