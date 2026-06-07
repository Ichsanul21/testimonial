import { motion } from 'framer-motion'

export default function DisplayBranding({ displayName, displayLogoUrl, eventName }) {
  const title = displayName || eventName
  if (!title && !displayLogoUrl) return null

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center pt-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {displayLogoUrl && (
        <img
          src={displayLogoUrl}
          alt={title}
          className="h-14 object-contain mb-2 drop-shadow-lg"
          style={{ maxWidth: 200 }}
        />
      )}
      {title && (
        <h1
          className="text-white text-2xl font-bold tracking-wide text-center px-6"
          style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            fontFamily: '"Playfair Display", serif',
          }}
        >
          {title}
        </h1>
      )}
    </motion.div>
  )
}
