<template>
  <div class="interactive-canvas">
    <div class="canvas-wrapper">
      <canvas ref="canvasRef"></canvas>

      <!-- Loading Overlay -->
      <div v-if="isExecuting" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Running code...</p>
      </div>

      <!-- Success Indicator -->
      <transition name="fade">
        <div v-if="showSuccess" class="success-indicator">
          <span class="icon">✓</span> Code executed successfully
        </div>
      </transition>

      <!-- Error Indicator -->
      <transition name="fade">
        <div v-if="error" class="error-indicator">
          <span class="icon">⚠</span> Execution error
        </div>
      </transition>
    </div>

    <!-- Error Panel -->
    <transition name="slide">
      <div v-if="error" class="error-panel">
        <div class="error-header">
          <span class="error-icon">⚠️</span>
          <h4>{{ error.type || 'Error' }}</h4>
          <button @click="$emit('clearError')" class="close-button">×</button>
        </div>
        <div class="error-content">
          <p class="error-message">{{ friendlyErrorMessage }}</p>
          <p v-if="error.line" class="error-line">Line {{ error.line }}</p>
          <details v-if="error.stack" class="error-details">
            <summary>View Stack Trace</summary>
            <pre>{{ error.stack }}</pre>
          </details>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useCodeExecution } from '../../composables/useCodeExecution'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  autoRun: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['error', 'success', 'clearError'])

const canvasRef = ref(null)
const {
  isExecuting,
  executionError,
  executionSuccess,
  executeCode,
  createSafeContext,
  getFriendlyErrorMessage
} = useCodeExecution()

// Scene objects
let scene, camera, renderer, controls
let animationId = null
let userCreatedObjects = []

// UI state
const showSuccess = ref(false)
const error = ref(null)

const friendlyErrorMessage = computed(() => {
  return error.value ? getFriendlyErrorMessage(error.value) : ''
})

onMounted(() => {
  initThreeJS()
  if (props.autoRun) {
    runCode()
  }
})

onBeforeUnmount(() => {
  cleanup()
})

// Watch for code changes
watch(() => props.code, () => {
  if (props.autoRun) {
    runCode()
  }
})

// Watch for execution success
watch(executionSuccess, (success) => {
  if (success) {
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 2000)
  }
})

// Watch for execution errors
watch(executionError, (err) => {
  error.value = err
  if (err) {
    emit('error', err)
  }
})

function initThreeJS() {
  if (!canvasRef.value) return

  const container = canvasRef.value.parentElement
  const width = container.clientWidth
  const height = container.clientHeight

  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)

  // Create camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5

  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Create controls
  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // Add default lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Handle window resize
  window.addEventListener('resize', onWindowResize)

  // Watch for parent container resize
  const resizeObserver = new ResizeObserver(() => {
    onWindowResize()
  })
  resizeObserver.observe(container)
}

function onWindowResize() {
  if (!canvasRef.value || !camera || !renderer) return

  const container = canvasRef.value.parentElement
  const width = container.clientWidth
  const height = container.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

async function runCode() {
  // Clear previous errors
  error.value = null
  emit('clearError')

  // Clean up previous execution
  cleanup(false) // Don't dispose renderer/camera

  // Recreate scene for fresh execution
  scene.clear()
  userCreatedObjects = []

  // Re-add default lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Create safe execution context
  const context = createSafeContext(scene, camera, renderer, controls)

  // Execute user code
  const result = await executeCode(props.code, context)

  if (result.success) {
    // Start animation loop if not already running
    if (!animationId) {
      animate()
    }
    emit('success')
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)

  if (controls) {
    controls.update()
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

function cleanup(disposeAll = true) {
  // Cancel animation loop
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  // Dispose user-created objects
  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose()
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }

  if (disposeAll) {
    if (renderer) {
      renderer.dispose()
    }

    if (controls) {
      controls.dispose()
    }

    window.removeEventListener('resize', onWindowResize)
  }
}

defineExpose({
  runCode,
  cleanup
})
</script>

<style scoped>
.interactive-canvas {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.canvas-wrapper {
  position: relative;
  flex: 1;
  min-height: 0;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(66, 184, 131, 0.2);
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-indicator,
.error-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.success-indicator {
  background-color: #42b883;
}

.error-indicator {
  background-color: #e74c3c;
}

.success-indicator .icon,
.error-indicator .icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.error-panel {
  background-color: #2d2d30;
  border-top: 2px solid #e74c3c;
  padding: 15px;
  max-height: 200px;
  overflow-y: auto;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.error-icon {
  font-size: 1.2rem;
}

.error-header h4 {
  flex: 1;
  margin: 0;
  color: #e74c3c;
  font-size: 1rem;
}

.close-button {
  background: none;
  border: none;
  color: #cccccc;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.error-content {
  color: #cccccc;
}

.error-message {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.error-line {
  margin: 0 0 10px 0;
  font-size: 0.85rem;
  color: #999;
}

.error-details {
  margin-top: 10px;
}

.error-details summary {
  cursor: pointer;
  color: #42b883;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.error-details pre {
  background-color: #1e1e1e;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  line-height: 1.4;
  overflow-x: auto;
  color: #d4d4d4;
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
