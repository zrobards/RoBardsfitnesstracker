import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Square, RotateCcw, Clock, StretchHorizontal, Zap, StickyNote, CheckCircle2, Timer, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ExerciseCard from '../components/ExerciseCard'
import RestTimer from '../components/RestTimer'
import CollapsibleSection from '../components/CollapsibleSection'
import { formatDuration } from '../utils/formatters'

export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    templates,
    activeSession,
    startSession,
    finishSession,
    discardSession,
    updateSessionField,
    getLastSession,
    timer,
    settings,
    addSet,
  } = useApp()

  const template = templates.find(t => t.id === id)
  const [elapsed, setElapsed] = useState(0)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  const [quickLogMode, setQuickLogMode] = useState(false)
  const exerciseRefs = useRef([])

  const isActive = activeSession?.templateId === id
  const lastSession = getLastSession(id)

  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(activeSession.startedAt).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive, activeSession?.startedAt])

  if (!template) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-slate-400">Workout not found</p>
        <button onClick={() => navigate('/')} className="text-brand mt-4 text-sm">Go Home</button>
      </div>
    )
  }

  if (template.isRecovery) {
    return (
      <div className="px-4 pt-2 pb-24 max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 py-4 active:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold" style={{ backgroundColor: template.color + '22', color: template.color }}>
            {template.day}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{template.name}</h1>
            <p className="text-slate-500 text-sm">Day {template.day} — Recovery</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-surface rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tasks</h3>
            {template.tasks?.map((task, i) => (
              <label key={i} className="flex items-center gap-3.5 py-2.5 border-b border-slate-800/50 last:border-0">
                <input type="checkbox" className="w-6 h-6 rounded-lg accent-brand" />
                <span className="text-white text-[15px]">{task}</span>
              </label>
            ))}
          </div>
          {template.optional?.length > 0 && (
            <div className="bg-surface rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Optional</h3>
              {template.optional.map((task, i) => (
                <label key={i} className="flex items-center gap-3.5 py-2.5">
                  <input type="checkbox" className="w-6 h-6 rounded-lg accent-brand" />
                  <span className="text-slate-400 text-[15px]">{task}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleStart = () => {
    startSession(template.id, `Day ${template.day} — ${template.name}`, template.exercises)
  }

  const handleFinish = () => {
    finishSession()
    setShowFinishConfirm(false)
    navigate('/')
  }

  const handleDiscard = () => {
    discardSession()
    setShowDiscardConfirm(false)
  }

  const handleQuickLogNext = (currentExIndex) => {
    const nextIdx = currentExIndex + 1
    if (nextIdx < (activeSession?.exercises.length || 0) && exerciseRefs.current[nextIdx]) {
      exerciseRefs.current[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleAddSet = () => {
    if (!isActive || !activeSession?.exercises?.length) return
    const targetIdx = activeSession.exercises.findIndex(ex => ex.sets.some(set => !set.completed))
    const indexToUse = targetIdx >= 0 ? targetIdx : 0
    addSet(indexToUse)
    exerciseRefs.current[indexToUse]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const totalSets = isActive ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0) : 0
  const completedSets = isActive ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0) : 0
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0
  const totalVolume = isActive
    ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).reduce((s2, set) => s2 + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)
    : 0

  return (
    <div className="px-4 pt-2 pb-52 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 py-4 active:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0" style={{ backgroundColor: template.color + '22', color: template.color }}>
          {template.day}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{template.name}</h1>
          <p className="text-slate-500 text-sm">Day {template.day} · {template.focus} · {template.exercises.length} exercises</p>
        </div>
      </div>

      {isActive && (
        <div className="bg-surface rounded-2xl p-4 my-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-light" />
                <span className="text-white text-sm font-semibold tabular-nums">{formatDuration(elapsed)}</span>
              </div>
              {totalVolume > 0 && <span className="text-slate-500 text-xs">{totalVolume.toLocaleString()} lb</span>}
            </div>
            <span className="text-brand-light text-sm font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-dark to-brand-light h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
            <div className="flex items-center gap-2">
              <Zap size={14} className={quickLogMode ? 'text-warning' : 'text-slate-600'} />
              <span className="text-xs text-slate-400 font-medium">Quick Log</span>
            </div>
            <button onClick={() => setQuickLogMode(!quickLogMode)} className={`relative w-11 h-6 rounded-full transition-colors ${quickLogMode ? 'bg-brand' : 'bg-slate-700'}`}>
              <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform" style={{ transform: quickLogMode ? 'translateX(22px)' : 'translateX(2px)' }} />
            </button>
          </div>
        </div>
      )}

      {isActive && (
        <div className="mb-4">
          <RestTimer />
        </div>
      )}

      <div className="space-y-3 mb-4">
        {isActive
          ? activeSession.exercises.map((exercise, idx) => {
            const prevEx = lastSession?.exercises.find(e => e.name === exercise.name)
            const templateEx = template.exercises.find(e => e.id === exercise.exerciseId || e.name === exercise.name)
            return (
              <div key={idx} ref={el => { exerciseRefs.current[idx] = el }}>
                <ExerciseCard
                  exercise={exercise}
                  exerciseIndex={idx}
                  previousExercise={prevEx}
                  quickLogMode={quickLogMode}
                  onQuickLogNext={() => handleQuickLogNext(idx)}
                  muscleGroup={templateEx?.muscleGroup}
                />
              </div>
            )
          })
          : template.exercises.map((exercise, idx) => (
            <div key={idx} className="bg-surface rounded-2xl p-4 flex items-center gap-3.5 card-press active:bg-surface-light">
              <div className="w-10 h-10 rounded-xl bg-brand/15 text-brand-light flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</div>
              <div className="min-w-0">
                <p className="text-white text-[15px] font-medium truncate">{exercise.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">{exercise.muscleGroup}</span>
                  <span className="text-slate-500 text-xs">{exercise.sets} sets × {exercise.reps} reps</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {template.core.length > 0 && (
        <CollapsibleSection title={template.coreNote || 'Core Circuit'} icon={Zap} badge={isActive && activeSession.coreCompleted ? 'Done' : null}>
          <div className="space-y-2.5">
            {template.core.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-white text-sm">{item.name}</span>
                <span className="text-slate-400 text-xs font-medium bg-slate-800/50 px-2.5 py-1 rounded-lg">{item.reps}</span>
              </div>
            ))}
          </div>
          {isActive && (
            <button
              onClick={() => updateSessionField('coreCompleted', !activeSession.coreCompleted)}
              className={`w-full mt-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all card-press ${activeSession.coreCompleted ? 'bg-success/20 text-success' : 'bg-slate-800 text-slate-400 active:bg-slate-700'}`}
            >
              <CheckCircle2 size={16} />
              {activeSession.coreCompleted ? 'Core Complete!' : 'Mark Core Complete'}
            </button>
          )}
        </CollapsibleSection>
      )}

      {template.stretches.length > 0 && (
        <div className="mt-3">
          <CollapsibleSection title="Stretching" icon={StretchHorizontal} badge={isActive && activeSession.stretchesCompleted ? 'Done' : null}>
            <ul className="space-y-2">
              {template.stretches.map((stretch, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-light/60 shrink-0" />
                  {stretch}
                </li>
              ))}
            </ul>
            {isActive && (
              <button
                onClick={() => updateSessionField('stretchesCompleted', !activeSession.stretchesCompleted)}
                className={`w-full mt-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all card-press ${activeSession.stretchesCompleted ? 'bg-success/20 text-success' : 'bg-slate-800 text-slate-400 active:bg-slate-700'}`}
              >
                <CheckCircle2 size={16} />
                {activeSession.stretchesCompleted ? 'Stretching Done!' : 'Mark Stretching Done'}
              </button>
            )}
          </CollapsibleSection>
        </div>
      )}

      {isActive && (
        <div className="mt-3">
          <CollapsibleSection title="Workout Notes" icon={StickyNote}>
            <textarea
              value={activeSession.notes || ''}
              onChange={e => updateSessionField('notes', e.target.value)}
              placeholder="How did this session feel?"
              rows={3}
              className="w-full bg-slate-800/80 text-white text-sm rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-brand resize-none"
            />
          </CollapsibleSection>
        </div>
      )}

      <div
        className="fixed left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 p-3 z-40"
        style={{ bottom: 'calc(56px + env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-lg mx-auto">
          {!isActive && !activeSession ? (
            <button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-brand to-brand-light text-white py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2.5 active:opacity-90 transition-opacity shadow-lg shadow-brand/20"
            >
              <Play size={20} className="ml-0.5" /> Start Workout
            </button>
          ) : isActive ? (
            <>
              <div className="flex gap-2.5">
                <button onClick={handleAddSet} className="flex-1 bg-slate-800 text-slate-200 py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 active:bg-slate-700">
                  <Plus size={18} /> Add Set
                </button>
                <button
                  onClick={() => timer.start(settings.defaultRestTime || 90)}
                  className={`bg-slate-800 text-slate-300 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${timer.isRunning ? 'text-brand-light pulse-ring' : 'active:bg-slate-700'}`}
                >
                  <Timer size={18} />
                </button>
                <button onClick={() => setShowFinishConfirm(true)} className="flex-1 bg-gradient-to-r from-green-600 to-success text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:opacity-90 transition-opacity shadow-lg shadow-success/20">
                  <Square size={18} /> Finish Workout
                </button>
              </div>
              <button onClick={() => setShowDiscardConfirm(true)} className="w-full mt-2 text-xs text-slate-500 py-2 active:text-danger">
                Discard current workout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate(`/workout/${activeSession.templateId}`)}
              className="w-full bg-warning/15 text-warning py-4 rounded-2xl text-sm font-semibold border border-warning/20"
            >
              Another workout in progress — tap to continue
            </button>
          )}
        </div>
      </div>

      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" onClick={() => setShowFinishConfirm(false)}>
          <div className="bg-slate-900 rounded-t-3xl p-6 pb-8 w-full max-w-lg safe-bottom" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />
            <h3 className="text-white text-xl font-bold mb-2">Finish Workout?</h3>
            <div className="flex items-center gap-3 text-sm text-slate-400 mb-1">
              <span>{completedSets}/{totalSets} sets</span>
              <span>·</span>
              <span>{formatDuration(elapsed)}</span>
              {totalVolume > 0 && <><span>·</span><span>{totalVolume.toLocaleString()} lb</span></>}
            </div>
            <p className="text-slate-600 text-xs mb-6">This will save your session to history.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowFinishConfirm(false)} className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-2xl font-semibold active:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={handleFinish} className="flex-1 bg-success text-white py-4 rounded-2xl font-bold active:bg-green-600 transition-colors">Finish</button>
            </div>
          </div>
        </div>
      )}

      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center" onClick={() => setShowDiscardConfirm(false)}>
          <div className="bg-slate-900 rounded-t-3xl p-6 pb-8 w-full max-w-lg safe-bottom" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-5" />
            <h3 className="text-white text-xl font-bold mb-2">Discard Workout?</h3>
            <p className="text-slate-400 text-sm mb-6">This will reset your current progress. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscardConfirm(false)} className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-2xl font-semibold active:bg-slate-700 transition-colors">Keep Going</button>
              <button onClick={handleDiscard} className="flex-1 bg-danger text-white py-4 rounded-2xl font-bold active:bg-red-600 transition-colors">Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
