import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useEventSourceTestimonials from '../../hooks/useEventSourceTestimonials'
import { getTheme } from '../../themes/themeConfig'
import TestimonialCard from './TestimonialCard'
import { WeddingDecorations, CorporateDecorations } from './ThemeDecorations'
import BackgroundWaves from './BackgroundWaves'
import DisplayBranding from './DisplayBranding'
import NewItemOverlay from './NewItemOverlay'
import {
  MOVEMENT_VARIANTS, CARD_IN_VARIANTS, CARD_OUT_VARIANTS, NEW_ITEM_VARIANTS,
  SCROLL_SPEED_MAP, CARD_GAP_MAP, getBackgroundStyle,
} from './animationConfig'
import Skeleton from '../ui/Skeleton'
import api from '../../services/api'

const COLS = 5
const CARD_W = 176
const BASE_CARD_H = 210
const ROW_GAP = 45
const BASE_ROW_SPEEDS = [22, 28, 19]
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
  const [processedNewIds, setProcessedNewIds] = useState(new Set())
  const [hoveredRow, setHoveredRow] = useState(null)
  const [dataReceived, setDataReceived] = useState(false)
  const theme = getTheme(themeName)
  const isWedding = themeName === 'wedding'

  const pollInterval = displaySettings?.poll_interval || 'realtime'
  const { queue, priorityIds, loading, newItems, clearNewItems } = useEventSourceTestimonials({
    eventSlug,
    pollInterval,
  })

  useEffect(() => {
    if (queue?.length > 0) setDataReceived(true)
  }, [queue])

  const activeNewItems = useMemo(() => {
    return newItems.filter((item) => !processedNewIds.has(item.id))
  }, [newItems, processedNewIds])

  const movement = displaySettings?.animation_movement || 'scroll-left'
  const movementExtra = displaySettings?.animation_movement_extra || null
  const effectiveMovement = movementExtra && MOVEMENT_VARIANTS[movementExtra] ? movementExtra : movement
  const animIn = displaySettings?.animation_in || 'fade'
  const animOut = displaySettings?.animation_out || 'fade'
  const animInExtra = displaySettings?.animation_in_extra || null
  const animOutExtra = displaySettings?.animation_out_extra || null
  const effectiveIn = animInExtra && CARD_IN_VARIANTS[animInExtra] ? animInExtra : animIn
  const effectiveOut = animOutExtra && CARD_OUT_VARIANTS[animOutExtra] ? animOutExtra : animOut
  const newItemAnim = displaySettings?.new_item_animation || 'pop-up'
  const newItemAnimExtra = displaySettings?.new_item_animation_extra || null
  const effectiveNewItem = newItemAnimExtra && NEW_ITEM_VARIANTS[newItemAnimExtra] ? newItemAnimExtra : newItemAnim
  const newItemDur = displaySettings?.new_item_duration ?? 4
  const scrollSpeed = displaySettings?.scroll_speed || 'normal'
  const speedMultiplier = SCROLL_SPEED_MAP[scrollSpeed]?.multiplier || 1
  const cardRadius = displaySettings?.card_radius || 'md'
  const cardStyle = displaySettings?.card_style || 'glass'
  const cardTextColor = displaySettings?.card_text_color || 'light'
  const textAlign = displaySettings?.text_align || 'left'
  const showPhoto = displaySettings?.show_photo ?? true
  const showQuote = displaySettings?.show_quote ?? false
  const showDate = displaySettings?.show_date ?? true
  const showRelationship = displaySettings?.show_relationship ?? true
  const cardGap = displaySettings?.card_gap || 'md'
  const visibleRows = displaySettings?.visible_rows ?? 3
  const pauseOnHover = displaySettings?.pause_on_hover ?? false
  const photoShape = displaySettings?.photo_shape || 'rounded'
  const cardBackdropBlur = displaySettings?.card_backdrop_blur || 'md'
  const cardOverlayOpacity = displaySettings?.card_overlay_opacity ?? 88
  const titleFont = displaySettings?.title_font || 'playfair'
  const titleSize = displaySettings?.title_size || 'lg'
  const bannerStyle = displaySettings?.banner_style || 'glass'
  const bannerPosition = displaySettings?.banner_position || 'top'

  const moveCfg = MOVEMENT_VARIANTS[effectiveMovement] || MOVEMENT_VARIANTS['scroll-left']
  const gap = CARD_GAP_MAP[cardGap]?.value || 24
  const CARD_UNIT = CARD_W + gap

  const ROW_SPEEDS = useMemo(() => {
    const n = Math.max(2, Math.min(5, visibleRows))
    return Array.from({ length: n }, (_, i) => BASE_ROW_SPEEDS[i % BASE_ROW_SPEEDS.length])
  }, [visibleRows])

  useEffect(() => {
    if (!eventSlug) return
    api.get(`/events/${eventSlug}/display-settings`)
      .then((res) => setDisplaySettings(res.data))
      .catch(() => setDisplaySettings(null))
  }, [eventSlug])

  useEffect(() => {
    if (effectiveMovement !== 'carousel') return
    const timer = setInterval(() => {
      setCarouselIdx((i) => i + 1)
    }, 4000)
    return () => clearInterval(timer)
  }, [effectiveMovement])

  const handleNewItemComplete = useCallback((item) => {
    setProcessedNewIds((prev) => {
      const next = new Set(prev)
      next.add(item.id)
      return next
    })
  }, [])

  useEffect(() => {
    if (activeNewItems.length === 0 && newItems.length > 0 && processedNewIds.size > 0) {
      setProcessedNewIds(new Set())
      clearNewItems()
    }
  }, [activeNewItems, newItems, processedNewIds, clearNewItems])

  const allCards = useMemo(() => {
    if (!queue?.length) return []
    if (!priorityIds?.length) return queue
    const priority = queue.filter((t) => priorityIds.includes(t.id))
    const regular = queue.filter((t) => !priorityIds.includes(t.id))
    return [...priority, ...regular]
  }, [queue, priorityIds])

  const numRows = Math.max(2, Math.min(5, visibleRows))
  const rowPools = useMemo(() => {
    return distribute(allCards, numRows).map((pool) => pool.slice(0, MAX_PER_ROW))
  }, [allCards, numRows])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'f') setIsFullscreen((v) => !v)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const cardProps = {
    themeName,
    animIn: effectiveIn,
    animOut: effectiveOut,
    cardRadius,
    cardStyle,
    cardTextColor,
    textAlign,
    showPhoto,
    showQuote,
    showDate,
    showRelationship,
    photoShape,
    cardBackdropBlur,
    cardOverlayOpacity,
  }

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
        eventName={displaySettings?.name || displaySettings?.display_name || ''}
        titleFont={titleFont}
        titleSize={titleSize}
        bannerStyle={bannerStyle}
        bannerPosition={bannerPosition}
      />

      <NewItemOverlay
        queue={activeNewItems}
        animationVariant={effectiveNewItem}
        duration={newItemDur}
        themeName={themeName}
        onComplete={handleNewItemComplete}
        {...cardProps}
      />

      {(!dataReceived || loading) && !queue?.length && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ gap }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="176px" height="210px" rounded="xl" />
          ))}
        </div>
      )}

      <div
        className="h-screen w-screen overflow-hidden flex flex-col justify-center"
        style={{ gap: ROW_GAP }}
      >
        {Array.from({ length: numRows }, (_, rowIdx) => {
          const pool = rowPools[rowIdx] || []

          if (effectiveMovement === 'float' || effectiveMovement === 'random') {
            return (
              <div
                key={rowIdx}
                className="relative flex justify-center"
                style={{ height: BASE_CARD_H, gap }}
                onMouseEnter={pauseOnHover ? () => setHoveredRow(rowIdx) : undefined}
                onMouseLeave={pauseOnHover ? () => setHoveredRow(null) : undefined}
              >
                {pool.map((t, i) => (
                  <div key={t.id} className="flex-shrink-0" style={{ width: CARD_W }}>
                    <motion.div
                      animate={hoveredRow === rowIdx ? { y: 0, x: 0 } : moveCfg.animate(0, i)}
                      transition={hoveredRow === rowIdx ? { duration: 0.3 } : moveCfg.transition(ROW_SPEEDS[rowIdx] * speedMultiplier, i)}
                    >
                      <TestimonialCard testimonial={t} {...cardProps} />
                    </motion.div>
                  </div>
                ))}
              </div>
            )
          }

          if (effectiveMovement === 'carousel') {
            const activeIdx = carouselIdx % Math.max(pool.length, 1)
            return (
              <div key={rowIdx} className="relative flex justify-center items-center" style={{ height: BASE_CARD_H }}>
                <AnimatePresence mode="wait">
                  {pool.length > 0 && (
                    <motion.div
                      key={`${pool[activeIdx]?.id}-${carouselIdx}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      style={{ width: CARD_W }}
                    >
                      <TestimonialCard testimonial={pool[activeIdx]} {...cardProps} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }

          const copies = Math.max(3, Math.ceil((COLS + 2) / Math.max(pool.length, 1)))
          const strip = Array.from({ length: copies }, () => pool).flat()
          const scrollDist = strip.length * CARD_UNIT

          return (
            <div
              key={rowIdx}
              className="relative"
              style={{ height: BASE_CARD_H }}
              onMouseEnter={pauseOnHover ? () => setHoveredRow(rowIdx) : undefined}
              onMouseLeave={pauseOnHover ? () => setHoveredRow(null) : undefined}
            >
              <motion.div
                className="flex absolute left-0 top-0 h-full items-center"
                style={{ gap, width: 'fit-content' }}
                animate={hoveredRow === rowIdx ? { x: 0 } : moveCfg.animate(scrollDist, rowIdx)}
                transition={hoveredRow === rowIdx ? { duration: 0.3 } : moveCfg.transition(ROW_SPEEDS[rowIdx] * speedMultiplier, rowIdx)}
              >
                {strip.map((t, i) => (
                  <div key={`${t.id}-${i}`} className="flex-shrink-0" style={{ width: CARD_W }}>
                    <TestimonialCard testimonial={t} {...cardProps} />
                  </div>
                ))}
              </motion.div>
            </div>
          )
        })}
      </div>

      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  )
}
