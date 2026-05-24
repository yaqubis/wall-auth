import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Smile, Image, MoreVertical, Phone, Video, MessageCircle } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Avatar } from '../components/ui/Avatar'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import clsx from 'clsx'

const EMOJIS = ['❤️', '😂', '😍', '🥰', '👏', '🔥', '✨', '😊']

function ChatList({ onSelect }: { onSelect: (id: string) => void }) {
  const matches = useAppStore((s) => s.matches)
  const navigate = useNavigate()

  const unreadCount = matches.filter((m) => m.unread > 0).length

  return (
    <div className="h-screen bg-junto-50 flex flex-col">
      <div className="px-5 pt-10 pb-4 flex-shrink-0">
        <h1 className="font-display text-2xl text-ink">Mensagens</h1>
        <p className="text-stone-400 text-sm mt-0.5">
          {unreadCount > 0 ? `${unreadCount} não lidas` : 'Tudo lido'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-2">
        {matches.filter((m) => m.status !== 'archived').length > 0 ? (
          matches.filter((m) => m.status !== 'archived').map((match) => (
            <motion.button
              key={match.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/chat/${match.id}`)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-junto-200 rounded-2xl hover:bg-junto-50 transition-colors text-left"
            >
              <Avatar
                src={match.user.photos[0]}
                name={match.user.name}
                size="lg"
                online={match.user.online}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-ink text-sm">{match.user.name}</span>
                  {match.lastMessage && (
                    <span className="text-xs text-stone-400">
                      {formatDistanceToNow(match.lastMessage.sentAt, { locale: ptBR, addSuffix: false })}
                    </span>
                  )}
                </div>
                {match.lastMessage ? (
                  <p className={clsx(
                    'text-sm truncate',
                    match.unread > 0 ? 'text-ink font-medium' : 'text-stone-500'
                  )}>
                    {match.lastMessage.senderId === 'me' && (
                      <span className="text-stone-400">Você: </span>
                    )}
                    {match.lastMessage.text}
                  </p>
                ) : (
                  <p className="text-sm text-sage-500 italic">Diga olá</p>
                )}
              </div>
              {match.unread > 0 && (
                <div className="min-w-5 h-5 px-1 bg-terra-500 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                  {match.unread}
                </div>
              )}
            </motion.button>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-junto-200 rounded-3xl p-10 text-center mt-8"
          >
            <MessageCircle size={32} className="text-stone-200 mx-auto mb-4" />
            <h3 className="font-display text-lg text-ink">Nenhuma conversa ainda</h3>
            <p className="text-stone-400 text-sm mt-2 leading-relaxed">
              Faça uma conexão para começar a conversar.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function ChatConversation({ matchId }: { matchId: string }) {
  const navigate = useNavigate()
  const { matches, messages, sendMessage, markMatchRead } = useAppStore()
  const match = matches.find((m) => m.id === matchId)
  const msgs = messages[matchId] ?? []
  const [text, setText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const [isTyping] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchId) markMatchRead(matchId)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [matchId, msgs.length])

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(matchId, text.trim())
    setText('')
    setShowEmojis(false)
  }

  if (!match) return null

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-junto-200 px-4 pt-10 pb-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate('/chat')}
          className="p-1.5 rounded-xl text-stone-400 hover:text-ink transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <Avatar src={match.user.photos[0]} name={match.user.name} size="md" online={match.user.online} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-sm">{match.user.name}</p>
          <p className={clsx('text-xs', match.user.online ? 'text-sage-500' : 'text-stone-400')}>
            {match.user.online
              ? 'Online agora'
              : `Visto ${formatDistanceToNow(match.user.lastActive, { locale: ptBR, addSuffix: true })}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl text-stone-400 hover:text-ink transition-colors">
            <Phone size={18} />
          </button>
          <button className="p-2 rounded-xl text-stone-400 hover:text-ink transition-colors">
            <Video size={18} />
          </button>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-stone-400 hover:text-ink transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 top-10 z-10 bg-white border border-junto-200 rounded-2xl p-1 min-w-[160px] shadow-card"
                >
                  {['Silenciar', 'Bloquear', 'Denunciar', 'Apagar conversa', 'Desfazer match'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setMenuOpen(false)}
                      className={clsx(
                        'w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors',
                        item === 'Bloquear' || item === 'Denunciar' || item === 'Desfazer match'
                          ? 'text-red-500 hover:bg-red-50'
                          : 'text-stone-600 hover:text-ink hover:bg-junto-50'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-junto-50 space-y-3">
        {msgs.map((msg, i) => {
          const isMe = msg.senderId === 'me'
          const showTime =
            i === 0 ||
            Math.abs(msgs[i - 1].sentAt.getTime() - msg.sentAt.getTime()) > 5 * 60 * 1000
          return (
            <div key={msg.id}>
              {showTime && (
                <div className="text-center text-xs text-stone-400 my-2">
                  {format(msg.sentAt, 'HH:mm', { locale: ptBR })}
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={clsx('flex', isMe ? 'justify-end' : 'justify-start')}
              >
                {!isMe && (
                  <Avatar
                    src={match.user.photos[0]}
                    name={match.user.name}
                    size="xs"
                    className="mr-2 mt-auto mb-1"
                  />
                )}
                <div
                  className={clsx(
                    'max-w-[75%] px-4 py-2.5 text-sm',
                    isMe
                      ? 'bg-sage-gradient text-white rounded-3xl rounded-br-md'
                      : 'bg-white border border-junto-200 text-ink rounded-3xl rounded-bl-md'
                  )}
                >
                  {msg.text}
                  <div className={clsx('flex items-center gap-1 mt-0.5', isMe ? 'justify-end' : 'justify-start')}>
                    <span className={clsx('text-[10px]', isMe ? 'text-white/60' : 'text-stone-400')}>
                      {format(msg.sentAt, 'HH:mm')}
                    </span>
                    {isMe && (
                      <span className="text-[10px] text-white/60">
                        {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}

        {isTyping && (
          <div className="flex items-center gap-2">
            <Avatar src={match.user.photos[0]} name={match.user.name} size="xs" />
            <div className="px-4 py-3 bg-white border border-junto-200 rounded-3xl rounded-bl-md flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 bg-stone-400 rounded-full"
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex gap-3 px-4 py-3 bg-white border-t border-junto-200"
          >
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setText((t) => t + e)}
                className="text-2xl hover:scale-125 transition-transform active:scale-95"
              >
                {e}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className="bg-white border-t border-junto-200 px-4 pb-8 pt-3 flex items-end gap-2 flex-shrink-0">
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className={clsx(
            'p-2.5 rounded-xl transition-colors',
            showEmojis ? 'text-sage-500 bg-sage-50' : 'text-stone-400 hover:text-sage-500'
          )}
        >
          <Smile size={20} />
        </button>
        <button className="p-2.5 rounded-xl text-stone-400 hover:text-stone-600 transition-colors">
          <Image size={20} />
        </button>
        <div className="flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escreva uma mensagem..."
            className="w-full bg-junto-50 border border-junto-200 rounded-2xl px-4 py-3 text-ink placeholder-stone-400 text-sm focus:outline-none focus:border-junto-300 transition-colors"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={text.trim() ? handleSend : undefined}
          className={clsx(
            'p-2.5 rounded-xl transition-all',
            text.trim()
              ? 'bg-sage-gradient text-white shadow-sage-button'
              : 'bg-junto-100 text-stone-300 cursor-default'
          )}
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  )
}

export function Chat() {
  const { matchId } = useParams<{ matchId?: string }>()
  return matchId ? <ChatConversation matchId={matchId} /> : <ChatList onSelect={() => {}} />
}
