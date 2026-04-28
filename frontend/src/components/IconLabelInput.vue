<template>
  <div
    class="flex w-1/2 gap-6 px-6 py-5 mt-5 mb-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-2xl"
    :class="bigField ? 'flex-col items-stretch' : 'flex-row items-center justify-between'"
  >
    <div class="flex items-center gap-3">
      <img :src="iconPath" alt="icon" class="w-5 h-5 shrink-0" />
      <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{ label }}</span>
    </div>

    <input
      v-if="!bigField"
      type="text"
      :placeholder="placeholder"
      class="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-[#7C86FF] transition-colors duration-150"
    />

    <textarea
      v-else
      :placeholder="placeholder"
      rows="3"
      class="resize-none px-4 py-2.5 text-sm font-medium rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-[#7C86FF] transition-colors duration-150 w-full"
    />
  </div>
</template>

<script setup>
const props = defineProps({
    iconPath: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String, required: true },
    bigField: { type: Boolean, default: false }
})
</script>
