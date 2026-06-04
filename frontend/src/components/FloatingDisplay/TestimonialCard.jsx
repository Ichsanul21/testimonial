import { motion } from 'framer-motion'
import { getTheme } from '../../themes/themeConfig'

const relationshipLabels = {
  Teman: 'Teman',
  Keluarga: 'Keluarga',
  'Rekan Kerja': 'Rekan Kerja',
  Lainnya: 'Lainnya',
}

export default function TestimonialCard({ testimonial, themeName = 'wedding', index = 0 }) {
  const theme = getTheme(themeName)

  const floatDur = 3.5 + (index % 3) * 0.4
  const tiltDur = 4.5 + (index % 2) * 0.5
  const floatDelay = (index % 10) * 0.15

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
      style={{
        width: 176,
        height: 210,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 30px -4px rgba(0,0,0,0.1)',
      }}
    >
      {testimonial.photo_url ? (
        <img
          src={testimonial.photo_url}
          alt={testimonial.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform' }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}CC, ${theme.accent}88)`,
          }}
        >
          <span className="text-4xl font-bold text-white opacity-80">
            {testimonial.name.charAt(0)}
          </span>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 55%)',
        }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col justify-end"
        style={{ padding: '10px 10px 9px' }}
        animate={{
          y: [0, -10, -3, -14, -6, 4, 0],
          rotate: [0, -0.8, 0.5, -1.2, 0.3, 0.8, 0],
        }}
        transition={{
          y: { duration: floatDur, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
          rotate: { duration: tiltDur, repeat: Infinity, ease: 'easeInOut', delay: floatDelay + 0.3 },
        }}
      >
        <p
          className="text-white w-full"
          style={{
            fontFamily: themeName === 'wedding' ? theme.fontHeading : theme.fontBody,
            fontStyle: themeName === 'wedding' ? 'italic' : 'normal',
            fontSize: 9.5,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          "{testimonial.testimonial}"
        </p>

        <div className="mt-1">
          <h3
            className="text-white font-semibold truncate"
            style={{
              fontFamily: themeName === 'wedding' ? theme.fontHeading : theme.fontBody,
              fontSize: 11.5,
              lineHeight: 1.3,
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            {testimonial.name}
          </h3>
          <p
            className="truncate"
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.4,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            {relationshipLabels[testimonial.relationship] || testimonial.relationship}
            {' · '}
            {new Date(testimonial.created_at).toLocaleDateString('id-ID')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
