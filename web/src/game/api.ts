const API = 'https://dog.ceo/api'
const FETCH_TIMEOUT_MS = 8000

const get = (url: string) => fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })

export interface Breed {
  /** API path, e.g. "hound/afghan" or "pug" */
  path: string
  /** Display name, e.g. "Afghan Hound" */
  name: string
}

// Small bundled fallback so the answer grid never breaks if the
// breed-list request fails. Images are still fetched per-round.
const FALLBACK_BREEDS: [string, string][] = [
  ['pug', 'Pug'],
  ['husky', 'Husky'],
  ['beagle', 'Beagle'],
  ['boxer', 'Boxer'],
  ['dalmatian', 'Dalmatian'],
  ['chihuahua', 'Chihuahua'],
  ['pomeranian', 'Pomeranian'],
  ['rottweiler', 'Rottweiler'],
  ['retriever/golden', 'Golden Retriever'],
  ['retriever/chesapeake', 'Chesapeake Retriever'],
  ['bulldog/french', 'French Bulldog'],
  ['bulldog/english', 'English Bulldog'],
  ['terrier/border', 'Border Terrier'],
  ['terrier/scottish', 'Scottish Terrier'],
  ['sheepdog/shetland', 'Shetland Sheepdog'],
  ['germanshepherd', 'German Shepherd'],
  ['corgi/cardigan', 'Cardigan Corgi'],
  ['shiba', 'Shiba'],
  ['samoyed', 'Samoyed'],
  ['stbernard', 'St Bernard'],
]

// Breeds whose photos test badly (ambiguous / frequently mislabeled).
const DENYLIST = new Set<string>(['mix'])

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function displayName(breed: string, sub?: string): string {
  const b = cap(breed)
  return sub ? `${cap(sub)} ${b}` : b
}

export async function fetchBreeds(): Promise<Breed[]> {
  try {
    const res = await get(`${API}/breeds/list/all`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: { message: Record<string, string[]> } = await res.json()
    const breeds: Breed[] = []
    for (const [breed, subs] of Object.entries(data.message)) {
      if (DENYLIST.has(breed)) continue
      if (subs.length === 0) {
        breeds.push({ path: breed, name: displayName(breed) })
      } else {
        for (const sub of subs) {
          breeds.push({ path: `${breed}/${sub}`, name: displayName(breed, sub) })
        }
      }
    }
    return breeds.length >= 4 ? breeds : fallbackBreeds()
  } catch {
    return fallbackBreeds()
  }
}

function fallbackBreeds(): Breed[] {
  return FALLBACK_BREEDS.map(([path, name]) => ({ path, name }))
}

export async function fetchRandomImage(breed: Breed): Promise<string> {
  const res = await get(`${API}/breed/${breed.path}/images/random`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: { message: string } = await res.json()
  return data.message
}

/** Preload an image URL; resolves when it's in the browser cache. */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const timer = setTimeout(() => reject(new Error('image timeout')), FETCH_TIMEOUT_MS)
    img.onload = () => { clearTimeout(timer); resolve() }
    img.onerror = () => { clearTimeout(timer); reject(new Error('image failed')) }
    img.src = url
  })
}
