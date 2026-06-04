<template>
    <div class="mt-5 w-full md:w-8/12 lg:w-6/12 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl overflow-hidden shadow-md shadow-black/10"
        :class="bigField ? 'flex flex-col' : 'flex flex-row items-center justify-between gap-5 px-6 py-4'">

        <!-- Row layout (single-line input / select) -->
        <template v-if="!bigField">
            <!-- Icon + Label -->
            <div class="flex items-center gap-3 shrink-0">
                <div class="w-5 h-5 flex items-center justify-center text-slate-700 dark:invert">
                    <img :src="iconPath" alt="icon" class="w-full h-full object-contain" />
                </div>
                <span class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50 whitespace-nowrap">
                    {{ label }}
                </span>
            </div>

            <!-- View mode select -->
            <select v-if="selectViewMode" :value="modelValue"
                @change="emit('update:modelValue', $event.target.value)"
                class="flex-1 min-w-0 max-w-xs px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:border-slate-400 dark:text-orange-50 appearance-none cursor-pointer">
                <option value="light">{{ t('nav.settings.light') }}</option>
                <option value="dark">{{ t('nav.settings.dark') }}</option>
                <option value="system">{{ t('nav.settings.systemMode') }}</option>
            </select>

            <!-- Language select -->
            <select v-else-if="select" :value="modelValue"
                @change="emit('update:modelValue', $event.target.value)"
                class="flex-1 min-w-0 max-w-xs px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:border-slate-400 dark:text-orange-50 appearance-none cursor-pointer">
                <option value="de">{{ t('nav.settings.german') }}</option>
                <option value="en">{{ t('nav.settings.english') }}</option>
            </select>

            <!-- Single-line input -->
            <input v-else :type="type" :placeholder="placeholder" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)"
                class="flex-1 min-w-0 max-w-xs px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:border-slate-400 dark:text-orange-50 dark:placeholder-indigo-50" />
        </template>

        <!-- Column layout (textarea) -->
        <template v-else>
            <!-- Header row -->
            <div class="flex items-center gap-3 px-6 py-4">
                <div class="w-5 h-5 flex items-center justify-center text-slate-700 dark:invert">
                    <img :src="iconPath" alt="icon" class="w-full h-full object-contain" />
                </div>
                <span class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50 whitespace-nowrap">
                    {{ label }}
                </span>
            </div>

            <!-- Textarea in body-style section -->
            <div class="bg-[#d4dae8] dark:bg-slate-500/40 px-6 py-4">
                <textarea :placeholder="placeholder" :value="modelValue"
                    @input="emit('update:modelValue', $event.target.value)" rows="4"
                    class="w-full resize-none px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:border-slate-400 dark:text-orange-50 dark:placeholder-indigo-200" />
            </div>
        </template>
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
