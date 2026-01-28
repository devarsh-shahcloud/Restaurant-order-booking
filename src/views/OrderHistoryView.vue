<template>
    <div class="order-history-view">
        <div class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-display font-bold mb-8">Order History</h1>

            <!-- Loading State -->
            <div v-if="orderStore.loading" class="text-center py-16">
                <div class="animate-spin text-4xl mb-4">⏳</div>
                <p class="text-gray-600">Loading orders...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="!orderStore.hasOrders" class="text-center py-16">
                <span class="text-8xl mb-6 block">📋</span>
                <h2 class="text-2xl font-semibold mb-4">No Orders Yet</h2>
                <p class="text-gray-600 mb-8">You haven't placed any orders yet. Start ordering now!</p>
                <BaseButton size="lg" @click="router.push('/menu')">Browse Menu</BaseButton>
            </div>

            <!-- Orders List -->
            <div v-else class="space-y-4">
                <div v-for="order in orderStore.allOrders" :key="order.orderId"
                    class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    @click="router.push(`/orders/${order.orderId}`)">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <!-- Order Info -->
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <span class="font-mono font-bold text-primary-600">{{ order.orderId }}</span>
                                <span :class="[
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                ]">
                                    {{ order.status }}
                                </span>
                            </div>

                            <p class="text-gray-600 text-sm mb-2">
                                {{ formatDate(order.createdAt) }} • {{ order.items?.length || 0 }} items
                            </p>

                            <p class="text-sm text-gray-500">
                                {{order.items?.map(item => item.name).join(', ').substring(0, 60)}}{{
                                    order.items?.length > 2 ? '...' : '' }}
                            </p>
                        </div>

                        <!-- Price & Actions -->
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-primary-600">{{ formatCurrency(order.pricing?.total ||
                                    0) }}</p>
                                <p class="text-sm text-gray-500 capitalize">{{ order.orderType }}</p>
                            </div>

                            <div class="flex gap-2">
                                <button @click.stop="handleReorder(order.orderId)"
                                    class="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                                    title="Reorder">
                                    🔄 Reorder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore.js'
import { formatCurrency } from '@/utils/currency.js'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const orderStore = useOrderStore()

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const handleReorder = async (orderId) => {
    const result = await orderStore.reorder(orderId)
    if (result.success) {
        alert(result.message)
        router.push('/cart')
    } else {
        alert('Failed to reorder: ' + result.message)
    }
}

onMounted(() => {
    orderStore.fetchOrderHistory()
})
</script>
