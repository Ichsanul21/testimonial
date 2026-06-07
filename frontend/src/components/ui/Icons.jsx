export function IconChat({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

export function IconClipboard({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="8" y1="9" x2="16" y2="9" />
      <line x1="8" y1="13" x2="14" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  )
}

export function IconCalendar({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function IconGear({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

export function IconMonitor({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

export function IconPhone({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  )
}

export function IconUsers({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

export function IconPalette({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9-10-9z" />
    </svg>
  )
}

export function IconDroplet({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  )
}

export function IconGradient({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="grad-icon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#grad-icon)" />
    </svg>
  )
}

export function IconImage({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

export function IconArrowLeft({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

export function IconArrowRight({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function IconArrowUpRight({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

export function IconRing({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 00-5 5v2a5 5 0 0010 0V7a5 5 0 00-5-5z" />
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  )
}

export function IconPin({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function IconPencil({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z" />
      <line x1="15" y1="5" x2="19" y2="9" />
    </svg>
  )
}

export function IconSearch({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function IconParty({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12a4 4 0 008 0" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
      <path d="M12 16a2 2 0 002-2h-4a2 2 0 002 2z" />
    </svg>
  )
}

export function IconArrowLeftRight({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="9 8 5 12 9 16" />
      <polyline points="15 8 19 12 15 16" />
    </svg>
  )
}

export function IconDove({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 4 6 4 10v2c0 3.31 2.69 6 6 6h4c3.31 0 6-2.69 6-6v-2c0-4-4-8-8-8z" />
      <path d="M12 18v4" />
      <path d="M8 22h8" />
      <path d="M12 2c2.5 0 4 2 4 4 0 2-1.5 4-4 4" />
    </svg>
  )
}

export function IconCarousel({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <line x1="2" y1="18" x2="22" y2="18" />
      <line x1="9" y1="2" x2="9" y2="6" />
      <line x1="15" y1="2" x2="15" y2="6" />
    </svg>
  )
}

export function IconArrowLeftSlim({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

export function IconArrowRightSlim({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function IconPlus({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export function IconPlay({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export function IconHeart({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}

export function IconStar({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export function IconGift({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
    </svg>
  )
}

export function IconCake({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c0 2.21 2.24 4 5 4s5-1.79 5-4-2.24-4-5-4-5 1.79-5 4z" />
      <path d="M12 15c0 2.21 2.24 4 5 4s5-1.79 5-4-2.24-4-5-4-5 1.79-5 4z" />
      <path d="M7 11V7" />
      <path d="M17 11V7" />
      <path d="M12 11V4" />
      <circle cx="12" cy="3" r="1" />
    </svg>
  )
}

export function IconMusic({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export function IconBriefcase({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
    </svg>
  )
}

export function IconTrophy({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 6 9 6 9z" />
      <path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 18 9 18 9z" />
      <path d="M4 22h16" />
      <path d="M10 22V12" />
      <path d="M14 22V12" />
      <rect x="8" y="2" width="8" height="10" rx="1" />
    </svg>
  )
}

export function IconMinus({ className = 'w-5 h-5', size }) {
  return (
    <svg className={size || className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export const ICON_MAP = {
  IconChat,
  IconClipboard,
  IconCalendar,
  IconGear,
  IconMonitor,
  IconPhone,
  IconUsers,
  IconPalette,
  IconDroplet,
  IconGradient,
  IconImage,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconRing,
  IconPin,
  IconPencil,
  IconSearch,
  IconParty,
  IconArrowLeftRight,
  IconDove,
  IconCarousel,
  IconArrowLeftSlim,
  IconArrowRightSlim,
  IconPlus,
  IconPlay,
  IconMinus,
  IconHeart,
  IconStar,
  IconGift,
  IconCake,
  IconMusic,
  IconBriefcase,
  IconTrophy,
}

export const EVENT_ICONS = [
  { id: 'ring', label: 'Ring', Icon: IconRing },
  { id: 'heart', label: 'Heart', Icon: IconHeart },
  { id: 'star', label: 'Star', Icon: IconStar },
  { id: 'gift', label: 'Gift', Icon: IconGift },
  { id: 'cake', label: 'Cake', Icon: IconCake },
  { id: 'music', label: 'Music', Icon: IconMusic },
  { id: 'briefcase', label: 'Briefcase', Icon: IconBriefcase },
  { id: 'trophy', label: 'Trophy', Icon: IconTrophy },
  { id: 'party', label: 'Party', Icon: IconParty },
  { id: 'dove', label: 'Dove', Icon: IconDove },
]

export function getIcon(name, props = {}) {
  const Icon = ICON_MAP[name]
  return Icon ? <Icon {...props} /> : null
}
