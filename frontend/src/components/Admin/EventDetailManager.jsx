import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import TestimonialTable from './TestimonialTable'
import DisplaySettingsCard from './DisplaySettingsCard'
import { useAuth } from '../../contexts/AuthContext'

export default function EventDetailManager({ eventId, onBack }) {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'
  const apiPrefix = isSuperAdmin ? '/admin' : '/event-admin'

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('info')

  const fetchEvent = useCallback(async () => {
    try {
      const { data } = await api.get(`${apiPrefix}/events/${eventId}`)
      setEvent(data.event || data)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [eventId, apiPrefix])

  useEffect(() => { fetchEvent() }, [fetchEvent])

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />
  }

  if (!event) {
    return <div className="text-center py-12 text-slate-400">Event tidak ditemukan</div>
  }

  const formUrl = `${window.location.origin}/form?acara=${event.slug}`
  const displayUrl = `${window.location.origin}/display/${event.slug}`

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-sm text-teal-600 hover:text-teal-700 font-medium">
        ← Kembali ke daftar acara
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{event.icon || '📋'}</span>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{event.name}</h2>
          <p className="text-sm text-slate-400">/{event.slug}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['info', ...(isSuperAdmin ? ['admins'] : []), 'display', 'qr', 'testimonials'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'text-slate-500 hover:bg-slate-50 border border-transparent'
            }`}
          >
              {t === 'info' ? 'Info' : t === 'admins' ? 'Admin' : t === 'display' ? 'Display' : t === 'qr' ? 'QR Code' : 'Testimonial'}
          </button>
        ))}
      </div>

      {tab === 'info' && <EventInfoPanel event={event} onUpdate={fetchEvent} isEditable={isSuperAdmin} apiPrefix={apiPrefix} />}
      {tab === 'admins' && isSuperAdmin && <EventAdminsPanel eventId={eventId} />}
      {tab === 'display' && (
        <div className="max-w-2xl">
          <DisplaySettingsCard eventId={event.id} apiPrefix={apiPrefix} />
        </div>
      )}
      {tab === 'qr' && <EventQRPanel event={event} formUrl={formUrl} displayUrl={displayUrl} onRegenerate={fetchEvent} apiPrefix={apiPrefix} />}
      {tab === 'testimonials' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <TestimonialTable eventId={eventId} />
        </div>
      )}
    </div>
  )
}

function EventInfoPanel({ event, onUpdate, isEditable = true, apiPrefix = '/admin' }) {
  const [form, setForm] = useState({
    name: event.name,
    description: event.description || '',
    date: event.date || '',
    location: event.location || '',
    icon: event.icon || '',
    color: event.color || '#3b82f6',
    banned_words: event.banned_words || '',
  })
  const [saving, setSaving] = useState(false)
  const [bwSaving, setBwSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/admin/events/${event.id}`, form)
      onUpdate?.()
    } catch {}
    setSaving(false)
  }

  const handleSaveBannedWords = async () => {
    setBwSaving(true)
    try {
      await api.post(`${apiPrefix}/events/${event.id}/banned-words`, { banned_words: form.banned_words })
      onUpdate?.()
    } catch {}
    setBwSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama Acara</label>
          <input required value={form.name} onChange={(e) => isEditable && setForm({ ...form, name: e.target.value })} readOnly={!isEditable} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${!isEditable ? 'bg-slate-50 text-slate-500' : 'border-slate-200'}`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
          <input value={form.icon} onChange={(e) => isEditable && setForm({ ...form, icon: e.target.value })} readOnly={!isEditable} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${!isEditable ? 'bg-slate-50 text-slate-500' : 'border-slate-200'}`} placeholder="💍" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 border-slate-200`} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
          <input type="date" value={form.date} onChange={(e) => isEditable && setForm({ ...form, date: e.target.value })} readOnly={!isEditable} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${!isEditable ? 'bg-slate-50 text-slate-500' : 'border-slate-200'}`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
          <input value={form.location} onChange={(e) => isEditable && setForm({ ...form, location: e.target.value })} readOnly={!isEditable} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 ${!isEditable ? 'bg-slate-50 text-slate-500' : 'border-slate-200'}`} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-700">Warna Tema:</label>
        <input type="color" value={form.color} onChange={(e) => isEditable && setForm({ ...form, color: e.target.value })} className={`w-10 h-10 rounded-lg border cursor-pointer ${!isEditable ? 'opacity-50 pointer-events-none' : ''}`} />
        <span className="text-xs text-slate-400">{form.color}</span>
      </div>

      <hr className="border-slate-100" />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Kata Terlarang</label>
        <p className="text-xs text-slate-400 mb-2">Pisahkan dengan koma. Testimonial yang mengandung kata ini akan ditolak.</p>
        <textarea
          value={form.banned_words}
          onChange={(e) => setForm({ ...form, banned_words: e.target.value })}
          rows={3}
          placeholder="contoh: anjing, babi, sial"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
      </div>

      {isEditable ? (
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button type="button" onClick={handleSaveBannedWords} disabled={bwSaving} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition">
            {bwSaving ? 'Menyimpan...' : 'Simpan Kata Terlarang'}
          </button>
        </div>
      )}
    </div>
  )
}

function EventAdminsPanel({ eventId }) {
  const [admins, setAdmins] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [adminsRes, usersRes] = await Promise.all([
        api.get(`/admin/events/${eventId}/admins`),
        api.get('/admin/users'),
      ])
      setAdmins(adminsRes.data.data || [])
      setUsers(usersRes.data.data || [])
    } catch {}
    setLoading(false)
  }, [eventId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAssign = async () => {
    if (!selectedUserId) return
    try {
      await api.post(`/admin/events/${eventId}/admins`, { user_id: selectedUserId })
      setSelectedUserId('')
      fetchData()
    } catch {}
  }

  const handleRemove = async (userId) => {
    try {
      await api.delete(`/admin/events/${eventId}/admins/${userId}`)
      fetchData()
    } catch {}
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post(`/admin/events/${eventId}/admins/create`, form)
      setShowCreate(false)
      setForm({ name: '', email: '', password: '' })
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal membuat admin')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-xl" />

  const availableUsers = users.filter((u) => u.role === 'event_admin' && !admins?.find((a) => a.id === u.id))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Admin Acara</h3>
        <button
          onClick={() => { setShowCreate(true); setError(''); setForm({ name: '', email: '', password: '' }) }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition"
        >
          + Baru
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-800 mb-4">Tambah Admin Baru</h3>
            {error && (
              <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">{error}</div>
            )}
            <form onSubmit={handleCreate} className="space-y-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Batal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {admins?.length === 0 && <p className="text-sm text-slate-400">Belum ada admin</p>}
        {admins?.map((admin) => (
          <div key={admin.id} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-700">{admin.name}</p>
              <p className="text-xs text-slate-400">{admin.email}</p>
            </div>
            <button onClick={() => handleRemove(admin.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Hapus</button>
          </div>
        ))}
      </div>

      {availableUsers.length > 0 && (
        <div className="flex gap-3 pt-2 border-t border-slate-100">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            <option value="">Pilih admin...</option>
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button onClick={handleAssign} disabled={!selectedUserId} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 transition">
            Tambah
          </button>
        </div>
      )}
    </div>
  )
}

function EventQRPanel({ event, formUrl, displayUrl, onRegenerate, apiPrefix = '/admin' }) {
  const qrEndpoint = apiPrefix === '/event-admin' ? 'refresh-qr' : 'regenerate-qr'
  const [regenerating, setRegenerating] = useState(false)

  const handleRegenerate = async () => {
    if (!confirm('Regenerate QR code? QR lama tidak akan bisa digunakan lagi.')) return
    setRegenerating(true)
    try {
      await api.post(`${apiPrefix}/events/${event.id}/${qrEndpoint}`)
      onRegenerate()
    } catch {}
    setRegenerating(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="font-semibold text-slate-800 mb-4">QR Code Acara</h3>

      <div className="flex flex-col items-center">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm inline-block mb-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(formUrl)}`}
            alt="QR Code"
            className="w-48 h-48"
          />
        </div>

        <p className="text-sm text-slate-500 mb-2">QR ini mengarah ke:</p>
        <div className="bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-600 font-mono border border-slate-200 w-full text-center break-all mb-4">
          {formUrl}
        </div>

        <div className="flex gap-3">
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(formUrl)}`}
            download
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            Download QR
          </a>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition"
          >
            {regenerating ? 'Memproses...' : 'Regenerate QR'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 w-full">
          <p className="text-sm text-slate-500 mb-2">Halaman Display:</p>
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            {displayUrl} ↗
          </a>
        </div>
      </div>
    </div>
  )
}
