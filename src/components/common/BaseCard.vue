<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
      <slot name="header"></slot>
    </div>
    <div :class="contentClasses">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'sm', 'normal', 'lg'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  const classes = ['card', 'overflow-hidden']

  if (props.hover) {
    classes.push('cursor-pointer')
  }

  return classes.join(' ')
})

const contentClasses = computed(() => {
  const classes = []

  if (props.padding === 'none') {
    // No padding
  } else if (props.padding === 'sm') {
    classes.push('p-4')
  } else if (props.padding === 'normal') {
    classes.push('p-6')
  } else if (props.padding === 'lg') {
    classes.push('p-8')
  }

  return classes.join(' ')
})
</script>
