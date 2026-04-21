<template>
    <div class="flex items-center justify-between bg-slate-200 border border-slate-400 rounded-2xl px-6 py-5 w-1/2 gap-6 mb-3 mt-5">
        <div class="flex items-center gap-3">
            <img :src="iconPath" alt="icon" class="w-5 h-5 shrink-0" />
            <span class="text-sm font-semibold text-slate-700">{{ label }}</span>
        </div>
        <input type="text" :placeholder="placeholder" class="flex-1 bg-slate-100 border border-slate-400 rounded-xl px-4 py-2 text-sm text-slate-600 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300" />
    </div>
</template>

<script setup>
const props = defineProps({
    iconPath: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        required: true
    }
})
</script>