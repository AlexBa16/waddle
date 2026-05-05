<template>
    <div class="mt-5 w-6/12 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl overflow-hidden shadow-md shadow-black/10">

        <!-- Header -->
        <div class="px-6 py-4 flex justify-between gap-5">
            <div class="flex items-center gap-3 shrink-0">
                <div class="w-5 h-5 flex items-center justify-center text-slate-700 dark:invert">
                    <img :src="iconPath" alt="icon" class="w-full h-full object-contain" />
                </div>
                <span class="text-sm font-bold text-slate-800 dark:text-orange-50 tracking-wide">{{ headerLabel }}</span>
            </div>

            <input v-model="searchQuery" type="text" :placeholder="searchPlaceholder"
                class="flex-1 px-4 py-2 text-sm rounded-xl bg-orange-50 border border-indigo-300 text-slate-700 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-400 transition-colors duration-150 font-medium dark:bg-slate-500 dark:border-slate-400 dark:placeholder-indigo-50" />
        </div>

        <!-- Column headers -->
        <div
            class="grid grid-cols-[1fr_1fr_44px] px-6 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 bg-[#cdd4e3]">
            <span>{{ t('nav.projectSettings.name') }}</span>
            <span>{{ t('nav.projectSettings.email') }}</span>
            <span />
        </div>

        <!-- List body -->
        <div class="bg-[#d4dae8] min-h-16">

            <!-- Loading skeletons -->
            <template v-if="loading">
                <div v-for="n in 4" :key="n"
                    class="grid grid-cols-[1fr_1fr_44px] items-center px-6 py-[18px] border-b border-slate-300/50 gap-3 dark:bg-slate-500">
                    <div class="h-3 rounded-md bg-slate-300/70 animate-pulse" style="width:55%" />
                    <div class="h-3 rounded-md bg-slate-300/70 animate-pulse" style="width:70%" />
                    <div />
                </div>
            </template>

            <!-- Error -->
            <div v-else-if="error" class="px-6 py-6 text-sm text-red-500 text-center">
                {{ t('nav.projectSettings.errorLoadingMessage') }} {{ error }}
            </div>

            <!-- Empty -->
            <div v-else-if="filteredMembers.length === 0"
                class="flex flex-col items-center gap-3 px-6 py-16 text-sm text-slate-400 dark:text-slate-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                    class="opacity-40">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                <p>{{ t('nav.projectSettings.noMembersFound') }}</p>
            </div>

            <!-- Rows -->
            <TransitionGroup v-else name="row" tag="div">
                <div v-for="member in filteredMembers" :key="member.id"
                    class="grid grid-cols-[1fr_1fr_44px] items-center px-6 py-[18px] border-b border-slate-300/50 last:border-b-0 hover:bg-slate-300/30 dark:bg-slate-500 dark:hover:bg-slate-500/90 transition-colors duration-150">
                    <span class="text-sm font-semibold text-slate-800 dark:text-orange-50">{{ member.name }}</span>
                    <span class="text-xs font-mono text-slate-500 dark:text-orange-50/60">{{ member.email }}</span>
                    <button class="flex items-center justify-center p-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
                        title="Löschen" @mouseover="hoveredId = member.id" @mouseleave="hoveredId = null"
                        @click="handleDelete(member.id)">
                        <img :src="hoveredId === member.id ? TrashIconFilled : TrashIcon" alt="Trash Icon"
                            class="w-4 h-4 object-contain dark:invert" />
                    </button>
                </div>
            </TransitionGroup>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-6 py-2 bg-[#cdd4e3] text-xs text-slate-500 dark:bg-slate-700/50 dark:text-orange-50">
            <span>{{ statusText }}</span>
            <button class="text-slate-600 hover:bg-slate-300/50 px-2 py-1 rounded transition-colors duration-150 dark:text-orange-50 dark:hover:bg-slate-500/50"
                @click="loadMembers">
                {{ t('nav.projectSettings.update') }}
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TrashIcon from '@/assets/project-settings/light/trash.svg'
import TrashIconFilled from '@/assets/project-settings/light/trash-filled.svg'
import { useI18n } from 'vue-i18n'

const {t} = useI18n()

const hoveredId = ref(null)

// ── Props ──────────────────────────────────────────────────────────────────
const props = defineProps({
    iconPath: {
        type: String,
        default: null,
    },
    headerLabel: {
        type: String,
        default: 'Mitglieder hinzufügen',
    },
    searchPlaceholder: {
        type: String,
        default: 'Mitglieder finden…',
    },
})

// ── Emits ──────────────────────────────────────────────────────────────────
const emit = defineEmits([
    /** Emitted after a member is deleted. Payload: { id } */
    'member-deleted',
])

// ── State ──────────────────────────────────────────────────────────────────
const members = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

// ── Computed ───────────────────────────────────────────────────────────────
const filteredMembers = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return members.value
    return members.value.filter(
        m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    )
})

const statusText = computed(() => {
    if (loading.value) return t('nav.projectSettings.loading')
    if (error.value) return t('nav.projectSettings.errorLoading')
    const total = members.value.length
    const shown = filteredMembers.value.length
    if (searchQuery.value && shown !== total) return `${shown} ${t('nav.projectSettings.of')} ${total} ${t('nav.projectSettings.members')}`
    return `${total} Mitglied${total !== 1 ? 'er' : ''}`
})

// ── API ────────────────────────────────────────────────────────────────────

/**
 * TODO: Replace this placeholder with your actual API call.
 *
 * Expected return shape: Array<{ id: number|string, name: string, email: string }>
 *
 * Example using fetch:
 *   const res = await fetch('/api/members')
 *   if (!res.ok) throw new Error('Network response was not ok')
 *   return await res.json()
 *
 * Example using axios:
 *   const { data } = await axios.get('/api/members')
 *   return data
 */
async function fetchMembers() {
    await new Promise(r => setTimeout(r, 900)) // simulated delay — remove this
    return [
        { id: 1, name: 'Linsu Bitter', email: 'linsu@bitter.com' },
        { id: 2, name: 'Marie Hofmann', email: 'marie.hofmann@example.at' },
        { id: 3, name: 'Karl Steiner', email: 'k.steiner@web.de' },
        { id: 4, name: 'Anna Berger', email: 'anna@berger.at' },
    ]
}

/**
 * TODO: Replace this placeholder with your actual DELETE API call.
 *
 * Example using fetch:
 *   const res = await fetch(`/api/members/${id}`, { method: 'DELETE' })
 *   if (!res.ok) throw new Error('Delete failed')
 *
 * Example using axios:
 *   await axios.delete(`/api/members/${id}`)
 */
async function deleteMember(id) {
    await new Promise(r => setTimeout(r, 200)) // simulated delay — remove this
}

// ── Methods ────────────────────────────────────────────────────────────────
async function loadMembers() {
    loading.value = true
    error.value = null
    try {
        members.value = await fetchMembers()
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

async function handleDelete(id) {
    try {
        await deleteMember(id)
        members.value = members.value.filter(m => m.id !== id)
        emit('member-deleted', { id })
    } catch (err) {
        console.error('Delete failed:', err)
    }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(loadMembers)
</script>

<style>
.row-enter-active {
    transition: all 0.25s ease;
}

.row-leave-active {
    transition: all 0.2s ease;
}

.row-enter-from {
    opacity: 0;
    transform: translateY(8px);
}

.row-leave-to {
    opacity: 0;
    transform: translateX(12px);
}
</style>
