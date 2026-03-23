import { useState } from 'react'
import { Check, Plus, Minus, ChevronDown, ChevronUp, Trophy } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ExerciseCard({ exercise, exerciseIndex, previousExercise }) {
  const { updateSet, toggleSetComplete, addSet, removeSet, getBestForExercise } = useApp()
  const [expanded, setExpanded] = useState(true)

  const best = getBestForExercise(exercise.name)
  const completedSets = exercise.sets.filter(s => s.completed).length
  const allComplete = completedSets === exercise.sets.length

  return (
    <div className={`bg-surface rounded-2xl overflow-hidden transition-all ${allComplete ? 'ring-1 ring-success/30' : ''}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 active:bg-surface-light transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
            allComplete ? 'bg-success/20 text-success' : 'bg-brand/20 text-brand-light'
          }`}>
            {allComplete ? <Check size={20} /> : exerciseIndex + 1}
          </div>
          <div>
            <h3 className="text-white font-semibold text-[15px] leading-tight">{exercise.name}</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              {exercise.targetSets} sets &times; {exercise.targetReps} reps
              <span className="text-slate-600 mx-1.5">&middot;</span>
              <span className="text-brand-light">{completedSets}/{exercise.sets.length} done</span>
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {/* Previous best */}
          {(best.bestWeight > 0 || previousExercise) && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pb-2">
              <Trophy size={12} />
              {best.bestWeight > 0 && <span>Best: {best.bestWeight} lb</span>}
              {previousExercise && (
                <span className="ml-auto">
                  Last: {previousExercise.sets.filter(s => s.completed).map(s => `${s.weight}×${s.reps}`).join(', ') || 'no data'}
                </span>
              )}
            </div>
          )}

          {/* Set rows */}
          {exercise.sets.map((set, setIdx) => (
            <div key={setIdx} className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-medium w-6 text-center shrink-0">
                {setIdx + 1}
              </span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="lbs"
                value={set.weight}
                onChange={e => updateSet(exerciseIndex, setIdx, 'weight', e.target.value)}
                className={`flex-1 bg-slate-800 text-white text-center text-sm rounded-lg px-2 py-3 outline-none focus:ring-2 focus:ring-brand transition-all ${
                  set.completed ? 'opacity-60' : ''
                }`}
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="reps"
                value={set.reps}
                onChange={e => updateSet(exerciseIndex, setIdx, 'reps', e.target.value)}
                className={`flex-1 bg-slate-800 text-white text-center text-sm rounded-lg px-2 py-3 outline-none focus:ring-2 focus:ring-brand transition-all ${
                  set.completed ? 'opacity-60' : ''
                }`}
              />
              <button
                onClick={() => toggleSetComplete(exerciseIndex, setIdx)}
                className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  set.completed
                    ? 'bg-success text-white'
                    : 'bg-slate-800 text-slate-500 active:bg-slate-700'
                }`}
              >
                <Check size={18} strokeWidth={set.completed ? 3 : 2} />
              </button>
            </div>
          ))}

          {/* Add/Remove set */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => addSet(exerciseIndex)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 bg-slate-800/50 py-2.5 rounded-lg active:bg-slate-700 transition-colors"
            >
              <Plus size={14} /> Add Set
            </button>
            {exercise.sets.length > 1 && (
              <button
                onClick={() => removeSet(exerciseIndex, exercise.sets.length - 1)}
                className="flex items-center justify-center gap-1.5 text-xs text-slate-500 bg-slate-800/50 px-4 py-2.5 rounded-lg active:bg-slate-700 transition-colors"
              >
                <Minus size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
