<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import CodeViewer from '../components/CodeViewer.vue'
import guideContent from '../guides/chapter-11-guide.md?raw'
import sourceCode from './Chapter11.vue?raw'

// Reactive state
const canvasRef = ref(null)
const timeScale = ref(1)
const showOrbits = ref(true)
const selectedPlanetName = ref(null)
const isPaused = ref(false)

// Three.js objects
let scene, camera, renderer, controls, clock
let animationId
let raycaster, mouse

// Solar system data structure
const solarSystem = {
  sun: null,
  planets: [],
  orbitLines: [],
  asteroidBelt: null,
  starfield: null,
}

// Planet data with realistic properties (scaled for visualization)
const planetsData = [
  {
    name: 'Mercury',
    size: 0.4,
    color: 0x8c7853,
    orbitRadius: 40,
    orbitSpeed: 0.04,
    rotationSpeed: 0.002,
    angle: 0,
    tilt: 0.01,
    info: {
      diameter: '4,879 km',
      distance: '0.39 AU',
      orbitalPeriod: '88 days',
      rotationPeriod: '59 days',
      moons: 0,
    },
  },
  {
    name: 'Venus',
    size: 0.95,
    color: 0xffc649,
    orbitRadius: 70,
    orbitSpeed: 0.015,
    rotationSpeed: -0.001, // Retrograde rotation
    angle: Math.PI / 4,
    tilt: 0.05,
    info: {
      diameter: '12,104 km',
      distance: '0.72 AU',
      orbitalPeriod: '225 days',
      rotationPeriod: '243 days (retrograde)',
      moons: 0,
    },
  },
  {
    name: 'Earth',
    size: 1.0,
    color: 0x4a90e2,
    orbitRadius: 100,
    orbitSpeed: 0.01,
    rotationSpeed: 0.005,
    angle: Math.PI / 2,
    tilt: 0.41, // 23.5 degrees
    hasMoon: true,
    moonSize: 0.27,
    moonOrbitRadius: 3,
    moonOrbitSpeed: 0.03,
    moonAngle: 0,
    info: {
      diameter: '12,742 km',
      distance: '1.00 AU',
      orbitalPeriod: '365 days',
      rotationPeriod: '24 hours',
      moons: 1,
    },
  },
  {
    name: 'Mars',
    size: 0.53,
    color: 0xe27b58,
    orbitRadius: 150,
    orbitSpeed: 0.008,
    rotationSpeed: 0.004,
    angle: (3 * Math.PI) / 4,
    tilt: 0.44,
    info: {
      diameter: '6,779 km',
      distance: '1.52 AU',
      orbitalPeriod: '687 days',
      rotationPeriod: '25 hours',
      moons: 2,
    },
  },
  {
    name: 'Jupiter',
    size: 5.0,
    color: 0xdaa520,
    orbitRadius: 250,
    orbitSpeed: 0.004,
    rotationSpeed: 0.01,
    angle: Math.PI,
    tilt: 0.05,
    info: {
      diameter: '139,820 km',
      distance: '5.20 AU',
      orbitalPeriod: '12 years',
      rotationPeriod: '10 hours',
      moons: 79,
    },
  },
  {
    name: 'Saturn',
    size: 4.5,
    color: 0xf4e4c1,
    orbitRadius: 350,
    orbitSpeed: 0.003,
    rotationSpeed: 0.009,
    angle: (5 * Math.PI) / 4,
    tilt: 0.47,
    hasRings: true,
    info: {
      diameter: '116,460 km',
      distance: '9.54 AU',
      orbitalPeriod: '29 years',
      rotationPeriod: '11 hours',
      moons: 82,
    },
  },
  {
    name: 'Uranus',
    size: 2.0,
    color: 0x4fd5d6,
    orbitRadius: 420,
    orbitSpeed: 0.002,
    rotationSpeed: 0.007,
    angle: (3 * Math.PI) / 2,
    tilt: 1.71, // 98 degrees - extreme tilt
    info: {
      diameter: '50,724 km',
      distance: '19.19 AU',
      orbitalPeriod: '84 years',
      rotationPeriod: '17 hours',
      moons: 27,
    },
  },
  {
    name: 'Neptune',
    size: 1.95,
    color: 0x4166f5,
    orbitRadius: 480,
    orbitSpeed: 0.001,
    rotationSpeed: 0.008,
    angle: (7 * Math.PI) / 4,
    tilt: 0.49,
    info: {
      diameter: '49,244 km',
      distance: '30.07 AU',
      orbitalPeriod: '165 years',
      rotationPeriod: '16 hours',
      moons: 14,
    },
  },
]

const selectedPlanet = ref(null)

onMounted(() => {
  initThreeJS()
  createSun()
  createPlanets()
  createOrbitPaths()
  createAsteroidBelt()
  createStarfield()
  setupLighting()
  setupInteraction()
  animate()
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // Cleanup Three.js resources
  if (renderer) {
    renderer.dispose()
  }

  if (controls) {
    controls.dispose()
  }

  // Dispose geometries and materials
  scene?.traverse((object) => {
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

  // Remove event listeners
  window.removeEventListener('resize', onWindowResize)
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('click', onCanvasClick)
    canvasRef.value.removeEventListener('mousemove', onCanvasMouseMove)
  }
})

// Watch for orbit visibility changes
watch(showOrbits, (newValue) => {
  solarSystem.orbitLines.forEach((line) => {
    line.visible = newValue
  })
})

// Watch for pause state
watch(isPaused, (newValue) => {
  if (!newValue && clock) {
    clock.start()
  }
})

function initThreeJS() {
  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  // Create camera
  const width = canvasRef.value.parentElement.clientWidth
  const height = canvasRef.value.parentElement.clientHeight
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
  camera.position.set(150, 200, 150)
  camera.lookAt(0, 0, 0)

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  // Create OrbitControls
  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 20
  controls.maxDistance = 1000

  // Create clock
  clock = new THREE.Clock()

  // Raycaster for interaction
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Handle window resize
  window.addEventListener('resize', onWindowResize)
}

function createSun() {
  // Sun geometry
  const sunGeometry = new THREE.SphereGeometry(10, 32, 32)
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xfdb813,
    emissive: 0xfdb813,
    emissiveIntensity: 1,
  })
  const sun = new THREE.Mesh(sunGeometry, sunMaterial)
  sun.name = 'Sun'
  scene.add(sun)
  solarSystem.sun = sun

  // Sun glow effect
  const glowGeometry = new THREE.SphereGeometry(12, 32, 32)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0.3,
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  sun.add(glow)
}

function createPlanets() {
  planetsData.forEach((planetData) => {
    // Create planet mesh
    const geometry = new THREE.SphereGeometry(planetData.size, 32, 32)
    const material = new THREE.MeshStandardMaterial({
      color: planetData.color,
      roughness: 0.7,
      metalness: 0.3,
    })
    const planet = new THREE.Mesh(geometry, material)

    // Set initial position
    planet.position.x = Math.cos(planetData.angle) * planetData.orbitRadius
    planet.position.z = Math.sin(planetData.angle) * planetData.orbitRadius

    // Apply axial tilt
    planet.rotation.z = planetData.tilt

    // Enable shadows
    planet.castShadow = true
    planet.receiveShadow = true

    // Store planet data
    planet.userData = { planetData }
    planet.name = planetData.name

    scene.add(planet)

    // Store reference
    const planetObj = {
      mesh: planet,
      data: planetData,
    }

    // Create moon if applicable
    if (planetData.hasMoon) {
      const moonGeometry = new THREE.SphereGeometry(planetData.moonSize, 16, 16)
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.9,
      })
      const moon = new THREE.Mesh(moonGeometry, moonMaterial)
      moon.castShadow = true
      moon.receiveShadow = true
      moon.position.x = planetData.moonOrbitRadius
      planetObj.moon = moon
      planetObj.moonData = {
        orbitRadius: planetData.moonOrbitRadius,
        orbitSpeed: planetData.moonOrbitSpeed,
        angle: planetData.moonAngle,
      }
      scene.add(moon)
    }

    // Create rings if applicable (Saturn)
    if (planetData.hasRings) {
      const ringGeometry = new THREE.RingGeometry(
        planetData.size * 1.5,
        planetData.size * 2.5,
        64
      )
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xc9b777,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        roughness: 0.9,
      })
      const rings = new THREE.Mesh(ringGeometry, ringMaterial)
      rings.rotation.x = Math.PI / 2
      planet.add(rings)
    }

    solarSystem.planets.push(planetObj)
  })
}

function createOrbitPaths() {
  planetsData.forEach((planetData) => {
    const curve = new THREE.EllipseCurve(
      0,
      0,
      planetData.orbitRadius,
      planetData.orbitRadius,
      0,
      2 * Math.PI,
      false,
      0
    )

    const points = curve.getPoints(128)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.3,
    })

    const orbitLine = new THREE.Line(geometry, material)
    orbitLine.rotation.x = Math.PI / 2
    orbitLine.visible = showOrbits.value
    scene.add(orbitLine)

    solarSystem.orbitLines.push(orbitLine)
  })
}

function createAsteroidBelt() {
  // Asteroid belt between Mars and Jupiter
  const asteroidCount = 800
  const asteroidGeometry = new THREE.DodecahedronGeometry(0.3, 0)
  const asteroidMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b7355,
    roughness: 1,
  })

  const asteroidBelt = new THREE.InstancedMesh(
    asteroidGeometry,
    asteroidMaterial,
    asteroidCount
  )

  const dummy = new THREE.Object3D()
  const asteroidData = []

  for (let i = 0; i < asteroidCount; i++) {
    // Random orbit radius between Mars and Jupiter
    const orbitRadius = 180 + Math.random() * 40
    const angle = Math.random() * Math.PI * 2
    const yOffset = (Math.random() - 0.5) * 5

    dummy.position.x = Math.cos(angle) * orbitRadius
    dummy.position.y = yOffset
    dummy.position.z = Math.sin(angle) * orbitRadius

    // Random rotation
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

    // Random scale
    const scale = 0.5 + Math.random() * 1.5
    dummy.scale.set(scale, scale, scale)

    dummy.updateMatrix()
    asteroidBelt.setMatrixAt(i, dummy.matrix)

    // Store orbit data
    asteroidData.push({
      orbitRadius,
      angle,
      orbitSpeed: 0.002 + Math.random() * 0.001,
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ),
    })
  }

  scene.add(asteroidBelt)
  solarSystem.asteroidBelt = { mesh: asteroidBelt, data: asteroidData }
}

function createStarfield() {
  const starCount = 5000
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  for (let i = 0; i < starCount; i++) {
    // Random position in a large sphere
    const radius = 2000 + Math.random() * 1000
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    positions.push(x, y, z)

    // Slightly varied star colors (white to pale blue)
    const color = new THREE.Color()
    color.setHSL(0.6, Math.random() * 0.3, 0.8 + Math.random() * 0.2)
    colors.push(color.r, color.g, color.b)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  })

  const stars = new THREE.Points(geometry, material)
  scene.add(stars)
  solarSystem.starfield = stars
}

function setupLighting() {
  // Ambient light for subtle fill
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)

  // Point light at sun position
  const sunLight = new THREE.PointLight(0xffffff, 2, 2000)
  sunLight.position.set(0, 0, 0)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.width = 2048
  sunLight.shadow.mapSize.height = 2048
  sunLight.shadow.camera.near = 0.5
  sunLight.shadow.camera.far = 1000
  scene.add(sunLight)
}

function setupInteraction() {
  canvasRef.value.addEventListener('click', onCanvasClick)
  canvasRef.value.addEventListener('mousemove', onCanvasMouseMove)
}

function onCanvasClick(event) {
  updateMousePosition(event)

  raycaster.setFromCamera(mouse, camera)
  const planetMeshes = solarSystem.planets.map((p) => p.mesh)
  const intersects = raycaster.intersectObjects(planetMeshes)

  if (intersects.length > 0) {
    const clickedPlanet = intersects[0].object
    const planetData = clickedPlanet.userData.planetData

    selectedPlanet.value = planetData
    selectedPlanetName.value = planetData.name
    focusOnPlanet(clickedPlanet, planetData)
  } else {
    selectedPlanet.value = null
    selectedPlanetName.value = null
  }
}

function onCanvasMouseMove(event) {
  updateMousePosition(event)

  raycaster.setFromCamera(mouse, camera)
  const planetMeshes = solarSystem.planets.map((p) => p.mesh)
  const intersects = raycaster.intersectObjects(planetMeshes)

  // Reset all planet emissive
  solarSystem.planets.forEach((p) => {
    p.mesh.material.emissive.setHex(0x000000)
  })

  if (intersects.length > 0) {
    const hoveredPlanet = intersects[0].object
    hoveredPlanet.material.emissive.setHex(0x222222)
    canvasRef.value.style.cursor = 'pointer'
  } else {
    canvasRef.value.style.cursor = 'default'
  }
}

function updateMousePosition(event) {
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
}

function focusOnPlanet(planetMesh, planetData) {
  const distance = planetData.size * 8
  const targetPosition = new THREE.Vector3(
    planetMesh.position.x + distance,
    distance * 0.5,
    planetMesh.position.z + distance
  )

  // Smoothly move camera (simple linear interpolation)
  const startPosition = camera.position.clone()
  const startTarget = controls.target.clone()
  const duration = 1500 // ms
  const startTime = Date.now()

  function animateCamera() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Ease in-out
    const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress

    camera.position.lerpVectors(startPosition, targetPosition, eased)
    controls.target.lerpVectors(startTarget, planetMesh.position, eased)

    if (progress < 1) {
      requestAnimationFrame(animateCamera)
    }
  }

  animateCamera()
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

  if (!isPaused.value) {
    const delta = clock.getDelta()
    const scaledDelta = delta * timeScale.value

    // Rotate sun
    if (solarSystem.sun) {
      solarSystem.sun.rotation.y += 0.001 * scaledDelta
    }

    // Animate planets
    solarSystem.planets.forEach((planetObj) => {
      const planet = planetObj.mesh
      const data = planetObj.data

      // Orbital revolution
      data.angle += data.orbitSpeed * scaledDelta
      planet.position.x = Math.cos(data.angle) * data.orbitRadius
      planet.position.z = Math.sin(data.angle) * data.orbitRadius

      // Axial rotation
      planet.rotation.y += data.rotationSpeed * scaledDelta

      // Animate moon
      if (planetObj.moon) {
        const moonData = planetObj.moonData
        moonData.angle += moonData.orbitSpeed * scaledDelta

        planetObj.moon.position.x =
          planet.position.x + Math.cos(moonData.angle) * moonData.orbitRadius
        planetObj.moon.position.z =
          planet.position.z + Math.sin(moonData.angle) * moonData.orbitRadius

        planetObj.moon.rotation.y += 0.01 * scaledDelta
      }
    })

    // Animate asteroid belt
    if (solarSystem.asteroidBelt) {
      const asteroidBelt = solarSystem.asteroidBelt.mesh
      const asteroidData = solarSystem.asteroidBelt.data
      const dummy = new THREE.Object3D()

      asteroidData.forEach((asteroid, i) => {
        // Update orbit angle
        asteroid.angle += asteroid.orbitSpeed * scaledDelta

        dummy.position.x = Math.cos(asteroid.angle) * asteroid.orbitRadius
        dummy.position.y = asteroidBelt.instanceMatrix.array[i * 16 + 13] // Keep y position
        dummy.position.z = Math.sin(asteroid.angle) * asteroid.orbitRadius

        // Update rotation
        dummy.rotation.x += asteroid.rotationSpeed.x * scaledDelta
        dummy.rotation.y += asteroid.rotationSpeed.y * scaledDelta
        dummy.rotation.z += asteroid.rotationSpeed.z * scaledDelta

        // Get scale from existing matrix
        const scale = Math.cbrt(
          asteroidBelt.instanceMatrix.array[i * 16] *
            asteroidBelt.instanceMatrix.array[i * 16 + 5] *
            asteroidBelt.instanceMatrix.array[i * 16 + 10]
        )
        dummy.scale.set(scale, scale, scale)

        dummy.updateMatrix()
        asteroidBelt.setMatrixAt(i, dummy.matrix)
      })

      asteroidBelt.instanceMatrix.needsUpdate = true
    }
  }

  controls.update()
  renderer.render(scene, camera)
}

function resetCamera() {
  camera.position.set(150, 200, 150)
  controls.target.set(0, 0, 0)
  selectedPlanet.value = null
  selectedPlanetName.value = null
}
</script>

<template>
  <ChapterLayout>
    <template #canvas>
      <div class="solar-system-container">
        <canvas ref="canvasRef"></canvas>

        <!-- UI Controls Overlay -->
        <div class="controls-panel">
          <div class="control-section">
            <h4>Controls</h4>

            <div class="control-group">
              <label>Speed: {{ timeScale }}x</label>
              <input
                type="range"
                v-model.number="timeScale"
                min="0"
                max="50"
                step="0.5"
                class="slider"
              />
            </div>

            <div class="control-group">
              <button @click="isPaused = !isPaused" class="control-button">
                {{ isPaused ? '▶ Resume' : '⏸ Pause' }}
              </button>
            </div>

            <div class="control-group">
              <button @click="resetCamera" class="control-button">↺ Reset Camera</button>
            </div>
          </div>

          <div class="control-section">
            <h4>Display</h4>

            <div class="control-group checkbox-group">
              <label>
                <input type="checkbox" v-model="showOrbits" />
                Show Orbit Paths
              </label>
            </div>
          </div>
        </div>

        <!-- Planet Info Panel -->
        <div v-if="selectedPlanet" class="info-panel">
          <button @click="selectedPlanet = null" class="close-button">×</button>
          <h3>{{ selectedPlanet.name }}</h3>
          <div class="info-content">
            <div class="info-row">
              <span class="info-label">Diameter:</span>
              <span>{{ selectedPlanet.info.diameter }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Distance from Sun:</span>
              <span>{{ selectedPlanet.info.distance }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Orbital Period:</span>
              <span>{{ selectedPlanet.info.orbitalPeriod }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Rotation Period:</span>
              <span>{{ selectedPlanet.info.rotationPeriod }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Moons:</span>
              <span>{{ selectedPlanet.info.moons }}</span>
            </div>
          </div>
        </div>

        <!-- Instructions Hint -->
        <div class="hint-panel">
          <p>🖱️ Click on planets to learn more • Drag to rotate • Scroll to zoom</p>
        </div>
      </div>
    </template>

    <template #guide>
      <MarkdownViewer :content="guideContent" />
    </template>

    <template #code>
      <CodeViewer :code="sourceCode" title="Chapter 11: Solar System - Full Source Code" />
    </template>
  </ChapterLayout>
</template>

<style scoped>
.solar-system-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.controls-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.85);
  padding: 15px;
  border-radius: 8px;
  color: white;
  min-width: 200px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-section {
  margin-bottom: 15px;
}

.control-section:last-child {
  margin-bottom: 0;
}

.control-section h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #42b883;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.control-group {
  margin-bottom: 12px;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 5px;
  color: #ddd;
}

.slider {
  width: 100%;
  cursor: pointer;
}

.control-button {
  width: 100%;
  padding: 8px 12px;
  background: linear-gradient(135deg, #42b883 0%, #35945f 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.control-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}

.control-button:active {
  transform: translateY(0);
}

.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-group input[type='checkbox'] {
  margin-right: 8px;
  cursor: pointer;
}

.info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 8px;
  color: white;
  min-width: 280px;
  max-width: 350px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-panel h3 {
  margin: 0 0 15px 0;
  color: #42b883;
  font-size: 1.5rem;
  border-bottom: 2px solid #42b883;
  padding-bottom: 8px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px 10px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

.info-content {
  font-size: 0.9rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #42b883;
  margin-right: 10px;
}

.hint-panel {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hint-panel p {
  margin: 0;
}

@media (max-width: 768px) {
  .controls-panel {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
  }

  .info-panel {
    bottom: 10px;
    left: 10px;
    right: 10px;
    min-width: auto;
    max-width: none;
  }

  .hint-panel {
    display: none;
  }
}
</style>
