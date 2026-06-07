import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TestimonialCard from './TestimonialCard'
import { NEW_ITEM_VARIANTS } from './animationConfig'

export default function NewItemOverlay({ queue, currentIndex, animationVariant = 'pop-up', duration = 4, themeName, onComplete }) {
  const timerRef = useRef(null)
  const item = queue[currentIndex]

  useEffect(() => {
    if (!item) return
    timerRef.current = setTimeout(() => {
      onComplete?.(item)
    }, duration * 1000)
    return () => clearTimeout(timerRef.current)
  }, [item, duration, onComplete])

  if (!item) return null

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
          <TestimonialCard testimonial={item} themeName={themeName} index={0} animIn="fade" animOut="fade" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
