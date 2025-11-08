import { ref } from 'vue'
import * as THREE from 'three'

export function useCodeExecution() {
  const isExecuting = ref(false)
  const executionError = ref(null)
  const executionSuccess = ref(false)

  /**
   * Extract line number from error stack
   */
  const parseErrorLine = (error) => {
    if (!error.stack) return null

    const stackLines = error.stack.split('\n')
    for (const line of stackLines) {
      const match = line.match(/:(\d+):/)
      if (match) {
        return parseInt(match[1])
      }
    }
    return null
  }

  /**
   * Create a safe execution environment for user code
   */
  const createSafeContext = (scene, camera, renderer, controls) => {
    return {
      THREE,
      scene,
      camera,
      renderer,
      controls,
      // Safe console
      console: {
        log: (...args) => console.log('[User Code]:', ...args),
        error: (...args) => console.error('[User Code]:', ...args),
        warn: (...args) => console.warn('[User Code]:', ...args),
      },
      // Safe Math
      Math,
      // Prevent access to dangerous globals
      window: undefined,
      document: undefined,
      eval: undefined,
      Function: undefined,
    }
  }

  /**
   * Execute user code safely
   */
  const executeCode = async (code, context) => {
    isExecuting.value = true
    executionError.value = null
    executionSuccess.value = false

    try {
      // Wrap code in strict mode
      const wrappedCode = `
        'use strict';
        ${code}
      `

      // Create function from code
      const contextKeys = Object.keys(context)
      const contextValues = Object.values(context)

      const userFunction = new Function(...contextKeys, wrappedCode)

      // Execute with timeout protection
      const timeoutMs = 5000 // 5 second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Code execution timeout (5 seconds)')), timeoutMs)
      })

      const executionPromise = new Promise((resolve) => {
        userFunction(...contextValues)
        resolve()
      })

      await Promise.race([executionPromise, timeoutPromise])

      executionSuccess.value = true
      return {
        success: true,
        error: null
      }
    } catch (error) {
      const errorInfo = {
        message: error.message,
        line: parseErrorLine(error),
        stack: error.stack,
        type: error.name
      }

      executionError.value = errorInfo

      return {
        success: false,
        error: errorInfo
      }
    } finally {
      isExecuting.value = false
    }
  }

  /**
   * Get friendly error message for common errors
   */
  const getFriendlyErrorMessage = (error) => {
    if (!error) return ''

    const { message, type } = error

    // Common error patterns
    if (message.includes('is not defined')) {
      const match = message.match(/(\w+) is not defined/)
      if (match) {
        return `Variable or function '${match[1]}' is not defined. Did you forget to declare it?`
      }
    }

    if (type === 'SyntaxError') {
      return `Syntax Error: ${message}. Check your code for typos, missing brackets, or semicolons.`
    }

    if (type === 'TypeError') {
      return `Type Error: ${message}. You might be trying to use a property or method on something that doesn't have it.`
    }

    if (message.includes('timeout')) {
      return 'Code execution timed out. Make sure your code doesn\'t have infinite loops.'
    }

    return message
  }

  /**
   * Clear execution state
   */
  const clearExecutionState = () => {
    isExecuting.value = false
    executionError.value = null
    executionSuccess.value = false
  }

  return {
    isExecuting,
    executionError,
    executionSuccess,
    executeCode,
    createSafeContext,
    getFriendlyErrorMessage,
    clearExecutionState,
    parseErrorLine
  }
}
