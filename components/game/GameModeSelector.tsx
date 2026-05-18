'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { GameMode } from '@/types/game'

interface GameModeSelectorProps {
  selected: GameMode
  onChange: (mode: GameMode) => void
  disabled?: boolean
}

export const GameModeSelector = memo(function GameModeSelector({
  selected,
  onChange,
  disabled = false,
}: GameModeSelectorProps) {
  const modes: { mode: GameMode; label: string; description: string }[] = [
    { mode: 'classic', label: 'Classic', description: 'No time limit' },
    { mode: 'timed', label: 'Timed', description: '90 seconds' },
  ]

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">Mode:</span>
      <div className="flex gap-1.5">
        {modes.map(({ mode, label }) => (
          <motion.button
            key={mode}
            onClick={() => !disabled && onChange(mode)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              selected === mode
                ? 'bg-accent text-accent-foreground shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            disabled={disabled}
            aria-pressed={selected === mode}
            aria-label={`Select ${label} mode`}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
})
