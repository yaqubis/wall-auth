import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAppStore } from './store'
import { BottomNav } from './components/navigation/BottomNav'
import { Onboarding } from './pages/Onboarding'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Discover } from './pages/Discover'
import { Matches } from './pages/Matches'
import { Chat } from './pages/Chat'
import { Notifications } from './pages/Notifications'
import { Explore } from './pages/Explore'
import { MyProfile } from './pages/MyProfile'
import { Settings } from './pages/Settings'

const SHOW_NAV = ['/discover', '/matches', '/chat', '/notifications', '/profile']

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const showNav = SHOW_NAV.some((p) => location.pathname.startsWith(p))
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  return (
    <div className="max-w-lg mx-auto relative min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/discover" replace /> : <Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/discover" element={<AuthGuard><Discover /></AuthGuard>} />
          <Route path="/matches" element={<AuthGuard><Matches /></AuthGuard>} />
          <Route path="/chat" element={<AuthGuard><Chat /></AuthGuard>} />
          <Route path="/chat/:matchId" element={<AuthGuard><Chat /></AuthGuard>} />
          <Route path="/notifications" element={<AuthGuard><Notifications /></AuthGuard>} />
          <Route path="/explore" element={<AuthGuard><Explore /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><MyProfile /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {showNav && isAuthenticated && <BottomNav />}
    </div>
  )
}
