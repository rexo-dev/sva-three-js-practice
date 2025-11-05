<template>
  <div class="markdown-viewer" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

// Simple markdown parser (basic functionality)
const renderedContent = computed(() => {
  let html = props.content

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')

  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  // Line breaks
  html = html.replace(/\n\n/gim, '<br><br>')
  html = html.replace(/\n/gim, '<br>')

  return html
})
</script>

<style scoped>
.markdown-viewer {
  line-height: 1.6;
  color: #333;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding-bottom: 2rem;
}

.markdown-viewer :deep(h1) {
  font-size: 2rem;
  margin: 1.5rem 0 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
  word-wrap: break-word;
}

.markdown-viewer :deep(h2) {
  font-size: 1.5rem;
  margin: 1.25rem 0 0.75rem;
  color: #2c3e50;
  word-wrap: break-word;
}

.markdown-viewer :deep(h3) {
  font-size: 1.25rem;
  margin: 1rem 0 0.5rem;
  color: #2c3e50;
  word-wrap: break-word;
}

.markdown-viewer :deep(p) {
  margin: 0.75rem 0;
  max-width: 100%;
}

.markdown-viewer :deep(pre) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
  max-width: 100%;
}

.markdown-viewer :deep(code) {
  background-color: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
  word-wrap: break-word;
  max-width: 100%;
}

.markdown-viewer :deep(pre code) {
  background-color: transparent;
  padding: 0;
  display: block;
  overflow-x: auto;
}

.markdown-viewer :deep(ul) {
  margin: 1rem 0;
  padding-left: 2rem;
  max-width: 100%;
}

.markdown-viewer :deep(li) {
  margin: 0.5rem 0;
  word-wrap: break-word;
}

.markdown-viewer :deep(a) {
  color: #42b883;
  text-decoration: none;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.markdown-viewer :deep(a:hover) {
  text-decoration: underline;
}

.markdown-viewer :deep(strong) {
  font-weight: 600;
  color: #2c3e50;
}
</style>
