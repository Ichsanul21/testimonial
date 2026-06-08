import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TestimonialCard from './TestimonialCard'
import { NEW_ITEM_VARIANTS } from './animationConfig'

const MERGE_DURATION = 500

export default function NewItemOverlay({
  queue,
  animationVariant = 'pop-up',
  duration = 4,
  themeName,
  onComplete,
  cardRadius = 'md',
  cardStyle = 'glass',
  cardTextColor = 'light',
  textAlign = 'left',
  showPhoto = true,
  showQuote = false,
  showDate = true,
  showRelationship = true,
  photoShape = 'rounded',
  cardBackdropBlur = 'md',
  cardOverlayOpacity = 88,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState(null)
  const timerRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  const showMs = useMemo(() => Math.max(duration * 1000 - MERGE_DURATION, 1000), [duration])

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const item = queue[currentIndex]

  useEffect(() => {
    if (!item) {
      setCurrentIndex(0)
      setPhase(null)
      return
    }
    let cancelled = false
    setPhase('show')
    timerRef.current = setTimeout(() => {
      if (cancelled) return
      setPhase('merge')
      timerRef.current = setTimeout(() => {
        if (cancelled) return
        const nextIdx = currentIndex + 1
        if (nextIdx >= queue.length) {
          onCompleteRef.current?.(item)
          setCurrentIndex(0)
        } else {
          setCurrentIndex(nextIdx)
        }
        setPhase(null)
      }, MERGE_DURATION)
    }, showMs)
    return () => {
      cancelled = true
      clearTimeout(timerRef.current)
    }
  }, [item, currentIndex, queue.length, showMs])

  if (!item || queue.length === 0) return null

  const variant = NEW_ITEM_VARIANTS[animationVariant] || NEW_ITEM_VARIANTS['pop-up']

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative"
          style={{ width: 280 }}
          animate={{
            scale: phase === 'show' ? 1.12 : 1,
            boxShadow: phase === 'show'
              ? '0 0 30px rgba(6, 182, 212, 0.35), 0 0 60px rgba(6, 182, 212, 0.15)'
              : 'none',
          }}
          transition={{
            scale: phase === 'merge' ? { duration: 0.5, ease: 'easeInOut' } : { duration: 0.3 },
            boxShadow: phase === 'merge' ? { duration: 0.5, ease: 'easeInOut' } : { duration: 0.3 },
          }}
          {...variant}
        >
          <AnimatePresence>
            {phase === 'show' && (
              <motion.div
                className="absolute -top-2 -right-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(6, 182, 212, 0.4)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.25 }}
              >
                NEW
              </motion.div>
            )}
          </AnimatePresence>
          <TestimonialCard
            testimonial={item}
            themeName={themeName}
            animIn="fade"
            animOut="fade"
            cardRadius={cardRadius}
            cardStyle={cardStyle}
            cardTextColor={cardTextColor}
            textAlign={textAlign}
            showPhoto={showPhoto}
            showQuote={showQuote}
            showDate={showDate}
            showRelationship={showRelationship}
            photoShape={photoShape}
            cardBackdropBlur={cardBackdropBlur}
            cardOverlayOpacity={cardOverlayOpacity}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
