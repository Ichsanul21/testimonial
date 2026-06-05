import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import FormPage from './pages/FormPage'
import DisplayPage from './pages/DisplayPage'
import EventDetailPage from './pages/EventDetailPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/Admin/LoginPage'
import ForgotPasswordPage from './pages/Admin/ForgotPasswordPage'
import ResetPasswordPage from './pages/Admin/ResetPasswordPage'
import ProtectedRoute from './components/Admin/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/display" element={<DisplayPage />} />
          <Route path="/display/:slug" element={<DisplayPage />} />
          <Route path="/acara/:slug" element={<EventDetailPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
