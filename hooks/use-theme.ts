'use client'

import { useState, useEffect, useCallback } from 'react'
import { ThemeMode } from '@/types/game'
import { saveTheme, loadTheme } from '@/lib/storage/persist'

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  const applyTheme = useCallback((mode: ThemeMode) => {
    // 'system' is no longer used but kept for safety — falls back to dark
    const resolved: 'light' | 'dark' =
      mode === 'light' ? 'light' : 'dark'
    setResolvedTheme(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [])

  useEffect(() => {
    const saved = loadTheme()
    setThemeState(saved)
    applyTheme(saved)
  }, [applyTheme])

  // Listen for system changes
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme, applyTheme])

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeState(mode)
      saveTheme(mode)
      applyTheme(mode)
    },
    [applyTheme]
  )

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }, [resolvedTheme, setTheme])

  return { theme, resolvedTheme, setTheme, toggleTheme }
}
