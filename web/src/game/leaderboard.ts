import { Mode } from './state'

// Reuses the original Doggo Android app's Firebase project. These values are
// public client identifiers (already shipped in the APK / repo); access
// control lives in Firestore security rules.
const PROJECT_ID = (import.meta.env.VITE_FB_PROJECT_ID as string) || 'doggo-bcit'
const API_KEY = (import.meta.env.VITE_FB_API_KEY as string) || 'AIzaSyBa3fhD0u6wbHOS2rXA5El9juum1e6Ai8I'

const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`
const TIMEOUT_MS = 8000

// One collection per mode: keeps queries on a single auto-indexed field
// (score), so no composite index is required.
const collection = (mode: Mode) => `web_leaderboard_${mode}`

export interface Entry {
  name: string
  score: number
}

export const NAME_MIN = 2
export const NAME_MAX = 16

export function validName(name: string): boolean {
  const n = name.trim()
  return n.length >= NAME_MIN && n.length <= NAME_MAX
}

export async function submitScore(mode: Mode, name: string, score: number): Promise<void> {
  const res = await fetch(`${BASE}/${collection(mode)}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      fields: {
        name: { stringValue: name.trim().slice(0, NAME_MAX) },
        score: { integerValue: String(score) },
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
  })
  if (!res.ok) throw new Error(`submit failed: HTTP ${res.status}`)
}

export async function fetchTop(mode: Mode, limit = 10): Promise<Entry[]> {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection(mode) }],
          orderBy: [{ field: { fieldPath: 'score' }, direction: 'DESCENDING' }],
          limit,
        },
      }),
    },
  )
  if (!res.ok) throw new Error(`query failed: HTTP ${res.status}`)
  const rows: { document?: { fields?: Record<string, { stringValue?: string; integerValue?: string }> } }[] =
    await res.json()
  return rows
    .filter((r) => r.document?.fields)
    .map((r) => ({
      name: r.document!.fields!.name?.stringValue ?? 'anon',
      score: Number(r.document!.fields!.score?.integerValue ?? 0),
    }))
}

const NICK_KEY = 'doggo.nickname'
export const loadNickname = () => localStorage.getItem(NICK_KEY) ?? ''
export const saveNickname = (n: string) => localStorage.setItem(NICK_KEY, n.trim())
