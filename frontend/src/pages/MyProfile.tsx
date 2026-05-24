import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Edit3, Camera, Settings, Eye, Star, Zap, ChevronRight,
  CheckCircle, LogOut, MapPin, BarChart2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const statsConfig = [
  { icon: Eye, label: 'Visualizações', value: '1.2k' },
  { icon: BarChart2, label: 'Curtidas', value: '84' },
  { icon: Star, label: 'Matches', value: '23' },
  { icon: CheckCircle, label: 'Conversas', value: '12' },
]

export function MyProfile() {
  const navigate = useNavigate()
  const { currentUser, logout, updateProfile } = useAppStore()
  const superlikes = useAppStore((s) => s.superlikes)
  const boosts = useAppStore((s) => s.boosts)
  const [editOpen, setEditOpen] = useState(false)
  const [editBio, setEditBio] = useState(currentUser?.bio ?? '')
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!currentUser) return null

  const handleSave = () => {
    updateProfile({ bio: editBio })
    setEditOpen(false)
  }

  return (
    <div className="min-h-screen bg-junto-50 pb-28 overflow-y-auto">
      {/* Decorative top band */}
      <div className="relative h-36 bg-junto-warm">
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-10 right-5 bg-white border border-junto-200 rounded-xl p-2.5 text-stone-500 hover:text-ink transition-colors"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Profile section */}
      <div className="px-5 -mt-12 relative">
        <div className="flex items-end justify-between">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-card">
              <img src={currentUser.photos[0]} alt={currentUser.name} className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 bg-terra-500 text-white rounded-xl w-8 h-8 flex items-center justify-center shadow-button">
              <Camera size={14} />
            </button>
          </div>

          {/* Edit button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-junto-200 rounded-xl text-stone-600 text-sm font-medium hover:bg-junto-50 transition-colors"
          >
            <Edit3 size={14} />
            Editar perfil
          </motion.button>
        </div>

        {/* Identity */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl text-ink">
              {currentUser.name}, {currentUser.age}
            </h1>
            {currentUser.verified && (
              <CheckCircle size={18} className="text-sage-500" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={13} className="text-stone-400" />
            <p className="text-stone-400 text-sm">{currentUser.location}</p>
          </div>
          <p className="text-stone-600 text-sm mt-2 leading-relaxed">{currentUser.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {currentUser.interests.map((interest) => (
              <Badge key={interest} variant="default">{interest}</Badge>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {statsConfig.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white border border-junto-200 rounded-2xl p-4 text-center"
            >
              <p className="font-display text-xl text-ink">{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Premium section */}
        <div className="mt-6 bg-junto-50 border border-junto-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink">Junto Plus</p>
            <p className="text-stone-500 text-sm mt-0.5">
              Ver quem curtiu, superlikes ilimitados
            </p>
          </div>
          <button className="border border-terra-500 text-terra-500 bg-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-terra-500 hover:text-white transition-colors flex-shrink-0">
            Ver planos
          </button>
        </div>

        {/* Resources */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 bg-white border border-junto-200 rounded-2xl">
            <Star size={20} className="text-sage-500" />
            <div>
              <p className="text-ink font-semibold text-sm">{superlikes}</p>
              <p className="text-stone-400 text-xs">Superlikes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white border border-junto-200 rounded-2xl">
            <Zap size={20} className="text-terra-500" />
            <div>
              <p className="text-ink font-semibold text-sm">{boosts}</p>
              <p className="text-stone-400 text-xs">Boosts</p>
            </div>
          </div>
        </div>

        {/* Photos grid */}
        <div className="mt-6">
          <p className="font-semibold text-ink mb-3 text-sm">Fotos</p>
          <div className="grid grid-cols-3 gap-2">
            {currentUser.photos.map((photo, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden relative">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <div className="absolute bottom-1.5 left-1.5 bg-sage-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Principal
                  </div>
                )}
              </div>
            ))}
            <button className="aspect-square rounded-2xl border-2 border-dashed border-junto-300 flex items-center justify-center text-stone-300 hover:border-junto-400 hover:text-stone-400 transition-colors">
              <Camera size={22} />
            </button>
          </div>
        </div>

        {/* Menu items */}
        <div className="mt-6 bg-white border border-junto-200 rounded-2xl overflow-hidden divide-y divide-junto-100">
          {[
            { label: 'Preferências de descoberta', icon: Settings, action: () => navigate('/settings') },
            { label: 'Privacidade e segurança', icon: '🔒', action: () => navigate('/settings') },
            { label: 'Notificações', icon: '🔔', action: () => navigate('/settings') },
          ].map(({ label, icon: Icon, action }) => (
            <motion.button
              key={label}
              whileTap={{ scale: 0.98 }}
              onClick={action}
              className="w-full flex items-center gap-3 p-4 hover:bg-junto-50 transition-colors text-left"
            >
              {typeof Icon === 'string' ? (
                <span className="text-base">{Icon}</span>
              ) : (
                <Icon size={17} className="text-stone-400" />
              )}
              <span className="flex-1 text-stone-600 text-sm">{label}</span>
              <ChevronRight size={15} className="text-stone-300" />
            </motion.button>
          ))}
        </div>

        {/* Danger zone */}
        <div className="mt-4 space-y-2">
          <Button
            variant="ghost"
            size="md"
            fullWidth
            icon={<LogOut size={16} />}
            onClick={logout}
            className="text-stone-400 justify-start gap-3 px-4"
          >
            Sair
          </Button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="w-full bg-white border border-red-200 text-red-500 rounded-2xl py-3 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Excluir conta
          </button>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar perfil">
        <div className="space-y-4">
          <Input label="Nome" defaultValue={currentUser.name} />
          <div>
            <label className="text-sm font-medium text-stone-600 block mb-2">Bio</label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="Conte um pouco sobre você..."
              className="w-full bg-junto-50 border border-junto-200 rounded-2xl px-4 py-3 text-ink placeholder-stone-400 focus:outline-none focus:border-junto-300 resize-none text-sm transition-colors"
            />
          </div>
          <Button variant="sage" fullWidth onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Excluir conta">
        <div className="space-y-4">
          <p className="text-stone-600 text-sm leading-relaxed">
            Esta ação é permanente. Todos os seus dados, conexões e conversas serão apagados e não poderão ser recuperados.
          </p>
          <Button variant="danger" fullWidth onClick={() => { logout(); setDeleteOpen(false) }}>
            Confirmar exclusão
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setDeleteOpen(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
