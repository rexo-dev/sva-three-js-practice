<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import guideContent from '../guides/chapter-10-guide.md?raw'

const canvasRef = ref(null)
let scene, camera, renderer, controls, raycaster, mouse
let cubes = []
let selectedObject = null
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
  cubes.forEach((cube) => {
    cube.geometry.dispose()
    cube.material.dispose()
  })
  if (renderer) {
    renderer.dispose()
  }
  window.removeEventListener('resize', onWindowResize)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('click', onClick)
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

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)

  // Create OrbitControls
  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true

  // Create raycaster and mouse vector
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Create a grid of interactive cubes
  const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf, 0xff8b94, 0xc7ceea]
  for (let i = 0; i < 6; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: colors[i] })
    const cube = new THREE.Mesh(geometry, material)

    const angle = (i / 6) * Math.PI * 2
    const radius = 3
    cube.position.x = Math.cos(angle) * radius
    cube.position.z = Math.sin(angle) * radius
    cube.position.y = 0.5

    cube.userData = { originalColor: colors[i], originalY: 0.5 }

    scene.add(cube)
    cubes.push(cube)
  }

  // Add ground plane
  const planeGeometry = new THREE.PlaneGeometry(15, 15)
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -Math.PI / 2
  scene.add(plane)

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // Add event listeners
  window.addEventListener('resize', onWindowResize)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('click', onClick)
}

function onMouseMove(event) {
  const rect = canvasRef.value.getBoundingClientRect()

  // Calculate mouse position in normalized device coordinates (-1 to +1)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // Update raycaster
  raycaster.setFromCamera(mouse, camera)

  // Check for intersections
  const intersects = raycaster.intersectObjects(cubes)

  // Reset all cubes
  cubes.forEach((cube) => {
    if (cube !== selectedObject) {
      cube.material.color.setHex(cube.userData.originalColor)
      cube.position.y = cube.userData.originalY
      cube.scale.set(1, 1, 1)
    }
  })

  // Highlight hovered cube
  if (intersects.length > 0) {
    const hoveredCube = intersects[0].object
    if (hoveredCube !== selectedObject) {
      hoveredCube.material.color.setHex(0xffffff)
      hoveredCube.position.y = cube.userData.originalY + 0.2
      hoveredCube.scale.set(1.1, 1.1, 1.1)
    }
    canvasRef.value.style.cursor = 'pointer'
  } else {
    canvasRef.value.style.cursor = 'default'
  }
}

function onClick() {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cubes)

  if (intersects.length > 0) {
    // Reset previously selected object
    if (selectedObject) {
      selectedObject.position.y = selectedObject.userData.originalY
      selectedObject.scale.set(1, 1, 1)
    }

    // Select new object
    selectedObject = intersects[0].object
    selectedObject.material.color.setHex(0xff00ff)
    selectedObject.position.y = selectedObject.userData.originalY + 0.5
    selectedObject.scale.set(1.2, 1.2, 1.2)
  } else {
    // Deselect if clicking on empty space
    if (selectedObject) {
      selectedObject.material.color.setHex(selectedObject.userData.originalColor)
      selectedObject.position.y = selectedObject.userData.originalY
      selectedObject.scale.set(1, 1, 1)
      selectedObject = null
    }
  }
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

  // Rotate selected object
  if (selectedObject) {
    selectedObject.rotation.y += 0.02
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
  </ChapterLayout>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
