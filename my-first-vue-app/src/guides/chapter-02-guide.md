# Chapter 2: Geometries

## What You'll Learn
- Exploring built-in three.js geometries
- Understanding geometry parameters
- Positioning objects in 3D space
- Working with multiple objects
- Basic transformations (position, rotation, scale)

## Prerequisites
- Chapter 1: Basic Scene Setup

## Introduction

In this chapter, you're seeing six different 3D shapes rotating on the screen! Three.js provides many built-in geometry types that you can use without having to define vertices and faces manually.

Each colored shape demonstrates a different geometry type:
- Green Box
- Red Sphere
- Cyan Cone
- Yellow Cylinder
- Light Green Torus (donut shape)
- Pink Plane (flat surface)

## Step-by-Step Guide

### Step 1: Understanding Geometries

In three.js, a **geometry** defines the shape of a 3D object. It contains:
- **Vertices**: Points in 3D space
- **Faces**: Triangles that connect vertices
- **UVs**: Texture coordinates (we'll cover this in Chapter 4)
- **Normals**: Directions perpendicular to faces (for lighting)

```javascript
const geometry = new THREE.BoxGeometry(width, height, depth)
```

### Step 2: BoxGeometry - Creating Cubes and Rectangular Boxes

```javascript
const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
const box = new THREE.Mesh(boxGeometry, material)
box.position.set(-4, 2, 0)
scene.add(box)
```

**BoxGeometry** creates rectangular boxes or cubes.

**Parameters:**
- **width**: Size along X-axis (1.5)
- **height**: Size along Y-axis (1.5)
- **depth**: Size along Z-axis (1.5)
- Optional: widthSegments, heightSegments, depthSegments (for subdivision)

### Step 3: SphereGeometry - Creating Spheres

```javascript
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32)
const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.set(0, 2, 0)
```

**SphereGeometry** creates perfect spheres.

**Parameters:**
- **radius**: Size of the sphere (0.8)
- **widthSegments**: Horizontal subdivisions (32) - more = smoother
- **heightSegments**: Vertical subdivisions (32) - more = smoother

**Tip:** Higher segment counts create smoother spheres but use more memory and processing power.

### Step 4: ConeGeometry - Creating Cones

```javascript
const coneGeometry = new THREE.ConeGeometry(0.8, 1.5, 32)
const cone = new THREE.Mesh(coneGeometry, material)
cone.position.set(4, 2, 0)
```

**ConeGeometry** creates cone shapes.

**Parameters:**
- **radius**: Radius of the base (0.8)
- **height**: Height of the cone (1.5)
- **radialSegments**: Number of segments around the circumference (32)

### Step 5: CylinderGeometry - Creating Cylinders

```javascript
const cylinderGeometry = new THREE.CylinderGeometry(0.7, 0.7, 1.5, 32)
const cylinder = new THREE.Mesh(cylinderGeometry, material)
cylinder.position.set(-4, -1.5, 0)
```

**CylinderGeometry** creates cylinders (or truncated cones if radiuses differ).

**Parameters:**
- **radiusTop**: Radius at the top (0.7)
- **radiusBottom**: Radius at the bottom (0.7)
- **height**: Height of the cylinder (1.5)
- **radialSegments**: Segments around the circumference (32)

**Fun fact:** If radiusTop is 0, you get a cone!

### Step 6: TorusGeometry - Creating Donut Shapes

```javascript
const torusGeometry = new THREE.TorusGeometry(0.7, 0.3, 16, 100)
const torus = new THREE.Mesh(torusGeometry, material)
torus.position.set(0, -1.5, 0)
```

**TorusGeometry** creates donut-shaped objects.

**Parameters:**
- **radius**: Radius of the entire torus (0.7)
- **tube**: Radius of the tube (0.3)
- **radialSegments**: Segments along the tube (16)
- **tubularSegments**: Segments around the torus (100)

### Step 7: PlaneGeometry - Creating Flat Surfaces

```javascript
const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(4, -1.5, 0)
plane.material.side = THREE.DoubleSide
```

**PlaneGeometry** creates flat rectangular surfaces.

**Parameters:**
- **width**: Width of the plane (1.5)
- **height**: Height of the plane (1.5)

**Important:** By default, planes are only visible from one side. We set `material.side = THREE.DoubleSide` to make it visible from both sides.

### Step 8: Positioning Objects

```javascript
mesh.position.set(x, y, z)
// or
mesh.position.x = -4
mesh.position.y = 2
mesh.position.z = 0
```

The **position** property uses three.js's Vector3 class:
- **x**: Left/Right (-4 is left, +4 is right)
- **y**: Down/Up (-2 is down, +2 is up)
- **z**: Away/Toward camera (-5 is away, +5 is toward)

### Step 9: Working with Multiple Materials

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
const sphere = new THREE.Mesh(sphereGeometry, material.clone())
sphere.material.color.setHex(0xff6b6b)
```

We use `.clone()` to create independent copies of the material. This lets each object have its own color while sharing the same base material type.

**Changing colors:**
```javascript
mesh.material.color.setHex(0xff6b6b)  // Use hex color
mesh.material.color.setRGB(1, 0, 0)   // Use RGB (0-1 range)
mesh.material.color.set('red')        // Use CSS color name
```

## Code Explanation

### Geometry Segments

The "segments" parameters control how smooth your shapes look:

```javascript
// Low quality (fewer triangles, blocky)
new THREE.SphereGeometry(1, 8, 8)

// High quality (more triangles, smooth)
new THREE.SphereGeometry(1, 64, 64)
```

**Trade-off:** More segments = smoother appearance but slower performance

**Rule of thumb:** Use 32 segments for most objects, 16 for background objects, 64 for hero objects

### Transformations

Every three.js object has three main transformation properties:

1. **position**: Where the object is (Vector3)
2. **rotation**: How the object is rotated (Euler angles in radians)
3. **scale**: How big the object is (Vector3, default is 1,1,1)

```javascript
mesh.position.set(x, y, z)
mesh.rotation.set(x, y, z)
mesh.scale.set(x, y, z)
```

### Managing Multiple Objects

Using an array to track all meshes makes cleanup easy:

```javascript
const meshes = []

// When creating objects
meshes.push(mesh)

// When cleaning up
meshes.forEach(mesh => {
  mesh.geometry.dispose()
  mesh.material.dispose()
})
```

## Other Useful Geometries

Three.js provides many more geometries:

- **TorusKnotGeometry**: Complex knotted shapes
- **IcosahedronGeometry**: 20-sided polyhedron
- **OctahedronGeometry**: 8-sided polyhedron
- **TetrahedronGeometry**: 4-sided polyhedron
- **DodecahedronGeometry**: 12-sided polyhedron
- **RingGeometry**: Flat ring shape
- **TubeGeometry**: Tube following a path
- **LatheGeometry**: Shapes made by rotating a 2D curve
- **ExtrudeGeometry**: Extrude 2D shapes into 3D
- **ShapeGeometry**: Custom 2D shapes
- **TextGeometry**: 3D text (requires a font loader)

## Common Issues & Solutions

**Problem:** Shapes look blocky and angular
- **Solution:** Increase the segment parameters (e.g., 32 instead of 8)

**Problem:** Can't see the plane from certain angles
- **Solution:** Set `material.side = THREE.DoubleSide`

**Problem:** Objects appear in the wrong location
- **Solution:** Check position.set(x, y, z) values. Remember: camera is at (0, 0, positive Z)

**Problem:** All objects have the same color when I try to change them
- **Solution:** Use `.clone()` when creating materials for different objects

**Problem:** Fps drops with many objects
- **Solution:** Reduce segment counts or number of objects

## Challenge

Try modifying the code to:
1. Add a TorusKnotGeometry (look up the documentation!)
2. Change the colors of shapes to your favorite palette
3. Arrange the shapes in a circle instead of a grid
4. Add scale transformations to make some shapes bigger/smaller
5. Create a shape that doesn't rotate (remove it from the meshes array)

**Bonus Challenge:** Create a simple scene (e.g., a snowman using spheres, a house using boxes and cones)

## Key Takeaways

- Three.js provides many **built-in geometries** for common shapes
- **Segment parameters** control smoothness (more segments = smoother but slower)
- **Position** places objects in 3D space using (x, y, z) coordinates
- Use **material.clone()** to give each object independent material properties
- **PlaneGeometry** needs `side: THREE.DoubleSide` to be visible from both sides
- Always **dispose** of geometries and materials to prevent memory leaks

## Next Chapter

In Chapter 3, we'll explore different material types and learn how to control the appearance of your 3D objects beyond just color!

## Additional Resources

- [Three.js Geometry Documentation](https://threejs.org/docs/index.html#api/en/core/BufferGeometry)
- [Three.js Examples - Geometries](https://threejs.org/examples/?q=geometry)
- [BufferGeometry vs Geometry](https://threejs.org/docs/index.html#manual/en/introduction/How-to-update-things)
