import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as api from "@/services/api.js";

export const useMenuStore = defineStore("menu", () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const cacheTimestamp = ref(null);

  const CACHE_DURATION = 5 * 60 * 1000;

  const allItems = computed(() => items.value);

  const getItemById = computed(() => {
    return (itemId) => items.value.find((item) => item.id === itemId);
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

  function clearCache() {
    cacheTimestamp.value = null;
  }

  return {
    items,
    loading,
    error,
    allItems,
    getItemById,
    fetchMenu,
    clearCache,
  };
});
