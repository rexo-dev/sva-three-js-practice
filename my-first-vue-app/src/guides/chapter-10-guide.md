# Chapter 10: Interactive Scene

## What You'll Learn
- Using Raycaster for object selection
- Mouse interaction with 3D objects
- Detecting clicks and hovers
- Changing object properties on interaction
- Converting mouse coordinates to 3D space
- Creating interactive experiences

## Prerequisites
- All previous chapters

## Introduction

Congratulations on reaching the final chapter! Here you'll see an interactive scene with six colored cubes arranged in a circle. Try these interactions:

- **Hover** over a cube → It turns white, lifts up, and scales bigger
- **Click** a cube → It turns purple, lifts higher, scales larger, and rotates
- **Click empty space** → Deselects the cube

This demonstrates the power of Raycasting for creating interactive 3D experiences!

## Step-by-Step Guide

### Step 1: Understanding Raycasting

**Raycasting** shoots a ray from the camera through the mouse position to see what it hits.

Think of it like this:
- Camera is your eye
- Mouse cursor defines the direction
- Ray travels through the scene
- Returns all objects it intersects

```javascript
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
```

### Step 2: Converting Mouse Coordinates

```javascript
function onMouseMove(event) {
  const rect = canvas.getBoundingClientRect()

  // Convert to normalized device coordinates (-1 to +1)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
}

canvas.addEventListener('mousemove', onMouseMove)
```

**Normalized Device Coordinates (NDC):**
- X: -1 (left) to +1 (right)
- Y: -1 (bottom) to +1 (top)
- Center of screen: (0, 0)

**Why normalize?** Works regardless of canvas size.

### Step 3: Performing a Raycast

```javascript
function onMouseMove(event) {
  // Update mouse coordinates
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera)

  // Check for intersections
  const intersects = raycaster.intersectObjects(cubes)

  if (intersects.length > 0) {
    const hoveredObject = intersects[0].object
    // Do something with hovered object
  }
}
```

**intersectObjects()** returns an array of intersections, sorted by distance (closest first).

### Step 4: Understanding Intersection Object

```javascript
const intersects = raycaster.intersectObjects(cubes)

if (intersects.length > 0) {
  const intersection = intersects[0]

  console.log(intersection.object)    // The mesh that was hit
  console.log(intersection.distance)  // Distance from camera
  console.log(intersection.point)     // 3D point of intersection
  console.log(intersection.face)      // Which face was hit
  console.log(intersection.faceIndex) // Index of the face
  console.log(intersection.uv)        // UV coordinates at hit point
}
```

### Step 5: Hover Effect

```javascript
function onMouseMove(event) {
  // ... mouse coordinate calculation ...

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cubes)

  // Reset all cubes to original state
  cubes.forEach((cube) => {
    cube.material.color.setHex(cube.userData.originalColor)
    cube.position.y = cube.userData.originalY
    cube.scale.set(1, 1, 1)
  })

  // Highlight hovered cube
  if (intersects.length > 0) {
    const hoveredCube = intersects[0].object
    hoveredCube.material.color.setHex(0xffffff)  // White
    hoveredCube.position.y += 0.2  // Lift up
    hoveredCube.scale.set(1.1, 1.1, 1.1)  // Scale up
    canvas.style.cursor = 'pointer'  // Change cursor
  } else {
    canvas.style.cursor = 'default'
  }
}
```

**userData**: Store custom properties on objects
```javascript
cube.userData = {
  originalColor: 0xff6b6b,
  originalY: 0.5
}
```

### Step 6: Click Selection

```javascript
let selectedObject = null

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
    selectedObject.material.color.setHex(0xff00ff)  // Purple
    selectedObject.position.y = selectedObject.userData.originalY + 0.5
    selectedObject.scale.set(1.2, 1.2, 1.2)
  } else {
    // Deselect if clicking empty space
    if (selectedObject) {
      selectedObject.material.color.setHex(selectedObject.userData.originalColor)
      selectedObject.position.y = selectedObject.userData.originalY
      selectedObject.scale.set(1, 1, 1)
      selectedObject = null
    }
  }
}

canvas.addEventListener('click', onClick)
```

### Step 7: Combining Hover and Selection

```javascript
function onMouseMove(event) {
  // ... calculate mouse ...
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cubes)

  // Reset non-selected cubes
  cubes.forEach((cube) => {
    if (cube !== selectedObject) {
      cube.material.color.setHex(cube.userData.originalColor)
      cube.position.y = cube.userData.originalY
      cube.scale.set(1, 1, 1)
    }
  })

  // Highlight hovered (but not selected)
  if (intersects.length > 0) {
    const hoveredCube = intersects[0].object
    if (hoveredCube !== selectedObject) {
      hoveredCube.material.color.setHex(0xffffff)
      hoveredCube.position.y += 0.2
      hoveredCube.scale.set(1.1, 1.1, 1.1)
    }
    canvas.style.cursor = 'pointer'
  } else {
    canvas.style.cursor = 'default'
  }
}
```

### Step 8: Animating Selected Object

```javascript
function animate() {
  requestAnimationFrame(animate)

  // Rotate selected object
  if (selectedObject) {
    selectedObject.rotation.y += 0.02
  }

  controls.update()
  renderer.render(scene, camera)
}
```

### Step 9: Advanced Raycasting Options

```javascript
// Only check first intersection (faster)
const intersects = raycaster.intersectObjects(cubes, false)

// Check nested objects recursively
const intersects = raycaster.intersectObjects([scene], true)

// Set ray distance limit
raycaster.far = 100

// Set threshold for points/lines
raycaster.params.Points.threshold = 0.1
raycaster.params.Line.threshold = 0.1
```

### Step 10: Touch Support for Mobile

```javascript
function getTouchCoordinates(event) {
  const rect = canvas.getBoundingClientRect()
  const touch = event.touches[0]

  mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1
}

canvas.addEventListener('touchstart', (event) => {
  getTouchCoordinates(event)
  onClick()
})

canvas.addEventListener('touchmove', (event) => {
  getTouchCoordinates(event)
  onMouseMove(event)
})
```

## Practical Use Cases

### 1. Drag Objects

```javascript
let isDragging = false
let dragObject = null

canvas.addEventListener('mousedown', () => {
  const intersects = raycaster.intersectObjects(objects)
  if (intersects.length > 0) {
    isDragging = true
    dragObject = intersects[0].object
    controls.enabled = false  // Disable orbit controls
  }
})

canvas.addEventListener('mousemove', (event) => {
  if (isDragging && dragObject) {
    // Project mouse to 3D plane and move object
    const intersects = raycaster.intersectObject(groundPlane)
    if (intersects.length > 0) {
      dragObject.position.copy(intersects[0].point)
    }
  }
})

canvas.addEventListener('mouseup', () => {
  isDragging = false
  dragObject = null
  controls.enabled = true
})
```

### 2. Tooltips

```javascript
const tooltip = document.getElementById('tooltip')

function onMouseMove(event) {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(objects)

  if (intersects.length > 0) {
    const object = intersects[0].object
    tooltip.textContent = object.userData.name
    tooltip.style.left = event.clientX + 'px'
    tooltip.style.top = event.clientY + 'px'
    tooltip.style.display = 'block'
  } else {
    tooltip.style.display = 'none'
  }
}
```

### 3. First-Person Shooter

```javascript
function shoot() {
  // Ray from camera center (crosshair)
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
  const intersects = raycaster.intersectObjects(enemies)

  if (intersects.length > 0) {
    const hit = intersects[0].object
    hit.userData.health -= 10
    if (hit.userData.health <= 0) {
      scene.remove(hit)
    }
  }
}
```

## Performance Tips

1. **Limit number of objects**: Only raycast against interactive objects
2. **Use bounding boxes**: Check simple boxes first, then detailed meshes
3. **Throttle events**: Don't raycast on every mousemove
4. **Use layers**: Only raycast specific layers

```javascript
// Set up layers
interactiveObjects.forEach(obj => obj.layers.set(1))
raycaster.layers.set(1)  // Only check layer 1

// Throttle mousemove
let lastRaycastTime = 0
function onMouseMove(event) {
  const now = Date.now()
  if (now - lastRaycastTime < 16) return  // ~60fps
  lastRaycastTime = now

  // ... raycasting logic ...
}
```

## Common Issues & Solutions

**Problem:** Raycasting doesn't work
- **Solution:** Check mouse coordinates are normalized correctly
- **Solution:** Verify objects are in the array passed to intersectObjects()
- **Solution:** Check camera is set up correctly

**Problem:** Wrong object is selected
- **Solution:** intersectObjects() returns closest first, use `intersects[0]`
- **Solution:** Check if objects overlap

**Problem:** Raycasting through objects
- **Solution:** Ensure objects have geometry and are visible
- **Solution:** Check object layers match raycaster layers

**Problem:** Poor performance
- **Solution:** Limit objects being tested
- **Solution:** Throttle mousemove events
- **Solution:** Use simpler collision geometry

**Problem:** Works on desktop but not mobile
- **Solution:** Add touch event listeners
- **Solution:** Use touches[0] for touch coordinates

## Challenge

Try modifying the code to:
1. Add different effects for different objects
2. Create a color picker (click cubes to paint other cubes)
3. Add sound effects on hover/click
4. Implement drag-and-drop to rearrange cubes
5. Create a simple game (click targets before they disappear)

**Bonus Challenge:** Build a complete interactive scene - maybe a product configurator, virtual room, or simple game!

## Key Takeaways

- **Raycaster** casts rays to detect object intersections
- **Normalize mouse coordinates** to NDC (-1 to +1)
- **intersectObjects()** returns array of hits, sorted by distance
- Store original state in **userData** for easy reset
- Combine raycasting with **cursor changes** for better UX
- Support **mobile** with touch events
- **Throttle** mousemove for performance
- Can be used for: selection, hover, drag, tooltips, shooting, etc.
- Always **clean up event listeners** when unmounting

## Conclusion

Congratulations on completing all 10 chapters! You now have a solid foundation in three.js:

1. ✅ Basic scene setup
2. ✅ Geometries
3. ✅ Materials
4. ✅ Textures
5. ✅ Lighting
6. ✅ Camera controls
7. ✅ Animation
8. ✅ Shadows
9. ✅ Loading 3D models
10. ✅ Interactive scenes

**Next steps:**
- Build your own projects
- Explore advanced topics (post-processing, physics, particles)
- Join the three.js community
- Check out three.js examples for inspiration

**You're now ready to create amazing 3D experiences on the web!**

## Additional Resources

- [Three.js Raycaster Documentation](https://threejs.org/docs/index.html#api/en/core/Raycaster)
- [Three.js Interactive Examples](https://threejs.org/examples/?q=interactive)
- [Three.js Journey Course](https://threejs-journey.com/)
- [Three.js Discord Community](https://discord.gg/56GBJwAnUS)
- [Three.js Forum](https://discourse.threejs.org/)

**Happy coding! 🚀**
