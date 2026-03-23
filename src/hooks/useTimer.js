import { useState, useRef, useCallback, useEffect } from 'react'

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const intervalRef = useRef(null)

  const start = useCallback((seconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTotalTime(seconds)
    setTimeLeft(seconds)
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setIsRunning(false)
          // Vibrate if available
          if (navigator.vibrate) navigator.vibrate([200, 100, 200])
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setTimeLeft(0)
  }, [])

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }, [])

  const resume = useCallback(() => {
    if (timeLeft > 0 && !isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            setIsRunning(false)
            if (navigator.vibrate) navigator.vibrate([200, 100, 200])
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [timeLeft, isRunning])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { timeLeft, isRunning, totalTime, start, stop, pause, resume }
}
