<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navigation from './components/Navigation.vue'
import { computed } from 'vue'

const route = useRoute()

// Show navigation only on chapter pages
const showNavigation = computed(() => {
  return route.path.startsWith('/chapter-')
})
</script>

<template>
  <div class="app-container">
    <Navigation v-if="showNavigation" />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
