'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Undo2, Sun, Moon, Clock } from 'lucide-react'
import { GridSize, GameMode } from '@/types/game'
import { ScoreCard } from './ScoreCard'
import { GridSelector } from './GridSelector'
import { GameModeSelector } from './GameModeSelector'
import { TimerSelector } from './TimerSelector'

interface HUDProps {
  score: number
  bestScore: number
  moveCount: number
  gridSize: GridSize
  gameMode: GameMode
  timeRemaining: number
  timerSeconds: number
  timerStarted: boolean
  canUndo: boolean
  isDark: boolean
  gameOver: boolean
  onNewGame: () => void
  onUndo: () => void
  onToggleTheme: () => void
  onGridSizeChange: (size: GridSize) => void
  onGameModeChange: (mode: GameMode) => void
  onTimerSecondsChange: (seconds: number) => void
}

export const HUD = memo(function HUD({
  score,
  bestScore,
  moveCount,
  gridSize,
  gameMode,
  timeRemaining,
  timerSeconds,
  timerStarted,
  canUndo,
  isDark,
  gameOver,
  onNewGame,
  onUndo,
  onToggleTheme,
  onGridSizeChange,
  onGameModeChange,
  onTimerSecondsChange,
}: HUDProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return `${secs}s`
  }

  const isTimedMode = gameMode === 'timed'
  const showTimerSelector = isTimedMode && !timerStarted && moveCount === 0
  const showCountdown = isTimedMode && (timerStarted || moveCount > 0)

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top row: title + scores */}
      <div className="flex items-center justify-between gap-2">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="text-4xl sm:text-5xl font-black leading-none tracking-tight"
            style={{ color: 'var(--foreground)' }}
          >
            4096
          </h1>
          <p className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
            Dark
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2"
        >
          <ScoreCard label="Score" value={score} />
          <ScoreCard label="Best" value={bestScore} />
        </motion.div>
      </div>

      {/* Grid + Mode selector row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <GridSelector 
          selected={gridSize} 
          onChange={onGridSizeChange}
          disabled={gameOver}
        />
        <GameModeSelector
          selected={gameMode}
          onChange={onGameModeChange}
          disabled={gameOver}
        />
      </div>

      {/* Bottom row: subtitle + action buttons + timer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-xs sm:text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Join the numbers and get to the{' '}
          <strong style={{ color: 'var(--foreground)' }}>4096 tile!</strong>
        </p>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Timer selector (before first move in timed mode) */}
          {showTimerSelector && (
            <TimerSelector
              value={timerSeconds}
              onChange={onTimerSecondsChange}
              disabled={gameOver}
            />
          )}

          {/* Live countdown (after first move in timed mode) */}
          {showCountdown && (
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-bold tabular-nums"
              style={{ 
                backgroundColor: 'var(--muted)',
                color: timeRemaining < 10000 ? '#ff6b6b' : 'var(--foreground)'
              }}
              title="Tiempo restante"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}

          {/* Moves counter */}
          <div
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
            title="Total moves"
          >
            <span>{moveCount}</span>
          </div>

          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            aria-label="Undo last move"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl transition-all active:scale-90"
            style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* New Game */}
          <button
            onClick={onNewGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-90"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            aria-label="Start new game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Game
          </button>
        </div>
      </div>
    </div>
  )
})
