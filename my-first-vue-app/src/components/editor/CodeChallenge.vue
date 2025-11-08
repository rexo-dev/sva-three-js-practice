<template>
  <div class="code-challenge">
    <!-- Challenge Header -->
    <div class="challenge-header">
      <div class="challenge-info">
        <h3 class="challenge-title">{{ challenge.title }}</h3>
        <span class="challenge-difficulty" :class="challenge.difficulty">
          {{ challenge.difficulty }}
        </span>
      </div>
      <div class="challenge-status">
        <transition name="fade">
          <span v-if="isPassed" class="status-badge passed">
            <span class="icon">✓</span> Passed
          </span>
          <span v-else-if="hasTried && !isPassed" class="status-badge failed">
            <span class="icon">✗</span> Failed
          </span>
        </transition>
      </div>
    </div>

    <!-- Challenge Description -->
    <div class="challenge-description">
      <p>{{ challenge.description }}</p>

      <!-- Requirements List -->
      <div v-if="challenge.requirements && challenge.requirements.length > 0" class="requirements">
        <h4>Requirements:</h4>
        <ul>
          <li v-for="(req, index) in challenge.requirements" :key="index">
            {{ req }}
          </li>
        </ul>
      </div>

      <!-- Hints (collapsible) -->
      <details v-if="challenge.hints && challenge.hints.length > 0" class="hints-section">
        <summary>💡 Show Hints ({{ challenge.hints.length }})</summary>
        <ul class="hints-list">
          <li v-for="(hint, index) in challenge.hints" :key="index">
            <strong>Hint {{ index + 1 }}:</strong> {{ hint }}
          </li>
        </ul>
      </details>
    </div>

    <!-- Test Results -->
    <transition name="slide">
      <div v-if="testResults.length > 0" class="test-results">
        <h4>Test Results:</h4>
        <div class="test-list">
          <div
            v-for="(result, index) in testResults"
            :key="index"
            class="test-item"
            :class="{ passed: result.passed, failed: !result.passed }"
          >
            <span class="test-icon">{{ result.passed ? '✓' : '✗' }}</span>
            <span class="test-name">{{ result.name }}</span>
            <span v-if="!result.passed && result.message" class="test-message">
              {{ result.message }}
            </span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Action Buttons -->
    <div class="challenge-actions">
      <button @click="runTests" class="action-button test-button" :disabled="isRunning">
        <span class="icon">{{ isRunning ? '⟳' : '🧪' }}</span>
        {{ isRunning ? 'Testing...' : 'Run Tests' }}
      </button>
      <button
        v-if="isPassed && challenge.nextChallenge"
        @click="$emit('next-challenge')"
        class="action-button next-button"
      >
        <span class="icon">→</span> Next Challenge
      </button>
      <button
        v-if="challenge.showSolution"
        @click="showSolution"
        class="action-button solution-button"
      >
        <span class="icon">💡</span> Show Solution
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  challenge: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.title &&
        value.description &&
        value.validationFn &&
        typeof value.validationFn === 'function'
      )
    }
  },
  userCode: {
    type: String,
    required: true
  },
  scene: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['solution-requested', 'next-challenge', 'tests-passed', 'tests-failed'])

const isRunning = ref(false)
const hasTried = ref(false)
const testResults = ref([])

const isPassed = computed(() => {
  return testResults.value.length > 0 && testResults.value.every((r) => r.passed)
})

/**
 * Run validation tests on user code
 */
const runTests = async () => {
  isRunning.value = true
  hasTried.value = true
  testResults.value = []

  try {
    // Call the challenge's validation function
    const results = await props.challenge.validationFn(props.userCode, props.scene)

    // Ensure results is an array
    testResults.value = Array.isArray(results) ? results : [results]

    // Emit appropriate event
    if (isPassed.value) {
      emit('tests-passed', testResults.value)
    } else {
      emit('tests-failed', testResults.value)
    }
  } catch (error) {
    testResults.value = [
      {
        name: 'Validation Error',
        passed: false,
        message: error.message || 'An error occurred while running tests'
      }
    ]
    emit('tests-failed', testResults.value)
  } finally {
    isRunning.value = false
  }
}

/**
 * Request solution display
 */
const showSolution = () => {
  emit('solution-requested', props.challenge.solution)
}

defineExpose({
  runTests,
  isPassed,
  testResults
})
</script>

<style scoped>
.code-challenge {
  background-color: #2d2d30;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.challenge-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.challenge-title {
  margin: 0;
  color: #cccccc;
  font-size: 1.3rem;
  font-weight: 600;
}

.challenge-difficulty {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.challenge-difficulty.easy {
  background-color: rgba(66, 184, 131, 0.2);
  color: #42b883;
}

.challenge-difficulty.medium {
  background-color: rgba(255, 165, 0, 0.2);
  color: #ffa500;
}

.challenge-difficulty.hard {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.challenge-status {
  min-width: 100px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge.passed {
  background-color: rgba(66, 184, 131, 0.2);
  color: #42b883;
  border: 1px solid #42b883;
}

.status-badge.failed {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.challenge-description {
  color: #cccccc;
  margin-bottom: 20px;
  line-height: 1.6;
}

.challenge-description p {
  margin: 0 0 15px 0;
}

.requirements {
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 6px;
  border-left: 3px solid #42b883;
  margin-bottom: 15px;
}

.requirements h4 {
  margin: 0 0 10px 0;
  color: #42b883;
  font-size: 0.95rem;
}

.requirements ul {
  margin: 0;
  padding-left: 20px;
}

.requirements li {
  margin-bottom: 6px;
}

.hints-section {
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 6px;
  border-left: 3px solid #ffa500;
  cursor: pointer;
}

.hints-section summary {
  color: #ffa500;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  user-select: none;
}

.hints-section summary:hover {
  color: #ffb732;
}

.hints-list {
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: #cccccc;
}

.hints-list li {
  margin-bottom: 8px;
}

.test-results {
  background-color: #1e1e1e;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.test-results h4 {
  margin: 0 0 12px 0;
  color: #cccccc;
  font-size: 0.95rem;
}

.test-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.test-item.passed {
  background-color: rgba(66, 184, 131, 0.1);
  border-left: 3px solid #42b883;
}

.test-item.failed {
  background-color: rgba(231, 76, 60, 0.1);
  border-left: 3px solid #e74c3c;
}

.test-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.test-item.passed .test-icon {
  color: #42b883;
}

.test-item.failed .test-icon {
  color: #e74c3c;
}

.test-name {
  flex: 1;
  color: #cccccc;
  font-weight: 500;
}

.test-message {
  color: #999;
  font-size: 0.85rem;
  font-style: italic;
  margin-top: 4px;
}

.challenge-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-button {
  background-color: #42b883;
  color: white;
}

.test-button:hover:not(:disabled) {
  background-color: #35945f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}

.next-button {
  background-color: #007acc;
  color: white;
}

.next-button:hover {
  background-color: #005a9e;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 122, 204, 0.3);
}

.solution-button {
  background-color: #555;
  color: white;
}

.solution-button:hover {
  background-color: #666;
}

.action-button .icon {
  font-size: 1.1rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@media (max-width: 768px) {
  .challenge-header {
    flex-direction: column;
    gap: 10px;
  }

  .challenge-info {
    width: 100%;
  }

  .challenge-status {
    width: 100%;
  }

  .action-button {
    flex: 1;
    justify-content: center;
  }
}
</style>
