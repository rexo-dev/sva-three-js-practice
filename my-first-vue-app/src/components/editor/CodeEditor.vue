<template>
  <div class="code-editor">
    <div class="editor-toolbar" ref="toolbarRef">
      <div class="toolbar-left">
        <span class="editor-title">{{ title }}</span>
        <transition name="fade">
          <span v-if="showSaveStatus" class="save-status" :class="saveStatus">
            <span v-if="saveStatus === 'saved'" class="status-icon">✓</span>
            <span v-else-if="saveStatus === 'saving'" class="status-icon spinner">⟳</span>
            <span v-else class="status-icon">○</span>
            {{ saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved' }}
          </span>
        </transition>
      </div>
      <div class="toolbar-right">
        <button
          v-if="showSnippets"
          @click="$emit('toggle-snippets')"
          class="toolbar-button"
          title="Browse Code Snippets"
        >
          <span class="icon">📚</span> Snippets
        </button>
        <button @click="formatCode" class="toolbar-button" title="Format Code (Shift+Alt+F)">
          <span class="icon">⚡</span> Format
        </button>
        <button @click="$emit('reset')" class="toolbar-button" title="Reset to Original">
          <span class="icon">↺</span> Reset
        </button>
        <button @click="$emit('run')" class="toolbar-button run-button" title="Run Code (Ctrl+Enter)">
          <span class="icon">▶</span> Run
        </button>
      </div>
    </div>
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  title: {
    type: String,
    default: 'Code Editor'
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'vs-dark'
  },
  showSaveStatus: {
    type: Boolean,
    default: true
  },
  showSnippets: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'run', 'reset', 'toggle-snippets'])

const editorContainer = ref(null)
const toolbarRef = ref(null)
const saveStatus = ref('saved') // 'saved', 'saving', 'unsaved'
let editor = null
let saveStatusTimeout = null

onMounted(() => {
  if (!editorContainer.value) return

  // Create Monaco editor instance
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true, // Automatically adjusts layout on container resize
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    readOnly: props.readOnly,
    padding: { top: 10, bottom: 10 },
    scrollbar: {
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    },
    bracketPairColorization: {
      enabled: true
    },
    suggest: {
      showKeywords: true,
      showSnippets: true
    }
  })

  // Watch for container resize using ResizeObserver
  const resizeObserver = new ResizeObserver(() => {
    if (editor) {
      editor.layout() // Force Monaco to recalculate its layout
    }
  })

  if (editorContainer.value.parentElement) {
    resizeObserver.observe(editorContainer.value.parentElement)
  }

  // Store observer for cleanup
  editor._resizeObserver = resizeObserver

  // Listen for content changes
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())

    // Update save status
    if (props.showSaveStatus) {
      saveStatus.value = 'unsaved'

      // Clear existing timeout
      if (saveStatusTimeout) {
        clearTimeout(saveStatusTimeout)
      }

      // Show "saving..." after a brief delay, then "saved"
      saveStatusTimeout = setTimeout(() => {
        saveStatus.value = 'saving'
        setTimeout(() => {
          saveStatus.value = 'saved'
        }, 300)
      }, 500)
    }
  })

  // Add keyboard shortcut for running code (Ctrl/Cmd + Enter)
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    emit('run')
  })

  // Add Three.js type definitions for autocomplete
  // Disable strict validation to avoid errors with JavaScript code
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true, // Disable semantic validation for JavaScript
    noSyntaxValidation: false,  // Keep syntax validation
    noSuggestionDiagnostics: true,
    diagnosticCodesToIgnore: [1005, 1108, 1005, 2451, 7027] // Ignore common strict mode errors
  })

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    allowJs: true,
    checkJs: false // Disable type checking for JavaScript
  })

  // Add Three.js global declarations for better IntelliSense
  const threeJsGlobals = `
    declare const THREE: typeof import('three');
    declare const scene: import('three').Scene;
    declare const camera: import('three').PerspectiveCamera;
    declare const renderer: import('three').WebGLRenderer;
    declare const controls: any;
    declare const Math: Math;
    declare const console: {
      log(...args: any[]): void;
      error(...args: any[]): void;
      warn(...args: any[]): void;
    };
  `

  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    threeJsGlobals,
    'ts:filename/three-globals.d.ts'
  )
})

onBeforeUnmount(() => {
  if (editor) {
    // Disconnect ResizeObserver
    if (editor._resizeObserver) {
      editor._resizeObserver.disconnect()
    }
    editor.dispose()
  }
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

const formatCode = () => {
  if (editor) {
    editor.getAction('editor.action.formatDocument').run()
  }
}

/**
 * Insert text at current cursor position
 */
const insertTextAtCursor = (text) => {
  if (editor) {
    const selection = editor.getSelection()
    const range = new monaco.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    )

    const op = {
      range: range,
      text: text,
      forceMoveMarkers: true
    }

    editor.executeEdits('insert-snippet', [op])
    editor.focus()
  }
}

const getToolbarHeight = () => {
  return toolbarRef.value ? toolbarRef.value.offsetHeight : 0
}

defineExpose({
  insertTextAtCursor,
  getToolbarHeight
})
</script>

<style scoped>
.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #2d2d30;
  border-bottom: 1px solid #3e3e42;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-title {
  color: #cccccc;
  font-size: 0.9rem;
  font-weight: 500;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.save-status.saved {
  color: #42b883;
  background-color: rgba(66, 184, 131, 0.1);
}

.save-status.saving {
  color: #ffa500;
  background-color: rgba(255, 165, 0, 0.1);
}

.save-status.unsaved {
  color: #999;
  background-color: rgba(153, 153, 153, 0.1);
}

.status-icon {
  font-size: 0.9rem;
}

.status-icon.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.toolbar-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #3e3e42;
  color: #cccccc;
  border: 1px solid #5a5a5f;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.toolbar-button:hover {
  background-color: #505053;
  border-color: #6a6a6f;
}

.toolbar-button .icon {
  font-size: 1rem;
}

.run-button {
  background-color: #42b883;
  border-color: #42b883;
  color: white;
  font-weight: 500;
}

.run-button:hover {
  background-color: #35945f;
  border-color: #35945f;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(66, 184, 131, 0.3);
}

.editor-container {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .editor-toolbar {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }

  .toolbar-button {
    flex: 1;
    justify-content: center;
  }
}
</style>
