import * as THREE from 'three'

/**
 * Composable for creating and managing code challenges
 */
export function useChallenges() {
  /**
   * Create a validation test result
   */
  const createTestResult = (name, passed, message = '') => {
    return { name, passed, message }
  }

  /**
   * Example challenges for Chapter 1 - Basic Scene Setup
   */
  const chapter1Challenges = [
    {
      id: 'ch1-change-color',
      title: 'Challenge 1: Change the Cube Color',
      difficulty: 'easy',
      description: 'Modify the cube to be red instead of green.',
      requirements: ['The cube must have a red color (0xff0000)'],
      hints: [
        'Look for the MeshStandardMaterial color property',
        'Red in hex format is 0xff0000'
      ],
      validationFn: (code, scene) => {
        const tests = []

        // Test 1: Check if code contains red color
        const hasRedColor = code.includes('0xff0000') || code.includes('0xFF0000')
        tests.push(
          createTestResult(
            'Code uses red color (0xff0000)',
            hasRedColor,
            hasRedColor ? '' : 'Use hex color 0xff0000 for red'
          )
        )

        // Test 2: Check scene for red mesh
        if (scene) {
          const meshes = []
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.BoxGeometry) {
              meshes.push(obj)
            }
          })

          const hasRedMesh = meshes.some((mesh) => {
            const color = mesh.material.color
            return color && color.getHex() === 0xff0000
          })

          tests.push(
            createTestResult(
              'Scene contains a red cube',
              hasRedMesh,
              hasRedMesh ? '' : 'Make sure the cube in the scene is red'
            )
          )
        }

        return tests
      },
      solution: `// Create a rotating RED cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,  // Red color
  metalness: 0.3,
  roughness: 0.4
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()`,
      showSolution: true,
      nextChallenge: true
    },

    {
      id: 'ch1-make-bigger',
      title: 'Challenge 2: Make it Bigger!',
      difficulty: 'easy',
      description: 'Create a cube that is 2 units in size (instead of 1).',
      requirements: [
        'Use BoxGeometry with size 2x2x2',
        'The cube should still rotate'
      ],
      hints: [
        'BoxGeometry takes three parameters: width, height, depth',
        'Change all three values to 2'
      ],
      validationFn: (code, scene) => {
        const tests = []

        // Test 1: Check code for correct geometry size
        const hasCorrectSize = code.match(/BoxGeometry\s*\(\s*2\s*,\s*2\s*,\s*2\s*\)/)
        tests.push(
          createTestResult(
            'Uses BoxGeometry(2, 2, 2)',
            !!hasCorrectSize,
            hasCorrectSize ? '' : 'Use BoxGeometry(2, 2, 2) to create a 2x2x2 cube'
          )
        )

        // Test 2: Check scene for correctly sized mesh
        if (scene) {
          const meshes = []
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.BoxGeometry) {
              meshes.push(obj)
            }
          })

          const hasCorrectMesh = meshes.some((mesh) => {
            const params = mesh.geometry.parameters
            return params.width === 2 && params.height === 2 && params.depth === 2
          })

          tests.push(
            createTestResult(
              'Scene contains a 2x2x2 cube',
              hasCorrectMesh,
              hasCorrectMesh ? '' : 'Make sure the cube in the scene is 2 units in all dimensions'
            )
          )
        }

        return tests
      },
      solution: `// Create a BIGGER rotating cube (2x2x2)
const geometry = new THREE.BoxGeometry(2, 2, 2)  // Bigger!
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.3,
  roughness: 0.4
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()`,
      showSolution: true,
      nextChallenge: true
    },

    {
      id: 'ch1-add-sphere',
      title: 'Challenge 3: Add a Sphere',
      difficulty: 'medium',
      description: 'Add a blue sphere next to the cube. The sphere should be at position x=2.',
      requirements: [
        'Create a SphereGeometry',
        'Use blue color (0x0000ff)',
        'Position the sphere at x=2',
        'Add the sphere to the scene'
      ],
      hints: [
        'Use new THREE.SphereGeometry(radius, widthSegments, heightSegments)',
        'Try radius 0.5, with 32 segments for both width and height',
        'Set position with: sphere.position.x = 2',
        "Don't forget scene.add(sphere)"
      ],
      validationFn: (code, scene) => {
        const tests = []

        // Test 1: Check code for SphereGeometry
        const hasSphereGeometry = code.includes('SphereGeometry')
        tests.push(
          createTestResult(
            'Code creates a SphereGeometry',
            hasSphereGeometry,
            hasSphereGeometry ? '' : 'Use THREE.SphereGeometry to create a sphere'
          )
        )

        // Test 2: Check code for blue color
        const hasBlueColor = code.includes('0x0000ff') || code.includes('0x0000FF')
        tests.push(
          createTestResult(
            'Code uses blue color (0x0000ff)',
            hasBlueColor,
            hasBlueColor ? '' : 'Use hex color 0x0000ff for blue'
          )
        )

        // Test 3: Check scene for blue sphere at correct position
        if (scene) {
          const spheres = []
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.SphereGeometry) {
              spheres.push(obj)
            }
          })

          const hasCorrectSphere = spheres.some((sphere) => {
            const isBlue = sphere.material.color && sphere.material.color.getHex() === 0x0000ff
            const isAtX2 = Math.abs(sphere.position.x - 2) < 0.1
            return isBlue && isAtX2
          })

          tests.push(
            createTestResult(
              'Scene contains a blue sphere at x=2',
              hasCorrectSphere,
              hasCorrectSphere
                ? ''
                : 'Make sure the sphere is blue and positioned at x=2'
            )
          )
        }

        return tests
      },
      solution: `// Create a rotating cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.3,
  roughness: 0.4
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Create a blue sphere
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMat = new THREE.MeshStandardMaterial({ color: 0x0000ff })
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
sphere.position.x = 2
scene.add(sphere)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()`,
      showSolution: true,
      nextChallenge: false
    }
  ]

  /**
   * Get challenges by chapter
   */
  const getChallengesByChapter = (chapterNumber) => {
    switch (chapterNumber) {
      case 1:
        return chapter1Challenges
      // Add more chapters here as needed
      default:
        return []
    }
  }

  /**
   * Get a specific challenge by ID
   */
  const getChallengeById = (id) => {
    // Search through all challenges
    const allChallenges = [
      ...chapter1Challenges
      // Add more challenge arrays here
    ]
    return allChallenges.find((c) => c.id === id)
  }

  return {
    chapter1Challenges,
    getChallengesByChapter,
    getChallengeById,
    createTestResult
  }
}
