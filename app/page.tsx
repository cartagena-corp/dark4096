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
import { Direction, GridSize } from '@/types/game'
import { DEFAULT_TIMER_SECONDS } from '@/constants/game'

function useBoardDimensions(gridSize: number) {
  const [cellSize, setCellSize] = useState(80)
  const [gap, setGap] = useState(10)

  useEffect(() => {
    function calculate() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxW = Math.min(vw - 32, 520)
      const maxH = vh - 220
      const available = Math.min(maxW, maxH)
      const g = available < 360 ? 8 : 10
      const size = Math.floor((available - (gridSize + 1) * g) / gridSize)
      setCellSize(Math.max(40, Math.min(size, 120)))
      setGap(g)
    }
    calculate()
    window.addEventListener('resize', calculate)
    return () => window.removeEventListener('resize', calculate)
  }, [gridSize])

  return { cellSize, gap }
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
  const boardRef = useRef<HTMLDivElement>(null)
  const { cellSize, gap } = useBoardDimensions(gridSize)

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER_SECONDS)
  const [timerStarted, setTimerStarted] = useState(false)
  const [timerGameOver, setTimerGameOver] = useState(false)

  // Confirm modal state for grid change
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingGridSize, setPendingGridSize] = useState<GridSize | null>(null)

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
      setPendingGridSize(newSize)
      setConfirmModalOpen(true)
    } else {
      setGridSize(newSize)
      handleNewGame()
    }
  }, [gridSize, moveCount, setGridSize, handleNewGame])

  const handleConfirmGridChange = useCallback(() => {
    if (pendingGridSize) {
      setGridSize(pendingGridSize)
      handleNewGame()
    }
    setConfirmModalOpen(false)
    setPendingGridSize(null)
  }, [pendingGridSize, setGridSize, handleNewGame])

  const handleCancelGridChange = useCallback(() => {
    setConfirmModalOpen(false)
    setPendingGridSize(null)
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
          onUndo={undo}
          onToggleTheme={toggleTheme}
          onGridSizeChange={handleGridSizeChange}
          onGameModeChange={setGameMode}
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
          <Board tiles={tiles} cellSize={cellSize} gap={gap} gridSize={gridSize} />
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
      />

      <ConfirmModal
        open={confirmModalOpen}
        title="Cambiar tamaño de grid"
        message="Al cambiar el tamaño del grid se iniciará un nuevo juego y perderás todo el progreso actual. ¿Deseas continuar?"
        confirmText="Aceptar"
        cancelText="Cancelar"
        onConfirm={handleConfirmGridChange}
        onCancel={handleCancelGridChange}
      />
    </main>
  )
}
