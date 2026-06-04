<template>
    <div class="p-4 flex flex-col items-center">
        <div v-if="totalProjectMs === 0" class="text-gray-500 dark:text-gray-400 text-sm mt-8">
            Keine Zeiteinträge für dieses Projekt vorhanden.
        </div>
        <div v-else class="w-72 h-72">
            <Pie :data="chartData" :options="chartOptions" />
            <div class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>
                    <span class="inline-block w-3 h-3 rounded-full mr-2" style="background:#7f84ff"></span>
                    Ich: {{ formatHours(myProjectMs) }}
                </div>
                <div>
                    <span class="inline-block w-3 h-3 rounded-full mr-2" style="background:#e2e3ff"></span>
                    Andere: {{ formatHours(totalProjectMs - myProjectMs) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useTimeEntryStore } from '@/stores/timeEntry'
import { useProjectStore } from '@/stores/project'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const timeEntryStore = useTimeEntryStore()
const projectStore = useProjectStore()

const currentProjectId = computed(() => {
    const idOrObj = projectStore.selectedId
    return idOrObj && typeof idOrObj === 'object' ? idOrObj.id : idOrObj
})

watch(currentProjectId, (id) => {
    if (id && id !== '[object Object]') {
        timeEntryStore.fetchByProject(id)
        timeEntryStore.fetchByUser()
    }
}, { immediate: true })

function msFromEntry(entry) {
    const start = new Date(entry.startTime).getTime()
    const end = new Date(entry.endTime).getTime()
    return (!isNaN(start) && !isNaN(end)) ? end - start : 0
}

// Total time for the whole project (all entries)
const totalProjectMs = computed(() =>
    timeEntryStore.entries.reduce((sum, e) => sum + msFromEntry(e), 0)
)

// My time: sum of myEntries that belong to this project
// fetchByUser returns all my entries across all projects, so filter by current project
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

const chartData = computed(() => ({
    labels: ['Ich', 'Andere'],
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
