<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import guideContent from '../guides/chapter-03-guide.md?raw'

const canvasRef = ref(null)
let scene, camera, renderer
let meshes = []
let animationId

onMounted(() => {
  initThreeJS()
  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  meshes.forEach((mesh) => {
    mesh.geometry.dispose()
    mesh.material.dispose()
  })
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

  const geometry = new THREE.SphereGeometry(0.8, 32, 32)

  // MeshBasicMaterial - No lighting needed
  const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b })
  const basicSphere = new THREE.Mesh(geometry, basicMaterial)
  basicSphere.position.set(-3, 2, 0)
  scene.add(basicSphere)
  meshes.push(basicSphere)

  // MeshNormalMaterial - Rainbow colors based on normals
  const normalMaterial = new THREE.MeshNormalMaterial()
  const normalSphere = new THREE.Mesh(geometry, normalMaterial)
  normalSphere.position.set(0, 2, 0)
  scene.add(normalSphere)
  meshes.push(normalSphere)

  // MeshStandardMaterial - Requires lighting (will add light)
  const standardMaterial = new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    roughness: 0.5,
    metalness: 0.5,
  })
  const standardSphere = new THREE.Mesh(geometry, standardMaterial)
  standardSphere.position.set(3, 2, 0)
  scene.add(standardSphere)
  meshes.push(standardSphere)

  // Wireframe material
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe66d,
    wireframe: true,
  })
  const wireframeSphere = new THREE.Mesh(geometry, wireframeMaterial)
  wireframeSphere.position.set(-3, -2, 0)
  scene.add(wireframeSphere)
  meshes.push(wireframeSphere)

  // Transparent material
  const transparentMaterial = new THREE.MeshBasicMaterial({
    color: 0xa8e6cf,
    transparent: true,
    opacity: 0.6,
  })
  const transparentSphere = new THREE.Mesh(geometry, transparentMaterial)
  transparentSphere.position.set(0, -2, 0)
  scene.add(transparentSphere)
  meshes.push(transparentSphere)

  // MeshPhongMaterial - Shiny/glossy
  const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xff8b94,
    shininess: 100,
  })
  const phongSphere = new THREE.Mesh(geometry, phongMaterial)
  phongSphere.position.set(3, -2, 0)
  scene.add(phongSphere)
  meshes.push(phongSphere)

  // Add lights for materials that need them
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

  // Rotate all spheres
  meshes.forEach((mesh) => {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01
  })

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
