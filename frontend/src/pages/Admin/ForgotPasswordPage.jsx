import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [token, setToken] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/forgot-password', { email })
      setToken(res.data.token)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal mengirim email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Lupa Password</h1>
          <p className="text-sm text-slate-400 mt-1">Masukkan email admin Anda</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
            {error}
          </div>
        )}

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Link reset password berhasil dikirim. Gunakan token berikut untuk reset:
            </p>
            <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4 text-xs text-slate-500 break-all font-mono border border-slate-200">
              {token}
            </div>
            <Link
              to={`/admin/reset-password?token=${token}&email=${encodeURIComponent(email)}`}
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition"
            >
              Reset Password Sekarang
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-sm"
                placeholder="admin@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
            <div className="text-center">
              <Link to="/admin/login" className="text-sm text-teal-600 hover:text-teal-700">
                Kembali ke Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
