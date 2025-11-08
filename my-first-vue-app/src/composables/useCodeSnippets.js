/**
 * Composable for code snippets and templates
 * Provides ready-to-use Three.js code examples
 */
export function useCodeSnippets() {
  /**
   * Basic geometry snippets
   */
  const geometrySnippets = {
    cube: {
      label: 'Create a Cube',
      category: 'Geometries',
      description: 'Basic box geometry with standard material',
      code: `const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)`
    },
    sphere: {
      label: 'Create a Sphere',
      category: 'Geometries',
      description: 'Sphere geometry with smooth surface',
      code: `const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)`
    },
    cylinder: {
      label: 'Create a Cylinder',
      category: 'Geometries',
      description: 'Cylindrical geometry',
      code: `const geometry = new THREE.CylinderGeometry(1, 1, 2, 32)
const material = new THREE.MeshStandardMaterial({ color: 0x0000ff })
const cylinder = new THREE.Mesh(geometry, material)
scene.add(cylinder)`
    },
    cone: {
      label: 'Create a Cone',
      category: 'Geometries',
      description: 'Cone geometry',
      code: `const geometry = new THREE.ConeGeometry(1, 2, 32)
const material = new THREE.MeshStandardMaterial({ color: 0xffff00 })
const cone = new THREE.Mesh(geometry, material)
scene.add(cone)`
    },
    torus: {
      label: 'Create a Torus',
      category: 'Geometries',
      description: 'Donut-shaped geometry',
      code: `const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
const material = new THREE.MeshStandardMaterial({ color: 0xff00ff })
const torus = new THREE.Mesh(geometry, material)
scene.add(torus)`
    },
    plane: {
      label: 'Create a Plane',
      category: 'Geometries',
      description: 'Flat rectangular surface',
      code: `const geometry = new THREE.PlaneGeometry(2, 2)
const material = new THREE.MeshStandardMaterial({
  color: 0x808080,
  side: THREE.DoubleSide
})
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)`
    }
  }

  /**
   * Material snippets
   */
  const materialSnippets = {
    basic: {
      label: 'Basic Material',
      category: 'Materials',
      description: 'Simple material not affected by lights',
      code: `const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: false
})`
    },
    standard: {
      label: 'Standard Material',
      category: 'Materials',
      description: 'Physically-based material with realistic lighting',
      code: `const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.5,
  roughness: 0.5
})`
    },
    phong: {
      label: 'Phong Material',
      category: 'Materials',
      description: 'Shiny material with specular highlights',
      code: `const material = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  shininess: 100,
  specular: 0x111111
})`
    },
    emissive: {
      label: 'Emissive Material',
      category: 'Materials',
      description: 'Material that emits light',
      code: `const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  emissive: 0x00ff00,
  emissiveIntensity: 0.5
})`
    }
  }

  /**
   * Animation snippets
   */
  const animationSnippets = {
    rotate: {
      label: 'Rotation Animation',
      category: 'Animation',
      description: 'Continuously rotate an object',
      code: `function animate() {
  requestAnimationFrame(animate)

  // Rotate the object
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01

  renderer.render(scene, camera)
}
animate()`
    },
    bounce: {
      label: 'Bouncing Animation',
      category: 'Animation',
      description: 'Make object bounce up and down',
      code: `let direction = 1
const maxHeight = 2
const minHeight = 0

function animate() {
  requestAnimationFrame(animate)

  // Move up and down
  mesh.position.y += 0.02 * direction

  // Reverse direction at boundaries
  if (mesh.position.y > maxHeight || mesh.position.y < minHeight) {
    direction *= -1
  }

  renderer.render(scene, camera)
}
animate()`
    },
    orbit: {
      label: 'Orbital Motion',
      category: 'Animation',
      description: 'Orbit one object around another',
      code: `let angle = 0
const radius = 3

function animate() {
  requestAnimationFrame(animate)

  // Calculate orbital position
  angle += 0.01
  mesh.position.x = Math.cos(angle) * radius
  mesh.position.z = Math.sin(angle) * radius

  renderer.render(scene, camera)
}
animate()`
    },
    scale: {
      label: 'Pulsing Scale',
      category: 'Animation',
      description: 'Pulse object size',
      code: `let scale = 1
let growing = true

function animate() {
  requestAnimationFrame(animate)

  // Pulse between 0.5 and 1.5
  if (growing) {
    scale += 0.01
    if (scale > 1.5) growing = false
  } else {
    scale -= 0.01
    if (scale < 0.5) growing = true
  }

  mesh.scale.set(scale, scale, scale)

  renderer.render(scene, camera)
}
animate()`
    }
  }

  /**
   * Lighting snippets
   */
  const lightingSnippets = {
    ambient: {
      label: 'Ambient Light',
      category: 'Lighting',
      description: 'Soft overall lighting',
      code: `const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)`
    },
    directional: {
      label: 'Directional Light',
      category: 'Lighting',
      description: 'Sunlight-like directional light',
      code: `const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)`
    },
    point: {
      label: 'Point Light',
      category: 'Lighting',
      description: 'Light emanating from a point',
      code: `const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(0, 3, 0)
scene.add(pointLight)`
    },
    spot: {
      label: 'Spot Light',
      category: 'Lighting',
      description: 'Focused beam of light',
      code: `const spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(0, 5, 0)
spotLight.angle = Math.PI / 6
spotLight.penumbra = 0.2
scene.add(spotLight)`
    },
    hemisphere: {
      label: 'Hemisphere Light',
      category: 'Lighting',
      description: 'Sky and ground lighting',
      code: `const hemiLight = new THREE.HemisphereLight(
  0xffffff, // sky color
  0x444444, // ground color
  0.6       // intensity
)
scene.add(hemiLight)`
    }
  }

  /**
   * Helper snippets
   */
  const helperSnippets = {
    group: {
      label: 'Group Objects',
      category: 'Helpers',
      description: 'Group multiple objects together',
      code: `const group = new THREE.Group()

// Add objects to group
group.add(mesh1)
group.add(mesh2)
group.add(mesh3)

// Transform entire group
group.rotation.y = Math.PI / 4
group.position.x = 2

scene.add(group)`
    },
    grid: {
      label: 'Grid Helper',
      category: 'Helpers',
      description: 'Add a grid to visualize the ground plane',
      code: `const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)`
    },
    axes: {
      label: 'Axes Helper',
      category: 'Helpers',
      description: 'Show X, Y, Z axes',
      code: `const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)`
    },
    randomPosition: {
      label: 'Random Position',
      category: 'Helpers',
      description: 'Set random position within bounds',
      code: `// Random position between -5 and 5
mesh.position.x = (Math.random() - 0.5) * 10
mesh.position.y = (Math.random() - 0.5) * 10
mesh.position.z = (Math.random() - 0.5) * 10`
    },
    randomColor: {
      label: 'Random Color',
      category: 'Helpers',
      description: 'Generate random color',
      code: `// Random color
const randomColor = Math.random() * 0xffffff
material.color.setHex(randomColor)`
    }
  }

  /**
   * Complete examples
   */
  const exampleTemplates = {
    simpleScene: {
      label: 'Simple Scene Template',
      category: 'Templates',
      description: 'Basic scene with cube and lighting',
      code: `// Create geometry and material
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()`
    },
    multipleObjects: {
      label: 'Multiple Objects',
      category: 'Templates',
      description: 'Scene with multiple different objects',
      code: `// Create multiple objects
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
)
cube.position.x = -2

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
)
sphere.position.x = 0

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 1, 32),
  new THREE.MeshStandardMaterial({ color: 0x0000ff })
)
cone.position.x = 2

scene.add(cube, sphere, cone)

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(5, 5, 5)
scene.add(ambientLight, directionalLight)

// Animate
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.y += 0.01
  sphere.rotation.y += 0.02
  cone.rotation.y += 0.03
  renderer.render(scene, camera)
}
animate()`
    }
  }

  /**
   * Get all snippets organized by category
   */
  const getAllSnippets = () => {
    return {
      geometries: geometrySnippets,
      materials: materialSnippets,
      animation: animationSnippets,
      lighting: lightingSnippets,
      helpers: helperSnippets,
      templates: exampleTemplates
    }
  }

  /**
   * Get snippets as a flat array
   */
  const getSnippetsArray = () => {
    const all = getAllSnippets()
    const snippets = []

    Object.entries(all).forEach(([categoryKey, categorySnippets]) => {
      Object.entries(categorySnippets).forEach(([key, snippet]) => {
        snippets.push({
          id: `${categoryKey}_${key}`,
          ...snippet
        })
      })
    })

    return snippets
  }

  /**
   * Search snippets by keyword
   */
  const searchSnippets = (query) => {
    const lowerQuery = query.toLowerCase()
    return getSnippetsArray().filter(
      (snippet) =>
        snippet.label.toLowerCase().includes(lowerQuery) ||
        snippet.description.toLowerCase().includes(lowerQuery) ||
        snippet.category.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get snippets by category
   */
  const getSnippetsByCategory = (category) => {
    const all = getAllSnippets()
    return all[category] || {}
  }

  return {
    geometrySnippets,
    materialSnippets,
    animationSnippets,
    lightingSnippets,
    helperSnippets,
    exampleTemplates,
    getAllSnippets,
    getSnippetsArray,
    searchSnippets,
    getSnippetsByCategory
  }
}
