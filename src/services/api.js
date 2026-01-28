import { menuItems, categories } from '@/data/menu.js'
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage.js'

/**
 * Simulate network delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 * @returns {Promise}
 */
const delay = (min = 300, max = 800) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Simulate random API errors (5% failure rate)
 * @throws {Error} Simulated network error
 */
const simulateError = () => {
    if (Math.random() < 0.05) {
        throw new Error('Network request failed. Please try again.')
    }
}

/**
 * Fetch all menu items or filter by category
 * @param {string} categoryId - Optional category filter
 * @returns {Promise<Array>} Menu items
 */
export const fetchMenu = async (categoryId = null) => {
    await delay()
    simulateError()

    if (categoryId) {
        return menuItems.filter(item => item.category === categoryId)
    }

    return menuItems
}

/**
 * Fetch all categories
 * @returns {Promise<Array>} Categories
 */
export const fetchCategories = async () => {
    await delay(200, 400)
    simulateError()

    return categories
}

/**
 * Fetch item details by ID
 * @param {string} itemId - Item ID
 * @returns {Promise<Object|null>} Item details or null
 */
export const fetchItemDetails = async (itemId) => {
    await delay()
    simulateError()

    const item = menuItems.find(item => item.id === itemId)
    return item || null
}

/**
 * Search menu items by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching items
 */
export const searchMenuItems = async (query) => {
    await delay(200, 500)
    simulateError()

    if (!query || query.trim() === '') {
        return []
    }

    const lowerQuery = query.toLowerCase()

    return menuItems.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(lowerQuery)
        const descriptionMatch = item.description.toLowerCase().includes(lowerQuery)
        const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))

        return nameMatch || descriptionMatch || tagsMatch
    })
}

/**
 * Submit order
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Created order
 */
export const submitOrder = async (orderData) => {
    await delay(1000, 2000)
    simulateError()

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const order = {
        ...orderData,
        orderId,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        estimatedTime: 45, // minutes
    }

    // Save to localStorage
    const orders = getItem(STORAGE_KEYS.ORDERS, [])
    orders.unshift(order) // Add to beginning
    setItem(STORAGE_KEYS.ORDERS, orders)

    return order
}

/**
 * Fetch order history from localStorage
 * @returns {Promise<Array>} Orders array
 */
export const fetchOrderHistory = async () => {
    await delay()
    simulateError()

    const orders = getItem(STORAGE_KEYS.ORDERS, [])
    // Sort by createdAt descending (newest first)
    return orders.sort((a, b) => b.createdAt - a.createdAt)
}

/**
 * Fetch specific order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object|null>} Order or null
 */
export const fetchOrderById = async (orderId) => {
    await delay()
    simulateError()

    const orders = getItem(STORAGE_KEYS.ORDERS, [])
    const order = orders.find(o => o.orderId === orderId)
    return order || null
}

/**
 * Update order status (simulated)
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, newStatus) => {
    await delay()
    simulateError()

    const orders = getItem(STORAGE_KEYS.ORDERS, [])
    const orderIndex = orders.findIndex(o => o.orderId === orderId)

    if (orderIndex === -1) {
        throw new Error('Order not found')
    }

    orders[orderIndex].status = newStatus
    orders[orderIndex].updatedAt = Date.now()

    setItem(STORAGE_KEYS.ORDERS, orders)

    return orders[orderIndex]
}

/**
 * Cancel order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Cancelled order
 */
export const cancelOrder = async (orderId) => {
    return updateOrderStatus(orderId, 'cancelled')
}

export default {
    fetchMenu,
    fetchCategories,
    fetchItemDetails,
    searchMenuItems,
    submitOrder,
    fetchOrderHistory,
    fetchOrderById,
    updateOrderStatus,
    cancelOrder,
}
