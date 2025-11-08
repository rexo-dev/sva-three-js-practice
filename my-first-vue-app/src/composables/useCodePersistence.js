import { ref, watch } from 'vue'

/**
 * Composable for persisting code in localStorage
 * @param {string} key - Unique key for this code snippet
 * @param {string} defaultCode - Default code to use if nothing is saved
 */
export function useCodePersistence(key, defaultCode) {
  const STORAGE_PREFIX = 'threejs_tutorial_code_'
  const storageKey = STORAGE_PREFIX + key

  /**
   * Load code from localStorage
   */
  const loadCode = () => {
    try {
      const savedCode = localStorage.getItem(storageKey)
      return savedCode !== null ? savedCode : defaultCode
    } catch (error) {
      console.warn('Failed to load code from localStorage:', error)
      return defaultCode
    }
  }

  /**
   * Save code to localStorage
   */
  const saveCode = (code) => {
    try {
      localStorage.setItem(storageKey, code)
    } catch (error) {
      console.warn('Failed to save code to localStorage:', error)
    }
  }

  /**
   * Clear saved code
   */
  const clearSavedCode = () => {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn('Failed to clear code from localStorage:', error)
    }
  }

  /**
   * Check if there is saved code
   */
  const hasSavedCode = () => {
    try {
      return localStorage.getItem(storageKey) !== null
    } catch (error) {
      return false
    }
  }

  /**
   * Reset to default code
   */
  const resetToDefault = () => {
    clearSavedCode()
    return defaultCode
  }

  /**
   * Get all saved code snippets (for listing purposes)
   */
  const getAllSavedSnippets = () => {
    try {
      const snippets = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const snippetKey = key.replace(STORAGE_PREFIX, '')
          const code = localStorage.getItem(key)
          snippets.push({ key: snippetKey, code })
        }
      }
      return snippets
    } catch (error) {
      console.warn('Failed to get saved snippets:', error)
      return []
    }
  }

  /**
   * Clear all saved code snippets
   */
  const clearAllSaved = () => {
    try {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear all saved code:', error)
    }
  }

  // Create reactive code ref
  const code = ref(loadCode())

  // Auto-save on changes (with debounce)
  let saveTimeout = null
  watch(code, (newCode) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    saveTimeout = setTimeout(() => {
      saveCode(newCode)
    }, 500) // Save 500ms after last change
  })

  return {
    code,
    saveCode,
    loadCode,
    clearSavedCode,
    hasSavedCode,
    resetToDefault,
    getAllSavedSnippets,
    clearAllSaved
  }
}
