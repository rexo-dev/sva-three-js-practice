<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import CodeViewer from '../components/CodeViewer.vue'
import guideContent from '../guides/chapter-05-guide.md?raw'
import sourceCode from './Chapter05.vue?raw'

const canvasRef = ref(null)
let scene, camera, renderer
let sphere, lights
let animationId

onMounted(() => {
  initThreeJS()
  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (sphere) {
    sphere.geometry.dispose()
    sphere.material.dispose()
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
  camera.position.z = 8

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)

  // Create central sphere
  const geometry = new THREE.SphereGeometry(1.5, 64, 64)
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
    metalness: 0.3,
  })
  sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)

  // Add a ground plane
  const planeGeometry = new THREE.PlaneGeometry(20, 20)
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -2
  scene.add(plane)

  // Ambient light - soft overall illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  // Directional light - like sunlight (red)
  const directionalLight = new THREE.DirectionalLight(0xff0000, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Point light - like a light bulb (blue)
  const pointLight = new THREE.PointLight(0x0000ff, 1, 10)
  pointLight.position.set(-3, 2, 2)
  scene.add(pointLight)

  // Spot light - like a flashlight (green)
  const spotLight = new THREE.SpotLight(0x00ff00, 1)
  spotLight.position.set(0, 5, 0)
  spotLight.angle = Math.PI / 6
  spotLight.penumbra = 0.2
  spotLight.target = sphere
  scene.add(spotLight)

  // Store lights for animation
  lights = { pointLight, spotLight, directionalLight }

  // Add light helpers (visual indicators)
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
  scene.add(pointLightHelper)

  const spotLightHelper = new THREE.SpotLightHelper(spotLight)
  scene.add(spotLightHelper)

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

  const time = Date.now() * 0.001

  // Animate point light in a circle
  lights.pointLight.position.x = Math.cos(time) * 4
  lights.pointLight.position.z = Math.sin(time) * 4

  // Animate spot light
  lights.spotLight.position.x = Math.sin(time * 0.7) * 3

  sphere.rotation.y += 0.005

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
      <CodeViewer :code="sourceCode" title="Chapter 5: Lighting - Full Source Code" />
    </template>
  </ChapterLayout>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
