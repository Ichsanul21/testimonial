import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import {
  MOVEMENT_VARIANTS, CARD_IN_VARIANTS, CARD_OUT_VARIANTS, NEW_ITEM_VARIANTS,
  FONT_MAP, TITLE_SIZE_MAP, BANNER_STYLE_MAP,
  CARD_RADIUS_MAP, CARD_STYLE_MAP, SCROLL_SPEED_MAP,
  CARD_GAP_MAP, PHOTO_SHAPE_MAP, BACKDROP_BLUR_MAP,
} from '../FloatingDisplay/animationConfig'
import { IconPalette, IconDroplet, IconGradient, IconImage, getIcon } from '../ui/Icons'

const EXTRA_MOVEMENTS = ['bounce', 'waterfall', 'v-scroll', 'random', 'wave']
const EXTRA_IN_OUT = ['zoom', 'flip', 'rotate', 'blur']
const EXTRA_NEW_ITEM = ['typewriter', 'spin', 'expand']

export default function DisplaySettingsCard({ eventId: propEventId, apiPrefix = '/admin', showEventSelector = false }) {
  const [eventId, setEventId] = useState(propEventId || '')
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  const [form, setForm] = useState({
    display_name: '',
    background_type: 'theme',
    background_value: '',
    animation_movement: 'scroll-left',
    animation_in: 'fade',
    animation_out: 'fade',
    new_item_animation: 'pop-up',
    new_item_duration: 4,
    poll_interval: 'realtime',
    animation_movement_extra: null,
    animation_in_extra: null,
    animation_out_extra: null,
    new_item_animation_extra: null,
    title_font: 'playfair',
    title_size: 'lg',
    banner_style: 'glass',
    banner_position: 'top',
    card_radius: 'md',
    card_style: 'glass',
    card_text_color: 'light',
    text_align: 'left',
    show_photo: true,
    show_quote: false,
    scroll_speed: 'normal',
    show_date: true,
    show_relationship: true,
    card_gap: 'md',
    visible_rows: 3,
    pause_on_hover: false,
    photo_shape: 'rounded',
    card_backdrop_blur: 'md',
    card_overlay_opacity: 88,
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
        new_item_animation: data.new_item_animation || 'pop-up',
        new_item_duration: data.new_item_duration ?? 4,
        poll_interval: data.poll_interval || 'realtime',
        animation_movement_extra: data.animation_movement_extra || null,
        animation_in_extra: data.animation_in_extra || null,
        animation_out_extra: data.animation_out_extra || null,
        new_item_animation_extra: data.new_item_animation_extra || null,
        title_font: data.title_font || 'playfair',
        title_size: data.title_size || 'lg',
        banner_style: data.banner_style || 'glass',
        banner_position: data.banner_position || 'top',
        card_radius: data.card_radius || 'md',
        card_style: data.card_style || 'glass',
        card_text_color: data.card_text_color || 'light',
        text_align: data.text_align || 'left',
        show_photo: data.show_photo ?? true,
        show_quote: data.show_quote ?? false,
        scroll_speed: data.scroll_speed || 'normal',
        show_date: data.show_date ?? true,
        show_relationship: data.show_relationship ?? true,
        card_gap: data.card_gap || 'md',
        visible_rows: data.visible_rows ?? 3,
        pause_on_hover: data.pause_on_hover ?? false,
        photo_shape: data.photo_shape || 'rounded',
        card_backdrop_blur: data.card_backdrop_blur || 'md',
        card_overlay_opacity: data.card_overlay_opacity ?? 88,
      })
      setLogoPreview(data.display_logo_url || null)
      setFetchError(null)
    } catch (e) {
      setFetchError(e.response?.data?.message || e.message || 'Gagal memuat pengaturan display')
    } finally {
      setLoading(false)
    }
  }, [eventId, apiPrefix])

  useEffect(() => { if (eventId) fetchSettings() }, [fetchSettings, eventId])

  const handleSave = async () => {
    if (!eventId) return
    setSaving(true)
    try {
      const boolFields = ['show_photo', 'show_quote', 'show_date', 'show_relationship', 'pause_on_hover']
      const payload = { ...form }
      for (const field of boolFields) {
        payload[field] = payload[field] ? '1' : '0'
      }
      await api.put(`${apiPrefix}/events/${eventId}/display-settings`, payload)
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

  const effectiveMovement = form.animation_movement_extra && EXTRA_MOVEMENTS.includes(form.animation_movement_extra)
    ? form.animation_movement_extra
    : form.animation_movement

  const effectiveIn = form.animation_in_extra && EXTRA_IN_OUT.includes(form.animation_in_extra)
    ? form.animation_in_extra
    : form.animation_in

  const effectiveOut = form.animation_out_extra && EXTRA_IN_OUT.includes(form.animation_out_extra)
    ? form.animation_out_extra
    : form.animation_out

  const effectiveNewItem = form.new_item_animation_extra && EXTRA_NEW_ITEM.includes(form.new_item_animation_extra)
    ? form.new_item_animation_extra
    : form.new_item_animation

  const allMovements = [
    ...Object.entries(MOVEMENT_VARIANTS).filter(([k]) => !EXTRA_MOVEMENTS.includes(k)),
    ...Object.entries(MOVEMENT_VARIANTS).filter(([k]) => EXTRA_MOVEMENTS.includes(k)),
  ]

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
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>
        )}

        {eventId && loading && (
          <div className="animate-pulse h-64 bg-slate-100 rounded-xl" />
        )}

        {eventId && !loading && fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Gagal memuat pengaturan</p>
            <p className="text-red-500 text-sm">{fetchError}</p>
            <button
              onClick={fetchSettings}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {eventId && !loading && !fetchError && (
          <SettingsForm
            form={form}
            update={update}
            logoPreview={logoPreview}
            uploading={uploading}
            onLogoUpload={handleLogoUpload}
            saving={saving}
            onSave={handleSave}
            eventId={eventId}
            apiPrefix={apiPrefix}
            allMovements={allMovements}
            effectiveMovement={effectiveMovement}
            effectiveIn={effectiveIn}
            effectiveOut={effectiveOut}
            effectiveNewItem={effectiveNewItem}
          />
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

  if (fetchError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium mb-2">Gagal memuat pengaturan</p>
        <p className="text-red-500 text-sm">{fetchError}</p>
        <button
          onClick={fetchSettings}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
        >
          Coba Lagi
        </button>
      </div>
    )
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
      eventId={eventId}
      apiPrefix={apiPrefix}
      allMovements={allMovements}
      effectiveMovement={effectiveMovement}
      effectiveIn={effectiveIn}
      effectiveOut={effectiveOut}
      effectiveNewItem={effectiveNewItem}
    />
  )
}

function GradientBuilder({ value, onChange }) {
  const [mode, setMode] = useState('visual')
  const parsed = parseGradient(value)
  const [c1, setC1] = useState(parsed.color1 || '#0A0A14')
  const [c2, setC2] = useState(parsed.color2 || '#1A1525')
  const [angle, setAngle] = useState(parsed.angle ?? 135)

  useEffect(() => {
    const p = parseGradient(value)
    if (p.color1) setC1(p.color1)
    if (p.color2) setC2(p.color2)
    if (p.angle != null) setAngle(p.angle)
  }, [value])

  useEffect(() => {
    if (mode !== 'visual') return
    const grad = `linear-gradient(${angle}deg, ${c1}, ${c2})`
    if (grad !== value) onChange(grad)
  }, [c1, c2, angle, mode])

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('visual')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${mode === 'visual' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}
        >
          Visual
        </button>
        <button
          type="button"
          onClick={() => setMode('custom')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${mode === 'custom' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}
        >
          Custom CSS
        </button>
      </div>

      {mode === 'visual' ? (
        <div className="space-y-3">
          <div
            className="h-16 rounded-xl border border-slate-200"
            style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }}
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Warna Awal</label>
              <div className="flex items-center gap-2">
                <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                <input value={c1} onChange={(e) => setC1(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Warna Akhir</label>
              <div className="flex items-center gap-2">
                <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                <input value={c2} onChange={(e) => setC2(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Sudut: {angle}°</label>
            <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full accent-teal-500" />
          </div>
        </div>
      ) : (
        <div>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="linear-gradient(135deg, #0A0A14, #1A1525)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono"
          />
          <p className="text-xs text-slate-400 mt-1">Gunakan CSS gradient syntax</p>
        </div>
      )}
    </div>
  )
}

function parseGradient(str) {
  if (!str) return {}
  const match = str.match(/linear-gradient\((\d+)deg,\s*(#[^,]+),\s*(#[^)]+)\)/)
  if (match) {
    return { angle: parseInt(match[1]), color1: match[2].trim(), color2: match[3].trim() }
  }
  return {}
}

function ImageUpload({ value, onChange, eventId, apiPrefix }) {
  const [mode, setMode] = useState('url')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !eventId) return
    setUploading(true)
    const fd = new FormData()
    fd.append('background', file)
    try {
      const { data } = await api.post(`${apiPrefix}/events/${eventId}/upload-background`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange(data.background_value)
    } catch (err) {
      alert('Gagal upload: ' + (err.response?.data?.message || err.message))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${mode === 'url' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${mode === 'upload' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}
        >
          Upload
        </button>
      </div>

      {value && (
        <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-50">
          <img src={value} alt="Background preview" className="w-full h-full object-cover" />
        </div>
      )}

      {mode === 'url' ? (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/background.jpg"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
      ) : (
        <label className={`flex items-center justify-center px-4 py-8 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-teal-300 transition ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm text-slate-400">{uploading ? 'Mengupload...' : 'Klik untuk pilih gambar'}</p>
            <p className="text-xs text-slate-300 mt-1">JPG, PNG, WebP. Maks 2MB</p>
          </div>
          <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  )
}

function SettingsForm({
  form, update, logoPreview, uploading, onLogoUpload, saving, onSave,
  eventId, apiPrefix, allMovements, effectiveMovement, effectiveIn, effectiveOut, effectiveNewItem,
}) {
  const OptionBtn = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl text-center text-sm font-medium transition ${
        active
          ? 'bg-teal-50 text-teal-700 border-2 border-teal-300'
          : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  )

  const toggle = (key) => {
    if (key === 'animation_movement') {
      update('animation_movement_extra', null)
    }
    if (key === 'animation_in') {
      update('animation_in_extra', null)
    }
    if (key === 'animation_out') {
      update('animation_out_extra', null)
    }
    if (key === 'new_item_animation') {
      update('new_item_animation_extra', null)
    }
  }

  const selectMovement = (key) => {
    if (EXTRA_MOVEMENTS.includes(key)) {
      update('animation_movement_extra', key)
    } else {
      update('animation_movement', key)
      update('animation_movement_extra', null)
    }
  }

  const selectIn = (key) => {
    if (EXTRA_IN_OUT.includes(key)) {
      update('animation_in_extra', key)
    } else {
      update('animation_in', key)
      update('animation_in_extra', null)
    }
  }

  const selectOut = (key) => {
    if (EXTRA_IN_OUT.includes(key)) {
      update('animation_out_extra', key)
    } else {
      update('animation_out', key)
      update('animation_out_extra', null)
    }
  }

  const selectNewItem = (key) => {
    if (EXTRA_NEW_ITEM.includes(key)) {
      update('new_item_animation_extra', key)
    } else {
      update('new_item_animation', key)
      update('new_item_animation_extra', null)
    }
  }

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
        <h3 className="font-semibold text-slate-800 mb-4">Font &amp; Banner</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Font Judul</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(FONT_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.title_font === key} onClick={() => update('title_font', key)}>
                <span style={{ fontFamily: val.family }} className="text-sm">{val.label}</span>
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Ukuran Judul</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(TITLE_SIZE_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.title_size === key} onClick={() => update('title_size', key)}>
                <div className="text-sm">{val.label}</div>
                <div className="text-xs text-slate-400">{val.fontSize}px</div>
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Style Banner</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(BANNER_STYLE_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.banner_style === key} onClick={() => update('banner_style', key)}>
                {val.label}
              </OptionBtn>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Posisi Banner</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'top', label: 'Atas' },
              { id: 'top-center', label: 'Tengah Atas' },
              { id: 'center', label: 'Tengah' },
            ].map((opt) => (
              <OptionBtn key={opt.id} active={form.banner_position === opt.id} onClick={() => update('banner_position', opt.id)}>
                {opt.label}
              </OptionBtn>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Tampilan Kartu</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Bentuk Kartu</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Object.entries(CARD_RADIUS_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.card_radius === key} onClick={() => update('card_radius', key)}>
                <div className={`mx-auto w-8 h-8 bg-slate-200 mb-1`} style={{ borderRadius: val.value === 999 ? 9999 : val.value }} />
                <div className="text-xs">{val.label}</div>
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Style Kartu</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(CARD_STYLE_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.card_style === key} onClick={() => update('card_style', key)}>
                {val.label}
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Warna Teks</label>
          <div className="grid grid-cols-2 gap-2">
            <OptionBtn active={form.card_text_color === 'light'} onClick={() => update('card_text_color', 'light')}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border border-slate-300" />
                <span>Terang</span>
              </div>
            </OptionBtn>
            <OptionBtn active={form.card_text_color === 'dark'} onClick={() => update('card_text_color', 'dark')}>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-300" />
                <span>Gelap</span>
              </div>
            </OptionBtn>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Rata Teks</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'left', label: 'Kiri' },
              { id: 'center', label: 'Tengah' },
              { id: 'right', label: 'Kanan' },
            ].map((opt) => (
              <OptionBtn key={opt.id} active={form.text_align === opt.id} onClick={() => update('text_align', opt.id)}>
                {opt.label}
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Tampilkan Foto</span>
            <input
              type="checkbox"
              checked={form.show_photo}
              onChange={(e) => update('show_photo', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Tampilkan Tanda Kutip</span>
            <input
              type="checkbox"
              checked={form.show_quote}
              onChange={(e) => update('show_quote', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Tampilkan Tanggal</span>
            <input
              type="checkbox"
              checked={form.show_date}
              onChange={(e) => update('show_date', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Tampilkan Relasi</span>
            <input
              type="checkbox"
              checked={form.show_relationship}
              onChange={(e) => update('show_relationship', e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Tampilan Lanjutan</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Jarak Antar Kartu</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CARD_GAP_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.card_gap === key} onClick={() => update('card_gap', key)}>
                {val.label} ({val.value}px)
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah Baris Tampil: <span className="text-teal-600 font-bold">{form.visible_rows}</span></label>
          <input
            type="range"
            min="2"
            max="5"
            step="1"
            value={form.visible_rows}
            onChange={(e) => update('visible_rows', parseInt(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>2 baris</span>
            <span>5 baris</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Bentuk Foto</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(PHOTO_SHAPE_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.photo_shape === key} onClick={() => update('photo_shape', key)}>
                {val.label}
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Efek Blur Kartu</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(BACKDROP_BLUR_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.card_backdrop_blur === key} onClick={() => update('card_backdrop_blur', key)}>
                {val.label}
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Opacity Overlay: <span className="text-teal-600 font-bold">{form.card_overlay_opacity}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={form.card_overlay_opacity}
            onChange={(e) => update('card_overlay_opacity', parseInt(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Transparan</span>
            <span>Solid</span>
          </div>
        </div>

        <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 cursor-pointer">
          <span className="text-sm font-medium text-slate-700">Jeda Scroll saat Hover</span>
          <input
            type="checkbox"
            checked={form.pause_on_hover}
            onChange={(e) => update('pause_on_hover', e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
        </label>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Background</h3>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { id: 'theme', label: 'Tema', Icon: IconPalette },
            { id: 'color', label: 'Warna', Icon: IconDroplet },
            { id: 'gradient', label: 'Gradien', Icon: IconGradient },
            { id: 'image', label: 'Gambar', Icon: IconImage },
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
              <div className="mb-1 flex justify-center"><opt.Icon className="w-5 h-5 mx-auto" /></div>
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

        {form.background_type === 'gradient' && <GradientBuilder value={form.background_value || ''} onChange={(v) => update('background_value', v)} />}

        {form.background_type === 'image' && <ImageUpload value={form.background_value || ''} onChange={(v) => update('background_value', v)} eventId={eventId} apiPrefix={apiPrefix} />}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Animasi</h3>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">Gerakan Ucapan</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allMovements.map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => selectMovement(key)}
                className={`p-3 rounded-xl text-center text-sm font-medium transition ${
                  effectiveMovement === key
                    ? 'bg-teal-50 text-teal-700 border-2 border-teal-300'
                    : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                }`}
              >
                <div className="mb-1 flex justify-center">{getIcon(val.icon, { className: 'w-5 h-5 mx-auto' })}</div>
                <div>{val.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Animasi Masuk</label>
            <div className="space-y-1">
              {Object.entries(CARD_IN_VARIANTS).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectIn(key)}
                  className={`w-full p-2.5 rounded-xl text-sm font-medium text-left transition ${
                    effectiveIn === key
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
                  type="button"
                  onClick={() => selectOut(key)}
                  className={`w-full p-2.5 rounded-xl text-sm font-medium text-left transition ${
                    effectiveOut === key
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

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Testimonial Baru</h3>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">Animasi Testimonial Baru Masuk</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(NEW_ITEM_VARIANTS).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => selectNewItem(key)}
                className={`p-3 rounded-xl text-center text-sm font-medium transition ${
                  effectiveNewItem === key
                    ? 'bg-teal-50 text-teal-700 border-2 border-teal-300'
                    : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                }`}
              >
                {val.description}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Durasi Tampil: <span className="text-teal-600 font-bold">{form.new_item_duration}</span> detik
          </label>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={form.new_item_duration}
            onChange={(e) => update('new_item_duration', parseInt(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>2 detik</span>
            <span>8 detik</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Pengaturan Lainnya</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Kecepatan Scroll</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(SCROLL_SPEED_MAP).map(([key, val]) => (
              <OptionBtn key={key} active={form.scroll_speed === key} onClick={() => update('scroll_speed', key)}>
                {val.label}
              </OptionBtn>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Mode Pemutakhiran</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'realtime', label: 'Realtime (SSE)', desc: 'Testimonial muncul instan' },
              { id: 'normal', label: 'Normal (Polling)', desc: 'Update tiap 15 detik' },
            ].map((opt) => (
              <OptionBtn key={opt.id} active={form.poll_interval === opt.id} onClick={() => update('poll_interval', opt.id)}>
                <div className="font-semibold">{opt.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
              </OptionBtn>
            ))}
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
