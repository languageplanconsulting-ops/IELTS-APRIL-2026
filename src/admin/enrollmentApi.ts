import { useCallback, useEffect, useState } from 'react'
import { EMPTY_RECORDS, type EnrollmentPackage, type EnrollmentRecords, type LearnerEnrollmentRecord } from './enrollment'

export type ApiRecord = Record<string, unknown>

export const enrollmentApi = async <T,>(url: string, token: string, init: { method?: string; body?: unknown } = {}): Promise<T> => {
  const response = await fetch(url, {
    method: init.method || 'GET',
    headers: { Authorization: `Bearer ${token}`, ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload?.error?.message || payload?.message || 'Something went wrong.')
  return payload as T
}

export const toEnrollmentRecords = (payload: ApiRecord | null | undefined): EnrollmentRecords => ({
  packages: Array.isArray(payload?.packages) ? (payload?.packages as EnrollmentPackage[]) : [],
  learners: (payload?.learners as Record<string, LearnerEnrollmentRecord>) || {},
  dismissed: (payload?.dismissed as Record<string, string>) || {}
})

/** Packages, history and dismissed inbox items, loaded once for the Learners page. */
export function useEnrollmentRecords(accessToken: string) {
  const [records, setRecords] = useState<EnrollmentRecords>(EMPTY_RECORDS)
  const [error, setError] = useState('')
  const reload = useCallback(async () => {
    if (!accessToken) return
    try {
      setRecords(toEnrollmentRecords(await enrollmentApi<ApiRecord>('/api/admin/enrollment', accessToken)))
      setError('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load packages.')
    }
  }, [accessToken])
  useEffect(() => {
    queueMicrotask(() => void reload())
  }, [reload])
  return { records, setRecords, reload, error }
}

