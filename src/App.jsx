import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--on-surface)] flex flex-col antialiased selection:bg-teal-500/20 selection:text-teal-300">
      <Navbar />
      <Sidebar />
      {/* Main canal: pt-16 accounts for fixed 64px header, pb-24 for mobile bottom bar, lg:pl-60 for desktop sidebar */}
      <main className="flex-1 w-full pt-16 pb-24 lg:pb-12 lg:pl-60 overflow-x-hidden">
        <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
      <BottomNavigation />
    </div>
  )
}
