// Local storage helpers with JSON serialization

const PREFIX = 'robards_'

export function save(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export function load(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
    return defaultValue
  }
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}

export function exportAllData() {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith(PREFIX)) {
      data[key.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(key))
    }
  }
  return data
}

export function importAllData(data) {
  // Clear existing app data first
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith(PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))

  // Import new data
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
