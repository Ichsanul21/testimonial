import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { IconClipboard, IconCalendar, IconPin } from '../ui/Icons'

export default function EventsManager({ onSelect }) {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'
  const apiPrefix = isSuperAdmin ? '/admin' : '/event-admin'

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', date: '', location: '', icon: '', color: '#3b82f6' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get(`${apiPrefix}/events`)
      setEvents(data.data || [])
    } catch {
    } finally {
      setLoading(false)
    }
  }, [apiPrefix])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/admin/events', form)
      setShowForm(false)
      setForm({ name: '', description: '', date: '', location: '', icon: '', color: '#3b82f6' })
      fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal membuat acara')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus acara "${name}"? Testimonial terkait harus dihapus dulu.`)) return
    try {
      await api.delete(`/admin/events/${id}`)
      fetchEvents()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Gagal menghapus')
    }
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-100 rounded-xl" />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Daftar Acara</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition"
        >
          + Acara Baru
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-800 mb-4">Buat Acara Baru</h3>
            {error && <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Acara" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi (opsional)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lokasi (opsional)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon (opsional)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full h-[42px] rounded-xl border border-slate-200 cursor-pointer" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {events.length === 0 && (
          <div className="text-center py-12 text-slate-400">Belum ada acara</div>
        )}
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-sm transition cursor-pointer"
            onClick={() => onSelect?.(event.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{event.icon ? <span>{event.icon}</span> : <IconClipboard className="w-8 h-8 text-slate-300" />}</span>
                <div>
                  <h3 className="font-medium text-slate-800">{event.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {event.date && <span className="inline-flex items-center gap-1"><IconCalendar size="w-3.5 h-3.5" /> {event.date}</span>} {event.location && <span className="inline-flex items-center gap-1 ml-2"><IconPin size="w-3.5 h-3.5" /> {event.location}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                  {event.testimonials_count || 0} testimonial
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(event.id, event.name) }}
                  className="text-red-400 hover:text-red-600 transition text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
