<template>
  <nav class="navigation">
    <div class="nav-header">
      <router-link to="/" class="home-link">Three.js Tutorial</router-link>
    </div>
    <div class="chapter-list">
      <router-link
        v-for="chapter in chapters"
        :key="chapter.path"
        :to="chapter.path"
        class="chapter-link"
        active-class="active"
      >
        <span class="chapter-number">{{ chapter.number }}</span>
        <span class="chapter-title">{{ chapter.title }}</span>
      </router-link>
    </div>
    <div class="nav-controls" v-if="currentChapterIndex !== -1">
      <button
        @click="goToPrevious"
        :disabled="currentChapterIndex === 0"
        class="nav-button"
      >
        Previous
      </button>
      <button
        @click="goToNext"
        :disabled="currentChapterIndex === chapters.length - 1"
        class="nav-button"
      >
        Next
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const chapters = [
  { number: 1, title: 'Basic Scene Setup', path: '/chapter-1' },
  { number: 2, title: 'Geometries', path: '/chapter-2' },
  { number: 3, title: 'Materials', path: '/chapter-3' },
  { number: 4, title: 'Textures', path: '/chapter-4' },
  { number: 5, title: 'Lighting', path: '/chapter-5' },
  { number: 6, title: 'Camera Controls', path: '/chapter-6' },
  { number: 7, title: 'Animation', path: '/chapter-7' },
  { number: 8, title: 'Shadows', path: '/chapter-8' },
  { number: 9, title: 'Loading 3D Models', path: '/chapter-9' },
  { number: 10, title: 'Interactive Scene', path: '/chapter-10' },
]

const currentChapterIndex = computed(() => {
  return chapters.findIndex((chapter) => chapter.path === route.path)
})

const goToPrevious = () => {
  if (currentChapterIndex.value > 0) {
    router.push(chapters[currentChapterIndex.value - 1].path)
  }
}

const goToNext = () => {
  if (currentChapterIndex.value < chapters.length - 1) {
    router.push(chapters[currentChapterIndex.value + 1].path)
  }
}
</script>

<style scoped>
.navigation {
  background-color: #2c3e50;
  color: white;
  padding: 0.75rem;
  height: 100vh;
  width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.nav-header {
  margin-bottom: 1.5rem;
}

.home-link {
  color: #42b883;
  text-decoration: none;
  font-size: 1rem;
  font-weight: bold;
  display: block;
  line-height: 1.3;
}

.home-link:hover {
  color: #35945f;
}

.chapter-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.chapter-link {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.chapter-link:hover {
  background-color: #34495e;
}

.chapter-link.active {
  background-color: #42b883;
  color: white;
}

.chapter-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin-right: 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
}

.chapter-link.active .chapter-number {
  background-color: rgba(255, 255, 255, 0.3);
}

.chapter-title {
  font-size: 0.8rem;
  line-height: 1.3;
  word-wrap: break-word;
}

.nav-controls {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-button {
  flex: 1;
  padding: 0.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.nav-button:hover:not(:disabled) {
  background-color: #35945f;
}

.nav-button:disabled {
  background-color: #34495e;
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
