import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../services/api'

export default function useEventSourceTestimonials({ eventSlug = null, pollInterval = 'realtime' } = {}) {
  const [queue, setQueue] = useState([])
  const [priorityIds, setPriorityIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [newItems, setNewItems] = useState([])
  const esRef = useRef(null)
  const pollRef = useRef(null)
  const lastIdRef = useRef(0)
  const retryCountRef = useRef(0)
  const initialLoadDone = useRef(false)
  const firstSseBatch = useRef(true)

  const fetchAll = useCallback(async () => {
    try {
      const params = { all: 'true' }
      const url = eventSlug ? `/events/${eventSlug}/testimonials` : '/testimonials'
      const res = await api.get(url, { params })
      setQueue(res.data.data || [])
      setPriorityIds(res.data.priority_ids || [])
      setNewItems([])
      initialLoadDone.current = true
      setLoading(false)
    } catch {
      initialLoadDone.current = true
      setLoading(false)
    }
  }, [eventSlug])

  const isRealtime = pollInterval === 'realtime'
  const pollMs = isRealtime ? 3000 : 15000

  useEffect(() => {
    fetchAll()
    lastIdRef.current = 0
    setNewItems([])
    setIsConnected(false)

    if (!isRealtime || !eventSlug) {
      const timer = setInterval(fetchAll, pollMs)
      return () => clearInterval(timer)
    }

    let reconnectTimer = null
    let mounted = true

    function connect() {
      if (!mounted) return
      firstSseBatch.current = true
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/events/${eventSlug}/testimonials/stream`
      const es = new EventSource(url)
      esRef.current = es

      es.onopen = () => {
        if (mounted) {
          setIsConnected(true)
          retryCountRef.current = 0
        }
      }

      es.addEventListener('new-testimonials', (e) => {
        if (!mounted) return
        try {
          const data = JSON.parse(e.data)
          const incoming = data.testimonials || []
          const prioIds = data.priority_ids || []

          lastIdRef.current = parseInt(e.lastEventId, 10) || 0

          // Skip overlay trigger on first SSE batch per connection
          if (firstSseBatch.current) {
            firstSseBatch.current = false
            setPriorityIds(prioIds)
            setQueue(prev => {
              const existingIds = new Set(prev.map(t => t.id))
              const trulyNew = incoming.filter(t => !existingIds.has(t.id))
              return trulyNew.length > 0 ? [...prev, ...trulyNew] : prev
            })
            return
          }

          setPriorityIds(prioIds)

          setQueue(prev => {
            const existingIds = new Set(prev.map(t => t.id))
            const trulyNew = incoming.filter(t => !existingIds.has(t.id))
            if (trulyNew.length > 0) {
              if (initialLoadDone.current) {
                setNewItems(prev => {
                  const currentIds = new Set(prev.map(t => t.id))
                  const trulyFresh = trulyNew.filter(t => !currentIds.has(t.id))
                  if (trulyFresh.length === 0) return prev
                  return [...prev, ...trulyFresh]
                })
              }
              return [...prev, ...trulyNew]
            }
            return prev
          })

          if (initialLoadDone.current) {
            setLoading(false)
          }
        } catch {}
      })

      es.onerror = () => {
        if (!mounted) return
        setIsConnected(false)
        es.close()
        retryCountRef.current += 1
        const delay = Math.min(1000 * Math.pow(3, retryCountRef.current - 1), 60000)
        reconnectTimer = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      mounted = false
      if (esRef.current) esRef.current.close()
      if (reconnectTimer) clearTimeout(reconnectTimer)
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [eventSlug, isRealtime, pollMs, fetchAll])

  const clearNewItems = useCallback(() => {
    setNewItems([])
  }, [])

  return { queue, priorityIds, loading, isConnected, newItems, clearNewItems, refetch: fetchAll }
}
