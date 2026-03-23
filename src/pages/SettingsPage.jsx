import { useState, useRef } from 'react'
import { Download, Upload, RotateCcw, Scale, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { exportAllData, importAllData } from '../utils/storage'

export default function SettingsPage() {
  const { settings, setSettings, bodyweight, addBodyweight, resetTemplates, sessions, setSessions } = useApp()
  const [bwInput, setBwInput] = useState('')
  const [importStatus, setImportStatus] = useState(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const fileInputRef = useRef(null)

  const handleExport = () => {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `robards-training-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        importAllData(data)
        setImportStatus('success')
        setTimeout(() => window.location.reload(), 1000)
      } catch {
        setImportStatus('error')
      }
    }
    reader.readAsText(file)
  }

  const handleAddBodyweight = () => {
    const w = parseFloat(bwInput)
    if (w > 0) {
      addBodyweight(w)
      setBwInput('')
    }
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>

      {/* Default Rest Timer */}
      <div className="bg-surface rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Default Rest Timer</h3>
        <div className="flex gap-2">
          {[60, 90, 120, 180].map(sec => (
            <button
              key={sec}
              onClick={() => setSettings(prev => ({ ...prev, defaultRestTime: sec }))}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                settings.defaultRestTime === sec
                  ? 'bg-brand text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {sec < 120 ? `${sec}s` : `${sec / 60}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Bodyweight Tracker */}
      <div className="bg-surface rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Scale size={16} className="text-success" />
          Log Bodyweight
        </h3>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            inputMode="decimal"
            placeholder="Weight (lb)"
            value={bwInput}
            onChange={e => setBwInput(e.target.value)}
            className="flex-1 bg-slate-800 text-white text-sm rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            onClick={handleAddBodyweight}
            className="bg-brand text-white px-6 py-3 rounded-lg text-sm font-semibold"
          >
            Log
          </button>
        </div>
        {bodyweight.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {bodyweight.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-center justify-between text-xs text-slate-400">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span className="text-white font-medium">{entry.weight} lb</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-surface rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Data Management</h3>

        <button
          onClick={handleExport}
          className="w-full bg-slate-800 text-slate-300 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:bg-slate-700 transition-colors"
        >
          <Download size={16} /> Export Data (JSON)
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-slate-800 text-slate-300 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:bg-slate-700 transition-colors"
        >
          <Upload size={16} /> Import Data
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

        {importStatus === 'success' && <p className="text-success text-xs text-center">Import successful! Reloading...</p>}
        {importStatus === 'error' && <p className="text-danger text-xs text-center">Import failed. Check file format.</p>}
      </div>

      {/* Danger Zone */}
      <div className="bg-surface rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-semibold text-danger mb-1">Danger Zone</h3>

        {showResetConfirm ? (
          <div className="flex gap-2">
            <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl text-sm font-medium">
              Cancel
            </button>
            <button onClick={() => { resetTemplates(); setShowResetConfirm(false) }} className="flex-1 bg-danger text-white py-3 rounded-xl text-sm font-bold">
              Yes, Reset
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-slate-800 text-slate-400 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:bg-slate-700"
          >
            <RotateCcw size={16} /> Reset Workout Templates
          </button>
        )}

        {showClearConfirm ? (
          <div className="flex gap-2">
            <button onClick={() => setShowClearConfirm(false)} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl text-sm font-medium">
              Cancel
            </button>
            <button onClick={() => { setSessions([]); setShowClearConfirm(false) }} className="flex-1 bg-danger text-white py-3 rounded-xl text-sm font-bold">
              Delete All
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full bg-slate-800 text-slate-400 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 active:bg-slate-700"
          >
            <Trash2 size={16} /> Clear All History
          </button>
        )}
      </div>

      {/* App Info */}
      <div className="text-center text-slate-600 text-xs pt-4">
        <p>RoBards Training Log v1.0</p>
        <p>Data stored locally on this device</p>
      </div>
    </div>
  )
}
