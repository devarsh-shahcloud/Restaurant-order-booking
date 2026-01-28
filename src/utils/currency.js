/**
 * Currency formatting utility
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
    }).format(amount)
}

/**
 * Format price without currency symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted price
 */
export const formatPrice = (amount) => {
    return amount.toFixed(2)
}

/**
 * Calculate percentage
 * @param {number} amount - Base amount
 * @param {number} percentage - Percentage to calculate
 * @returns {number} Calculated amount
 */
export const calculatePercentage = (amount, percentage) => {
    return (amount * percentage) / 100
}

/**
 * Calculate tax (default 5%)
 * @param {number} subtotal - Subtotal amount
 * @param {number} rate - Tax rate (default 5)
 * @returns {number} Tax amount
 */
export const calculateTax = (subtotal, rate = 5) => {
    return calculatePercentage(subtotal, rate)
}

/**
 * Calculate delivery fee based on order total
 * @param {number} subtotal - Order subtotal
 * @param {number} freeDeliveryThreshold - Minimum for free delivery (default ₹500)
 * @param {number} deliveryFee - Standard delivery fee (default ₹50)
 * @returns {number} Delivery fee
 */
export const calculateDeliveryFee = (subtotal, freeDeliveryThreshold = 500, deliveryFee = 50) => {
    return subtotal >= freeDeliveryThreshold ? 0 : deliveryFee
}
