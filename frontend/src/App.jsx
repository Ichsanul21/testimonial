import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import FormPage from './pages/FormPage'
import DisplayPage from './pages/DisplayPage'
import EventDetailPage from './pages/EventDetailPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/Admin/LoginPage'
import ProtectedRoute from './components/Admin/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/display" element={<DisplayPage />} />
          <Route path="/display/:slug" element={<DisplayPage />} />
          <Route path="/acara/:slug" element={<EventDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
