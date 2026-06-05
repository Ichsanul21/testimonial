import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import StatsCard from './StatsCard'
import TestimonialTable from './TestimonialTable'
import SettingsCard from './SettingsCard'
import QRCodeDisplay from './QRCodeDisplay'
import EventsManager from './EventsManager'
import EventDetailManager from './EventDetailManager'
import UsersManager from './UsersManager'
import SubmittersManager from './SubmittersManager'

const NAV_ITEMS = {
  super_admin: [
    {
      label: 'Konten',
      items: [
        { id: 'testimonials', label: 'Testimonial', icon: '💬' },
        { id: 'submitters', label: 'Data Pemberi', icon: '📋' },
        { id: 'events', label: 'Acara', icon: '📅' },
      ],
    },
    {
      label: 'Pengaturan',
      items: [
        { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
        { id: 'qrcode', label: 'QR Code', icon: '📱' },
      ],
    },
    {
      label: 'Akses',
      items: [
        { id: 'users', label: 'Pengguna', icon: '👥' },
      ],
    },
  ],
  event_admin: [
    {
      label: 'Konten',
      items: [
        { id: 'events', label: 'Acara Saya', icon: '📅' },
      ],
    },
  ],
}

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('testimonials')
  const [stats, setStats] = useState({ total: 0, active: 0, takedown: 0 })
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isSuperAdmin = user?.role === 'super_admin'
  const navSections = NAV_ITEMS[user?.role] || NAV_ITEMS.event_admin

  useEffect(() => {
    if (!isSuperAdmin) return
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
  }, [isSuperAdmin])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const handleEventSelect = (eventId) => {
    setSelectedEventId(eventId)
    setActiveTab('event-detail')
  }

  const navigateTo = (tabId) => {
    setActiveTab(tabId)
    setSelectedEventId(null)
    setSidebarOpen(false)
  }

  const sidebar = (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 p-4 flex-shrink-0 flex flex-col shadow-sm">
      <div className="mb-6 px-3">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">Admin Panel</h1>
        <p className="text-xs text-slate-400 mt-0.5">Testimonial System</p>
      </div>

      <div className="px-3 py-3 mb-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/50">
        <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
        <span className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
          isSuperAdmin
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {isSuperAdmin ? 'Super Admin' : 'Event Admin'}
        </span>
      </div>

      <nav className="flex-1 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => navigateTo(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base leading-none">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <div className="hidden lg:block">{sidebar}</div>

        {sidebarOpen && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 shadow-2xl">
              {sidebar}
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-4 p-2 rounded-xl hover:bg-slate-200 transition"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {isSuperAdmin && activeTab === 'testimonials' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
                <StatsCard
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                  label="Total Testimonial"
                  value={stats.total}
                  color="teal"
                />
                <StatsCard
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  label="Aktif"
                  value={stats.active}
                  color="blue"
                />
                <StatsCard
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                  label="Ditakedown"
                  value={stats.takedown}
                  color="amber"
                />
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 border border-slate-100 shadow-sm overflow-x-auto">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Semua Testimonial</h2>
                <TestimonialTable />
              </div>
            </div>
          )}

          {isSuperAdmin && activeTab === 'submitters' && (
            <div className="bg-white rounded-2xl p-4 lg:p-6 border border-slate-100 shadow-sm overflow-x-auto">
              <SubmittersManager />
            </div>
          )}

          {activeTab === 'events' && (
            <EventsManager onSelect={handleEventSelect} />
          )}

          {activeTab === 'event-detail' && selectedEventId && (
            <EventDetailManager eventId={selectedEventId} onBack={() => setActiveTab('events')} />
          )}

          {isSuperAdmin && activeTab === 'settings' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Pengaturan</h2>
              <SettingsCard />
            </div>
          )}

          {isSuperAdmin && activeTab === 'qrcode' && (
            <div className="max-w-xl">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">QR Code</h2>
              <QRCodeDisplay />
            </div>
          )}

          {isSuperAdmin && activeTab === 'users' && (
            <UsersManager />
          )}
        </main>
      </div>
    </div>
  )
}
