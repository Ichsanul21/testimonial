import { EVENT_ICONS } from './Icons'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function EventIcon({ icon, name, size = 'w-16 h-16', textSize = 'text-xl' }) {
  const known = EVENT_ICONS.find((e) => e.id === icon)

  if (known) {
    return (
      <div className={`${size} flex items-center justify-center`}>
        <known.Icon className="w-full h-full" />
      </div>
    )
  }

  if (!icon) {
    const initials = getInitials(name)
    return (
      <div
        className={`${size} rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold ${textSize}`}
      >
        {initials}
      </div>
    )
  }

  return <span className={size.replace('w-', 'text-').replace('h-', '').split(' ')[0]}>{icon}</span>
}
