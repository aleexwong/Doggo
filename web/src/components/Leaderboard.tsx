import { useEffect, useState } from 'react'
import { Mode, BLITZ_SECONDS } from '../game/state'
import { Entry, fetchTop } from '../game/leaderboard'
import { AppBar } from './PhoneFrame'
import { PawMark, Wordmark } from './Logo'

const MEDALS = ['🥇', '🥈', '🥉']

export function LeaderboardScreen({
  initialMode,
  onBack,
}: {
  initialMode: Mode
  onBack: () => void
}) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [entries, setEntries] = useState<Entry[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setEntries(null)
    setFailed(false)
    fetchTop(mode)
      .then((e) => !cancelled && setEntries(e))
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [mode])

  return (
    <div className="app-shell">
      <AppBar title={<Wordmark />} onBack={onBack} />
      <div className="screen board">
        <h2 className="board-title">Top Dogs 🏆</h2>
        <div className="segmented" role="tablist" aria-label="Leaderboard mode">
          <button
            role="tab"
            aria-selected={mode === 'streak'}
            className={mode === 'streak' ? 'seg active' : 'seg'}
            onClick={() => setMode('streak')}
          >
            Streak
          </button>
          <button
            role="tab"
            aria-selected={mode === 'blitz'}
            className={mode === 'blitz' ? 'seg active' : 'seg'}
            onClick={() => setMode('blitz')}
          >
            {BLITZ_SECONDS}s Blitz
          </button>
        </div>

        {failed && (
          <div className="board-empty">
            <PawMark size={40} />
            <p className="tagline">Couldn't fetch the leaderboard right now.</p>
          </div>
        )}
        {!failed && entries === null && (
          <ul className="board-list" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="board-row skeleton" />
            ))}
          </ul>
        )}
        {!failed && entries !== null && entries.length === 0 && (
          <div className="board-empty">
            <PawMark size={40} />
            <p className="tagline">No scores yet — be the first Top Dog!</p>
          </div>
        )}
        {!failed && entries !== null && entries.length > 0 && (
          <ul className="board-list">
            {entries.map((e, i) => (
              <li key={i} className={`board-row ${i < 3 ? 'podium' : ''}`}>
                <span className="board-rank">{MEDALS[i] ?? i + 1}</span>
                <span className="board-name">{e.name}</span>
                <span className="board-score">{e.score}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
