import { useEffect, useState } from 'react'
import { GameState, Mode, BLITZ_SECONDS } from '../game/state'
import { AppBar } from './PhoneFrame'

export function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1400)
    return () => clearTimeout(id)
  }, [onDone])
  return (
    <div className="screen boot" onClick={onDone}>
      <div className="boot-logo" aria-hidden="true">🐶</div>
      <div className="boot-name">Doggo</div>
      <div className="boot-sub">by alex wong</div>
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
    <div className="app-shell">
      <AppBar title="Doggo" />
      <div className="screen home">
        <div className="hero">
          <div className="hero-avatar" aria-hidden="true">🐶</div>
          <h1>Guess the breed!</h1>
          <p className="tagline">A photo appears — you have four choices.</p>
        </div>
        <button className="mode-card" onClick={() => onStart('streak')}>
          <span className="mode-icon streak-icon" aria-hidden="true">🔥</span>
          <span className="mode-text">
            <span className="mode-name">Endless Streak</span>
            <span className="mode-desc">Play until you miss</span>
          </span>
          <span className="mode-best">{bestStreak > 0 ? `Best ${bestStreak}` : 'New'}</span>
        </button>
        <button className="mode-card" onClick={() => onStart('blitz')}>
          <span className="mode-icon blitz-icon" aria-hidden="true">⏱</span>
          <span className="mode-text">
            <span className="mode-name">{BLITZ_SECONDS}s Blitz</span>
            <span className="mode-desc">Beat the clock</span>
          </span>
          <span className="mode-best">{bestBlitz > 0 ? `Best ${bestBlitz}` : 'New'}</span>
        </button>
        <p className="home-footnote">Photos from Dog.CEO · no sign-in needed</p>
      </div>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="app-shell">
      <AppBar title="Doggo" />
      <div className="screen loading" role="status" aria-label="Loading">
        <div className="paw-spinner" aria-hidden="true">🐾</div>
        <p className="tagline">Fetching good dogs…</p>
      </div>
    </div>
  )
}

export function ErrorScreen({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  return (
    <div className="app-shell">
      <AppBar title="Doggo" onBack={onHome} />
      <div className="screen error">
        <div className="boot-logo" aria-hidden="true">💤</div>
        <p className="error-title">The dogs are napping</p>
        <p className="tagline">Couldn't reach the dog photo service.</p>
        <button className="btn-filled" onClick={onRetry}>Try again</button>
      </div>
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
  const result = state.score
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
    <div className="app-shell">
      <AppBar title={isStreak ? 'Streak over' : "Time's up"} onBack={onHome} />
      <div className="screen gameover">
        <div className="result-card">
          <div className="final-score">{result}</div>
          <p className="tagline">{isStreak ? 'breeds in a row' : 'breeds identified'}</p>
          {streakTitle(result) && <p className="title-earned">{streakTitle(result)}</p>}
          <p className="best-line">
            Personal best · {isStreak ? state.bestStreak : state.bestBlitz}
          </p>
        </div>
        <button className="btn-filled" onClick={onPlayAgain}>Play again</button>
        <div className="row">
          <button className="btn-tonal" onClick={share}>{copied ? 'Copied!' : 'Share score'}</button>
          <button className="btn-text" onClick={onHome}>Home</button>
        </div>
      </div>
    </div>
  )
}
