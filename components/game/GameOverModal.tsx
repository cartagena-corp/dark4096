'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'
import { GridSize, GameMode } from '@/types/game'
import { useI18n } from '@/hooks/use-i18n'
import { Leaderboard } from './Leaderboard'

interface GameOverModalProps {
  open: boolean
  won: boolean
  score: number
  bestScore: number
  gridSize: GridSize
  gameMode: GameMode
  onRetry: () => void
  onContinue?: () => void
  onUndo?: () => void
  canUndo?: boolean
}

export function GameOverModal({
  open,
  won,
  score,
  bestScore,
  gridSize,
  gameMode,
  onRetry,
  onContinue,
  onUndo,
  canUndo,
}: GameOverModalProps) {
  const { t } = useI18n()
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'oklch(0 0 0 / 0.4)' }}
          aria-modal="true"
          role="dialog"
          aria-label={won ? t('win') : t('gameOver')}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl my-8"
            style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: won ? 'var(--accent)' : 'var(--destructive)', color: 'white' }}
              >
                {won ? <Trophy className="w-8 h-8" /> : <span className="font-black text-2xl">X</span>}
              </motion.div>
            </div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center text-3xl font-black mb-1"
              style={{ color: 'var(--foreground)' }}
            >
              {won ? t('win') : t('gameOver')}
            </motion.h2>

            {won && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-center text-sm mb-4"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {t('winSubtitle')}
              </motion.p>
            )}

            {/* Scores */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 justify-center mt-4 mb-6"
            >
              <div
                className="flex-1 flex flex-col items-center rounded-2xl py-3 px-4"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>
                  {t('score')}
                </span>
                <span className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>
                  {score.toLocaleString()}
                </span>
              </div>
              <div
                className="flex-1 flex flex-col items-center rounded-2xl py-3 px-4"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>
                  {t('best')}
                </span>
                <span className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>
                  {bestScore.toLocaleString()}
                </span>
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-6"
            >
              <Leaderboard gridSize={gridSize} gameMode={gameMode} />
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-2"
            >
              {won && onContinue && (
                <button
                  onClick={onContinue}
                  className="w-full py-3 rounded-2xl font-bold text-base transition-all active:scale-95"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--accent-foreground)',
                  }}
                  aria-label={t('keepGoing')}
                >
                  {t('keepGoing')}
                </button>
              )}
              <button
                onClick={onRetry}
                className="w-full py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
                aria-label={t('newGame')}
              >
                <RotateCcw className="w-4 h-4" />
                {t('newGame')}
              </button>
              {onUndo && canUndo && (
                <button
                  onClick={onUndo}
                  className="w-full py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 border"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                  }}
                  aria-label={t('undoTitle')}
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('undoTitle')}
                </button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
