import { useNavigate } from 'react-router-dom'
import { Play, Flame, Calendar, Dumbbell, Trophy, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, timeAgo } from '../utils/formatters'
import { PROGRAM_NAME } from '../data/workoutPlan'

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HomePage() {
  const { templates, activeSession, sessions, streak } = useApp()
  const navigate = useNavigate()

  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1

  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - todayIndex)
  thisWeekStart.setHours(0, 0, 0, 0)

  const weekSessions = sessions.filter(s => new Date(s.finishedAt) >= thisWeekStart)
  const completedDays = new Set(weekSessions.map(s => {
    const d = new Date(s.finishedAt).getDay()
    return d === 0 ? 6 : d - 1
  }))

  // Total volume this week
  const weekVolume = weekSessions.reduce((total, s) =>
    total + s.exercises.reduce((sum, ex) =>
      sum + ex.sets.filter(set => set.completed).reduce((v, set) =>
        v + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0), 0)

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="pt-5 pb-6 safe-top">
        <h1 className="text-[26px] font-bold text-white tracking-tight">RoBards Training</h1>
        <p className="text-slate-500 text-[13px] mt-0.5 font-medium">{PROGRAM_NAME}</p>
      </div>

      {/* Active Session Banner */}
      {activeSession && (
        <button
          onClick={() => navigate(`/workout/${activeSession.templateId}`)}
          className="w-full bg-brand/15 border border-brand/25 rounded-2xl p-4 mb-5 flex items-center justify-between active:bg-brand/25 transition-colors card-press"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-dark rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
              <Play size={20} className="text-white ml-0.5" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-[15px]">Workout in progress</p>
              <p className="text-brand-light text-xs font-medium">{activeSession.templateName}</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-brand-light" />
        </button>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-surface rounded-2xl p-4 text-center">
          <Flame size={22} className="text-warning mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-white tabular-nums">{streak}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Streak</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 text-center">
          <Calendar size={22} className="text-brand-light mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-white tabular-nums">{weekSessions.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">This Week</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 text-center">
          <Trophy size={22} className="text-success mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-white tabular-nums">{sessions.length}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Total</p>
        </div>
      </div>

      {/* Week Overview */}
      <div className="bg-surface rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Week</h2>
          {weekVolume > 0 && (
            <span className="text-[10px] text-slate-500 font-medium">{weekVolume.toLocaleString()} lb total</span>
          )}
        </div>
        <div className="flex justify-between">
          {dayLabels.map((label, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className={`text-[10px] font-bold ${idx === todayIndex ? 'text-brand-light' : 'text-slate-600'}`}>
                {label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                completedDays.has(idx)
                  ? 'bg-success/20 text-success'
                  : idx === todayIndex
                    ? 'bg-brand/15 text-brand-light ring-2 ring-brand/50'
                    : 'bg-slate-800/60 text-slate-700'
              }`}>
                {completedDays.has(idx) ? '✓' : idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Cards */}
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-0.5">
        <Dumbbell size={14} />
        Workout Days
      </h2>
      <div className="space-y-2.5">
        {templates.map((template) => {
          const lastSession = sessions.find(s => s.templateId === template.id)
          return (
            <button
              key={template.id}
              onClick={() => navigate(`/workout/${template.id}`)}
              className="w-full bg-surface rounded-2xl p-4 flex items-center gap-4 active:bg-surface-light transition-all text-left card-press"
            >
              <div
                className="w-13 h-13 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ backgroundColor: template.color + '18', color: template.color }}
              >
                {template.day}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-[15px] leading-snug">{template.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5 truncate">
                  {template.isRecovery
                    ? 'Walking, stretching, foam rolling'
                    : `${template.exercises.length} exercises · ${template.focus}`
                  }
                </p>
                {lastSession && (
                  <p className="text-slate-600 text-[10px] mt-1 font-medium">
                    Last: {timeAgo(lastSession.finishedAt)}
                  </p>
                )}
              </div>
              <ArrowRight size={16} className="text-slate-700 shrink-0" />
            </button>
          )
        })}
      </div>

      {/* Recent Activity */}
      {sessions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-0.5">Recent Activity</h2>
          <div className="space-y-2">
            {sessions.slice(0, 3).map(session => {
              const setsCompleted = session.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0)
              return (
                <div key={session.id} className="bg-surface rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-semibold">{session.templateName}</p>
                    <p className="text-slate-600 text-[11px] font-medium">{formatDate(session.finishedAt)}</p>
                  </div>
                  <span className="text-brand-light text-xs font-bold bg-brand/10 px-2.5 py-1 rounded-lg">
                    {setsCompleted} sets
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
