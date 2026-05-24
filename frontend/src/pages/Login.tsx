import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Lock } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAppStore } from '../store'

export function Login() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)

  const handleLogin = () => {
    login()
    navigate('/discover')
  }

  return (
    <div className="min-h-screen bg-junto-50 flex flex-col max-w-md mx-auto px-6">
      {/* Header */}
      <div className="pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white border border-junto-200 text-stone-500 hover:bg-junto-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-baseline gap-0.5">
          <span className="font-display font-semibold text-xl text-ink">junto</span>
          <span className="font-display font-semibold text-xl text-terra-500">.</span>
        </div>
        <div className="w-9" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex-1 flex flex-col justify-center gap-6 pb-10"
      >
        {/* Heading */}
        <div>
          <h1 className="font-display text-3xl text-ink font-semibold leading-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-stone-500 text-base mt-1">Continue de onde parou</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            icon={<Mail size={16} />}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Sua senha"
            icon={<Lock size={16} />}
          />
          <div className="flex justify-end">
            <button className="text-sage-600 text-sm hover:text-sage-700 transition-colors">
              Esqueci a senha
            </button>
          </div>
        </div>

        <Button variant="primary" size="xl" fullWidth onClick={handleLogin}>
          Entrar
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-junto-200" />
          <span className="text-stone-400 text-xs">ou continue com</span>
          <div className="flex-1 h-px bg-junto-200" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-3 gap-3">
          {['Google', 'Apple', 'E-mail'].map((p) => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
              className="py-3 bg-white border border-junto-200 rounded-xl text-stone-600 text-sm font-medium hover:bg-junto-50 transition-colors"
            >
              {p}
            </motion.button>
          ))}
        </div>

        {/* Sign up link */}
        <p className="text-center text-stone-500 text-sm">
          Novo por aqui?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-terra-600 font-semibold hover:text-terra-500 transition-colors"
          >
            Criar conta
          </button>
        </p>
      </motion.div>
    </div>
  )
}
