import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import BottomNavigation from './components/BottomNavigation'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Goals from './pages/Goals'
import Assistant from './pages/Assistant'
import HowItWorks from './pages/HowItWorks'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import Login from './pages/Login'
import { useApp } from './hooks/AppContext'

export default function App() {
  const location = useLocation()
  const { isAuthenticated } = useApp()

  if (location.pathname === '/login') {
    return <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] antialiased"><Login /></div>
  }

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  const publicHome = location.pathname === '/'
  if (publicHome) {
    return <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] antialiased"><Navbar /><main className="pt-16"><Landing /></main></div>
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col antialiased selection:bg-teal-500/20 selection:text-teal-300">
      <Navbar /><Sidebar />
      <main className="flex-1 w-full pt-16 pb-24 lg:pb-12 lg:pl-60 overflow-x-hidden"><div className="w-full max-w-4xl mx-auto px-4 py-4 sm:px-6 sm:py-6"><Routes><Route path="/dashboard" element={<Dashboard />} /><Route path="/roadmap" element={<Roadmap />} /><Route path="/goals" element={<Goals />} /><Route path="/assistant" element={<Assistant />} /><Route path="/how-it-works" element={<HowItWorks />} /><Route path="/profile" element={<Profile />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></div></main>
      <BottomNavigation />
    </div>
  )
}
