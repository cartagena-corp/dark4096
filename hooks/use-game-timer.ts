'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseGameTimerProps {
  initialSeconds: number
  started: boolean // true when first move has been made
  onTimeUp: () => void
}

interface UseGameTimerReturn {
  timeRemaining: number
  isRunning: boolean
}

export function useGameTimer({ initialSeconds, started, onTimeUp }: UseGameTimerProps): UseGameTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds * 1000)
  const intervalRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const onTimeUpRef = useRef(onTimeUp)

  // Keep callback ref updated
  onTimeUpRef.current = onTimeUp

  // Reset timer when initialSeconds changes (before game starts)
  useEffect(() => {
    if (!started) {
      setTimeRemaining(initialSeconds * 1000)
      startTimeRef.current = null
    }
  }, [initialSeconds, started])

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      cancelAnimationFrame(intervalRef.current)
      intervalRef.current = null
    }

    if (!started) {
      return
    }

    // Record start time
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    const totalDuration = initialSeconds * 1000

    const tick = () => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now())
      const remaining = Math.max(0, totalDuration - elapsed)
      
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        onTimeUpRef.current()
        return
      }

      intervalRef.current = requestAnimationFrame(tick)
    }

    intervalRef.current = requestAnimationFrame(tick)

    return () => {
      if (intervalRef.current) {
        cancelAnimationFrame(intervalRef.current)
      }
    }
  }, [started, initialSeconds])

  return {
    timeRemaining,
    isRunning: started && timeRemaining > 0,
  }
}
