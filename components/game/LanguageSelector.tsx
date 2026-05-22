'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useI18n } from '@/hooks/use-i18n'
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, Locale } from '@/lib/i18n/translations'

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (next: Locale) => {
    setLocale(next)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-2 rounded-xl transition-all active:scale-90"
        style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
        aria-label={t('language')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={t('language')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-bold">{LOCALE_SHORT[locale]}</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 rounded-xl shadow-lg overflow-hidden z-50 min-w-[140px]"
          style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
          role="listbox"
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              role="option"
              aria-selected={code === locale}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              style={{ color: code === locale ? 'var(--primary)' : 'var(--foreground)' }}
            >
              <span>{LOCALE_LABELS[code]}</span>
              {code === locale && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
