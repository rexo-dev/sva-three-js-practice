# Chapter 5: Lighting

## What You'll Learn
- Different light types in three.js
- AmbientLight, DirectionalLight, PointLight, SpotLight
- Light properties (color, intensity, distance)
- How lights affect different materials
- Creating realistic lighting setups

## Prerequisites
- Chapter 1: Basic Scene Setup
- Chapter 3: Materials

## Introduction

Lighting is crucial for creating realistic 3D scenes. In this chapter, you're seeing a white sphere illuminated by multiple colored lights that move around:
- **Ambient light** provides base illumination
- **Red directional light** (like sunlight) from top-right
- **Blue point light** orbiting around
- **Green spotlight** swinging back and forth

Notice how the colored lights blend on the sphere's surface!

## Step-by-Step Guide

### Step 1: AmbientLight - Soft Overall Illumination

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)
```

**AmbientLight** illuminates all objects equally from all directions:
- **color**: Light color (0xffffff = white)
- **intensity**: Brightness (0.3 = 30%)

**Use when:** You need base illumination to prevent pure black shadows

**Characteristics:**
- No position or direction
- Illuminates everything equally
- Soft, shadowless light
- Often combined with other lights

### Step 2: DirectionalLight - Like Sunlight

```javascript
const directionalLight = new THREE.DirectionalLight(0xff0000, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)
```

**DirectionalLight** emits parallel rays from a specific direction (like the sun):
- **color**: Light color (0xff0000 = red)
- **intensity**: Brightness (1 = 100%)
- **position**: Direction light comes from

**Use when:** Simulating sunlight, moonlight, or any distant light source

**Characteristics:**
- Rays are parallel (no falloff with distance)
- Can cast shadows
- Position determines direction, not intensity

### Step 3: PointLight - Like a Light Bulb

```javascript
const pointLight = new THREE.PointLight(0x0000ff, 1, 10)
pointLight.position.set(-3, 2, 2)
scene.add(pointLight)
```

**PointLight** emits light in all directions from a single point:
- **color**: Light color (0x0000ff = blue)
- **intensity**: Brightness
- **distance**: How far light reaches (0 = infinite)
- **decay**: How quickly light fades (2 = physically accurate)

**Use when:** Light bulbs, candles, torches, explosions

**Characteristics:**
- Emits in all directions
- Light intensity decreases with distance
- Can cast shadows

### Step 4: SpotLight - Like a Flashlight

```javascript
const spotLight = new THREE.SpotLight(0x00ff00, 1)
spotLight.position.set(0, 5, 0)
spotLight.angle = Math.PI / 6  // 30 degrees
spotLight.penumbra = 0.2  // Soft edges
spotLight.target = sphere
scene.add(spotLight)
```

**SpotLight** emits light in a cone from a position:
- **color**: Light color (0x00ff00 = green)
- **intensity**: Brightness
- **distance**: Maximum range
- **angle**: Cone angle in radians
- **penumbra**: Edge softness (0-1)
- **decay**: Light falloff
- **target**: Object or position to point at

**Use when:** Flashlights, stage lights, car headlights

**Characteristics:**
- Cone-shaped light
- Has position and direction
- Can cast shadows

### Step 5: HemisphereLight - Sky and Ground

```javascript
const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0xff0000, 0.5)
scene.add(hemisphereLight)
```

**HemisphereLight** has different colors for sky and ground:
- **skyColor**: Color from above
- **groundColor**: Color from below
- **intensity**: Brightness

**Use when:** Outdoor scenes with sky and ground reflection

### Step 6: Light Helpers - Visualizing Lights

```javascript
// Point light helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
scene.add(pointLightHelper)

// Spot light helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

// Directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
scene.add(directionalLightHelper)
```

**Helpers** show where lights are positioned and their direction.

### Step 7: Animating Lights

```javascript
function animate() {
  const time = Date.now() * 0.001

  // Move point light in a circle
  pointLight.position.x = Math.cos(time) * 4
  pointLight.position.z = Math.sin(time) * 4

  // Move spotlight side to side
  spotLight.position.x = Math.sin(time * 0.7) * 3

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
```

### Step 8: Light Properties

All lights share common properties:

```javascript
light.color.set(0xff0000)  // Change color
light.intensity = 0.5       // Change brightness
light.visible = false       // Hide light
```

**Color** can be set multiple ways:
```javascript
light.color.set(0xff0000)      // Hex number
light.color.set('#ff0000')     // Hex string
light.color.set('red')         // CSS name
light.color.setRGB(1, 0, 0)    // RGB (0-1)
```

## Materials and Lighting

**Materials that DON'T need lights:**
- MeshBasicMaterial
- MeshNormalMaterial

**Materials that DO need lights:**
- MeshLambertMaterial (matte, diffuse only)
- MeshPhongMaterial (shiny, with specular highlights)
- MeshStandardMaterial (PBR, most realistic)
- MeshToonMaterial (cartoon shading)

## Creating Realistic Lighting Setups

### Three-Point Lighting (Classic)

```javascript
// Key light (main light, bright)
const keyLight = new THREE.DirectionalLight(0xffffff, 1)
keyLight.position.set(5, 5, 5)
scene.add(keyLight)

// Fill light (softer, opposite side)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
fillLight.position.set(-5, 3, -5)
scene.add(fillLight)

// Back light (rim light, from behind)
const backLight = new THREE.DirectionalLight(0xffffff, 0.7)
backLight.position.set(0, 5, -5)
scene.add(backLight)

// Ambient (soft overall)
const ambient = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambient)
```

### Outdoor Scene

```javascript
// Sun
const sun = new THREE.DirectionalLight(0xffffff, 1)
sun.position.set(10, 20, 10)
sun.castShadow = true
scene.add(sun)

// Sky light
const sky = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.6)
scene.add(sky)

// Ambient
const ambient = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambient)
```

### Indoor Scene

```javascript
// Ceiling lights
for (let i = 0; i < 4; i++) {
  const light = new THREE.PointLight(0xffffff, 0.5, 10)
  light.position.set(
    (i % 2) * 4 - 2,
    3,
    Math.floor(i / 2) * 4 - 2
  )
  scene.add(light)
}

// Window light
const windowLight = new THREE.DirectionalLight(0xffffee, 0.5)
windowLight.position.set(-5, 5, 0)
scene.add(windowLight)

// Ambient
const ambient = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambient)
```

## Performance Tips

1. **Limit number of lights**: Each light affects performance
   - Maximum 2-4 lights for mobile
   - 4-8 lights for desktop

2. **Use AmbientLight instead of many weak lights**

3. **Bake lighting into textures** for static scenes

4. **Disable shadows** on non-essential lights

## Common Issues & Solutions

**Problem:** Scene is completely black
- **Solution:** Add an AmbientLight or DirectionalLight
- **Solution:** Check if material needs lighting (MeshStandardMaterial does)

**Problem:** Lights have no effect
- **Solution:** Use a material that responds to lights (not MeshBasicMaterial)

**Problem:** Lighting looks flat
- **Solution:** Use multiple lights from different angles
- **Solution:** Reduce AmbientLight intensity

**Problem:** Poor performance
- **Solution:** Reduce number of lights
- **Solution:** Increase light distance limits

**Problem:** Spotlight doesn't point correctly
- **Solution:** Set the target property: `spotLight.target = object`

## Challenge

Try modifying the code to:
1. Add more lights with different colors
2. Create a sunrise/sunset effect (change light color over time)
3. Make lights pulse (animate intensity with sine wave)
4. Position lights in different patterns (grid, circle, random)
5. Create a disco ball effect with multiple colored point lights

**Bonus Challenge:** Implement a day/night cycle with changing light colors and intensities

## Key Takeaways

- **AmbientLight**: Soft overall illumination, no shadows
- **DirectionalLight**: Parallel rays like sunlight, can cast shadows
- **PointLight**: Omnidirectional like a bulb, decreases with distance
- **SpotLight**: Cone-shaped like a flashlight, has target and angle
- **HemisphereLight**: Different colors from above and below
- Use **light helpers** for debugging light positions
- Most materials require lights except **MeshBasicMaterial** and **MeshNormalMaterial**
- Limit number of lights for performance
- Combine multiple lights for realistic scenes

## Next Chapter

In Chapter 6, we'll add interactive camera controls using OrbitControls, allowing you to freely explore your 3D scenes!

## Additional Resources

- [Three.js Lighting Documentation](https://threejs.org/docs/index.html#api/en/lights/Light)
- [Three-Point Lighting](https://en.wikipedia.org/wiki/Three-point_lighting)
- [Three.js Lighting Examples](https://threejs.org/examples/?q=light)
