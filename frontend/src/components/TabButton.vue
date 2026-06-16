<template>
    <button
        type="button"
        :class="[
            'inline-flex items-center justify-center font-bold text-white rounded-xl px-6 py-4 transition-all duration-200 select-none cursor-pointer',

            isActive
                ? 'bg-indigo-600 dark:bg-indigo-800'
                : 'bg-indigo-400 dark:bg-indigo-700',
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
        default: false,
    },
});

defineEmits(["click"]);
</script>
