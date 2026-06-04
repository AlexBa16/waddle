<template>
    <div class="p-4 flex flex-col items-center w-full max-w-3xl mx-auto">

        <!-- Timeline Card -->
        <div class="w-full mb-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-black/5">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-semibold text-slate-700 dark:text-orange-50 tracking-wide">
                    {{ t('nav.reports.teamTimeline') }}
                </h3>

                <select
                    v-model="timeframe"
                    class="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-orange-50 px-3 py-1.5 rounded-lg border-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                    <option value="week">{{ t('nav.reports.thisWeek') }}</option>
                    <option value="month">{{ t('nav.reports.thisMonth') }}</option>
                    <option value="year">{{ t('nav.reports.thisYear') }}</option>
                </select>
            </div>

            <div v-if="timelineChartData.labels.length === 0" class="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                {{ t('nav.reports.noTimeEntries') }}
            </div>
            <div v-else class="w-full h-48">
                <Bar :data="timelineChartData" :options="timelineChartOptions" />
            </div>
        </div>

        <!-- Bottom: Member List + Pie Chart -->
        <div class="w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-black/5">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-orange-50 tracking-wide mb-6 w-full text-left">
                {{ t('nav.reports.distribution') }}
            </h3>

            <div v-if="totalProjectMs === 0" class="text-gray-500 dark:text-gray-400 text-sm py-12 text-center">
                {{ t('nav.reports.noTimeEntries') }}
            </div>

            <div v-else class="flex flex-col sm:flex-row gap-8 items-center sm:items-start w-full">

                <!-- Member List (left) -->
                <div class="flex-1 w-full space-y-3">
                    <div
                        v-for="(member, idx) in memberStats"
                        :key="member.userId"
                        class="flex items-center gap-3"
                    >
                        <span
                            class="inline-block w-3 h-3 rounded-full shrink-0"
                            :style="{ background: memberColors[idx % memberColors.length] }"
                        ></span>
                        <span class="text-sm text-slate-600 dark:text-slate-300 flex-1 truncate">
                            {{ member.username }}
                        </span>
                        <span class="text-sm font-semibold text-slate-700 dark:text-orange-50 tabular-nums">
                            {{ formatHours(member.ms) }}
                        </span>
                        <div class="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                class="h-full rounded-full transition-all duration-500"
                                :style="{
                                    width: totalProjectMs > 0 ? `${(member.ms / totalProjectMs) * 100}%` : '0%',
                                    background: memberColors[idx % memberColors.length]
                                }"
                            ></div>
                        </div>
                    </div>
                </div>

                <!-- Pie Chart (right) -->
                <div class="w-52 h-52 shrink-0 flex items-center justify-center">
                    <Pie :data="pieChartData" :options="pieChartOptions" />
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Pie, Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { useTimeEntryStore } from '@/stores/timeEntry'
import { useProjectStore } from '@/stores/project'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const timeEntryStore = useTimeEntryStore()
const projectStore = useProjectStore()

const timeframe = ref('week')

const memberColors = [
    '#7f84ff', '#ff7eb3', '#43d9a2', '#ffc764', '#60c3f7',
    '#b97fff', '#ff6b6b', '#4ecdc4', '#f7b731', '#a29bfe'
]

const currentProjectId = computed(() => {
    const idOrObj = projectStore.selectedId
    return idOrObj && typeof idOrObj === 'object' ? idOrObj.id : idOrObj
})

async function loadData(id) {
    if (!id || id === '[object Object]') return
    await timeEntryStore.fetchByProject(id)
}

watch(currentProjectId, loadData, { immediate: true })

// ── Helpers ───────────────────────────────────────────────────────────────────

function msFromEntry(entry) {
    const start = new Date(entry.startTime).getTime()
    const end = new Date(entry.endTime).getTime()
    return (!isNaN(start) && !isNaN(end)) ? end - start : 0
}

function formatHours(ms) {
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    return `${h}h ${m}m`
}

function msToDecimalHours(ms) {
    return parseFloat((ms / 3600000).toFixed(2))
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// ── Aggregations ──────────────────────────────────────────────────────────────

const totalProjectMs = computed(() =>
    timeEntryStore.entries.reduce((sum, e) => sum + msFromEntry(e), 0)
)

// Group entries by trackedBy.id → { userId, username, ms }
const memberStats = computed(() => {
    const map = {}
    for (const entry of timeEntryStore.entries) {
        const uid = entry.trackedBy?.id
        if (!uid) continue
        const ms = msFromEntry(entry)
        if (!map[uid]) {
            map[uid] = { userId: uid, username: entry.trackedBy.username, ms: 0 }
        }
        map[uid].ms += ms
    }
    return Object.values(map).sort((a, b) => b.ms - a.ms)
})

// ── Timeline ──────────────────────────────────────────────────────────────────

const timelineChartData = computed(() => {
    const entries = timeEntryStore.entries
    const baseDate = new Date()
    const currentYear = baseDate.getFullYear()
    const currentMonth = baseDate.getMonth()
    const weekdayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    const monthNamesDe = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

    const startOfWeek = new Date(baseDate)
    const currentDay = startOfWeek.getDay()
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    const datasets = memberStats.value.map((member, idx) => {
        // Match entries by trackedBy.id
        const memberEntries = entries.filter(e => e.trackedBy?.id === member.userId)
        const dailyMap = {}

        memberEntries.forEach(entry => {
            if (!entry.startTime) return
            const entryDate = new Date(entry.startTime)
            const ms = msFromEntry(entry)

            if (timeframe.value === 'week') {
                if (entryDate >= startOfWeek) {
                    const key = weekdayNames[entryDate.getDay()]
                    dailyMap[key] = (dailyMap[key] || 0) + ms
                }
            } else if (timeframe.value === 'month') {
                if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
                    const key = `KW ${getWeekNumber(entryDate)}`
                    dailyMap[key] = (dailyMap[key] || 0) + ms
                }
            } else if (timeframe.value === 'year') {
                if (entryDate.getFullYear() === currentYear) {
                    const key = monthNamesDe[entryDate.getMonth()]
                    dailyMap[key] = (dailyMap[key] || 0) + ms
                }
            }
        })

        return { map: dailyMap, member, color: memberColors[idx % memberColors.length] }
    })

    let labels = []
    if (timeframe.value === 'week') {
        labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    } else if (timeframe.value === 'year') {
        labels = monthNamesDe
    } else {
        const kwSet = new Set()
        datasets.forEach(ds => Object.keys(ds.map).forEach(k => kwSet.add(k)))
        labels = [...kwSet].sort((a, b) =>
            parseInt(a.replace('KW ', '')) - parseInt(b.replace('KW ', ''))
        )
    }

    if (labels.length === 0) return { labels: [], datasets: [] }

    return {
        labels,
        datasets: datasets.map(ds => ({
            label: ds.member.username,
            data: labels.map(l => msToDecimalHours(ds.map[l] || 0)),
            backgroundColor: ds.color,
            borderRadius: 4,
            borderSkipped: false,
        }))
    }
})

const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}h`
            }
        }
    },
    scales: {
        x: {
            stacked: true,
            grid: { display: false },
            ticks: { color: '#94a3b8' }
        },
        y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
                color: '#94a3b8',
                callback: (value) => `${value}h`
            }
        }
    }
}

// ── Pie Chart ─────────────────────────────────────────────────────────────────

const pieChartData = computed(() => ({
    labels: memberStats.value.map(m => m.username),
    datasets: [{
        data: memberStats.value.map(m => m.ms),
        backgroundColor: memberStats.value.map((_, i) => memberColors[i % memberColors.length]),
        borderColor: memberStats.value.map((_, i) => memberColors[i % memberColors.length]),
        borderWidth: 1,
    }]
}))

const pieChartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${ctx.label}: ${formatHours(ctx.raw)}`
            }
        }
    }
}
</script>
