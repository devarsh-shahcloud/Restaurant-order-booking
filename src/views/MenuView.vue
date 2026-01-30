<template>
  <div class="menu-view">
    <div class="container mx-auto px-4 py-8">
      <div v-if="menuStore.loading" class="flex flex-col items-center justify-center py-16">
        <div
          class="animate-spin w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
        ></div>
        <p class="text-gray-600 mt-4">Loading menu...</p>
      </div>

      <div v-else>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 class="text-3xl font-display font-bold">Our Menu</h1>

          <div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div class="relative w-full md:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search items..."
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        <p class="text-gray-600 mb-6">{{ filteredItems.length }} items available</p>

        <div v-if="filteredItems.length === 0" class="text-center py-12">
          <span class="text-6xl mb-4 block">🍽️</span>
          <p class="text-xl text-gray-600">No items found</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMenuStore } from '@/stores/menuStore.js';
import { useCartStore } from '@/stores/cartStore.js';
import MenuItemCard from '@/components/menu/MenuItemCard.vue';

const menuStore = useMenuStore();
const cartStore = useCartStore();

const searchQuery = ref('');

const filteredItems = computed(() => {
  let items = menuStore.allItems;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query),
    );
  }

  return items;
});

onMounted(async () => {
  if (menuStore.allItems.length === 0) {
    await menuStore.fetchMenu();
  }
});

const handleAddToCart = (item) => {
  cartStore.addItem(item);
};
</script>
