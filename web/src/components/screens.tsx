import { useEffect, useState } from 'react'
import { GameState, Mode, BLITZ_SECONDS } from '../game/state'
import {
  leaderboardEnabled,
  loadNickname,
  saveNickname,
  submitScore,
  validName,
  NAME_MAX,
} from '../game/leaderboard'
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
  onBoard,
}: {
  bestStreak: number
  bestBlitz: number
  onStart: (mode: Mode) => void
  onBoard: () => void
}) {
  return (
    <div className="app-shell">
      <AppBar
        title={<Wordmark />}
        trailing={
          leaderboardEnabled && (
          <button className="appbar-icon" onClick={onBoard} aria-label="Leaderboard">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 5h-2V3H7v2H5a2 2 0 0 0-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7a2 2 0 0 0-2-2ZM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8Zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1Z" />
            </svg>
          </button>
          )
        }
      />
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

/** Every run earns a rank — the ladder is the reason to play again. */
function earnedTitle(mode: Mode, n: number): string {
  const ladder: [number, string][] =
    mode === 'streak'
      ? [
          [50, 'Legendary Best Friend 🏆'],
          [25, 'Dog Whisperer ✨'],
          [15, 'Kennel Club Judge 🎖️'],
          [10, 'Certified Dog Expert 🐾'],
          [5, 'Good Human 🦴'],
          [3, 'Dog Park Regular 🎾'],
          [1, 'Puppy in Training 🐕'],
          [0, 'Ruff Start 😅'],
        ]
      : [
          [40, 'Speed of Zoomies 🏆'],
          [30, 'Fastest Snoot in the West ✨'],
          [20, 'Fetch Champion 🎖️'],
          [12, 'Quick Sniffer 🐾'],
          [6, 'Warming Up 🎾'],
          [1, 'Slow and Steady 🐢'],
          [0, 'Ruff Start 😅'],
        ]
  return ladder.find(([min]) => n >= min)![1]
}

export function GameOverScreen({
  state,
  onPlayAgain,
  onHome,
  onBoard,
}: {
  state: GameState
  onPlayAgain: () => void
  onHome: () => void
  onBoard: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [nick, setNick] = useState(loadNickname)
  const [post, setPost] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const postScore = async () => {
    if (!validName(nick) || post === 'saving') return
    setPost('saving')
    try {
      saveNickname(nick)
      await submitScore(state.mode, nick, state.score)
      setPost('done')
    } catch {
      setPost('error')
    }
  }
  const isStreak = state.mode === 'streak'
  const missedBreed =
    state.round && state.picked && state.picked !== state.round.answer.path
      ? state.round.answer.name
      : null
  const result = state.score
  const best = isStreak ? state.bestStreak : state.bestBlitz
  const isNewBest = result > 0 && result >= best
  const share = async () => {
    const feat = isStreak
      ? `${result} dog breeds in a row`
      : `${result} dog breeds in ${BLITZ_SECONDS} seconds`
    const text = `${earnedTitle(state.mode, result)} — I named ${feat} on Doggo 🐶 ${location.href}`
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
          <p className="title-earned">{earnedTitle(state.mode, result)}</p>
          {isNewBest ? (
            <p className="best-line new-best">New personal best!</p>
          ) : (
            <p className="best-line">Personal best · {best}</p>
          )}
        </div>
        {leaderboardEnabled && result > 0 && post !== 'done' && (
          <div className="post-row">
            <input
              className="nick-input"
              placeholder="Your name"
              value={nick}
              maxLength={NAME_MAX}
              onChange={(e) => setNick(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && postScore()}
              aria-label="Name for the leaderboard"
            />
            <button
              className="btn-tonal"
              disabled={!validName(nick) || post === 'saving'}
              onClick={postScore}
            >
              {post === 'saving' ? 'Posting…' : 'Post score'}
            </button>
          </div>
        )}
        {post === 'error' && (
          <p className="post-note">Couldn't reach the leaderboard — try again?</p>
        )}
        {post === 'done' && (
          <p className="post-note posted">
            Posted!{' '}
            <button className="btn-text inline" onClick={onBoard}>See Top Dogs 🏆</button>
          </p>
        )}
        <button className="btn-filled" onClick={onPlayAgain}>Play again</button>
        <div className="row">
          <button className="btn-tonal" onClick={share}>{copied ? 'Copied!' : 'Share score'}</button>
          {leaderboardEnabled && (
            <button className="btn-text" onClick={onBoard}>Leaderboard</button>
          )}
          <button className="btn-text" onClick={onHome}>Home</button>
        </div>
      </div>
    </div>
  )
}
