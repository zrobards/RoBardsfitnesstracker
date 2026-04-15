import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, PlusCircle, Salad, Scale, Flame, Calendar, Trophy, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

function ProgressBar({ value, target, colorClass = 'bg-brand' }) {
  const safeTarget = Math.max(Number(target) || 0, 1)
  const percent = Math.min(100, Math.round((value / safeTarget) * 100))
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{Math.round(value)}</span>
        <span className="text-slate-500">/{safeTarget}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`${colorClass} h-full rounded-full transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function HomePage() {
  const {
    templates,
    activeSession,
    sessions,
    streak,
    bodyweight,
    addBodyweight,
    startSession,
    todayNutrition,
    settings,
  } = useApp()
  const navigate = useNavigate()

  const [bwInput, setBwInput] = useState('')
  const bodyweightInputRef = useRef(null)

  const today = new Date().getDay()
  // Templates use 1-7 where Sunday maps to day 7.
  const todayIndex = today === 0 ? 7 : today
  const todaysTemplate = templates.find(template => Number(template.day) === todayIndex) || templates[0]

  const latestBodyweight = bodyweight[0]?.weight || null
  const macroTargets = settings.macroTargets

  const thisWeekStart = useMemo(() => {
    const d = new Date()
    const day = d.getDay()
    const offset = day === 0 ? 6 : day - 1
    d.setDate(d.getDate() - offset)
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const weekSessions = sessions.filter(s => new Date(s.finishedAt) >= thisWeekStart)

  const handleStartWorkout = () => {
    if (activeSession) {
      navigate(`/workout/${activeSession.templateId}`)
      return
    }
    if (!todaysTemplate || todaysTemplate.isRecovery) {
      navigate('/workouts')
      return
    }
    startSession(
      todaysTemplate.id,
      `Day ${todaysTemplate.day} — ${todaysTemplate.name}`,
      todaysTemplate.exercises,
    )
    navigate(`/workout/${todaysTemplate.id}`)
  }

  const handleBodyweightAdd = () => {
    const value = Number(bwInput)
    if (value > 0) {
      addBodyweight(value)
      setBwInput('')
    }
  }

  return (
    <div className="px-4 pt-4 pb-32 max-w-lg mx-auto space-y-4">
      <div className="safe-top">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Home</h1>
        <p className="text-slate-500 text-sm mt-1">Your daily training + nutrition snapshot.</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-surface rounded-2xl p-3 text-center">
          <Flame size={18} className="text-warning mx-auto mb-1" />
          <p className="text-xl font-bold text-white tabular-nums">{streak}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Streak</p>
        </div>
        <div className="bg-surface rounded-2xl p-3 text-center">
          <Calendar size={18} className="text-brand-light mx-auto mb-1" />
          <p className="text-xl font-bold text-white tabular-nums">{weekSessions.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Week</p>
        </div>
        <div className="bg-surface rounded-2xl p-3 text-center">
          <Trophy size={18} className="text-success mx-auto mb-1" />
          <p className="text-xl font-bold text-white tabular-nums">{sessions.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Today&apos;s Workout</p>
            <h2 className="text-lg font-semibold text-white mt-1">{todaysTemplate?.name || 'Workout Plan'}</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {todaysTemplate?.isRecovery ? 'Recovery day' : `${todaysTemplate?.exercises?.length || 0} exercises`}
            </p>
          </div>
          <button onClick={() => navigate('/workouts')} className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center active:bg-slate-700">
            <ArrowRight size={16} />
          </button>
        </div>
        <button onClick={handleStartWorkout} className="w-full bg-gradient-to-r from-brand to-brand-light text-white py-3.5 rounded-xl text-base font-bold flex items-center justify-center gap-2 active:opacity-90">
          <Play size={18} /> {activeSession ? 'Resume Workout' : 'Start Workout'}
        </button>
      </div>

      <div className="bg-surface rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Daily Macro Progress</p>
          <button onClick={() => navigate('/nutrition')} className="text-xs text-brand-light font-semibold">Open Nutrition</button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-800/70 rounded-xl p-3">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Calories</p>
            <p className="text-xl text-white font-bold tabular-nums">{Math.round(todayNutrition.totals.calories)}</p>
            <ProgressBar value={todayNutrition.totals.calories} target={macroTargets.calories} colorClass="bg-brand" />
          </div>
          <div className="bg-slate-800/70 rounded-xl p-3">
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Protein</p>
            <p className="text-xl text-white font-bold tabular-nums">{Math.round(todayNutrition.totals.protein)}g</p>
            <ProgressBar value={todayNutrition.totals.protein} target={macroTargets.protein} colorClass="bg-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4 space-y-3">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Bodyweight</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
              <Scale size={18} />
            </div>
            <div>
              <p className="text-white text-lg font-bold tabular-nums">{latestBodyweight ? `${latestBodyweight} lb` : 'Not logged'}</p>
              {settings.bodyweightGoal && <p className="text-slate-500 text-xs">Goal: {settings.bodyweightGoal} lb</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            ref={bodyweightInputRef}
            type="number"
            inputMode="decimal"
            value={bwInput}
            onChange={e => setBwInput(e.target.value)}
            placeholder="Add bodyweight"
            className="flex-1 bg-slate-800 text-white rounded-xl px-3 py-3.5 outline-none focus:ring-2 focus:ring-brand"
          />
          <button onClick={handleBodyweightAdd} className="bg-brand text-white px-4 py-3.5 rounded-xl font-semibold active:bg-brand-dark">Add</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        <button onClick={handleStartWorkout} className="w-full bg-surface rounded-2xl p-4 flex items-center gap-3 active:bg-surface-light text-left">
          <Play size={18} className="text-brand-light" />
          <div>
            <p className="text-white font-semibold">Start Workout</p>
            <p className="text-slate-500 text-xs">Jump into today&apos;s plan</p>
          </div>
        </button>
        <button onClick={() => navigate('/nutrition')} className="w-full bg-surface rounded-2xl p-4 flex items-center gap-3 active:bg-surface-light text-left">
          <Salad size={18} className="text-success" />
          <div>
            <p className="text-white font-semibold">Log Meal</p>
            <p className="text-slate-500 text-xs">Track calories and macros</p>
          </div>
        </button>
        <button onClick={() => bodyweightInputRef.current?.focus()} className="w-full bg-surface rounded-2xl p-4 flex items-center gap-3 active:bg-surface-light text-left">
          <PlusCircle size={18} className="text-warning" />
          <div>
            <p className="text-white font-semibold">Add Bodyweight</p>
            <p className="text-slate-500 text-xs">Use the input above for quick logging</p>
          </div>
        </button>
      </div>
    </div>
  )
}
