<script setup>
import { ref } from 'vue'
import CodeEditor from '../components/editor/CodeEditor.vue'
import InteractiveCanvas from '../components/editor/InteractiveCanvas.vue'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'

// Default code template
const defaultCode = `// Create a rotating cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  metalness: 0.3,
  roughness: 0.4
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}
animate()
`

const guideContent = `# Interactive Code Editor Demo

Welcome to the interactive code editor! This chapter showcases the new **live coding feature** where you can edit Three.js code and see results in real-time.

## How It Works

1. **Read the Guide** - Learn about Three.js concepts (this tab)
2. **Edit the Code** - Switch to the "Editor" tab on the right
3. **See Results** - The 3D canvas on the left updates automatically!

## Features

### ✏️ Live Code Editing
- Professional Monaco editor (same as VS Code)
- Syntax highlighting and autocomplete
- Real-time error detection
- Keyboard shortcuts (Ctrl/Cmd + Enter to run)

### 🎯 Instant Feedback
- See your changes immediately in the 3D view
- Helpful error messages with line numbers
- Success indicators when code runs
- Loading states during execution

### 🔧 Easy Controls
- **▶ Run**: Execute your code (Ctrl/Cmd+Enter)
- **↺ Reset**: Return to original code
- **⚡ Format**: Auto-format your code

## Try It Out!

Switch to the **Editor** tab and try modifying the code:

### 1. Change the Cube Color
\`\`\`javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,  // Try red! (or 0x0000ff for blue)
  metalness: 0.3,
  roughness: 0.4
})
\`\`\`

### 2. Make it Spin Faster
\`\`\`javascript
cube.rotation.x += 0.05  // 5x faster!
cube.rotation.y += 0.05
\`\`\`

### 3. Change the Size
\`\`\`javascript
const geometry = new THREE.BoxGeometry(2, 2, 2)  // Bigger cube!
\`\`\`

### 4. Add a Sphere
\`\`\`javascript
// Add this after creating the cube
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMat = new THREE.MeshStandardMaterial({ color: 0x0000ff })
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
sphere.position.x = 2
scene.add(sphere)
\`\`\`

### 5. Try Different Geometries
\`\`\`javascript
// Instead of BoxGeometry, try:
const geometry = new THREE.ConeGeometry(1, 2, 32)
// or
const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100)
// or
const geometry = new THREE.IcosahedronGeometry(1, 0)
\`\`\`

## Available Objects

When writing code in the editor, you have access to:

- **THREE** - The Three.js library
- **scene** - The 3D scene to add objects to
- **camera** - The camera viewing the scene
- **renderer** - The WebGL renderer
- **controls** - OrbitControls for camera movement

## Tips & Tricks

💡 **Quick Run**: Press **Ctrl/Cmd + Enter** instead of clicking Run

💡 **Format Code**: Use the Format button to clean up your code automatically

💡 **Error Help**: If you see an error, read the message carefully - it tells you what went wrong and on which line

💡 **Reset Anytime**: Don't worry about breaking things - just hit Reset to start over

💡 **Experiment**: Try changing numbers, colors, and parameters to see what happens!

## Common Mistakes to Avoid

❌ **Forgetting to add to scene**: Always use \`scene.add(yourObject)\`

❌ **No animation loop**: If nothing moves, make sure you have the \`animate()\` function

❌ **Wrong color format**: Use hex colors like \`0xff0000\`, not \`"red"\` or \`#ff0000\`

❌ **Syntax errors**: Watch for missing brackets, commas, or semicolons

## Challenge Yourself!

Try to create:

1. **Three cubes** in different positions and colors
2. A **rotating solar system** with a sun and planets
3. A **bouncing ball** (hint: change position.y over time)
4. An **animated rainbow** of colored spheres

## What's Next?

This interactive editor is available in all chapters! You can experiment with any Three.js code and learn by doing.

Go back to previous chapters and try modifying their code to see what happens!

Happy coding! 🚀
`

// Reactive state
const userCode = ref(defaultCode)
const canvasRef = ref(null)

const handleRun = () => {
  if (canvasRef.value) {
    canvasRef.value.runCode()
  }
}

const handleReset = () => {
  userCode.value = defaultCode
  if (canvasRef.value) {
    canvasRef.value.runCode()
  }
}

const handleError = (error) => {
  console.error('Code execution error:', error)
}

const handleSuccess = () => {
  console.log('Code executed successfully!')
}
</script>

<template>
  <ChapterLayout>
    <!-- Left side: Interactive 3D Canvas -->
    <template #canvas>
      <InteractiveCanvas
        ref="canvasRef"
        :code="userCode"
        :auto-run="false"
        @error="handleError"
        @success="handleSuccess"
      />
    </template>

    <!-- Right side Guide tab: Tutorial content -->
    <template #guide>
      <MarkdownViewer :content="guideContent" />
    </template>

    <!-- Right side Code tab: Interactive Editor (replaces static code view) -->
    <template #code>
      <CodeEditor
        v-model="userCode"
        title="Interactive Code Editor - Edit & Run!"
        @run="handleRun"
        @reset="handleReset"
      />
    </template>
  </ChapterLayout>
</template>

<style scoped>
/* No additional styles needed - ChapterLayout handles the layout */
</style>
