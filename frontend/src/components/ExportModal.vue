<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="fixed inset-0 z-100 flex items-center justify-center"
                @mousedown.self="$emit('update:modelValue', false)">
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

                <div
                    class="relative w-full max-w-md mx-4 overflow-y-auto max-h-[90vh] bg-white shadow-2xl dark:bg-slate-800 rounded-3xl">

                    <!-- Header -->
                    <div class="bg-[#7C86FF] px-8 py-6 flex items-center justify-between">
                        <h2 class="text-xl font-semibold tracking-tight text-white">{{
                            t('nav.reports.exportModal.title') }}</h2>
                        <button class="transition-colors duration-150 cursor-pointer text-white/70 hover:text-white"
                            @click="$emit('update:modelValue', false)">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" />
                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex flex-col gap-6 px-8 py-7 transition-all duration-200"
                        :class="{ 'pb-48': scope === 'member' }">

                        <!-- Timeframe -->
                        <div class="flex flex-col gap-3">
                            <label
                                class="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                                {{ t('nav.reports.exportModal.timeframe') }}
                            </label>

                            <div class="grid grid-cols-4 gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                                <button v-for="opt in timeframeOptions" :key="opt.value"
                                    class="py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer"
                                    :class="timeframe === opt.value
                                        ? 'bg-white dark:bg-slate-600 text-[#7C86FF] shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                                    @click="timeframe = opt.value">
                                    {{ opt.label }}
                                </button>
                            </div>

                            <Transition name="slide-down">
                                <div v-if="timeframe === 'custom'" class="grid grid-cols-2 gap-3">
                                    <div class="flex flex-col gap-1.5">
                                        <label
                                            class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            {{ t('nav.reports.exportModal.from') }}
                                        </label>
                                        <input type="date" v-model="customFrom"
                                            class="w-full px-3 py-2 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-[#7C86FF] transition-colors duration-150" />
                                    </div>
                                    <div class="flex flex-col gap-1.5">
                                        <label
                                            class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            {{ t('nav.reports.exportModal.to') }}
                                        </label>
                                        <input type="date" v-model="customTo" :min="customFrom"
                                            class="w-full px-3 py-2 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-[#7C86FF] transition-colors duration-150" />
                                    </div>
                                </div>
                            </Transition>

                            <p v-if="timeframe !== 'custom'" class="text-xs text-slate-400 dark:text-slate-500">
                                {{ timeframeSummary }}
                            </p>
                        </div>

                        <!-- Divider -->
                        <div class="border-t border-slate-200 dark:border-slate-700 -mx-8" />

                        <!-- Scope -->
                        <div class="flex flex-col gap-2">
                            <label
                                class="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                                {{ t('nav.reports.exportModal.scope') }}
                            </label>
                            <div class="flex flex-col gap-2 mt-1">
                                <label class="flex items-center gap-3 cursor-pointer group">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150 shrink-0"
                                        :class="scope === 'me' ? 'border-[#7C86FF] bg-[#7C86FF]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#7C86FF]'"
                                        @click="scope = 'me'">
                                        <div v-if="scope === 'me'" class="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200"
                                        @click="scope = 'me'">
                                        {{ t('nav.reports.exportModal.scopeMe') }}
                                    </span>
                                </label>

                                <label v-if="isAdmin" class="flex items-center gap-3 cursor-pointer group">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150 shrink-0"
                                        :class="scope === 'team' ? 'border-[#7C86FF] bg-[#7C86FF]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#7C86FF]'"
                                        @click="scope = 'team'">
                                        <div v-if="scope === 'team'" class="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200"
                                        @click="scope = 'team'">
                                        {{ t('nav.reports.exportModal.scopeTeam') }}
                                    </span>
                                </label>

                                <label v-if="isAdmin" class="flex items-center gap-3 cursor-pointer group">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-150 shrink-0"
                                        :class="scope === 'member' ? 'border-[#7C86FF] bg-[#7C86FF]' : 'border-slate-300 dark:border-slate-600 group-hover:border-[#7C86FF]'"
                                        @click="scope = 'member'">
                                        <div v-if="scope === 'member'" class="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                    <span class="text-sm font-medium text-slate-700 dark:text-slate-200"
                                        @click="scope = 'member'">
                                        {{ t('nav.reports.exportModal.scopeMember') }}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Member dropdown -->
                        <Transition name="slide-down">
                            <div v-if="scope === 'member'" class="-mt-2">
                                <Dropdown v-model="selectedMemberId" :options="members" label-key="name" value-key="id"
                                    searchable
                                    :search-placeholder="t('nav.reports.exportModal.memberSearchPlaceholder')"
                                    :placeholder="t('nav.reports.exportModal.memberPlaceholder')" />
                            </div>
                        </Transition>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-3 px-8 pb-7">
                        <button
                            class="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors duration-150"
                            @click="$emit('update:modelValue', false)">
                            {{ t('nav.reports.exportModal.cancel') }}
                        </button>
                        <button
                            class="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 shadow-md"
                            :class="canExport ? 'bg-[#7C86FF] hover:bg-[#6c75e8] shadow-[#7C86FF]/30' : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'"
                            :disabled="!canExport" @click="doExport">
                            {{ t('nav.reports.exportModal.export') }}
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTimeEntryStore } from '@/stores/timeEntry'
import { useInvitationStore } from '@/stores/invitation'
import { useProjectStore } from '@/stores/project'
import { useAuthStore } from '@/stores/auth'
import Dropdown from '@/components/Dropdown.vue'

const { t } = useI18n()

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const timeEntryStore = useTimeEntryStore()
const invitationStore = useInvitationStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const scope = ref('me')
const selectedMemberId = ref(null)
const members = ref([])

const timeframe = ref('week')
const customFrom = ref('')
const customTo = ref('')

const timeframeOptions = computed(() => [
    { label: t('nav.reports.exportModal.week'), value: 'week' },
    { label: t('nav.reports.exportModal.month'), value: 'month' },
    { label: t('nav.reports.exportModal.year'), value: 'year' },
    { label: t('nav.reports.exportModal.custom'), value: 'custom' },
])

const timeframeSummary = computed(() => {
    const now = new Date()
    if (timeframe.value === 'week') {
        const start = new Date(now)
        const diff = now.getDay() === 0 ? -6 : 1 - now.getDay()
        start.setDate(now.getDate() + diff)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        return `${fmt(start)} – ${fmt(end)}`
    }
    if (timeframe.value === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return `${fmt(start)} – ${fmt(end)}`
    }
    if (timeframe.value === 'year') {
        return `${fmt(new Date(now.getFullYear(), 0, 1))} – ${fmt(new Date(now.getFullYear(), 11, 31))}`
    }
    return ''
})

function fmt(d) {
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

const canExport = computed(() => {
    if (scope.value === 'member' && !selectedMemberId.value) return false
    if (timeframe.value === 'custom' && (!customFrom.value || !customTo.value)) return false
    return true
})

watch(() => props.modelValue, async (val) => {
    if (!val) return
    scope.value = 'me'
    selectedMemberId.value = null
    timeframe.value = 'week'
    customFrom.value = ''
    customTo.value = ''

    if (props.isAdmin && projectStore.selected) {
        try {
            const data = await invitationStore.fetchMembers(projectStore.selected.id)
            const currentUsername = authStore.getUsername()
            members.value = (data || []).filter(m => !m.pending && m.name !== currentUsername)
        } catch {
            members.value = []
        }
    }
})

function getDateRange() {
    const now = new Date()
    if (timeframe.value === 'week') {
        const start = new Date(now)
        const diff = now.getDay() === 0 ? -6 : 1 - now.getDay()
        start.setDate(now.getDate() + diff)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)
        return { from: start, to: end }
    }
    if (timeframe.value === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        return { from: start, to: end }
    }
    if (timeframe.value === 'year') {
        const start = new Date(now.getFullYear(), 0, 1)
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
        return { from: start, to: end }
    }
    if (timeframe.value === 'custom') {
        const to = new Date(customTo.value)
        to.setHours(23, 59, 59, 999)
        return { from: new Date(customFrom.value), to }
    }
    return null
}

function filterByTimeframe(entries) {
    const range = getDateRange()
    if (!range) return entries
    return entries.filter(e => {
        const d = new Date(e.startTime)
        return d >= range.from && d <= range.to
    })
}

function formatDate(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

function formatTime(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function calcDuration(start, end) {
    if (!start || !end) return ''
    const secs = Math.floor((new Date(end) - new Date(start)) / 1000)
    const h = Math.floor(secs / 3600)
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
    return `${h}:${m}`
}

function entriesToCSV(entries) {
    const header = [
        'ID',
        t('nav.reports.exportModal.csvDate'),
        t('nav.reports.exportModal.csvFrom'),
        t('nav.reports.exportModal.csvTo'),
        t('nav.reports.exportModal.csvDuration'),
        t('nav.reports.exportModal.csvDescription'),
        t('nav.reports.exportModal.csvUser'),
    ]
    const sorted = [...entries].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    const rows = sorted.map((e, i) => [
        i + 1,
        formatDate(e.startTime),
        formatTime(e.startTime),
        formatTime(e.endTime),
        calcDuration(e.startTime, e.endTime),
        `"${(e.description || '').replace(/"/g, '""')}"`,
        e.trackedBy?.username || authStore.getUsername()
    ])
    return [header, ...rows].map(r => r.join(',')).join('\n')
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

async function doExport() {
    if (!canExport.value) return

    let entries = []
    const projectName = projectStore.selected?.name || 'projekt'
    const pid = (() => { const id = projectStore.selectedId; return id && typeof id === 'object' ? id.id : id })()

    if (scope.value === 'me') {
        entries = timeEntryStore.myEntries.filter(e => e.project?.id == pid)
    } else {
        if (timeEntryStore.entries.length === 0) {
            await timeEntryStore.fetchByProject(pid)
        }
        if (scope.value === 'team') {
            entries = timeEntryStore.entries
        } else if (scope.value === 'member') {
            const member = members.value.find(m => m.id === selectedMemberId.value)
            entries = timeEntryStore.entries.filter(e => e.trackedBy?.username === member?.name)
        }
    }

    entries = filterByTimeframe(entries)

    const timeframeSuffix = timeframe.value === 'custom'
        ? `${customFrom.value}_${customTo.value}`
        : timeframe.value

    const scopeSuffix = scope.value === 'member'
        ? members.value.find(m => m.id === selectedMemberId.value)?.name || 'mitglied'
        : scope.value === 'team' ? 'team' : 'ich'

    downloadCSV(entriesToCSV(entries), `${projectName}-${scopeSuffix}-${timeframeSuffix}.csv`)
    emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .relative {
    transform: translateY(12px) scale(0.98);
    opacity: 0;
}

.modal-leave-to .relative {
    transform: translateY(6px) scale(0.99);
    opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease, max-height 0.2s ease;
    max-height: 120px;
    overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-6px);
    max-height: 0;
}
</style>
