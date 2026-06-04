<template>
    <div class="mt-5 w-full md:w-8/12 lg:w-6/12 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl overflow-hidden shadow-md shadow-black/10">

        <!-- Header -->
        <div class="flex justify-between items-center gap-5 px-6 py-4">
            <div class="flex items-center gap-3 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-700 dark:text-orange-50" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50">{{ t('entries.title') }}</span>
            </div>

            <input v-model="searchQuery" type="text" :placeholder="t('entries.search')"
                class="flex-1 max-w-xs px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-300 dark:border-slate-400 outline-none rounded-xl bg-orange-50 dark:bg-slate-500 text-slate-700 dark:text-orange-50 placeholder-slate-400 dark:placeholder-indigo-50 focus:ring-1 focus:ring-indigo-400" />
        </div>

        <!-- Column headers -->
        <div class="grid grid-cols-[1fr_1fr_2fr_44px] px-6 py-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-300 bg-[#cdd4e3] dark:bg-slate-700/50">
            <span>{{ t('entries.date') }}</span>
            <span>{{ t('entries.duration') }}</span>
            <span>{{ t('entries.description') }}</span>
            <span />
        </div>

        <!-- List body -->
        <div class="bg-[#d4dae8] dark:bg-slate-500/40 min-h-16 divide-y divide-[#cdd4e3] dark:divide-slate-600/60">

            <!-- Loading skeletons -->
            <template v-if="entryStore.loading">
                <div v-for="n in 4" :key="n"
                    class="grid grid-cols-[1fr_1fr_2fr_44px] items-center px-6 py-[18px] gap-3">
                    <div class="h-3 rounded-md bg-slate-300/70 dark:bg-slate-600/70 animate-pulse" style="width:55%" />
                    <div class="h-3 rounded-md bg-slate-300/70 dark:bg-slate-600/70 animate-pulse" style="width:40%" />
                    <div class="h-3 rounded-md bg-slate-300/70 dark:bg-slate-600/70 animate-pulse" style="width:70%" />
                    <div />
                </div>
            </template>

            <!-- Error -->
            <div v-else-if="entryStore.error" class="px-6 py-8 text-sm text-center text-red-500 dark:text-red-400">
                {{ entryStore.error }}
            </div>

            <!-- Empty -->
            <div v-else-if="filteredEntries.length === 0"
                class="flex flex-col items-center gap-3 px-6 py-16 text-sm text-slate-400 dark:text-orange-50/60">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="opacity-40">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>{{ t('entries.noEntries') }}</p>
            </div>

            <!-- Rows -->
            <TransitionGroup v-else name="row" tag="div" class="divide-y divide-slate-300/40 dark:divide-slate-600/60">
                <div v-for="entry in filteredEntries" :key="entry.id"
                    class="transition-all duration-200 pl-4 border-l-4"
                    :class="[editingId === entry.id ? 'bg-slate-300/30 dark:bg-slate-700/30 border-indigo-400 dark:border-indigo-400' : 'border-transparent']">

                    <!-- Collapsed row layout -->
                    <div class="grid grid-cols-[1fr_1fr_2fr_44px] items-center pr-6 py-[18px] hover:bg-slate-300/20 dark:hover:bg-slate-600/30 transition-colors duration-150">
                        <span class="text-sm font-semibold text-slate-800 dark:text-orange-50">{{ formatDate(entry.startTime) }}</span>
                        <span class="font-mono text-xs text-slate-500 dark:text-orange-50/60">{{ calcDuration(entry.startTime, entry.endTime) }}</span>
                        <span class="pr-4 mr-8 text-sm truncate text-slate-500 dark:text-orange-50/60">{{ entry.description || '—' }}</span>

                        <!-- Actions -->
                        <div class="flex items-center gap-0.5 justify-end">
                            <button @click="toggleEdit(entry)" :title="t('entries.edit')"
                                :class="[editingId === entry.id ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-slate-600/80' : 'text-slate-500 dark:text-orange-50/60 hover:bg-slate-300/50 dark:hover:bg-slate-600/50']"
                                class="cursor-pointer flex items-center justify-center p-1.5 rounded-lg transition-colors duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="deleteEntry(entry)" :title="t('entries.delete')"
                                class="cursor-pointer flex items-center justify-center p-1.5 rounded-lg transition-colors duration-150 text-red-400 hover:bg-red-100/40 dark:hover:bg-red-950/20">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Edit Panel -->
                    <Transition name="expand">
                        <div v-if="editingId === entry.id" class="pr-6 pb-5">
                            <div class="bg-orange-50/60 dark:bg-slate-700/40 rounded-xl border border-indigo-200 dark:border-slate-500/40 shadow-sm p-4 space-y-4">

                                <div class="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-slate-600/60">
                                    <span class="text-xs font-bold tracking-wider uppercase text-indigo-500 dark:text-indigo-300 flex items-center gap-1.5">
                                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                        {{ t('entries.editing') }}
                                    </span>
                                    <button @click="saveEntry(entry)"
                                        :disabled="draftTouched && !!draftTimeError"
                                        class="px-4 py-1.5 text-xs font-semibold text-white transition-colors duration-150 bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                        {{ t('entries.save') }}
                                    </button>
                                </div>

                                <!-- Field Inputs -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-300">{{ t('entries.date') }}</label>
                                        <input type="date" v-model="draft.date"
                                            class="w-full px-3 py-2 text-sm border border-indigo-200 dark:border-slate-500 outline-none rounded-xl bg-orange-50 dark:bg-slate-500 text-slate-700 dark:text-orange-50 focus:ring-1 focus:ring-indigo-400" />
                                    </div>
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-300">{{ t('entries.timeRange') }}</label>
                                        <div class="flex items-center gap-2">
                                            <input type="time" v-model="draft.startTime" @change="draftTouched = true"
                                                class="flex-1 px-3 py-2 text-sm border border-indigo-200 dark:border-slate-500 outline-none rounded-xl bg-orange-50 dark:bg-slate-500 text-slate-700 dark:text-orange-50 focus:ring-1 focus:ring-indigo-400" />
                                            <span class="text-slate-400 dark:text-slate-300 shrink-0">—</span>
                                            <input type="time" v-model="draft.endTime" @change="draftTouched = true"
                                                class="flex-1 px-3 py-2 text-sm border border-indigo-200 dark:border-slate-500 outline-none rounded-xl bg-orange-50 dark:bg-slate-500 text-slate-700 dark:text-orange-50 focus:ring-1 focus:ring-indigo-400"
                                                :class="{ 'border-red-400 dark:border-red-400 focus:ring-red-400': draftTouched && draftTimeError }" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Description Textarea -->
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-300">{{ t('entries.description') }}</label>
                                    <textarea v-model="draft.description" rows="2"
                                        :placeholder="entry.description || t('entries.descriptionPlaceholder')"
                                        class="w-full px-4 py-2.5 text-sm border border-indigo-200 dark:border-slate-500 outline-none resize-none rounded-xl bg-orange-50 dark:bg-slate-500 text-slate-700 dark:text-orange-50 placeholder:text-slate-400 dark:placeholder:indigo-100/50 focus:ring-1 focus:ring-indigo-400" />
                                </div>

                                <!-- Time validation error -->
                                <p v-if="draftTouched && draftTimeError" class="text-sm text-red-500 dark:text-red-400 -mt-2">
                                    {{ draftTimeError }}
                                </p>
                            </div>
                        </div>
                    </Transition>
                </div>
            </TransitionGroup>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-6 py-2.5 bg-slate-400/20 dark:bg-slate-700/40 text-xs text-slate-500 dark:text-orange-50 border-t border-slate-300/30 dark:border-slate-600/40">
            <span class="font-medium">{{ statusText }}</span>
            <button class="px-2.5 py-1 font-medium transition-colors duration-150 rounded-lg cursor-pointer text-slate-600 dark:text-orange-50 hover:bg-slate-300/40 dark:hover:bg-slate-600/50"
                @click="refresh">
                {{ t('entries.refresh') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTimeEntryStore } from '@/stores/timeEntry'
import { useProjectStore } from '@/stores/project'

const { t } = useI18n()
const entryStore = useTimeEntryStore()
const projectStore = useProjectStore()

const searchQuery = ref('')
const editingId = ref(null)
const draft = reactive({ date: '', startTime: '', endTime: '', description: '' })
const draftTouched = ref(false)

const filteredEntries = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return entryStore.myEntries  // ← was entryStore.entries
    return entryStore.myEntries.filter(e =>  // ← was entryStore.entries
        e.description?.toLowerCase().includes(q) || formatDate(e.startTime).includes(q)
    )
})

const statusText = computed(() => {
    if (entryStore.loading) return t('entries.loading')
    if (entryStore.error) return t('entries.errorLoading')
    const total = entryStore.myEntries.length  
    const shown = filteredEntries.value.length
    if (searchQuery.value && shown !== total)
        return `${shown} von ${total} ${t('entries.count')}`
    return `${total} ${t('entries.count')}`
})

const draftTimeError = computed(() => {
    if (draft.endTime < draft.startTime) return 'End time cannot be before start time'
    if (draft.endTime === draft.startTime) return 'Start and end time cannot be the same'
    return null
})

function formatDate(iso) {
    if (!iso) return '—'
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

function calcDuration(start, end) {
    if (!start || !end) return '—'
    const secs = Math.floor((new Date(end) - new Date(start)) / 1000)
    const h = String(Math.floor(secs / 3600)).padStart(2, '0')
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
}

function toTimeInput(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function toDateInput(iso) {
    if (!iso) return ''
    return new Date(iso).toISOString().slice(0, 10)
}

function toggleEdit(entry) {
    if (editingId.value === entry.id) {
        editingId.value = null
        draftTouched.value = false
        return
    }
    editingId.value = entry.id
    draft.date = toDateInput(entry.startTime)
    draft.startTime = toTimeInput(entry.startTime)
    draft.endTime = toTimeInput(entry.endTime)
    draft.description = entry.description ?? ''
    draftTouched.value = false
}

async function saveEntry(entry) {
    draftTouched.value = true
    if (draftTimeError.value) return

    const startISO = new Date(`${draft.date}T${draft.startTime}:00`).toISOString()
    const endISO = new Date(`${draft.date}T${draft.endTime}:00`).toISOString()
    await entryStore.update(entry.id, {
        description: draft.description,
        startTime: startISO,
        endTime: endISO,
    })
    editingId.value = null
    draftTouched.value = false
}

async function deleteEntry(entry) {
    await entryStore.remove(entry.id)
}

async function refresh() {
    await entryStore.fetchByUser()
}

watch(() => projectStore.selected, refresh, { immediate: true })
onMounted(refresh)
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
    overflow: hidden;
    max-height: 350px;
}
.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}
.row-enter-active,
.row-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.row-enter-from,
.row-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
