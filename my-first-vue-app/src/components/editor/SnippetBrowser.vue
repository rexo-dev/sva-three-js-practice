<template>
  <div class="snippet-browser">
    <!-- Header with Search -->
    <div class="browser-header">
      <h3>Code Snippets</h3>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search snippets..."
        class="search-input"
      />
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        @click="selectedCategory = cat.key"
        class="category-tab"
        :class="{ active: selectedCategory === cat.key }"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Snippets List -->
    <div class="snippets-list">
      <div
        v-for="snippet in filteredSnippets"
        :key="snippet.id"
        class="snippet-card"
      >
        <div class="snippet-header">
          <h4>{{ snippet.label }}</h4>
          <span class="snippet-category">{{ snippet.category }}</span>
        </div>
        <p class="snippet-description">{{ snippet.description }}</p>
        <pre class="snippet-code">{{ snippet.code }}</pre>
        <div class="snippet-actions">
          <button @click="copySnippet(snippet)" class="action-btn copy-btn">
            <span class="icon">📋</span> Copy
          </button>
          <button @click="insertSnippet(snippet)" class="action-btn insert-btn">
            <span class="icon">➕</span> Insert
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredSnippets.length === 0" class="empty-state">
        <p>No snippets found matching "{{ searchQuery }}"</p>
        <button @click="searchQuery = ''" class="clear-search-btn">
          Clear Search
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCodeSnippets } from '../../composables/useCodeSnippets'

const emit = defineEmits(['insert-snippet', 'snippet-copied'])

const {
  getAllSnippets,
  getSnippetsArray,
  searchSnippets,
  getSnippetsByCategory
} = useCodeSnippets()

const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { key: 'all', label: 'All' },
  { key: 'geometries', label: 'Geometries' },
  { key: 'materials', label: 'Materials' },
  { key: 'animation', label: 'Animation' },
  { key: 'lighting', label: 'Lighting' },
  { key: 'helpers', label: 'Helpers' },
  { key: 'templates', label: 'Templates' }
]

const filteredSnippets = computed(() => {
  let snippets = []

  // Get snippets based on category
  if (selectedCategory.value === 'all') {
    snippets = getSnippetsArray()
  } else {
    const categorySnippets = getSnippetsByCategory(selectedCategory.value)
    snippets = Object.entries(categorySnippets).map(([key, snippet]) => ({
      id: `${selectedCategory.value}_${key}`,
      ...snippet
    }))
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    snippets = snippets.filter(
      (s) =>
        s.label.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query)
    )
  }

  return snippets
})

const copySnippet = async (snippet) => {
  try {
    await navigator.clipboard.writeText(snippet.code)
    emit('snippet-copied', snippet)
  } catch (error) {
    console.error('Failed to copy snippet:', error)
  }
}

const insertSnippet = (snippet) => {
  emit('insert-snippet', snippet)
}
</script>

<style scoped>
.snippet-browser {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.browser-header {
  padding: 20px;
  background-color: #2d2d30;
  border-bottom: 1px solid #3e3e42;
}

.browser-header h3 {
  margin: 0 0 15px 0;
  color: #cccccc;
  font-size: 1.2rem;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  background-color: #1e1e1e;
  border: 1px solid #3e3e42;
  border-radius: 6px;
  color: #cccccc;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #42b883;
}

.search-input::placeholder {
  color: #666;
}

.category-tabs {
  display: flex;
  gap: 2px;
  padding: 10px;
  background-color: #252526;
  border-bottom: 1px solid #3e3e42;
  overflow-x: auto;
}

.category-tab {
  padding: 8px 16px;
  background-color: #2d2d30;
  color: #cccccc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.category-tab:hover {
  background-color: #3e3e42;
}

.category-tab.active {
  background-color: #42b883;
  color: white;
  font-weight: 600;
}

.snippets-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.snippet-card {
  background-color: #2d2d30;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #3e3e42;
  transition: border-color 0.2s;
}

.snippet-card:hover {
  border-color: #42b883;
}

.snippet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.snippet-header h4 {
  margin: 0;
  color: #cccccc;
  font-size: 1rem;
}

.snippet-category {
  padding: 3px 10px;
  background-color: #42b883;
  color: white;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.snippet-description {
  margin: 0 0 12px 0;
  color: #999;
  font-size: 0.85rem;
  line-height: 1.4;
}

.snippet-code {
  background-color: #1e1e1e;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #d4d4d4;
  overflow-x: auto;
  margin: 0 0 12px 0;
  border: 1px solid #3e3e42;
}

.snippet-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.copy-btn {
  background-color: #3e3e42;
  color: #cccccc;
}

.copy-btn:hover {
  background-color: #505053;
  transform: translateY(-1px);
}

.insert-btn {
  background-color: #42b883;
  color: white;
}

.insert-btn:hover {
  background-color: #35945f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 184, 131, 0.3);
}

.action-btn .icon {
  font-size: 1rem;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state p {
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.clear-search-btn {
  padding: 8px 20px;
  background-color: #3e3e42;
  color: #cccccc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.clear-search-btn:hover {
  background-color: #505053;
}

/* Scrollbar styling */
.snippets-list::-webkit-scrollbar {
  width: 8px;
}

.snippets-list::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.snippets-list::-webkit-scrollbar-thumb {
  background: #3e3e42;
  border-radius: 4px;
}

.snippets-list::-webkit-scrollbar-thumb:hover {
  background: #505053;
}

@media (max-width: 768px) {
  .browser-header {
    padding: 15px;
  }

  .category-tabs {
    overflow-x: scroll;
  }

  .category-tab {
    font-size: 0.8rem;
    padding: 6px 12px;
  }

  .snippet-card {
    padding: 12px;
  }

  .snippet-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .snippet-actions {
    flex-direction: column;
  }
}
</style>
