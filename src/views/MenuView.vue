<template>
  <div class="menu-view">
    <div class="container mx-auto px-4 py-8">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useMenuStore } from '@/stores/menuStore.js';

const menuStore = useMenuStore();

onMounted(async () => {
  try {
    await menuStore.fetchMenu();
    await menuStore.fetchCategories();
  } catch (error) {
    console.error('Error loading menu:', error);
  }
});
</script>
