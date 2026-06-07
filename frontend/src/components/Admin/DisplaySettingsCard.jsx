import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import { MOVEMENT_VARIANTS, CARD_IN_VARIANTS, CARD_OUT_VARIANTS } from '../FloatingDisplay/animationConfig'

export default function DisplaySettingsCard({ eventId: propEventId, apiPrefix = '/admin', showEventSelector = false }) {
  const [eventId, setEventId] = useState(propEventId || '')
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)

  const [form, setForm] = useState({
    display_name: '',
    background_type: 'theme',
    background_value: '',
    animation_movement: 'scroll-left',
    animation_in: 'fade',
    animation_out: 'fade',
  })

  useEffect(() => {
    if (!showEventSelector) return
    setLoadingEvents(true)
    api.get(`${apiPrefix}/events`)
      .then((res) => setEvents(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingEvents(false))
  }, [showEventSelector, apiPrefix])

  useEffect(() => {
    if (propEventId) setEventId(propEventId)
  }, [propEventId])

  const fetchSettings = useCallback(async () => {
    if (!eventId) return
    setLoading(true)
    try {
      const { data } = await api.get(`${apiPrefix}/events/${eventId}/display-settings`)
      setForm({
        display_name: data.display_name || '',
        background_type: data.background_type || 'theme',
        background_value: data.background_value || '',
        animation_movement: data.animation_movement || 'scroll-left',
        animation_in: data.animation_in || 'fade',
        animation_out: data.animation_out || 'fade',
      })
      setLogoPreview(data.display_logo_url || null)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [eventId, apiPrefix])

  useEffect(() => { if (eventId) fetchSettings() }, [fetchSettings, eventId])

  const handleSave = async () => {
    if (!eventId) return
    setSaving(true)
    try {
      await api.put(`${apiPrefix}/events/${eventId}/display-settings`, form)
      alert('Display settings berhasil disimpan')
    } catch (e) {
      alert('Gagal menyimpan: ' + (e.response?.data?.message || e.message))
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !eventId) return

    setUploading(true)
    const fd = new FormData()
    fd.append('logo', file)

    try {
      const { data } = await api.post(`${apiPrefix}/events/${eventId}/upload-logo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setLogoPreview(data.display_logo_url)
      alert('Logo berhasil diupload')
    } catch (err) {
      alert('Gagal upload logo: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  if (showEventSelector) {
    return (
      <div className="space-y-6">
        {loadingEvents ? (
          <div className="animate-pulse h-32 bg-slate-100 rounded-xl" />
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Acara</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              <option value="">-- Pilih acara --</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.icon} {ev.name}</option>
              ))}
            </select>
          </div>
        )}

        {eventId && loading && (
          <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />
        )}

        {eventId && !loading && (
          <>
            <SettingsForm
              form={form}
              update={update}
              logoPreview={logoPreview}
              uploading={uploading}
              onLogoUpload={handleLogoUpload}
              saving={saving}
              onSave={handleSave}
            />
          </>
        )}
      </div>
    )
  }

  if (!eventId) {
    return <div className="text-center py-12 text-slate-400">ID acara tidak tersedia</div>
  }

  if (loading) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />
  }

  return (
    <SettingsForm
      form={form}
      update={update}
      logoPreview={logoPreview}
      uploading={uploading}
      onLogoUpload={handleLogoUpload}
      saving={saving}
      onSave={handleSave}
    />
  )
}

function SettingsForm({ form, update, logoPreview, uploading, onLogoUpload, saving, onSave }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Branding Display</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Nama di Display</label>
          <p className="text-xs text-slate-400 mb-2">Kosongkan untuk menggunakan nama acara</p>
          <input
            value={form.display_name}
            onChange={(e) => update('display_name', e.target.value)}
            placeholder="Masukkan nama untuk display"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Logo Display</label>
          <p className="text-xs text-slate-400 mb-2">PNG, JPG, SVG, WebP. Maks 2MB</p>
          <div className="flex items-center gap-4">
            {logoPreview && (
              <div className="w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
            <label className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer transition">
              {uploading ? 'Mengupload...' : 'Pilih Logo'}
              <input type="file" accept="image/png,image/jpg,image/jpeg,image/svg+xml,image/webp" onChange={onLogoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Background</h3>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { id: 'theme', label: 'Tema', icon: '🎨' },
            { id: 'color', label: 'Warna', icon: '🟣' },
            { id: 'gradient', label: 'Gradien', icon: '🌈' },
            { id: 'image', label: 'Gambar', icon: '🖼️' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => update('background_type', opt.id)}
              className={`p-3 rounded-xl text-center text-sm font-medium transition ${
                form.background_type === opt.id
                  ? 'bg-teal-50 text-teal-700 border-2 border-teal-300'
                  : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
              }`}
            >
              <div className="text-lg mb-1">{opt.icon}</div>
              {opt.label}
            </button>
          ))}
        </div>

        {form.background_type === 'color' && (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.background_value || '#0A0A14'}
              onChange={(e) => update('background_value', e.target.value)}
              className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer"
            />
            <input
              value={form.background_value || ''}
              onChange={(e) => update('background_value', e.target.value)}
              placeholder="#0A0A14"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono"
            />
          </div>
        )}

        {form.background_type === 'gradient' && (
          <div>
            <input
              value={form.background_value || ''}
              onChange={(e) => update('background_value', e.target.value)}
              placeholder="linear-gradient(135deg, #0A0A14, #1A1525)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">Gunakan CSS gradient syntax</p>
          </div>
        )}

        {form.background_type === 'image' && (
          <div>
            <input
              value={form.background_value || ''}
              onChange={(e) => update('background_value', e.target.value)}
              placeholder="https://example.com/background.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
            <p className="text-xs text-slate-400 mt-1">URL gambar background</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Animasi</h3>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">Gerakan Ucapan</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(MOVEMENT_VARIANTS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => update('animation_movement', key)}
                className={`p-3 rounded-xl text-center text-sm font-medium transition ${
                  form.animation_movement === key
                    ? 'bg-teal-50 text-teal-700 border-2 border-teal-300'
                    : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                }`}
              >
                <div className="text-lg mb-1">{val.icon}</div>
                <div>{val.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Animasi Masuk</label>
            <div className="space-y-1">
              {Object.entries(CARD_IN_VARIANTS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => update('animation_in', key)}
                  className={`w-full p-2.5 rounded-xl text-sm font-medium text-left transition ${
                    form.animation_in === key
                      ? 'bg-teal-50 text-teal-700 border-2 border-teal-300'
                      : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                  }`}
                >
                  {val.description}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Animasi Keluar</label>
            <div className="space-y-1">
              {Object.entries(CARD_OUT_VARIANTS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => update('animation_out', key)}
                  className={`w-full p-2.5 rounded-xl text-sm font-medium text-left transition ${
                    form.animation_out === key
                      ? 'bg-teal-50 text-teal-700 border-2 border-teal-300'
                      : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                  }`}
                >
                  {val.description}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition"
        >
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan Display'}
        </button>
      </div>
    </div>
  )
}
