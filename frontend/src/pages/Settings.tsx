import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ChevronRight, Moon, Sun, Globe, Bell,
  Lock, Shield, HelpCircle, FileText,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import clsx from 'clsx'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0',
        value ? 'bg-sage-500' : 'bg-junto-200'
      )}
    >
      <motion.div
        animate={{ x: value ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  )
}

function SettingsRow({
  icon,
  label,
  value,
  onClick,
  toggle,
  toggleValue,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  onClick?: () => void
  toggle?: boolean
  toggleValue?: boolean
  onToggle?: (v: boolean) => void
}) {
  return (
    <motion.button
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 hover:bg-junto-50 transition-colors text-left"
    >
      <span className="text-stone-400 flex-shrink-0">{icon}</span>
      <span className="flex-1 text-stone-700 text-sm">{label}</span>
      {toggle && onToggle ? (
        <Toggle value={toggleValue ?? false} onChange={onToggle} />
      ) : (
        <>
          {value && <span className="text-stone-400 text-sm mr-1">{value}</span>}
          {onClick && <ChevronRight size={15} className="text-stone-300" />}
        </>
      )}
    </motion.button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-5 mb-1">
        {title}
      </p>
      <div className="bg-white border border-junto-200 rounded-2xl overflow-hidden divide-y divide-junto-100">
        {children}
      </div>
    </div>
  )
}

export function Settings() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useAppStore()
  const [notifs, setNotifs] = useState({
    matches: true,
    messages: true,
    likes: false,
    security: true,
  })
  const [privacy, setPrivacy] = useState({
    showAge: true,
    showDistance: true,
    showOnline: true,
  })

  return (
    <div className="min-h-screen bg-junto-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-junto-200 px-5 pt-10 pb-4 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate(-1)}
          className="bg-junto-50 border border-junto-200 rounded-xl p-2 text-stone-600 hover:text-ink transition-colors"
        >
          <ArrowLeft size={18} />
        </motion.button>
        <h1 className="font-display text-xl text-ink">Configurações</h1>
      </div>

      <div className="px-5 space-y-6 mt-5">
        {/* Appearance */}
        <Section title="Aparência">
          <SettingsRow
            icon={theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            label="Tema"
            value={theme === 'dark' ? 'Escuro' : 'Claro'}
            onClick={toggleTheme}
          />
          <SettingsRow
            icon={<Globe size={18} />}
            label="Idioma"
            value="Português"
            onClick={() => {}}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notificações">
          <SettingsRow
            icon={<Bell size={18} />}
            label="Novos matches"
            toggle
            toggleValue={notifs.matches}
            onToggle={(v) => setNotifs({ ...notifs, matches: v })}
          />
          <SettingsRow
            icon={<Bell size={18} />}
            label="Mensagens"
            toggle
            toggleValue={notifs.messages}
            onToggle={(v) => setNotifs({ ...notifs, messages: v })}
          />
          <SettingsRow
            icon={<Bell size={18} />}
            label="Curtidas"
            toggle
            toggleValue={notifs.likes}
            onToggle={(v) => setNotifs({ ...notifs, likes: v })}
          />
          <SettingsRow
            icon={<Bell size={18} />}
            label="Alertas de segurança"
            toggle
            toggleValue={notifs.security}
            onToggle={(v) => setNotifs({ ...notifs, security: v })}
          />
        </Section>

        {/* Privacy */}
        <Section title="Privacidade">
          <SettingsRow
            icon={<Lock size={18} />}
            label="Mostrar idade"
            toggle
            toggleValue={privacy.showAge}
            onToggle={(v) => setPrivacy({ ...privacy, showAge: v })}
          />
          <SettingsRow
            icon={<Lock size={18} />}
            label="Mostrar distância"
            toggle
            toggleValue={privacy.showDistance}
            onToggle={(v) => setPrivacy({ ...privacy, showDistance: v })}
          />
          <SettingsRow
            icon={<Lock size={18} />}
            label="Mostrar status online"
            toggle
            toggleValue={privacy.showOnline}
            onToggle={(v) => setPrivacy({ ...privacy, showOnline: v })}
          />
          <SettingsRow
            icon={<Lock size={18} />}
            label="Controle de localização"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<Lock size={18} />}
            label="Perfis bloqueados"
            onClick={() => {}}
          />
        </Section>

        {/* Security */}
        <Section title="Segurança">
          <SettingsRow
            icon={<Shield size={18} />}
            label="Verificação de identidade"
            value="Ativo"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<Shield size={18} />}
            label="Autenticação em dois fatores"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<Shield size={18} />}
            label="Dispositivos conectados"
            onClick={() => {}}
          />
        </Section>

        {/* Support */}
        <Section title="Suporte">
          <SettingsRow
            icon={<HelpCircle size={18} />}
            label="Central de ajuda"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<FileText size={18} />}
            label="Termos de uso"
            onClick={() => {}}
          />
          <SettingsRow
            icon={<FileText size={18} />}
            label="Política de privacidade"
            onClick={() => {}}
          />
        </Section>

        {/* Version */}
        <div className="text-center pb-4 space-y-1">
          <p className="text-stone-400 text-xs">Junto v1.0</p>
          <p className="text-stone-300 text-xs">Conexões humanas, de verdade.</p>
        </div>
      </div>
    </div>
  )
}
