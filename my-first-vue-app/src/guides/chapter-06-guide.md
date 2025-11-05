# Chapter 6: Camera Controls

## What You'll Learn
- Using OrbitControls for mouse interaction
- Camera positioning and movement
- Understanding Field of View (FOV)
- Camera clipping planes
- Creating intuitive 3D navigation

## Prerequisites
- Chapter 1: Basic Scene Setup

## Introduction

Camera controls make your 3D scenes interactive! In this chapter, try these interactions:
- **Left mouse drag**: Orbit around the object
- **Right mouse drag**: Pan (move sideways)
- **Mouse wheel**: Zoom in/out
- **Touch**: Works on mobile devices too!

You're seeing a cube with a grid and axes helpers showing the 3D space.

## Step-by-Step Guide

### Step 1: Importing OrbitControls

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
```

**OrbitControls** is not in the main three.js package, it's in the examples folder.

### Step 2: Creating OrbitControls

```javascript
const controls = new OrbitControls(camera, renderer.domElement)
```

**Parameters:**
- **camera**: The camera to control
- **domElement**: The canvas or DOM element for mouse events

### Step 3: Basic OrbitControls Properties

```javascript
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.minDistance = 2
controls.maxDistance = 10
controls.maxPolarAngle = Math.PI / 2
```

**Properties:**
- **enableDamping**: Smooth, inertial movement
- **dampingFactor**: How much damping (0.05 = gentle)
- **minDistance**: Closest zoom level
- **maxDistance**: Farthest zoom level
- **maxPolarAngle**: Maximum vertical angle (Math.PI/2 = can't go below ground)
- **minPolarAngle**: Minimum vertical angle

### Step 4: Updating Controls

```javascript
function animate() {
  requestAnimationFrame(animate)

  // IMPORTANT: Update controls every frame if damping is enabled
  controls.update()

  renderer.render(scene, camera)
}
```

**Important:** Call `controls.update()` in your animation loop when using damping!

### Step 5: Enabling/Disabling Controls

```javascript
// Disable/enable specific controls
controls.enableRotate = true   // Orbit (default: true)
controls.enableZoom = true     // Zoom (default: true)
controls.enablePan = true      // Pan (default: true)

// Change mouse button mappings
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
}
```

### Step 6: Auto-Rotation

```javascript
controls.autoRotate = true
controls.autoRotateSpeed = 2.0  // Speed (default: 2)
```

Makes the camera automatically rotate around the target. Great for showcasing objects!

### Step 7: Setting Target

```javascript
// Look at a specific position
controls.target.set(0, 1, 0)

// Look at an object
controls.target.copy(myObject.position)

// Update after changing target
controls.update()
```

The **target** is the point the camera orbits around.

### Step 8: Camera Position

```javascript
// Set camera position
camera.position.set(3, 3, 3)

// Look at the origin
camera.lookAt(0, 0, 0)

// With controls, set initial position then let controls take over
camera.position.set(5, 5, 5)
controls.target.set(0, 0, 0)
controls.update()
```

### Step 9: Movement Speed

```javascript
controls.rotateSpeed = 1.0  // Rotation speed
controls.zoomSpeed = 1.0    // Zoom speed
controls.panSpeed = 1.0     // Pan speed

// Invert controls
controls.rotateSpeed = -1.0  // Reverse rotation
```

### Step 10: Cleanup

```javascript
onBeforeUnmount(() => {
  controls.dispose()  // Remove event listeners
})
```

Always dispose controls to prevent memory leaks!

## Understanding Camera Properties

### PerspectiveCamera

```javascript
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
```

**Parameters:**
- **fov**: Field of View in degrees (45-75 typical)
- **aspect**: Width / Height (match canvas)
- **near**: Near clipping plane (0.1 typical)
- **far**: Far clipping plane (1000 typical)

### Field of View (FOV)

```javascript
camera.fov = 75  // Wide angle
camera.fov = 50  // Normal
camera.fov = 25  // Telephoto
camera.updateProjectionMatrix()  // Apply changes
```

**Effects:**
- **Wide FOV** (75-90): Distorted, fish-eye, close feeling
- **Normal FOV** (50-60): Natural, human eye perspective
- **Narrow FOV** (20-40): Zoomed, compressed, distant feeling

### Clipping Planes

```javascript
camera.near = 0.1   // Objects closer than this aren't rendered
camera.far = 1000   // Objects farther than this aren't rendered
camera.updateProjectionMatrix()
```

**Tips:**
- Keep near plane as large as possible (0.1-1)
- Keep far plane as small as possible
- Reduces z-fighting (flickering) issues
- Better depth precision

## Helper Objects

### GridHelper

```javascript
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)
```

Shows a ground grid (size: 10, divisions: 10).

### AxesHelper

```javascript
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
```

Shows colored axes:
- **Red**: X-axis (right)
- **Green**: Y-axis (up)
- **Blue**: Z-axis (forward)

## Other Control Types

### FlyControls
```javascript
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
```
Like flying a plane, full 3D movement.

### FirstPersonControls
```javascript
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'
```
First-person shooter style controls.

### TrackballControls
```javascript
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
```
Like OrbitControls but allows full 360° rotation.

### PointerLockControls
```javascript
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
```
Captures mouse for FPS games.

## Common Issues & Solutions

**Problem:** Camera controls don't work
- **Solution:** Pass correct canvas element: `new OrbitControls(camera, canvasRef.value)`
- **Solution:** Ensure you're calling `controls.update()` if using damping

**Problem:** Camera moves through objects
- **Solution:** Set `controls.minDistance` to prevent getting too close

**Problem:** Can't rotate below the ground
- **Solution:** Set `controls.maxPolarAngle = Math.PI / 2`

**Problem:** Movement feels jerky
- **Solution:** Enable damping: `controls.enableDamping = true`

**Problem:** Camera position resets
- **Solution:** Set camera position BEFORE creating controls

**Problem:** Performance issues
- **Solution:** Disable damping if not needed
- **Solution:** Reduce update frequency

## Challenge

Try modifying the code to:
1. Change the FOV to create different perspectives
2. Set up auto-rotation
3. Limit the camera to stay above the ground plane
4. Change the rotation speed
5. Disable panning to only allow orbit and zoom

**Bonus Challenge:** Create keyboard controls to snap to preset camera positions (front, side, top views)

## Key Takeaways

- **OrbitControls** provides intuitive mouse/touch interaction
- **enableDamping** creates smooth, inertial movement
- Call **controls.update()** in animation loop when using damping
- **minDistance/maxDistance** control zoom limits
- **maxPolarAngle** prevents going below ground
- Always **dispose()** controls when unmounting
- **Field of View** affects perspective (higher = wider angle)
- Use **helpers** (Grid, Axes) for debugging and spatial reference

## Next Chapter

In Chapter 7, we'll create smooth animations using time-based techniques and the Clock object!

## Additional Resources

- [OrbitControls Documentation](https://threejs.org/docs/index.html#examples/en/controls/OrbitControls)
- [Three.js Controls Examples](https://threejs.org/examples/?q=controls)
- [Camera Documentation](https://threejs.org/docs/index.html#api/en/cameras/PerspectiveCamera)
