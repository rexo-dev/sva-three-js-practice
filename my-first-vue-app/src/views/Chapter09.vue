<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import CodeViewer from '../components/CodeViewer.vue'
import guideContent from '../guides/chapter-09-guide.md?raw'
import sourceCode from './Chapter09.vue?raw'

const canvasRef = ref(null)
let scene, camera, renderer, controls
let model
let animationId

onMounted(() => {
  initThreeJS()
  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (controls) {
    controls.dispose()
  }
  if (model) {
    model.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
  }
  if (renderer) {
    renderer.dispose()
  }
  window.removeEventListener('resize', onWindowResize)
})

function initThreeJS() {
  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)

  // Create camera
  const width = canvasRef.value.parentElement.clientWidth
  const height = canvasRef.value.parentElement.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(3, 2, 3)

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)

  // Create OrbitControls
  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true

  // Create a fallback object (since we don't have an actual GLTF model file)
  // In a real scenario, you would load a .gltf or .glb file
  createFallbackModel()

  // Add grid and axes helpers
  const gridHelper = new THREE.GridHelper(10, 10)
  scene.add(gridHelper)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Handle window resize
  window.addEventListener('resize', onWindowResize)
}

function createFallbackModel() {
  // Create a simple "robot" model using basic geometries
  model = new THREE.Group()

  // Body
  const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5)
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.position.y = 0.75
  model.add(body)

  // Head
  const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  const head = new THREE.Mesh(headGeometry, headMaterial)
  head.position.y = 1.8
  model.add(head)

  // Arms
  const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3)
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffe66d })

  const leftArm = new THREE.Mesh(armGeometry, armMaterial)
  leftArm.position.set(-0.65, 0.75, 0)
  model.add(leftArm)

  const rightArm = new THREE.Mesh(armGeometry, armMaterial)
  rightArm.position.set(0.65, 0.75, 0)
  model.add(rightArm)

  // Legs
  const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3)
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0xa8e6cf })

  const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
  leftLeg.position.set(-0.3, -0.5, 0)
  model.add(leftLeg)

  const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
  rightLeg.position.set(0.3, -0.5, 0)
  model.add(rightLeg)

  scene.add(model)
}

// Example of how to load a real GLTF model (commented out)
/*
function loadGLTFModel() {
  const loader = new GLTFLoader()

  loader.load(
    '/models/your-model.gltf',
    // onLoad callback
    (gltf) => {
      model = gltf.scene
      model.scale.set(2, 2, 2)
      model.position.set(0, 0, 0)
      scene.add(model)

      // If model has animations
      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
      }
    },
    // onProgress callback
    (progress) => {
      console.log((progress.loaded / progress.total * 100) + '% loaded')
    },
    // onError callback
    (error) => {
      console.error('Error loading model:', error)
    }
  )
}
*/

function onWindowResize() {
  const width = canvasRef.value.parentElement.clientWidth
  const height = canvasRef.value.parentElement.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  // Rotate the model
  if (model) {
    model.rotation.y += 0.01
  }

  // Update controls
  controls.update()

  renderer.render(scene, camera)
}
</script>

<template>
  <ChapterLayout>
    <template #canvas>
      <canvas ref="canvasRef"></canvas>
    </template>
    <template #guide>
      <MarkdownViewer :content="guideContent" />
    </template>
    <template #code>
      <CodeViewer :code="sourceCode" title="Chapter 9: Loading 3D Models - Full Source Code" />
    </template>
  </ChapterLayout>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
