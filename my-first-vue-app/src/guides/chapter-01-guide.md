# Chapter 1: Basic Scene Setup

## What You'll Learn
- Understanding the three.js fundamentals
- Creating a scene, camera, and renderer
- Adding your first 3D object (a cube)
- Creating an animation loop
- Proper resource cleanup

## Prerequisites
- Basic JavaScript knowledge
- Understanding of HTML Canvas (helpful but not required)

## Introduction

Welcome to your first three.js lesson! You're looking at a rotating green cube on the left. This simple example demonstrates the four essential components of every three.js application:

1. **Scene** - The container for all 3D objects
2. **Camera** - Your point of view into the 3D world
3. **Renderer** - Draws the scene from the camera's perspective
4. **Objects** - The 3D things you want to display (like our cube)

## Step-by-Step Guide

### Step 1: Import Three.js

```javascript
import * as THREE from 'three'
```

This imports the three.js library, giving you access to all its 3D capabilities.

### Step 2: Create a Scene

```javascript
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a1a)
```

The **Scene** is like a container or stage where you place all your 3D objects, lights, and cameras. Think of it as the 3D world itself.

- We set a dark background color (0x1a1a1a is a dark gray in hexadecimal)

### Step 3: Create a Camera

```javascript
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
camera.position.z = 5
```

The **PerspectiveCamera** mimics how human eyes see the world, with perspective (objects farther away appear smaller).

**Parameters explained:**
- **75** - Field of view (FOV) in degrees. Higher values = wider angle
- **width / height** - Aspect ratio (should match your canvas)
- **0.1** - Near clipping plane (objects closer than this won't render)
- **1000** - Far clipping plane (objects farther than this won't render)

We move the camera back by 5 units on the Z-axis so we can see our cube (which will be at position 0,0,0).

### Step 4: Create a Renderer

```javascript
const renderer = new THREE.WebGLRenderer({
  canvas: canvasRef.value,
  antialias: true
})
renderer.setSize(width, height)
```

The **WebGLRenderer** uses WebGL to draw your 3D scene onto an HTML canvas element.

- **canvas** - The HTML canvas element to render to
- **antialias: true** - Smooths jagged edges (better quality, slightly slower)
- **setSize()** - Sets the rendering size to match your canvas

### Step 5: Create a 3D Object (Cube)

```javascript
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
```

Every 3D object in three.js is made of two parts:

1. **Geometry** - The shape (vertices and faces). BoxGeometry creates a cube.
   - Parameters: width (2), height (2), depth (2)

2. **Material** - The surface appearance (color, texture, how it reflects light)
   - MeshBasicMaterial doesn't react to lights, it's just a solid color
   - 0x00ff00 is bright green in hexadecimal

3. **Mesh** - Combines geometry + material into a displayable object

Finally, we add the cube to the scene so it will be rendered.

### Step 6: Create the Animation Loop

```javascript
function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()
```

**requestAnimationFrame()** is the browser's way of creating smooth animations. It calls your function repeatedly (usually 60 times per second).

Inside the loop:
1. We rotate the cube slightly on X and Y axes
2. We render the scene from the camera's perspective

This creates the smooth rotation effect you see!

### Step 7: Handle Window Resize

```javascript
function onWindowResize() {
  const width = canvasRef.value.parentElement.clientWidth
  const height = canvasRef.value.parentElement.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

window.addEventListener('resize', onWindowResize)
```

When the window resizes, we need to:
1. Update the camera's aspect ratio
2. Call **updateProjectionMatrix()** to apply the change
3. Resize the renderer to match

### Step 8: Cleanup Resources

```javascript
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
  cube.geometry.dispose()
  cube.material.dispose()
})
```

**Important!** Always clean up three.js resources to prevent memory leaks:
- Stop the animation loop
- Dispose of the renderer
- Dispose of geometries and materials

## Code Explanation

### The Scene Graph

Three.js uses a **scene graph** - a tree structure where objects can be children of other objects. When you move a parent object, all children move with it.

```
Scene
└── Cube (Mesh)
    ├── Geometry (BoxGeometry)
    └── Material (MeshBasicMaterial)
```

### Coordinate System

Three.js uses a **right-handed coordinate system**:
- **X-axis**: Left (-) to Right (+)
- **Y-axis**: Down (-) to Up (+)
- **Z-axis**: Into screen (-) to Out of screen (+)

The cube starts at position (0, 0, 0) - the origin.

### Rotation

Rotations are measured in **radians**, not degrees:
- 360 degrees = 2π radians
- 180 degrees = π radians
- 90 degrees = π/2 radians

We add 0.01 radians each frame, creating smooth rotation.

## Common Issues & Solutions

**Problem:** Canvas appears blank
- **Solution:** Make sure the camera is positioned away from the object (camera.position.z = 5)
- **Solution:** Check that you're calling renderer.render(scene, camera)

**Problem:** Cube isn't rotating
- **Solution:** Verify animate() function is being called
- **Solution:** Make sure you're calling requestAnimationFrame(animate) inside the animate function

**Problem:** Console errors about "Cannot read property of null"
- **Solution:** Ensure canvasRef is properly set before initializing three.js (use onMounted in Vue)

**Problem:** Canvas is the wrong size
- **Solution:** Make sure to set both renderer.setSize() and camera.aspect ratio correctly

## Challenge

Try modifying the code to:
1. Change the cube color to blue (hint: 0x0000ff)
2. Make the cube bigger (change BoxGeometry parameters)
3. Change rotation speed (modify the += values)
4. Add another cube at a different position

## Key Takeaways

- **Scene** contains everything in your 3D world
- **Camera** defines what you see
- **Renderer** draws the scene to the canvas
- **Mesh = Geometry + Material**
- **Animation loop** updates and renders continuously
- **Always clean up resources** to prevent memory leaks

## Next Chapter

In Chapter 2, we'll explore different geometry types and learn how to create various 3D shapes beyond the basic cube!

## Additional Resources

- [Three.js Documentation - Getting Started](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)
- [Three.js Examples](https://threejs.org/examples/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
