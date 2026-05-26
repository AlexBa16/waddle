<template>
    <div class="flex flex-col w-10/12 sm:w-4/5 lg:w-3/5 xl:w-1/2 gap-4 px-6 sm:px-10 py-7 mt-4 mb-2
           bg-[#dde3ef] dark:bg-slate-600
           rounded-2xl shadow-md shadow-black/10 border border-indigo-100 dark:border-slate-500">
        <div class="flex items-center gap-4">
            <img :src="TrackerIconLight" alt="" class="block w-5 h-5 shrink-0 dark:hidden">
            <img :src="TrackerIconDark" alt="" class="hidden w-5 h-5 shrink-0 dark:block">
            <label for="description" class="font-bold dark:text-orange-50">{{ t('nav.track.label') }}</label>
        </div>
        <div>
            <textarea :placeholder="t('nav.track.placeholder')" :value="modelValue"
                @input="emit('update:modelValue', $event.target.value)" rows="4"
                class="w-full px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:placeholder-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div class="flex flex-col items-stretch justify-between gap-4 mt-5 sm:flex-row sm:items-center">
            <div class="flex items-center gap-4">
                <label for="time" class="dark:text-orange-50 shrink-0">Timer: </label>
                <time :datetime="isoTime" class="flex-1 px-6 py-3 text-center font-medium text-[#1a1a6e] dark:text-orange-50
                     bg-orange-50 dark:bg-slate-700 border-2 border-indigo-200 dark:border-slate-500 
                     rounded-2xl tracking-widest block">
                    {{ formattedTime }}
                </time>
            </div>
            <div class="flex items-center gap-3 sm:shrink-0">
                <Button class="flex-1 sm:flex-none" @click="toggleTimer">
                    <span class="dark:text-orange-50">{{ isRunning ? t('nav.track.stop-timer') :
                        t('nav.track.start-timer') }}</span>
                </Button>
                <Button class="flex-1 sm:flex-none" @click="saveTime">
                    <span class="dark:text-orange-50">Save Time</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import TrackerIconLight from '@/assets/SidebarIcons/light/tracker.svg'
import TrackerIconDark from '@/assets/SidebarIcons/dark/tracker.svg'
import Button from '@/components/Button.vue'
import { useI18n } from 'vue-i18n'
import { ref, onUnmounted } from 'vue';

const { t } = useI18n()

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const formattedTime = ref("00:00");
const isoTime = ref(new Date().toISOString());
const isRunning = ref(false);

let seconds = 0;
let interval = null;

function toggleTimer() {
    if (isRunning.value) {
        clearInterval(interval);
        interval = null;
        isRunning.value = false;
    } else {
        isRunning.value = true;
        interval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            formattedTime.value = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
            isoTime.value = new Date().toISOString();
        }, 1000);
    }
}

// TODO: Implement actual save functionality
function saveTime() {
    console.log(`Saved time: ${formattedTime.value} (ISO: ${isoTime.value})`);
    formattedTime.value = "00:00";
    seconds = 0;
}

onUnmounted(() => {
    if (interval) clearInterval(interval);
});
</script>
