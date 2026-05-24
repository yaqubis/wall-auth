import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle } from 'lucide-react'
import type { User } from '../../types'
import { useAppStore } from '../../store'

interface MatchModalProps {
  user: User
  onClose: () => void
  onChat: () => void
}

export function MatchModal({ user, onClose, onChat }: MatchModalProps) {
  const currentUser = useAppStore((s) => s.currentUser)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-ink/60 backdrop-blur-md" />

        {/* Content card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-8 border border-junto-200 shadow-card-hover"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-ink hover:bg-junto-50 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl text-ink font-semibold leading-tight">
              Vocês se conectaram
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              você e <span className="text-ink font-medium">{user.name}</span> têm interesse mútuo
            </p>
          </div>

          {/* Photos with pulsing ring */}
          <div className="flex items-center justify-center mb-8 relative">
            {/* Decorative pulsing ring */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.15, 0.35],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-44 h-44 rounded-full bg-sage-100"
            />

            <div className="flex items-center gap-3 relative z-10">
              {currentUser && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-junto-200 shadow-card flex-shrink-0">
                  <img
                    src={currentUser.photos[0]}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Connection icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex-shrink-0 text-terra-500 text-xl"
              >
                ❤
              </motion.div>

              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-junto-200 shadow-card flex-shrink-0">
                <img
                  src={user.photos[0]}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onChat}
              className="w-full py-4 bg-terra-gradient rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-button"
            >
              <MessageCircle size={18} />
              Começar conversa
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="w-full py-3.5 bg-junto-50 border border-junto-200 rounded-2xl text-stone-600 font-medium text-base"
            >
              Continuar explorando
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
