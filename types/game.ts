// Core game types

export type Direction = 'up' | 'down' | 'left' | 'right'
export type GridSize = 3 | 4 | 5
export type GameMode = 'classic' | 'timed'

export interface Position {
  row: number
  col: number
}

export interface Tile {
  id: string
  value: number
  row: number
  col: number
  isNew: boolean
  isMerged: boolean
  prevRow?: number
  prevCol?: number
}

export interface GameState {
  board: (Tile | null)[][]
  tiles: Tile[]
  score: number
  bestScore: number
  moveCount: number
  gameOver: boolean
  gameWon: boolean
  continued: boolean // allow continuing after 4096
  history: HistoryEntry[] // for undo
  gridSize: GridSize
  gameMode: GameMode
  timeRemaining?: number
}

export interface HistoryEntry {
  tiles: Tile[]
  score: number
  moveCount: number
}

export type ThemeMode = 'light' | 'dark' | 'system'
