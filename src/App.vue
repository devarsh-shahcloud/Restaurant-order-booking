<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header Navigation -->
    <header class="bg-white shadow-md sticky top-0 z-40">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/menu" class="flex items-center space-x-2">
            <span class="text-2xl">🍽️</span>
            <span class="text-xl font-display font-bold text-primary-600">FoodieHub</span>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <router-link to="/menu" class="nav-link">Menu</router-link>
            <router-link to="/orders" class="nav-link">Orders</router-link>
          </nav>

          <!-- Cart Icon -->
          <router-link to="/cart" class="relative">
            <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <span class="text-2xl">🛒</span>
              <span v-if="cartStore.itemCount > 0"
                class="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartStore.itemCount }}
              </span>
            </button>
          </router-link>

          <!-- Mobile Menu Button -->
          <button @click="toggleMobileMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <span class="text-2xl">☰</span>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <Transition name="slide-down">
          <nav v-if="showMobileMenu" class="md:hidden py-4 border-t">
            <router-link @click="closeMobileMenu" to="/menu" class="block py-2 px-4 hover:bg-gray-100 rounded-lg">
              Menu
            </router-link>
            <router-link @click="closeMobileMenu" to="/orders" class="block py-2 px-4 hover:bg-gray-100 rounded-lg">
              Orders
            </router-link>
          </nav>
        </Transition>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-auto">
      <div class="container mx-auto px-4 py-8">
        <div class="mt-2 text-center text-gray-400 text-sm">
          <p>&copy; 2026 FoodieHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore.js'

const router = useRouter()
const cartStore = useCartStore()
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Close mobile menu on route change
router.afterEach(() => {
  closeMobileMenu()
})
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-primary-600 font-medium transition-colors;
}

.router-link-active.nav-link {
  @apply text-primary-600;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
