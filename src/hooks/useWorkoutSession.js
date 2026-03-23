import { useState, useCallback, useEffect } from 'react'
import { save, load, generateId } from '../utils/storage'

export function useWorkoutSession() {
  const [activeSession, setActiveSession] = useState(() => load('activeSession', null))
  const [sessions, setSessions] = useState(() => load('sessions', []))

  // Persist on change
  useEffect(() => { save('activeSession', activeSession) }, [activeSession])
  useEffect(() => { save('sessions', sessions) }, [sessions])

  const startSession = useCallback((templateId, templateName, exercises) => {
    const session = {
      id: generateId(),
      templateId,
      templateName,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      exercises: exercises.map(ex => ({
        exerciseId: ex.id,
        name: ex.name,
        targetSets: typeof ex.sets === 'string' ? parseInt(ex.sets) : ex.sets,
        targetReps: ex.reps,
        sets: Array.from({ length: typeof ex.sets === 'string' ? parseInt(ex.sets) : ex.sets }, () => ({
          weight: '',
          reps: '',
          completed: false,
        })),
      })),
      coreCompleted: false,
      stretchesCompleted: false,
      notes: '',
    }
    setActiveSession(session)
    return session
  }, [])

  const updateSet = useCallback((exerciseIndex, setIndex, field, value) => {
    setActiveSession(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.exercises = [...prev.exercises]
      updated.exercises[exerciseIndex] = { ...prev.exercises[exerciseIndex] }
      updated.exercises[exerciseIndex].sets = [...prev.exercises[exerciseIndex].sets]
      updated.exercises[exerciseIndex].sets[setIndex] = {
        ...prev.exercises[exerciseIndex].sets[setIndex],
        [field]: value,
      }
      return updated
    })
  }, [])

  const toggleSetComplete = useCallback((exerciseIndex, setIndex) => {
    setActiveSession(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.exercises = [...prev.exercises]
      updated.exercises[exerciseIndex] = { ...prev.exercises[exerciseIndex] }
      updated.exercises[exerciseIndex].sets = [...prev.exercises[exerciseIndex].sets]
      const current = prev.exercises[exerciseIndex].sets[setIndex].completed
      updated.exercises[exerciseIndex].sets[setIndex] = {
        ...prev.exercises[exerciseIndex].sets[setIndex],
        completed: !current,
      }
      return updated
    })
  }, [])

  const addSet = useCallback((exerciseIndex) => {
    setActiveSession(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.exercises = [...prev.exercises]
      updated.exercises[exerciseIndex] = { ...prev.exercises[exerciseIndex] }
      updated.exercises[exerciseIndex].sets = [
        ...prev.exercises[exerciseIndex].sets,
        { weight: '', reps: '', completed: false },
      ]
      return updated
    })
  }, [])

  const removeSet = useCallback((exerciseIndex, setIndex) => {
    setActiveSession(prev => {
      if (!prev) return prev
      const updated = { ...prev }
      updated.exercises = [...prev.exercises]
      updated.exercises[exerciseIndex] = { ...prev.exercises[exerciseIndex] }
      updated.exercises[exerciseIndex].sets = prev.exercises[exerciseIndex].sets.filter((_, i) => i !== setIndex)
      return updated
    })
  }, [])

  const updateSessionField = useCallback((field, value) => {
    setActiveSession(prev => prev ? { ...prev, [field]: value } : prev)
  }, [])

  const finishSession = useCallback(() => {
    if (!activeSession) return null
    const finished = {
      ...activeSession,
      finishedAt: new Date().toISOString(),
    }
    setSessions(prev => [finished, ...prev])
    setActiveSession(null)
    return finished
  }, [activeSession])

  const discardSession = useCallback(() => {
    setActiveSession(null)
  }, [])

  const deleteSession = useCallback((sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
  }, [])

  // Get last session for a template to show previous values
  const getLastSession = useCallback((templateId) => {
    return sessions.find(s => s.templateId === templateId)
  }, [sessions])

  // Get all sessions for a template
  const getSessionsForTemplate = useCallback((templateId) => {
    return sessions.filter(s => s.templateId === templateId)
  }, [sessions])

  // Get best weight for an exercise across all sessions
  const getBestForExercise = useCallback((exerciseName) => {
    let bestWeight = 0
    let bestReps = 0
    for (const session of sessions) {
      for (const ex of session.exercises) {
        if (ex.name === exerciseName) {
          for (const set of ex.sets) {
            const w = parseFloat(set.weight) || 0
            const r = parseInt(set.reps) || 0
            if (w > bestWeight) bestWeight = w
            if (r > bestReps) bestReps = r
          }
        }
      }
    }
    return { bestWeight, bestReps }
  }, [sessions])

  return {
    activeSession,
    sessions,
    setSessions,
    startSession,
    updateSet,
    toggleSetComplete,
    addSet,
    removeSet,
    updateSessionField,
    finishSession,
    discardSession,
    deleteSession,
    getLastSession,
    getSessionsForTemplate,
    getBestForExercise,
  }
}
