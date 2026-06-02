<template>
  <button
    type="button"
    :class="[
      // Base styles (Layout & Typography)
      'inline-flex items-center justify-center font-bold text-white rounded-xl px-6 py-4 transition-all duration-200 select-none cursor-pointer',
      
      // Light Mode & Dark Mode State Logic
      isActive 
        ? 'bg-[#5b61ff] dark:bg-[#25239a]' // Saturated/Active State
        : 'bg-[#7f84ff] dark:bg-[#312e93]'  // Standard State (Matching your images)
    ]"
    @click="$emit('click')"
  >
    <slot>Me</slot>
  </button>
</template>

<script setup>
defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>
