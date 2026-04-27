<template>
    <div class="flex items-center justify-between w-1/2 gap-6 px-6 py-5 mt-5 mb-3 border bg-slate-200 border-slate-400 rounded-2xl"
        :class="bigField ? 'flex-col items-stretch' : 'flex-row items-center'">
        <div class="flex items-center gap-3">
            <img :src="iconPath" alt="icon" class="w-5 h-5 shrink-0" />
            <span class="text-sm font-semibold text-slate-700">{{ label }}</span>
        </div>
        <input v-if="!bigField" type="text" :placeholder="placeholder"
            class="flex-1 px-4 py-2 text-sm border outline-none bg-slate-100 border-slate-400 rounded-xl text-slate-600 placeholder-slate-400 focus:ring-2 focus:ring-indigo-300" />
        <textarea v-else :placeholder="placeholder"
            class="resize-none h-25 px-4 py-2 text-sm border outline-none w-full bg-slate-100 border-slate-400 rounded-xl text-slate-600 placeholder-slate-400 focus:ring-2 focus:ring-indigo-300" />
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
