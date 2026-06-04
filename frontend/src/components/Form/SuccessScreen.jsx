import { motion } from 'framer-motion'

export default function SuccessScreen({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-emerald-200">
        <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Testimonial Terkirim! 🎉
        </h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Terima kasih! Testimonial kamu akan muncul di layar display setelah disetujui.
        </p>
        <button
          onClick={onReset}
          className="px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-lg shadow-teal-200 transition-all"
        >
          Tutup
        </button>
      </motion.div>
    </motion.div>
  )
}
