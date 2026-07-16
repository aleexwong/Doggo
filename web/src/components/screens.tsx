import { useEffect, useState } from 'react'
import { GameState, Mode, BLITZ_SECONDS } from '../game/state'

export function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1400)
    return () => clearTimeout(id)
  }, [onDone])
  return (
    <div className="screen boot" onClick={onDone}>
      <div className="boot-logo" aria-hidden="true">🐶</div>
      <div className="boot-name">Doggo</div>
    </div>
  )
}

export function HomeScreen({
  bestStreak,
  bestBlitz,
  onStart,
}: {
  bestStreak: number
  bestBlitz: number
  onStart: (mode: Mode) => void
}) {
  return (
    <div className="screen home">
      <div className="boot-logo" aria-hidden="true">🐶</div>
      <h1>Doggo</h1>
      <p className="tagline">How many dog breeds can you name?</p>
      <button className="primary" onClick={() => onStart('streak')}>
        ▶ Endless Streak
        {bestStreak > 0 && <span className="best">best {bestStreak}</span>}
      </button>
      <button className="primary blitz" onClick={() => onStart('blitz')}>
        ⏱ {BLITZ_SECONDS}s Blitz
        {bestBlitz > 0 && <span className="best">best {bestBlitz}</span>}
      </button>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="screen loading" role="status" aria-label="Loading">
      <div className="paw-spinner" aria-hidden="true">🐾</div>
      <p>Fetching good dogs…</p>
    </div>
  )
}

export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="screen error">
      <div className="boot-logo" aria-hidden="true">💤</div>
      <p>The dogs are napping.</p>
      <p className="tagline">Couldn't reach the dog photo service.</p>
      <button className="primary" onClick={onRetry}>Try again</button>
    </div>
  )
}

function streakTitle(n: number): string {
  if (n >= 25) return 'Legendary Dog Whisperer 🏆'
  if (n >= 10) return 'Certified Dog Expert 🐾'
  if (n >= 5) return 'Good Human! 🦴'
  return ''
}

export function GameOverScreen({
  state,
  onPlayAgain,
  onHome,
}: {
  state: GameState
  onPlayAgain: () => void
  onHome: () => void
}) {
  const [copied, setCopied] = useState(false)
  const isStreak = state.mode === 'streak'
  const result = isStreak ? state.score : state.score
  const share = async () => {
    const text = isStreak
      ? `I identified ${result} dog breeds in a row on Doggo 🐶 ${location.href}`
      : `I identified ${result} dog breeds in ${BLITZ_SECONDS} seconds on Doggo 🐶 ${location.href}`
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }
    } catch {
      /* user cancelled or clipboard blocked */
    }
  }
  return (
    <div className="screen gameover">
      <h2>{isStreak ? 'Streak over!' : "Time's up!"}</h2>
      <div className="final-score">{result}</div>
      <p className="tagline">
        {isStreak ? 'breeds in a row' : 'breeds identified'}
      </p>
      {streakTitle(result) && <p className="title-earned">{streakTitle(result)}</p>}
      <p className="best-line">
        Best: {isStreak ? state.bestStreak : state.bestBlitz}
      </p>
      <button className="primary" onClick={onPlayAgain}>Play again</button>
      <div className="row">
        <button onClick={share}>{copied ? 'Copied!' : 'Share score'}</button>
        <button onClick={onHome}>Home</button>
      </div>
    </div>
  )
}
