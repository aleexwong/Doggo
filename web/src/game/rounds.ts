import { Breed, fetchRandomImage, preloadImage } from './api'

export interface Round {
  answer: Breed
  choices: Breed[]
  imageUrl: string
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

/**
 * Build a round: random answer breed, a random photo of it (preloaded),
 * and 3 distinct distractors. Retries a couple of times on image failure.
 */
export async function buildRound(breeds: Breed[], attempts = 3): Promise<Round> {
  const answer = pick(breeds)
  try {
    const imageUrl = await fetchRandomImage(answer)
    await preloadImage(imageUrl)
    const distractors = shuffle(breeds.filter((b) => b.path !== answer.path)).slice(0, 3)
    return { answer, choices: shuffle([answer, ...distractors]), imageUrl }
  } catch (err) {
    if (attempts > 1) return buildRound(breeds, attempts - 1)
    throw err
  }
}
