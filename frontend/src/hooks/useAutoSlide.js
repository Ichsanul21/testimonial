import { useState, useEffect, useRef, useCallback } from 'react'

export default function useAutoSlide({ totalItems, interval = 8000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems)
  }, [totalItems])

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }, [totalItems])

  useEffect(() => {
    if (isPaused || totalItems === 0) {
      clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(next, interval)
    return () => clearInterval(timerRef.current)
  }, [isPaused, totalItems, interval, next])

  return {
    currentIndex,
    next,
    prev,
    setIndex: setCurrentIndex,
    isPaused,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
  }
}
