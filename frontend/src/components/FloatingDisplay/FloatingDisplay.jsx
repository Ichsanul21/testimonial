import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import useEventSourceTestimonials from '../../hooks/useEventSourceTestimonials'
import { getTheme } from '../../themes/themeConfig'
import TestimonialCard from './TestimonialCard'
import { WeddingDecorations, CorporateDecorations } from './ThemeDecorations'
import BackgroundWaves from './BackgroundWaves'
import DisplayBranding from './DisplayBranding'
import NewItemOverlay from './NewItemOverlay'
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
  const [displaySettings, setDisplaySettings] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [newItemIndex, setNewItemIndex] = useState(0)
  const [processedNewIds, setProcessedNewIds] = useState(new Set())
  const theme = getTheme(themeName)
  const isWedding = themeName === 'wedding'

  const pollInterval = displaySettings?.poll_interval || 'realtime'
  const { queue, priorityIds, loading, newItems, clearNewItems } = useEventSourceTestimonials({
    eventSlug,
    pollInterval,
  })

  const movement = displaySettings?.animation_movement || 'scroll-left'
  const animIn = displaySettings?.animation_in || 'fade'
  const animOut = displaySettings?.animation_out || 'fade'
  const newItemAnim = displaySettings?.new_item_animation || 'pop-up'
  const newItemDur = displaySettings?.new_item_duration ?? 4
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

  useEffect(() => {
    if (newItems.length > 0) {
      const unprocessed = newItems.filter((item) => !processedNewIds.has(item.id))
      if (unprocessed.length > 0) {
        setNewItemIndex((prev) => prev + 1)
      }
    }
  }, [newItems, processedNewIds])

  const handleNewItemComplete = (item) => {
    setProcessedNewIds((prev) => {
      const next = new Set(prev)
      next.add(item.id)
      return next
    })
    if (newItems.every((ni) => processedNewIds.has(ni.id) || ni.id === item.id)) {
      clearNewItems()
    }
  }

  const priorityCards = useMemo(() => {
    if (!queue?.length || !priorityIds?.length) return []
    return queue.filter((t) => priorityIds.includes(t.id))
  }, [queue, priorityIds])

  const regularCards = useMemo(() => {
    return (queue || []).filter((t) => !(priorityIds || []).includes(t.id))
  }, [queue, priorityIds])

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

      <NewItemOverlay
        queue={newItems}
        currentIndex={Math.max(0, newItemIndex - 1) % Math.max(newItems.length, 1)}
        animationVariant={newItemAnim}
        duration={newItemDur}
        themeName={themeName}
        onComplete={handleNewItemComplete}
      />

      {loading && !queue?.length && (
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
