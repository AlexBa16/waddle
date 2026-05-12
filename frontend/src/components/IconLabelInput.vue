<template>
    <div class="w-full sm:w-4/5 lg:w-3/5 xl:w-1/2 gap-4 px-5 py-4 mt-4 mb-2
           bg-[#dde3ef] dark:bg-slate-600
           rounded-2xl shadow-md shadow-black/10 border border-indigo-100 dark:border-slate-500"
        :class="bigField ? 'flex flex-col items-stretch' : 'flex flex-row items-center justify-between'">
        <!-- Icon + Label -->
        <div class="flex items-center gap-3 shrink-0">
            <div
                class="w-5 h-5 flex items-center justify-center text-slate-700 dark:invert"
            >
                <img
                    :src="iconPath"
                    alt="icon"
                    class="w-full h-full object-contain"
                />
            </div>
            <span class="text-sm font-bold text-slate-800 dark:text-orange-50 tracking-wide whitespace-nowrap">
                {{ label }}
            </span>
        </div>

        <!-- View mode select -->
        <select v-if="selectViewMode" :value="modelValue" @change="emit('update:modelValue', $event.target.value)"
            class="flex-1 min-w-0 max-w-xs px-4 py-2.5 text-sm font-medium
             rounded-xl bg-orange-50 border border-indigo-200
             text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400
             outline-none focus:ring-2 focus:ring-indigo-400
             appearance-none bg-no-repeat transition-colors duration-150
             cursor-pointer">
            <option value="light">{{ t('nav.settings.light') }}</option>
            <option value="dark">{{ t('nav.settings.dark') }}</option>
            <option value="system">{{ t('nav.settings.systemMode') }}</option>
        </select>

        <!-- Language select -->
        <select v-else-if="select" :value="modelValue" @change="emit('update:modelValue', $event.target.value)" class="flex-1 min-w-0 max-w-xs px-4 py-2.5 text-sm font-medium
             rounded-xl bg-orange-50 border border-indigo-200
             text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400
             outline-none focus:ring-2 focus:ring-indigo-400
             appearance-none bg-no-repeat transition-colors duration-150
             cursor-pointer">
            <option value="de">{{ t('nav.settings.german') }}</option>
            <option value="en">{{ t('nav.settings.english') }}</option>
        </select>

        <!-- Single-line input -->
        <input v-else-if="!bigField" :type="type" :placeholder="placeholder" :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)" class="flex-1 min-w-0 px-4 py-2.5 text-sm font-medium
             rounded-xl bg-orange-50 border border-indigo-200
             text-slate-700 placeholder-slate-400
             dark:bg-slate-500 dark:text-orange-50 dark:placeholder-indigo-200 dark:border-slate-400
             outline-none focus:ring-2 focus:ring-indigo-400
             transition-colors duration-150" />

        <!-- Textarea -->
        <textarea v-else :placeholder="placeholder" :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)" rows="4" class="w-full resize-none px-4 py-3 text-sm font-medium
             rounded-xl bg-orange-50 border border-indigo-200
             text-slate-700 placeholder-slate-400
             dark:bg-slate-500 dark:text-orange-50 dark:placeholder-indigo-200 dark:border-slate-400
             outline-none focus:ring-2 focus:ring-indigo-400
             transition-colors duration-150" />
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
    iconPath: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String, default: "" },
    bigField: { type: Boolean, default: false },
    select: { type: Boolean, default: false },
    selectViewMode: { type: Boolean, default: false },
    modelValue: { type: String, default: "" },
    type: { type: String, default: 'text' },
});

const emit = defineEmits(["update:modelValue"]);
</script>
