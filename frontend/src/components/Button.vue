<script setup>
</script>

<template>
  <button class="h-12 px-4 py-2 font-bold text-white bg-indigo-400 cursor-pointer rounded-xl hover:bg-indigo-600 pop-reg dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:hover:bg-indigo-300/80" :disabled="$attrs.disabled">
    <slot />
  </button>
</template>

<style scoped>
</style>
