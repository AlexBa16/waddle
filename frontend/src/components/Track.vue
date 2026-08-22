import TrackerIconLight from '@/assets/SidebarIcons/light/tracker.svg'
import TrackerIconDark from '@/assets/SidebarIcons/dark/tracker.svg'
import Button from '@/components/Button.vue'
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRunningTimerStore } from '@/stores/runningTimer'
import { useProjectStore } from '@/stores/project'
import Toast from '@/components/Toast.vue'

const { t } = useI18n()
const runningTimerStore = useRunningTimerStore()
const projectStore = useProjectStore()
const toast = ref(null)

function computeElapsed() {
    if (!runningTimerStore.startTime) return 0
    return Math.floor((Date.now() - new Date(runningTimerStore.startTime).getTime()) / 1000)
}

const displaySeconds = ref(computeElapsed())

let interval = null

function startTicking() {
    if (interval) return
    interval = setInterval(() => {
        displaySeconds.value = computeElapsed()
    }, 1000)
}

function stopTicking() {
    if (interval) {
        clearInterval(interval)
        interval = null
    }
}

function handleVisibilityChange() {
    if (document.visibilityState === 'visible' && runningTimerStore.isRunning) {
        // sofort korrigieren, falls der Interval während der Drosselung ausgesetzt hat
        displaySeconds.value = computeElapsed()
    }
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
        stopTicking()
        await runningTimerStore.stop()
        displaySeconds.value = 0
        runningTimerStore.description = ''
        toast.value.success(t('nav.track.timerStopped'))
    } else {
        runningTimerStore.start(runningTimerStore.description, projectStore.selectedId)
        displaySeconds.value = computeElapsed()
        startTicking()
    }
}

onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
    stopTicking()
    document.removeEventListener('visibilitychange', handleVisibilityChange)
})