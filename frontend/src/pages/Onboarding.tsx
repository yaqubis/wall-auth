import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../store'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const highlights = [
  '✓ Gratuito para começar',
  '✓ Sem elitismo',
  '✓ Conexões reais',
]

export function Onboarding() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)

  return (
    <div className="min-h-screen bg-junto-50 flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-15%] w-80 h-80 bg-sage-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-15%] w-72 h-72 bg-terra-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex-1 flex flex-col justify-between px-6 pt-14 pb-10 max-w-md mx-auto w-full"
      >
        {/* Top: Logo */}
        <motion.div variants={fadeUp}>
          <div className="flex items-baseline gap-0.5">
            <span className="font-display font-semibold text-3xl text-ink">junto</span>
            <span className="font-display font-semibold text-3xl text-terra-500">.</span>
          </div>
          <div className="w-8 h-0.5 bg-sage-500 mt-1" />
        </motion.div>

        {/* Middle: Headline + pills */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-display font-semibold text-ink leading-tight"
          >
            Amor só é livre
            <br />
            quando acessível<span className="text-terra-500">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base text-stone-500 mt-4 leading-relaxed max-w-xs"
          >
            Encontre conexões reais, próximas e sem barreiras. Para todo mundo.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-6">
            {highlights.map((text) => (
              <span
                key={text}
                className="bg-white border border-junto-200 rounded-full inline-flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600"
              >
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Bottom: CTAs */}
        <div>
          <motion.div variants={fadeUp} className="space-y-3">
            <Button
              variant="primary"
              size="xl"
              fullWidth
              onClick={() => navigate('/register')}
            >
              Criar minha conta
            </Button>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate('/login')}
            >
              Já tenho conta
            </Button>
          </motion.div>

          {/* Social login */}
          <motion.div variants={fadeUp} className="mt-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-junto-200" />
              <span className="text-stone-400 text-xs">ou continue com</span>
              <div className="flex-1 h-px bg-junto-200" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Google', 'Apple', 'E-mail'].map((provider) => (
                <motion.button
                  key={provider}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="bg-white border border-junto-200 rounded-xl py-3 text-sm text-stone-600 hover:bg-junto-50 transition-colors"
                >
                  {provider}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.button
            variants={fadeUp}
            whileTap={{ scale: 0.97 }}
            onClick={() => { login(); navigate('/discover') }}
            className="w-full mt-4 py-2.5 text-xs text-stone-400 border border-dashed border-junto-200 rounded-xl hover:border-junto-300 hover:text-stone-500 transition-colors"
          >
            Entrar como usuário de teste
          </motion.button>

          <motion.p variants={fadeUp} className="text-xs text-stone-400 text-center mt-4">
            Ao continuar, você concorda com os{' '}
            <span className="text-terra-500 cursor-pointer hover:underline">Termos de Uso</span>
            {' '}e{' '}
            <span className="text-terra-500 cursor-pointer hover:underline">Política de Privacidade</span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
