import { motion } from 'framer-motion'

const BLOBS = [
  {
    colors: {
      wedding: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent)',
      corporate: 'radial-gradient(circle, rgba(13,148,136,0.15), transparent)',
    },
    initX: '10%', initY: '8%', size: 500,
    moveX: [0, 140, -70, 90, 0], moveY: [0, -110, 80, -50, 0], dur: 24,
  },
  {
    colors: {
      wedding: 'radial-gradient(circle, rgba(246,226,122,0.1), transparent)',
      corporate: 'radial-gradient(circle, rgba(20,184,166,0.08), transparent)',
    },
    initX: '55%', initY: '45%', size: 420,
    moveX: [0, -100, 130, -80, 0], moveY: [0, 90, -60, 110, 0], dur: 30,
  },
  {
    colors: {
      wedding: 'radial-gradient(circle, rgba(180,120,200,0.1), transparent)',
      corporate: 'radial-gradient(circle, rgba(27,42,74,0.08), transparent)',
    },
    initX: '25%', initY: '70%', size: 360,
    moveX: [0, 80, -110, 60, 0], moveY: [0, -70, 100, -90, 0], dur: 26,
  },
]

export default function BackgroundWaves({ themeName = 'wedding' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: blob.initX,
            top: blob.initY,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: blob.colors[themeName],
            filter: 'blur(80px)',
            willChange: 'transform',
          }}
          animate={{ x: blob.moveX, y: blob.moveY }}
          transition={{
            duration: blob.dur,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
