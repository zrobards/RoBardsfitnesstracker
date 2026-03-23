import { useState, useCallback } from 'react'
import { save, load } from '../utils/storage'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return load(key, initialValue)
  })

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    save(key, valueToStore)
  }, [key, storedValue])

  return [storedValue, setValue]
}
