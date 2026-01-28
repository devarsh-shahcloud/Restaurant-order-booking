<template>
  <div class="menu-view">
    <!-- Search Results or Category View -->
    <div class="container mx-auto px-4 py-8">
      <!-- Category/All Items View -->
      <router-view />
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

const categories = ref([])
const currentCategory = computed(() => route.params.category)

onMounted(async () => {
  try {
    await menuStore.fetchMenu()
    categories.value = await menuStore.fetchCategories()
  } catch (error) {
    console.error('Error loading menu:', error)
  }
})

const handleAddToCart = (item) => {
  cartStore.addItem(item)
}
</script>
