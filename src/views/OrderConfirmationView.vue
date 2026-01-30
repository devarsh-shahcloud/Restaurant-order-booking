<template>
  <div class="order-confirmation-view">
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="text-center py-16">
        <div
          class="inline-block animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4">
        </div>
        <p class="text-gray-600">Loading order details...</p>
      </div>

      <div v-else-if="error" class="text-center py-16">
        <span class="text-8xl mb-6 block">❌</span>
        <h2 class="text-2xl font-semibold mb-4">Order Not Found</h2>
        <BaseButton @click="router.push('/menu')">Back to Menu</BaseButton>
      </div>

      <div v-else-if="order" class="max-w-2xl mx-auto text-center">
        <div class="mb-8">
          <span class="text-8xl inline-block">🎉</span>
        </div>

        <h1 class="text-3xl font-display font-bold mb-4 text-green-600">Order Confirmed!</h1>

        <div class="card p-6 mb-8">
          <p class="text-sm text-gray-500 mb-2">Order Number</p>
          <p class="text-2xl font-bold font-mono text-primary-600">{{ order.orderId }}</p>
        </div>

        <div class="card p-6 text-left mb-8">
          <h2 class="text-xl font-semibold mb-4">Order Details</h2>

          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">Order Type</span>
              <span class="font-medium capitalize">{{ order.orderType }}</span>
            </div>

            <div v-if="order.orderType === 'delivery' && order.deliveryAddress" class="flex justify-between">
              <span class="text-gray-600">Delivery To</span>
              <span class="font-medium text-right">
                {{ order.deliveryAddress.street }}<br />
                {{ order.deliveryAddress.city }}, {{ order.deliveryAddress.zipCode }}
              </span>
            </div>
            <div v-else-if="order.pickupTime" class="flex justify-between">
              <span class="text-gray-600">Pickup Time</span>
              <span class="font-medium">{{ formatPickupTime(order.pickupTime) }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600">Payment Method</span>
              <span class="font-medium capitalize">{{ order.paymentMethod }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600">Status</span>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                order.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : order.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
              ]">
                {{ order.status }}
              </span>
            </div>

            <div class="border-t pt-4">
              <h3 class="font-semibold mb-3">Items Ordered</h3>
              <div class="space-y-2">
                <div v-for="item in order.items" :key="item.cartItemId" class="flex justify-between text-sm">
                  <span>{{ item.quantity }}x {{ item.name }}</span>
                  <span class="text-gray-600">{{
                    formatCurrency(item.basePrice * item.quantity)
                    }}</span>
                </div>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span>{{ formatCurrency(order.pricing?.subtotal || 0) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax</span>
                <span>{{ formatCurrency(order.pricing?.tax || 0) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Delivery Fee</span>
                <span>{{ formatCurrency(order.pricing?.deliveryFee || 0) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span class="text-primary-600">{{
                  formatCurrency(order.pricing?.total || 0)
                  }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton variant="primary" @click="router.push('/menu')"> Order More 🍕 </BaseButton>
          <BaseButton variant="outline" @click="router.push('/orders')">
            View Order History
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore.js';
import { formatCurrency } from '@/utils/currency.js';
import BaseButton from '@/components/common/BaseButton.vue';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const order = ref(null);
const loading = ref(true);
const error = ref(null);

const formatPickupTime = (datetime) => {
  if (!datetime) return '';
  const date = new Date(datetime);
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

onMounted(async () => {
  try {
    const orderId = route.params.orderId;

    if (orderStore.currentOrder?.orderId === orderId) {
      order.value = orderStore.currentOrder;
    } else {
      order.value = await orderStore.fetchOrderById(orderId);
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>
