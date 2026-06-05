import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import useTestimonials from '../../hooks/useTestimonials'
import { getTheme } from '../../themes/themeConfig'
import TestimonialCard from './TestimonialCard'
import { WeddingDecorations, CorporateDecorations } from './ThemeDecorations'
import BackgroundWaves from './BackgroundWaves'
import Skeleton from '../ui/Skeleton'

const COLS = 5
const CARD_W = 176
const CARD_H = 210
const GAP = 24
const ROWS = 3
const CARD_UNIT = CARD_W + GAP
const SCROLL_DIST = COLS * CARD_UNIT
const ROW_SPEEDS = [22, 28, 19]
const MAX_PER_ROW = 10

function distribute(arr, n) {
  const result = Array.from({ length: n }, () => [])
  arr.forEach((item, i) => result[i % n].push(item))
  return result
}

export default function FloatingDisplay({ themeName = 'wedding', eventSlug = null }) {
  const { testimonials, priorityIds, loading, error } = useTestimonials({ all: true, eventSlug })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const theme = getTheme(themeName)
  const isWedding = themeName === 'wedding'

  const priorityCards = useMemo(() => {
    if (!testimonials?.length || !priorityIds?.length) return []
    return testimonials.filter((t) => priorityIds.includes(t.id))
  }, [testimonials, priorityIds])

  const regularCards = useMemo(() => {
    return (testimonials || []).filter((t) => !(priorityIds || []).includes(t.id))
  }, [testimonials, priorityIds])

  const rowPools = useMemo(() => {
    const [a, b, c] = distribute(regularCards, 2)
    return [a.slice(0, MAX_PER_ROW), priorityCards.slice(0, MAX_PER_ROW), b.slice(0, MAX_PER_ROW)]
  }, [regularCards, priorityCards])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'f') setIsFullscreen((v) => !v)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div
      className={`relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'}`}
      style={{
        minHeight: isFullscreen ? '100vh' : '100%',
        background: theme.background,
        fontFamily: theme.fontBody,
      }}
    >
      {isWedding ? <WeddingDecorations /> : <CorporateDecorations />}
      <BackgroundWaves themeName={themeName} />

      {loading && !testimonials?.length && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ gap: 24 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="176px" height="210px" rounded="xl" />
          ))}
        </div>
      )}

      <div className="h-screen w-screen overflow-hidden flex flex-col justify-center" style={{ gap: 45 }}>
        {[0, 1, 2].map((rowIdx) => {
          const pool = rowPools[rowIdx] || []
          const strip = pool.length > 0 ? [...pool, ...pool] : []

          return (
            <div key={rowIdx} className="relative" style={{ height: CARD_H }}>
              <motion.div
                className="flex absolute left-0 top-0 h-full items-center"
                style={{ gap: GAP, width: 'fit-content' }}
                animate={{ x: [0, -SCROLL_DIST] }}
                transition={{
                  duration: ROW_SPEEDS[rowIdx],
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {strip.map((t, i) => (
                  <div key={`${t.id}-${i}`} className="flex-shrink-0" style={{ width: CARD_W }}>
                    <TestimonialCard testimonial={t} themeName={themeName} index={i} />
                  </div>
                ))}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
