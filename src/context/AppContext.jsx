import { createContext, useContext } from 'react'
import { useWorkoutSession } from '../hooks/useWorkoutSession'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTimer } from '../hooks/useTimer'
import { workoutTemplates as defaultTemplates } from '../data/workoutPlan'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const workout = useWorkoutSession()
  const timer = useTimer()
  const [templates, setTemplates] = useLocalStorage('templates', defaultTemplates)
  const [bodyweight, setBodyweight] = useLocalStorage('bodyweight', [])
  const [settings, setSettings] = useLocalStorage('settings', {
    defaultRestTime: 90,
    showStarterWeights: true,
  })

  const addBodyweight = (weight) => {
    setBodyweight(prev => [{
      id: Date.now().toString(36),
      weight,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const updateTemplate = (templateId, updatedTemplate) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t))
  }

  const duplicateTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return
    const newTemplate = {
      ...JSON.parse(JSON.stringify(template)),
      id: 'custom-' + Date.now().toString(36),
      name: template.name + ' (Copy)',
    }
    setTemplates(prev => [...prev, newTemplate])
    return newTemplate
  }

  const resetTemplates = () => {
    setTemplates(defaultTemplates)
  }

  // Compute streak
  const streak = (() => {
    const sessions = workout.sessions
    if (sessions.length === 0) return 0
    const dates = [...new Set(sessions.map(s => new Date(s.finishedAt).toDateString()))]
    dates.sort((a, b) => new Date(b) - new Date(a))
    let count = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i])
      d.setHours(0, 0, 0, 0)
      const expected = new Date(today)
      expected.setDate(expected.getDate() - i)
      if (d.getTime() === expected.getTime()) {
        count++
      } else if (i === 0 && d.getTime() === new Date(today.getTime() - 86400000).getTime()) {
        // Allow yesterday as start of streak
        count++
      } else {
        break
      }
    }
    return count
  })()

  const value = {
    ...workout,
    timer,
    templates,
    setTemplates,
    updateTemplate,
    duplicateTemplate,
    resetTemplates,
    bodyweight,
    addBodyweight,
    settings,
    setSettings,
    streak,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
