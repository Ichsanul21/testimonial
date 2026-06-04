import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import api from '../../services/api'
import Step1Personal from './Step1Personal'
import Step2Testimonial from './Step2Testimonial'
import SuccessScreen from './SuccessScreen'

const INITIAL_DATA = {
  name: '',
  phone_email: '',
  relationship: 'Teman',
  testimonial: '',
}

export default function FormTestimonial({ eventId }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(INITIAL_DATA)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!eventId) {
      setError('Acara tidak valid. Silakan scan QR code yang benar.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('event_id', eventId)
      formData.append('name', data.name)
      formData.append('phone_email', data.phone_email || '')
      formData.append('relationship', data.relationship)
      formData.append('testimonial', data.testimonial)
      if (file) formData.append('photo', file)

      await api.post('/testimonials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setStep(2)
    } catch (err) {
      setError(err.message || 'Gagal mengirim testimonial')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setData(INITIAL_DATA)
    setFile(null)
    setStep(0)
    setError(null)
  }

  const steps = [
    {
      component: (
        <Step1Personal
          data={data}
          onChange={setData}
          onNext={() => setStep(1)}
        />
      ),
    },
    {
      component: (
        <Step2Testimonial
          data={data}
          file={file}
          onFieldChange={setData}
          onFileChange={setFile}
          onBack={() => setStep(0)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ),
    },
    {
      component: <SuccessScreen onReset={handleReset} />,
    },
  ]

  return (
    <div>
      {step < 2 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {[0, 1].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step
                  ? 'bg-teal-600 scale-125'
                  : s < step
                  ? 'bg-teal-300'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {steps[step].component}
      </AnimatePresence>
    </div>
  )
}
