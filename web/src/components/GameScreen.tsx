import { useEffect } from 'react'
import { GameState } from '../game/state'
import { AppBar } from './PhoneFrame'
import { PawMark, Wordmark } from './Logo'

export function GameScreen({
  state,
  onAnswer,
  onQuit,
}: {
  state: GameState
  onAnswer: (path: string) => void
  onQuit: () => void
}) {
  const { round, picked, phase } = state
  const revealing = phase === 'reveal' || phase === 'gameover'
  const milestone =
    phase === 'reveal' &&
    picked === round?.answer.path &&
    [5, 10, 25, 50].includes(state.streak)

  // Keyboard play: 1-4 selects an answer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'playing' || !round) return
      const i = Number(e.key) - 1
      if (i >= 0 && i < round.choices.length) onAnswer(round.choices[i].path)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, round, onAnswer])

  if (!round) return null

  const hudRight =
    state.mode === 'blitz' ? (
      <span className={`chip timer-chip ${state.timeLeft <= 10 ? 'urgent' : ''}`}>
        {state.timeLeft}s
      </span>
    ) : (
      <span className="chip">best {state.bestStreak}</span>
    )

  return (
    <div className="app-shell">
      <AppBar title={<Wordmark size={20} />} onBack={onQuit} trailing={hudRight} />
      <div className="screen game">
        <div className="hud">
          <span className="chip score-chip">
            {state.mode === 'streak' ? `🔥 Streak ${state.streak}` : `🐶 Score ${state.score}`}
          </span>
          <span className="question">What breed is this?</span>
        </div>
        <div className="dog-card elevated">
          <img src={round.imageUrl} alt="A dog photo — guess the breed!" />
          {milestone && (
            <div className="paw-burst" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className="burst-paw">
                  <PawMark size={22} />
                </span>
              ))}
              <span className="burst-label">{state.streak} streak!</span>
            </div>
          )}
        </div>
        <div className="answers" role="group" aria-label="Breed choices">
          {round.choices.map((b) => {
            let cls = 'answer'
            if (revealing) {
              if (b.path === round.answer.path) cls += ' correct'
              else if (b.path === picked) cls += ' wrong'
              else cls += ' dim'
            }
            return (
              <button
                key={b.path}
                className={cls}
                disabled={revealing}
                onClick={() => onAnswer(b.path)}
              >
                {b.name}
              </button>
            )
          })}
        </div>
        <div aria-live="polite" className="sr-only">
          {revealing && picked
            ? picked === round.answer.path
              ? `Correct! It's a ${round.answer.name}.`
              : `Wrong — it was a ${round.answer.name}.`
            : ''}
        </div>
      </div>
    </div>
  )
}
