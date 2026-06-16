<template>
    <div class="flex flex-col gap-2 mt-3 mb-3">
        <label
            for="inp"
            class="text-left text-slate-700 pop-med dark:text-orange-50"
            >{{ label }}</label
        >
        <input
            :type="type"
            id="inp"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="h-12 p-3 border border-indigo-300 rounded-tl-none bg-orange-50 rounded-xl dark:bg-slate-800 dark:border-slate-600 dark:text-orange-50"
        />
    </div>
</template>

<script setup>
defineProps({
    type: {
        type: String,
        default: "text",
    },
    label: {
        type: String,
        default: "",
    },
    modelValue: {
        type: String,
        default: "",
    },
});

defineEmits(["update:modelValue"]);
</script>
