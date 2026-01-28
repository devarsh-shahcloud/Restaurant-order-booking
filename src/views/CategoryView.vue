<template>
  <div class="category-view">
    <div v-if="menuStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 9" :key="i" class="card p-4">
        <div class="skeleton h-48 mb-4"></div>
        <div class="skeleton h-6 mb-2"></div>
        <div class="skeleton h-4"></div>
      </div>
    </div>

    <div v-else>
      <!-- Category Header -->
      <div v-if="currentCategoryData" class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-4xl">{{ currentCategoryData.icon }}</span>
          <h2 class="text-3xl font-display font-bold">{{ currentCategoryData.name }}</h2>
        </div>
        <p class="text-gray-600">{{ currentCategoryData.description }} • {{ filteredItems.length }} items</p>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <p class="text-gray-600">{{ filteredItems.length }} items available</p>

        <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <!-- Search Bar -->
          <div class="relative w-full md:w-64">
            <input v-model="searchQuery" type="text" placeholder="Search items..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      <!-- Items Grid -->
      <div v-if="filteredItems.length === 0" class="text-center py-12">
        <span class="text-6xl mb-4 block">🍽️</span>
        <p class="text-xl text-gray-600">No items in this category yet</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MenuItemCard v-for="item in filteredItems" :key="item.id" :item="item" @add-to-cart="handleAddToCart" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore.js'
import { useCartStore } from '@/stores/cartStore.js'
import MenuItemCard from '@/components/menu/MenuItemCard.vue'

const route = useRoute()
const menuStore = useMenuStore()
const cartStore = useCartStore()

const searchQuery = ref('')

const categoryId = computed(() => route.params.category || null)

const currentCategoryData = computed(() => {
  return menuStore.getCategoryById(categoryId.value)
})

const filteredItems = computed(() => {
  let items = []
  if (!categoryId.value) {
    items = menuStore.allItems
  } else {
    items = menuStore.getItemsByCategory(categoryId.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    items = items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    )
  }

  return items
})

onMounted(async () => {
  if (menuStore.allItems.length === 0) {
    await menuStore.fetchMenu()
  }
})

const handleAddToCart = (item) => {
  cartStore.addItem(item)
}
</script>
