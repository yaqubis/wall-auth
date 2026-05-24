import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { MapPin, CheckCircle } from 'lucide-react'
import type { User } from '../../types'
import { Badge } from '../ui/Badge'
import clsx from 'clsx'

interface ProfileCardProps {
  user: User
  onSwipe: (direction: 'like' | 'dislike' | 'superlike') => void
  onOpen: () => void
  isTop: boolean
  stackIndex: number
}

export function ProfileCard({ user, onSwipe, onOpen, isTop, stackIndex }: ProfileCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [dragDirection, setDragDirection] = useState<'like' | 'dislike' | 'superlike' | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-250, 0, 250], [-22, 0, 22])
  const constraintsRef = useRef(null)

  const handleDragEnd = (_: any, info: any) => {
    const { offset, velocity } = info
    const swipeX = Math.abs(offset.x) > 120 || Math.abs(velocity.x) > 600
    const swipeUp = offset.y < -100 || velocity.y < -600

    if (swipeUp) { onSwipe('superlike'); return }
    if (swipeX && offset.x > 0) { onSwipe('like'); return }
    if (swipeX && offset.x < 0) { onSwipe('dislike'); return }
    setDragDirection(null)
  }

  const handleDrag = (_: any, info: any) => {
    if (info.offset.y < -60 && Math.abs(info.offset.x) < 80) {
      setDragDirection('superlike')
    } else if (info.offset.x > 40) {
      setDragDirection('like')
    } else if (info.offset.x < -40) {
      setDragDirection('dislike')
    } else {
      setDragDirection(null)
    }
  }

  if (!isTop) {
    return (
      <motion.div
        className="absolute w-full max-w-sm"
        style={{
          scale: 1 - stackIndex * 0.04,
          y: stackIndex * 12,
          zIndex: 10 - stackIndex,
        }}
      >
        <div className="bg-white border border-junto-200 rounded-3xl overflow-hidden shadow-card"
          style={{ opacity: 1 - stackIndex * 0.2 }}>
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={user.photos[0]}
              alt={user.name}
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={constraintsRef}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, zIndex: 20 }}
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing select-none"
      whileDrag={{ scale: 1.02 }}
    >
      <div className="bg-white border border-junto-200 rounded-3xl shadow-card overflow-hidden">
        {/* Photo section — 58% of card height */}
        <div className="relative" style={{ paddingBottom: '58%' }}>
          <div className="absolute inset-0 rounded-t-3xl overflow-hidden">
            <img
              src={user.photos[photoIndex]}
              alt={user.name}
              className="w-full h-full object-cover"
              draggable={false}
            />

            {/* Photo tap zones */}
            <div className="absolute inset-0 flex">
              <div
                className="flex-1"
                onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
              />
              <div
                className="flex-1"
                onClick={() => setPhotoIndex(Math.min(user.photos.length - 1, photoIndex + 1))}
              />
            </div>

            {/* Photo indicators — dots at top */}
            {user.photos.length > 1 && (
              <div className="absolute top-3 inset-x-0 flex justify-center gap-1.5 px-4">
                {user.photos.map((_, i) => (
                  <div
                    key={i}
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

            {/* Bottom panel fade */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-panel-fade pointer-events-none" />

            {/* Verified badge floating on photo */}
            {user.verified && (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
                <CheckCircle size={12} className="text-sage-500" />
                <span className="text-xs text-sage-600 font-medium">Verificado</span>
              </div>
            )}

            {/* Swipe indicators */}
            <AnimatePresence>
              {dragDirection === 'like' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-8 left-5 bg-sage-500 text-white font-semibold text-base px-4 py-1.5 rounded-2xl"
                  style={{ rotate: '-12deg' }}
                >
                  Conectar
                </motion.div>
              )}
              {dragDirection === 'dislike' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-8 right-5 bg-stone-700 text-white font-semibold text-base px-4 py-1.5 rounded-2xl"
                  style={{ rotate: '12deg' }}
                >
                  Passar
                </motion.div>
              )}
              {dragDirection === 'superlike' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-junto-100 text-ink font-semibold text-base px-5 py-1.5 rounded-2xl border border-junto-200"
                >
                  Especial ✦
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Editorial info section */}
        <div className="px-5 pt-4 pb-5 bg-white">
          {/* Line 1: name + age */}
          <div className="flex items-baseline gap-2">
            <h2 className="font-display font-semibold text-xl text-ink leading-tight">
              {user.name}
            </h2>
            <span className="text-stone-400 text-base">{user.age}</span>
          </div>

          {/* Line 2: location */}
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-stone-400 flex-shrink-0" />
            <span className="text-xs text-stone-400">
              {user.location} · {user.distance} km
            </span>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-stone-600 mt-2 italic leading-relaxed line-clamp-2">
              {user.bio}
            </p>
          )}

          {/* Interests */}
          {user.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {user.interests.slice(0, 3).map((interest) => (
                <Badge key={interest} variant="default">{interest}</Badge>
              ))}
              {user.interests.length > 3 && (
                <Badge variant="default">+{user.interests.length - 3}</Badge>
              )}
            </div>
          )}

          {/* Compatibility */}
          {user.compatibility && (
            <p className="text-xs text-sage-500 mt-2">
              {user.compatibility}% compatível
            </p>
          )}

          {/* Ver perfil completo */}
          <div className="flex justify-end mt-2">
            <button
              onClick={onOpen}
              className="text-xs text-sage-600 underline underline-offset-2 hover:text-sage-700 transition-colors"
            >
              Ver perfil completo
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
