import { useState } from 'react'
import { Timer, X, Pause, Play } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatTime } from '../utils/formatters'

const PRESETS = [
  { label: '60s', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
]

export default function RestTimer() {
  const { timer } = useApp()
  const [showPicker, setShowPicker] = useState(false)
  const [customTime, setCustomTime] = useState('')

  const progress = timer.totalTime > 0 ? ((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100 : 0

  if (!timer.isRunning && timer.timeLeft === 0 && !showPicker) {
    return (
      <button
        onClick={() => setShowPicker(true)}
        className="flex items-center gap-2 bg-surface text-slate-300 px-4 py-3 rounded-xl text-sm font-medium active:bg-surface-light transition-colors"
      >
        <Timer size={18} />
        Rest Timer
      </button>
    )
  }

  if (showPicker && !timer.isRunning && timer.timeLeft === 0) {
    return (
      <div className="bg-surface rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Rest Timer</span>
          <button onClick={() => setShowPicker(false)} className="text-slate-500 p-1">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map(({ label, seconds }) => (
            <button
              key={label}
              onClick={() => { timer.start(seconds); setShowPicker(false) }}
              className="bg-surface-light text-white py-3 rounded-lg text-sm font-semibold active:bg-brand transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Custom (sec)"
            value={customTime}
            onChange={e => setCustomTime(e.target.value)}
            className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            onClick={() => {
              const t = parseInt(customTime)
              if (t > 0) { timer.start(t); setShowPicker(false); setCustomTime('') }
            }}
            className="bg-brand text-white px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            Go
          </button>
        </div>
      </div>
    )
  }

  // Timer is running or paused with time left
  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-400">Rest Timer</span>
        <button onClick={timer.stop} className="text-slate-500 p-1">
          <X size={18} />
        </button>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-white tabular-nums mb-3">
          {formatTime(timer.timeLeft)}
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
          <div
            className="bg-brand h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-2 justify-center">
          {timer.isRunning ? (
            <button onClick={timer.pause} className="bg-surface-light text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
              <Pause size={16} /> Pause
            </button>
          ) : (
            <button onClick={timer.resume} className="bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
              <Play size={16} /> Resume
            </button>
          )}
          <button onClick={timer.stop} className="bg-slate-800 text-slate-400 px-6 py-2.5 rounded-lg text-sm font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
