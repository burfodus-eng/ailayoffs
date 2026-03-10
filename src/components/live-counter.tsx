'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Info, Play, Pause } from 'lucide-react'

interface CounterState {
  baseValue: number
  ratePerSecond: number
  lastUpdatedAt: string
}

interface LiveCounterProps {
  /** Which counter to display */
  counterType: 'ai_layoff' | 'robot_layoff' | 'both'
  /** Static fallback value (from server-rendered stats) */
  staticValue: number
  /** Last updated date string for static display */
  lastUpdated: string | null
}

export function LiveCounter({ counterType, staticValue, lastUpdated }: LiveCounterProps) {
  const [counter, setCounter] = useState<CounterState | null>(null)
  const [currentValue, setCurrentValue] = useState(staticValue)
  const [isLive, setIsLive] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)
  const rafRef = useRef<number>(0)
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Fetch counter state from API
  useEffect(() => {
    fetch('/api/live-counter')
      .then(r => r.json())
      .then(data => {
        if (data[counterType]) {
          setCounter(data[counterType])
        }
      })
      .catch(() => {}) // silently fail, show static
  }, [counterType])

  // Animate the counter
  const animate = useCallback(() => {
    if (!counter || !isLive) return

    const elapsed = (Date.now() - new Date(counter.lastUpdatedAt).getTime()) / 1000
    const interpolated = counter.baseValue + elapsed * counter.ratePerSecond
    setCurrentValue(Math.floor(interpolated))

    rafRef.current = requestAnimationFrame(animate)
  }, [counter, isLive])

  useEffect(() => {
    if (counter && isLive) {
      rafRef.current = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(rafRef.current)
    }
    if (!isLive) {
      setCurrentValue(staticValue)
    }
  }, [counter, isLive, animate, staticValue])

  const toggleLive = () => setIsLive(prev => !prev)

  const handleInfoEnter = () => {
    clearTimeout(tooltipTimeout.current)
    setShowTooltip(true)
  }
  const handleInfoLeave = () => {
    tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 200)
  }

  const formattedValue = currentValue.toLocaleString()

  return (
    <div className="relative inline-flex flex-col items-center">
      <div className="text-6xl sm:text-7xl md:text-8xl font-bold tabular-nums text-gray-900 dark:text-[var(--dark-text)]">
        {formattedValue}
      </div>

      {/* Tiny controls row */}
      <div className="flex items-center gap-1.5 mt-1">
        {counter && (
          <>
            <button
              onClick={toggleLive}
              className="p-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
              title={isLive ? 'Pause live counter' : 'Resume live counter'}
            >
              {isLive ? (
                <Pause className="h-2.5 w-2.5" />
              ) : (
                <Play className="h-2.5 w-2.5" />
              )}
            </button>

            {isLive && (
              <span className="flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] text-gray-300 dark:text-gray-600 uppercase tracking-wider">live</span>
              </span>
            )}

            {!isLive && lastUpdated && (
              <span className="text-[8px] text-gray-300 dark:text-gray-600">
                as of {lastUpdated.split('T')[0]}
              </span>
            )}

            <div className="relative" onMouseEnter={handleInfoEnter} onMouseLeave={handleInfoLeave}>
              <button className="p-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
                <Info className="h-2.5 w-2.5" />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-2.5 py-2 bg-gray-900 dark:bg-gray-800 text-white text-[10px] leading-relaxed rounded shadow-lg z-50">
                  Live display interpolated at the current rate of change since last data update. Corrected daily when new data is added.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
