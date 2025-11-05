<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import guideContent from '../guides/chapter-06-guide.md?raw'

const canvasRef = ref(null)
let scene, camera, renderer, controls
let cube
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
  if (cube) {
    cube.geometry.dispose()
    cube.material.dispose()
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
  camera.position.set(3, 3, 3)

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)

  // Create OrbitControls
  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 2
  controls.maxDistance = 10
  controls.maxPolarAngle = Math.PI / 2

  // Create a cube
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  // Add a grid helper
  const gridHelper = new THREE.GridHelper(10, 10)
  scene.add(gridHelper)

  // Add axes helper
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

function onWindowResize() {
  const width = canvasRef.value.parentElement.clientWidth
  const height = canvasRef.value.parentElement.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  // Update controls (required when damping is enabled)
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
  </ChapterLayout>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
