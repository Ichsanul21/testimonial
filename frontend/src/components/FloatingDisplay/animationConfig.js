export const MOVEMENT_VARIANTS = {
  'scroll-left': {
    animate: (scrollDist) => ({ x: [0, -scrollDist] }),
    transition: (speed) => ({
      duration: speed,
      repeat: Infinity,
      ease: 'linear',
    }),
    description: 'Geser ke kiri (default)',
    icon: 'IconArrowLeftSlim',
  },
  'scroll-right': {
    animate: (scrollDist) => ({ x: [-scrollDist, 0] }),
    transition: (speed) => ({
      duration: speed,
      repeat: Infinity,
      ease: 'linear',
    }),
    description: 'Geser ke kanan',
    icon: 'IconArrowRightSlim',
  },
  alternating: {
    animate: (scrollDist, rowIdx) => ({
      x: rowIdx % 2 === 0 ? [0, -scrollDist] : [-scrollDist, 0],
    }),
    transition: (speed) => ({
      duration: speed,
      repeat: Infinity,
      ease: 'linear',
    }),
    description: 'Baris bergantian arah',
    icon: 'IconArrowLeftRight',
  },
  float: {
    animate: () => ({ y: [0, -6, 0, 6, 0] }),
    transition: (speed) => ({
      duration: speed * 0.3,
      repeat: Infinity,
      ease: 'easeInOut',
    }),
    description: 'Melayang di tempat',
    icon: 'IconDove',
  },
  carousel: {
    animate: () => ({ scale: [0.85, 1, 0.85], opacity: [0.4, 1, 0.4] }),
    transition: (speed) => ({
      duration: speed * 0.15,
      repeat: Infinity,
      ease: 'easeInOut',
    }),
    description: 'Karusel (fade tengah)',
    icon: 'IconCarousel',
  },
}

export const CARD_IN_VARIANTS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
    description: 'Fade masuk',
  },
  scale: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
    description: 'Scale masuk',
  },
  slide: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
    description: 'Slide masuk',
  },
}

export const CARD_OUT_VARIANTS = {
  fade: {
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: 'easeIn' },
    description: 'Fade keluar',
  },
  scale: {
    exit: { opacity: 0, scale: 0.5 },
    transition: { duration: 0.4, ease: 'easeIn' },
    description: 'Scale keluar',
  },
  slide: {
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.4, ease: 'easeIn' },
    description: 'Slide keluar',
  },
}

export const NEW_ITEM_VARIANTS = {
  'pop-up': {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 200, damping: 18 },
    description: 'Pop-up (scale)',
  },
  'slide-in': {
    initial: { opacity: 0, x: 300 },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring', stiffness: 120, damping: 18 },
    description: 'Slide dari kanan',
  },
  glow: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' },
    description: 'Fade + glow',
  },
  bounce: {
    initial: { opacity: 0, scale: 0, y: 100 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { type: 'spring', stiffness: 150, damping: 10, bounce: 0.5 },
    description: 'Bounce masuk',
  },
  flip: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.7, ease: 'easeOut' },
    description: 'Flip 3D',
  },
  none: {
    initial: {},
    animate: {},
    transition: { duration: 0 },
    description: 'Langsung masuk',
  },
}

export function getBackgroundStyle(displaySettings, themeName) {
  if (!displaySettings) {
    return { background: getTheme(themeName).background }
  }

  const { background_type, background_value } = displaySettings

  switch (background_type) {
    case 'color':
      return { backgroundColor: background_value || getTheme(themeName).background }
    case 'gradient':
      return { background: background_value || getTheme(themeName).background }
    case 'image':
      return {
        backgroundImage: `url(${background_value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    case 'theme':
    default:
      return { background: getTheme(themeName).background }
  }
}


