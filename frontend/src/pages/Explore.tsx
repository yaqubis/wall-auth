import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { Button } from '../components/ui/Button'
import clsx from 'clsx'

const INTEREST_OPTIONS = [
  'Música', 'Viagens', 'Culinária', 'Esportes', 'Arte', 'Leitura',
  'Cinema', 'Tecnologia', 'Yoga', 'Fotografia', 'Dança', 'Natureza',
]
const GOALS = ['Amizade', 'Namoro', 'Sério', 'Casual', 'Networking']
const GENDERS = ['Homem', 'Mulher', 'Não-binário', 'Todos']

function Slider({
  label, min, max, value, onChange, unit,
}: {
  label: string
  min: number
  max: number
  value: [number, number]
  onChange: (v: [number, number]) => void
  unit: string
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-stone-600">{label}</p>
        <span className="text-sm text-ink font-semibold">
          {value[0]} — {value[1]} {unit}
        </span>
      </div>
      <div className="relative h-2 bg-junto-200 rounded-full">
        <div
          className="absolute h-full bg-sage-gradient rounded-full"
          style={{
            left: `${((value[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((value[1] - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range" min={min} max={max} value={value[0]}
          onChange={(e) => onChange([+e.target.value, value[1]])}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <input
          type="range" min={min} max={max} value={value[1]}
          onChange={(e) => onChange([value[0], +e.target.value])}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute -top-1.5 w-5 h-5 bg-white border-2 border-sage-500 rounded-full shadow-sm cursor-pointer"
          style={{ left: `calc(${((value[0] - min) / (max - min)) * 100}% - 10px)` }}
        />
        <div
          className="absolute -top-1.5 w-5 h-5 bg-white border-2 border-sage-500 rounded-full shadow-sm cursor-pointer"
          style={{ left: `calc(${((value[1] - min) / (max - min)) * 100}% - 10px)` }}
        />
      </div>
    </div>
  )
}

function Toggle({
  label, value, onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-stone-700">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-all duration-300',
          value ? 'bg-sage-500' : 'bg-junto-200'
        )}
      >
        <motion.div
          animate={{ x: value ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  )
}

function SectionContainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-junto-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-junto-100">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  )
}

export function Explore() {
  const navigate = useNavigate()
  const { filters, updateFilters } = useAppStore()
  const [ageRange, setAgeRange] = useState<[number, number]>([filters.ageMin, filters.ageMax])
  const [distanceRange, setDistanceRange] = useState<[number, number]>([18, filters.distanceMax])
  const [selectedGenders, setSelectedGenders] = useState<string[]>(filters.gender)
  const [selectedGoals, setSelectedGoals] = useState<string[]>(filters.goals)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(filters.interests)
  const [onlyVerified, setOnlyVerified] = useState(filters.onlyVerified)
  const [onlyActive, setOnlyActive] = useState(filters.onlyActive)

  const toggleArr = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])
  }

  const apply = () => {
    updateFilters({
      ageMin: ageRange[0],
      ageMax: ageRange[1],
      distanceMax: distanceRange[1],
      gender: selectedGenders,
      goals: selectedGoals,
      interests: selectedInterests,
      onlyVerified,
      onlyActive,
    })
    navigate(-1)
  }

  const reset = () => {
    setAgeRange([18, 45])
    setDistanceRange([18, 50])
    setSelectedGenders([])
    setSelectedGoals([])
    setSelectedInterests([])
    setOnlyVerified(false)
    setOnlyActive(false)
  }

  return (
    <div className="min-h-screen bg-junto-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-junto-200 px-5 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(-1)}
            className="bg-junto-50 border border-junto-200 rounded-xl p-2 text-stone-600 hover:text-ink transition-colors"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <h1 className="font-display text-xl text-ink">Preferências</h1>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-terra-500 text-sm font-medium"
        >
          <RotateCcw size={14} />
          Limpar
        </button>
      </div>

      <div className="px-5 space-y-6 mt-6">
        {/* Age */}
        <SectionContainer title="Faixa etária">
          <Slider label="Idade" min={18} max={70} value={ageRange} onChange={setAgeRange} unit="anos" />
        </SectionContainer>

        {/* Distance */}
        <SectionContainer title="Distância">
          <Slider label="Distância máxima" min={1} max={200} value={distanceRange} onChange={setDistanceRange} unit="km" />
        </SectionContainer>

        {/* Gender */}
        <SectionContainer title="Mostrar">
          <div className="p-4 grid grid-cols-2 gap-2">
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => toggleArr(selectedGenders, g, setSelectedGenders)}
                className={clsx(
                  'py-3 rounded-xl text-sm font-medium border transition-all',
                  selectedGenders.includes(g)
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'bg-white border-junto-200 text-stone-600 hover:border-junto-300'
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </SectionContainer>

        {/* Goals */}
        <SectionContainer title="Objetivo">
          <div className="p-4 flex flex-wrap gap-2">
            {GOALS.map((goal) => (
              <button
                key={goal}
                onClick={() => toggleArr(selectedGoals, goal, setSelectedGoals)}
                className={clsx(
                  'px-4 py-2 rounded-full text-sm font-medium border transition-all',
                  selectedGoals.includes(goal)
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'bg-white border-junto-200 text-stone-600 hover:border-junto-300'
                )}
              >
                {goal}
              </button>
            ))}
          </div>
        </SectionContainer>

        {/* Interests */}
        <SectionContainer title="Interesses">
          <div className="p-4 flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleArr(selectedInterests, interest, setSelectedInterests)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all',
                  selectedInterests.includes(interest)
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'bg-white border-junto-200 text-stone-600 hover:border-junto-300'
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </SectionContainer>

        {/* Toggles */}
        <SectionContainer title="Filtros adicionais">
          <div className="divide-y divide-junto-100">
            <Toggle label="Somente perfis verificados" value={onlyVerified} onChange={setOnlyVerified} />
            <Toggle label="Somente ativos recentemente" value={onlyActive} onChange={setOnlyActive} />
          </div>
        </SectionContainer>

        {/* Apply */}
        <Button variant="sage" size="xl" fullWidth onClick={apply}>
          Aplicar preferências
        </Button>
      </div>
    </div>
  )
}
