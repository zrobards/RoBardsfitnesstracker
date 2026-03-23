import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Award, BarChart3, ArrowRight, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate } from '../utils/formatters'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function ProgressPage() {
  const navigate = useNavigate()
  const { sessions, bodyweight, templates } = useApp()
  const [selectedExercise, setSelectedExercise] = useState('')

  // Get all unique exercise names from sessions
  const exerciseNames = useMemo(() => {
    const names = new Set()
    sessions.forEach(s => s.exercises.forEach(ex => names.add(ex.name)))
    return [...names].sort()
  }, [sessions])

  // Set default selected exercise
  useEffect(() => {
    if (!selectedExercise && exerciseNames.length > 0) {
      setSelectedExercise(exerciseNames[0])
    }
  }, [exerciseNames, selectedExercise])

  // Build progression data for selected exercise
  const progressionData = useMemo(() => {
    if (!selectedExercise) return []
    const data = []
    // Iterate sessions in reverse (oldest first)
    for (const session of [...sessions].reverse()) {
      for (const ex of session.exercises) {
        if (ex.name === selectedExercise) {
          const bestSet = ex.sets
            .filter(s => s.completed && parseFloat(s.weight) > 0)
            .reduce((best, s) => {
              const w = parseFloat(s.weight) || 0
              return w > (best?.weight || 0) ? { weight: w, reps: parseInt(s.reps) || 0 } : best
            }, null)
          if (bestSet) {
            data.push({
              date: formatDate(session.finishedAt),
              weight: bestSet.weight,
              reps: bestSet.reps,
            })
          }
        }
      }
    }
    return data
  }, [selectedExercise, sessions])

  // Personal records
  const records = useMemo(() => {
    const prs = {}
    sessions.forEach(session => {
      session.exercises.forEach(ex => {
        if (!prs[ex.name]) prs[ex.name] = { bestWeight: 0, bestReps: 0, bestVolume: 0 }
        ex.sets.filter(s => s.completed).forEach(set => {
          const w = parseFloat(set.weight) || 0
          const r = parseInt(set.reps) || 0
          if (w > prs[ex.name].bestWeight) prs[ex.name].bestWeight = w
          if (r > prs[ex.name].bestReps) prs[ex.name].bestReps = r
          if (w * r > prs[ex.name].bestVolume) prs[ex.name].bestVolume = w * r
        })
      })
    })
    return prs
  }, [sessions])

  // Volume per muscle group this week
  const weeklyVolume = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const volumeByGroup = {}
    sessions
      .filter(s => new Date(s.finishedAt) >= weekStart)
      .forEach(session => {
        const template = templates.find(t => t.id === session.templateId)
        session.exercises.forEach(ex => {
          const templateEx = template?.exercises.find(e => e.name === ex.name || e.id === ex.exerciseId)
          const group = templateEx?.muscleGroup || 'Other'
          if (!volumeByGroup[group]) volumeByGroup[group] = 0
          ex.sets.filter(s => s.completed).forEach(set => {
            volumeByGroup[group] += (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0)
          })
        })
      })

    return Object.entries(volumeByGroup).map(([name, volume]) => ({ name, volume: Math.round(volume) })).sort((a, b) => b.volume - a.volume)
  }, [sessions, templates])

  // Bodyweight chart data
  const bwData = useMemo(() => {
    return [...bodyweight].reverse().map(entry => ({
      date: formatDate(entry.date),
      weight: entry.weight,
    }))
  }, [bodyweight])

  if (sessions.length === 0) {
    return (
      <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Progress</h1>
        <div className="bg-surface rounded-2xl p-8 text-center">
          <TrendingUp size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Complete some workouts to see your progress!</p>
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs">
        <p className="text-slate-400">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-white font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-tight">Progress</h1>

      {/* Muscle Volume Link */}
      <button
        onClick={() => navigate('/volume')}
        className="w-full bg-surface rounded-2xl p-4 flex items-center justify-between active:bg-surface-light transition-colors card-press"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
            <Target size={18} className="text-warning" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Weekly Muscle Volume</p>
            <p className="text-slate-500 text-xs">Sets per muscle group breakdown</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-slate-600" />
      </button>

      {/* Exercise Progression */}
      <div className="bg-surface rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-light" />
          Exercise Progression
        </h2>
        <select
          value={selectedExercise}
          onChange={e => setSelectedExercise(e.target.value)}
          className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2.5 mb-4 outline-none focus:ring-2 focus:ring-brand"
        >
          {exerciseNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        {progressionData.length > 1 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressionData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} name="Weight (lb)" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500 text-xs text-center py-8">Need at least 2 sessions to show a chart</p>
        )}
      </div>

      {/* Personal Records */}
      <div className="bg-surface rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Award size={16} className="text-warning" />
          Personal Records
        </h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(records)
            .filter(([, r]) => r.bestWeight > 0)
            .sort(([, a], [, b]) => b.bestWeight - a.bestWeight)
            .map(([name, record]) => (
              <div key={name} className="flex items-center justify-between py-1.5">
                <span className="text-white text-sm truncate mr-2">{name}</span>
                <div className="flex gap-3 shrink-0">
                  <span className="text-brand-light text-xs font-medium">{record.bestWeight} lb</span>
                  <span className="text-slate-500 text-xs">{record.bestReps} reps</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Weekly Volume by Muscle Group */}
      {weeklyVolume.length > 0 && (
        <div className="bg-surface rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-success" />
            Weekly Volume by Muscle
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyVolume} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="volume" fill="#6366f1" radius={[0, 4, 4, 0]} name="Volume (lb)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bodyweight Tracker */}
      {bwData.length > 0 && (
        <div className="bg-surface rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">Bodyweight</h2>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={bwData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={40} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} name="Weight (lb)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
