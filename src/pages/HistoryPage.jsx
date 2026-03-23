import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDateFull, formatDuration } from '../utils/formatters'

export default function HistoryPage() {
  const { sessions, deleteSession } = useApp()
  const [expandedId, setExpandedId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  if (sessions.length === 0) {
    return (
      <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">History</h1>
        <div className="bg-surface rounded-2xl p-8 text-center">
          <Calendar size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No completed workouts yet.</p>
          <p className="text-slate-500 text-xs mt-1">Start your first workout from the home page!</p>
        </div>
      </div>
    )
  }

  // Group by month
  const grouped = {}
  sessions.forEach(s => {
    const d = new Date(s.finishedAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!grouped[key]) grouped[key] = { label: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), sessions: [] }
    grouped[key].sessions.push(s)
  })

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">History</h1>
      <p className="text-slate-400 text-sm mb-4">{sessions.length} completed workouts</p>

      {Object.entries(grouped).map(([key, group]) => (
        <div key={key} className="mb-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">{group.label}</h2>
          <div className="space-y-2">
            {group.sessions.map(session => {
              const isExpanded = expandedId === session.id
              const duration = session.finishedAt && session.startedAt
                ? Math.floor((new Date(session.finishedAt) - new Date(session.startedAt)) / 1000)
                : 0
              const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0)
              const totalVolume = session.exercises.reduce((sum, ex) =>
                sum + ex.sets.filter(s => s.completed).reduce((s2, set) => s2 + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0), 0)

              return (
                <div key={session.id} className="bg-surface rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : session.id)}
                    className="w-full p-4 flex items-center justify-between active:bg-surface-light transition-colors text-left"
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">{session.templateName}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {formatDateFull(session.finishedAt)}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-brand-light text-xs font-medium">{totalSets} sets</span>
                        {duration > 0 && <span className="text-slate-500 text-xs">{formatDuration(duration)}</span>}
                        {totalVolume > 0 && <span className="text-slate-500 text-xs">{totalVolume.toLocaleString()} lb vol</span>}
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-800 p-4 space-y-3">
                      {session.exercises.map((ex, i) => (
                        <div key={i}>
                          <p className="text-white text-sm font-medium mb-1">{ex.name}</p>
                          <div className="space-y-0.5">
                            {ex.sets.map((set, j) => (
                              <div key={j} className="flex items-center gap-2 text-xs">
                                <span className="text-slate-600 w-5">{j + 1}.</span>
                                <span className={set.completed ? 'text-slate-300' : 'text-slate-600'}>
                                  {set.weight || '—'} lb × {set.reps || '—'} reps
                                </span>
                                {set.completed && <span className="text-success text-[10px]">✓</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {session.notes && (
                        <div className="pt-2 border-t border-slate-800">
                          <p className="text-slate-500 text-xs">Notes:</p>
                          <p className="text-slate-300 text-sm mt-1">{session.notes}</p>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        {confirmDelete === session.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-500 px-3 py-1.5">
                              Cancel
                            </button>
                            <button
                              onClick={() => { deleteSession(session.id); setConfirmDelete(null) }}
                              className="text-xs text-danger bg-danger/10 px-3 py-1.5 rounded-lg font-medium"
                            >
                              Confirm Delete
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(session.id)}
                            className="text-slate-600 p-2 active:text-danger transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
