import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

export default function TestimonialTable({ eventId = null }) {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === 'super_admin'
  const apiPrefix = isSuperAdmin ? '/admin' : '/event-admin'

  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [priorityLimitMsg, setPriorityLimitMsg] = useState('')

  const endpoint = `${apiPrefix}/testimonials`

  const fetchData = useCallback(async () => {
    try {
      const params = { page, sort }
      if (search.trim()) params.search = search
      if (eventId) params.event_id = eventId
      const { data } = await api.get(endpoint, { params })
      setTestimonials(data.data || [])
      setLastPage(data.last_page || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, sort, search, eventId, endpoint])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleTakedown = async (id) => {
    if (isSuperAdmin) {
      await api.delete(`${apiPrefix}/testimonials/${id}`)
    } else {
      await api.post(`${apiPrefix}/testimonials/${id}/takedown`)
    }
    fetchData()
  }

  const handleRestore = async (id) => {
    await api.post(`${apiPrefix}/testimonials/${id}/restore`)
    fetchData()
  }

  const handlePriority = async (id, isPriority) => {
    try {
      setPriorityLimitMsg('')
      await api.post(`${apiPrefix}/testimonials/${id}/priority`, { is_priority: !isPriority })
      fetchData()
    } catch (err) {
      if (err.response?.status === 422) {
        setPriorityLimitMsg(err.response.data.message || 'Maksimal 5 prioritas')
        setTimeout(() => setPriorityLimitMsg(''), 3000)
      }
    }
  }

  const getStatusBadge = (isActive) => {
    return isActive
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-red-100 text-red-700'
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari testimonial..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 w-64 text-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>

      {priorityLimitMsg && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
          {priorityLimitMsg}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="text-left py-3.5 px-4 font-semibold">No</th>
              <th className="text-left py-3.5 px-4 font-semibold">Nama</th>
              <th className="text-left py-3.5 px-4 font-semibold max-w-xs">Testimonial</th>
              <th className="text-left py-3.5 px-4 font-semibold">Foto</th>
              <th className="text-left py-3.5 px-4 font-semibold">Waktu</th>
              <th className="text-left py-3.5 px-4 font-semibold">Status</th>
              <th className="text-center py-3.5 px-4 font-semibold">Prioritas</th>
              <th className="text-left py-3.5 px-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">Memuat...</td></tr>
            ) : testimonials.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400">Belum ada data</td></tr>
            ) : (
              testimonials.map((t, i) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 text-slate-500">{(page - 1) * 20 + i + 1}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{t.name}</td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{t.testimonial}</td>
                  <td className="py-3.5 px-4">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(t.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(t.is_active)}`}>
                      {t.is_active ? 'Aktif' : 'Ditakedown'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handlePriority(t.id, t.is_priority)}
                      className={`p-1.5 rounded-lg transition-all ${
                        t.is_priority
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-300 hover:text-amber-400 hover:bg-amber-50'
                      }`}
                      title={t.is_priority ? 'Hapus prioritas' : 'Jadikan prioritas (max 5)'}
                    >
                      <svg className="w-5 h-5" fill={t.is_priority ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    {t.is_active ? (
                      <button
                        onClick={() => handleTakedown(t.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        Takedown
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(t.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-slate-500">
          Halaman {page} dari {lastPage}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
          >
            Sebelumnya
          </button>
          <button
            disabled={page >= lastPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  )
}
