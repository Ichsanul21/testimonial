import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import heroBg from '../assets/hero.png'

export default function EventDetailPage() {
  const { slug } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    api.get(`/events/${slug}`)
      .then((res) => setEvent(res.data))
      .catch(() => setError('Acara tidak ditemukan'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Acara Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const formUrl = `${window.location.origin}/form?acara=${event.slug}`
  const displayUrl = `${window.location.origin}/display/${event.slug}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="max-w-2xl mx-auto px-4 py-12 relative">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">{event.icon || '📋'}</div>
          <h1 className="text-3xl font-bold text-slate-800 font-serif mb-2">
            {event.name}
          </h1>
          {event.description && (
            <p className="text-slate-500 max-w-md mx-auto">{event.description}</p>
          )}
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
            {event.date && <span>📅 {event.date}</span>}
            {event.location && <span>📍 {event.location}</span>}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 text-center mb-6">
            Scan QR Code untuk Memberi Testimonial
          </h2>
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(formUrl)}`}
                alt="QR Code"
                className="w-56 h-56"
              />
            </div>
          </div>
          <p className="text-center text-sm text-slate-400 mb-4">
            Scan QR di atas atau buka link berikut:
          </p>
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-600 text-center break-all font-mono border border-slate-200">
            {formUrl}
          </div>
          <div className="flex justify-center mt-4">
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium text-sm hover:from-teal-600 hover:to-emerald-600 transition"
            >
              ✏️ Beri Testimonial
            </a>
          </div>
        </div>

        <div className="text-center">
          <Link
            to={`/display/${event.slug}`}
            className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Lihat Testimonial yang Masuk →
          </Link>
        </div>
      </div>
    </div>
  )
}
