'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { GridSize } from '@/types/game'
import { GRID_SIZES } from '@/constants/game'

interface GridSelectorProps {
  selected: GridSize
  onChange: (size: GridSize) => void
  disabled?: boolean
}

export const GridSelector = memo(function GridSelector({
  selected,
  onChange,
  disabled = false,
}: GridSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">Grid:</span>
      <div className="flex gap-1.5">
        {GRID_SIZES.map((size) => (
          <motion.button
            key={size}
            onClick={() => !disabled && onChange(size)}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
              selected === size
                ? 'bg-accent text-accent-foreground shadow-lg'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            disabled={disabled}
            aria-pressed={selected === size}
            aria-label={`Select ${size}x${size} grid`}
          >
            {size}×{size}
          </motion.button>
        ))}
      </div>
    </div>
  )
})
