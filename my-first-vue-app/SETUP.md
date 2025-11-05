# Three.js Tutorial Setup Guide

This guide will help you set up the Three.js library environment for this interactive tutorial application.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning the repository)
- A modern web browser (Chrome, Firefox, Edge, or Safari)
- A code editor (VS Code recommended)

## Quick Start

### 1. Clone or Download the Project

```bash
# Using Git
git clone https://github.com/rexo-dev/sva-three-js-practice.git
cd sva-three-js-practice/my-first-vue-app

# Or download and extract the ZIP file, then navigate to my-first-vue-app folder
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- **Vue 3** - Frontend framework
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **Vue Router** - Client-side routing
- **Pinia** - State management

### 3. Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is in use).

### 4. Open in Browser

Navigate to the URL shown in the terminal (typically `http://localhost:5173`).

## Project Structure

```
my-first-vue-app/
├── src/
│   ├── assets/          # CSS and static assets
│   ├── components/      # Reusable Vue components
│   │   ├── ChapterLayout.vue      # Split-panel layout with toggle
│   │   ├── CodeViewer.vue         # Source code display
│   │   ├── MarkdownViewer.vue     # Markdown guide renderer
│   │   └── Navigation.vue         # Chapter navigation menu
│   ├── guides/          # Markdown tutorial guides
│   │   ├── chapter-01-guide.md
│   │   ├── chapter-02-guide.md
│   │   └── ... (through chapter-10)
│   ├── router/          # Vue Router configuration
│   ├── views/           # Chapter view components
│   │   ├── Chapter01.vue          # Basic Scene Setup
│   │   ├── Chapter02.vue          # Geometries
│   │   ├── Chapter03.vue          # Materials
│   │   ├── Chapter04.vue          # Textures
│   │   ├── Chapter05.vue          # Lighting
│   │   ├── Chapter06.vue          # Camera Controls
│   │   ├── Chapter07.vue          # Animation
│   │   ├── Chapter08.vue          # Shadows
│   │   ├── Chapter09.vue          # Loading 3D Models
│   │   └── Chapter10.vue          # Interactive Scene
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/              # Public static assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Three.js Library Details

### Version

This project uses **Three.js r170** (check `package.json` for the exact version).

### Core Three.js Concepts Used

Each chapter introduces different Three.js concepts:

1. **Scene, Camera, Renderer** - The fundamental building blocks
2. **Geometries** - Box, Sphere, Cone, Cylinder, Torus, Plane
3. **Materials** - Basic, Lambert, Phong, Standard, Physical, Toon
4. **Textures** - Procedural textures and texture mapping
5. **Lighting** - Ambient, Directional, Point, Spot lights
6. **Controls** - OrbitControls for interactive camera movement
7. **Animation** - Time-based animations using Clock
8. **Shadows** - Shadow casting and receiving with shadow maps
9. **Model Loading** - GLTFLoader for external 3D models
10. **Interaction** - Raycasting for mouse/click interactions

### Three.js Modules Used

```javascript
// Core
import * as THREE from 'three'

// Controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Loaders
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
```

## Available Scripts

### Development

```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR).

### Build for Production

```bash
npm run build
```
Creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```
Serves the production build locally for testing.

### Lint Code

```bash
npm run lint
```
Runs ESLint to check code quality and formatting.

### Format Code

```bash
npm run format
```
Formats code using Prettier (if configured).

## Browser Compatibility

This application requires a browser with **WebGL support**. Most modern browsers support WebGL:

- Chrome 9+
- Firefox 4+
- Safari 5.1+
- Edge 12+
- Opera 12+

To check WebGL support, visit: https://get.webgl.org/

## Common Setup Issues

### Issue: Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.). Check the terminal output for the actual port.

### Issue: npm install fails

Try clearing the npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Three.js not found

Make sure Three.js is installed:
```bash
npm install three
```

### Issue: Blank screen or errors

1. Check the browser console for errors (F12)
2. Make sure the dev server is running
3. Try clearing browser cache (Ctrl+Shift+Delete)
4. Restart the dev server

### Issue: WebGL not supported

Your browser or graphics card may not support WebGL. Try:
1. Updating your browser to the latest version
2. Updating your graphics drivers
3. Enabling hardware acceleration in browser settings

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant updates when you save files. Changes to Vue components, CSS, and JavaScript are reflected immediately without full page reload.

### Browser DevTools

- **F12** - Open DevTools
- **Console tab** - View JavaScript errors and logs
- **Network tab** - Check if assets are loading correctly
- **Performance tab** - Monitor frame rate and performance

### Three.js Inspector

For debugging Three.js scenes, use the browser extension:
- [Three.js Inspector for Chrome](https://chrome.google.com/webstore/detail/threejs-inspector/dnhjfclbfhcbcdfpjaeacomhbdfjbebi)

### VS Code Extensions (Recommended)

- **Vue - Official** - Vue 3 language support
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Volar** - Vue TypeScript support

## Learning Path

Follow the chapters in order for the best learning experience:

1. **Chapter 1**: Start here to understand the basics
2. **Chapters 2-4**: Learn about shapes, materials, and textures
3. **Chapters 5-6**: Add lighting and camera controls
4. **Chapters 7-8**: Animate objects and add shadows
5. **Chapters 9-10**: Load 3D models and add interactivity

Each chapter includes:
- **Live Three.js Demo** (left panel) - See the concept in action
- **Step-by-Step Guide** (right panel) - Detailed instructions
- **Full Source Code** (toggle to "Code" view) - Complete implementation

## Additional Resources

### Official Documentation

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

### Three.js Learning Resources

- [Three.js Journey](https://threejs-journey.com/) - Comprehensive course
- [Discover Three.js](https://discoverthreejs.com/) - Free book
- [Three.js Fundamentals](https://threejsfundamentals.org/) - Tutorials

### Community

- [Three.js Forum](https://discourse.threejs.org/)
- [Three.js Discord](https://discord.gg/56GBJwAnUS)
- [Stack Overflow - three.js tag](https://stackoverflow.com/questions/tagged/three.js)

## Troubleshooting Performance

If you experience lag or low frame rates:

### Optimize Scene

```javascript
// Reduce geometry detail
const geometry = new THREE.SphereGeometry(1, 16, 16) // Lower segments

// Use simpler materials
const material = new THREE.MeshBasicMaterial() // Instead of MeshStandardMaterial

// Dispose of unused resources
geometry.dispose()
material.dispose()
renderer.dispose()
```

### Monitor Performance

```javascript
// Check FPS
const stats = new Stats()
document.body.appendChild(stats.dom)

function animate() {
  stats.begin()
  // ... rendering code
  stats.end()
}
```

### Reduce Shadow Quality

```javascript
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.BasicShadowMap // Faster than PCFSoftShadowMap
light.shadow.mapSize.width = 512 // Lower resolution
light.shadow.mapSize.height = 512
```

## Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review the relevant chapter's guide and code
3. Refer to the [Three.js Documentation](https://threejs.org/docs/)
4. Search for similar issues on [Stack Overflow](https://stackoverflow.com/questions/tagged/three.js)
5. Open an issue on the project repository

## Next Steps

Once your environment is set up:

1. Start with **Chapter 1: Basic Scene Setup**
2. Follow along with the guide in the right panel
3. Toggle to "Code" view to see the full implementation
4. Experiment with the code and modify values
5. Complete the challenges at the end of each chapter

Happy learning! 🚀
