import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import WorkoutsPage from './pages/WorkoutsPage'
import WorkoutDetailPage from './pages/WorkoutDetailPage'
import HistoryPage from './pages/HistoryPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="bg-surface-dark min-h-svh text-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/workout/:id" element={<WorkoutDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          <BottomNav />
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}
