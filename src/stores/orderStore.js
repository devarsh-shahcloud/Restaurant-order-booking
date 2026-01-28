import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '@/services/api.js'
import { useCartStore } from './cartStore.js'

export const useOrderStore = defineStore('order', () => {
    // State
    const orders = ref([])
    const currentOrder = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const allOrders = computed(() => orders.value)

    const pendingOrders = computed(() => {
        return orders.value.filter(order => order.status === 'pending')
    })

    const completedOrders = computed(() => {
        return orders.value.filter(order => order.status === 'completed')
    })

    const cancelledOrders = computed(() => {
        return orders.value.filter(order => order.status === 'cancelled')
    })

    const getOrderById = computed(() => {
        return (orderId) => orders.value.find(order => order.orderId === orderId)
    })

    const hasOrders = computed(() => orders.value.length > 0)

    // Actions
    async function submitOrder(orderData) {
        loading.value = true
        error.value = null

        try {
            const order = await api.submitOrder(orderData)
            orders.value.unshift(order) // Add to beginning
            currentOrder.value = order

            // Clear cart after successful order
            const cartStore = useCartStore()
            cartStore.clearCart()

            return order
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    async function fetchOrderHistory() {
        loading.value = true
        error.value = null

        try {
            const data = await api.fetchOrderHistory()
            orders.value = data
            return data
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    async function fetchOrderById(orderId) {
        loading.value = true
        error.value = null

        try {
            // Check if order exists in store first
            const existingOrder = getOrderById.value(orderId)
            if (existingOrder) {
                currentOrder.value = existingOrder
                return existingOrder
            }

            // Fetch from API
            const order = await api.fetchOrderById(orderId)
            if (!order) {
                throw new Error('Order not found')
            }

            currentOrder.value = order
            return order
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    async function cancelOrder(orderId) {
        loading.value = true
        error.value = null

        try {
            const order = await api.cancelOrder(orderId)

            // Update in local state
            const index = orders.value.findIndex(o => o.orderId === orderId)
            if (index !== -1) {
                orders.value[index] = order
            }

            if (currentOrder.value?.orderId === orderId) {
                currentOrder.value = order
            }

            return order
        } catch (e) {
            error.value = e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    async function reorder(orderId) {
        try {
            const order = getOrderById.value(orderId) || await fetchOrderById(orderId)

            if (!order) {
                throw new Error('Order not found')
            }

            const cartStore = useCartStore()

            // Add each item from the order to cart
            let addedCount = 0
            let skippedCount = 0

            for (const item of order.items) {
                try {
                    // Reconstruct menu item object
                    const menuItem = {
                        id: item.menuItemId,
                        name: item.name,
                        price: item.basePrice,
                        image: item.image,
                        category: item.category,
                    }

                    cartStore.addItem(menuItem, item.quantity, item.customizations || {})
                    addedCount++
                } catch (e) {
                    skippedCount++
                }
            }

            return {
                success: true,
                addedCount,
                skippedCount,
                message: skippedCount > 0
                    ? `${addedCount} items added to cart, ${skippedCount} items unavailable`
                    : `${addedCount} items added to cart`
            }
        } catch (e) {
            error.value = e.message
            return {
                success: false,
                message: e.message
            }
        }
    }

    function setCurrentOrder(order) {
        currentOrder.value = order
    }

    function clearError() {
        error.value = null
    }

    return {
        // State
        orders,
        currentOrder,
        loading,
        error,

        // Getters
        allOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        getOrderById,
        hasOrders,

        // Actions
        submitOrder,
        fetchOrderHistory,
        fetchOrderById,
        cancelOrder,
        reorder,
        setCurrentOrder,
        clearError,
    }
})
