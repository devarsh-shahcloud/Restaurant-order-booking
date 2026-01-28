/**
 * LocalStorage utility functions with error handling
 */

const STORAGE_KEYS = {
    CART: 'restaurant_cart',
    ORDERS: 'restaurant_orders',
    USER_PREFS: 'restaurant_user_prefs',
}

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Parsed value or default
 */
export const getItem = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch (error) {
        console.error(`Error getting item from localStorage: ${key}`, error)
        return defaultValue
    }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded')
            // Clear old data if quota exceeded
            clearOldOrders()
        } else {
            console.error(`Error setting item in localStorage: ${key}`, error)
        }
        return false
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
    try {
        localStorage.removeItem(key)
        return true
    } catch (error) {
        console.error(`Error removing item from localStorage: ${key}`, error)
        return false
    }
}

/**
 * Clear all localStorage
 * @returns {boolean} Success status
 */
export const clear = () => {
    try {
        localStorage.clear()
        return true
    } catch (error) {
        console.error('Error clearing localStorage', error)
        return false
    }
}

/**
 * Clear orders older than 30 days
 */
export const clearOldOrders = () => {
    try {
        const orders = getItem(STORAGE_KEYS.ORDERS, [])
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        const recentOrders = orders.filter(order => order.createdAt > thirtyDaysAgo)
        setItem(STORAGE_KEYS.ORDERS, recentOrders)
    } catch (error) {
        console.error('Error clearing old orders', error)
    }
}

export { STORAGE_KEYS }
