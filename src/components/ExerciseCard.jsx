import { useState, useRef, useEffect } from 'react'
import { Check, Plus, Minus, ChevronDown, ChevronUp, Trophy, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ExerciseCard({ exercise, exerciseIndex, previousExercise, quickLogMode, onQuickLogNext }) {
  const { updateSet, toggleSetComplete, addSet, removeSet, getBestForExercise } = useApp()
  const [expanded, setExpanded] = useState(true)
  const inputRefs = useRef([])

  const best = getBestForExercise(exercise.name)
  const completedSets = exercise.sets.filter(s => s.completed).length
  const allComplete = completedSets === exercise.sets.length
  const nextIncompleteSet = exercise.sets.findIndex(s => !s.completed)

  // Focus the next incomplete set input in quick log mode
  useEffect(() => {
    if (quickLogMode && nextIncompleteSet >= 0 && inputRefs.current[nextIncompleteSet]) {
      // Don't auto-focus to avoid keyboard popping up unexpectedly
    }
  }, [quickLogMode, nextIncompleteSet])

  const handleQuickComplete = (setIdx) => {
    toggleSetComplete(exerciseIndex, setIdx)
    // If quick log mode, advance to next set/exercise
    if (quickLogMode) {
      const nextSet = exercise.sets.findIndex((s, i) => i > setIdx && !s.completed)
      if (nextSet >= 0 && inputRefs.current[nextSet]) {
        setTimeout(() => inputRefs.current[nextSet]?.focus(), 100)
      } else if (onQuickLogNext) {
        onQuickLogNext()
      }
    }
  }

  return (
    <div className={`bg-surface rounded-2xl overflow-hidden transition-all ${
      allComplete ? 'ring-1 ring-success/30 opacity-80' : ''
    } ${quickLogMode && nextIncompleteSet >= 0 ? 'ring-1 ring-brand/40' : ''}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 pb-3 active:bg-surface-light transition-colors"
      >
        <div className="flex items-center gap-3 text-left min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
            allComplete ? 'bg-success/20 text-success' : 'bg-brand/15 text-brand-light'
          }`}>
            {allComplete ? <Check size={20} strokeWidth={3} /> : exerciseIndex + 1}
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-[15px] leading-snug truncate">{exercise.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-slate-500 text-xs">
                {exercise.targetSets}×{exercise.targetReps}
              </span>
              <span className="text-slate-700">·</span>
              <span className={`text-xs font-semibold ${allComplete ? 'text-success' : 'text-brand-light'}`}>
                {completedSets}/{exercise.sets.length}
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0 ml-2">
          {expanded ? <ChevronUp size={18} className="text-slate-600" /> : <ChevronDown size={18} className="text-slate-600" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2.5">
          {/* Previous best / last session */}
          {(best.bestWeight > 0 || previousExercise) && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pb-1 border-b border-slate-800/50">
              <Trophy size={11} className="text-warning/60" />
              {best.bestWeight > 0 && <span>PR: <span className="text-warning/80 font-medium">{best.bestWeight}lb</span></span>}
              {previousExercise && (
                <span className="ml-auto truncate">
                  Last: {previousExercise.sets.filter(s => s.completed).map(s => `${s.weight}×${s.reps}`).join(', ') || '—'}
                </span>
              )}
            </div>
          )}

          {/* Column headers */}
          <div className="flex items-center gap-2 px-0.5">
            <span className="text-slate-600 text-[10px] font-bold uppercase w-6 text-center">Set</span>
            <span className="text-slate-600 text-[10px] font-bold uppercase flex-1 text-center">Weight</span>
            <span className="text-slate-600 text-[10px] font-bold uppercase flex-1 text-center">Reps</span>
            <span className="w-12"></span>
          </div>

          {/* Set rows */}
          {exercise.sets.map((set, setIdx) => {
            const isNextSet = quickLogMode && setIdx === nextIncompleteSet
            return (
              <div key={setIdx} className={`flex items-center gap-2 ${isNextSet ? 'relative' : ''}`}>
                {isNextSet && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                    <Zap size={10} className="text-brand-light" />
                  </div>
                )}
                <span className={`text-xs font-bold w-6 text-center shrink-0 ${
                  set.completed ? 'text-success/60' : isNextSet ? 'text-brand-light' : 'text-slate-600'
                }`}>
                  {setIdx + 1}
                </span>
                <input
                  ref={el => { if (isNextSet) inputRefs.current[setIdx] = el }}
                  type="number"
                  inputMode="decimal"
                  placeholder="lbs"
                  value={set.weight}
                  onChange={e => updateSet(exerciseIndex, setIdx, 'weight', e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      // Move to reps field
                      const repsInput = e.target.parentElement.querySelector('input:nth-child(3)')
                      repsInput?.focus()
                    }
                  }}
                  className={`flex-1 bg-slate-800/80 text-white text-center text-[15px] font-medium rounded-xl px-2 py-3.5 outline-none transition-all ${
                    set.completed ? 'opacity-50' : ''
                  } ${isNextSet ? 'quick-log-active' : 'focus:ring-2 focus:ring-brand'}`}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="reps"
                  value={set.reps}
                  onChange={e => updateSet(exerciseIndex, setIdx, 'reps', e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleQuickComplete(setIdx)
                    }
                  }}
                  className={`flex-1 bg-slate-800/80 text-white text-center text-[15px] font-medium rounded-xl px-2 py-3.5 outline-none transition-all ${
                    set.completed ? 'opacity-50' : ''
                  } ${isNextSet ? 'focus:quick-log-active' : 'focus:ring-2 focus:ring-brand'}`}
                />
                <button
                  onClick={() => handleQuickComplete(setIdx)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all card-press ${
                    set.completed
                      ? 'bg-success text-white shadow-sm shadow-success/20'
                      : 'bg-slate-800/80 text-slate-500 active:bg-slate-700'
                  }`}
                >
                  <Check size={20} strokeWidth={set.completed ? 3 : 2} />
                </button>
              </div>
            )
          })}

          {/* Add/Remove set */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => addSet(exerciseIndex)}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 bg-slate-800/40 py-3 rounded-xl active:bg-slate-700 transition-colors font-medium"
            >
              <Plus size={14} /> Add Set
            </button>
            {exercise.sets.length > 1 && (
              <button
                onClick={() => removeSet(exerciseIndex, exercise.sets.length - 1)}
                className="flex items-center justify-center gap-1.5 text-xs text-slate-500 bg-slate-800/40 px-5 py-3 rounded-xl active:bg-slate-700 transition-colors"
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
