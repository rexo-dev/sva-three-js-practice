# Chapter 7: Animation

## What You'll Learn
- Creating smooth time-based animations
- Using THREE.Clock for consistent timing
- Different animation techniques (rotation, position, scale)
- Mathematical functions for animation (sine, cosine)
- Frame-independent animation

## Prerequisites
- Chapter 1: Basic Scene Setup

## Introduction

Animation brings your 3D scenes to life! Watch the three objects:
- **Red Cube**: Simple rotation
- **Cyan Sphere**: Bouncing up and down
- **Yellow Torus**: Orbital movement in a circle

Each uses different animation techniques to create unique motion patterns.

## Step-by-Step Guide

### Step 1: The Animation Loop

```javascript
function animate() {
  requestAnimationFrame(animate)

  // Animation code here

  renderer.render(scene, camera)
}

animate()  // Start the loop
```

**requestAnimationFrame()** calls your function ~60 times per second (60 FPS).

### Step 2: Using THREE.Clock for Time-Based Animation

```javascript
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()

  // Use elapsedTime for animations

  renderer.render(scene, camera)
}
```

**THREE.Clock** tracks time accurately:
- **getElapsedTime()**: Total seconds since clock started
- **getDelta()**: Seconds since last call (frame time)

**Why use Clock?** Frame rate varies between devices. Time-based animation ensures consistent speed regardless of FPS.

### Step 3: Simple Rotation Animation

```javascript
cube.rotation.x = elapsedTime
cube.rotation.y = elapsedTime * 0.5
```

Directly using elapsedTime creates smooth, continuous rotation:
- **elapsedTime**: 1 radian per second
- **elapsedTime * 0.5**: 0.5 radians per second (slower)
- **elapsedTime * 2**: 2 radians per second (faster)

**Rotation is in radians:**
- 2π radians = 360 degrees
- π radians = 180 degrees
- π/2 radians = 90 degrees

### Step 4: Bouncing Animation with Sine Wave

```javascript
sphere.position.y = Math.sin(elapsedTime * 2) * 2
```

**Math.sin()** creates oscillating (back-and-forth) motion:
- Output range: -1 to +1
- Multiply by 2: -2 to +2 (amplitude)
- **elapsedTime * 2**: Speed (higher = faster)

**Sine wave patterns:**
```javascript
// Slow bounce
position.y = Math.sin(elapsedTime) * 1

// Fast bounce
position.y = Math.sin(elapsedTime * 5) * 1

// Big bounce
position.y = Math.sin(elapsedTime) * 4
```

### Step 5: Circular (Orbital) Animation

```javascript
const radius = 1.5
torus.position.y = Math.sin(elapsedTime) * radius
torus.position.z = Math.cos(elapsedTime) * radius
```

**Combining sine and cosine** creates circular motion:
- **sin()**: Vertical movement
- **cos()**: Horizontal movement
- **radius**: Size of the circle

**Understanding:**
- At time 0: sin(0)=0, cos(0)=1 → position (0, 1)
- At time π/2: sin(π/2)=1, cos(π/2)=0 → position (1, 0)
- Traces a perfect circle!

### Step 6: Complex Animations

**Figure-8 pattern:**
```javascript
object.position.x = Math.sin(time) * 3
object.position.y = Math.sin(time * 2) * 2
```

**Spiral:**
```javascript
const angle = time
const radius = time * 0.5
object.position.x = Math.cos(angle) * radius
object.position.z = Math.sin(angle) * radius
object.position.y = time
```

**Pulsing scale:**
```javascript
const scale = 1 + Math.sin(time * 3) * 0.3
object.scale.set(scale, scale, scale)
```

### Step 7: Delta Time for Frame-Independent Movement

```javascript
const clock = new THREE.Clock()

function animate() {
  const deltaTime = clock.getDelta()

  // Move 2 units per second regardless of FPS
  object.position.x += 2 * deltaTime

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
```

**getDelta()** returns seconds since last frame:
- 60 FPS: ~0.0167 seconds
- 30 FPS: ~0.033 seconds

Multiply movement by deltaTime for consistent speed across all devices!

### Step 8: Easing Functions

Easing creates more natural-feeling animations:

```javascript
// Ease in (slow start, fast end)
const t = Math.pow(progress, 2)

// Ease out (fast start, slow end)
const t = 1 - Math.pow(1 - progress, 2)

// Ease in-out (slow start and end)
const t = progress < 0.5
  ? 2 * progress * progress
  : 1 - Math.pow(-2 * progress + 2, 2) / 2

// Apply to position
object.position.x = startX + (endX - startX) * t
```

### Step 9: Animating Camera

```javascript
// Gentle camera sway
camera.position.y = 5 + Math.sin(elapsedTime * 0.5) * 0.5

// Camera orbiting around origin
const radius = 10
camera.position.x = Math.cos(elapsedTime * 0.5) * radius
camera.position.z = Math.sin(elapsedTime * 0.5) * radius
camera.lookAt(0, 0, 0)
```

### Step 10: Combining Animations

```javascript
// Rotate while moving in a circle
object.position.x = Math.cos(time) * 5
object.position.z = Math.sin(time) * 5
object.rotation.y = time * 2

// Bounce while rotating
object.position.y = Math.abs(Math.sin(time * 2)) * 3
object.rotation.x = time
object.rotation.z = time * 0.5
```

## Animation Techniques

### 1. Direct Time-Based

```javascript
object.rotation.y = elapsedTime
```

**Pros:** Simple, continuous
**Cons:** No control over start/stop

### 2. Incremental

```javascript
object.rotation.y += 0.01
```

**Pros:** Simple
**Cons:** Frame-dependent (varies with FPS)

### 3. Delta Time

```javascript
object.rotation.y += speed * deltaTime
```

**Pros:** Frame-independent
**Cons:** Slightly more complex

### 4. Tween Libraries

```javascript
// Using GSAP (example)
gsap.to(object.position, {
  x: 5,
  duration: 2,
  ease: "power2.inOut"
})
```

**Pros:** Powerful, easy easing
**Cons:** External dependency

## Useful Math Functions

### Math.sin() and Math.cos()
```javascript
// Oscillate between -1 and 1
Math.sin(time)

// Phase shift (offset in time)
Math.sin(time + Math.PI)
```

### Math.abs()
```javascript
// Always positive (bounce without going negative)
Math.abs(Math.sin(time))
```

### Math.min() and Math.max()
```javascript
// Clamp value between min and max
const clamped = Math.max(min, Math.min(value, max))
```

### Modulo (%)
```javascript
// Loop value between 0 and max
const looped = (time * speed) % maxValue
```

## Performance Tips

1. **Limit animated objects**: Each animated object requires computation
2. **Use efficient math**: Avoid expensive operations in animation loop
3. **Reuse calculations**: Cache repeated calculations
4. **Pause when not visible**: Stop animation when tab is inactive

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.stop()
  } else {
    clock.start()
  }
})
```

## Common Issues & Solutions

**Problem:** Animation is too fast/slow
- **Solution:** Multiply time by a speed factor: `time * 0.5` (slower) or `time * 2` (faster)

**Problem:** Animation is jerky on some devices
- **Solution:** Use delta time instead of fixed increments

**Problem:** Object disappears or moves strangely
- **Solution:** Check your math, ensure values are reasonable
- **Solution:** Use console.log to debug values

**Problem:** Rotation keeps accumulating
- **Solution:** Use modulo to keep rotation bounded: `rotation % (Math.PI * 2)`

**Problem:** Animation starts at wrong position
- **Solution:** Add an offset: `Math.sin(time + offset)`

## Challenge

Try modifying the code to:
1. Make the cube spin faster on one axis
2. Create a higher bounce for the sphere
3. Make the torus orbit in the opposite direction
4. Add a pulsing animation (scale growing/shrinking)
5. Create a wave effect with multiple objects

**Bonus Challenge:** Create a "solar system" with planets orbiting at different speeds and distances

## Key Takeaways

- Use **THREE.Clock** for consistent time-based animation
- **getElapsedTime()** for continuous values (rotation, position)
- **getDelta()** for frame-independent movement
- **Math.sin()** and **Math.cos()** create oscillating and circular motions
- Combine transformations for complex animations
- Multiply time by speed factor to control animation speed
- Always animate in the **render loop** with requestAnimationFrame
- Test on different devices to ensure consistent performance

## Next Chapter

In Chapter 8, we'll add realistic shadows to our scenes, creating depth and enhancing visual quality!

## Additional Resources

- [Three.js Animation Examples](https://threejs.org/examples/?q=animation)
- [Easing Functions](https://easings.net/)
- [GSAP Animation Library](https://greensock.com/gsap/)
- [Math.sin/cos Visualizer](https://www.desmos.com/calculator)
