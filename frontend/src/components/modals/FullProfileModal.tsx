import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, CheckCircle, Star, Heart, ChevronLeft, ChevronRight, Share2, Flag, Ruler } from 'lucide-react'
import type { User } from '../../types'
import { Badge } from '../ui/Badge'
import clsx from 'clsx'

interface FullProfileModalProps {
  user: User
  onClose: () => void
  onLike: () => void
  onDislike: () => void
  onSuperlike: () => void
}

export function FullProfileModal({ user, onClose, onLike, onDislike, onSuperlike }: FullProfileModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0)

  const goalLabels: Record<string, string> = {
    friendship: '🤝 Amizade',
    dating: '💕 Namoro',
    serious: '💍 Relacionamento sério',
    casual: '✨ Casual',
    networking: '🌐 Networking',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="absolute inset-x-0 bottom-0 top-0 bg-junto-50 overflow-y-auto"
        >
          {/* Photo gallery */}
          <div className="relative h-[55vh] flex-shrink-0">
            <img
              src={user.photos[photoIndex]}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

            {/* Photo dot indicators */}
            {user.photos.length > 1 && (
              <div className="absolute top-4 inset-x-0 flex justify-center gap-1.5 px-12">
                {user.photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={clsx(
                      'rounded-full transition-all duration-200',
                      i === photoIndex
                        ? 'w-4 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/50'
                    )}
                  />
                ))}
              </div>
            )}

            {/* Prev / Next buttons */}
            <button
              onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur text-ink hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setPhotoIndex(Math.min(user.photos.length - 1, photoIndex + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur text-ink hover:bg-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white text-ink shadow-card hover:bg-junto-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Info section */}
          <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-6 pt-6 space-y-5">
            {/* Name & basic */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h1 className="font-display text-2xl text-ink font-semibold leading-tight">
                      {user.name}
                    </h1>
                    <span className="text-stone-400 text-xl">{user.age}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-stone-500 text-sm">
                    <MapPin size={14} />
                    <span>{user.location} · {user.distance} km</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-junto-50 text-stone-400 hover:text-ink hover:bg-junto-100 transition-colors">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 rounded-full bg-junto-50 text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Flag size={16} />
                  </button>
                </div>
              </div>

              {/* Compatibility */}
              {user.compatibility && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-sage-50 border border-sage-100 rounded-2xl">
                  <div className="text-sage-600 font-bold text-xl font-display">
                    {user.compatibility}%
                  </div>
                  <div className="flex-1">
                    <p className="text-ink font-medium text-sm">Compatibilidade</p>
                    <div className="w-full h-1.5 bg-sage-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-sage-gradient rounded-full"
                        style={{ width: `${user.compatibility}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            {user.badges && user.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.badges.map((b) => (
                  <Badge
                    key={b}
                    variant={
                      b.includes('Verif') ? 'verified'
                      : b.includes('Ativo') ? 'online'
                      : 'premium'
                    }
                  >
                    {b}
                  </Badge>
                ))}
              </div>
            )}

            {/* Bio */}
            <div>
              <h3 className="text-ink font-semibold mb-2">Sobre</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{user.bio}</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {user.height && (
                <div className="flex items-center gap-2.5 p-3 bg-junto-50 border border-junto-200 rounded-2xl">
                  <Ruler size={16} className="text-stone-400" />
                  <div>
                    <p className="text-xs text-stone-400">Altura</p>
                    <p className="text-ink font-medium text-sm">{user.height} cm</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2.5 p-3 bg-junto-50 border border-junto-200 rounded-2xl">
                <span className="text-base">🎯</span>
                <div>
                  <p className="text-xs text-stone-400">Buscando</p>
                  <p className="text-ink font-medium text-sm">{goalLabels[user.goal] ?? user.goal}</p>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-ink font-semibold mb-2.5">Interesses</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} size="md">{interest}</Badge>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            {user.lifestyle && user.lifestyle.length > 0 && (
              <div>
                <h3 className="text-ink font-semibold mb-2.5">Estilo de vida</h3>
                <div className="flex flex-wrap gap-2">
                  {user.lifestyle.map((l) => (
                    <Badge key={l} size="md">{l}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Prompts */}
            {user.prompts && user.prompts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-ink font-semibold">Perguntas</h3>
                {user.prompts.map((p, i) => (
                  <div
                    key={i}
                    className="p-4 bg-junto-50 border border-junto-200 rounded-2xl"
                  >
                    <p className="text-xs text-stone-400 mb-1.5">{p.question}</p>
                    <p className="text-ink text-sm">"{p.answer}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Safety notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 leading-relaxed">
              ⚠️ Lembre-se: seja seguro ao marcar encontros presenciais. Compartilhe sua localização com alguém de confiança.
            </div>

            {/* Spacing for fixed action bar */}
            <div className="h-24" />
          </div>

          {/* Fixed action bar */}
          <div className="fixed bottom-0 inset-x-0 bg-white border-t border-junto-200 px-5 py-4 flex items-center gap-3">
            {/* Passar */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onDislike}
              className="flex-none w-14 h-14 rounded-2xl bg-junto-50 border border-junto-200 flex items-center justify-center text-stone-500 hover:bg-junto-100 transition-colors"
            >
              <X size={22} />
            </motion.button>

            {/* Especial */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSuperlike}
              className="flex-none w-12 h-12 rounded-xl bg-white border border-junto-200 flex items-center justify-center text-stone-400 hover:border-junto-300 transition-colors"
            >
              <Star size={18} />
            </motion.button>

            {/* Conectar */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onLike}
              className="flex-1 h-14 rounded-2xl bg-terra-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-button"
            >
              <Heart size={18} className="fill-white" />
              Conectar
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
