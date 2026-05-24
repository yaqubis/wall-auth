import { motion } from 'framer-motion'
import { RotateCcw, Sparkles, Zap } from 'lucide-react'
import clsx from 'clsx'

interface ActionButtonsProps {
  onDislike: () => void
  onLike: () => void
  onSuperlike: () => void
  onUndo: () => void
  onBoost: () => void
  superlikes: number
  canUndo: boolean
}

export function ActionButtons({
  onDislike,
  onLike,
  onSuperlike,
  onUndo,
  onBoost,
  superlikes,
  canUndo,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-3 px-4">
      {/* Desfazer */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onUndo}
        disabled={!canUndo}
        className={clsx(
          'flex flex-col items-center gap-0.5 transition-colors',
          canUndo
            ? 'text-stone-400 hover:text-ink'
            : 'text-stone-300 cursor-not-allowed'
        )}
      >
        <RotateCcw size={16} />
        <span className="text-xs">Desfazer</span>
      </motion.button>

      {/* Passar */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onDislike}
        className="flex-1 max-w-[160px] flex items-center justify-center rounded-full border border-junto-300 bg-white text-stone-600 px-7 py-3.5 text-sm font-medium hover:bg-junto-100 transition-colors"
      >
        Passar
      </motion.button>

      {/* Especial / Superlike */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSuperlike}
          disabled={superlikes === 0}
          className={clsx(
            'flex items-center justify-center rounded-2xl border border-junto-200 bg-white p-3 transition-colors',
            superlikes > 0
              ? 'text-stone-400 hover:text-ink hover:border-junto-300'
              : 'text-stone-300 cursor-not-allowed'
          )}
        >
          <Sparkles size={16} />
        </motion.button>
        {superlikes > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-terra-500 text-white text-[10px] font-semibold flex items-center justify-center px-1">
            {superlikes}
          </span>
        )}
      </div>

      {/* Conectar */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onLike}
        className="flex-1 max-w-[160px] flex items-center justify-center rounded-full bg-terra-gradient text-white px-7 py-3.5 text-sm font-medium shadow-button transition-opacity hover:opacity-90"
      >
        Conectar
      </motion.button>

      {/* Boost */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onBoost}
        className="flex flex-col items-center gap-0.5 text-stone-400 hover:text-sage-600 transition-colors"
      >
        <Zap size={16} />
        <span className="text-xs">Boost</span>
      </motion.button>
    </div>
  )
}
