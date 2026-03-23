import { useMemo } from 'react'
import { ArrowLeft, BarChart3, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { workoutTemplates } from '../data/workoutPlan'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Calculate weekly sets per muscle group from the program template
function getProgramVolume() {
  const volume = {}
  workoutTemplates.forEach(template => {
    template.exercises.forEach(ex => {
      const group = ex.muscleGroup
      const sets = typeof ex.sets === 'string' ? parseInt(ex.sets) : ex.sets
      if (!volume[group]) volume[group] = { planned: 0, groups: [] }
      volume[group].planned += sets
      if (!volume[group].groups.includes(`Day ${template.day}`)) {
        volume[group].groups.push(`Day ${template.day}`)
      }
    })
  })
  return volume
}

// Recommended weekly set ranges for hypertrophy
const RECOMMENDED_SETS = {
  Chest: { min: 10, max: 20 },
  Back: { min: 10, max: 20 },
  Shoulders: { min: 8, max: 16 },
  Quads: { min: 10, max: 18 },
  Hamstrings: { min: 8, max: 16 },
  Biceps: { min: 6, max: 14 },
  Triceps: { min: 6, max: 14 },
  Calves: { min: 8, max: 16 },
  Glutes: { min: 4, max: 12 },
  'Rear Delts': { min: 6, max: 12 },
  Forearms: { min: 6, max: 14 },
  Core: { min: 6, max: 12 },
}

export default function VolumePage() {
  const navigate = useNavigate()
  const { sessions, templates } = useApp()

  const programVolume = useMemo(() => getProgramVolume(), [])

  // Actual completed volume this week
  const weeklyActual = useMemo(() => {
    const now = new Date()
    const weekStart = new Date(now)
    const day = weekStart.getDay()
    weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1))
    weekStart.setHours(0, 0, 0, 0)

    const actual = {}
    sessions
      .filter(s => s.finishedAt && new Date(s.finishedAt) >= weekStart)
      .forEach(session => {
        const template = templates.find(t => t.id === session.templateId)
        session.exercises.forEach(ex => {
          const templateEx = template?.exercises.find(e => e.name === ex.name || e.id === ex.exerciseId)
          const group = templateEx?.muscleGroup || 'Other'
          if (!actual[group]) actual[group] = 0
          actual[group] += ex.sets.filter(s => s.completed).length
        })
      })
    return actual
  }, [sessions, templates])

  const chartData = useMemo(() => {
    return Object.entries(programVolume)
      .map(([muscle, data]) => ({
        muscle,
        planned: data.planned,
        actual: weeklyActual[muscle] || 0,
        recMin: RECOMMENDED_SETS[muscle]?.min || 0,
        recMax: RECOMMENDED_SETS[muscle]?.max || 0,
      }))
      .sort((a, b) => b.planned - a.planned)
  }, [programVolume, weeklyActual])

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs shadow-xl">
        <p className="text-white font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value} sets</p>
        ))}
      </div>
    )
  }

  return (
    <div className="px-4 pt-2 pb-24 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 py-4 active:text-white transition-colors text-sm font-medium">
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Weekly Muscle Volume</h1>
      <p className="text-slate-500 text-sm mb-6">Estimated sets per muscle group from your 7-day program</p>

      {/* Chart */}
      <div className="bg-surface rounded-2xl p-4 mb-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 size={14} className="text-brand-light" /> Planned vs Actual This Week
        </h2>
        <ResponsiveContainer width="100%" height={chartData.length * 44 + 20}>
          <BarChart data={chartData} layout="vertical" barGap={2}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis type="category" dataKey="muscle" tick={{ fontSize: 11, fill: '#94a3b8' }} width={85} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="planned" fill="#6366f1" radius={[0, 4, 4, 0]} name="Planned" barSize={14} />
            <Bar dataKey="actual" fill="#22c55e" radius={[0, 4, 4, 0]} name="Completed" barSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed breakdown */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Target size={14} className="text-warning" /> Volume Breakdown
        </h2>
        {chartData.map(({ muscle, planned, actual, recMin, recMax }) => {
          const inRange = planned >= recMin && planned <= recMax
          const status = planned < recMin ? 'low' : planned > recMax ? 'high' : 'good'
          return (
            <div key={muscle} className="bg-surface rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold text-[15px]">{muscle}</h3>
                <div className="flex items-center gap-2">
                  {actual > 0 && (
                    <span className="text-success text-xs font-bold bg-success/10 px-2 py-0.5 rounded-lg">{actual} done</span>
                  )}
                  <span className="text-brand-light text-sm font-bold">{planned} sets/wk</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-xs">Days: {programVolume[muscle]?.groups.join(', ')}</span>
                </div>
                {recMin > 0 && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                    status === 'good' ? 'bg-success/10 text-success' :
                    status === 'low' ? 'bg-warning/10 text-warning' :
                    'bg-brand/10 text-brand-light'
                  }`}>
                    {status === 'good' ? 'Optimal' : status === 'low' ? `Low (rec: ${recMin}-${recMax})` : `High (rec: ${recMin}-${recMax})`}
                  </span>
                )}
              </div>
              {/* Volume bar */}
              <div className="mt-2.5 relative">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === 'good' ? 'bg-success' : status === 'low' ? 'bg-warning' : 'bg-brand'
                    }`}
                    style={{ width: `${Math.min(100, (planned / (recMax || 20)) * 100)}%` }}
                  />
                </div>
                {recMin > 0 && recMax > 0 && (
                  <div className="absolute top-0 h-2 border-l border-slate-500/50" style={{ left: `${(recMin / (recMax + 4)) * 100}%` }} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
