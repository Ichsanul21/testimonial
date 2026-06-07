import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import useTestimonials from '../../hooks/useTestimonials'
import { getTheme } from '../../themes/themeConfig'
import TestimonialCard from './TestimonialCard'
import { WeddingDecorations, CorporateDecorations } from './ThemeDecorations'
import BackgroundWaves from './BackgroundWaves'
import DisplayBranding from './DisplayBranding'
import { MOVEMENT_VARIANTS, getBackgroundStyle } from './animationConfig'
import Skeleton from '../ui/Skeleton'
import api from '../../services/api'

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
  const { testimonials, priorityIds, loading } = useTestimonials({ all: true, eventSlug })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [displaySettings, setDisplaySettings] = useState(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const theme = getTheme(themeName)
  const isWedding = themeName === 'wedding'

  const movement = displaySettings?.animation_movement || 'scroll-left'
  const animIn = displaySettings?.animation_in || 'fade'
  const animOut = displaySettings?.animation_out || 'fade'
  const moveCfg = MOVEMENT_VARIANTS[movement] || MOVEMENT_VARIANTS['scroll-left']

  useEffect(() => {
    if (!eventSlug) return
    api.get(`/events/${eventSlug}/display-settings`)
      .then((res) => setDisplaySettings(res.data))
      .catch(() => setDisplaySettings(null))
  }, [eventSlug])

  useEffect(() => {
    if (movement !== 'carousel') return
    const timer = setInterval(() => {
      setCarouselIdx((i) => i + 1)
    }, 4000)
    return () => clearInterval(timer)
  }, [movement])

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

  const bgStyle = getBackgroundStyle(displaySettings, themeName)

  return (
    <div
      className={`relative overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full'}`}
      style={{
        minHeight: isFullscreen ? '100vh' : '100%',
        ...bgStyle,
        fontFamily: theme.fontBody,
      }}
    >
      {!displaySettings?.background_type || displaySettings?.background_type === 'theme' ? (
        <>
          {isWedding ? <WeddingDecorations /> : <CorporateDecorations />}
          <BackgroundWaves themeName={themeName} />
        </>
      ) : null}

      <DisplayBranding
        displayName={displaySettings?.display_name}
        displayLogoUrl={displaySettings?.display_logo_url}
        eventName={displaySettings?.name}
      />

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

          if (movement === 'float') {
            return (
              <div key={rowIdx} className="relative flex justify-center" style={{ height: CARD_H, gap: GAP }}>
                {pool.map((t, i) => (
                  <div key={t.id} className="flex-shrink-0" style={{ width: CARD_W }}>
                    <motion.div
                      animate={moveCfg.animate()}
                      transition={moveCfg.transition(ROW_SPEEDS[rowIdx], i)}
                    >
                      <TestimonialCard testimonial={t} themeName={themeName} index={i} animIn={animIn} animOut={animOut} />
                    </motion.div>
                  </div>
                ))}
              </div>
            )
          }

          if (movement === 'carousel') {
            const activeIdx = carouselIdx % Math.max(pool.length, 1)
            return (
              <div key={rowIdx} className="relative flex justify-center items-center" style={{ height: CARD_H }}>
                {pool.length > 0 && (
                  <motion.div
                    key={`${pool[activeIdx]?.id}-${carouselIdx}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ width: CARD_W }}
                  >
                    <TestimonialCard
                      testimonial={pool[activeIdx]}
                      themeName={themeName}
                      index={0}
                      animIn={animIn}
                      animOut={animOut}
                    />
                  </motion.div>
                )}
              </div>
            )
          }

          const scrollDist = movement === 'scroll-right' || (movement === 'alternating' && rowIdx % 2 === 1)
            ? -SCROLL_DIST
            : SCROLL_DIST

          return (
            <div key={rowIdx} className="relative" style={{ height: CARD_H }}>
              <motion.div
                className="flex absolute left-0 top-0 h-full items-center"
                style={{ gap: GAP, width: 'fit-content' }}
                animate={{ x: [0, -scrollDist] }}
                transition={{
                  duration: ROW_SPEEDS[rowIdx],
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {strip.map((t, i) => (
                  <div key={`${t.id}-${i}`} className="flex-shrink-0" style={{ width: CARD_W }}>
                    <TestimonialCard testimonial={t} themeName={themeName} index={i} animIn={animIn} animOut={animOut} />
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
