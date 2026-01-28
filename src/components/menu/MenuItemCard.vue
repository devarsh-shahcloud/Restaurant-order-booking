<template>
  <div class="menu-item-card card overflow-hidden hover:shadow-card-hover transition-all group">
    <div class="relative">
      <img :src="item.image" :alt="item.name"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />

      <!-- Out of Stock Overlay -->
      <div v-if="!item.availability" class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <span class="text-white font-bold text-lg">Out of Stock</span>
      </div>

      <!-- Featured Badge -->
      <div v-if="item.featured"
        class="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        ⭐ Featured
      </div>

      <!-- Rating -->
      <div v-if="item.rating"
        class="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-lg shadow-md flex items-center gap-1">
        <span class="text-yellow-500">★</span>
        <span class="font-semibold text-sm">{{ item.rating.toFixed(1) }}</span>
        <span class="text-gray-500 text-xs">({{ item.reviews }})</span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2 line-clamp-1">
        {{ item.name }}
      </h3>

      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ item.description }}
      </p>

      <div class="flex items-center justify-between">
        <div>
          <span class="text-2xl font-bold text-primary-600">{{ formatCurrency(item.price) }}</span>
          <span v-if="item.preparationTime" class="block text-xs text-gray-500">
            🕐 {{ item.preparationTime }} min
          </span>
        </div>

        <BaseButton v-if="item.availability" size="sm" @click.stop="handleAddToCart" :disabled="!item.availability"
          icon="+">
          Add
        </BaseButton>
        <BaseButton v-else size="sm" variant="outline" disabled>
          Unavailable
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '@/utils/currency.js'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const handleAddToCart = () => {
  emit('add-to-cart', props.item)
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
