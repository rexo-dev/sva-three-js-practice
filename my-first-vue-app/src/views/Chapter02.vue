<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import CodeViewer from '../components/CodeViewer.vue'
import guideContent from '../guides/chapter-02-guide.md?raw'
import sourceCode from './Chapter02.vue?raw'

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

  // Create different geometries
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: false })

  // Box
  const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const box = new THREE.Mesh(boxGeometry, material.clone())
  box.position.set(-4, 2, 0)
  scene.add(box)
  meshes.push(box)

  // Sphere
  const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32)
  const sphere = new THREE.Mesh(sphereGeometry, material.clone())
  sphere.position.set(0, 2, 0)
  sphere.material.color.setHex(0xff6b6b)
  scene.add(sphere)
  meshes.push(sphere)

  // Cone
  const coneGeometry = new THREE.ConeGeometry(0.8, 1.5, 32)
  const cone = new THREE.Mesh(coneGeometry, material.clone())
  cone.position.set(4, 2, 0)
  cone.material.color.setHex(0x4ecdc4)
  scene.add(cone)
  meshes.push(cone)

  // Cylinder
  const cylinderGeometry = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 32)
  const cylinder = new THREE.Mesh(cylinderGeometry, material.clone())
  cylinder.position.set(-4, -1.5, 0)
  cylinder.material.color.setHex(0xffe66d)
  scene.add(cylinder)
  meshes.push(cylinder)

  // Torus
  const torusGeometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100)
  const torus = new THREE.Mesh(torusGeometry, material.clone())
  torus.position.set(0, -1.5, 0)
  torus.material.color.setHex(0xa8e6cf)
  scene.add(torus)
  meshes.push(torus)

  // Plane
  const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5)
  const plane = new THREE.Mesh(planeGeometry, material.clone())
  plane.position.set(4, -1.5, 0)
  plane.material.color.setHex(0xff8b94)
  plane.material.side = THREE.DoubleSide
  scene.add(plane)
  meshes.push(plane)

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

  // Rotate all shapes
  meshes.forEach((mesh, index) => {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01
    // Make some shapes rotate differently for variety
    if (index % 2 === 0) {
      mesh.rotation.z += 0.005
    }
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
    <template #code>
      <CodeViewer :code="sourceCode" title="Chapter 2: Geometries - Full Source Code" />
    </template>
  </ChapterLayout>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
