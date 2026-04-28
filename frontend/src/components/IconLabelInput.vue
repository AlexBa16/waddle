<template>
  <div
    class="flex w-1/2 gap-6 px-6 py-5 mt-5 mb-3 bg-[#dde3ef] rounded-2xl shadow-md shadow-black/10"
    :class="bigField ? 'flex-col items-stretch' : 'flex-row items-center justify-between'"
  >
    <div class="flex items-center gap-3 shrink-0">
      <div class="w-5 h-5 flex items-center justify-center text-slate-700">
        <img :src="iconPath" alt="icon" class="w-full h-full object-contain" />
      </div>
      <span class="text-sm font-bold text-slate-800 tracking-wide">{{ label }}</span>
    </div>

    <input
      v-if="!bigField"
      type="text"
      :placeholder="placeholder"
      class="flex-1 px-4 py-2 text-sm rounded-xl bg-orange-50 border border-indigo-300 text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-400 transition-colors duration-150 font-medium"
    />

    <textarea
      v-else
      :placeholder="placeholder"
      rows="3"
      class="resize-none w-full px-4 py-2 text-sm rounded-xl bg-orange-50 border border-indigo-300 text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-400 transition-colors duration-150 font-medium"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  iconPath:    { type: String,  required: true },
  label:       { type: String,  required: true },
  placeholder: { type: String,  required: true },
  bigField:    { type: Boolean, default: false },
})
</script>
