import { cloneElement } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, Apple, TrendingUp, Settings } from 'lucide-react'

const tabs = [
  { to: '/', icon: <Home size={20} />, label: 'Home' },
  { to: '/workouts', icon: <Dumbbell size={20} />, label: 'Workouts' },
  { to: '/nutrition', icon: <Apple size={20} />, label: 'Nutrition' },
  { to: '/progress', icon: <TrendingUp size={20} />, label: 'Progress' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-50" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
      <div className="max-w-lg mx-auto flex justify-around items-center h-14 px-1">
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'text-brand' : 'text-slate-500 active:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {cloneElement(icon, { strokeWidth: isActive ? 2.5 : 1.8 })}
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
