<script setup>
import { ref, computed } from 'vue'
import CodeEditor from '../components/editor/CodeEditor.vue'
import InteractiveCanvas from '../components/editor/InteractiveCanvas.vue'
import CodeChallenge from '../components/editor/CodeChallenge.vue'
import ChapterLayout from '../components/ChapterLayout.vue'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import { useCodePersistence } from '../composables/useCodePersistence'
import { useChallenges } from '../composables/useChallenges'

// Get challenges for Chapter 1
const { chapter1Challenges } = useChallenges()

// Default starter code
const defaultCode = `// Write your code here!
// Try to complete the challenge shown on the left

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

// Use code persistence
const { code: userCode, resetToDefault } = useCodePersistence('chapter-13', defaultCode)

// Reactive state
const canvasRef = ref(null)
const challengeRef = ref(null)
const currentChallengeIndex = ref(0)

const currentChallenge = computed(() => {
  return chapter1Challenges[currentChallengeIndex.value]
})

// Get scene from canvas for challenge validation
const sceneRef = computed(() => {
  return canvasRef.value ? canvasRef.value.getScene() : null
})

const guideContent = `# Code Challenges

Welcome to the **interactive challenges** section! Here you'll practice Three.js concepts through hands-on coding exercises with automatic validation.

## How Challenges Work

### 1. Read the Challenge
Each challenge has:
- **Title & Difficulty**: Know what you're getting into
- **Description**: What you need to accomplish
- **Requirements**: Specific criteria to meet
- **Hints**: Click to reveal helpful tips

### 2. Write Your Code
Use the code editor on the right to write your solution. The editor features:
- Syntax highlighting
- Auto-complete
- Auto-save (your progress is preserved)

### 3. Run Tests
Click the **Run Tests** button to validate your solution:
- ✓ **Green checkmarks**: Tests passed
- ✗ **Red X's**: Tests failed (with helpful error messages)

### 4. Move Forward
Once all tests pass, you can:
- Move to the next challenge
- View the solution for learning
- Experiment further

## Challenge Features

### 💾 Auto-Save
Your code is automatically saved as you type, so you can come back later and continue where you left off.

### 🧪 Instant Validation
Tests run against your actual code and the 3D scene, checking:
- Code structure and syntax
- Object properties (colors, sizes, positions)
- Scene contents
- Animation behavior

### 💡 Smart Hints
Stuck? Click "Show Hints" for progressive hints that guide you without giving away the solution.

### 🎯 Difficulty Levels
- **Easy**: Basic concepts, simple modifications
- **Medium**: Combining concepts, creating new objects
- **Hard**: Complex interactions, multiple requirements

## Tips for Success

✅ **Read Carefully**: Make sure you understand all requirements

✅ **Use Hints Wisely**: Try on your own first, then use hints if stuck

✅ **Test Often**: Run tests frequently to catch issues early

✅ **Learn from Failures**: Error messages tell you what's wrong

✅ **Experiment**: After passing, try variations to deepen understanding

## Current Progress

Track your progress as you complete challenges. Each chapter has multiple challenges to help you master the concepts.

Ready to start? Select a challenge from the list and begin coding!
`

// Event handlers
const handleRun = () => {
  if (canvasRef.value) {
    canvasRef.value.runCode()
  }
}

const handleReset = () => {
  userCode.value = resetToDefault()
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

const handleTestsPassed = (results) => {
  console.log('All tests passed!', results)
}

const handleTestsFailed = (results) => {
  console.log('Some tests failed:', results)
}

const handleSolutionRequested = (solution) => {
  if (solution) {
    userCode.value = solution
    if (canvasRef.value) {
      canvasRef.value.runCode()
    }
  }
}

const handleNextChallenge = () => {
  if (currentChallengeIndex.value < chapter1Challenges.length - 1) {
    currentChallengeIndex.value++
    // Reset code for new challenge
    userCode.value = defaultCode
    if (canvasRef.value) {
      canvasRef.value.runCode()
    }
  }
}

const selectChallenge = (index) => {
  currentChallengeIndex.value = index
}
</script>

<template>
  <ChapterLayout>
    <!-- Left side: Challenges and 3D Canvas -->
    <template #canvas>
      <div class="challenge-container">
        <!-- Challenge Selector -->
        <div class="challenge-selector">
          <button
            v-for="(challenge, index) in chapter1Challenges"
            :key="challenge.id"
            @click="selectChallenge(index)"
            class="challenge-tab"
            :class="{ active: index === currentChallengeIndex }"
          >
            Challenge {{ index + 1 }}
            <span v-if="index === currentChallengeIndex" class="active-indicator">●</span>
          </button>
        </div>

        <!-- Current Challenge -->
        <div class="challenge-content">
          <CodeChallenge
            ref="challengeRef"
            :challenge="currentChallenge"
            :user-code="userCode"
            :scene="sceneRef"
            @solution-requested="handleSolutionRequested"
            @next-challenge="handleNextChallenge"
            @tests-passed="handleTestsPassed"
            @tests-failed="handleTestsFailed"
          />
        </div>

        <!-- 3D Preview Canvas -->
        <div class="canvas-preview">
          <h4>Preview</h4>
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

    <!-- Right side Guide tab: Tutorial content -->
    <template #guide>
      <MarkdownViewer :content="guideContent" />
    </template>

    <!-- Right side Code tab: Interactive Editor -->
    <template #code>
      <CodeEditor
        v-model="userCode"
        title="Code Editor - Complete the Challenge!"
        @run="handleRun"
        @reset="handleReset"
      />
    </template>
  </ChapterLayout>
</template>

<style scoped>
.challenge-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1a1a1a;
}

.challenge-selector {
  display: flex;
  gap: 2px;
  background-color: #1e1e1e;
  padding: 10px;
  border-bottom: 2px solid #2d2d30;
  overflow-x: auto;
}

.challenge-tab {
  flex: 1;
  min-width: 120px;
  padding: 10px 16px;
  background-color: #2d2d30;
  color: #cccccc;
  border: none;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.challenge-tab:hover {
  background-color: #3e3e42;
}

.challenge-tab.active {
  background-color: #42b883;
  color: white;
  font-weight: 600;
}

.active-indicator {
  font-size: 0.6rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.challenge-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
}

.canvas-preview {
  height: 300px;
  border-top: 2px solid #2d2d30;
  background-color: #1e1e1e;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.canvas-preview h4 {
  margin: 0 0 10px 0;
  color: #cccccc;
  font-size: 0.9rem;
  padding: 0 10px;
}

.canvas-preview > div {
  flex: 1;
  min-height: 0;
}

@media (max-width: 768px) {
  .challenge-selector {
    overflow-x: scroll;
  }

  .challenge-tab {
    min-width: 100px;
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .canvas-preview {
    height: 250px;
  }
}
</style>
