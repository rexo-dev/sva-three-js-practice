<template>
  <div class="code-viewer">
    <div class="code-header">
      <h2>{{ title }}</h2>
      <button @click="copyCode" class="copy-button">
        {{ copied ? 'Copied!' : 'Copy Code' }}
      </button>
    </div>
    <pre><code>{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Full Source Code',
  },
})

const copied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<style scoped>
.code-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #2d2d2d;
  border-bottom: 2px solid #42b883;
  flex-shrink: 0;
}

.code-header h2 {
  color: #42b883;
  font-size: 1.25rem;
  margin: 0;
}

.copy-button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.copy-button:hover {
  background-color: #35945f;
}

pre {
  flex: 1;
  margin: 0;
  padding: 1.5rem;
  background-color: #1e1e1e;
  overflow: auto;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

code {
  color: #d4d4d4;
  display: block;
}

/* Syntax highlighting colors */
pre :deep(.keyword) {
  color: #569cd6;
}

pre :deep(.string) {
  color: #ce9178;
}

pre :deep(.comment) {
  color: #6a9955;
  font-style: italic;
}

pre :deep(.function) {
  color: #dcdcaa;
}
</style>
