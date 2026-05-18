'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Direction } from '@/types/game'

interface UseSwipeProps {
  onMove: (direction: Direction) => void
  enabled: boolean
  elementRef: React.RefObject<HTMLElement | null>
}

export function useSwipe({ onMove, enabled, elementRef }: UseSwipeProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const lastSwipeTime = useRef(0)
  const DEBOUNCE_MS = 120
  const MIN_SWIPE_DISTANCE = 30
  const MAX_PERPENDICULAR_RATIO = 2.0

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
    e.preventDefault()
  }, [enabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault()
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStart.current) return
      const now = Date.now()
      if (now - lastSwipeTime.current < DEBOUNCE_MS) return

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
        onMove(direction)
        // Haptic feedback on supported devices
        if ('vibrate' in navigator) {
          navigator.vibrate(10)
        }
      }
    },
    [onMove, enabled]
  )

  useEffect(() => {
    const el = elementRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: false })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd])
}
