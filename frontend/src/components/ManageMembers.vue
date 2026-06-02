<template>
    <div class="mt-5 w-6/12 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl overflow-hidden shadow-md shadow-black/10">

        <!-- Header -->
        <div class="flex justify-between gap-5 px-6 py-4">
            <div class="flex items-center gap-3 shrink-0">
                <div class="flex items-center justify-center w-5 h-5 text-slate-700 dark:invert">
                    <img :src="iconPath" alt="icon" class="object-contain w-full h-full" />
                </div>
                <span class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50">{{ headerLabel
                    }}</span>
            </div>

            <input v-model="searchQuery" type="text" :placeholder="searchPlaceholder"
                class="flex-1 px-4 py-2 text-sm font-medium transition-colors duration-150 border border-indigo-300 outline-none rounded-xl bg-orange-50 text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-indigo-400 dark:bg-slate-500 dark:border-slate-400 dark:placeholder-indigo-50" />
        </div>

        <!-- Column headers -->
        <div
            class="grid grid-cols-[1fr_1fr_auto_44px] px-6 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 bg-[#cdd4e3] dark:bg-slate-700/50 dark:text-orange-50">
            <span>{{ t('nav.projectSettings.name') }}</span>
            <span>{{ t('nav.projectSettings.email') }}</span>
            <span>{{ t('nav.projectSettings.role') }}</span>
            <span />
        </div>

        <!-- List body -->
        <div class="bg-[#d4dae8] min-h-16">

            <!-- Loading skeletons -->
            <template v-if="loading">
                <div v-for="n in 4" :key="n"
                    class="grid grid-cols-[1fr_1fr_auto_44px] items-center px-6 py-[18px] border-b border-slate-300/50 gap-3 dark:bg-slate-500">
                    <div class="h-3 rounded-md bg-slate-300/70 animate-pulse" style="width:55%" />
                    <div class="h-3 rounded-md bg-slate-300/70 animate-pulse" style="width:70%" />
                    <div class="w-16 h-3 rounded-md bg-slate-300/70 animate-pulse" />
                    <div />
                </div>
            </template>

            <!-- Error -->
            <div v-else-if="error" class="px-6 py-6 text-sm text-center text-red-500">
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
                    class="grid grid-cols-[1fr_1fr_auto_44px] items-center px-6 py-[18px] border-b border-slate-300/50 last:border-b-0 hover:bg-slate-300/30 dark:bg-slate-500 dark:hover:bg-slate-500/90 transition-colors duration-150">
                    <span class="text-sm font-semibold text-slate-800 dark:text-orange-50">{{ member.name }}</span>
                    <span class="font-mono text-xs text-slate-500 dark:text-orange-50/60">{{ member.email }}</span>

                    <!-- Role badge -->
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-lg w-fit" :class="{
                        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300': member.isAdmin,
                        'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300': !member.isAdmin && !member.pending,
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300': member.pending,
                    }">
                        {{ member.isAdmin ? t('nav.projectSettings.admin') : member.pending ?
                            t('nav.projectSettings.pending') :
                            t('nav.projectSettings.member') }}
                    </span>
                    <button v-if="!member.isAdmin"
                        class="flex items-center justify-center p-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
                        :title="t('nav.projectSettings.deleteMember')" @mouseover="hoveredId = member.id"
                        @mouseleave="hoveredId = null" @click="handleDelete(member)">
                        <img :src="hoveredId === member.id ? TrashIconFilled : TrashIcon" alt="Trash Icon"
                            class="object-contain w-4 h-4 dark:invert" />
                    </button>
                </div>
            </TransitionGroup>
        </div>

        <!-- Footer -->
        <div
            class="flex items-center justify-between px-6 py-2 bg-[#cdd4e3] text-xs text-slate-500 dark:bg-slate-700/50 dark:text-orange-50">
            <span>{{ statusText }}</span>
            <button
                class="px-2 py-1 transition-colors duration-150 rounded text-slate-600 hover:bg-slate-300/50 dark:text-orange-50 dark:hover:bg-slate-500/50"
                @click="loadMembers">
                {{ t('nav.projectSettings.update') }}
            </button>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import TrashIcon from '@/assets/project-settings/light/trash.svg'
import TrashIconFilled from '@/assets/project-settings/light/trash-filled.svg'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import { useInvitationStore } from '@/stores/invitation'

const { t } = useI18n()
const projectStore = useProjectStore()
const invitationStore = useInvitationStore()
const hoveredId = ref(null)

const props = defineProps({
    iconPath: { type: String, default: null },
    headerLabel: { type: String, default: 'Mitglieder verwalten' },
    searchPlaceholder: { type: String, default: 'Mitglieder suchen…' },
})

const emit = defineEmits(['member-deleted'])

const members = ref([])
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

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
    if (searchQuery.value && shown !== total)
        return `${shown} ${t('nav.projectSettings.of')} ${total} ${t('nav.projectSettings.members')}`
    return `${total} Mitglied${total !== 1 ? 'er' : ''}`
})

async function loadMembers() {
    if (!projectStore.selected) return
    loading.value = true
    error.value = null
    try {
        members.value = await invitationStore.fetchMembers(projectStore.selected.id)
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

async function handleDelete(member) {
    if (member.isAdmin) return  // Admin kann nicht entfernt werden
    try {
        await invitationStore.removeMember(projectStore.selected.id, member.invitationId)
        members.value = members.value.filter(m => m.id !== member.id)
        emit('member-deleted', { id: member.id })
    } catch (err) {
        console.error('Delete failed:', err)
    }
}

watch(() => projectStore.selected, loadMembers, { immediate: true })

onMounted(loadMembers)
defineExpose({ loadMembers })
</script>
