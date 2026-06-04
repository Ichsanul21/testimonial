import { useState, useEffect, useCallback } from 'react'
import api from '../../services/api'

export default function UsersManager() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(null)
  const [showPassword, setShowPassword] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'event_admin' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data.data || [])
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/admin/users', form)
      setShowCreate(false)
      setForm({ name: '', email: '', password: '', role: 'event_admin' })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal membuat user')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.put(`/admin/users/${showEdit.id}`, {
        name: form.name,
        email: form.email,
        role: form.role,
      })
      setShowEdit(null)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal mengupdate user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!confirm(`Hapus user "${user.name}" (${user.email})?`)) return
    try {
      await api.delete(`/admin/users/${user.id}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Gagal menghapus')
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.put(`/admin/users/${showPassword.id}/password`, { password: form.password })
      setShowPassword(null)
      setForm({ name: '', email: '', password: '', role: 'event_admin' })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal reset password')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role })
    setShowEdit(user)
  }

  const openPassword = (user) => {
    setForm({ name: '', email: '', password: '', role: 'event_admin' })
    setShowPassword(user)
  }

  if (loading) return <div className="animate-pulse h-32 bg-slate-100 rounded-xl" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Pengguna</h2>
        <button
          onClick={() => { setShowCreate(true); setError(''); setForm({ name: '', email: '', password: '', role: 'event_admin' }) }}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition"
        >
          + User Baru
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Tambah User" error={error}>
          <form onSubmit={handleCreate} className="space-y-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30">
              <option value="event_admin">Event Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <ModalActions saving={saving} onCancel={() => setShowCreate(false)} />
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal onClose={() => setShowEdit(null)} title="Edit User" error={error}>
          <form onSubmit={handleEdit} className="space-y-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30">
              <option value="event_admin">Event Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <ModalActions saving={saving} onCancel={() => setShowEdit(null)} />
          </form>
        </Modal>
      )}

      {/* Password Modal */}
      {showPassword && (
        <Modal onClose={() => setShowPassword(null)} title={`Reset Password — ${showPassword.name}`} error={error}>
          <form onSubmit={handlePassword} className="space-y-3">
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password baru" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
            <ModalActions saving={saving} onCancel={() => setShowPassword(null)} submitLabel="Reset" />
          </form>
        </Modal>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Nama</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={4} className="text-center py-12 text-slate-400">Belum ada user</td></tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'super_admin'
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {user.role === 'super_admin' ? 'Super Admin' : 'Event Admin'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openPassword(user)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                      title="Reset password"
                    >
                      Password
                    </button>
                    <button
                      onClick={() => openEdit(user)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 mt-3 text-right">{users.length} user(s)</p>
    </div>
  )
}

function Modal({ title, error, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>
        {error && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">{error}</div>
        )}
        {children}
      </div>
    </div>
  )
}

function ModalActions({ saving, onCancel, submitLabel = 'Simpan' }) {
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
        Batal
      </button>
      <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition">
        {saving ? 'Menyimpan...' : submitLabel}
      </button>
    </div>
  )
}
