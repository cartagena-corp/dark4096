'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

export const SwipeIndicator = memo(function SwipeIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="flex items-center justify-center gap-2 mt-2 sm:hidden"
      aria-hidden="true"
    >
      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
        Swipe to move tiles
      </span>
    </motion.div>
  )
})
