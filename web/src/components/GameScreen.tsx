import { useEffect } from 'react'
import { GameState } from '../game/state'

export function GameScreen({
  state,
  onAnswer,
}: {
  state: GameState
  onAnswer: (path: string) => void
}) {
  const { round, picked, phase } = state
  const revealing = phase === 'reveal' || phase === 'gameover'

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

  return (
    <div className="screen game">
      <div className="hud">
        <span className="hud-score">
          {state.mode === 'streak' ? `🔥 ${state.streak}` : `🐶 ${state.score}`}
        </span>
        {state.mode === 'blitz' && (
          <span className={`hud-timer ${state.timeLeft <= 10 ? 'urgent' : ''}`}>
            ⏱ {state.timeLeft}s
          </span>
        )}
        <span className="hud-best">
          best {state.mode === 'streak' ? state.bestStreak : state.bestBlitz}
        </span>
      </div>
      <div className="dog-card">
        <img src={round.imageUrl} alt="A dog photo — guess the breed!" />
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
  )
}
