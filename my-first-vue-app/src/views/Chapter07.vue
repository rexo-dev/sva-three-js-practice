<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import guideContent from '../guides/chapter-07-guide.md?raw'

const canvasRef = ref(null)
let scene, camera, renderer, clock
let cube, sphere, torus
let animationId

onMounted(() => {
  initThreeJS()
  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (cube) {
    cube.geometry.dispose()
    cube.material.dispose()
  }
  if (sphere) {
    sphere.geometry.dispose()
    sphere.material.dispose()
  }
  if (torus) {
    torus.geometry.dispose()
    torus.material.dispose()
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

  // Create clock for time-based animations
  clock = new THREE.Clock()

  // Create camera
  const width = canvasRef.value.parentElement.clientWidth
  const height = canvasRef.value.parentElement.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 8

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)

  // Create cube with rotation animation
  const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.x = -3
  scene.add(cube)

  // Create sphere with bouncing animation
  const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.x = 0
  scene.add(sphere)

  // Create torus with orbital animation
  const torusGeometry = new THREE.TorusGeometry(0.6, 0.3, 16, 100)
  const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xffe66d })
  torus = new THREE.Mesh(torusGeometry, torusMaterial)
  torus.position.x = 3
  scene.add(torus)

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

  const elapsedTime = clock.getElapsedTime()

  // Cube: Simple rotation
  cube.rotation.x = elapsedTime
  cube.rotation.y = elapsedTime * 0.5

  // Sphere: Bouncing animation using sine wave
  sphere.position.y = Math.sin(elapsedTime * 2) * 2

  // Torus: Orbital animation (circular path)
  const radius = 1.5
  torus.position.y = Math.sin(elapsedTime) * radius
  torus.position.z = Math.cos(elapsedTime) * radius
  torus.rotation.x = elapsedTime * 2

  // Camera: Slight movement for dynamic view
  camera.position.y = Math.sin(elapsedTime * 0.5) * 0.5

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
