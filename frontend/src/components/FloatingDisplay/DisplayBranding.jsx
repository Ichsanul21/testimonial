import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FONT_MAP, TITLE_SIZE_MAP, BANNER_STYLE_MAP } from './animationConfig'
import Skeleton from '../ui/Skeleton'

const positionClasses = {
  top: 'top-0 pt-6',
  'top-center': 'top-1/3 -translate-y-1/2',
  center: 'top-1/2 -translate-y-1/2',
}

export default function DisplayBranding({
  displayName,
  displayLogoUrl,
  eventName,
  titleFont = 'playfair',
  titleSize = 'lg',
  bannerStyle = 'glass',
  bannerPosition = 'top',
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const title = displayName || eventName

  useEffect(() => {
    if (!displayLogoUrl) {
      setImageLoaded(true)
      return
    }
    setImageLoaded(false)
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.onerror = () => setImageLoaded(true)
    img.src = displayLogoUrl
  }, [displayLogoUrl])

  if (!title && !displayLogoUrl) return null

  const fontCfg = FONT_MAP[titleFont] || FONT_MAP.playfair
  const sizeCfg = TITLE_SIZE_MAP[titleSize] || TITLE_SIZE_MAP.lg
  const bannerCfg = BANNER_STYLE_MAP[bannerStyle] || BANNER_STYLE_MAP.glass
  const posClass = positionClasses[bannerPosition] || positionClasses.top

  return (
    <motion.div
      className={`absolute left-0 right-0 z-30 pointer-events-none flex flex-col items-center ${posClass}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={`px-8 py-4 rounded-2xl ${bannerCfg.className}`} style={{ maxWidth: '90vw' }}>
        {displayLogoUrl && !imageLoaded && (
          <div className="flex justify-center mb-2">
            <Skeleton width="120px" height="56px" rounded="lg" />
          </div>
        )}
        {displayLogoUrl && imageLoaded && (
          <img
            src={displayLogoUrl}
            alt={title}
            className="h-14 object-contain mb-2 drop-shadow-lg mx-auto"
            style={{ maxWidth: 200 }}
          />
        )}
        {title && (
          <h1
            className="font-bold tracking-wide text-center"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              fontFamily: fontCfg.family,
              fontSize: sizeCfg.fontSize,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h1>
        )}
      </div>
    </motion.div>
  )
}
