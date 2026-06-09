<template>
    <div class="mt-5 w-full md:w-8/12 lg:w-6/12 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl overflow-hidden shadow-md shadow-black/10">

        <!-- Header -->
        <div class="flex items-center gap-3 px-6 py-4">
            <img :src="TrackerIconLight" alt="" class="block w-5 h-5 shrink-0 dark:hidden">
            <img :src="TrackerIconDark" alt="" class="hidden w-5 h-5 shrink-0 dark:block">
            <label for="description" class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50">
                {{ t('nav.track.label') }}
            </label>
        </div>

        <!-- Body -->
        <div class="bg-[#d4dae8] dark:bg-slate-500/40 px-6 py-4 space-y-5">
            <textarea :placeholder="t('nav.track.placeholder')" v-model="runningTimerStore.description" rows="4"
                class="w-full px-4 py-3 text-sm font-medium transition-colors duration-150 border border-indigo-200 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:placeholder-orange-50 dark:border-slate-400 focus:ring-1 focus:ring-indigo-400" />

            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-center gap-4">
                    <label class="text-sm text-slate-700 dark:text-orange-50 shrink-0">Timer:</label>
                    <time class="px-6 py-2 text-sm font-medium text-center tracking-widest text-indigo-700 dark:text-orange-50 bg-orange-50 dark:bg-slate-500 border border-indigo-200 dark:border-slate-400 rounded-xl block">
                        {{ formattedTime }}
                    </time>
                </div>
                <Button class="w-full sm:w-auto sm:shrink-0" @click="toggleTimer">
                    <span class="dark:text-orange-50">{{ runningTimerStore.isRunning ? t('nav.track.stop-timer') : t('nav.track.start-timer') }}</span>
                </Button>
            </div>
        </div>
    </div>
    <Toast ref="toast" />
</template>

<script setup>
import TrackerIconLight from '@/assets/SidebarIcons/light/tracker.svg'
import TrackerIconDark from '@/assets/SidebarIcons/dark/tracker.svg'
import Button from '@/components/Button.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed, onUnmounted } from 'vue'
import { useRunningTimerStore } from '@/stores/runningTimer'
import { useProjectStore } from '@/stores/project'
import Toast from '@/components/Toast.vue'

const { t } = useI18n()
const runningTimerStore = useRunningTimerStore()
const projectStore = useProjectStore()
const toast = ref(null)
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

if (runningTimerStore.isRunning) {
    startTicking()
}

const formattedTime = computed(() => {
    const h = Math.floor(displaySeconds.value / 3600)
    const m = Math.floor(displaySeconds.value / 60) % 60
    const s = displaySeconds.value % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

async function toggleTimer() {
    if (runningTimerStore.isRunning) {
        clearInterval(interval)
        interval = null
        await runningTimerStore.stop()
        displaySeconds.value = 0
        runningTimerStore.description = ''
        toast.value.success(t('nav.track.timerStopped'))
    } else {
        runningTimerStore.start(runningTimerStore.description, projectStore.selectedId)
        startTicking()
    }
}

onUnmounted(() => {
    if (interval) clearInterval(interval)
})
</script>
