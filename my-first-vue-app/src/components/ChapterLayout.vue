<template>
  <div class="chapter-layout">
    <div class="canvas-container" :style="{ width: canvasWidth + '%' }">
      <slot name="canvas"></slot>
    </div>
    <div class="resizer" @mousedown="startResize" :class="{ resizing: isResizing }"></div>
    <div class="guide-container" :style="{ width: guideWidth + '%' }">
      <slot name="guide"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasWidth = ref(35)
const guideWidth = ref(65)
const isResizing = ref(false)

const startResize = (e) => {
  isResizing.value = true
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

const resize = (e) => {
  if (!isResizing.value) return

  const container = e.target.closest('.chapter-layout')
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const newCanvasWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

  // Constrain between 20% and 80%
  if (newCanvasWidth >= 20 && newCanvasWidth <= 80) {
    canvasWidth.value = newCanvasWidth
    guideWidth.value = 100 - newCanvasWidth
  }
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
.chapter-layout {
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0;
  position: relative;
}

.canvas-container {
  background-color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 0;
  height: 100%;
}

.canvas-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.resizer {
  width: 6px;
  cursor: col-resize;
  background-color: #ddd;
  position: relative;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.resizer:hover,
.resizer.resizing {
  background-color: #42b883;
}

.resizer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -3px;
  right: -3px;
  bottom: 0;
}

.guide-container {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem;
  background-color: #f5f5f5;
  min-width: 0;
  height: 100%;
}

@media (max-width: 768px) {
  .chapter-layout {
    flex-direction: column;
  }

  .canvas-container,
  .guide-container {
    width: 100% !important;
    height: 50vh;
  }

  .resizer {
    display: none;
  }
}
</style>
