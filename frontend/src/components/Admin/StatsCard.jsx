import { useEffect, useState } from 'react'

function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const to = value
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(from + (to - from) * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{display}</span>
}

export default function StatsCard({ icon, label, value, color = 'teal' }) {
  const colors = {
    teal: 'from-teal-500 to-emerald-500',
    blue: 'from-blue-500 to-indigo-500',
    amber: 'from-amber-500 to-orange-500',
    slate: 'from-slate-500 to-slate-600',
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800">
            <AnimatedNumber value={value} />
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
