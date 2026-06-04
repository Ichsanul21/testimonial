import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../services/api'

export default function useTestimonials({ all = false, eventSlug = null } = {}) {
  const [testimonials, setTestimonials] = useState([])
  const [priorityIds, setPriorityIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)

  const fetchTestimonials = useCallback(async () => {
    try {
      let data
      if (eventSlug) {
        const params = all ? { all: 'true' } : {}
        const res = await api.get(`/events/${eventSlug}/testimonials`, { params })
        data = res.data
      } else {
        const params = all ? { all: 'true' } : {}
        const res = await api.get('/testimonials', { params })
        data = res.data
      }
      if (all) {
        setTestimonials(data.data || [])
        setPriorityIds(data.priority_ids || [])
      } else {
        setTestimonials(data.data || data)
      }
      setError(null)
    } catch (err) {
      setError(err.message || 'Gagal memuat testimonial')
    } finally {
      setLoading(false)
    }
  }, [all, eventSlug])

  useEffect(() => {
    fetchTestimonials()
    intervalRef.current = setInterval(fetchTestimonials, 15000)
    return () => clearInterval(intervalRef.current)
  }, [fetchTestimonials])

  return { testimonials, priorityIds, loading, error, refetch: fetchTestimonials }
}
