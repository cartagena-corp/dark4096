'use client'

import { useEffect, useRef } from 'react'
import { Direction } from '@/types/game'

interface UseSwipeProps {
  onMove: (direction: Direction) => void
  enabled: boolean
  elementRef: React.RefObject<HTMLElement | null>
}

export function useSwipe({ onMove, enabled, elementRef }: UseSwipeProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const lastSwipeTime = useRef(0)

  // Latest callback/flag kept in refs so listeners bind exactly once.
  const onMoveRef = useRef(onMove)
  const enabledRef = useRef(enabled)
  onMoveRef.current = onMove
  enabledRef.current = enabled

  // Short debounce: just enough to avoid a single gesture firing twice,
  // without swallowing genuine fast consecutive swipes.
  const DEBOUNCE_MS = 55
  const MIN_SWIPE_DISTANCE = 24
  const MAX_PERPENDICULAR_RATIO = 2.0

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const handleTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current) return
      const touch = e.touches[0]
      touchStart.current = { x: touch.clientX, y: touch.clientY }
      e.preventDefault()
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!enabledRef.current || !touchStart.current) return
      const now = Date.now()
      if (now - lastSwipeTime.current < DEBOUNCE_MS) {
        touchStart.current = null
        return
      }

      const touch = e.changedTouches[0]
      const dx = touch.clientX - touchStart.current.x
      const dy = touch.clientY - touchStart.current.y
      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      touchStart.current = null

      if (Math.max(absDx, absDy) < MIN_SWIPE_DISTANCE) return

      let direction: Direction | null = null

      if (absDx > absDy) {
        // Horizontal swipe — check perpendicular ratio
        if (absDy / absDx < MAX_PERPENDICULAR_RATIO) {
          direction = dx > 0 ? 'right' : 'left'
        }
      } else {
        // Vertical swipe
        if (absDx / absDy < MAX_PERPENDICULAR_RATIO) {
          direction = dy > 0 ? 'down' : 'up'
        }
      }

      if (direction) {
        lastSwipeTime.current = now
        onMoveRef.current(direction)
        // Haptic feedback on supported devices
        if ('vibrate' in navigator) {
          navigator.vibrate(8)
        }
      }
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: false })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [elementRef])
}
