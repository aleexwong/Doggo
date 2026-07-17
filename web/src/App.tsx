import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { LeaderboardScreen } from './components/Leaderboard'
import { PhoneFrame } from './components/PhoneFrame'
import { GameScreen } from './components/GameScreen'
import {
  BootScreen,
  HomeScreen,
  LoadingScreen,
  ErrorScreen,
  GameOverScreen,
} from './components/screens'
import { initialState, reducer, Mode } from './game/state'
import { Breed, fetchBreeds } from './game/api'
import { buildRound } from './game/rounds'

const REVEAL_MS = 1200

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [breeds, setBreeds] = useState<Breed[] | null>(null)
  const [showBoard, setShowBoard] = useState(false)
  const breedsRef = useRef<Breed[] | null>(null)

  useEffect(() => {
    fetchBreeds().then((b) => {
      breedsRef.current = b
      setBreeds(b)
    })
  }, [])

  const start = useCallback((mode: Mode) => {
    dispatch({ type: 'START', mode })
    const b = breedsRef.current
    if (!b) return
    buildRound(b)
      .then((round) => {
        dispatch({ type: 'FIRST_ROUND', round })
        // Prefetch the following round immediately.
        return buildRound(b)
      })
      .then((round) => dispatch({ type: 'NEXT_READY', round }))
      .catch(() => dispatch({ type: 'FAIL' }))
  }, [])

  // If breeds arrive after the player already hit start.
  useEffect(() => {
    if (breeds && state.phase === 'loading' && !state.round) {
      start(state.mode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breeds])

  // After an answer reveal, advance and prefetch the next-next round.
  useEffect(() => {
    if (state.phase !== 'reveal') return
    const id = setTimeout(() => {
      dispatch({ type: 'ADVANCE' })
      const b = breedsRef.current
      if (b) {
        buildRound(b)
          .then((round) => dispatch({ type: 'NEXT_READY', round }))
          .catch(() => {
            /* next ADVANCE falls back to loading state and retries */
          })
      }
    }, REVEAL_MS)
    return () => clearTimeout(id)
  }, [state.phase, state.round])

  // Recover if we advanced without a prefetched round.
  useEffect(() => {
    if (state.phase === 'loading' && state.round === null && breedsRef.current && state.score + state.streak > 0) {
      buildRound(breedsRef.current)
        .then((round) => dispatch({ type: 'FIRST_ROUND', round }))
        .catch(() => dispatch({ type: 'FAIL' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase])

  // Blitz countdown.
  useEffect(() => {
    if (state.mode !== 'blitz' || (state.phase !== 'playing' && state.phase !== 'reveal')) return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.mode, state.phase])

  const onAnswer = useCallback((path: string) => dispatch({ type: 'ANSWER', path }), [])

  return (
    <div className="page">
      <PhoneFrame dark={state.phase === 'boot'}>
        {showBoard ? (
          <LeaderboardScreen initialMode={state.mode} onBack={() => setShowBoard(false)} />
        ) : (
          <>
            {state.phase === 'boot' && <BootScreen onDone={() => dispatch({ type: 'BOOTED' })} />}
            {state.phase === 'home' && (
              <HomeScreen
                bestStreak={state.bestStreak}
                bestBlitz={state.bestBlitz}
                onStart={start}
                onBoard={() => setShowBoard(true)}
              />
            )}
            {state.phase === 'loading' && <LoadingScreen />}
            {(state.phase === 'playing' || state.phase === 'reveal') && (
              <GameScreen state={state} onAnswer={onAnswer} onQuit={() => dispatch({ type: 'HOME' })} />
            )}
            {state.phase === 'gameover' && (
              <GameOverScreen
                state={state}
                onPlayAgain={() => start(state.mode)}
                onHome={() => dispatch({ type: 'HOME' })}
                onBoard={() => setShowBoard(true)}
              />
            )}
            {state.phase === 'error' && (
              <ErrorScreen onRetry={() => start(state.mode)} onHome={() => dispatch({ type: 'HOME' })} />
            )}
          </>
        )}
      </PhoneFrame>
      <p className="footer">
        A web remake of the{' '}
        <a href="https://github.com/aleexwong/Doggo" target="_blank" rel="noreferrer">
          Doggo Android app
        </a>{' '}
        · photos by <a href="https://dog.ceo/dog-api/" target="_blank" rel="noreferrer">Dog.CEO</a>
      </p>
    </div>
  )
}
