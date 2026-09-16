import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Copy, BookOpen, Dumbbell, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  getExerciseLibrary,
  CLIMBING_SUBSTITUTIONS,
  PROGRAM_SCHEDULE,
  PROGRESSION_RULES,
  WEEKLY_CHECKIN_FIELDS,
} from '../data/workoutPlan'
import CollapsibleSection from '../components/CollapsibleSection'

export default function WorkoutsPage() {
  const { templates, duplicateTemplate } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('plans') // 'plans' or 'library'
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState(null)

  const library = getExerciseLibrary()
  const allMuscleGroups = [...new Set(library.map(ex => ex.muscleGroup))]

  const filteredLibrary = library.filter(ex => {
    const matchesSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = !muscleFilter || ex.muscleGroup === muscleFilter
    return matchesSearch && matchesMuscle
  })

  const muscleGroups = [...new Set(filteredLibrary.map(ex => ex.muscleGroup))]

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Workouts</h1>

      {/* Tabs */}
      <div className="flex bg-surface rounded-xl p-1 mb-4">
        <button
          onClick={() => setTab('plans')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'plans' ? 'bg-brand text-white' : 'text-slate-400'
          }`}
        >
          Workout Plans
        </button>
        <button
          onClick={() => setTab('library')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'library' ? 'bg-brand text-white' : 'text-slate-400'
          }`}
        >
          Exercise Library
        </button>
      </div>

      {tab === 'plans' ? (
        <div className="space-y-3">
          {templates.map((template) => (
            <div key={template.id} className="bg-surface rounded-2xl overflow-hidden">
              <button
                onClick={() => navigate(`/workout/${template.id}`)}
                className="w-full p-4 flex items-center gap-4 active:bg-surface-light transition-colors text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ backgroundColor: template.color + '22', color: template.color }}
                >
                  {template.day}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-[15px]">{template.name}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {template.isRecovery
                      ? 'Active Recovery'
                      : `${template.exercises.length} exercises · ${template.focus}`
                    }
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-600 shrink-0" />
              </button>
              {!template.isRecovery && (
                <div className="border-t border-slate-800 px-4 py-2.5 flex justify-end">
                  <button
                    onClick={() => {
                      const newT = duplicateTemplate(template.id)
                      if (newT) navigate(`/workout/${newT.id}`)
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 active:text-brand transition-colors"
                  >
                    <Copy size={12} /> Duplicate
                  </button>
                </div>
              )}
            </div>
          ))}

          <CollapsibleSection title="Program Guide" icon={BookOpen}>
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weekly Schedule</h3>
                <div className="space-y-1.5">
                  {PROGRAM_SCHEDULE.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.day}</span>
                      <span className="text-white font-medium">{item.workout}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Progression + Rest</h3>
                <ul className="space-y-1.5">
                  {PROGRESSION_RULES.map((rule, i) => (
                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-light mt-1.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Climbing Substitution</h3>
                <div className="space-y-2">
                  {CLIMBING_SUBSTITUTIONS.map((item, i) => (
                    <div key={i} className="bg-slate-800/40 rounded-lg p-2.5">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{item.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weekly Check-In</h3>
                <ul className="space-y-1">
                  {WEEKLY_CHECKIN_FIELDS.map((field, i) => (
                    <li key={i} className="text-sm text-slate-300">• {field}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <div>
          {/* Search */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {/* Muscle group filter chips */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            <button
              onClick={() => setMuscleFilter(null)}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                !muscleFilter ? 'bg-brand text-white' : 'bg-surface text-slate-400 active:bg-surface-light'
              }`}
            >
              All
            </button>
            {allMuscleGroups.map(group => (
              <button
                key={group}
                onClick={() => setMuscleFilter(muscleFilter === group ? null : group)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                  muscleFilter === group ? 'bg-brand text-white' : 'bg-surface text-slate-400 active:bg-surface-light'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Grouped by muscle */}
          <div className="space-y-4">
            {muscleGroups.map(group => (
              <div key={group}>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">{group}</h3>
                <div className="space-y-1">
                  {filteredLibrary.filter(ex => ex.muscleGroup === group).map((ex, i) => (
                    <div key={i} className="bg-surface rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{ex.name}</p>
                        <p className="text-slate-500 text-xs">
                          Days: {ex.usedInDays.join(', ')}
                          {ex.substitutions && (
                            <span className="text-brand-light ml-2">↔ {ex.substitutions.join(' / ')}</span>
                          )}
                        </p>
                      </div>
                      <Dumbbell size={14} className="text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
