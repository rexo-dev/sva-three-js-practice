<template>
  <div class="chapter-layout">
    <div class="canvas-container" :style="{ width: canvasWidth + '%' }">
      <slot name="canvas"></slot>
    </div>
    <div class="resizer" @mousedown="startResize" :class="{ resizing: isResizing }"></div>
    <div class="guide-container" :style="{ width: guideWidth + '%' }">
      <div class="view-toggle">
        <button
          @click="showGuide = true"
          :class="{ active: showGuide }"
          class="toggle-button"
        >
          Guide
        </button>
        <button
          @click="showGuide = false"
          :class="{ active: !showGuide }"
          class="toggle-button"
        >
          Code
        </button>
      </div>
      <div class="content-wrapper">
        <div v-show="showGuide" class="guide-content">
          <slot name="guide"></slot>
        </div>
        <div v-show="!showGuide" class="code-content">
          <slot name="code"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasWidth = ref(35)
const guideWidth = ref(65)
const isResizing = ref(false)
const showGuide = ref(true)

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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f5f5;
  min-width: 0;
  height: 100%;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

.toggle-button {
  padding: 0.5rem 1.5rem;
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  font-weight: 500;
}

.toggle-button:hover {
  background-color: #e0e0e0;
}

.toggle-button.active {
  background-color: #42b883;
  color: white;
  border-color: #42b883;
}

.content-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.guide-content,
.code-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.guide-content {
  padding: 2rem;
}

.code-content {
  padding: 0;
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
