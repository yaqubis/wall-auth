import { NavLink } from 'react-router-dom'
import { Compass, Heart, MessageCircle, Bell, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store'
import clsx from 'clsx'

const links = [
  { to: '/discover',      icon: Compass,        label: 'Encontrar' },
  { to: '/matches',       icon: Heart,          label: 'Conexões'  },
  { to: '/chat',          icon: MessageCircle,  label: 'Mensagens' },
  { to: '/notifications', icon: Bell,           label: 'Avisos'    },
  { to: '/profile',       icon: User,           label: 'Perfil'    },
]

export function BottomNav() {
  const matches      = useAppStore((s) => s.matches)
  const notifications = useAppStore((s) => s.notifications)
  const unreadChats  = matches.reduce((sum, m) => sum + m.unread, 0)
  const unreadNotifs = notifications.filter((n) => !n.read).length

  const badges: Record<string, number> = {
    '/matches':       matches.filter((m) => m.status === 'new').length,
    '/chat':          unreadChats,
    '/notifications': unreadNotifs,
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-junto-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="flex-1">
            {({ isActive }) => (
              <div className="relative flex flex-col items-center gap-0.5 py-2">
                {/* Active indicator line at top */}
                {isActive && (
                  <motion.div
                    layoutId="navTopLine"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-sage-500"
                  />
                )}

                <div className="relative">
                  <Icon
                    size={22}
                    className={clsx(
                      'transition-colors duration-200',
                      isActive ? 'text-sage-600' : 'text-stone-400'
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />

                  <AnimatePresence>
                    {badges[to] > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-terra-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                      >
                        {badges[to]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <span
                  className={clsx(
                    'text-[10px] font-medium transition-colors duration-200',
                    isActive ? 'text-sage-600' : 'text-stone-400'
                  )}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
