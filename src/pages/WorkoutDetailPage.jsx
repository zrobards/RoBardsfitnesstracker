import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Square, RotateCcw, Clock, Sparkles, StretchHorizontal, Zap, StickyNote, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import ExerciseCard from '../components/ExerciseCard'
import RestTimer from '../components/RestTimer'
import CollapsibleSection from '../components/CollapsibleSection'
import { formatDuration } from '../utils/formatters'

export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    templates, activeSession, startSession, finishSession, discardSession,
    updateSessionField, getLastSession, timer
  } = useApp()

  const template = templates.find(t => t.id === id)
  const [elapsed, setElapsed] = useState(0)
  const [showFinishConfirm, setShowFinishConfirm] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  const [notes, setNotes] = useState('')

  const isActive = activeSession?.templateId === id
  const lastSession = getLastSession(id)

  // Elapsed timer
  useEffect(() => {
    if (!isActive) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(activeSession.startedAt).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive, activeSession?.startedAt])

  // Sync notes
  useEffect(() => {
    if (isActive) setNotes(activeSession.notes || '')
  }, [isActive, activeSession?.notes])

  if (!template) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-slate-400">Workout not found</p>
        <button onClick={() => navigate('/')} className="text-brand mt-4">Go Home</button>
      </div>
    )
  }

  // Recovery day
  if (template.isRecovery) {
    return (
      <div className="px-4 pt-2 pb-24 max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 py-3 active:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="mt-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: template.color + '22', color: template.color }}>
              {template.day}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{template.name}</h1>
              <p className="text-slate-400 text-xs">Day {template.day} — Recovery</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-surface rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Tasks</h3>
              {template.tasks?.map((task, i) => (
                <label key={i} className="flex items-center gap-3 py-2">
                  <input type="checkbox" className="w-5 h-5 rounded accent-brand" />
                  <span className="text-white text-sm">{task}</span>
                </label>
              ))}
            </div>
            {template.optional?.length > 0 && (
              <div className="bg-surface rounded-2xl p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Optional</h3>
                {template.optional.map((task, i) => (
                  <label key={i} className="flex items-center gap-3 py-2">
                    <input type="checkbox" className="w-5 h-5 rounded accent-brand" />
                    <span className="text-slate-400 text-sm">{task}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
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

  const totalSets = isActive ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.length, 0) : 0
  const completedSets = isActive ? activeSession.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0) : 0
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0

  return (
    <div className="px-4 pt-2 pb-40 max-w-lg mx-auto">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 py-3 active:text-white transition-colors">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0" style={{ backgroundColor: template.color + '22', color: template.color }}>
          {template.day}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{template.name}</h1>
          <p className="text-slate-400 text-xs">
            Day {template.day} &middot; {template.focus} &middot; {template.exercises.length} exercises
          </p>
        </div>
      </div>

      {/* Active session stats */}
      {isActive && (
        <div className="bg-surface rounded-2xl p-4 my-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-brand-light" />
              <span className="text-white text-sm font-medium tabular-nums">{formatDuration(elapsed)}</span>
            </div>
            <span className="text-brand-light text-sm font-semibold">{completedSets}/{totalSets} sets</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-brand h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Rest Timer */}
      {isActive && (
        <div className="mb-4">
          <RestTimer />
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-3 mb-4">
        {isActive ? (
          activeSession.exercises.map((exercise, idx) => {
            const prevEx = lastSession?.exercises.find(e => e.name === exercise.name)
            return <ExerciseCard key={idx} exercise={exercise} exerciseIndex={idx} previousExercise={prevEx} />
          })
        ) : (
          // Preview mode - show exercises but not editable
          template.exercises.map((exercise, idx) => (
            <div key={idx} className="bg-surface rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand/20 text-brand-light flex items-center justify-center text-sm font-bold shrink-0">
                {idx + 1}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{exercise.name}</p>
                <p className="text-slate-400 text-xs">{exercise.sets} sets &times; {exercise.reps} reps</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Core Section */}
      {template.core.length > 0 && (
        <CollapsibleSection
          title={template.coreNote || 'Core Circuit'}
          icon={Zap}
          badge={isActive && activeSession.coreCompleted ? 'Done' : null}
        >
          <div className="space-y-2">
            {template.core.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <span className="text-white text-sm">{item.name}</span>
                <span className="text-slate-400 text-xs">{item.reps}</span>
              </div>
            ))}
          </div>
          {isActive && (
            <button
              onClick={() => updateSessionField('coreCompleted', !activeSession.coreCompleted)}
              className={`w-full mt-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeSession.coreCompleted
                  ? 'bg-success/20 text-success'
                  : 'bg-slate-800 text-slate-400 active:bg-slate-700'
              }`}
            >
              <CheckCircle2 size={16} />
              {activeSession.coreCompleted ? 'Core Complete!' : 'Mark Core Complete'}
            </button>
          )}
        </CollapsibleSection>
      )}

      {/* Stretches */}
      {template.stretches.length > 0 && (
        <div className="mt-3">
          <CollapsibleSection
            title="Stretching"
            icon={StretchHorizontal}
            badge={isActive && activeSession.stretchesCompleted ? 'Done' : null}
          >
            <ul className="space-y-1.5">
              {template.stretches.map((stretch, i) => (
                <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-light shrink-0" />
                  {stretch}
                </li>
              ))}
            </ul>
            {isActive && (
              <button
                onClick={() => updateSessionField('stretchesCompleted', !activeSession.stretchesCompleted)}
                className={`w-full mt-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeSession.stretchesCompleted
                    ? 'bg-success/20 text-success'
                    : 'bg-slate-800 text-slate-400 active:bg-slate-700'
                }`}
              >
                <CheckCircle2 size={16} />
                {activeSession.stretchesCompleted ? 'Stretching Done!' : 'Mark Stretching Done'}
              </button>
            )}
          </CollapsibleSection>
        </div>
      )}

      {/* Notes */}
      {isActive && (
        <div className="mt-3">
          <CollapsibleSection title="Workout Notes" icon={StickyNote}>
            <textarea
              value={notes}
              onChange={e => { setNotes(e.target.value); updateSessionField('notes', e.target.value) }}
              placeholder="How did this session feel?"
              rows={3}
              className="w-full bg-slate-800 text-white text-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand resize-none"
            />
          </CollapsibleSection>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 p-3 z-40">
        <div className="max-w-lg mx-auto">
          {!isActive && !activeSession ? (
            <button
              onClick={handleStart}
              className="w-full bg-brand text-white py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 active:bg-brand-dark transition-colors"
            >
              <Play size={20} /> Start Workout
            </button>
          ) : isActive ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowDiscardConfirm(true)}
                className="bg-slate-800 text-slate-400 px-4 py-3.5 rounded-xl text-sm font-medium flex items-center gap-2 active:bg-slate-700"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setShowFinishConfirm(true)}
                className="flex-1 bg-success text-white py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 active:bg-green-600 transition-colors"
              >
                <Square size={18} /> Finish Workout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/workout/${activeSession.templateId}`)}
              className="w-full bg-warning/20 text-warning py-4 rounded-xl text-sm font-medium"
            >
              Another workout is in progress
            </button>
          )}
        </div>
      </div>

      {/* Finish Confirm Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center" onClick={() => setShowFinishConfirm(false)}>
          <div className="bg-slate-900 rounded-t-3xl p-6 w-full max-w-lg safe-bottom" onClick={e => e.stopPropagation()}>
            <h3 className="text-white text-lg font-bold mb-2">Finish Workout?</h3>
            <p className="text-slate-400 text-sm mb-1">
              {completedSets}/{totalSets} sets completed &middot; {formatDuration(elapsed)}
            </p>
            <p className="text-slate-500 text-xs mb-6">This will save your session to history.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowFinishConfirm(false)} className="flex-1 bg-slate-800 text-slate-300 py-3.5 rounded-xl font-medium">
                Cancel
              </button>
              <button onClick={handleFinish} className="flex-1 bg-success text-white py-3.5 rounded-xl font-bold">
                Finish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discard Confirm Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center" onClick={() => setShowDiscardConfirm(false)}>
          <div className="bg-slate-900 rounded-t-3xl p-6 w-full max-w-lg safe-bottom" onClick={e => e.stopPropagation()}>
            <h3 className="text-white text-lg font-bold mb-2">Discard Workout?</h3>
            <p className="text-slate-400 text-sm mb-6">This will reset your current progress. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDiscardConfirm(false)} className="flex-1 bg-slate-800 text-slate-300 py-3.5 rounded-xl font-medium">
                Keep Going
              </button>
              <button onClick={handleDiscard} className="flex-1 bg-danger text-white py-3.5 rounded-xl font-bold">
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
