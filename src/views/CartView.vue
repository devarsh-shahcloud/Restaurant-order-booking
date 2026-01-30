<template>
  <div class="cart-view">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-display font-bold mb-8">Your Cart</h1>

      <div v-if="cartStore.isEmpty" class="text-center py-16">
        <span class="text-8xl mb-6 block">🛒</span>
        <h2 class="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <BaseButton size="lg" @click="router.push('/menu')">Browse Menu</BaseButton>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <CartItemRow v-for="item in cartStore.cartItems" :key="item.cartItemId" :item="item"
            @update-quantity="handleQuantityUpdate" @remove="handleRemoveItem" />
        </div>

        <div class="lg:col-span-1">
          <div class="card p-6 sticky top-24">
            <h2 class="text-xl font-semibold mb-4">Order Summary</h2>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cartStore.itemCount }} items)</span>
                <span>{{ formatCurrency(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{{ formatCurrency(cartStore.tax) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{{
                  cartStore.deliveryFee === 0 ? 'FREE' : formatCurrency(cartStore.deliveryFee)
                }}</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span class="text-primary-600">{{ formatCurrency(cartStore.total) }}</span>
                </div>
              </div>
            </div>

            <BaseButton variant="primary" size="lg" class="w-full" @click="router.push('/checkout')">
              Proceed to Checkout
            </BaseButton>

            <button @click="router.push('/menu')"
              class="w-full text-center text-primary-600 hover:text-primary-700 mt-4 text-lg font-medium">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore.js';
import { formatCurrency } from '@/utils/currency.js';
import CartItemRow from '@/components/cart/CartItemRow.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();
const cartStore = useCartStore();

const handleQuantityUpdate = ({ cartItemId, quantity }) => {
  cartStore.updateQuantity(cartItemId, quantity);
};

const handleRemoveItem = (cartItemId) => {
  cartStore.removeItem(cartItemId);
};

const confirmClearCart = () => {
  if (confirm('Are you sure you want to clear your entire cart?')) {
    cartStore.clearCart();
  }
};
</script>
