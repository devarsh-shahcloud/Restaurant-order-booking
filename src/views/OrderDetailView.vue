<template>
    <div class="order-detail-view">
        <div class="container mx-auto px-4 py-8">
            <!-- Back Button -->
            <button @click="router.push('/orders')"
                class="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
                ← Back to Orders
            </button>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-16">
                <div class="animate-spin text-4xl mb-4">⏳</div>
                <p class="text-gray-600">Loading order details...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-16">
                <span class="text-8xl mb-6 block">❌</span>
                <h2 class="text-2xl font-semibold mb-4">Order Not Found</h2>
                <p class="text-gray-600 mb-8">{{ error }}</p>
                <BaseButton @click="router.push('/orders')">Back to Orders</BaseButton>
            </div>

            <!-- Order Details -->
            <div v-else-if="order" class="max-w-3xl mx-auto">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-display font-bold">Order Details</h1>
                        <p class="text-gray-600 font-mono">{{ order.orderId }}</p>
                    </div>
                    <span :class="[
                        'mt-4 sm:mt-0 px-4 py-2 rounded-full text-sm font-medium inline-block',
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                    ]">
                        {{ order.status }}
                    </span>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <!-- Customer Info -->
                    <div class="card p-6">
                        <h2 class="text-lg font-semibold mb-4">👤 Customer Information</h2>
                        <div class="space-y-2 text-gray-600">
                            <p><strong>Name:</strong> {{ order.customerInfo?.name }}</p>
                            <p><strong>Email:</strong> {{ order.customerInfo?.email }}</p>
                            <p><strong>Phone:</strong> {{ order.customerInfo?.phone }}</p>
                        </div>
                    </div>

                    <!-- Order Info -->
                    <div class="card p-6">
                        <h2 class="text-lg font-semibold mb-4">📦 Order Information</h2>
                        <div class="space-y-2 text-gray-600">
                            <p><strong>Type:</strong> <span class="capitalize">{{ order.orderType }}</span></p>
                            <p><strong>Payment:</strong> <span class="capitalize">{{ order.paymentMethod }}</span></p>
                            <p><strong>Date:</strong> {{ formatDate(order.createdAt) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Delivery/Pickup Details -->
                <div class="card p-6 mb-8">
                    <h2 class="text-lg font-semibold mb-4">
                        {{ order.orderType === 'delivery' ? '🚚 Delivery Address' : '🏪 Pickup Details' }}
                    </h2>
                    <div v-if="order.orderType === 'delivery' && order.deliveryAddress" class="text-gray-600">
                        <p>{{ order.deliveryAddress.street }}</p>
                        <p v-if="order.deliveryAddress.apartment">{{ order.deliveryAddress.apartment }}</p>
                        <p>{{ order.deliveryAddress.city }}, {{ order.deliveryAddress.zipCode }}</p>
                        <p v-if="order.deliveryAddress.instructions" class="mt-2 italic">
                            Note: {{ order.deliveryAddress.instructions }}
                        </p>
                    </div>
                    <div v-else class="text-gray-600">
                        <p><strong>Pickup Time:</strong> {{ formatPickupTime(order.pickupTime) }}</p>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="card p-6 mb-8">
                    <h2 class="text-lg font-semibold mb-4">🍽️ Order Items</h2>
                    <div class="space-y-4">
                        <div v-for="item in order.items" :key="item.cartItemId"
                            class="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                            <img v-if="item.image" :src="item.image" :alt="item.name"
                                class="w-16 h-16 rounded-lg object-cover" />
                            <div class="flex-1">
                                <h3 class="font-medium">{{ item.name }}</h3>
                                <p class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
                                <div v-if="item.customizations && Object.keys(item.customizations).length"
                                    class="text-xs text-gray-500 mt-1">
                                    <span v-for="(customization, type) in item.customizations" :key="type"
                                        class="capitalize">
                                        {{ type.replace('-', ' ') }}: {{ customization.name }}
                                    </span>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold">{{ formatCurrency(item.basePrice * item.quantity) }}</p>
                                <p class="text-xs text-gray-500">{{ formatCurrency(item.basePrice) }} each</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pricing Summary -->
                <div class="card p-6 mb-8">
                    <h2 class="text-lg font-semibold mb-4">💰 Payment Summary</h2>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Subtotal</span>
                            <span>{{ formatCurrency(order.pricing?.subtotal || 0) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Tax</span>
                            <span>{{ formatCurrency(order.pricing?.tax || 0) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Delivery Fee</span>
                            <span>{{ order.pricing?.deliveryFee === 0 ? 'FREE' :
                                formatCurrency(order.pricing?.deliveryFee || 0) }}</span>
                        </div>
                        <div class="flex justify-between text-xl font-bold border-t pt-3">
                            <span>Total</span>
                            <span class="text-primary-600">{{ formatCurrency(order.pricing?.total || 0) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4">
                    <BaseButton variant="primary" @click="handleReorder" :disabled="reordering">
                        {{ reordering ? 'Adding to Cart...' : '🔄 Reorder' }}
                    </BaseButton>

                    <BaseButton v-if="order.status === 'pending'" variant="outline"
                        class="border-red-600 text-red-600 hover:bg-red-50" @click="handleCancelOrder"
                        :disabled="cancelling">
                        {{ cancelling ? 'Cancelling...' : '❌ Cancel Order' }}
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore.js'
import { formatCurrency } from '@/utils/currency.js'
import BaseButton from '@/components/common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref(null)
const loading = ref(true)
const error = ref(null)
const reordering = ref(false)
const cancelling = ref(false)

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatPickupTime = (datetime) => {
    if (!datetime) return ''
    const date = new Date(datetime)
    return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })
}

const handleReorder = async () => {
    reordering.value = true
    try {
        const result = await orderStore.reorder(order.value.orderId)
        if (result.success) {
            alert(result.message)
            router.push('/cart')
        } else {
            alert('Failed to reorder: ' + result.message)
        }
    } finally {
        reordering.value = false
    }
}

const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    cancelling.value = true
    try {
        const updatedOrder = await orderStore.cancelOrder(order.value.orderId)
        order.value = updatedOrder
        alert('Order has been cancelled.')
    } catch (e) {
        alert('Failed to cancel order: ' + e.message)
    } finally {
        cancelling.value = false
    }
}

onMounted(async () => {
    try {
        const orderId = route.params.orderId
        order.value = await orderStore.fetchOrderById(orderId)
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
})
</script>
