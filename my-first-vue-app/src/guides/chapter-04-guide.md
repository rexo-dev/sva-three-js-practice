# Chapter 4: Textures

## What You'll Learn
- Loading and applying textures to materials
- Understanding UV mapping
- Texture properties (repeat, offset, wrapping)
- Creating procedural textures with Canvas
- Different texture types (map, normalMap, roughnessMap, etc.)

## Prerequisites
- Chapter 1: Basic Scene Setup
- Chapter 2: Geometries
- Chapter 3: Materials

## Introduction

Textures add detail and realism to 3D objects by mapping images onto their surfaces. In this chapter, you're seeing a rotating cube with a checkerboard texture and a plane with the same texture repeated multiple times.

Textures can be:
- **Image files** (PNG, JPG, etc.)
- **Procedurally generated** (created with code/canvas, like our checkerboard)
- **Video streams**
- **Canvas elements**

## Step-by-Step Guide

### Step 1: Understanding Textures

A **texture** is an image that gets wrapped around a 3D geometry. The process of mapping a 2D image onto a 3D surface is called **UV mapping**.

```javascript
const texture = new THREE.TextureLoader().load('/path/to/image.jpg')
const material = new THREE.MeshBasicMaterial({ map: texture })
```

### Step 2: Creating a Procedural Texture with Canvas

```javascript
const textureCanvas = document.createElement('canvas')
textureCanvas.width = 256
textureCanvas.height = 256
const ctx = textureCanvas.getContext('2d')

// Draw a checkerboard pattern
const squareSize = 32
for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    ctx.fillStyle = (i + j) % 2 === 0 ? '#ff6b6b' : '#4ecdc4'
    ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
  }
}

const texture = new THREE.CanvasTexture(textureCanvas)
```

**CanvasTexture** creates a texture from an HTML canvas element. This is great for:
- Dynamically generated textures
- Text rendering on 3D objects
- Real-time updates
- Procedural patterns

### Step 3: Applying Texture to Material

```javascript
const material = new THREE.MeshBasicMaterial({ map: texture })
const cube = new THREE.Mesh(geometry, material)
```

The **map** property of a material is where you apply the color/diffuse texture.

### Step 4: Loading External Images

```javascript
const textureLoader = new THREE.TextureLoader()

// Method 1: Simple loading
const texture = textureLoader.load('/textures/wood.jpg')

// Method 2: With callbacks
textureLoader.load(
  '/textures/wood.jpg',
  // onLoad
  (texture) => {
    console.log('Texture loaded!')
  },
  // onProgress
  (progress) => {
    console.log('Loading:', (progress.loaded / progress.total * 100) + '%')
  },
  // onError
  (error) => {
    console.error('Error loading texture:', error)
  }
)
```

### Step 5: Texture Wrapping

```javascript
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(3, 3)
texture.needsUpdate = true
```

**Wrapping modes:**
- **THREE.RepeatWrapping**: Texture repeats (tiles)
- **THREE.ClampToEdgeWrapping**: Edge pixels extend (default)
- **THREE.MirroredRepeatWrapping**: Texture repeats with mirroring

**wrapS**: Horizontal wrapping (U direction)
**wrapT**: Vertical wrapping (V direction)

**repeat**: How many times to repeat the texture

### Step 6: Texture Transformation

```javascript
// Repeat the texture
texture.repeat.set(2, 3)  // 2x horizontal, 3x vertical

// Offset the texture
texture.offset.set(0.5, 0.5)  // Shift by half

// Rotate the texture (in radians)
texture.rotation = Math.PI / 4  // 45 degrees

// Set rotation center
texture.center.set(0.5, 0.5)  // Center of the texture
```

### Step 7: Texture Filtering

```javascript
// Magnification filter (when texture is stretched)
texture.magFilter = THREE.LinearFilter  // Smooth (default)
texture.magFilter = THREE.NearestFilter // Pixelated

// Minification filter (when texture is shrunk)
texture.minFilter = THREE.LinearMipmapLinearFilter  // Smooth (default)
texture.minFilter = THREE.NearestFilter  // Pixelated
```

**Use NearestFilter for:**
- Pixel art
- Retro games
- Sharp, non-blurred textures

### Step 8: Understanding UV Coordinates

**UV coordinates** map 2D textures to 3D surfaces:
- **U**: Horizontal axis (0 to 1, left to right)
- **V**: Vertical axis (0 to 1, bottom to top)

Most three.js geometries come with pre-defined UVs. For custom geometries, you need to define them:

```javascript
const geometry = new THREE.BufferGeometry()
// ... define vertices ...

// Define UVs
const uvs = new Float32Array([
  0, 0,  // Bottom-left
  1, 0,  // Bottom-right
  1, 1,  // Top-right
  0, 1,  // Top-left
])
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
```

## Different Texture Types

Three.js materials support multiple texture maps:

```javascript
const material = new THREE.MeshStandardMaterial({
  map: colorTexture,              // Base color
  normalMap: normalTexture,       // Surface detail (bumps)
  roughnessMap: roughnessTexture, // Roughness variation
  metalnessMap: metalnessTexture, // Metalness variation
  aoMap: aoTexture,               // Ambient occlusion (shadows)
  displacementMap: dispTexture,   // Actual geometry displacement
  emissiveMap: emissiveTexture,   // Glowing parts
  alphaMap: alphaTexture,         // Transparency
})
```

### Common Texture Maps

1. **map** (Color/Diffuse): Base color of the material
2. **normalMap**: Adds surface detail without extra geometry
3. **roughnessMap**: Controls shininess across the surface
4. **metalnessMap**: Controls metallic properties
5. **aoMap**: Adds contact shadows and depth
6. **displacementMap**: Actually moves vertices (needs subdivided geometry)
7. **emissiveMap**: Makes parts of the object glow
8. **alphaMap**: Controls transparency per-pixel

## Loading Multiple Textures

```javascript
const textureLoader = new THREE.TextureLoader()
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => console.log('Loading started')
loadingManager.onLoad = () => console.log('Loading complete')
loadingManager.onProgress = (url, loaded, total) => {
  console.log(`Loading: ${loaded}/${total}`)
}

const loader = new THREE.TextureLoader(loadingManager)

const colorTexture = loader.load('/textures/color.jpg')
const normalTexture = loader.load('/textures/normal.jpg')
const roughnessTexture = loader.load('/textures/roughness.jpg')
```

## Performance Tips

1. **Use power-of-2 dimensions**: 256x256, 512x512, 1024x1024, 2048x2048
   - Required for mipmaps
   - Better GPU performance

2. **Compress textures**: Use JPG for photos, PNG for transparency

3. **Appropriate resolution**:
   - Small objects: 512x512
   - Medium objects: 1024x1024
   - Large/hero objects: 2048x2048

4. **Dispose textures** when done:
   ```javascript
   texture.dispose()
   ```

5. **Reuse textures**: Don't load the same texture multiple times

## Common Issues & Solutions

**Problem:** Texture appears blurry
- **Solution:** Increase texture resolution or use NearestFilter

**Problem:** Texture doesn't repeat
- **Solution:** Set wrapS and wrapT to RepeatWrapping

**Problem:** Texture appears black or doesn't load
- **Solution:** Check file path, check console for errors
- **Solution:** Ensure texture loads before using (use callbacks)

**Problem:** Texture looks stretched or distorted
- **Solution:** Check UV mapping, ensure correct aspect ratio

**Problem:** Performance issues with large textures
- **Solution:** Reduce texture resolution, use texture compression

## Challenge

Try modifying the code to:
1. Create a different pattern (stripes, dots, gradient)
2. Change the repeat values to tile the texture more or less
3. Animate the texture offset to make it scroll
4. Add rotation to the plane's texture
5. Try loading an external image (you'll need to add an image to public folder)

**Bonus Challenge:** Create a texture that updates in real-time (e.g., drawing on canvas based on time)

## Key Takeaways

- **Textures** map 2D images onto 3D surfaces
- **TextureLoader** loads image files
- **CanvasTexture** creates textures from HTML canvas (great for procedural content)
- **UV coordinates** control how textures map to geometry
- **Wrapping modes** control tiling behavior
- **repeat** and **offset** transform texture placement
- Always use **power-of-2 dimensions** for best performance
- **Dispose** textures to prevent memory leaks

## Next Chapter

In Chapter 5, we'll explore different types of lights and learn how to illuminate your scenes realistically!

## Additional Resources

- [Three.js Texture Documentation](https://threejs.org/docs/index.html#api/en/textures/Texture)
- [UV Mapping Explained](https://en.wikipedia.org/wiki/UV_mapping)
- [Free Texture Resources](https://polyhaven.com/textures)
