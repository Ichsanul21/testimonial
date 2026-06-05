import { useMemo } from 'react'
import { motion } from 'framer-motion'

const relationships = ['Teman', 'Keluarga', 'Rekan Kerja', 'Lainnya']
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^08\d{8,12}$/

export default function Step1Personal({ data, onChange, onNext }) {
  const errors = useMemo(() => {
    const errs = {}
    if (!data.name?.trim()) errs.name = 'Nama lengkap wajib diisi'
    if (data.phone_email?.trim()) {
      const val = data.phone_email.trim()
      if (!emailRegex.test(val) && !phoneRegex.test(val)) {
        errs.phone_email = 'Masukkan email valid atau nomor HP (08xx)'
      }
    }
    return errs
  }, [data.name, data.phone_email])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (Object.keys(errors).length > 0) return
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-slate-700">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="Masukkan nama lengkap"
            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-slate-700">
            No. HP / Email <span className="text-slate-400">(opsional)</span>
          </label>
          <input
            type="text"
            value={data.phone_email || ''}
            onChange={(e) => onChange({ ...data, phone_email: e.target.value })}
            placeholder="0812xxxx atau email@example.com"
            className={`w-full px-4 py-3 rounded-xl border ${errors.phone_email ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition`}
          />
          {errors.phone_email && <p className="text-red-500 text-xs mt-1">{errors.phone_email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Relasi <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {relationships.map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() => onChange({ ...data, relationship: rel })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  data.relationship === rel
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={Object.keys(errors).length > 0}
          className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-teal-200"
        >
          Lanjut
        </button>
      </form>
    </motion.div>
  )
}
