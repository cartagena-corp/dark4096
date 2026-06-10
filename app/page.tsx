'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/hooks/use-game-store'
import { useKeyboard } from '@/hooks/use-keyboard'
import { useSwipe } from '@/hooks/use-swipe'
import { useTheme } from '@/hooks/use-theme'
import { useGameTimer } from '@/hooks/use-game-timer'
import { Board } from '@/components/game/Board'
import { HUD } from '@/components/game/HUD'
import { GameOverModal } from '@/components/game/GameOverModal'
import { ConfirmModal } from '@/components/game/ConfirmModal'
import { SwipeIndicator } from '@/components/game/SwipeIndicator'
import { Instructions } from '@/components/game/Instructions'
import { Direction, GridSize, GameMode } from '@/types/game'
import { DEFAULT_TIMER_SECONDS } from '@/constants/game'
import { useI18n } from '@/hooks/use-i18n'

function useBoardDimensions(gridSize: number) {
  const [dims, setDims] = useState({ cellSize: 80, gap: 12, padding: 8 })

  useEffect(() => {
    function calculate() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxW = Math.min(vw - 32, 540)
      const maxH = vh - 210
      const available = Math.min(maxW, maxH)
      // Modest gap between cells; the outer frame (padding) is kept thinner
      // than the gap so it doesn't look like a bulky border.
      const gap = available < 360 ? 8 : available < 460 ? 10 : 12
      const padding = Math.round(gap * 0.7)
      const cellSize = Math.floor(
        (available - (gridSize - 1) * gap - padding * 2) / gridSize
      )
      setDims({
        cellSize: Math.max(40, Math.min(cellSize, 140)),
        gap,
        padding,
      })
    }
    calculate()
    window.addEventListener('resize', calculate)
    return () => window.removeEventListener('resize', calculate)
  }, [gridSize])

  return dims
}

export default function GamePage() {
  const {
    tiles,
    score,
    bestScore,
    moveCount,
    gridSize,
    gameMode,
    gameOver,
    gameWon,
    history,
    hydrate,
    startNewGame,
    move,
    undo,
    continueGame,
    setGridSize,
    setGameMode,
  } = useGameStore()

  const { resolvedTheme, toggleTheme } = useTheme()
  const { t } = useI18n()
  const boardRef = useRef<HTMLDivElement>(null)
  const { cellSize, gap, padding } = useBoardDimensions(gridSize)

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER_SECONDS)
  const [timerStarted, setTimerStarted] = useState(false)
  const [timerGameOver, setTimerGameOver] = useState(false)

  // Confirm modal state for grid size / game mode change
  const [pendingChange, setPendingChange] = useState<
    | { type: 'grid'; value: GridSize }
    | { type: 'mode'; value: GameMode }
    | null
  >(null)

  const isTimedMode = gameMode === 'timed'
  const isGameActive = !gameOver && !gameWon && !timerGameOver

  // Timer hook
  const { timeRemaining } = useGameTimer({
    initialSeconds: timerSeconds,
    started: isTimedMode && timerStarted,
    onTimeUp: () => {
      setTimerGameOver(true)
    },
  })

  // Hydrate on mount
  useEffect(() => {
    hydrate()
  }, [hydrate])

  // Prevent body scroll on mobile
  useEffect(() => {
    document.body.classList.add('game-active')
    return () => document.body.classList.remove('game-active')
  }, [])

  // Reset timer state when starting a new game
  const handleNewGame = useCallback(() => {
    setTimerStarted(false)
    setTimerGameOver(false)
    startNewGame()
  }, [startNewGame])

  const handleUndo = useCallback(() => {
    undo()
    setTimerGameOver(false)
  }, [undo])

  // Handle move - start timer on first move in timed mode
  const handleMove = useCallback((direction: Direction) => {
    if (!isGameActive) return
    
    // Start timer on first move in timed mode
    if (isTimedMode && !timerStarted && moveCount === 0) {
      setTimerStarted(true)
    }
    
    move(direction)
  }, [move, isTimedMode, timerStarted, moveCount, isGameActive])

  // Handle grid size change with confirmation
  const handleGridSizeChange = useCallback((newSize: GridSize) => {
    if (newSize === gridSize) return

    // If game has progress (moveCount > 0), show confirmation
    if (moveCount > 0) {
      setPendingChange({ type: 'grid', value: newSize })
    } else {
      setGridSize(newSize)
      handleNewGame()
    }
  }, [gridSize, moveCount, setGridSize, handleNewGame])

  // Handle game mode change with confirmation
  const handleGameModeChange = useCallback((newMode: GameMode) => {
    if (newMode === gameMode) return

    // If game has progress (moveCount > 0), show confirmation
    if (moveCount > 0) {
      setPendingChange({ type: 'mode', value: newMode })
    } else {
      setGameMode(newMode)
      handleNewGame()
    }
  }, [gameMode, moveCount, setGameMode, handleNewGame])

  const handleConfirmChange = useCallback(() => {
    if (pendingChange?.type === 'grid') {
      setGridSize(pendingChange.value)
      handleNewGame()
    } else if (pendingChange?.type === 'mode') {
      setGameMode(pendingChange.value)
      handleNewGame()
    }
    setPendingChange(null)
  }, [pendingChange, setGridSize, setGameMode, handleNewGame])

  const handleCancelChange = useCallback(() => {
    setPendingChange(null)
  }, [])

  // Handle timer seconds change
  const handleTimerSecondsChange = useCallback((seconds: number) => {
    setTimerSeconds(seconds)
  }, [])

  const isGameInteractive = isGameActive

  useKeyboard({ onMove: handleMove, enabled: isGameInteractive })
  useSwipe({ onMove: handleMove, enabled: isGameInteractive, elementRef: boardRef })

  const modalOpen = gameOver || gameWon || timerGameOver

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 pt-6 pb-8">
      <div className="w-full max-w-[520px] flex flex-col items-center gap-4">
        <HUD
          score={score}
          bestScore={bestScore}
          moveCount={moveCount}
          gridSize={gridSize}
          gameMode={gameMode}
          timeRemaining={timeRemaining}
          timerSeconds={timerSeconds}
          timerStarted={timerStarted}
          canUndo={history.length > 0}
          isDark={resolvedTheme === 'dark'}
          gameOver={gameOver || timerGameOver}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          onToggleTheme={toggleTheme}
          onGridSizeChange={handleGridSizeChange}
          onGameModeChange={handleGameModeChange}
          onTimerSecondsChange={handleTimerSecondsChange}
        />

        <motion.div
          ref={boardRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1], delay: 0.1 }}
          className="touch-none select-none"
          aria-live="polite"
          aria-atomic="true"
        >
          <Board tiles={tiles} cellSize={cellSize} gap={gap} padding={padding} gridSize={gridSize} />
        </motion.div>

        <SwipeIndicator />
        <Instructions />
      </div>

      <GameOverModal
        open={modalOpen}
        won={gameWon}
        score={score}
        bestScore={bestScore}
        gridSize={gridSize}
        gameMode={gameMode}
        onRetry={handleNewGame}
        onContinue={gameWon ? continueGame : undefined}
        onUndo={handleUndo}
        canUndo={history.length > 0}
      />

      <ConfirmModal
        open={pendingChange !== null}
        title={pendingChange?.type === 'mode' ? t('confirmModeTitle') : t('confirmGridTitle')}
        message={pendingChange?.type === 'mode' ? t('confirmModeMessage') : t('confirmGridMessage')}
        confirmText={t('accept')}
        cancelText={t('cancel')}
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
      />
    </main>
  )
}
