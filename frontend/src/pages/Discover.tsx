import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, Settings, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ProfileCard } from '../components/cards/ProfileCard'
import { ActionButtons } from '../components/cards/ActionButtons'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useAppStore } from '../store'
import { FullProfileModal } from '../components/modals/FullProfileModal'
import { MatchModal } from '../components/modals/MatchModal'
import { Button } from '../components/ui/Button'
import type { User } from '../types'
import toast from 'react-hot-toast'

export function Discover() {
  const navigate = useNavigate()
  const { profiles, currentIndex, superlikes, boosts, lastAction, swipeProfile, undoLastAction } = useAppStore()
  const matches = useAppStore((s) => s.matches)

  const [selectedProfile, setSelectedProfile] = useState<User | null>(null)
  const [matchedProfile, setMatchedProfile] = useState<User | null>(null)
  const [isLoading] = useState(false)

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3)
  const hasProfiles = currentIndex < profiles.length

  const handleSwipe = (direction: 'like' | 'dislike' | 'superlike') => {
    const profile = profiles[currentIndex]
    if (!profile) return

    const prevMatchCount = matches.length
    swipeProfile(direction)

    setTimeout(() => {
      const newMatches = useAppStore.getState().matches
      if (newMatches.length > prevMatchCount && direction !== 'dislike') {
        setMatchedProfile(profile)
      }
    }, 200)

    if (direction === 'like')
      toast('Curtiu!', {
        duration: 1500,
        style: { background: '#fff', border: '1px solid #E5DDD0', color: '#1C1C1A', borderRadius: '1rem' },
      })
    if (direction === 'superlike')
      toast('Superlike enviado!', {
        duration: 1500,
        style: { background: '#fff', border: '1px solid #E5DDD0', color: '#1C1C1A', borderRadius: '1rem' },
      })
    if (direction === 'dislike')
      toast('Passou...', {
        duration: 1000,
        style: { background: '#fff', border: '1px solid #E5DDD0', color: '#78716c', borderRadius: '1rem' },
      })
  }

  const handleBoost = () => {
    toast('Boost ativado! Seu perfil está em destaque por 30 minutos.', {
      duration: 3000,
      style: { background: '#fff', border: '1px solid #E5DDD0', color: '#1C1C1A', borderRadius: '1rem' },
    })
  }

  return (
    <div className="min-h-screen bg-junto-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-junto-200 px-5 pt-10 pb-3 flex items-center justify-between flex-shrink-0">
        <span className="font-display text-xl text-ink">
          junto<span className="text-terra-500">.</span>
        </span>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/explore')}
            className="bg-junto-50 border border-junto-200 rounded-xl p-2.5 text-stone-500 hover:text-ink transition-colors"
          >
            <SlidersHorizontal size={18} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate('/settings')}
            className="bg-junto-50 border border-junto-200 rounded-xl p-2.5 text-stone-500 hover:text-ink transition-colors"
          >
            <Settings size={18} />
          </motion.button>
        </div>
      </div>

      {/* Cards Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4 relative">
        {isLoading ? (
          <CardSkeleton />
        ) : hasProfiles ? (
          <div className="relative w-full max-w-sm h-[480px] flex items-center justify-center">
            <AnimatePresence>
              {visibleProfiles.map((profile, i) => (
                <ProfileCard
                  key={profile.id}
                  user={profile}
                  isTop={i === 0}
                  stackIndex={i}
                  onSwipe={handleSwipe}
                  onOpen={() => setSelectedProfile(profile)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-junto-200 rounded-3xl p-8 text-center max-w-xs mx-auto"
          >
            <Compass size={32} className="text-stone-300 mx-auto mb-4" />
            <h3 className="font-display text-lg text-ink">Explorou tudo por hoje</h3>
            <p className="text-stone-500 text-sm mt-2 leading-relaxed">
              Volte mais tarde ou ajuste seus filtros para ver mais pessoas.
            </p>
            <div className="mt-5">
              <Button variant="secondary" onClick={() => navigate('/explore')}>
                Ajustar filtros
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      {hasProfiles && (
        <div className="flex-shrink-0 px-4 pb-24">
          <ActionButtons
            onDislike={() => handleSwipe('dislike')}
            onLike={() => handleSwipe('like')}
            onSuperlike={() => handleSwipe('superlike')}
            onUndo={undoLastAction}
            onBoost={handleBoost}
            superlikes={superlikes}
            canUndo={!!lastAction}
          />
        </div>
      )}

      {/* Modals */}
      {selectedProfile && (
        <FullProfileModal
          user={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onLike={() => { handleSwipe('like'); setSelectedProfile(null) }}
          onDislike={() => { handleSwipe('dislike'); setSelectedProfile(null) }}
          onSuperlike={() => { handleSwipe('superlike'); setSelectedProfile(null) }}
        />
      )}

      {matchedProfile && (
        <MatchModal
          user={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onChat={() => { setMatchedProfile(null); navigate('/chat') }}
        />
      )}
    </div>
  )
}
