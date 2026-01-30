<template>
  <button :type="type" :class="buttonClasses" :disabled="disabled || loading" v-bind="$attrs">
    <div
      v-if="loading"
      class="inline-block animate-spin mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    ></div>
    <span v-if="icon && !loading" class="mr-2">{{ icon }}</span>
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const buttonClasses = computed(() => {
  const classes = [
    'btn',
    'inline-flex',
    'items-center',
    'justify-center',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ];

  if (props.variant === 'primary') {
    classes.push('btn-primary');
  } else if (props.variant === 'secondary') {
    classes.push('btn-secondary');
  } else if (props.variant === 'outline') {
    classes.push('btn-outline');
  } else if (props.variant === 'ghost') {
    classes.push('bg-transparent', 'text-gray-700', 'hover:bg-gray-100');
  } else if (props.variant === 'danger') {
    classes.push('bg-gray-700', 'text-white', 'hover:bg-gray-800', 'focus:ring-gray-500');
  }

  if (props.size === 'sm') {
    classes.push('px-3', 'py-1.5', 'text-sm');
  } else if (props.size === 'md') {
    classes.push('px-4', 'py-2', 'text-base');
  } else if (props.size === 'lg') {
    classes.push('px-6', 'py-3', 'text-lg');
  }

  if (props.fullWidth) {
    classes.push('w-full');
  }
  if (props.disabled || props.loading) {
    classes.push('opacity-50', 'cursor-not-allowed');
  }

  return classes.join(' ');
});
</script>
