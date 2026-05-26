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
            <textarea :placeholder="t('nav.track.placeholder')" v-model="runningTimerStore.description" rows="4"
                class="w-full px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:placeholder-orange-50 dark:border-slate-400 focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div class="flex flex-col items-stretch justify-between gap-4 mt-5 sm:flex-row sm:items-center">
            <div class="flex items-center gap-4">
                <label for="time" class="dark:text-orange-50 shrink-0">Timer: </label>
                <time class="flex-1 px-6 py-3 text-center font-medium text-[#1a1a6e] dark:text-orange-50
                     bg-orange-50 dark:bg-slate-700 border-2 border-indigo-200 dark:border-slate-500 
                     rounded-2xl tracking-widest block">
                    {{ formattedTime }}
                </time>
            </div>
            <div class="flex items-center gap-3 sm:shrink-0">
                <Button class="flex-1 sm:flex-none" @click="toggleTimer">
                    <span class="dark:text-orange-50">{{ runningTimerStore.isRunning ? t('nav.track.stop-timer') :
                        t('nav.track.start-timer') }}</span>
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
import { ref, computed, onUnmounted } from 'vue'
import { useRunningTimerStore } from '@/stores/runningTimer'
import { useProjectStore } from '@/stores/project'

const { t } = useI18n()
const runningTimerStore = useRunningTimerStore()
const projectStore = useProjectStore()

// Sekunden direkt hochzählen statt computed aus Store
const displaySeconds = ref(
    runningTimerStore.startTime
        ? Math.floor((Date.now() - new Date(runningTimerStore.startTime).getTime()) / 1000)
        : 0
)

let interval = null

function startTicking() {
    interval = setInterval(() => {
        displaySeconds.value++
    }, 1000)
}

// Falls Timer beim Mount schon läuft
if (runningTimerStore.isRunning) {
    startTicking()
}

const formattedTime = computed(() => {
    const m = Math.floor(displaySeconds.value / 60)
    const s = displaySeconds.value % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

async function toggleTimer() {
    if (runningTimerStore.isRunning) {
        clearInterval(interval)
        interval = null
        await runningTimerStore.stop()
        displaySeconds.value = 0
        runningTimerStore.description = ''
    } else {
        runningTimerStore.start(runningTimerStore.description, projectStore.selectedId)
        startTicking()
    }
}

onUnmounted(() => {
    if (interval) clearInterval(interval)
})
</script>
