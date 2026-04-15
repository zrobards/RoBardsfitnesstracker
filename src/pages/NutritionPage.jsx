import { useMemo, useState } from 'react'
import { Plus, Star, History, LayoutTemplate, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const MEAL_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout']

const EMPTY_FORM = {
  name: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  servings: '1',
  mealCategory: 'Breakfast',
  favorite: false,
}

function MacroProgress({ label, value, target, accent, unit = 'g' }) {
  const safeTarget = Math.max(Number(target) || 0, 1)
  const percent = Math.min(100, Math.round((value / safeTarget) * 100))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <span className="text-slate-300 tabular-nums">{Math.round(value)} / {Math.round(safeTarget)}{unit}</span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`${accent} h-full rounded-full transition-all duration-300`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function NutritionPage() {
  const {
    addFoodEntry,
    deleteFoodEntry,
    favoriteFoods,
    mealTemplates,
    addMealTemplate,
    recentFoods,
    todayNutrition,
    settings,
  } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [foodForm, setFoodForm] = useState(EMPTY_FORM)

  const targets = settings.macroTargets
  const totals = todayNutrition.totals
  const entries = todayNutrition.entries

  const totalsByCategory = useMemo(() => {
    return entries.reduce((acc, item) => {
      const key = item.mealCategory || 'Meal'
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  }, [entries])

  const resetForm = () => {
    setFoodForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!foodForm.name.trim()) return

    addFoodEntry({
      ...foodForm,
      name: foodForm.name.trim(),
    })
    resetForm()
  }

  const quickAddFood = (item) => {
    addFoodEntry({
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      servings: item.servings || 1,
      mealCategory: item.mealCategory || 'Snack',
    })
  }

  const saveTemplateFromForm = () => {
    if (!foodForm.name.trim()) return
    addMealTemplate(foodForm)
  }

  return (
    <div className="px-4 pt-4 pb-40 max-w-lg mx-auto space-y-4">
      <div className="safe-top">
        <h1 className="text-2xl font-bold text-white tracking-tight">Nutrition</h1>
        <p className="text-slate-500 text-sm mt-1">Log food fast and track macros for today.</p>
      </div>

      <div className="bg-surface rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-800/70 rounded-xl p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Calories</p>
            <p className="text-2xl font-bold text-white tabular-nums">{Math.round(totals.calories)}</p>
            <p className="text-xs text-slate-500">Target {targets.calories}</p>
          </div>
          <div className="bg-slate-800/70 rounded-xl p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Protein</p>
            <p className="text-2xl font-bold text-white tabular-nums">{Math.round(totals.protein)}g</p>
            <p className="text-xs text-slate-500">Target {targets.protein}g</p>
          </div>
        </div>

        <MacroProgress label="Calories" value={totals.calories} target={targets.calories} accent="bg-gradient-to-r from-brand to-brand-light" unit="" />
        <MacroProgress label="Protein" value={totals.protein} target={targets.protein} accent="bg-green-500" />
        <MacroProgress label="Carbs" value={totals.carbs} target={targets.carbs} accent="bg-amber-500" />
        <MacroProgress label="Fat" value={totals.fat} target={targets.fat} accent="bg-pink-500" />
      </div>

      <button
        onClick={() => setShowForm(v => !v)}
        className="w-full bg-gradient-to-r from-brand to-brand-light text-white py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 active:opacity-90"
      >
        <Plus size={20} /> {showForm ? 'Close Food Form' : 'Log Food'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-4 space-y-3">
          <input
            type="text"
            value={foodForm.name}
            onChange={e => setFoodForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Food name"
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-brand"
          />

          <div className="grid grid-cols-2 gap-2.5">
            <input type="number" inputMode="numeric" value={foodForm.calories} onChange={e => setFoodForm(prev => ({ ...prev, calories: e.target.value }))} placeholder="Calories" className="w-full bg-slate-800 text-white rounded-xl px-3 py-3.5 outline-none focus:ring-2 focus:ring-brand" />
            <input type="number" inputMode="decimal" value={foodForm.servings} onChange={e => setFoodForm(prev => ({ ...prev, servings: e.target.value }))} placeholder="Servings" className="w-full bg-slate-800 text-white rounded-xl px-3 py-3.5 outline-none focus:ring-2 focus:ring-brand" />
            <input type="number" inputMode="decimal" value={foodForm.protein} onChange={e => setFoodForm(prev => ({ ...prev, protein: e.target.value }))} placeholder="Protein (g)" className="w-full bg-slate-800 text-white rounded-xl px-3 py-3.5 outline-none focus:ring-2 focus:ring-brand" />
            <input type="number" inputMode="decimal" value={foodForm.carbs} onChange={e => setFoodForm(prev => ({ ...prev, carbs: e.target.value }))} placeholder="Carbs (g)" className="w-full bg-slate-800 text-white rounded-xl px-3 py-3.5 outline-none focus:ring-2 focus:ring-brand" />
          </div>

          <input type="number" inputMode="decimal" value={foodForm.fat} onChange={e => setFoodForm(prev => ({ ...prev, fat: e.target.value }))} placeholder="Fat (g)" className="w-full bg-slate-800 text-white rounded-xl px-3 py-3.5 outline-none focus:ring-2 focus:ring-brand" />

          <div className="flex gap-2 flex-wrap">
            {MEAL_CATEGORIES.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setFoodForm(prev => ({ ...prev, mealCategory: category }))}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  foodForm.mealCategory === category ? 'bg-brand text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={foodForm.favorite}
              onChange={e => setFoodForm(prev => ({ ...prev, favorite: e.target.checked }))}
              className="w-5 h-5 accent-brand"
            />
            Save as favorite
          </label>

          <div className="flex gap-2.5">
            <button type="button" onClick={saveTemplateFromForm} className="flex-1 bg-slate-800 text-slate-300 py-3.5 rounded-xl font-semibold active:bg-slate-700">
              Save Template
            </button>
            <button type="submit" className="flex-1 bg-brand text-white py-3.5 rounded-xl font-bold active:bg-brand-dark">
              Add Food
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <div className="bg-surface rounded-2xl p-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Star size={14} className="text-warning" /> Favorites
          </h2>
          <div className="space-y-2">
            {favoriteFoods.slice(0, 4).map(item => (
              <button key={item.id} onClick={() => quickAddFood(item)} className="w-full bg-slate-800/70 rounded-xl p-3 flex items-center justify-between text-left active:bg-slate-700">
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-slate-500 text-xs">{item.calories} kcal · {item.protein}p/{item.carbs}c/{item.fat}f</p>
                </div>
                <Plus size={16} className="text-slate-500" />
              </button>
            ))}
            {favoriteFoods.length === 0 && <p className="text-slate-500 text-xs">Mark meals as favorite to reuse them quickly.</p>}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <History size={14} className="text-brand-light" /> Recent Foods
          </h2>
          <div className="space-y-2">
            {recentFoods.slice(0, 6).map(item => (
              <button key={item.id} onClick={() => quickAddFood(item)} className="w-full bg-slate-800/70 rounded-xl p-3 flex items-center justify-between text-left active:bg-slate-700">
                <div>
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-slate-500 text-xs">{item.calories} kcal · {item.protein}p/{item.carbs}c/{item.fat}f</p>
                </div>
                <Plus size={16} className="text-slate-500" />
              </button>
            ))}
            {recentFoods.length === 0 && <p className="text-slate-500 text-xs">Your recent meals will appear here.</p>}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <LayoutTemplate size={14} className="text-success" /> Meal Templates
          </h2>
          <div className="space-y-2">
            {mealTemplates.slice(0, 6).map(template => (
              <button key={template.id} onClick={() => quickAddFood(template)} className="w-full bg-slate-800/70 rounded-xl p-3 flex items-center justify-between text-left active:bg-slate-700">
                <div>
                  <p className="text-white text-sm font-medium">{template.name}</p>
                  <p className="text-slate-500 text-xs">{template.calories} kcal · {template.protein}p/{template.carbs}c/{template.fat}f</p>
                </div>
                <Plus size={16} className="text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Today&apos;s Food Log</h2>
        <div className="space-y-3">
          {Object.entries(totalsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{category}</p>
              {items.map(item => (
                <div key={item.id} className="bg-slate-800/70 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-slate-500 text-xs">{Math.round(item.calories * (item.servings || 1))} kcal · {Math.round(item.protein * (item.servings || 1))}p/{Math.round(item.carbs * (item.servings || 1))}c/{Math.round(item.fat * (item.servings || 1))}f</p>
                  </div>
                  <button onClick={() => deleteFoodEntry(item.id)} className="w-10 h-10 rounded-xl bg-slate-900/70 text-slate-500 flex items-center justify-center active:bg-slate-700">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ))}
          {entries.length === 0 && <p className="text-slate-500 text-sm">No food logged yet today.</p>}
        </div>
      </div>

      <div className="fixed left-0 right-0 px-3 pt-3 z-40" style={{ bottom: 'calc(56px + env(safe-area-inset-bottom))', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-brand to-brand-light text-white py-4 rounded-2xl text-base font-bold shadow-lg shadow-brand/25 active:opacity-90"
          >
            Log Food
          </button>
        </div>
      </div>
    </div>
  )
}
