import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNavigation from './components/BottomNavigation'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Goals from './pages/Goals'
import Assistant from './pages/Assistant'
import HowItWorks from './pages/HowItWorks'
import Profile from './pages/Profile'
import Landing from './pages/Landing'

export default function App() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Sidebar />
      <main className="flex-1 pt-16 pb-20 lg:pb-6 lg:pl-[220px]">
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
      </main>
      <BottomNavigation />
    </div>
  )
}
