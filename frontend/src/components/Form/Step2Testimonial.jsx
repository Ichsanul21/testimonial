import { motion } from 'framer-motion'
import PhotoUpload from './PhotoUpload'

const MAX_CHARS = 1000

export default function Step2Testimonial({ data, file, onFieldChange, onFileChange, onBack, onSubmit, submitting }) {
  const charsLeft = MAX_CHARS - (data.testimonial?.length || 0)
  const canSubmit = data.testimonial?.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    onSubmit()
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
            Testimonial <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.testimonial || ''}
            onChange={(e) => onFieldChange({ ...data, testimonial: e.target.value })}
            placeholder="Tulis kesan dan pesan Anda..."
            maxLength={MAX_CHARS}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition resize-none"
            style={{ minHeight: 140 }}
          />
          <div className={`text-right text-xs mt-1 ${charsLeft < 50 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            {charsLeft} karakter tersisa
          </div>
        </div>

        <PhotoUpload file={file} onFileChange={onFileChange} />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3.5 rounded-2xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            Kembali
          </button>
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="flex-[2] py-3.5 rounded-2xl font-semibold text-white transition-all bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-teal-200 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Mengirim...
              </>
            ) : (
              'Kirim Testimonial'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
