'use client'

import { useEffect, useRef } from 'react'
import { Direction } from '@/types/game'

interface UseKeyboardProps {
  onMove: (direction: Direction) => void
  enabled: boolean
}

export function useKeyboard({ onMove, enabled }: UseKeyboardProps) {
  // Keep the latest callback/flag in refs so the listener can be bound a
  // single time. Re-binding on every move opens a window where a keypress
  // can land between unbind and rebind — a dropped move.
  const onMoveRef = useRef(onMove)
  const enabledRef = useRef(enabled)
  onMoveRef.current = onMove
  enabledRef.current = enabled

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabledRef.current) return

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
        onMoveRef.current(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
