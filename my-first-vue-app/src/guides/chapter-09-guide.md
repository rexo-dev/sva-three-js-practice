# Chapter 9: Loading 3D Models

## What You'll Learn
- Using GLTFLoader to load 3D models
- Understanding the GLTF format
- Model positioning, scaling, and rotation
- Traversing model hierarchy
- Handling model animations
- Where to find free 3D models

## Prerequisites
- Chapter 1: Basic Scene Setup
- Chapter 6: Camera Controls

## Introduction

In this chapter, you're seeing a simple "robot" made from basic geometries. In real projects, you'd load complex 3D models created in software like Blender, Maya, or found online.

The **GLTF (GL Transmission Format)** is the standard format for 3D models on the web, often called "the JPEG of 3D."

## Step-by-Step Guide

### Step 1: Understanding GLTF

**GLTF** comes in two formats:
- **.gltf**: JSON text file + separate binary/texture files
- **.glb**: Single binary file (more common, easier to use)

**Advantages:**
- Industry standard for web
- Compact file size
- Supports animations, materials, textures
- Supported by all major 3D software

### Step 2: Importing GLTFLoader

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
```

GLTFLoader is in the examples folder, not the main three.js package.

### Step 3: Basic Model Loading

```javascript
const loader = new GLTFLoader()

loader.load(
  '/models/robot.glb',  // Path to model
  (gltf) => {
    // onLoad: Called when model is loaded
    const model = gltf.scene
    scene.add(model)
  },
  (progress) => {
    // onProgress: Called while loading
    console.log((progress.loaded / progress.total * 100) + '% loaded')
  },
  (error) => {
    // onError: Called if loading fails
    console.error('Error loading model:', error)
  }
)
```

### Step 4: Positioning and Scaling the Model

```javascript
loader.load('/models/robot.glb', (gltf) => {
  const model = gltf.scene

  // Scale the model
  model.scale.set(2, 2, 2)

  // Position the model
  model.position.set(0, 0, 0)

  // Rotate the model
  model.rotation.y = Math.PI / 2  // 90 degrees

  scene.add(model)
})
```

**Tips:**
- Models often have different scales (some are huge, some tiny)
- Adjust scale to fit your scene
- Center at origin (0,0,0) first, then position

### Step 5: Traversing the Model Hierarchy

```javascript
loader.load('/models/robot.glb', (gltf) => {
  const model = gltf.scene

  // Iterate through all children
  model.traverse((child) => {
    if (child.isMesh) {
      // Enable shadows
      child.castShadow = true
      child.receiveShadow = true

      // Modify material
      child.material.metalness = 0.5
      child.material.roughness = 0.5
    }
  })

  scene.add(model)
})
```

**traverse()** visits every object in the model's hierarchy:
- Meshes
- Lights
- Cameras
- Empty groups

### Step 6: Finding Specific Parts

```javascript
loader.load('/models/robot.glb', (gltf) => {
  const model = gltf.scene

  // Find object by name
  const head = model.getObjectByName('Head')
  if (head) {
    head.material.color.set(0xff0000)  // Make head red
  }

  // Find all meshes
  const meshes = []
  model.traverse((child) => {
    if (child.isMesh) {
      meshes.push(child)
    }
  })

  scene.add(model)
})
```

### Step 7: Model Animations

```javascript
let mixer, action

loader.load('/models/robot.glb', (gltf) => {
  const model = gltf.scene
  scene.add(model)

  // Check if model has animations
  if (gltf.animations && gltf.animations.length > 0) {
    // Create animation mixer
    mixer = new THREE.AnimationMixer(model)

    // Get first animation
    const clip = gltf.animations[0]
    action = mixer.clipAction(clip)
    action.play()
  }
})

// In animation loop
const clock = new THREE.Clock()
function animate() {
  const deltaTime = clock.getDelta()

  // Update animations
  if (mixer) {
    mixer.update(deltaTime)
  }

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
```

**AnimationMixer** plays model animations:
- Walking cycles
- Character actions
- Mechanical movements
- Morphing effects

### Step 8: Loading Manager for Multiple Models

```javascript
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = (url, loaded, total) => {
  console.log(`Loading ${url}...`)
}

loadingManager.onProgress = (url, loaded, total) => {
  console.log(`Loading: ${loaded}/${total}`)
}

loadingManager.onLoad = () => {
  console.log('All models loaded!')
}

loadingManager.onError = (url) => {
  console.error(`Error loading ${url}`)
}

const loader = new GLTFLoader(loadingManager)

// Load multiple models
loader.load('/models/character.glb', (gltf) => {
  scene.add(gltf.scene)
})

loader.load('/models/environment.glb', (gltf) => {
  scene.add(gltf.scene)
})
```

### Step 9: Draco Compression

```javascript
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')  // Path to Draco decoder files

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/models/compressed.glb', (gltf) => {
  scene.add(gltf.scene)
})
```

**Draco** compresses geometry for smaller file sizes (30-50% smaller).

### Step 10: Cleanup

```javascript
onBeforeUnmount(() => {
  if (model) {
    model.traverse((child) => {
      if (child.geometry) child.geometry.dispose()
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose())
        } else {
          child.material.dispose()
        }
      }
    })
  }
})
```

Always dispose geometries, materials, and textures!

## Where to Find 3D Models

### Free Resources
- **[Sketchfab](https://sketchfab.com/)**: Huge library, many free models
- **[Poly Haven](https://polyhaven.com/models)**: High-quality, CC0 (public domain)
- **[Kenney.nl](https://kenney.nl/assets)**: Game assets, CC0
- **[Quaternius](https://quaternius.com/)**: Low-poly game assets
- **[glTF Sample Models](https://github.com/KhronosGroup/glTF-Sample-Models)**: Testing models

### Paid Resources
- **[TurboSquid](https://www.turbosquid.com/)**
- **[CGTrader](https://www.cgtrader.com/)**
- **[Sketchfab Store](https://sketchfab.com/store)**

### Creating Your Own
- **[Blender](https://www.blender.org/)**: Free, powerful 3D software
- **[SketchUp](https://www.sketchup.com/)**: Easier to learn
- **[Blockbench](https://www.blockbench.net/)**: Great for blocky/voxel models

## Exporting from Blender

1. Create/import your model in Blender
2. File → Export → glTF 2.0
3. **Format**: Select "glTF Binary (.glb)"
4. **Include**: Select necessary components
5. **Transform**: Apply transforms
6. Export!

**Blender export tips:**
- Apply all transforms (Ctrl+A)
- Check normals are correct
- Optimize geometry (reduce poly count)
- Bake textures if needed
- Name objects clearly

## Optimization Tips

1. **Reduce polygon count**: Use only as many polygons as needed
2. **Compress textures**: Use JPG for color maps, optimize PNG
3. **Use Draco compression**: For geometric compression
4. **Combine meshes**: Fewer draw calls = better performance
5. **Use LOD (Level of Detail)**: Show simpler models when far away

## Common Issues & Solutions

**Problem:** Model doesn't appear
- **Solution:** Check file path is correct
- **Solution:** Check console for errors
- **Solution:** Scale might be too small/large
- **Solution:** Camera might be inside the model

**Problem:** Model is black
- **Solution:** Add lights to the scene
- **Solution:** Check if model has materials

**Problem:** Model is too big/small
- **Solution:** Adjust scale: `model.scale.set(0.1, 0.1, 0.1)` or `(10, 10, 10)`

**Problem:** Model textures missing
- **Solution:** Ensure texture files are in correct path
- **Solution:** Use .glb format (embeds textures)

**Problem:** Model animations don't play
- **Solution:** Check if model has animations: `console.log(gltf.animations)`
- **Solution:** Update mixer in animation loop: `mixer.update(deltaTime)`

**Problem:** Performance issues with complex model
- **Solution:** Reduce polygon count in 3D software
- **Solution:** Use Draco compression
- **Solution:** Optimize textures
- **Solution:** Use simpler materials

## Challenge

Try modifying the code to:
1. Find a free GLTF model online and load it
2. Scale and position the model correctly
3. Enable shadows on all meshes using traverse()
4. Add a rotation animation to the model
5. Change the material color of specific parts

**Bonus Challenge:** Load a model with animations and play them, or create a scene with multiple different models

## Key Takeaways

- **GLTF/GLB** is the standard format for web 3D models
- **GLTFLoader** loads GLTF files asynchronously
- Use **callbacks** (onLoad, onProgress, onError) to handle loading
- **gltf.scene** contains the loaded model
- **traverse()** iterates through all objects in a model
- **AnimationMixer** plays model animations
- **Scale, position, and rotation** adjust model placement
- Always **dispose** resources when done
- Use **LoadingManager** for multiple models
- **Draco compression** reduces file size

## Next Chapter

In Chapter 10, we'll create an interactive scene using Raycasting to detect mouse clicks on 3D objects!

## Additional Resources

- [Three.js GLTF Loader Documentation](https://threejs.org/docs/index.html#examples/en/loaders/GLTFLoader)
- [GLTF Format Specification](https://www.khronos.org/gltf/)
- [Blender to Three.js Workflow](https://threejs.org/docs/#manual/en/introduction/Loading-3D-models)
- [glTF Tutorial](https://www.khronos.org/files/gltf20-reference-guide.pdf)
