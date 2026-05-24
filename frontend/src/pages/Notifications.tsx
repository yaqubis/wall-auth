import { motion } from 'framer-motion'
import { BellOff } from 'lucide-react'
import { useAppStore } from '../store'
import { Avatar } from '../components/ui/Avatar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import clsx from 'clsx'

const icons: Record<string, string> = {
  match: '💕',
  message: '💬',
  like: '❤️',
  superlike: '⭐',
  suggestion: '✨',
  reminder: '🔔',
  security: '🔒',
}

const borderColors: Record<string, string> = {
  match: 'border-sage-200',
  message: 'border-blue-100',
  like: 'border-terra-400/30',
  superlike: 'border-amber-200',
  suggestion: 'border-junto-200',
  reminder: 'border-junto-200',
  security: 'border-red-100',
}

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="h-screen bg-junto-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-10 pb-5 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display text-2xl text-ink">Avisos</h1>
          {unread > 0 && (
            <p className="text-stone-400 text-sm mt-0.5">{unread} não lidos</p>
          )}
        </div>
        {unread > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={markAllNotificationsRead}
            className="text-sage-600 text-sm font-medium"
          >
            Marcar todas
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-2">
        {notifications.length > 0 ? (
          notifications.map((n, i) => (
            <motion.button
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => markNotificationRead(n.id)}
              className={clsx(
                'w-full flex items-start gap-3 p-4 rounded-2xl border bg-white text-left transition-all',
                borderColors[n.type] ?? 'border-junto-200',
                !n.read && 'ring-1 ring-junto-300'
              )}
            >
              {n.userPhoto ? (
                <Avatar src={n.userPhoto} name={n.title} size="md" />
              ) : (
                <div className="w-10 h-10 bg-junto-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {icons[n.type] ?? '📌'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'font-semibold text-sm',
                  n.read ? 'text-stone-600' : 'text-ink'
                )}>
                  {n.title}
                </p>
                <p className="text-stone-500 text-sm mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-stone-400 text-xs mt-1.5">
                  {formatDistanceToNow(n.createdAt, { locale: ptBR, addSuffix: true })}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 bg-terra-500 rounded-full ml-auto flex-shrink-0 mt-1" />
              )}
            </motion.button>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-junto-200 rounded-3xl p-10 text-center mt-8"
          >
            <BellOff size={32} className="text-stone-200 mx-auto mb-4" />
            <h3 className="font-display text-lg text-ink">Tudo em dia!</h3>
            <p className="text-stone-400 text-sm mt-2 leading-relaxed">
              Você não tem notificações pendentes.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
