import { useState, useEffect } from 'react'
import api from '../../services/api'
import { SkeletonCard } from '../ui/Skeleton'

export default function SettingsCard() {
  const [autoApprove, setAutoApprove] = useState(true)
  const [displayTheme, setDisplayTheme] = useState('wedding')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [aa, dt] = await Promise.all([
          api.get('/admin/settings/auto_approve'),
          api.get('/admin/settings/display_theme'),
        ])
        setAutoApprove(aa.data.value === 'true')
        setDisplayTheme(dt.data.value || 'wedding')
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const updateSetting = async (key, value) => {
    setSaving(true)
    try {
      await api.post('/admin/settings', { key, value })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <SkeletonCard />

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Auto Approve</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Testimonial baru otomatis aktif tanpa review
            </p>
          </div>
          <button
            onClick={() => {
              const newVal = !autoApprove
              setAutoApprove(newVal)
              updateSetting('auto_approve', newVal ? 'true' : 'false')
            }}
            disabled={saving}
            className={`relative w-14 h-7 rounded-full transition-all ${
              autoApprove ? 'bg-teal-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                autoApprove ? 'left-8' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800">Tema Display</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {displayTheme === 'wedding' ? 'Wedding (gold, floral)' : 'Corporate (teal, geometric)'}
            </p>
          </div>
          <select
            value={displayTheme}
            onChange={(e) => {
              setDisplayTheme(e.target.value)
              updateSetting('display_theme', e.target.value)
            }}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>
      </div>

      {saving && (
        <p className="text-xs text-teal-600 animate-pulse">Menyimpan...</p>
      )}
    </div>
  )
}
