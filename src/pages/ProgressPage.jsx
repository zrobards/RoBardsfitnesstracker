import { useMemo, useState } from 'react'
import { TrendingUp, Activity, Scale, Apple, Flame } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate } from '../utils/formatters'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((item, idx) => (
        <p key={idx} style={{ color: item.color }} className="font-medium">
          {item.name}: {Math.round(item.value)}
        </p>
      ))}
    </div>
  )
}

function getDayKey(date) {
  return new Date(date).toISOString().slice(0, 10)
}

export default function ProgressPage() {
  const { sessions, bodyweight, foodEntries } = useApp()
  const [selectedWindow, setSelectedWindow] = useState('14d')

  const days = selectedWindow === '30d' ? 30 : 14

  const rangeKeys = useMemo(() => {
    return Array.from({ length: days }).map((_, idx) => {
      const d = new Date()
      d.setDate(d.getDate() - (days - idx - 1))
      d.setHours(0, 0, 0, 0)
      return d.toISOString().slice(0, 10)
    })
  }, [days])

  const sessionsByDay = useMemo(() => {
    const map = {}
    sessions.forEach(session => {
      const key = getDayKey(session.finishedAt)
      map[key] = (map[key] || 0) + 1
    })
    return map
  }, [sessions])

  const nutritionByDay = useMemo(() => {
    const map = {}
    foodEntries.forEach(entry => {
      const key = getDayKey(entry.date)
      if (!map[key]) map[key] = { calories: 0, protein: 0 }
      const servings = Number(entry.servings) || 1
      map[key].calories += (Number(entry.calories) || 0) * servings
      map[key].protein += (Number(entry.protein) || 0) * servings
    })
    return map
  }, [foodEntries])

  const consistencyData = useMemo(() => {
    return rangeKeys.map(key => ({
      date: formatDate(key),
      workouts: sessionsByDay[key] || 0,
    }))
  }, [rangeKeys, sessionsByDay])

  const macroAveragesData = useMemo(() => {
    return rangeKeys.map(key => ({
      date: formatDate(key),
      calories: nutritionByDay[key]?.calories || 0,
      protein: nutritionByDay[key]?.protein || 0,
    }))
  }, [rangeKeys, nutritionByDay])

  const bodyweightData = useMemo(() => {
    return [...bodyweight]
      .reverse()
      .slice(-days)
      .map(item => ({ date: formatDate(item.date), weight: Number(item.weight) || 0 }))
  }, [bodyweight, days])

  const stats = useMemo(() => {
    const workouts = consistencyData.reduce((sum, d) => sum + d.workouts, 0)
    const avgProtein = macroAveragesData.reduce((sum, d) => sum + d.protein, 0) / days
    const avgCalories = macroAveragesData.reduce((sum, d) => sum + d.calories, 0) / days
    return {
      workouts,
      avgProtein,
      avgCalories,
      workoutConsistency: Math.round((consistencyData.filter(d => d.workouts > 0).length / days) * 100),
    }
  }, [consistencyData, macroAveragesData, days])

  return (
    <div className="px-4 pt-4 pb-28 max-w-lg mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Progress</h1>
        <p className="text-slate-500 text-sm mt-1">Simple trends for training and nutrition.</p>
      </div>

      <div className="flex bg-surface rounded-xl p-1">
        <button onClick={() => setSelectedWindow('14d')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${selectedWindow === '14d' ? 'bg-brand text-white' : 'text-slate-400'}`}>14 days</button>
        <button onClick={() => setSelectedWindow('30d')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${selectedWindow === '30d' ? 'bg-brand text-white' : 'text-slate-400'}`}>30 days</button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-surface rounded-2xl p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-bold"><Activity size={14} /> Consistency</div>
          <p className="text-2xl font-bold text-white mt-1">{stats.workoutConsistency}%</p>
          <p className="text-xs text-slate-500">days with workouts</p>
        </div>
        <div className="bg-surface rounded-2xl p-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-bold"><Flame size={14} /> Workouts</div>
          <p className="text-2xl font-bold text-white mt-1">{stats.workouts}</p>
          <p className="text-xs text-slate-500">in selected range</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-brand-light" /> Workout Consistency</h2>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={consistencyData}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={24} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="workouts" fill="#6366f1" name="Workouts" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Apple size={16} className="text-success" /> Protein + Calories Average</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-slate-800/70 rounded-xl p-2.5">
            <p className="text-xs text-slate-500">Avg Protein</p>
            <p className="text-lg font-bold text-white">{Math.round(stats.avgProtein)}g</p>
          </div>
          <div className="bg-slate-800/70 rounded-xl p-2.5">
            <p className="text-xs text-slate-500">Avg Calories</p>
            <p className="text-lg font-bold text-white">{Math.round(stats.avgCalories)}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={macroAveragesData}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={38} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="protein" stroke="#22c55e" strokeWidth={2} dot={false} name="Protein" />
            <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2} dot={false} name="Calories" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-surface rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><Scale size={16} className="text-brand-light" /> Bodyweight Trend</h2>
        {bodyweightData.length > 1 ? (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={bodyweightData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} width={38} domain={['auto', 'auto']} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={2} dot={false} name="Bodyweight" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500 text-sm">Log at least 2 bodyweight entries to view a trend chart.</p>
        )}
      </div>
    </div>
  )
}
