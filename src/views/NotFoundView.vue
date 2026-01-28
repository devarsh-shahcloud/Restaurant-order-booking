<template>
  <div class="not-found-view min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
    <div class="text-9xl mb-4">404</div>
    <h1 class="text-3xl font-display font-bold mb-4">Page Not Found</h1>
    <p class="text-gray-600 mb-8 max-w-md">
      Oops! The page you're looking for seems to have wandered off our menu.
      Let's get you back to some delicious food.
    </p>
    <div class="flex gap-4">
      <BaseButton @click="router.push('/')" variant="outline">
        Go Home
      </BaseButton>
      <BaseButton @click="router.push('/menu')" variant="primary">
        Browse Menu
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
</script>
