'use client'

import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { GridSize, GameMode } from '@/types/game'
import { getLeaderboardByMode, LeaderboardEntry } from '@/lib/storage/persist'

interface LeaderboardProps {
  gridSize: GridSize
  gameMode: GameMode
  className?: string
}

export const Leaderboard = memo(function Leaderboard({
  gridSize,
  gameMode,
  className = '',
}: LeaderboardProps) {
  const [scores, setScores] = useState<LeaderboardEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const scores = getLeaderboardByMode(gridSize, gameMode)
    setScores(scores)
    setLoaded(true)
  }, [gridSize, gameMode])

  if (!loaded || scores.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-card rounded-xl p-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
          Top Scores
        </h3>
      </div>

      <div className="space-y-2">
        {scores.slice(0, 5).map((entry, idx) => (
          <motion.div
            key={`${entry.score}-${entry.timestamp}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="font-bold w-5"
                style={{ color: idx === 0 ? '#ffd700' : 'var(--muted-foreground)' }}
              >
                #{idx + 1}
              </span>
              <span style={{ color: 'var(--foreground)' }} className="font-semibold">
                {entry.score}
              </span>
            </div>
            <span style={{ color: 'var(--muted-foreground)' }} className="text-[10px]">
              {gridSize}×{gridSize}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
})
