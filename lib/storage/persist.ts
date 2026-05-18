import { GameState, ThemeMode, GridSize, GameMode } from '@/types/game'
import { STORAGE_KEYS, DEFAULT_GRID_SIZE } from '@/constants/game'

function bestScoreKey(gridSize: GridSize, gameMode: GameMode): string {
  return `${STORAGE_KEYS.BEST_SCORE}_${gridSize}_${gameMode}`
}

export function saveBestScore(score: number, gridSize: GridSize, gameMode: GameMode): void {
  try {
    localStorage.setItem(bestScoreKey(gridSize, gameMode), String(score))
  } catch { /* ignore */ }
}

export function loadBestScore(gridSize: GridSize, gameMode: GameMode): number {
  try {
    const val = localStorage.getItem(bestScoreKey(gridSize, gameMode))
    return val ? parseInt(val, 10) : 0
  } catch {
    return 0
  }
}

export function saveGameState(state: Pick<GameState, 'tiles' | 'score' | 'moveCount' | 'gameOver' | 'gameWon' | 'continued'>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state))
  } catch { /* ignore */ }
}

export function loadGameState(): Pick<GameState, 'tiles' | 'score' | 'moveCount' | 'gameOver' | 'gameWon' | 'continued'> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAME_STATE)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE)
  } catch { /* ignore */ }
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch { /* ignore */ }
}

export function loadTheme(): ThemeMode {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.THEME)
    if (val === 'light') return 'light'
    return 'dark'
  } catch {
    return 'dark'
  }
}

export function saveGridSize(size: GridSize): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GRID_SIZE, String(size))
  } catch { /* ignore */ }
}

export function loadGridSize(): GridSize {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.GRID_SIZE)
    if (val === '3' || val === '4' || val === '5') return parseInt(val, 10) as GridSize
    return DEFAULT_GRID_SIZE
  } catch {
    return DEFAULT_GRID_SIZE
  }
}

export function saveGameMode(mode: GameMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_MODE, mode)
  } catch { /* ignore */ }
}

export function loadGameMode(): GameMode {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.GAME_MODE)
    if (val === 'timed') return 'timed'
    return 'classic'
  } catch {
    return 'classic'
  }
}

export interface LeaderboardEntry {
  score: number
  gridSize: GridSize
  gameMode: GameMode
  timestamp: number
}

const MAX_LEADERBOARD_ENTRIES = 10

export function saveLeaderboardEntry(entry: LeaderboardEntry): void {
  try {
    const scores = loadLeaderboard()
    scores.push(entry)
    scores.sort((a, b) => b.score - a.score)
    const top = scores.slice(0, MAX_LEADERBOARD_ENTRIES)
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(top))
  } catch { /* ignore */ }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function getLeaderboardByMode(gridSize: GridSize, gameMode: GameMode): LeaderboardEntry[] {
  const all = loadLeaderboard()
  return all.filter(e => e.gridSize === gridSize && e.gameMode === gameMode)
}
