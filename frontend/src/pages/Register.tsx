import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Camera } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAppStore } from '../store'
import clsx from 'clsx'

const STEPS = ['Básico', 'Identidade', 'Sobre você', 'Fotos', 'Objetivo']

const GOALS = [
  { id: 'friendship', emoji: '🤝', label: 'Amizade' },
  { id: 'dating', emoji: '💕', label: 'Namoro' },
  { id: 'serious', emoji: '💍', label: 'Sério' },
  { id: 'casual', emoji: '✨', label: 'Casual' },
  { id: 'networking', emoji: '🌐', label: 'Networking' },
]

const INTERESTS = [
  'Música', 'Viagens', 'Culinária', 'Esportes', 'Arte',
  'Leitura', 'Cinema', 'Tecnologia', 'Yoga', 'Fotografia',
  'Dança', 'Natureza', 'Games', 'Moda', 'Pets',
]

const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
}

export function Register() {
  const navigate = useNavigate()
  const login = useAppStore((s) => s.login)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    orientation: '',
    location: 'São Paulo, SP',
    bio: '',
    interests: [] as string[],
    goal: '',
    photos: [] as string[],
  })

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }))

  const toggleInterest = (i: string) =>
    update(
      'interests',
      form.interests.includes(i)
        ? form.interests.filter((x) => x !== i)
        : [...form.interests, i]
    )

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      finish()
    }
  }

  const back = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      navigate('/')
    }
  }

  const finish = () => {
    login()
    navigate('/discover')
  }

  const genders = ['Homem', 'Mulher', 'Não-binário', 'Outro']
  const orientations = ['Heterossexual', 'Homossexual', 'Bissexual', 'Pansexual', 'Outro']

  return (
    <div className="min-h-screen bg-junto-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={back}
          className="p-2 rounded-full bg-white border border-junto-200 text-stone-500 hover:bg-junto-100 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          {/* Progress bars */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full bg-junto-200 overflow-hidden"
              >
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    i <= step ? 'bg-sage-500 w-full' : 'w-0'
                  )}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-1.5">
            Passo {step + 1} de {STEPS.length}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Step 0: Básico */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl text-ink font-semibold">
                    Bem-vindo!
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    Vamos criar seu perfil juntos
                  </p>
                </div>
                <Input
                  label="Seu nome"
                  placeholder="Como quer ser chamado?"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                />
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
                <Input
                  label="Senha"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  hint="Use letras, números e símbolos para maior segurança"
                />
                <Input
                  label="Idade"
                  type="number"
                  placeholder="Sua idade"
                  value={form.age}
                  onChange={(e) => update('age', e.target.value)}
                />
              </div>
            )}

            {/* Step 1: Identidade */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-ink font-semibold">
                    Identidade
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    Isso ajuda a encontrar pessoas compatíveis
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-600 mb-2.5">Gênero</p>
                  <div className="grid grid-cols-2 gap-2">
                    {genders.map((g) => (
                      <button
                        key={g}
                        onClick={() => update('gender', g)}
                        className={clsx(
                          'py-3 px-4 rounded-xl text-sm font-medium border transition-all',
                          form.gender === g
                            ? 'border-sage-500 bg-sage-50 text-sage-700'
                            : 'border-junto-200 bg-white text-stone-600 hover:border-junto-300'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-600 mb-2.5">Orientação</p>
                  <div className="grid grid-cols-2 gap-2">
                    {orientations.map((o) => (
                      <button
                        key={o}
                        onClick={() => update('orientation', o)}
                        className={clsx(
                          'py-3 px-4 rounded-xl text-sm font-medium border transition-all',
                          form.orientation === o
                            ? 'border-sage-500 bg-sage-50 text-sage-700'
                            : 'border-junto-200 bg-white text-stone-600 hover:border-junto-300'
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Sobre você */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl text-ink font-semibold">
                    Sobre você
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">O que te torna único?</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-2">
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => update('bio', e.target.value)}
                    placeholder="Conte um pouco sobre você... seja autêntico!"
                    maxLength={300}
                    rows={4}
                    className="w-full bg-white border border-junto-200 rounded-xl px-4 py-3.5 text-ink placeholder-stone-400 focus:outline-none focus:border-sage-400 resize-none transition-colors"
                  />
                  <p className="text-xs text-stone-400 text-right mt-1">
                    {form.bio.length}/300
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-600 mb-2.5">
                    Interesses
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={clsx(
                          'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all',
                          form.interests.includes(interest)
                            ? 'border-sage-500 bg-sage-50 text-sage-700'
                            : 'border-junto-200 bg-white text-stone-600 hover:border-junto-300'
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Fotos */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl text-ink font-semibold">
                    Suas fotos
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    Adicione pelo menos 2 fotos para um perfil completo
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.95 }}
                      className={clsx(
                        'aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all bg-white',
                        i === 0
                          ? 'border-junto-300'
                          : 'border-junto-200 hover:border-junto-300'
                      )}
                    >
                      <Camera
                        size={i === 0 ? 24 : 18}
                        className="text-stone-300"
                      />
                      {i === 0 && (
                        <span className="text-xs text-stone-400 font-medium">
                          Principal
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
                <div className="bg-sage-50 border border-sage-100 rounded-2xl p-4">
                  <p className="text-sage-700 text-sm font-medium mb-1">
                    ✓ Dicas para ótimas fotos
                  </p>
                  <ul className="text-sage-600/80 text-xs space-y-1">
                    <li>• Foto nítida e bem iluminada</li>
                    <li>• Mostre seu rosto claramente</li>
                    <li>• Sorria — autenticidade atrai!</li>
                    <li>• Inclua uma foto inteira</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Objetivo */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl text-ink font-semibold">
                    Seu objetivo
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    O que você está buscando no Junto?
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {GOALS.map((goal) => (
                    <motion.button
                      key={goal.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => update('goal', goal.id)}
                      className={clsx(
                        'flex items-center gap-4 p-4 rounded-2xl border transition-all text-left',
                        form.goal === goal.id
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-junto-200 bg-white hover:border-junto-300'
                      )}
                    >
                      <span className="text-2xl">{goal.emoji}</span>
                      <p
                        className={clsx(
                          'font-semibold text-base',
                          form.goal === goal.id ? 'text-sage-700' : 'text-ink'
                        )}
                      >
                        {goal.label}
                      </p>
                      {form.goal === goal.id && (
                        <Check size={18} className="text-sage-600 ml-auto" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 pb-10 pt-5">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          icon={step === STEPS.length - 1 ? undefined : <ArrowRight size={20} />}
          onClick={next}
        >
          {step === STEPS.length - 1 ? 'Começar a descobrir' : 'Continuar'}
        </Button>
      </div>
    </div>
  )
}
