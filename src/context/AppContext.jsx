/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import { useWorkoutSession } from '../hooks/useWorkoutSession'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTimer } from '../hooks/useTimer'
import { workoutTemplates as defaultTemplates } from '../data/workoutPlan'

const AppContext = createContext(null)

const DEFAULT_SETTINGS = {
  defaultRestTime: 90,
  showStarterWeights: true,
  macroTargets: {
    calories: 2400,
    protein: 180,
    carbs: 240,
    fat: 75,
  },
  bodyweightGoal: '',
}

const DEFAULT_MEAL_TEMPLATES = [
  { id: 'tpl-breakfast-oats', name: 'Protein Oats', calories: 420, protein: 32, carbs: 52, fat: 10, servings: 1, mealCategory: 'Breakfast' },
  { id: 'tpl-lunch-chicken-rice', name: 'Chicken & Rice Bowl', calories: 620, protein: 48, carbs: 65, fat: 16, servings: 1, mealCategory: 'Lunch' },
  { id: 'tpl-snack-shake', name: 'Whey Shake', calories: 220, protein: 30, carbs: 8, fat: 5, servings: 1, mealCategory: 'Snack' },
]

function toDayKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) {
    console.warn('Invalid date passed to toDayKey:', date)
    return new Date().toISOString().slice(0, 10)
  }
  return d.toISOString().slice(0, 10)
}

function getEntryTotals(entries = []) {
  return entries.reduce((totals, item) => {
    const servings = Number(item.servings) || 1
    totals.calories += (Number(item.calories) || 0) * servings
    totals.protein += (Number(item.protein) || 0) * servings
    totals.carbs += (Number(item.carbs) || 0) * servings
    totals.fat += (Number(item.fat) || 0) * servings
    return totals
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 })
}

export function AppProvider({ children }) {
  const workout = useWorkoutSession()
  const timer = useTimer()
  const [templates, setTemplates] = useLocalStorage('templates', defaultTemplates)
  const [bodyweight, setBodyweight] = useLocalStorage('bodyweight', [])
  const [settings, setSettings] = useLocalStorage('settings', DEFAULT_SETTINGS)
  const [foodEntries, setFoodEntries] = useLocalStorage('foodEntries', [])
  const [mealTemplates, setMealTemplates] = useLocalStorage('mealTemplates', DEFAULT_MEAL_TEMPLATES)

  const mergedSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
    macroTargets: {
      ...DEFAULT_SETTINGS.macroTargets,
      ...(settings?.macroTargets || {}),
    },
  }

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

  const addFoodEntry = (entry) => {
    const normalized = {
      id: Date.now().toString(36),
      name: entry.name,
      calories: Number(entry.calories) || 0,
      protein: Number(entry.protein) || 0,
      carbs: Number(entry.carbs) || 0,
      fat: Number(entry.fat) || 0,
      servings: Number(entry.servings) || 1,
      mealCategory: entry.mealCategory || 'Meal',
      favorite: Boolean(entry.favorite),
      date: entry.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    setFoodEntries(prev => [normalized, ...prev])
    return normalized
  }

  const updateFoodEntry = (entryId, updates) => {
    setFoodEntries(prev => prev.map(entry => (
      entry.id === entryId ? { ...entry, ...updates } : entry
    )))
  }

  const deleteFoodEntry = (entryId) => {
    setFoodEntries(prev => prev.filter(entry => entry.id !== entryId))
  }

  const addMealTemplate = (template) => {
    const normalized = {
      id: 'tpl-' + Date.now().toString(36),
      name: template.name,
      calories: Number(template.calories) || 0,
      protein: Number(template.protein) || 0,
      carbs: Number(template.carbs) || 0,
      fat: Number(template.fat) || 0,
      servings: Number(template.servings) || 1,
      mealCategory: template.mealCategory || 'Meal',
    }
    setMealTemplates(prev => [normalized, ...prev])
    return normalized
  }

  const removeMealTemplate = (templateId) => {
    setMealTemplates(prev => prev.filter(template => template.id !== templateId))
  }

  const getEntriesForDate = (date = new Date()) => {
    const key = toDayKey(date)
    return foodEntries.filter(entry => toDayKey(entry.date) === key)
  }

  const getNutritionForDate = (date = new Date()) => {
    const entries = getEntriesForDate(date)
    return {
      entries,
      totals: getEntryTotals(entries),
    }
  }

  const todayNutrition = getNutritionForDate(new Date())

  const favoriteFoods = foodEntries
    .filter(entry => entry.favorite)
    .reduce((acc, item) => {
      if (!acc.some(existing => existing.name.toLowerCase() === item.name.toLowerCase())) {
        acc.push(item)
      }
      return acc
    }, [])

  const recentFoods = foodEntries
    .slice()
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .reduce((acc, item) => {
      if (!acc.some(existing => existing.name.toLowerCase() === item.name.toLowerCase())) {
        acc.push(item)
      }
      return acc
    }, [])
    .slice(0, 12)

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
    settings: mergedSettings,
    setSettings,
    streak,
    foodEntries,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    mealTemplates,
    addMealTemplate,
    removeMealTemplate,
    favoriteFoods,
    recentFoods,
    getEntriesForDate,
    getNutritionForDate,
    todayNutrition,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
