# Chapter 8: Shadows

## What You'll Learn
- Enabling shadow casting and receiving
- Configuring shadow map quality
- Shadow properties (mapSize, camera, bias)
- Performance optimization for shadows
- Different shadow map types

## Prerequisites
- Chapter 1: Basic Scene Setup
- Chapter 5: Lighting

## Introduction

Shadows add depth and realism to 3D scenes! In this chapter, you'll see:
- A rotating **red cube** casting shadows
- A bouncing **cyan sphere** with dynamic shadows
- A **gray ground plane** receiving shadows
- Interactive **OrbitControls** to view from different angles

Notice how the shadows move as the objects animate!

## Step-by-Step Guide

### Step 1: Enable Shadows on the Renderer

```javascript
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
```

**Shadow map types:**
- **THREE.BasicShadowMap**: Fast, hard edges
- **THREE.PCFShadowMap**: Smooth, filtered (default)
- **THREE.PCFSoftShadowMap**: Softer, best quality
- **THREE.VSMShadowMap**: Very soft, can have artifacts

**PCFSoftShadowMap** offers the best quality/performance balance.

### Step 2: Enable Shadow Casting on Lights

```javascript
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 8, 3)
directionalLight.castShadow = true
```

Only some lights can cast shadows:
- ✅ DirectionalLight
- ✅ SpotLight
- ✅ PointLight
- ❌ AmbientLight
- ❌ HemisphereLight

### Step 3: Configure Shadow Properties

```javascript
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 50
directionalLight.shadow.camera.left = -10
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.top = 10
directionalLight.shadow.camera.bottom = -10
```

**mapSize**: Shadow texture resolution
- Higher = better quality, worse performance
- Common values: 512, 1024, 2048, 4096
- Must be power of 2

**shadow.camera**: Defines shadow casting area
- For DirectionalLight: OrthographicCamera
- For SpotLight/PointLight: PerspectiveCamera
- Adjust to fit your scene

### Step 4: Enable Shadows on Objects

```javascript
// Object casts shadows
cube.castShadow = true

// Object receives shadows
plane.receiveShadow = true

// Object both casts and receives
sphere.castShadow = true
sphere.receiveShadow = true
```

**castShadow**: Object creates shadows
**receiveShadow**: Shadows appear on object

### Step 5: Shadow Camera Helpers

```javascript
const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(helper)
```

Visualizes the shadow camera's frustum. Useful for debugging shadow coverage!

### Step 6: Adjusting Shadow Bias

```javascript
directionalLight.shadow.bias = -0.001
```

**Bias** fixes shadow acne (artifacts):
- **Too high**: Shadows detach from objects (Peter Panning)
- **Too low**: Shadow acne (speckles)
- **Typical range**: -0.01 to 0.001
- Adjust per scene

### Step 7: Shadow Radius (Soft Shadows)

```javascript
directionalLight.shadow.radius = 4
```

**radius**: Blur amount for PCF shadow maps
- Only works with PCFShadowMap and PCFSoftShadowMap
- Higher = softer shadows
- Typical range: 1-8

### Step 8: Point Light Shadows

```javascript
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(0, 5, 0)
pointLight.castShadow = true

// Configure shadow
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.5
pointLight.shadow.camera.far = 25
```

**Note:** PointLight shadows are expensive (6 shadow maps, one for each direction)!

### Step 9: Spot Light Shadows

```javascript
const spotLight = new THREE.SpotLight(0xffffff, 1)
spotLight.position.set(0, 10, 0)
spotLight.castShadow = true
spotLight.angle = Math.PI / 4

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 0.5
spotLight.shadow.camera.far = 50
spotLight.shadow.camera.fov = 45
```

SpotLight uses PerspectiveCamera for shadows.

## Understanding Shadow Cameras

### DirectionalLight Shadow Camera

```javascript
// Orthographic camera (parallel projection)
light.shadow.camera.left = -10
light.shadow.camera.right = 10
light.shadow.camera.top = 10
light.shadow.camera.bottom = -10
light.shadow.camera.near = 0.5
light.shadow.camera.far = 50
```

**Tips:**
- Make the box as tight as possible around your scene
- Too large: Reduced shadow resolution
- Too small: Shadows get clipped

### SpotLight Shadow Camera

```javascript
// Perspective camera
light.shadow.camera.fov = 50
light.shadow.camera.near = 0.5
light.shadow.camera.far = 50
```

Automatically calculated based on spotlight cone, but can be overridden.

### PointLight Shadow Camera

```javascript
// 6 perspective cameras (one for each direction)
light.shadow.camera.near = 0.5
light.shadow.camera.far = 25
```

Creates cubemap shadow (most expensive).

## Performance Optimization

### 1. Limit Shadow-Casting Objects

```javascript
// Only important objects cast shadows
mainCharacter.castShadow = true
smallProp.castShadow = false
```

### 2. Reduce Shadow Map Size

```javascript
// Lower resolution for less important lights
secondaryLight.shadow.mapSize.width = 512
secondaryLight.shadow.mapSize.height = 512
```

### 3. Limit Shadow Distance

```javascript
// Shadows only render within this range
light.shadow.camera.far = 25
```

### 4. Use Fewer Shadow-Casting Lights

```javascript
// Only 1-2 lights cast shadows
keyLight.castShadow = true
fillLight.castShadow = false  // No shadows
ambientLight.castShadow = false  // Can't cast shadows anyway
```

### 5. Bake Shadows for Static Objects

For static scenes, pre-render shadows into textures instead of real-time calculation.

## Common Issues & Solutions

**Problem:** No shadows appear
- **Solution:** Enable `renderer.shadowMap.enabled = true`
- **Solution:** Set `light.castShadow = true`
- **Solution:** Set `object.castShadow = true` and `plane.receiveShadow = true`

**Problem:** Shadows are blocky/pixelated
- **Solution:** Increase `shadow.mapSize.width/height` (2048 or 4096)

**Problem:** Shadows are cut off
- **Solution:** Adjust shadow camera bounds (left, right, top, bottom, far)
- **Solution:** Use CameraHelper to visualize shadow camera

**Problem:** Shadow acne (speckles/stripes)
- **Solution:** Adjust `shadow.bias` (try -0.001 to -0.005)
- **Solution:** Increase `shadow.camera.near`

**Problem:** Peter Panning (shadows detached from objects)
- **Solution:** Reduce `shadow.bias` (closer to 0)

**Problem:** Poor performance
- **Solution:** Reduce shadow map size (1024 or 512)
- **Solution:** Limit number of shadow-casting lights
- **Solution:** Disable shadows on distant objects
- **Solution:** Avoid PointLight shadows (use SpotLight instead)

**Problem:** Shadows too hard/sharp
- **Solution:** Use `THREE.PCFSoftShadowMap`
- **Solution:** Increase `shadow.radius` (4-8)

## Shadow Quality Comparison

### Low Quality (Fast)
```javascript
renderer.shadowMap.type = THREE.BasicShadowMap
light.shadow.mapSize.width = 512
light.shadow.mapSize.height = 512
```

### Medium Quality (Balanced)
```javascript
renderer.shadowMap.type = THREE.PCFShadowMap
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
```

### High Quality (Slow)
```javascript
renderer.shadowMap.type = THREE.PCFSoftShadowMap
light.shadow.mapSize.width = 2048
light.shadow.mapSize.height = 2048
light.shadow.radius = 4
```

## Challenge

Try modifying the code to:
1. Add another light that casts shadows
2. Adjust shadow camera bounds using CameraHelper
3. Experiment with different shadow map types
4. Change shadow bias to see shadow acne
5. Make the ground plane cast shadows too

**Bonus Challenge:** Create a scene with multiple objects casting shadows on each other, optimized for performance

## Key Takeaways

- Enable shadows: **renderer.shadowMap.enabled = true**
- Only DirectionalLight, SpotLight, and PointLight can cast shadows
- Objects need **castShadow** to create shadows
- Objects need **receiveShadow** to show shadows
- **Shadow map size** affects quality (1024-2048 typical)
- **Shadow camera** bounds must fit your scene
- Use **CameraHelper** to debug shadow coverage
- **Bias** fixes shadow artifacts
- **PointLight shadows are expensive** (6 shadow maps)
- Optimize by limiting shadow-casting objects and lights

## Next Chapter

In Chapter 9, we'll learn how to load external 3D models using the GLTF format!

## Additional Resources

- [Three.js Shadow Documentation](https://threejs.org/docs/index.html#api/en/lights/shadows/LightShadow)
- [Shadow Map Types](https://threejs.org/examples/?q=shadow)
- [Shadow Mapping Explained](https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping)
