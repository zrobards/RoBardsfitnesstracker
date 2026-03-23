import { useNavigate } from 'react-router-dom'
import { Play, Flame, Calendar, Dumbbell, Trophy, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, timeAgo } from '../utils/formatters'
import { PROGRAM_NAME } from '../data/workoutPlan'

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HomePage() {
  const { templates, activeSession, sessions, streak } = useApp()
  const navigate = useNavigate()

  const today = new Date().getDay() // 0=Sun
  const todayIndex = today === 0 ? 6 : today - 1 // Convert to 0=Mon

  // Get this week's completion status
  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - todayIndex)
  thisWeekStart.setHours(0, 0, 0, 0)

  const weekSessions = sessions.filter(s => new Date(s.finishedAt) >= thisWeekStart)
  const completedDays = new Set(weekSessions.map(s => {
    const d = new Date(s.finishedAt).getDay()
    return d === 0 ? 6 : d - 1
  }))

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="pt-4 pb-6">
        <h1 className="text-2xl font-bold text-white">RoBards Training</h1>
        <p className="text-slate-400 text-sm mt-1">{PROGRAM_NAME}</p>
      </div>

      {/* Active Session Banner */}
      {activeSession && (
        <button
          onClick={() => navigate(`/workout/${activeSession.templateId}`)}
          className="w-full bg-brand/20 border border-brand/30 rounded-2xl p-4 mb-4 flex items-center justify-between active:bg-brand/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Play size={18} className="text-white ml-0.5" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Workout in progress</p>
              <p className="text-brand-light text-xs">{activeSession.templateName}</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-brand-light" />
        </button>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface rounded-2xl p-3.5 text-center">
          <Flame size={20} className="text-warning mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{streak}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Streak</p>
        </div>
        <div className="bg-surface rounded-2xl p-3.5 text-center">
          <Calendar size={20} className="text-brand-light mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{weekSessions.length}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">This Week</p>
        </div>
        <div className="bg-surface rounded-2xl p-3.5 text-center">
          <Trophy size={20} className="text-success mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{sessions.length}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total</p>
        </div>
      </div>

      {/* Week Overview */}
      <div className="bg-surface rounded-2xl p-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">This Week</h2>
        <div className="flex justify-between">
          {dayLabels.map((label, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className={`text-[10px] font-medium ${idx === todayIndex ? 'text-brand-light' : 'text-slate-500'}`}>
                {label}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                completedDays.has(idx)
                  ? 'bg-success text-white'
                  : idx === todayIndex
                    ? 'bg-brand/20 text-brand-light ring-2 ring-brand'
                    : 'bg-slate-800 text-slate-600'
              }`}>
                {completedDays.has(idx) ? '✓' : idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workout Cards */}
      <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <Dumbbell size={16} />
        Workout Days
      </h2>
      <div className="space-y-3">
        {templates.map((template) => {
          const lastSession = sessions.find(s => s.templateId === template.id)
          return (
            <button
              key={template.id}
              onClick={() => navigate(`/workout/${template.id}`)}
              className="w-full bg-surface rounded-2xl p-4 flex items-center gap-4 active:bg-surface-light transition-all text-left"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shrink-0"
                style={{ backgroundColor: template.color + '22', color: template.color }}
              >
                {template.day}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-[15px]">{template.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  {template.isRecovery
                    ? 'Walking, stretching, foam rolling'
                    : `${template.exercises.length} exercises · ${template.focus}`
                  }
                </p>
                {lastSession && (
                  <p className="text-slate-500 text-[10px] mt-1">
                    Last: {timeAgo(lastSession.finishedAt)}
                  </p>
                )}
              </div>
              <ArrowRight size={16} className="text-slate-600 shrink-0" />
            </button>
          )
        })}
      </div>

      {/* Recent Activity */}
      {sessions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {sessions.slice(0, 3).map(session => (
              <div key={session.id} className="bg-surface rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{session.templateName}</p>
                  <p className="text-slate-500 text-xs">{formatDate(session.finishedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-light text-xs font-medium">
                    {session.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0)} sets
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
