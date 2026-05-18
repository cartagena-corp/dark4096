'use client'

import { useEffect, useCallback } from 'react'
import { Direction } from '@/types/game'

interface UseKeyboardProps {
  onMove: (direction: Direction) => void
  enabled: boolean
}

export function useKeyboard({ onMove, enabled }: UseKeyboardProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return

      let direction: Direction | null = null

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'up'
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'down'
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'left'
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'right'
          break
      }

      if (direction) {
        e.preventDefault()
        onMove(direction)
      }
    },
    [onMove, enabled]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
