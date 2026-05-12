<template>
    <div class="flex flex-col w-full sm:w-4/5 lg:w-3/5 xl:w-1/2 gap-4 px-5 py-4 mt-4 mb-2
           bg-[#dde3ef] dark:bg-slate-600
           rounded-2xl shadow-md shadow-black/10 border border-indigo-100 dark:border-slate-500">
        <div class="flex items-center gap-4">
            <img :src="TrackerIconLight" alt="" class="block w-5 h-5 shrink-0 dark:hidden">
            <img :src="TrackerIconDark" alt="" class="hidden w-5 h-5 shrink-0 dark:block">
            <label for="description">{{ t('nav.track.label') }}</label>
        </div>
        <div>
            <textarea :placeholder="t('nav.track.placeholder')" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)" rows="4"
                class="w-full px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:placeholder-indigo-200 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div class="flex">
            <div class="flex items-center gap-4">
                <label for="time">Timer: </label>
                <time :datetime="isoTime" class="w-full px-6 py-3 text-center text-md font-bold text-[#1a1a6e] dark:text-orange-50
         bg-orange-50 dark:bg-slate-700 border-2 border-indigo-200 dark:border-slate-500 
         rounded-2xl tracking-widest block">
                    {{ formattedTime }}
                </time>
            </div>
        </div>
    </div>
</template>

<script setup>
import TrackerIconLight from '@/assets/SidebarIcons/light/tracker.svg'
import TrackerIconDark from '@/assets/SidebarIcons/dark/tracker.svg'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue';

const { t } = useI18n()
const formattedTime = ref("00:00");
</script>
