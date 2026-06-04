import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import FloatingDisplay from '../components/FloatingDisplay/FloatingDisplay'

export default function DisplayPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const [theme, setTheme] = useState('wedding')
  const urlTheme = searchParams.get('theme')

  useEffect(() => {
    if (urlTheme) {
      setTheme(urlTheme)
      return
    }
    if (!slug) {
      api.get('/admin/settings/display_theme')
        .then((res) => setTheme(res.data.value || 'wedding'))
        .catch(() => setTheme('wedding'))
    }
  }, [urlTheme, slug])

  return (
    <div className="h-screen w-screen overflow-hidden">
      <FloatingDisplay themeName={theme} eventSlug={slug} />
    </div>
  )
}
