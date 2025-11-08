<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
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

// Scale factors for better visibility
const sunScale = ref(3)
const planetScale = ref(4)
const moonScale = ref(6)

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
    baseSize: 0.38,
    color: 0x8c7853,
    glowColor: 0xa89968,
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
    baseSize: 0.95,
    color: 0xffc649,
    glowColor: 0xffd97d,
    orbitRadius: 70,
    orbitSpeed: 0.015,
    rotationSpeed: -0.001,
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
    baseSize: 1.0,
    color: 0x2196f3,
    glowColor: 0x64b5f6,
    orbitRadius: 100,
    orbitSpeed: 0.01,
    rotationSpeed: 0.005,
    angle: Math.PI / 2,
    tilt: 0.41,
    hasMoon: true,
    moonBaseSize: 0.27,
    moonColor: 0xaaaaaa,
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
    baseSize: 0.53,
    color: 0xdc4c3e,
    glowColor: 0xe57373,
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
    baseSize: 5.0,
    color: 0xd4a574,
    glowColor: 0xe0b887,
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
    baseSize: 4.5,
    color: 0xfad5a5,
    glowColor: 0xfce4c4,
    orbitRadius: 350,
    orbitSpeed: 0.003,
    rotationSpeed: 0.009,
    angle: (5 * Math.PI) / 4,
    tilt: 0.47,
    hasRings: true,
    ringColor: 0xc9b777,
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
    baseSize: 2.0,
    color: 0x4fc3f7,
    glowColor: 0x81d4fa,
    orbitRadius: 420,
    orbitSpeed: 0.002,
    rotationSpeed: 0.007,
    angle: (3 * Math.PI) / 2,
    tilt: 1.71,
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
    baseSize: 1.95,
    color: 0x304ffe,
    glowColor: 0x5c6bc0,
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

// Planet icons mapping
const planetIcons = {
  Sun: '☀️',
  Mercury: '☿️',
  Venus: '♀️',
  Earth: '🌍',
  Mars: '♂️',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Moon: '🌙',
}

// Computed celestial body list
const celestialBodies = computed(() => {
  const bodies = [{ name: 'Sun', type: 'star', icon: planetIcons.Sun }]
  planetsData.forEach((planet) => {
    bodies.push({ name: planet.name, type: 'planet', data: planet, icon: planetIcons[planet.name] })
    if (planet.hasMoon) {
      bodies.push({
        name: `${planet.name}'s Moon`,
        type: 'moon',
        parent: planet.name,
        icon: planetIcons.Moon,
      })
    }
  })
  return bodies
})

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

  if (renderer) {
    renderer.dispose()
  }

  if (controls) {
    controls.dispose()
  }

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

// Watch for scale changes
watch([sunScale, planetScale, moonScale], () => {
  updateScales()
})

// Watch for pause state
watch(isPaused, (newValue) => {
  if (!newValue && clock) {
    clock.start()
  }
})

function initThreeJS() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000011)

  const container = canvasRef.value.parentElement
  const width = container.clientWidth
  const height = container.clientHeight
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000)
  camera.position.set(150, 200, 150)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  controls = new OrbitControls(camera, canvasRef.value)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 20
  controls.maxDistance = 1500

  clock = new THREE.Clock()

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  window.addEventListener('resize', onWindowResize)

  // Watch for parent container resize
  const resizeObserver = new ResizeObserver(() => {
    onWindowResize()
  })
  resizeObserver.observe(container)
}

function createSun() {
  const sunGeometry = new THREE.SphereGeometry(10, 32, 32)
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00, // Brighter yellow
    emissive: 0xffff00,
    emissiveIntensity: 1.5, // Increased intensity
  })
  const sun = new THREE.Mesh(sunGeometry, sunMaterial)
  sun.name = 'Sun'
  sun.userData = { isSun: true }
  scene.add(sun)
  solarSystem.sun = sun

  // Sun glow effect - brighter and larger
  const glowGeometry = new THREE.SphereGeometry(13, 32, 32)
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
    transparent: true,
    opacity: 0.5, // Increased opacity for more visible glow
  })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  sun.add(glow)
}

function createPlanets() {
  planetsData.forEach((planetData) => {
    const size = planetData.baseSize * planetScale.value
    const geometry = new THREE.SphereGeometry(size, 32, 32)
    const material = new THREE.MeshStandardMaterial({
      color: planetData.color,
      emissive: planetData.glowColor,
      emissiveIntensity: 0.3, // Increased from 0.1 for better visibility
      roughness: 0.5, // Reduced for more shine
      metalness: 0.4, // Increased for more reflectivity
    })
    const planet = new THREE.Mesh(geometry, material)

    planet.position.x = Math.cos(planetData.angle) * planetData.orbitRadius
    planet.position.z = Math.sin(planetData.angle) * planetData.orbitRadius

    planet.rotation.z = planetData.tilt

    planet.castShadow = true
    planet.receiveShadow = true

    planet.userData = { planetData, baseSize: planetData.baseSize }
    planet.name = planetData.name

    scene.add(planet)

    const planetObj = {
      mesh: planet,
      data: planetData,
    }

    // Create moon if applicable
    if (planetData.hasMoon) {
      const moonSize = planetData.moonBaseSize * moonScale.value
      const moonGeometry = new THREE.SphereGeometry(moonSize, 16, 16)
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: planetData.moonColor,
        roughness: 0.9,
      })
      const moon = new THREE.Mesh(moonGeometry, moonMaterial)
      moon.castShadow = true
      moon.receiveShadow = true
      moon.position.x = planetData.moonOrbitRadius
      moon.name = `${planetData.name}'s Moon`
      moon.userData = { isMoon: true, parentPlanet: planetData.name, baseMoonSize: planetData.moonBaseSize }

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
      const ringGeometry = new THREE.RingGeometry(size * 1.5, size * 2.5, 64)
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: planetData.ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 0.9,
      })
      const rings = new THREE.Mesh(ringGeometry, ringMaterial)
      rings.rotation.x = Math.PI / 2
      rings.name = 'rings'
      planet.add(rings)
      planetObj.rings = rings
    }

    solarSystem.planets.push(planetObj)
  })
}

function updateScales() {
  // Update sun scale
  if (solarSystem.sun) {
    const newSunScale = 10 * sunScale.value
    solarSystem.sun.scale.set(1, 1, 1)
    solarSystem.sun.geometry.dispose()
    solarSystem.sun.geometry = new THREE.SphereGeometry(newSunScale, 32, 32)

    // Update sun glow
    const glow = solarSystem.sun.children[0]
    if (glow) {
      glow.geometry.dispose()
      glow.geometry = new THREE.SphereGeometry(newSunScale * 1.2, 32, 32)
    }
  }

  // Update planet scales
  solarSystem.planets.forEach((planetObj) => {
    const planet = planetObj.mesh
    const baseSize = planet.userData.baseSize
    const newSize = baseSize * planetScale.value

    planet.geometry.dispose()
    planet.geometry = new THREE.SphereGeometry(newSize, 32, 32)

    // Update rings if present
    if (planetObj.rings) {
      planetObj.rings.geometry.dispose()
      planetObj.rings.geometry = new THREE.RingGeometry(newSize * 1.5, newSize * 2.5, 64)
    }

    // Update moon if present
    if (planetObj.moon) {
      const baseMoonSize = planetObj.moon.userData.baseMoonSize
      const newMoonSize = baseMoonSize * moonScale.value
      planetObj.moon.geometry.dispose()
      planetObj.moon.geometry = new THREE.SphereGeometry(newMoonSize, 16, 16)
    }
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
      color: planetData.glowColor,
      transparent: true,
      opacity: 0.25,
    })

    const orbitLine = new THREE.Line(geometry, material)
    orbitLine.rotation.x = Math.PI / 2
    orbitLine.visible = showOrbits.value
    scene.add(orbitLine)

    solarSystem.orbitLines.push(orbitLine)
  })
}

function createAsteroidBelt() {
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
    const orbitRadius = 180 + Math.random() * 40
    const angle = Math.random() * Math.PI * 2
    const yOffset = (Math.random() - 0.5) * 5

    dummy.position.x = Math.cos(angle) * orbitRadius
    dummy.position.y = yOffset
    dummy.position.z = Math.sin(angle) * orbitRadius

    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

    const scale = 0.5 + Math.random() * 1.5
    dummy.scale.set(scale, scale, scale)

    dummy.updateMatrix()
    asteroidBelt.setMatrixAt(i, dummy.matrix)

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
  const starCount = 8000
  const geometry = new THREE.BufferGeometry()
  const positions = []
  const colors = []

  for (let i = 0; i < starCount; i++) {
    const radius = 2000 + Math.random() * 1500
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)

    const x = radius * Math.sin(phi) * Math.cos(theta)
    const y = radius * Math.sin(phi) * Math.sin(theta)
    const z = radius * Math.cos(phi)

    positions.push(x, y, z)

    const color = new THREE.Color()
    const hue = 0.55 + Math.random() * 0.15
    const saturation = Math.random() * 0.3
    const lightness = 0.7 + Math.random() * 0.3
    color.setHSL(hue, saturation, lightness)
    colors.push(color.r, color.g, color.b)
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  })

  const stars = new THREE.Points(geometry, material)
  scene.add(stars)
  solarSystem.starfield = stars
}

function setupLighting() {
  // Increased ambient light for better visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  // Brighter sun light
  const sunLight = new THREE.PointLight(0xffffcc, 3.5, 3000)
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

  // Check for sun click
  if (solarSystem.sun) {
    const sunIntersects = raycaster.intersectObject(solarSystem.sun)
    if (sunIntersects.length > 0) {
      focusOnSun()
      selectedPlanet.value = null
      selectedPlanetName.value = 'Sun'
      return
    }
  }

  // Check for planet clicks
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
  const allObjects = solarSystem.sun ? [solarSystem.sun, ...planetMeshes] : planetMeshes
  const intersects = raycaster.intersectObjects(allObjects)

  // Reset all emissive
  solarSystem.planets.forEach((p) => {
    p.mesh.material.emissiveIntensity = 0.1
  })

  if (intersects.length > 0) {
    const hovered = intersects[0].object
    if (!hovered.userData.isSun) {
      hovered.material.emissiveIntensity = 0.3
    }
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

function focusOnSun() {
  const targetPosition = new THREE.Vector3(100, 80, 100)
  animateCameraTo(targetPosition, new THREE.Vector3(0, 0, 0))
}

function focusOnPlanet(planetMesh, planetData) {
  const distance = planetData.baseSize * planetScale.value * 8
  const targetPosition = new THREE.Vector3(
    planetMesh.position.x + distance,
    distance * 0.5,
    planetMesh.position.z + distance
  )
  animateCameraTo(targetPosition, planetMesh.position)
}

function focusOnBody(bodyName) {
  if (bodyName === 'Sun') {
    focusOnSun()
    selectedPlanet.value = null
    selectedPlanetName.value = 'Sun'
    return
  }

  // Check if it's a moon
  if (bodyName.includes("'s Moon")) {
    const parentPlanetName = bodyName.replace("'s Moon", '')
    const planetObj = solarSystem.planets.find((p) => p.data.name === parentPlanetName)
    if (planetObj && planetObj.moon) {
      const moonSize = planetObj.data.moonBaseSize * moonScale.value
      const distance = moonSize * 10
      const targetPosition = new THREE.Vector3(
        planetObj.moon.position.x + distance,
        distance * 0.3,
        planetObj.moon.position.z + distance
      )
      animateCameraTo(targetPosition, planetObj.moon.position)
      selectedPlanet.value = null
      selectedPlanetName.value = bodyName
    }
    return
  }

  // It's a planet
  const planetObj = solarSystem.planets.find((p) => p.data.name === bodyName)
  if (planetObj) {
    selectedPlanet.value = planetObj.data
    selectedPlanetName.value = bodyName
    focusOnPlanet(planetObj.mesh, planetObj.data)
  }
}

function animateCameraTo(targetPosition, targetLookAt) {
  const startPosition = camera.position.clone()
  const startTarget = controls.target.clone()
  const duration = 1500
  const startTime = Date.now()

  function animateCamera() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress

    camera.position.lerpVectors(startPosition, targetPosition, eased)
    controls.target.lerpVectors(startTarget, targetLookAt, eased)

    if (progress < 1) {
      requestAnimationFrame(animateCamera)
    }
  }

  animateCamera()
}

function fitAll() {
  camera.position.set(600, 400, 600)
  controls.target.set(0, 0, 0)
  selectedPlanet.value = null
  selectedPlanetName.value = null
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

    if (solarSystem.sun) {
      solarSystem.sun.rotation.y += 0.001 * scaledDelta
    }

    solarSystem.planets.forEach((planetObj) => {
      const planet = planetObj.mesh
      const data = planetObj.data

      data.angle += data.orbitSpeed * scaledDelta
      planet.position.x = Math.cos(data.angle) * data.orbitRadius
      planet.position.z = Math.sin(data.angle) * data.orbitRadius

      planet.rotation.y += data.rotationSpeed * scaledDelta

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

    if (solarSystem.asteroidBelt) {
      const asteroidBelt = solarSystem.asteroidBelt.mesh
      const asteroidData = solarSystem.asteroidBelt.data
      const dummy = new THREE.Object3D()

      asteroidData.forEach((asteroid, i) => {
        asteroid.angle += asteroid.orbitSpeed * scaledDelta

        dummy.position.x = Math.cos(asteroid.angle) * asteroid.orbitRadius
        dummy.position.y = asteroidBelt.instanceMatrix.array[i * 16 + 13]
        dummy.position.z = Math.sin(asteroid.angle) * asteroid.orbitRadius

        dummy.rotation.x += asteroid.rotationSpeed.x * scaledDelta
        dummy.rotation.y += asteroid.rotationSpeed.y * scaledDelta
        dummy.rotation.z += asteroid.rotationSpeed.z * scaledDelta

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
</script>

<template>
  <ChapterLayout>
    <template #canvas>
      <div class="solar-system-container">
        <canvas ref="canvasRef"></canvas>

        <!-- Left Controls Panel -->
        <div class="controls-panel">
          <div class="control-section">
            <h4>Animation</h4>

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
          </div>

          <div class="control-section">
            <h4>Scale Factors</h4>

            <div class="control-group">
              <label>Sun: {{ sunScale }}x</label>
              <input type="range" v-model.number="sunScale" min="1" max="5" step="0.5" class="slider" />
            </div>

            <div class="control-group">
              <label>Planets: {{ planetScale }}x</label>
              <input
                type="range"
                v-model.number="planetScale"
                min="1"
                max="10"
                step="0.5"
                class="slider"
              />
            </div>

            <div class="control-group">
              <label>Moons: {{ moonScale }}x</label>
              <input
                type="range"
                v-model.number="moonScale"
                min="1"
                max="15"
                step="0.5"
                class="slider"
              />
            </div>
          </div>

          <div class="control-section">
            <h4>View</h4>

            <div class="control-group checkbox-group">
              <label>
                <input type="checkbox" v-model="showOrbits" />
                Show Orbit Paths
              </label>
            </div>

            <div class="control-group">
              <button @click="fitAll" class="control-button">🔭 Fit All</button>
            </div>
          </div>
        </div>

        <!-- Celestial Bodies List -->
        <div class="bodies-panel">
          <h4>Celestial Bodies</h4>
          <div class="bodies-list">
            <button
              v-for="body in celestialBodies"
              :key="body.name"
              @click="focusOnBody(body.name)"
              class="body-button"
              :class="{
                active: selectedPlanetName === body.name,
                sun: body.type === 'star',
                planet: body.type === 'planet',
                moon: body.type === 'moon',
              }"
            >
              <span class="body-icon">{{ body.icon }}</span>
              <span class="body-name">{{ body.name }}</span>
            </button>
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
          <p>🖱️ Click celestial bodies or use the list • Drag to rotate • Scroll to zoom</p>
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
  left: 20px;
  background: rgba(0, 0, 0, 0.9);
  padding: 15px;
  border-radius: 8px;
  color: white;
  min-width: 220px;
  max-width: 250px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(66, 184, 131, 0.3);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.bodies-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  padding: 15px;
  border-radius: 8px;
  color: white;
  min-width: 200px;
  max-width: 250px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(66, 184, 131, 0.3);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.bodies-panel h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  color: #42b883;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(66, 184, 131, 0.3);
  padding-bottom: 8px;
}

.bodies-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.body-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  text-align: left;
}

.body-button:hover {
  background: rgba(66, 184, 131, 0.2);
  border-color: rgba(66, 184, 131, 0.5);
  transform: translateX(2px);
}

.body-button.active {
  background: rgba(66, 184, 131, 0.3);
  border-color: #42b883;
}

.body-button.sun {
  border-left: 3px solid #ffcc33;
}

.body-button.planet {
  border-left: 3px solid #42b883;
}

.body-button.moon {
  border-left: 3px solid #aaaaaa;
  padding-left: 18px;
}

.body-icon {
  font-size: 1.1rem;
}

.body-name {
  flex: 1;
}

.control-section {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.control-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
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
  accent-color: #42b883;
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
  accent-color: #42b883;
}

.info-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.95);
  padding: 20px;
  border-radius: 8px;
  color: white;
  min-width: 280px;
  max-width: 350px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(66, 184, 131, 0.3);
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
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 15px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(66, 184, 131, 0.2);
}

.hint-panel p {
  margin: 0;
}

@media (max-width: 1200px) {
  .controls-panel,
  .bodies-panel {
    max-width: 200px;
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .controls-panel {
    top: 10px;
    left: 10px;
    right: auto;
    min-width: 160px;
    max-width: 180px;
  }

  .bodies-panel {
    top: auto;
    bottom: 100px;
    right: 10px;
    min-width: 160px;
    max-width: 180px;
    max-height: 250px;
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
