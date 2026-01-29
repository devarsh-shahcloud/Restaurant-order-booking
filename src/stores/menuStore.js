import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as api from '@/services/api.js';

export const useMenuStore = defineStore('menu', () => {
  const items = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const cacheTimestamp = ref(null);

  const CACHE_DURATION = 5 * 60 * 1000;

  const allItems = computed(() => items.value);

  const featuredItems = computed(() => {
    return items.value.filter((item) => item.featured);
  });

  const getItemById = computed(() => {
    return (itemId) => items.value.find((item) => item.id === itemId);
  });

  const getItemsByCategory = computed(() => {
    return (categoryId) => items.value.filter((item) => item.category === categoryId);
  });

  const getCategoryById = computed(() => {
    return (categoryId) => categories.value.find((cat) => cat.id === categoryId);
  });

  const isCacheValid = computed(() => {
    if (!cacheTimestamp.value) return false;
    return Date.now() - cacheTimestamp.value < CACHE_DURATION;
  });

  async function fetchMenu(force = false) {
    if (isCacheValid.value && items.value.length > 0 && !force) {
      return items.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const data = await api.fetchMenu();
      items.value = data;
      cacheTimestamp.value = Date.now();
      return data;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories(force = false) {
    if (isCacheValid.value && categories.value.length > 0 && !force) {
      return categories.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const data = await api.fetchCategories();
      categories.value = data;
      return data;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchItemDetails(itemId) {
    const cachedItem = getItemById.value(itemId);
    if (cachedItem) {
      return cachedItem;
    }

    loading.value = true;
    error.value = null;

    try {
      const data = await api.fetchItemDetails(itemId);
      if (!data) {
        throw new Error('Item not found');
      }
      return data;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function searchItems(query) {
    loading.value = true;
    error.value = null;

    try {
      const results = await api.searchMenuItems(query);
      return results;
    } catch (e) {
      error.value = e.message;
      return [];
    } finally {
      loading.value = false;
    }
  }

  function clearCache() {
    cacheTimestamp.value = null;
  }

  return {
    items,
    categories,
    loading,
    error,
    allItems,
    featuredItems,
    getItemById,
    getItemsByCategory,
    getCategoryById,
    fetchMenu,
    fetchCategories,
    fetchItemDetails,
    searchItems,
    clearCache,
  };
});
