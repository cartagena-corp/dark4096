'use client'

import { create } from 'zustand'
import { GameState, Direction, GridSize, GameMode } from '@/types/game'
import { applyMove, initGame, buildBoardFromTiles, snapshotHistory } from '@/lib/game/engine'
import {
  saveBestScore,
  loadBestScore,
  saveGameState,
  loadGameState,
  clearGameState,
  saveGridSize,
  loadGridSize,
  saveGameMode,
  loadGameMode,
  saveLeaderboardEntry,
} from '@/lib/storage/persist'
import { DEFAULT_GRID_SIZE } from '@/constants/game'

interface GameStore extends GameState {
  setGridSize: (size: GridSize) => void
  setGameMode: (mode: GameMode) => void
  startNewGame: () => void
  move: (direction: Direction) => void
  undo: () => void
  continueGame: () => void
  hydrate: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: [],
  tiles: [],
  score: 0,
  bestScore: 0,
  moveCount: 0,
  gameOver: false,
  gameWon: false,
  continued: false,
  history: [],
  gridSize: 4,
  gameMode: 'classic',

  setGridSize: (size: GridSize) => {
    saveGridSize(size)
    const gameMode = get().gameMode
    const bestScore = loadBestScore(size, gameMode)
    set({ gridSize: size, bestScore })
  },

  setGameMode: (mode: GameMode) => {
    saveGameMode(mode)
    const gridSize = get().gridSize
    const bestScore = loadBestScore(gridSize, mode)
    set({ gameMode: mode, bestScore })
  },

  hydrate: () => {
    const gridSize = loadGridSize()
    const gameMode = loadGameMode()
    const bestScore = loadBestScore(gridSize, gameMode)
    const saved = loadGameState()

    if (saved && saved.tiles && saved.tiles.length > 0) {
      const board = buildBoardFromTiles(saved.tiles, gridSize)
      set({
        tiles: saved.tiles,
        board,
        score: saved.score,
        bestScore,
        moveCount: saved.moveCount,
        gameOver: saved.gameOver,
        gameWon: saved.gameWon,
        continued: saved.continued,
        history: [],
        gridSize,
        gameMode,
      })
    } else {
      const state = initGame(bestScore, gridSize, gameMode)
      set({ ...state })
    }
  },

  startNewGame: () => {
    const { gridSize, gameMode } = get()
    const bestScore = loadBestScore(gridSize, gameMode)
    const state = initGame(bestScore, gridSize, gameMode)
    clearGameState()
    set({ ...state })
  },

  move: (direction: Direction) => {
    const { tiles, score, bestScore, gameOver, gameWon, continued, history, gridSize, gameMode } = get()
    if (gameOver || (gameWon && !continued)) return

    const snapshot = snapshotHistory({ tiles, score, moveCount: get().moveCount, gameOver, gameWon, continued, history, board: [], bestScore, gridSize, gameMode })

    const result = applyMove(tiles, direction, gridSize, gameMode)
    if (!result.moved) return

    const newScore = score + result.score
    const newBestScore = Math.max(newScore, bestScore)

    if (newBestScore > bestScore) {
      saveBestScore(newBestScore, gridSize, gameMode)
    }

    const newMoveCount = get().moveCount + 1
    const newGameOver = result.gameOver
    const newGameWon = result.gameWon && !continued

    set({
      tiles: result.tiles,
      board: buildBoardFromTiles(result.tiles, gridSize),
      score: newScore,
      bestScore: newBestScore,
      moveCount: newMoveCount,
      gameOver: newGameOver,
      gameWon: newGameWon,
      history: [...history, snapshot].slice(-5),
    })

    // Save to localStorage
    saveGameState({
      tiles: result.tiles,
      score: newScore,
      moveCount: newMoveCount,
      gameOver: newGameOver,
      gameWon: newGameWon,
      continued,
    })

    // Save to leaderboard if game ends
    if (newGameOver || newGameWon) {
      saveLeaderboardEntry({
        score: newScore,
        gridSize,
        gameMode,
        timestamp: Date.now(),
      })
    }
  },

  undo: () => {
    const { history, gridSize } = get()
    if (history.length === 0) return
    const prev = history[history.length - 1]
    const board = buildBoardFromTiles(prev.tiles, gridSize)
    set({
      tiles: prev.tiles,
      board,
      score: prev.score,
      moveCount: prev.moveCount,
      gameOver: false,
      gameWon: false,
      history: history.slice(0, -1),
    })
  },

  continueGame: () => {
    set({ gameWon: false, continued: true })
  },
}))

export type { GameStore }
