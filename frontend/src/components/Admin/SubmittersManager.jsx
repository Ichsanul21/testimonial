import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'

export default function SubmittersManager() {
  const [submitters, setSubmitters] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filterEventId, setFilterEventId] = useState('')

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/events')
      setEvents(data.data || [])
    } catch {}
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const params = { page, sort }
      if (search.trim()) params.search = search
      if (filterEventId) params.event_id = filterEventId
      const { data } = await api.get('/admin/submitters', { params })
      setSubmitters(data.data || [])
      setLastPage(data.last_page || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, sort, search, filterEventId])

  useEffect(() => { fetchEvents() }, [fetchEvents])
  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Data Pemberi Testimoni</h2>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Cari nama atau kontak..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 w-64 text-sm"
          />
          <select
            value={filterEventId}
            onChange={(e) => { setFilterEventId(e.target.value); setPage(1) }}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          >
            <option value="">Semua Acara</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.icon} {e.name}</option>
            ))}
          </select>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="text-left py-3.5 px-4 font-semibold">No</th>
              <th className="text-left py-3.5 px-4 font-semibold">Nama</th>
              <th className="text-left py-3.5 px-4 font-semibold">No Telp / Email</th>
              <th className="text-left py-3.5 px-4 font-semibold">Hubungan</th>
              <th className="text-left py-3.5 px-4 font-semibold">Acara</th>
              <th className="text-left py-3.5 px-4 font-semibold">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">Memuat...</td></tr>
            ) : submitters.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">Belum ada data</td></tr>
            ) : (
              submitters.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 text-slate-500">{(page - 1) * 20 + i + 1}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{s.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{s.phone_email || '-'}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {s.relationship}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{s.event_name}</td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString('id-ID')}
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
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-all"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  )
}