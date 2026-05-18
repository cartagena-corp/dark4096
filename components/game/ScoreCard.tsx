'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'

interface ScoreCardProps {
  label: string
  value: number
}

export const ScoreCard = memo(function ScoreCard({ label, value }: ScoreCardProps) {
  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[64px]"
      style={{ backgroundColor: 'var(--board-bg)' }}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--label-text)' }}>
        {label}
      </span>
      <motion.span
        key={value}
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="text-xl sm:text-2xl font-black leading-none"
        style={{ color: '#ffffff' }}
        aria-live="polite"
        aria-label={`${label}: ${value}`}
      >
        {value.toLocaleString()}
      </motion.span>
    </div>
  )
})
