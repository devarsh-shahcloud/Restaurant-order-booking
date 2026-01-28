import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getItem, setItem, STORAGE_KEYS } from '@/utils/storage.js'
import { calculateTax, calculateDeliveryFee } from '@/utils/currency.js'

export const useCartStore = defineStore('cart', () => {
    // State
    const items = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Initialize cart from localStorage
    const initCart = () => {
        const savedCart = getItem(STORAGE_KEYS.CART, [])
        items.value = savedCart
    }

    // Watch for changes and persist to localStorage
    watch(items, (newItems) => {
        setItem(STORAGE_KEYS.CART, newItems)
    }, { deep: true })

    // Getters
    const cartItems = computed(() => items.value)

    const itemCount = computed(() => {
        return items.value.reduce((total, item) => total + item.quantity, 0)
    })

    const subtotal = computed(() => {
        return items.value.reduce((total, item) => {
            let itemPrice = item.basePrice

            // Add customization prices
            if (item.customizations) {
                Object.values(item.customizations).forEach(customization => {
                    if (customization.price) {
                        itemPrice += customization.price
                    }
                })
            }

            return total + (itemPrice * item.quantity)
        }, 0)
    })

    const tax = computed(() => {
        return calculateTax(subtotal.value)
    })

    const deliveryFee = computed(() => {
        return calculateDeliveryFee(subtotal.value)
    })

    const total = computed(() => {
        return subtotal.value + tax.value + deliveryFee.value
    })

    const isEmpty = computed(() => items.value.length === 0)

    const hasItem = computed(() => {
        return (itemId) => items.value.some(item => item.menuItemId === itemId)
    })

    // Actions
    function addItem(menuItem, quantity = 1, customizations = {}) {
        try {
            // Generate unique cart item ID based on item and customizations
            const customizationString = JSON.stringify(customizations)
            const cartItemId = `${menuItem.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

            // Check if exact same item with same customizations exists
            const existingItemIndex = items.value.findIndex(item =>
                item.menuItemId === menuItem.id &&
                JSON.stringify(item.customizations) === customizationString
            )

            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                items.value[existingItemIndex].quantity += quantity
            } else {
                // Add new item
                const cartItem = {
                    cartItemId,
                    menuItemId: menuItem.id,
                    name: menuItem.name,
                    image: menuItem.image,
                    basePrice: menuItem.price,
                    quantity,
                    customizations,
                    category: menuItem.category,
                    addedAt: Date.now(),
                }

                items.value.push(cartItem)
            }

            return true
        } catch (e) {
            error.value = e.message
            return false
        }
    }

    function removeItem(cartItemId) {
        try {
            const index = items.value.findIndex(item => item.cartItemId === cartItemId)
            if (index !== -1) {
                items.value.splice(index, 1)
                return true
            }
            return false
        } catch (e) {
            error.value = e.message
            return false
        }
    }

    function updateQuantity(cartItemId, newQuantity) {
        try {
            if (newQuantity < 1 || newQuantity > 99) {
                throw new Error('Quantity must be between 1 and 99')
            }

            const item = items.value.find(item => item.cartItemId === cartItemId)
            if (item) {
                item.quantity = newQuantity
                return true
            }
            return false
        } catch (e) {
            error.value = e.message
            return false
        }
    }

    function clearCart() {
        items.value = []
        error.value = null
    }

    function validateCartItems() {
        // In a real app, this would check against current menu availability
        // For now, we'll just return true
        return true
    }

    function getCartItem(cartItemId) {
        return items.value.find(item => item.cartItemId === cartItemId)
    }

    // Initialize cart on store creation
    initCart()

    return {
        // State
        items,
        loading,
        error,

        // Getters
        cartItems,
        itemCount,
        subtotal,
        tax,
        deliveryFee,
        total,
        isEmpty,
        hasItem,

        // Actions
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        validateCartItems,
        getCartItem,
    }
})
