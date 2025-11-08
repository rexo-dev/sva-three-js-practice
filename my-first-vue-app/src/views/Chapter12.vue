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

Welcome to the interactive code editor! This is a demo chapter showcasing the new live coding feature.

## Features

### ✏️ Live Code Editing
- Edit Three.js code in real-time
- Professional Monaco editor (same as VS Code)
- Syntax highlighting and autocomplete
- Keyboard shortcuts (Ctrl/Cmd + Enter to run)

### 🎯 Instant Feedback
- See your changes immediately
- Error messages with helpful hints
- Success indicators
- Loading states

### 🔧 Easy Controls
- **Run**: Execute your code
- **Reset**: Return to original code
- **Format**: Auto-format your code

## Try It Out!

Modify the code on the left to:
1. Change the cube color (try \`0xff0000\` for red)
2. Change the rotation speed
3. Add more cubes
4. Try different geometries (SphereGeometry, ConeGeometry)
5. Experiment with materials

## Example Modifications

### Change Color to Red
\`\`\`javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000  // Red cube!
})
\`\`\`

### Make it Spin Faster
\`\`\`javascript
cube.rotation.x += 0.05  // 5x faster!
cube.rotation.y += 0.05
\`\`\`

### Add a Sphere
\`\`\`javascript
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMat = new THREE.MeshStandardMaterial({ color: 0x0000ff })
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
sphere.position.x = 2
scene.add(sphere)
\`\`\`

## Tips

- Use the **Format** button to clean up your code
- Press **Ctrl/Cmd + Enter** to run code quickly
- Check the error panel if something goes wrong
- Click **Reset** to start over

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
    <template #canvas>
      <div class="interactive-demo">
        <div class="editor-section">
          <CodeEditor
            v-model="userCode"
            title="Edit Your Code"
            @run="handleRun"
            @reset="handleReset"
          />
        </div>
        <div class="canvas-section">
          <InteractiveCanvas
            ref="canvasRef"
            :code="userCode"
            :auto-run="false"
            @error="handleError"
            @success="handleSuccess"
          />
        </div>
      </div>
    </template>
    <template #guide>
      <MarkdownViewer :content="guideContent" />
    </template>
  </ChapterLayout>
</template>

<style scoped>
.interactive-demo {
  display: flex;
  height: 100%;
  gap: 10px;
  padding: 10px;
  background-color: #0d1117;
}

.editor-section,
.canvas-section {
  flex: 1;
  min-width: 0;
}

@media (max-width: 968px) {
  .interactive-demo {
    flex-direction: column;
  }

  .editor-section,
  .canvas-section {
    min-height: 400px;
  }
}
</style>
