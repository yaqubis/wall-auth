import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import clsx from 'clsx'

const TABS = ['Todos', 'Novos', 'Ativos', 'Arquivados']

export function Matches() {
  const navigate = useNavigate()
  const { matches, archiveMatch, muteMatch } = useAppStore()
  const [tab, setTab] = useState(0)
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const filtered = matches.filter((m) => {
    const matchesSearch = m.user.name.toLowerCase().includes(search.toLowerCase())
    if (tab === 1) return matchesSearch && m.status === 'new'
    if (tab === 2) return matchesSearch && m.status === 'active'
    if (tab === 3) return matchesSearch && m.status === 'archived'
    return matchesSearch && m.status !== 'archived'
  })

  const newMatches = matches.filter((m) => m.status === 'new')
  const totalConnections = matches.filter((m) => m.status !== 'archived').length

  return (
    <div className="h-screen bg-junto-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-10 pb-4 flex-shrink-0 bg-junto-50">
        <div className="mb-3">
          <h1 className="font-display text-2xl text-ink">Conexões</h1>
          <p className="text-stone-400 text-sm mt-0.5">{totalConnections} pessoas conectadas</p>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="w-full bg-white border border-junto-200 rounded-xl pl-9 pr-4 py-2.5 text-ink placeholder-stone-400 text-sm focus:outline-none focus:border-junto-300 transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-junto-100 rounded-xl p-1">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={clsx(
                'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all',
                tab === i
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-stone-400 hover:text-stone-600'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-4">
        {/* New matches spotlight */}
        {tab === 0 && newMatches.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Novos</p>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {newMatches.map((m) => (
                <motion.button
                  key={m.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => navigate(`/chat/${m.id}`)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5"
                >
                  <div className="relative">
                    <Badge variant="new" className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 text-[9px] px-1.5 py-0">
                      Novo
                    </Badge>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-sage-300 mt-3">
                      <img src={m.user.photos[0]} alt={m.user.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-xs text-stone-600 text-center truncate w-14">{m.user.name.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Matches list */}
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {tab === 0 && filtered.some((m) => m.status === 'active') && (
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 mt-1">Conversas</p>
            )}
            <AnimatePresence>
              {filtered
                .filter((m) => (tab === 0 ? m.status !== 'new' : true))
                .map((match) => (
                  <motion.div
                    key={match.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="relative"
                  >
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/chat/${match.id}`)}
                      className="w-full flex items-center gap-3 p-4 bg-white border border-junto-200 rounded-2xl hover:bg-junto-50 transition-colors text-left"
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar
                          src={match.user.photos[0]}
                          name={match.user.name}
                          size="lg"
                          online={match.user.online}
                        />
                        {match.muted && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-stone-100 border border-junto-200 rounded-full flex items-center justify-center text-[10px]">
                            🔕
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-ink text-sm">{match.user.name}</span>
                            {match.status === 'new' && <Badge variant="new" size="sm">Novo</Badge>}
                          </div>
                          <span className="text-xs text-stone-400 flex-shrink-0">
                            {formatDistanceToNow(match.matchedAt, { locale: ptBR, addSuffix: false })}
                          </span>
                        </div>
                        {match.lastMessage ? (
                          <p className={clsx(
                            'text-sm truncate',
                            match.unread > 0 ? 'text-ink font-medium' : 'text-stone-500'
                          )}>
                            {match.lastMessage.senderId === 'me' ? 'Você: ' : ''}
                            {match.lastMessage.text}
                          </p>
                        ) : (
                          <p className="text-sm text-sage-500">Diga olá!</p>
                        )}
                      </div>
                      {match.unread > 0 && (
                        <div className="min-w-5 h-5 px-1 bg-terra-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                          {match.unread}
                        </div>
                      )}
                    </motion.button>

                    {/* Context menu trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpen(menuOpen === match.id ? null : match.id)
                      }}
                      className="absolute right-3 top-3.5 p-1 text-stone-300 hover:text-stone-600 transition-colors"
                    >
                      ···
                    </button>

                    <AnimatePresence>
                      {menuOpen === match.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          className="absolute right-3 top-10 z-10 bg-white border border-junto-200 rounded-2xl p-1 min-w-[160px] shadow-card"
                        >
                          {[
                            { label: match.muted ? 'Ativar som' : 'Silenciar', action: () => muteMatch(match.id) },
                            { label: 'Arquivar', action: () => archiveMatch(match.id) },
                            { label: 'Bloquear', action: () => {} },
                            { label: 'Desfazer match', action: () => {} },
                          ].map(({ label, action }) => (
                            <button
                              key={label}
                              onClick={() => { action(); setMenuOpen(null) }}
                              className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:text-ink hover:bg-junto-50 rounded-xl transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-junto-200 rounded-3xl p-10 text-center mt-8"
          >
            <Heart size={32} className="text-stone-200 mx-auto mb-4" />
            <h3 className="font-display text-lg text-ink">Nenhuma conexão ainda</h3>
            <p className="text-stone-400 text-sm mt-2 leading-relaxed">
              Continue explorando perfis para fazer suas primeiras conexões.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
