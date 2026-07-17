import { useEffect, useState } from 'react'
import { GameState, Mode, BLITZ_SECONDS } from '../game/state'
import { AppBar } from './PhoneFrame'
import { PawMark, Wordmark } from './Logo'

export function BootScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1400)
    return () => clearTimeout(id)
  }, [onDone])
  return (
    <div className="screen boot" onClick={onDone}>
      <div className="boot-paw" aria-hidden="true"><PawMark size={72} /></div>
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
      <AppBar title={<Wordmark />} />
      <div className="screen home">
        <div className="hero">
          <div className="hero-avatar" aria-hidden="true">🐶</div>
          <h1>Guess the breed!</h1>
          <p className="tagline">A photo appears — you have four choices.</p>
        </div>
        <button className="mode-card" onClick={() => onStart('streak')}>
          <span className="mode-icon streak-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 0.7s.8 2.9.8 5.2c0 2.2-1.5 4-3.7 4S6.9 8.1 6.9 5.9c0-.5 0-1 .1-1.4C4.7 6.9 3 10 3 13.2 3 18.1 7 22 12 22s9-3.9 9-8.8c0-6-4.3-10.7-7.5-12.5ZM12 19.5c-1.9 0-3.4-1.5-3.4-3.4 0-1.7 1.1-2.9 3-3.3 1.9-.4 3.9-1.3 5-2.9.4 1.3.7 2.7.7 4.1 0 3-2.4 5.5-5.3 5.5Z"/></svg>
          </span>
          <span className="mode-text">
            <span className="mode-name">Endless Streak</span>
            <span className="mode-desc">Play until you miss</span>
          </span>
          <span className="mode-best">{bestStreak > 0 ? `Best ${bestStreak}` : 'New'}</span>
        </button>
        <button className="mode-card" onClick={() => onStart('blitz')}>
          <span className="mode-icon blitz-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15 1H9v2h6V1Zm-4 13h2V8h-2v6Zm8.03-6.61 1.42-1.42-1.42-1.42-1.42 1.42A8.96 8.96 0 0 0 12 4a9 9 0 1 0 9 9c0-2.12-.74-4.07-1.97-5.61ZM12 20a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"/></svg>
          </span>
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
      <AppBar title={<Wordmark />} />
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
      <AppBar title={<Wordmark />} onBack={onHome} />
      <div className="screen error">
        <div className="error-paw" aria-hidden="true"><PawMark size={56} /></div>
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
  const missedBreed =
    state.round && state.picked && state.picked !== state.round.answer.path
      ? state.round.answer.name
      : null
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
          {missedBreed && <p className="missed-line">That last one was a <strong>{missedBreed}</strong></p>}
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
