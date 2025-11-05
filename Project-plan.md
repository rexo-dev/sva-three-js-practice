# Three.js Tutorial Vue App - Project Plan

## Project Overview
A Vue 3 application that provides an interactive, step-by-step guide to learning three.js through 10 progressive chapters. Each chapter includes a dedicated view component with live code examples and accompanying markdown documentation for students to follow along.

## Technology Stack
- **Vue 3** (Composition API)
- **Vue Router** for navigation between chapters
- **Three.js** for 3D graphics
- **Vite** as build tool
- **TypeScript** (optional, recommended)
- **Markdown rendering** for documentation display

## Application Architecture

### Folder Structure
```
threejs-tutorial-app/
├── public/
├── src/
│   ├── assets/
│   │   └── textures/          # Sample textures for chapters
│   ├── components/
│   │   ├── ChapterLayout.vue  # Wrapper component for chapters
│   │   ├── Navigation.vue     # Main navigation component
│   │   └── MarkdownViewer.vue # Component to display markdown guides
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Chapter01.vue      # Basic Scene Setup
│   │   ├── Chapter02.vue      # Geometries
│   │   ├── Chapter03.vue      # Materials
│   │   ├── Chapter04.vue      # Textures
│   │   ├── Chapter05.vue      # Lighting
│   │   ├── Chapter06.vue      # Camera Controls
│   │   ├── Chapter07.vue      # Animation
│   │   ├── Chapter08.vue      # Shadows
│   │   ├── Chapter09.vue      # Loading 3D Models
│   │   └── Chapter10.vue      # Interactive Scene
│   ├── guides/                # Markdown files for each chapter
│   │   ├── chapter-01-guide.md
│   │   ├── chapter-02-guide.md
│   │   ├── chapter-03-guide.md
│   │   ├── chapter-04-guide.md
│   │   ├── chapter-05-guide.md
│   │   ├── chapter-06-guide.md
│   │   ├── chapter-07-guide.md
│   │   ├── chapter-08-guide.md
│   │   ├── chapter-09-guide.md
│   │   └── chapter-10-guide.md
│   ├── router/
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── package.json
└── vite.config.ts
```

## 10-Chapter Curriculum

### Chapter 1: Basic Scene Setup
**Learning Objectives:**
- Understanding the three.js ecosystem
- Creating a scene, camera, and renderer
- Adding a simple mesh (cube)
- Basic render loop

**Key Concepts:**
- Scene graph
- PerspectiveCamera
- WebGLRenderer
- Mesh = Geometry + Material

### Chapter 2: Geometries
**Learning Objectives:**
- Exploring built-in geometries
- BoxGeometry, SphereGeometry, PlaneGeometry
- Understanding vertices and faces
- Positioning and scaling objects

**Key Concepts:**
- BufferGeometry
- Geometry parameters
- Transformations (position, rotation, scale)

### Chapter 3: Materials
**Learning Objectives:**
- Different material types
- MeshBasicMaterial vs MeshStandardMaterial
- Material properties (color, wireframe, opacity)
- When to use which material

**Key Concepts:**
- Material types
- PBR (Physically Based Rendering)
- Material properties

### Chapter 4: Textures
**Learning Objectives:**
- Loading textures
- Applying textures to materials
- UV mapping basics
- Texture properties (repeat, offset)

**Key Concepts:**
- TextureLoader
- UV coordinates
- Texture wrapping
- MIP mapping

### Chapter 5: Lighting
**Learning Objectives:**
- Light types (Ambient, Directional, Point, Spot)
- Light properties (color, intensity)
- How lights affect materials
- Creating realistic lighting

**Key Concepts:**
- Light types
- Light positioning
- Light helpers
- Ambient vs direct lighting

### Chapter 6: Camera Controls
**Learning Objectives:**
- OrbitControls for mouse interaction
- Camera positioning strategies
- Field of view (FOV)
- Near and far clipping planes

**Key Concepts:**
- OrbitControls
- Camera parameters
- Aspect ratio
- Viewport management

### Chapter 7: Animation
**Learning Objectives:**
- Animation loop with requestAnimationFrame
- Rotating and moving objects
- Time-based animations
- Using Clock for smooth animations

**Key Concepts:**
- Animation loop
- Delta time
- Interpolation
- Performance considerations

### Chapter 8: Shadows
**Learning Objectives:**
- Enabling shadows in three.js
- Shadow casting and receiving
- Shadow map configuration
- Performance optimization

**Key Concepts:**
- Shadow maps
- CastShadow and receiveShadow
- Shadow camera
- Shadow quality vs performance

### Chapter 9: Loading 3D Models
**Learning Objectives:**
- Using GLTFLoader
- Loading external 3D models
- Model positioning and scaling
- Traversing model hierarchy

**Key Concepts:**
- GLTF format
- Model loaders
- Asset management
- Model optimization

### Chapter 10: Interactive Scene
**Learning Objectives:**
- Raycasting for object selection
- Mouse interaction
- Combining all previous concepts
- Building a complete interactive scene

**Key Concepts:**
- Raycaster
- Event handling
- User interaction
- Bringing it all together

## Implementation Steps

### Phase 1: Project Setup
1. Create new Vue 3 project with Vite
2. Install dependencies (three.js, vue-router)
3. Set up project structure
4. Configure Vue Router with chapter routes
5. Create base layout components

### Phase 2: Chapter Views
1. Create ChapterLayout component (split screen: 3D canvas + markdown guide)
2. Implement MarkdownViewer component
3. Create 10 chapter view components with three.js scenes
4. Set up navigation between chapters

### Phase 3: Documentation
1. Write detailed markdown guides for each chapter
2. Include step-by-step instructions
3. Add code snippets with explanations
4. Include common pitfalls and troubleshooting

### Phase 4: Enhancements
1. Add syntax highlighting for code blocks
2. Implement responsive design
3. Add chapter progress tracking
4. Include interactive code playground (optional)

## Key Features

### Split-Screen Layout
Each chapter view will feature:
- **Left Panel:** Live three.js canvas with the example running
- **Right Panel:** Scrollable markdown guide with step-by-step instructions
- **Top Navigation:** Chapter selector and progress indicator

### Navigation
- Home page with chapter overview
- Previous/Next chapter buttons
- Chapter progress indicators
- Direct chapter selection menu

### Markdown Guides Structure
Each markdown file will include:
1. **Chapter Overview** - What you'll learn
2. **Prerequisites** - Previous chapters needed
3. **Step-by-Step Instructions** - Numbered steps with code
4. **Code Explanation** - Detailed explanation of each concept
5. **Common Issues** - Troubleshooting tips
6. **Challenge** - Exercise for the student
7. **Resources** - Links to three.js documentation

## Development Timeline

### Week 1: Setup & Foundation
- Project initialization
- Basic routing
- ChapterLayout component
- Chapters 1-3

### Week 2: Core Concepts
- Chapters 4-7
- Markdown guides 1-7
- Navigation improvements

### Week 3: Advanced Topics
- Chapters 8-10
- Markdown guides 8-10
- Testing and refinement

### Week 4: Polish & Deploy
- Responsive design
- Documentation review
- Performance optimization
- Deployment

## Technical Considerations

### Performance
- Dispose of three.js resources when unmounting components
- Use `onBeforeUnmount` lifecycle hook for cleanup
- Optimize texture sizes
- Limit polygon counts in examples

### Best Practices
- Use Composition API for cleaner code organization
- Separate three.js logic into composables
- Type-safe code with TypeScript
- Responsive canvas sizing with ResizeObserver

### Accessibility
- Keyboard navigation between chapters
- Screen reader-friendly navigation
- Alt text for visual elements
- High contrast mode support

## Success Metrics
- All 10 chapters functional with live examples
- Complete markdown documentation for each chapter
- Smooth navigation and user experience
- Mobile-responsive design
- Clear, beginner-friendly explanations

## Future Enhancements
- Interactive code editor within the app
- Chapter quizzes
- Student project showcase
- Additional advanced chapters
- Download example code per chapter
- Video tutorials integration
