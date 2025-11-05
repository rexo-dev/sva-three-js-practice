<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import CodeViewer from '../components/CodeViewer.vue'
import guideContent from '../guides/chapter-08-guide.md?raw'
import sourceCode from './Chapter08.vue?raw'

const canvasRef = ref(null)
let scene, camera, renderer, controls
let cube, sphere, plane, directionalLight
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
  if (sphere) {
    sphere.geometry.dispose()
    sphere.material.dispose()
  }
  if (plane) {
    plane.geometry.dispose()
    plane.material.dispose()
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
  camera.position.set(5, 5, 5)

  // Create renderer with shadow support
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Create OrbitControls
  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true

  // Create a ground plane to receive shadows
  const planeGeometry = new THREE.PlaneGeometry(10, 10)
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
  plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -Math.PI / 2
  plane.position.y = -1
  plane.receiveShadow = true
  scene.add(plane)

  // Create cube that casts shadows
  const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(-2, 0.75, 0)
  cube.castShadow = true
  cube.receiveShadow = true
  scene.add(cube)

  // Create sphere that casts shadows
  const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(2, 0.8, 0)
  sphere.castShadow = true
  sphere.receiveShadow = true
  scene.add(sphere)

  // Add ambient light (soft overall illumination)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  // Add directional light with shadows
  directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 8, 3)
  directionalLight.castShadow = true

  // Configure shadow properties
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10

  scene.add(directionalLight)

  // Add light helper
  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
  scene.add(directionalLightHelper)

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

  // Animate cube
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  // Animate sphere (bouncing)
  sphere.position.y = 0.8 + Math.abs(Math.sin(time * 2)) * 1.5

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
      <CodeViewer :code="sourceCode" title="Chapter 8: Shadows - Full Source Code" />
    </template>
  </ChapterLayout>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
