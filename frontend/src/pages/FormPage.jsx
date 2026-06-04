import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import FormTestimonial from '../components/Form/FormTestimonial'

export default function FormPage() {
  const [searchParams] = useSearchParams()
  const acara = searchParams.get('acara')
  const [event, setEvent] = useState(null)

  useEffect(() => {
    if (!acara) return
    api.get(`/events/${acara}`)
      .then((res) => setEvent(res.data))
      .catch(() => {})
  }, [acara])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 font-serif">
            Testimonial
          </h1>
          {event ? (
            <p className="text-slate-500 mt-2">
              {event.icon} {event.name}
            </p>
          ) : (
            <p className="text-slate-500 mt-2">
              Bagikan kesan dan pesan Anda
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <FormTestimonial eventId={event?.id} />
        </div>
      </div>
    </div>
  )
}
