<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const chapters = [
  {
    number: 1,
    title: 'Basic Scene Setup',
    description: 'Learn the fundamentals: scene, camera, renderer, and your first 3D object',
    path: '/chapter-1',
  },
  {
    number: 2,
    title: 'Geometries',
    description: 'Explore different shapes and understand how 3D geometry works',
    path: '/chapter-2',
  },
  {
    number: 3,
    title: 'Materials',
    description: 'Add color and surface properties to your 3D objects',
    path: '/chapter-3',
  },
  {
    number: 4,
    title: 'Textures',
    description: 'Apply images and patterns to your 3D models',
    path: '/chapter-4',
  },
  {
    number: 5,
    title: 'Lighting',
    description: 'Illuminate your scene with different types of lights',
    path: '/chapter-5',
  },
  {
    number: 6,
    title: 'Camera Controls',
    description: 'Add interactive camera movement and orbit controls',
    path: '/chapter-6',
  },
  {
    number: 7,
    title: 'Animation',
    description: 'Bring your scene to life with smooth animations',
    path: '/chapter-7',
  },
  {
    number: 8,
    title: 'Shadows',
    description: 'Add realistic shadows to enhance depth and realism',
    path: '/chapter-8',
  },
  {
    number: 9,
    title: 'Loading 3D Models',
    description: 'Import and display external 3D models in your scene',
    path: '/chapter-9',
  },
  {
    number: 10,
    title: 'Interactive Scene',
    description: 'Create a fully interactive 3D experience with mouse interaction',
    path: '/chapter-10',
  },
]

const startLearning = () => {
  router.push('/chapter-1')
}
</script>

<template>
  <main class="home">
    <div class="hero">
      <h1>Learn Three.js</h1>
      <p class="subtitle">
        A step-by-step interactive guide to mastering 3D graphics on the web
      </p>
      <button @click="startLearning" class="start-button">Start Learning</button>
    </div>

    <div class="chapters-grid">
      <div
        v-for="chapter in chapters"
        :key="chapter.number"
        class="chapter-card"
        @click="router.push(chapter.path)"
      >
        <div class="chapter-number">{{ chapter.number }}</div>
        <h3>{{ chapter.title }}</h3>
        <p>{{ chapter.description }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 2rem;
  overflow-y: auto;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.start-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.start-button:hover {
  background-color: #35945f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chapter-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.chapter-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
}

.chapter-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.chapter-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.chapter-card p {
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .chapters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
