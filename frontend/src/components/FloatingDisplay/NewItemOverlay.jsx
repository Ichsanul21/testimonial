import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TestimonialCard from './TestimonialCard'
import { NEW_ITEM_VARIANTS } from './animationConfig'

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
  const timerRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const queueLengthRef = useRef(queue.length)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    queueLengthRef.current = queue.length
  }, [queue.length])

  const item = queue[currentIndex]

  useEffect(() => {
    if (!item) {
      setCurrentIndex(0)
      return
    }
    timerRef.current = setTimeout(() => {
      const nextIdx = currentIndex + 1
      if (nextIdx >= queueLengthRef.current) {
        onCompleteRef.current?.(item)
        setCurrentIndex(0)
      } else {
        setCurrentIndex(nextIdx)
      }
    }, duration * 1000)
    return () => clearTimeout(timerRef.current)
  }, [item, currentIndex, duration])

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
          {...variant}
          style={{ width: 280 }}
        >
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
