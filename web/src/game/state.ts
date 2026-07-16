import { Round } from './rounds'

export type Mode = 'streak' | 'blitz'
export const BLITZ_SECONDS = 60

export type Phase =
  | 'boot'
  | 'home'
  | 'loading' // fetching first round
  | 'playing' // waiting for an answer
  | 'reveal' // answer shown, about to advance
  | 'gameover'
  | 'error'

export interface GameState {
  phase: Phase
  mode: Mode
  round: Round | null
  nextRound: Round | null
  picked: string | null // breed path the player tapped
  score: number
  streak: number
  timeLeft: number
  bestStreak: number
  bestBlitz: number
}

export type Action =
  | { type: 'BOOTED' }
  | { type: 'START'; mode: Mode }
  | { type: 'FIRST_ROUND'; round: Round }
  | { type: 'NEXT_READY'; round: Round }
  | { type: 'ANSWER'; path: string }
  | { type: 'ADVANCE' }
  | { type: 'TICK' }
  | { type: 'FAIL' }
  | { type: 'HOME' }

const BEST_STREAK_KEY = 'doggo.bestStreak'
const BEST_BLITZ_KEY = 'doggo.bestBlitz'

export function loadBests() {
  return {
    bestStreak: Number(localStorage.getItem(BEST_STREAK_KEY)) || 0,
    bestBlitz: Number(localStorage.getItem(BEST_BLITZ_KEY)) || 0,
  }
}

function saveBests(s: GameState) {
  localStorage.setItem(BEST_STREAK_KEY, String(s.bestStreak))
  localStorage.setItem(BEST_BLITZ_KEY, String(s.bestBlitz))
}

export function initialState(): GameState {
  return {
    phase: 'boot',
    mode: 'streak',
    round: null,
    nextRound: null,
    picked: null,
    score: 0,
    streak: 0,
    timeLeft: BLITZ_SECONDS,
    ...loadBests(),
  }
}

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'BOOTED':
      return { ...s, phase: 'home' }
    case 'START':
      return {
        ...s,
        phase: 'loading',
        mode: a.mode,
        round: null,
        nextRound: null,
        picked: null,
        score: 0,
        streak: 0,
        timeLeft: BLITZ_SECONDS,
      }
    case 'FIRST_ROUND':
      return { ...s, phase: 'playing', round: a.round }
    case 'NEXT_READY':
      return { ...s, nextRound: a.round }
    case 'ANSWER': {
      if (s.phase !== 'playing' || !s.round) return s
      const correct = a.path === s.round.answer.path
      const next: GameState = {
        ...s,
        phase: 'reveal',
        picked: a.path,
        score: correct ? s.score + 1 : s.score,
        streak: correct ? s.streak + 1 : 0,
      }
      next.bestStreak = Math.max(next.bestStreak, next.streak)
      if (!correct && s.mode === 'streak') {
        next.phase = 'gameover'
      }
      saveBests(next)
      return next
    }
    case 'ADVANCE': {
      if (s.phase !== 'reveal') return s
      if (!s.nextRound) return { ...s, phase: 'loading', round: null, picked: null }
      return { ...s, phase: 'playing', round: s.nextRound, nextRound: null, picked: null }
    }
    case 'TICK': {
      if (s.mode !== 'blitz' || (s.phase !== 'playing' && s.phase !== 'reveal')) return s
      const timeLeft = s.timeLeft - 1
      if (timeLeft <= 0) {
        const next = { ...s, timeLeft: 0, phase: 'gameover' as Phase }
        next.bestBlitz = Math.max(next.bestBlitz, next.score)
        saveBests(next)
        return next
      }
      return { ...s, timeLeft }
    }
    case 'FAIL':
      return { ...s, phase: 'error' }
    case 'HOME':
      return { ...initialState(), phase: 'home' }
  }
}
