'use client'

import { memo } from 'framer-motion'
import { motion } from 'framer-motion'

const HOW_TO_ITEMS = [
  { keys: ['↑ ↓ ← →', 'W A S D'], label: 'Move tiles' },
  { keys: ['Swipe'], label: 'Mobile' },
]

export const Instructions = memo(function Instructions() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="w-full"
    >
      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <strong style={{ color: 'var(--foreground)' }}>HOW TO PLAY:</strong>{' '}
        Use your{' '}
        <strong style={{ color: 'var(--foreground)' }}>arrow keys</strong>{' '}
        or{' '}
        <strong style={{ color: 'var(--foreground)' }}>WASD</strong>{' '}
        to move the tiles. When two tiles with the same number touch, they{' '}
        <strong style={{ color: 'var(--foreground)' }}>merge into one!</strong>{' '}
        Reach the{' '}
        <strong style={{ color: 'var(--primary)' }}>4096 tile</strong>{' '}
        to win.
      </p>
    </motion.div>
  )
})
