import { motion } from 'framer-motion'
import { getTheme } from '../../themes/themeConfig'
import { CARD_IN_VARIANTS, CARD_OUT_VARIANTS, CARD_RADIUS_MAP, CARD_STYLE_MAP, PHOTO_SHAPE_MAP, BACKDROP_BLUR_MAP } from './animationConfig'

const relationshipLabels = {
  Teman: 'Teman',
  Keluarga: 'Keluarga',
  'Rekan Kerja': 'Rekan Kerja',
  Lainnya: 'Lainnya',
}

export default function TestimonialCard({
  testimonial,
  themeName = 'wedding',
  animIn = 'fade',
  animOut = 'fade',
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
  const theme = getTheme(themeName)
  const inVariant = CARD_IN_VARIANTS[animIn] || CARD_IN_VARIANTS.fade
  const outVariant = CARD_OUT_VARIANTS[animOut] || CARD_OUT_VARIANTS.fade
  const radius = CARD_RADIUS_MAP[cardRadius]?.value || 8
  const styleCfg = CARD_STYLE_MAP[cardStyle] || CARD_STYLE_MAP.glass
  const photoShapeCfg = PHOTO_SHAPE_MAP[photoShape] || PHOTO_SHAPE_MAP.rounded
  const blurValue = BACKDROP_BLUR_MAP[cardBackdropBlur]?.value || 8
  const isDark = cardTextColor === 'dark'

  const cardBgColor = isDark
    ? 'rgba(255,255,255,0.95)'
    : cardStyle === 'bordered'
      ? 'transparent'
      : 'rgba(0,0,0,0.35)'

  const textColor = isDark ? '#1E293B' : '#FFFFFF'
  const mutedColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.65)'
  const overlayPct = Math.min(100, Math.max(0, cardOverlayOpacity)) / 100

  return (
    <motion.div
      variants={{
        initial: inVariant.initial,
        animate: inVariant.animate,
      }}
      initial="initial"
      animate="animate"
      transition={inVariant.transition}
      exit={outVariant.exit}
      whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
      style={{
        width: 176,
        height: 210,
        borderRadius: radius === 999 ? 9999 : radius,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
        boxShadow: cardStyle === 'elevated'
          ? '0 8px 32px rgba(0,0,0,0.2)'
          : '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 30px -4px rgba(0,0,0,0.1)',
        ...(cardStyle === 'bordered' ? { border: '2px solid ' + (isDark ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.3)') } : {}),
        ...(cardStyle === 'solid' ? { backgroundColor: cardBgColor } : {}),
        ...(blurValue > 0 && styleCfg.overlay ? { backdropFilter: `blur(${blurValue}px)` } : {}),
      }}
    >
      {showPhoto && testimonial.photo_url ? (
        <img
          src={testimonial.photo_url}
          alt={testimonial.name}
          className={`absolute inset-0 w-full h-full object-cover ${photoShapeCfg.className}`}
          style={{ willChange: 'transform' }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}CC, ${theme.accent}88)`,
          }}
        >
          <span
            className="text-4xl font-bold opacity-80"
            style={{ color: isDark ? theme.accent : '#FFFFFF' }}
          >
            {testimonial.name.charAt(0)}
          </span>
        </div>
      )}

      {styleCfg.overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,${(0.88 * overlayPct).toFixed(2)}) 0%, rgba(0,0,0,${(0.35 * overlayPct).toFixed(2)}) 40%, rgba(0,0,0,0) 55%)`,
          }}
        />
      )}

      <div
        className="absolute inset-0 flex flex-col justify-end"
        style={{ padding: '10px 10px 9px', textAlign }}
      >
        <p
          className="w-full"
          style={{
            fontFamily: themeName === 'wedding' ? theme.fontHeading : theme.fontBody,
            fontStyle: themeName === 'wedding' ? 'italic' : 'normal',
            fontSize: 9.5,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.3)',
            color: textColor,
          }}
        >
          {showQuote ? `"${testimonial.testimonial}"` : testimonial.testimonial}
        </p>

        <div className="mt-1">
          <h3
            className="font-semibold truncate"
            style={{
              fontFamily: themeName === 'wedding' ? theme.fontHeading : theme.fontBody,
              fontSize: 11.5,
              lineHeight: 1.3,
              textShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
              color: textColor,
            }}
          >
            {testimonial.name}
          </h3>
          {(showRelationship || showDate) && (
            <p
              className="truncate"
              style={{
                fontSize: 9,
                color: mutedColor,
                lineHeight: 1.4,
                textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {showRelationship && (relationshipLabels[testimonial.relationship] || testimonial.relationship)}
              {showRelationship && showDate && ' · '}
              {showDate && new Date(testimonial.created_at).toLocaleDateString('id-ID')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
