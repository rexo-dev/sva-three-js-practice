# Chapter 3: Materials

## What You'll Learn
- Understanding different material types in three.js
- MeshBasicMaterial vs MeshStandardMaterial vs MeshPhongMaterial
- Material properties (color, wireframe, opacity, roughness, metalness)
- When to use which material
- How materials interact with lighting

## Prerequisites
- Chapter 1: Basic Scene Setup
- Chapter 2: Geometries

## Introduction

Materials define how the surface of your 3D objects appear. In this chapter, you're seeing six spheres, each demonstrating a different material type or property:

1. **Red Sphere** - MeshBasicMaterial (flat color, no lighting)
2. **Rainbow Sphere** - MeshNormalMaterial (shows geometry normals)
3. **Cyan Sphere** - MeshStandardMaterial (realistic, physically-based)
4. **Yellow Sphere** - Wireframe (shows the mesh structure)
5. **Green Sphere** - Transparent material
6. **Pink Sphere** - MeshPhongMaterial (shiny, glossy)

## Step-by-Step Guide

### Step 1: Understanding Materials

A **material** determines:
- **Color**: What color the surface is
- **Lighting response**: How it reacts to lights
- **Transparency**: Can you see through it?
- **Surface properties**: Rough, smooth, metallic, glossy?
- **Rendering mode**: Solid, wireframe, or points?

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0xff6b6b })
const mesh = new THREE.Mesh(geometry, material)
```

### Step 2: MeshBasicMaterial - Simple and Fast

```javascript
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b })
const basicSphere = new THREE.Mesh(geometry, basicMaterial)
```

**MeshBasicMaterial** is the simplest material. It:
- Shows solid colors
- **Does NOT react to lights** (always fully visible)
- Very fast to render
- Perfect for: UI elements, debug objects, unlit scenes

**Use when:** You want consistent color regardless of lighting, or for maximum performance.

### Step 3: MeshNormalMaterial - Debugging Normals

```javascript
const normalMaterial = new THREE.MeshNormalMaterial()
const normalSphere = new THREE.Mesh(geometry, normalMaterial)
```

**MeshNormalMaterial** displays the geometry's normal vectors as RGB colors:
- Red = X-axis normals
- Green = Y-axis normals
- Blue = Z-axis normals

**Use when:** Debugging geometry, checking if normals are correct, creating artistic rainbow effects.

**Note:** This material doesn't need lighting or color properties.

### Step 4: MeshStandardMaterial - Physically Based Rendering (PBR)

```javascript
const standardMaterial = new THREE.MeshStandardMaterial({
  color: 0x4ecdc4,
  roughness: 0.5,
  metalness: 0.5,
})
```

**MeshStandardMaterial** is the most realistic material using PBR principles:
- **Requires lighting** to be visible
- **roughness**: 0 (mirror-smooth) to 1 (completely rough)
- **metalness**: 0 (non-metal) to 1 (full metal)
- Based on real-world physics

**Use when:** You want realistic materials (wood, plastic, metal, etc.).

**Properties:**
- **color**: Base color
- **roughness**: How rough the surface is
- **metalness**: How metallic the surface is
- **emissive**: Color the object emits (glows)
- **emissiveIntensity**: Strength of the glow

**Examples:**
```javascript
// Plastic
new THREE.MeshStandardMaterial({
  color: 0xff0000,
  roughness: 0.7,
  metalness: 0.0
})

// Polished metal
new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  roughness: 0.2,
  metalness: 1.0
})

// Wood
new THREE.MeshStandardMaterial({
  color: 0x8b4513,
  roughness: 0.9,
  metalness: 0.0
})
```

### Step 5: Wireframe Mode

```javascript
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffe66d,
  wireframe: true,
})
```

Setting **wireframe: true** on any material makes it show only the edges of triangles.

**Use when:** Debugging geometry, artistic effects, showing mesh topology.

**Works with:** Any material type (MeshBasicMaterial, MeshStandardMaterial, etc.)

### Step 6: Transparent Materials

```javascript
const transparentMaterial = new THREE.MeshBasicMaterial({
  color: 0xa8e6cf,
  transparent: true,
  opacity: 0.6,
})
```

To make a material see-through:
1. Set **transparent: true**
2. Set **opacity**: 0 (invisible) to 1 (fully opaque)

**Important:** Transparency can cause rendering order issues. Three.js tries to sort transparent objects, but sometimes you need to manually control rendering order.

**Use when:** Glass, water, ghosts, UI overlays, fade effects.

### Step 7: MeshPhongMaterial - Shiny and Glossy

```javascript
const phongMaterial = new THREE.MeshPhongMaterial({
  color: 0xff8b94,
  shininess: 100,
})
```

**MeshPhongMaterial** creates shiny, glossy surfaces:
- **Requires lighting**
- **shininess**: 0 (not shiny) to 100+ (very shiny)
- Creates specular highlights (bright spots where light reflects)
- Older than MeshStandardMaterial but still useful

**Use when:** You want obvious shiny highlights (plastic, glossy paint, wet surfaces).

**MeshPhongMaterial vs MeshStandardMaterial:**
- **Phong**: Simpler, faster, more obvious highlights
- **Standard**: More realistic, PBR-based, better for realistic scenes

### Step 8: Adding Lights for Materials

```javascript
// Ambient light - illuminates everything equally
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Directional light - like sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)
```

**Important:** MeshStandardMaterial and MeshPhongMaterial **require lights** to be visible!

**Materials that DON'T need lights:**
- MeshBasicMaterial
- MeshNormalMaterial

**Materials that DO need lights:**
- MeshStandardMaterial
- MeshPhongMaterial
- MeshLambertMaterial
- MeshToonMaterial

## Other Material Types

Three.js provides more specialized materials:

### MeshLambertMaterial
```javascript
new THREE.MeshLambertMaterial({ color: 0xff0000 })
```
- Non-shiny, matte surfaces
- Faster than Phong
- Good for: Clay, matte paint, fabric

### MeshToonMaterial
```javascript
new THREE.MeshToonMaterial({ color: 0xff0000 })
```
- Cartoon/cel-shaded look
- Requires lighting
- Good for: Stylized games, animations

### MeshMatcapMaterial
```javascript
new THREE.MeshMatcapMaterial({ matcap: texture })
```
- Uses a "matcap" texture to fake lighting
- No lights needed
- Very fast
- Good for: Baked lighting looks, stylized scenes

### MeshDepthMaterial
```javascript
new THREE.MeshDepthMaterial()
```
- Shows depth (distance from camera)
- Good for: Depth visualization, fog effects

## Common Material Properties

All materials share some common properties:

```javascript
material.side = THREE.FrontSide  // Default - only front visible
material.side = THREE.BackSide   // Only back visible
material.side = THREE.DoubleSide // Both sides visible

material.transparent = true
material.opacity = 0.5           // 0 to 1

material.visible = false         // Hide the object

material.wireframe = true        // Show as wireframe

material.flatShading = true      // Faceted look (no smooth shading)
```

## Code Explanation

### Material Construction

Materials can be configured during creation or modified afterward:

```javascript
// Method 1: Configure during creation
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  roughness: 0.5,
  metalness: 0.5,
})

// Method 2: Modify after creation
const material = new THREE.MeshStandardMaterial()
material.color.set(0xff0000)
material.roughness = 0.5
material.metalness = 0.5
material.needsUpdate = true  // Tell three.js to update
```

### Color Formats

You can set colors in multiple ways:

```javascript
material.color.set(0xff0000)      // Hex number
material.color.set('#ff0000')     // Hex string
material.color.set('red')         // CSS color name
material.color.set('rgb(255,0,0)') // RGB string
material.color.setRGB(1, 0, 0)    // RGB values (0-1)
material.color.setHSL(0, 1, 0.5)  // HSL values
```

### Performance Considerations

**Fastest to slowest (approximately):**
1. MeshBasicMaterial (no lighting calculations)
2. MeshLambertMaterial (simple lighting)
3. MeshPhongMaterial (specular highlights)
4. MeshStandardMaterial (full PBR)

**Tip:** Use simpler materials for objects that are:
- Far from the camera
- Unimportant to the scene
- Numerous (like particles)

## Common Issues & Solutions

**Problem:** MeshStandardMaterial sphere appears black
- **Solution:** Add lights to the scene! This material requires lighting.

**Problem:** Transparent material shows weird overlapping artifacts
- **Solution:** Try adjusting the rendering order: `mesh.renderOrder = 1`
- **Solution:** Ensure transparent objects are rendered after opaque ones

**Problem:** Material changes don't appear
- **Solution:** Set `material.needsUpdate = true` after changing certain properties

**Problem:** Wireframe looks blocky
- **Solution:** Increase the geometry's segment parameters for smoother wireframes

**Problem:** Material looks flat/unrealistic
- **Solution:** Use MeshStandardMaterial with appropriate roughness/metalness values
- **Solution:** Add better lighting to the scene

## Challenge

Try modifying the code to:
1. Create a completely transparent sphere (opacity = 0.2)
2. Make a sphere that glows (use emissive property)
3. Create a highly metallic, mirror-like sphere (metalness = 1, roughness = 0)
4. Change a sphere to have flat shading (flatShading = true)
5. Experiment with different shininess values on the Phong material

**Bonus Challenge:** Create materials that look like real-world objects: gold, rubber, glass, wood.

## Key Takeaways

- **MeshBasicMaterial**: Fast, no lighting needed, solid colors
- **MeshStandardMaterial**: Realistic, PBR-based, needs lighting
- **MeshPhongMaterial**: Shiny highlights, needs lighting
- **MeshNormalMaterial**: Shows geometry normals, useful for debugging
- **wireframe: true**: Shows mesh triangles
- **transparent + opacity**: Makes see-through materials
- **Some materials require lights** (Standard, Phong) while others don't (Basic, Normal)
- Always **dispose** of materials when done: `material.dispose()`

## Next Chapter

In Chapter 4, we'll learn how to apply textures to materials, bringing images and patterns to your 3D objects!

## Additional Resources

- [Three.js Material Documentation](https://threejs.org/docs/index.html#api/en/materials/Material)
- [PBR Guide](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)
- [Three.js Material Examples](https://threejs.org/examples/?q=material)
