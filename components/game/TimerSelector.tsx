'use client'

import { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown } from 'lucide-react'
import { TIMER_PRESETS } from '@/constants/game'

interface TimerSelectorProps {
  value: number
  onChange: (seconds: number) => void
  disabled?: boolean
}

export function TimerSelector({ value, onChange, disabled = false }: TimerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(String(value))
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync input value when external value changes
  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    setInputValue(val)
  }

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10)
    if (num && num >= 10 && num <= 600) {
      onChange(num)
    } else {
      setInputValue(String(value))
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur()
      inputRef.current?.blur()
    }
  }

  const handlePresetClick = (preset: number) => {
    onChange(preset)
    setInputValue(String(preset))
    setIsOpen(false)
  }

  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
    }
    return `${seconds}s`
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-1.5 rounded-lg overflow-hidden"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <div className="flex items-center gap-1 pl-2.5 py-1.5">
          <Clock className="w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
          className="w-10 bg-transparent text-center text-sm font-bold outline-none disabled:opacity-50"
          style={{ color: 'var(--foreground)' }}
          title="Segundos (10-600)"
        />
        
        <span className="text-xs font-medium pr-1" style={{ color: 'var(--muted-foreground)' }}>
          s
        </span>

        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="p-1.5 pr-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          aria-label="Seleccionar tiempo predefinido"
        >
          <ChevronDown 
            className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--muted-foreground)' }}
          />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className="absolute top-full left-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50 min-w-[100px]"
          style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
        >
          {TIMER_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className="w-full px-3 py-2 text-left text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              style={{ 
                color: preset === value ? 'var(--primary)' : 'var(--foreground)',
                backgroundColor: preset === value ? 'var(--primary)/10' : 'transparent'
              }}
            >
              {formatTime(preset)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
