# Three.js Tutorial Vue App - Development Guide for Claude

## Project Summary
Building an interactive Vue 3 application that teaches three.js through 10 progressive chapters. Each chapter combines a live three.js demo with step-by-step markdown documentation.

## Quick Reference

### Project Structure
```
threejs-tutorial-app/
├── src/
│   ├── views/          # 10 chapter components (Chapter01.vue - Chapter10.vue)
│   ├── guides/         # 10 markdown files (chapter-01-guide.md - chapter-10-guide.md)
│   ├── components/     # Reusable components (Navigation, ChapterLayout, MarkdownViewer)
│   └── router/         # Vue Router configuration
```

### 10 Chapters Overview
1. **Chapter 1:** Basic Scene Setup (Scene, Camera, Renderer, Cube)
2. **Chapter 2:** Geometries (BoxGeometry, SphereGeometry, PlaneGeometry)
3. **Chapter 3:** Materials (MeshBasicMaterial, MeshStandardMaterial, properties)
4. **Chapter 4:** Textures (TextureLoader, UV mapping, texture properties)
5. **Chapter 5:** Lighting (Ambient, Directional, Point, Spot lights)
6. **Chapter 6:** Camera Controls (OrbitControls, camera positioning, FOV)
7. **Chapter 7:** Animation (Animation loop, Clock, time-based animations)
8. **Chapter 8:** Shadows (Shadow casting/receiving, shadow maps)
9. **Chapter 9:** Loading 3D Models (GLTFLoader, model positioning)
10. **Chapter 10:** Interactive Scene (Raycasting, mouse interaction, complete project)

## Implementation Phases

### Phase 1: Project Initialization
**Commands to run:**
```bash
npm create vite@latest threejs-tutorial-app -- --template vue
cd threejs-tutorial-app
npm install
npm install three
npm install vue-router@4
```

**Files to create:**
- `src/router/index.ts` - Router configuration with 10 chapter routes
- `src/App.vue` - Main app component with router-view
- `src/views/Home.vue` - Landing page with chapter overview

### Phase 2: Core Components
**Components to create:**

1. **Navigation.vue**
   - Chapter list with links
   - Progress indicator
   - Previous/Next buttons

2. **ChapterLayout.vue**
   - Split-screen layout (canvas left, guide right)
   - Responsive design
   - Slot for three.js canvas
   - Slot for markdown content

3. **MarkdownViewer.vue**
   - Parse and display markdown
   - Syntax highlighting for code blocks
   - Scrollable content area

### Phase 3: Chapter Implementation

**Pattern for each chapter view component:**
```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import guideContent from '../guides/chapter-XX-guide.md?raw'

const canvasRef = ref<HTMLCanvasElement>()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationId: number

onMounted(() => {
  initThreeJS()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.dispose()
  // Clean up other resources
})

function initThreeJS() {
  // Three.js setup code specific to chapter
}

function animate() {
  animationId = requestAnimationFrame(animate)
  // Animation code
  renderer.render(scene, camera)
}
</script>

<template>
  <ChapterLayout>
    <template #canvas>
      <canvas ref="canvasRef"></canvas>
    </template>
    <template #guide>
      <MarkdownViewer :content="guideContent" />
    </template>
  </ChapterLayout>
</template>
```

**Implementation order:**
1. Chapter 1 first (establishes pattern)
2. Chapters 2-3 (build on basics)
3. Chapters 4-6 (intermediate concepts)
4. Chapters 7-8 (animation and effects)
5. Chapters 9-10 (advanced topics)

### Phase 4: Markdown Documentation

**Each guide should follow this structure:**

```markdown
# Chapter X: [Title]

## What You'll Learn
- Bullet points of learning objectives

## Prerequisites
- Links to previous chapters if needed

## Step-by-Step Guide

### Step 1: [Task]
Explanation of what we're doing and why.

```javascript
// Code example
const scene = new THREE.Scene()
```

Explanation of the code.

### Step 2: [Next Task]
...

## Code Explanation
Detailed breakdown of key concepts.

## Common Issues & Solutions
- **Problem:** Description
  - **Solution:** How to fix

## Challenge
Exercise for the student to try on their own.

## Additional Resources
- [Three.js Docs](link)
- Related topics
```

**Guide files to create:**
- `src/guides/chapter-01-guide.md` - Basic Scene Setup
- `src/guides/chapter-02-guide.md` - Geometries
- `src/guides/chapter-03-guide.md` - Materials
- `src/guides/chapter-04-guide.md` - Textures
- `src/guides/chapter-05-guide.md` - Lighting
- `src/guides/chapter-06-guide.md` - Camera Controls
- `src/guides/chapter-07-guide.md` - Animation
- `src/guides/chapter-08-guide.md` - Shadows
- `src/guides/chapter-09-guide.md` - Loading 3D Models
- `src/guides/chapter-10-guide.md` - Interactive Scene

## Development Workflow

### When creating each chapter:
1. Create the Vue component in `src/views/ChapterXX.vue`
2. Implement the three.js scene with the chapter's focus
3. Write the markdown guide in `src/guides/chapter-XX-guide.md`
4. Test the chapter thoroughly
5. Ensure proper cleanup in `onBeforeUnmount`
6. Move to next chapter

### Code Quality Checklist
- [ ] Three.js resources properly disposed
- [ ] Animation loop cancelled on unmount
- [ ] Canvas responsive to window resize
- [ ] Code comments for clarity
- [ ] Markdown guide complete with all sections
- [ ] Code examples in guide match component implementation
- [ ] No console errors or warnings

## Key Three.js Patterns

### Basic Scene Setup (Chapter 1)
```javascript
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value })

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5
```

### Cleanup Pattern (All chapters)
```javascript
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose()
      object.material.dispose()
    }
  })
  renderer.dispose()
})
```

### Responsive Canvas (All chapters)
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```

## Testing Strategy

### Manual Testing Per Chapter
1. Visual verification - 3D scene renders correctly
2. Animation smooth - No jank or performance issues
3. Guide readable - Markdown displays properly
4. Navigation works - Can move between chapters
5. Responsive - Works on different screen sizes
6. No memory leaks - Resources properly cleaned up

## Deployment Considerations

### Build Configuration
```bash
npm run build
```

### Environment Variables
- Base URL for assets
- Production optimizations enabled

### Hosting
- Static site hosting (Vercel, Netlify, GitHub Pages)
- Ensure three.js bundles properly
- Check asset loading paths

## Common Pitfalls to Avoid

1. **Memory Leaks:** Always dispose three.js objects
2. **Animation Loop:** Cancel `requestAnimationFrame` on unmount
3. **Import Paths:** Use correct three.js import paths
4. **Canvas Sizing:** Handle window resize events
5. **Material Requirements:** Some materials need lights to be visible
6. **Markdown Loading:** Configure Vite to load .md files as raw strings

## Quick Commands Reference

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Add markdown support (if needed)
npm install -D vite-plugin-markdown

# Add syntax highlighting
npm install prismjs
```

## Progress Tracking

### Phase 1: Setup
- [ ] Project initialized
- [ ] Dependencies installed
- [ ] Router configured
- [ ] Base components created

### Phase 2: Chapters 1-5
- [ ] Chapter 1 complete (view + guide)
- [ ] Chapter 2 complete (view + guide)
- [ ] Chapter 3 complete (view + guide)
- [ ] Chapter 4 complete (view + guide)
- [ ] Chapter 5 complete (view + guide)

### Phase 3: Chapters 6-10
- [ ] Chapter 6 complete (view + guide)
- [ ] Chapter 7 complete (view + guide)
- [ ] Chapter 8 complete (view + guide)
- [ ] Chapter 9 complete (view + guide)
- [ ] Chapter 10 complete (view + guide)

### Phase 4: Polish
- [ ] Navigation refined
- [ ] Responsive design verified
- [ ] All guides reviewed
- [ ] Performance optimized
- [ ] Ready for deployment

## Next Steps After Planning

1. Run project initialization commands
2. Set up Vue Router with chapter routes
3. Create base components (Navigation, ChapterLayout, MarkdownViewer)
4. Implement Chapter 1 as the foundational pattern
5. Iterate through remaining chapters
6. Write corresponding markdown guides
7. Test and refine
8. Deploy

---

**Note:** This is a teaching application, so code clarity and explanation quality are more important than advanced optimizations. Each chapter should be self-contained and buildable as a standalone example.
