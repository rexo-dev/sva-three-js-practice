<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import CodeViewer from '../components/CodeViewer.vue'
import guideContent from '../guides/chapter-04-guide.md?raw'
import sourceCode from './Chapter04.vue?raw'

const canvasRef = ref(null)
let scene, camera, renderer, cube, plane
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
  camera.position.z = 5

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)

  // Create texture using canvas (procedural texture)
  const textureCanvas = document.createElement('canvas')
  textureCanvas.width = 256
  textureCanvas.height = 256
  const ctx = textureCanvas.getContext('2d')

  // Draw a checkerboard pattern
  const squareSize = 32
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? '#ff6b6b' : '#4ecdc4'
      ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
    }
  }

  const texture = new THREE.CanvasTexture(textureCanvas)

  // Create textured cube
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
  const cubeMaterial = new THREE.MeshBasicMaterial({ map: texture })
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.y = 1
  scene.add(cube)

  // Create a second texture with different wrapping
  const texture2 = texture.clone()
  texture2.wrapS = THREE.RepeatWrapping
  texture2.wrapT = THREE.RepeatWrapping
  texture2.repeat.set(3, 3)
  texture2.needsUpdate = true

  // Create textured plane
  const planeGeometry = new THREE.PlaneGeometry(4, 4)
  const planeMaterial = new THREE.MeshBasicMaterial({ map: texture2, side: THREE.DoubleSide })
  plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.y = -2
  plane.rotation.x = -Math.PI / 4
  scene.add(plane)

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

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

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
      <CodeViewer :code="sourceCode" title="Chapter 4: Textures - Full Source Code" />
    </template>
  </ChapterLayout>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
