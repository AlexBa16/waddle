<template>
    <div class="p-4 flex flex-col items-center w-full max-w-3xl mx-auto">
        
        <div class="w-full mb-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-black/5">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-semibold text-slate-700 dark:text-orange-50 tracking-wide">
                    {{ t('nav.reports.myTimeline') }}
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

        <div class="w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-black/5 flex flex-col items-center">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-orange-50 tracking-wide mb-6 align-self-start w-full text-left">
                {{ t('nav.reports.distribution') }}
            </h3>

            <div v-if="totalProjectMs === 0" class="text-gray-500 dark:text-gray-400 text-sm py-12 text-center">
                {{ t('nav.reports.noTimeEntries') }}
            </div>
            
            <div v-else class="flex flex-col items-center w-full">
                <div class="w-64 h-64 flex items-center justify-center">
                    <Pie :data="chartData" :options="chartOptions" />
                </div>
                
                <div class="mt-6 flex flex-col sm:flex-row sm:gap-6 text-sm text-slate-600 dark:text-slate-300 space-y-2 sm:space-y-0">
                    <div class="flex items-center justify-center">
                        <span class="inline-block w-3 h-3 rounded-full mr-2 shrink-0" style="background:#7f84ff"></span>
                        <span>{{ t('nav.reports.me') }}: <strong>{{ formatHours(myProjectMs) }}</strong></span>
                    </div>
                    <div class="flex items-center justify-center">
                        <span class="inline-block w-3 h-3 rounded-full mr-2 shrink-0" style="background:#e2e3ff"></span>
                        <span>{{ t('nav.reports.others') }}: <strong>{{ formatHours(totalProjectMs - myProjectMs) }}</strong></span>
                    </div>
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

const currentProjectId = computed(() => {
    const idOrObj = projectStore.selectedId
    return idOrObj && typeof idOrObj === 'object' ? idOrObj.id : idOrObj
})

function loadData(id) {
    if (id && id !== '[object Object]') {
        timeEntryStore.fetchByProject(id)
        timeEntryStore.fetchByUser()
    }
}

watch(currentProjectId, loadData, { immediate: true })

watch(() => projectStore.selectedId, (id) => {
    if (id && timeEntryStore.entries.length === 0) {
        loadData(typeof id === 'object' ? id.id : id)
    }
})

function msFromEntry(entry) {
    const start = new Date(entry.startTime).getTime()
    const end = new Date(entry.endTime).getTime()
    return (!isNaN(start) && !isNaN(end)) ? end - start : 0
}

const totalProjectMs = computed(() =>
    timeEntryStore.entries.reduce((sum, e) => sum + msFromEntry(e), 0)
)

const myProjectMs = computed(() => {
    const projectId = currentProjectId.value
    return timeEntryStore.myEntries
        .filter(e => e.project?.id === projectId)
        .reduce((sum, e) => sum + msFromEntry(e), 0)
})

const othersMs = computed(() => Math.max(0, totalProjectMs.value - myProjectMs.value))

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

// --- KORRIGIERT: Stabile Timeline-Berechnung ---
const timelineChartData = computed(() => {
    const projectId = currentProjectId.value
    const filteredMyEntries = timeEntryStore.myEntries.filter(e => e.project?.id === projectId)
    
    // KORREKTUR: Immer frische Instanzen erzeugen, um Nebeneffekte zu vermeiden!
    const baseDate = new Date()
    const currentYear = baseDate.getFullYear()
    const currentMonth = baseDate.getMonth()

    const dailyMap = {}
    
    // KORREKTUR: Wochenstart sauber und isoliert berechnen
    const startOfWeek = new Date(baseDate)
    const currentDay = startOfWeek.getDay() // 0 = So, 1 = Mo...
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    // Mapping-Array für Wochentage, um unabhängig von Browser-Locales ("Mo" vs "Mo.") zu bleiben
    const weekdayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

    filteredMyEntries.forEach(entry => {
        if (!entry.startTime) return
        const entryDate = new Date(entry.startTime)
        const ms = msFromEntry(entry)

        if (timeframe.value === 'week') {
            if (entryDate >= startOfWeek) {
                const weekday = weekdayNames[entryDate.getDay()]
                dailyMap[weekday] = (dailyMap[weekday] || 0) + ms
            }
        } 
        else if (timeframe.value === 'month') {
            if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
                const kw = `KW ${getWeekNumber(entryDate)}`
                dailyMap[kw] = (dailyMap[kw] || 0) + ms
            }
        } 
        else if (timeframe.value === 'year') {
            if (entryDate.getFullYear() === currentYear) {
                // KORREKTUR: Erzwinge deutsche Kurznamen unabhängig von Browsereinstellungen
                const monthNamesDe = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
                const monthName = monthNamesDe[entryDate.getMonth()]
                dailyMap[monthName] = (dailyMap[monthName] || 0) + ms
            }
        }
    })

    let labels = []
    if (timeframe.value === 'week') {
        labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    } else if (timeframe.value === 'year') {
        labels = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
    } else {
        labels = Object.keys(dailyMap).sort((a, b) => {
            return parseInt(a.replace('KW ', '')) - parseInt(b.replace('KW ', ''))
        })
    }

    const durationData = labels.map(label => msToDecimalHours(dailyMap[label] || 0))

    // Für Woche und Jahr behalten wir alle Tage/Monate (auch mit 0h), bei Monat filtern wir leere KWs raus
    const finalLabels = timeframe.value === 'month' ? labels.filter((_, idx) => durationData[idx] > 0) : labels
    const finalData = timeframe.value === 'month' ? durationData.filter(val => val > 0) : durationData

    return {
        labels: finalLabels,
        datasets: [{
            label: t('nav.reports.me'),
            data: finalData,
            backgroundColor: '#7f84ff',
            borderRadius: 6,
            borderSkipped: false,
        }]
    }
})

const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${ctx.raw}h`
            }
        }
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
        },
        y: {
            beginAtZero: true,
            ticks: {
                color: '#94a3b8',
                callback: (value) => `${value}h`
            }
        }
    }
}

const chartData = computed(() => ({
    labels: [t('nav.reports.me'), t('nav.reports.others')],
    datasets: [{
        data: [myProjectMs.value, othersMs.value],
        backgroundColor: ['#7f84ff', '#e2e3ff'],
        borderColor: ['#5a5fff', '#c0c2ff'],
        borderWidth: 1,
    }]
}))

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => ` ${formatHours(ctx.raw)}`
            }
        }
    }
}
</script>
