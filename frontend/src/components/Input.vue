<template>
    <div class="flex flex-col gap-2 mt-3 mb-3">
        <label for="inp" class="text-left text-slate-700 pop-med">{{ label }}</label>
        <input :type="type" id="inp" class="bg-orange-50 h-12 p-3 border-indigo-300 border rounded-xl rounded-tl-none"/>
    </div>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: ''
    }
})
</script>