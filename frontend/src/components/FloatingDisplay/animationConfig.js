import { getTheme } from '../../themes/themeConfig'

export const SCROLL_SPEED_MAP = {
  slow: { label: 'Lambat', multiplier: 1.5 },
  normal: { label: 'Normal', multiplier: 1 },
  fast: { label: 'Cepat', multiplier: 0.7 },
}

export const FONT_MAP = {
  playfair: { label: 'Playfair Display', family: '"Playfair Display", serif', category: 'serif' },
  inter: { label: 'Inter', family: 'Inter, sans-serif', category: 'sans' },
  montserrat: { label: 'Montserrat', family: 'Montserrat, sans-serif', category: 'sans' },
  poppins: { label: 'Poppins', family: 'Poppins, sans-serif', category: 'sans' },
  lora: { label: 'Lora', family: 'Lora, serif', category: 'serif' },
  'dancing-script': { label: 'Dancing Script', family: '"Dancing Script", cursive', category: 'hand' },
  'great-vibes': { label: 'Great Vibes', family: '"Great Vibes", cursive', category: 'hand' },
  roboto: { label: 'Roboto', family: 'Roboto, sans-serif', category: 'sans' },
}

export const TITLE_SIZE_MAP = {
  sm: { label: 'Kecil', fontSize: 20 },
  md: { label: 'Sedang', fontSize: 26 },
  lg: { label: 'Besar', fontSize: 32 },
  xl: { label: 'XL', fontSize: 40 },
}

export const BANNER_STYLE_MAP = {
  glass: { label: 'Glass', className: 'bg-white/10 backdrop-blur-md border border-white/20' },
  solid: { label: 'Solid', className: 'bg-teal-600/80' },
  gradient: { label: 'Gradient', className: 'bg-gradient-to-r from-teal-600/80 to-emerald-600/80' },
}

export const CARD_RADIUS_MAP = {
  sm: { label: 'Kotak', value: 4 },
  md: { label: 'Standar', value: 8 },
  lg: { label: 'Agak Bulat', value: 12 },
  xl: { label: 'Bulat', value: 16 },
  '2xl': { label: 'Lebih Bulat', value: 20 },
  full: { label: 'Pill', value: 999 },
}

export const CARD_STYLE_MAP = {
  glass: { label: 'Glass', cardClass: 'backdrop-blur-xl border border-white/20', overlay: true },
  solid: { label: 'Solid', cardClass: 'shadow-xl', overlay: true },
  bordered: { label: 'Border', cardClass: 'border-2 border-white/30 bg-transparent', overlay: false },
  elevated: { label: 'Elevated', cardClass: 'shadow-2xl', overlay: true },
}

export const CARD_GAP_MAP = {
  sm: { label: 'Rapat', value: 16 },
  md: { label: 'Sedang', value: 24 },
  lg: { label: 'Lebar', value: 32 },
}

export const PHOTO_SHAPE_MAP = {
  circle: { label: 'Lingkaran', className: 'rounded-full' },
  rounded: { label: 'Bulat', className: 'rounded-lg' },
  square: { label: 'Kotak', className: 'rounded-none' },
}

export const BACKDROP_BLUR_MAP = {
  none: { label: 'Tanpa Blur', value: 0 },
  sm: { label: 'Ringan', value: 4 },
  md: { label: 'Sedang', value: 8 },
  lg: { label: 'Kuat', value: 16 },
}

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
  bounce: {
    animate: (scrollDist) => ({ x: [0, -scrollDist] }),
    transition: (speed) => ({
      duration: speed,
      repeat: Infinity,
      ease: 'easeOut',
    }),
    description: 'Bounce scroll',
    icon: 'IconBounce',
  },
  waterfall: {
    animate: (scrollDist, rowIdx) => ({
      x: [0, -scrollDist],
      y: rowIdx % 2 === 0 ? [0, -3, 0, 3, 0] : [0, 3, 0, -3, 0],
    }),
    transition: (speed, rowIdx) => ({
      x: { duration: speed, repeat: Infinity, ease: 'linear' },
      y: { duration: speed * 0.2, repeat: Infinity, ease: 'easeInOut', delay: (rowIdx % 3) * 0.3 },
    }),
    description: 'Air terjun (cascade)',
    icon: 'IconWaterfall',
  },
  'v-scroll': {
    animate: () => ({ y: [0, -300] }),
    transition: (speed) => ({
      duration: speed * 1.5,
      repeat: Infinity,
      ease: 'linear',
    }),
    description: 'Scroll vertikal',
    icon: 'IconArrowUp',
  },
  random: {
    animate: (_, idx) => ({
      x: [0, (idx % 2 === 0 ? 1 : -1) * (12 + (idx % 5) * 3), 0, -(idx % 2 === 0 ? 1 : -1) * (8 + (idx % 4) * 2), 0],
      y: [0, -(6 + (idx % 3) * 4), 0, 8 + (idx % 2) * 5, 0],
    }),
    transition: (speed, idx) => ({
      x: { duration: speed * 0.25 + (idx % 3) * 0.1, repeat: Infinity, ease: 'easeInOut' },
      y: { duration: speed * 0.2 + (idx % 2) * 0.15, repeat: Infinity, ease: 'easeInOut' },
    }),
    description: 'Random float',
    icon: 'IconRandom',
  },
  wave: {
    animate: (scrollDist, rowIdx) => ({
      x: [0, -scrollDist],
      rotate: rowIdx % 2 === 0 ? [0, 2, 0, -2, 0] : [0, -2, 0, 2, 0],
    }),
    transition: (speed, rowIdx) => ({
      x: { duration: speed, repeat: Infinity, ease: 'linear' },
      rotate: { duration: speed * 0.15, repeat: Infinity, ease: 'easeInOut', delay: (rowIdx % 2) * 0.2 },
    }),
    description: 'Ombak bergelombang',
    icon: 'IconWave',
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
  zoom: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: 'easeOut' },
    description: 'Zoom dari kecil',
  },
  flip: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    transition: { duration: 0.7, ease: 'easeOut' },
    description: 'Flip 3D masuk',
  },
  rotate: {
    initial: { opacity: 0, rotate: -180, scale: 0.5 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.7, ease: 'easeOut' },
    description: 'Rotasi masuk',
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.6, ease: 'easeOut' },
    description: 'Blur → clear',
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
  zoom: {
    exit: { opacity: 0, scale: 0.3 },
    transition: { duration: 0.4, ease: 'easeIn' },
    description: 'Zoom keluar',
  },
  flip: {
    exit: { opacity: 0, rotateY: -90 },
    transition: { duration: 0.5, ease: 'easeIn' },
    description: 'Flip 3D keluar',
  },
  rotate: {
    exit: { opacity: 0, rotate: 180, scale: 0.5 },
    transition: { duration: 0.5, ease: 'easeIn' },
    description: 'Rotasi keluar',
  },
  blur: {
    exit: { opacity: 0, filter: 'blur(10px)' },
    transition: { duration: 0.4, ease: 'easeIn' },
    description: 'Blur keluar',
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
  typewriter: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
    description: 'Typewriter teks',
  },
  spin: {
    initial: { opacity: 0, rotate: -360, scale: 0 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.8, ease: 'easeOut' },
    description: 'Spin masuk',
  },
  expand: {
    initial: { opacity: 0, scaleX: 0.01, scaleY: 0.01 },
    animate: { opacity: 1, scaleX: 1, scaleY: 1 },
    transition: { type: 'spring', stiffness: 120, damping: 14 },
    description: 'Mengembang',
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
