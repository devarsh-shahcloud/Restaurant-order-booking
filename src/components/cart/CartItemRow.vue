<template>
  <div class="cart-item-row card p-4 flex gap-4">
    <img
      :src="item.image"
      :alt="item.name"
      class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
    />

    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-lg mb-1">{{ item.name }}</h3>

      <div
        v-if="item.customizations && Object.keys(item.customizations).length > 0"
        class="text-sm text-gray-600 mb-2"
      >
        <div v-for="(customization, type) in item.customizations" :key="type" class="capitalize">
          {{ type.replace('-', ' ') }}: {{ customization.name }}
          <span v-if="customization.price > 0" class="text-green-600">
            (+{{ formatCurrency(customization.price) }})
          </span>
        </div>
      </div>

      <div class="flex items-center gap-4 mb-2">
        <div class="flex items-center gap-2">
          <button
            @click="decreaseQuantity"
            class="w-8 h-8 rounded border border-gray-300 hover:border-primary-600 transition-colors font-bold text-sm"
            :disabled="item.quantity <= 1"
          >
            -
          </button>
          <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
          <button
            @click="increaseQuantity"
            class="w-8 h-8 rounded border border-gray-300 hover:border-primary-600 transition-colors font-bold text-sm"
            :disabled="item.quantity >= 99"
          >
            +
          </button>
        </div>

        <div class="flex-1">
          <div class="font-bold text-primary-600">{{ formatCurrency(itemTotal) }}</div>
          <div class="text-xs text-gray-500">{{ formatCurrency(basePrice) }} each</div>
        </div>

        <button
          @click="handleRemove"
          class="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
          title="Remove item"
        >
          <span class="text-xl">🗑️</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency } from '@/utils/currency.js';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update-quantity', 'remove']);

const basePrice = computed(() => {
  let price = props.item.basePrice;

  if (props.item.customizations) {
    for (const customization of Object.values(props.item.customizations)) {
      if (customization.price) {
        price += customization.price;
      }
    }
  }

  return price;
});

const itemTotal = computed(() => {
  return basePrice.value * props.item.quantity;
});

const increaseQuantity = () => {
  if (props.item.quantity < 99) {
    emit('update-quantity', {
      cartItemId: props.item.cartItemId,
      quantity: props.item.quantity + 1,
    });
  }
};

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    emit('update-quantity', {
      cartItemId: props.item.cartItemId,
      quantity: props.item.quantity - 1,
    });
  }
};

const handleRemove = () => {
  emit('remove', props.item.cartItemId);
};
</script>
