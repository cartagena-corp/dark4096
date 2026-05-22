'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react'
import {
  Locale,
  TranslationKey,
  translations,
  detectLocale,
  DEFAULT_LOCALE,
} from '@/lib/i18n/translations'
import { saveLocale, loadLocale } from '@/lib/storage/persist'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  // Start from the default locale so the server render and the first client
  // render match; the real locale is resolved right after mount.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = loadLocale()
    // Honor a manual choice; otherwise auto-detect (browser language / location).
    const initial = stored ?? detectLocale()
    setLocaleState(initial)
    document.documentElement.lang = initial
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    saveLocale(next)
    document.documentElement.lang = next
  }, [])

  const t = useCallback(
    (key: TranslationKey) =>
      translations[locale][key] ?? translations[DEFAULT_LOCALE][key] ?? key,
    [locale]
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}
