<template>
    <div class="mt-5 w-6/12 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl overflow-hidden shadow-md shadow-black/10">

        <!-- Header -->
        <div class="flex justify-between gap-5 px-6 py-4">
            <div class="flex items-center gap-3 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-700 dark:text-orange-50" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50">{{ t('entries.title')
                }}</span>
            </div>

            <input v-model="searchQuery" type="text" :placeholder="t('entries.search')"
                class="flex-1 px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:border-slate-400 dark:placeholder-indigo-50" />
        </div>

        <!-- Column headers -->
        <div
            class="grid grid-cols-[1fr_1fr_2fr_44px] px-6 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 bg-[#cdd4e3]">
            <span>{{ t('entries.date') }}</span>
            <span>{{ t('entries.duration') }}</span>
            <span>{{ t('entries.description') }}</span>
            <span />
        </div>

        <!-- List body -->
        <div class="bg-[#d4dae8] min-h-16">

            <!-- Empty -->
            <div v-if="filteredEntries.length === 0"
                class="flex flex-col items-center gap-3 px-6 py-16 text-sm text-slate-400 dark:text-slate-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                    class="opacity-40">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>{{ t('entries.noEntries') }}</p>
            </div>

            <!-- Rows -->
            <TransitionGroup v-else name="row" tag="div">
                <div v-for="entry in filteredEntries" :key="entry.id">

                    <!-- Collapsed row -->
                    <div
                        class="grid grid-cols-[1fr_1fr_2fr_44px] items-center px-6 py-[18px] border-b border-slate-300/50 last:border-b-0 hover:bg-slate-300/30 dark:bg-slate-500 dark:hover:bg-slate-500/90 transition-colors duration-150">
                        <span class="text-sm font-semibold text-slate-800 dark:text-orange-50">{{ formatDate(entry.date)
                        }}</span>
                        <span class="font-mono text-xs text-slate-500 dark:text-orange-50/60">{{
                            formatDuration(entry.durationSeconds) }}</span>
                        <span class="pr-4 mr-8 text-sm truncate text-slate-500 dark:text-orange-50/60">{{
                            entry.description
                            || '—' }}</span>

                        <!-- Actions -->
                        <div class="flex items-center gap-0.5 justify-end">
                            <button @click="toggleEdit(entry)" :title="t('entries.edit')"
                                class="cursor-pointer flex items-center justify-center p-1.5 rounded-lg transition-colors duration-150 text-slate-500 dark:text-orange-50/60 hover:bg-slate-300/50 dark:hover:bg-slate-400/30">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="moveEntry(entry)" :title="t('entries.move')"
                                class="cursor-pointer flex items-center justify-center p-1.5 rounded-lg transition-colors duration-150 text-slate-500 dark:text-orange-50/60 hover:bg-slate-300/50 dark:hover:bg-slate-400/30">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            <button @click="deleteEntry(entry)" :title="t('entries.delete')"
                                class="cursor-pointer flex items-center justify-center p-1.5 rounded-lg transition-colors duration-150 text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/20">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Expanded edit panel -->
                    <Transition name="expand">
                        <div v-if="editingId === entry.id"
                            class="px-6 pb-6 border-b border-slate-300/50 bg-[#cdd4e3] dark:bg-slate-700/50">

                            <!-- Edit header -->
                            <div class="flex items-center justify-between py-3 mb-4">
                                <span class="text-xs font-semibold tracking-widest uppercase text-slate-400">{{
                                    t('entries.editing') }}</span>
                                <button @click="saveEntry(entry)"
                                    class="px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 bg-indigo-400 shadow-sm cursor-pointer hover:bg-indigo-500 rounded-xl">
                                    {{ t('entries.save') }}
                                </button>
                            </div>

                            <!-- Date + Zeitraum -->
                            <div class="flex flex-wrap items-center gap-6 mb-5">
                                <div class="flex items-center gap-3">
                                    <label class="text-xs font-semibold tracking-widest uppercase text-slate-500">{{
                                        t('entries.date') }}:</label>
                                    <input type="date" v-model="draft.date"
                                        class="px-3 py-2 text-sm border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400" />
                                </div>
                                <div class="flex items-center gap-3">
                                    <label class="text-xs font-semibold tracking-widest uppercase text-slate-500">{{
                                        t('entries.timeRange') }}:</label>
                                    <input type="time" v-model="draft.startTime"
                                        class="px-3 py-2 text-sm border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400" />
                                    <span class="text-slate-400">—</span>
                                    <input type="time" v-model="draft.endTime"
                                        class="px-3 py-2 text-sm border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400" />
                                </div>
                            </div>

                            <!-- Description -->
                            <div>
                                <label
                                    class="block mb-2 text-xs font-semibold tracking-widest uppercase text-slate-500">{{
                                        t('entries.description') }}</label>
                                <textarea v-model="draft.description" rows="3"
                                    :placeholder="entry.description || t('entries.descriptionPlaceholder')"
                                    class="w-full px-4 py-3 text-sm border border-indigo-300 outline-none resize-none rounded-xl bg-orange-50 text-slate-700 focus:ring-1 focus:ring-indigo-400 placeholder:text-slate-400 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 dark:placeholder-indigo-50" />
                            </div>
                        </div>
                    </Transition>

                </div>
            </TransitionGroup>
        </div>

        <!-- Footer -->
        <div
            class="flex items-center justify-between px-6 py-2 bg-[#cdd4e3] text-xs text-slate-500 dark:bg-slate-700/50 dark:text-orange-50">
            <span>{{ statusText }}</span>
            <button
                class="px-2 py-1 transition-colors duration-150 rounded cursor-pointer text-slate-600 hover:bg-slate-300/50 dark:text-orange-50 dark:hover:bg-slate-500/50"
                @click="refresh">
                {{ t('entries.refresh') }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const searchQuery = ref('')

// --- Mock data --- !replace with real store data entryStore.entries
const entries = ref([
    { id: 1, date: '2026-05-03', durationSeconds: 16200, description: 'Ich habe keine Ahnung was ich hier schreibe', startTime: '08:00', endTime: '12:30' },
    { id: 2, date: '2026-05-04', durationSeconds: 7200, description: 'Backend API Implementierung', startTime: '09:00', endTime: '11:00' },
    { id: 3, date: '2026-05-05', durationSeconds: 3600, description: '', startTime: '14:00', endTime: '15:00' },
])

const filteredEntries = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return entries.value
    return entries.value.filter(e =>
        e.description.toLowerCase().includes(q) || formatDate(e.date).includes(q)
    )
})

const statusText = computed(() => {
    const total = entries.value.length
    const shown = filteredEntries.value.length
    if (searchQuery.value && shown !== total)
        return `${shown} von ${total} ${t('entries.count')}`
    return `${total} ${t('entries.count')}`
})

// --- Edit state ---
const editingId = ref(null)
const draft = reactive({ date: '', startTime: '', endTime: '', description: '' })

function toggleEdit(entry) {
    if (editingId.value === entry.id) { editingId.value = null; return }
    editingId.value = entry.id
    draft.date = entry.date
    draft.startTime = entry.startTime
    draft.endTime = entry.endTime
    draft.description = entry.description
}

function saveEntry(entry) {
    const updated = { ...entry, ...draft }
    console.log('[ManageEntries] save entry:', updated)
    // TODO: entryStore.updateEntry(updated)
    editingId.value = null
}

function moveEntry(entry) {
    console.log('[ManageEntries] move entry:', entry)
    // TODO: open project picker modal, then entryStore.moveEntry(entry.id, targetProjectId)
}

function deleteEntry(entry) {
    console.log('[ManageEntries] delete entry:', entry)
    // TODO: entryStore.deleteEntry(entry.id)
    entries.value = entries.value.filter(e => e.id !== entry.id)
}

function refresh() {
    console.log('[ManageEntries] refresh')
    // TODO: entryStore.fetchEntries()
}

function formatDate(iso) {
    const [y, m, d] = iso.split('-')
    return `${d}.${m}.${y}`
}

function formatDuration(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${h}:${m}:${s}`
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    overflow: hidden;
    max-height: 400px;
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
