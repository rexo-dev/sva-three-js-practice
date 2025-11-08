<template>
  <div class="code-editor">
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <span class="editor-title">{{ title }}</span>
      </div>
      <div class="toolbar-right">
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
  }
})

const emit = defineEmits(['update:modelValue', 'run', 'reset'])

const editorContainer = ref(null)
let editor = null

onMounted(() => {
  if (!editorContainer.value) return

  // Create Monaco editor instance
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
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

  // Listen for content changes
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())
  })

  // Add keyboard shortcut for running code (Ctrl/Cmd + Enter)
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    emit('run')
  })

  // Add Three.js type definitions for autocomplete
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
  })

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true
  })
})

onBeforeUnmount(() => {
  if (editor) {
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
</script>

<style scoped>
.code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
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
