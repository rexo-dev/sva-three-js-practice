# Interactive Code Editor Implementation Plan

## Overview
Add an interactive code editor to the Three.js Tutorial app that allows students to modify Three.js code in real-time and see immediate visual results. This enhancement will transform the learning experience from passive reading to active experimentation.

## Goals
1. **Live Code Editing**: Allow users to edit Three.js code and see changes immediately
2. **Learning Enhancement**: Enable hands-on experimentation with concepts
3. **Error Handling**: Provide helpful error messages and guidance
4. **Code Persistence**: Save user modifications locally
5. **Reset Functionality**: Allow users to restore original code
6. **Syntax Highlighting**: Professional code editing experience
7. **Performance**: Maintain smooth 60 FPS rendering while editing

## Target User Experience

### Ideal Workflow
1. User reads the chapter guide
2. Views the working demo in the canvas
3. Clicks "Edit Code" button
4. Code editor appears with the current chapter's code
5. User modifies code (e.g., change cube color, size, rotation speed)
6. Changes apply automatically or on "Run" button click
7. Visual feedback appears immediately in the canvas
8. Errors are caught and displayed helpfully
9. User can reset to original code at any time
10. Modified code is saved to localStorage

## Technical Architecture

### 1. Code Editor Component

#### Component: `CodeEditor.vue`

**Technology Choice:**
- **Primary Option**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (VS Code's editor)
  - Pros: Full-featured, excellent TypeScript/JavaScript support, intellisense
  - Cons: ~4MB bundle size
- **Alternative**: [CodeMirror 6](https://codemirror.net/)
  - Pros: Lightweight (~500KB), highly customizable, good performance
  - Cons: Less out-of-box features, requires more setup
- **Recommendation**: Monaco Editor for best user experience

**Features:**
```vue
<script setup>
import { ref, watch, onMounted } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
  initialCode: String,
  language: { type: String, default: 'javascript' },
  readOnly: { type: Boolean, default: false },
  theme: { type: String, default: 'vs-dark' },
})

const emit = defineEmits(['codeChange', 'runCode'])

const editorContainer = ref(null)
let editor = null

onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: props.initialCode,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    readOnly: props.readOnly,
  })

  editor.onDidChangeModelContent(() => {
    emit('codeChange', editor.getValue())
  })
})
</script>

<template>
  <div class="code-editor">
    <div ref="editorContainer" class="editor-container"></div>
    <div class="editor-toolbar">
      <button @click="emit('runCode')" class="run-button">
        ▶ Run Code
      </button>
      <button @click="resetCode" class="reset-button">
        ↺ Reset
      </button>
    </div>
  </div>
</template>
```

### 2. Interactive Canvas Component

#### Component: `InteractiveCanvas.vue`

**Purpose**: Wrapper around existing chapter components that enables live code execution

```vue
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  code: String,
  autoRun: { type: Boolean, default: false },
})

const emit = defineEmits(['error', 'success'])

const canvasRef = ref(null)
let scene, camera, renderer, controls, animationId
let userObjects = [] // Track user-created objects

// Sandbox execution context
const executeUserCode = (code) => {
  try {
    // Clean up previous execution
    cleanup()

    // Create new scene
    initScene()

    // Create sandboxed execution environment
    const userFunction = new Function(
      'THREE',
      'scene',
      'camera',
      'renderer',
      'controls',
      code
    )

    // Execute user code
    userFunction(THREE, scene, camera, renderer, controls)

    // Start animation loop
    animate()

    emit('success')
  } catch (error) {
    emit('error', {
      message: error.message,
      stack: error.stack,
      line: extractLineNumber(error),
    })
  }
}

const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // Dispose Three.js resources
  userObjects.forEach(obj => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m => m.dispose())
      } else {
        obj.material.dispose()
      }
    }
  })

  userObjects = []

  if (scene) {
    scene.clear()
  }
}

watch(() => props.code, (newCode) => {
  if (props.autoRun) {
    executeUserCode(newCode)
  }
})
</script>

<template>
  <div class="interactive-canvas">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
```

### 3. Enhanced Chapter Layout

#### Component: `InteractiveChapterLayout.vue`

Extends existing `ChapterLayout.vue` with editor integration:

```vue
<script setup>
import { ref, computed } from 'vue'
import CodeEditor from './CodeEditor.vue'
import InteractiveCanvas from './InteractiveCanvas.vue'
import MarkdownViewer from './MarkdownViewer.vue'

const props = defineProps({
  chapterCode: String,
  guideContent: String,
  enableEditor: { type: Boolean, default: true },
})

const currentView = ref('demo') // 'demo', 'editor', 'guide'
const userCode = ref(props.chapterCode)
const codeError = ref(null)

const isEditorActive = computed(() => currentView.value === 'editor')

const handleCodeChange = (newCode) => {
  userCode.value = newCode
  // Save to localStorage
  localStorage.setItem(`chapter-code-${props.chapterId}`, newCode)
}

const handleRunCode = () => {
  codeError.value = null
  // Code execution handled by InteractiveCanvas
}

const handleError = (error) => {
  codeError.value = error
}

const resetCode = () => {
  userCode.value = props.chapterCode
  localStorage.removeItem(`chapter-code-${props.chapterId}`)
  codeError.value = null
}
</script>

<template>
  <div class="interactive-chapter-layout">
    <!-- View Toggle -->
    <div class="view-switcher">
      <button
        @click="currentView = 'demo'"
        :class="{ active: currentView === 'demo' }"
      >
        📺 Demo
      </button>
      <button
        @click="currentView = 'editor'"
        :class="{ active: currentView === 'editor' }"
      >
        ✏️ Editor
      </button>
      <button
        @click="currentView = 'guide'"
        :class="{ active: currentView === 'guide' }"
      >
        📖 Guide
      </button>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Demo View -->
      <div v-if="currentView === 'demo'" class="demo-view">
        <slot name="demo" />
      </div>

      <!-- Editor View -->
      <div v-if="currentView === 'editor'" class="editor-view">
        <div class="editor-split">
          <div class="editor-panel">
            <CodeEditor
              :initial-code="userCode"
              @code-change="handleCodeChange"
              @run-code="handleRunCode"
            />
            <div v-if="codeError" class="error-panel">
              <h4>⚠️ Error</h4>
              <p>{{ codeError.message }}</p>
              <pre v-if="codeError.stack">{{ codeError.stack }}</pre>
            </div>
          </div>
          <div class="canvas-panel">
            <InteractiveCanvas
              :code="userCode"
              :auto-run="false"
              @error="handleError"
            />
          </div>
        </div>
      </div>

      <!-- Guide View -->
      <div v-if="currentView === 'guide'" class="guide-view">
        <MarkdownViewer :content="guideContent" />
      </div>
    </div>
  </div>
</template>
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal**: Set up basic code editor integration

**Tasks:**
1. **Install Dependencies**
   ```bash
   npm install monaco-editor
   npm install @monaco-editor/loader
   npm install @monaco-editor/react  # if using React wrapper
   ```

2. **Create CodeEditor Component**
   - Basic Monaco editor integration
   - Syntax highlighting for JavaScript
   - Line numbers and basic UI
   - Test with simple code snippets

3. **Update Vite Configuration**
   ```javascript
   // vite.config.js
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import monacoEditorPlugin from 'vite-plugin-monaco-editor'

   export default defineConfig({
     plugins: [
       vue(),
       monacoEditorPlugin({
         languages: ['javascript', 'typescript'],
       })
     ],
     optimizeDeps: {
       include: ['monaco-editor']
     }
   })
   ```

4. **Success Criteria**
   - [ ] Monaco editor renders correctly
   - [ ] Syntax highlighting works
   - [ ] Code can be edited
   - [ ] No console errors
   - [ ] Bundle size acceptable (<6MB total)

### Phase 2: Code Execution Engine (Week 2)
**Goal**: Safely execute user code and update Three.js scene

**Tasks:**
1. **Create Sandbox Execution Context**
   - Use Function constructor for code isolation
   - Provide safe access to THREE.js API
   - Limit access to global scope
   - Handle async operations

2. **Implement Resource Cleanup**
   - Track all created Three.js objects
   - Proper disposal of geometries, materials, textures
   - Cancel animation frames
   - Clear event listeners

3. **Error Handling System**
   ```javascript
   const executeCode = (code) => {
     try {
       // Wrap user code in try-catch
       const userFunc = new Function('THREE', 'scene', 'camera', `
         'use strict';
         ${code}
       `)

       userFunc(THREE, scene, camera)
     } catch (error) {
       return {
         success: false,
         error: {
           message: error.message,
           line: parseErrorLine(error),
           type: error.name
         }
       }
     }

     return { success: true }
   }
   ```

4. **Create Error Display Component**
   - Friendly error messages
   - Line number highlighting
   - Suggestions for common errors
   - Link to Three.js docs

5. **Success Criteria**
   - [ ] User code executes safely
   - [ ] Errors caught and displayed
   - [ ] No memory leaks
   - [ ] Scene updates correctly
   - [ ] Previous scene cleaned up

### Phase 3: UI/UX Polish (Week 3)
**Goal**: Create intuitive and beautiful editing experience

**Tasks:**
1. **Editor Toolbar**
   - Run button with keyboard shortcut (Ctrl/Cmd + Enter)
   - Reset button
   - Save button (to localStorage)
   - Download code button
   - Share button (copy code to clipboard)

2. **Visual Feedback**
   - Loading state when executing code
   - Success indicator (green flash)
   - Error indicator (red border)
   - Execution time display

3. **Split View Layout**
   - Resizable panels (editor | canvas)
   - Responsive breakpoints
   - Full-screen mode for canvas
   - Collapsible panels

4. **Code Templates**
   - Starter templates for each chapter
   - Challenge templates
   - Snippet library (common patterns)

5. **Success Criteria**
   - [ ] Intuitive UI/UX
   - [ ] Smooth animations
   - [ ] Responsive on mobile
   - [ ] Keyboard shortcuts work
   - [ ] Visual feedback is clear

### Phase 4: Enhanced Features (Week 4)
**Goal**: Add advanced features for better learning

**Tasks:**
1. **IntelliSense for Three.js**
   - Type definitions for autocomplete
   - Method signatures
   - Parameter hints
   - Documentation on hover

2. **Code Hints System**
   ```javascript
   const hints = {
     'BoxGeometry': {
       description: 'Creates a rectangular box geometry',
       params: ['width', 'height', 'depth'],
       example: 'new THREE.BoxGeometry(1, 1, 1)'
     },
     // ... more hints
   }
   ```

3. **Auto-formatting**
   - Format code on save
   - Consistent indentation
   - ESLint integration (optional)

4. **Version History**
   - Track code changes
   - Undo/redo beyond editor's built-in
   - Save multiple versions
   - Compare versions

5. **Embedded Challenges**
   ```vue
   <Challenge
     title="Change the Cube Color"
     description="Modify the code to make the cube red"
     validation={(scene) => {
       const cube = scene.children.find(c => c.type === 'Mesh')
       return cube.material.color.equals(new THREE.Color(0xff0000))
     }}
   />
   ```

6. **Success Criteria**
   - [ ] Autocomplete works
   - [ ] Code formatting works
   - [ ] Version history functional
   - [ ] Challenges are engaging

### Phase 5: Integration & Testing (Week 5)
**Goal**: Integrate with all chapters and test thoroughly

**Tasks:**
1. **Chapter Integration**
   - Update Chapter 1-11 to use InteractiveChapterLayout
   - Extract editable code sections
   - Add chapter-specific hints
   - Test each chapter individually

2. **Performance Optimization**
   - Lazy load Monaco editor
   - Code splitting
   - Debounce auto-run
   - Optimize Three.js disposal

3. **Testing**
   - Unit tests for code execution
   - Integration tests for UI
   - Performance benchmarks
   - Browser compatibility testing

4. **Documentation**
   - User guide for editor features
   - Developer docs for adding new chapters
   - Troubleshooting guide

5. **Success Criteria**
   - [ ] All chapters work with editor
   - [ ] No performance issues
   - [ ] Tests pass
   - [ ] Documentation complete

## Code Structure

### File Organization
```
src/
├── components/
│   ├── editor/
│   │   ├── CodeEditor.vue          # Monaco editor wrapper
│   │   ├── InteractiveCanvas.vue   # Live code execution
│   │   ├── ErrorPanel.vue          # Error display
│   │   ├── EditorToolbar.vue       # Editor controls
│   │   └── CodeHints.vue           # Hint system
│   ├── InteractiveChapterLayout.vue
│   └── Challenge.vue               # Interactive challenges
├── composables/
│   ├── useCodeExecution.js         # Code execution logic
│   ├── useCodePersistence.js       # localStorage management
│   └── useThreeCleanup.js          # Resource cleanup
├── utils/
│   ├── codeTemplates.js            # Chapter code templates
│   ├── errorParser.js              # Parse error messages
│   └── threeValidator.js           # Validate Three.js code
└── views/
    └── ChapterXX.vue               # Updated chapter files
```

## Data Structures

### Code Template Structure
```javascript
const chapterTemplate = {
  id: 'chapter-1',
  title: 'Basic Scene Setup',
  defaultCode: `
    // Create scene
    const scene = new THREE.Scene()

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    // Create cube
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // Animation
    function animate() {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
  `,
  editableRegions: [
    {
      start: 15, // Line number
      end: 18,
      description: 'Try changing the cube color or size'
    }
  ],
  hints: [
    'Try changing 0x00ff00 to 0xff0000 for a red cube',
    'Modify BoxGeometry parameters to change size'
  ],
  challenges: [
    {
      id: 'change-color',
      title: 'Make it Red',
      validator: (scene) => {
        const cube = scene.children[0]
        return cube.material.color.equals(new THREE.Color(0xff0000))
      }
    }
  ]
}
```

### User Progress Tracking
```javascript
const userProgress = {
  chapterId: 'chapter-1',
  completedChallenges: ['change-color', 'resize-cube'],
  savedCode: '// user modified code',
  lastModified: '2025-11-08T14:00:00Z',
  executionCount: 42,
  errorCount: 3
}
```

## Security Considerations

### Code Execution Safety
1. **No eval()**: Use Function constructor instead
2. **Strict Mode**: Always execute in strict mode
3. **No DOM Access**: Limit access to document/window
4. **Resource Limits**:
   - Max execution time: 5 seconds
   - Max geometry vertices: 100,000
   - Max textures: 10
5. **XSS Prevention**: Sanitize any user input

### Implementation
```javascript
const safeFunctionConstructor = (code) => {
  const allowedGlobals = {
    THREE,
    Math,
    console: {
      log: (...args) => console.log('[User]:', ...args),
      error: (...args) => console.error('[User]:', ...args)
    }
  }

  return new Function(
    ...Object.keys(allowedGlobals),
    `
    'use strict';
    ${code}
    `
  )(...Object.values(allowedGlobals))
}
```

## Performance Targets

### Metrics
- **Initial Load**: < 3 seconds (including Monaco)
- **Code Execution**: < 100ms for simple scenes
- **Re-render**: < 16ms (60 FPS maintained)
- **Memory**: < 50MB increase when editor active
- **Bundle Size**: Total app < 10MB gzipped

### Optimization Strategies
1. **Lazy Loading**: Load Monaco only when editor opened
2. **Web Workers**: Execute code in worker thread (advanced)
3. **Debouncing**: Debounce auto-run by 500ms
4. **Geometry Pooling**: Reuse common geometries
5. **Dispose Properly**: Always cleanup Three.js resources

## User Testing Plan

### Phase 1: Internal Testing
- Test with all 11 chapters
- Verify error handling
- Check performance metrics
- Test on different browsers

### Phase 2: Beta Testing
- 10-20 beta users
- Collect feedback survey
- Track usage analytics
- Monitor error rates

### Phase 3: Iteration
- Fix critical bugs
- Improve UX based on feedback
- Add requested features
- Optimize performance

## Success Metrics

### Quantitative
- **Engagement**: 60% of users try the editor
- **Completion**: 40% complete at least one challenge
- **Time**: Average session time increases by 50%
- **Errors**: Error rate < 5% of executions
- **Performance**: Maintains 60 FPS in 95% of cases

### Qualitative
- Users report better understanding of concepts
- Positive feedback on ease of use
- Requests for more interactive features
- Lower support questions about code

## Alternative Approaches

### Option 1: Sandboxed iFrame
**Pros**: Complete isolation, no security concerns
**Cons**: Complex messaging, harder to integrate Three.js context
**Verdict**: Too complex for this use case

### Option 2: Code Playground Links
**Pros**: Leverage existing solutions (CodeSandbox, CodePen)
**Cons**: External dependency, breaks flow, no integration
**Verdict**: Good for advanced users, not primary solution

### Option 3: Read-Only with Fiddles
**Pros**: Simple, low risk
**Cons**: Not truly interactive, limited learning value
**Verdict**: Could be Phase 0, not final solution

### Chosen: In-App Editor with Monaco
**Why**: Best balance of features, integration, and user experience

## Dependencies

### NPM Packages
```json
{
  "dependencies": {
    "monaco-editor": "^0.45.0",
    "three": "^0.160.0",
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "vite-plugin-monaco-editor": "^1.1.0",
    "@types/three": "^0.160.0"
  }
}
```

### Bundle Impact
- Monaco Editor: ~4MB (compressed ~1.2MB)
- Additional Components: ~50KB
- **Total Impact**: ~1.3MB (compressed)

## Rollout Strategy

### Phase 1: Soft Launch (Week 6)
- Enable for Chapter 1 only
- "Beta" badge on feature
- Collect initial feedback
- Monitor performance

### Phase 2: Gradual Rollout (Week 7-8)
- Enable for Chapters 1-5
- Address feedback
- Fix bugs
- Optimize based on usage

### Phase 3: Full Launch (Week 9)
- Enable for all chapters
- Remove "Beta" badge
- Announce feature
- Create tutorial video

## Future Enhancements

### Phase 2 Features (3-6 months)
1. **Collaborative Editing**: Share code with others in real-time
2. **AI Code Assistant**: Suggest improvements using AI
3. **Video Tutorials**: Embed video walkthroughs
4. **Community Gallery**: Share and browse user creations
5. **Advanced Debugger**: Step-through debugging
6. **Performance Profiler**: Visualize render performance

### Phase 3 Features (6-12 months)
1. **VR/AR Mode**: Test code in VR
2. **Mobile App**: Native mobile editor
3. **Offline Mode**: Work without internet
4. **Plugin System**: Extend with custom tools
5. **Course Creation**: Teachers can create custom chapters

## Risks & Mitigation

### Risk 1: Performance Degradation
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Extensive performance testing
- Lazy loading of editor
- Resource limits
- Fallback to view-only mode

### Risk 2: User Confusion
**Impact**: Medium
**Probability**: Medium
**Mitigation**:
- Clear onboarding tutorial
- Helpful hints and tooltips
- Video walkthrough
- Reset button always visible

### Risk 3: Security Vulnerabilities
**Impact**: High
**Probability**: Low
**Mitigation**:
- No eval() usage
- Strict sandboxing
- Regular security audits
- CSP headers

### Risk 4: Browser Compatibility
**Impact**: Medium
**Probability**: Low
**Mitigation**:
- Test on major browsers
- Polyfills for older browsers
- Graceful degradation
- Clear browser requirements

## Conclusion

This interactive code editor will transform the Three.js tutorial from a passive reading experience to an active learning platform. By allowing students to experiment with code in real-time, we'll significantly improve comprehension and retention.

**Next Steps:**
1. Review and approve plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Schedule weekly progress reviews
5. Prepare for user testing

**Timeline**: 9 weeks from approval to full launch
**Budget**: Minimal (only npm packages, which are free)
**Team**: 1-2 developers
**ROI**: Improved user engagement, better learning outcomes, higher completion rates
