<template>
    <div class="flex flex-col items-center justify-center">
        <IconLabelInput
            :iconPath="NameIcon"
            :label="t('nav.projectSettings.changeProjectName')"
            :placeholder="t('nav.projectSettings.enterNewName')"
            v-model="form.name"
        />
        <IconLabelInput
            :iconPath="DescriptionIcon"
            :label="t('nav.projectSettings.changeProjectDescription')"
            :placeholder="t('nav.projectSettings.enterNewDescription')"
            :bigField="true"
            v-model="form.description"
        />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />

        <!-- Mitglieder einladen -->
        <div class="flex w-1/2 gap-6 px-6 py-5 mt-5 mb-3 bg-[#dde3ef] dark:bg-slate-600 rounded-2xl shadow-md shadow-black/10 flex-row items-center justify-between">
            <div class="flex items-center gap-3 shrink-0">
                <div class="w-5 h-5 flex items-center justify-center dark:invert">
                    <img :src="MemberIcon" alt="icon" class="w-full h-full object-contain" />
                </div>
                <span class="text-sm font-bold text-slate-800 dark:text-orange-50 tracking-wide">
                    {{ t('nav.projectSettings.addMembers') }}
                </span>
            </div>

            <div class="relative w-6/12">
                <input
                    type="text"
                    v-model="searchQuery"
                    @input="onSearchInput"
                    :placeholder="t('nav.projectSettings.findMembers')"
                    class="w-full px-4 py-2 text-sm rounded-xl bg-orange-50 border border-indigo-300 text-slate-700 dark:bg-slate-500 dark:text-orange-50 dark:border-slate-400 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-400 transition-colors duration-150 font-medium"
                />

                <!-- Suchergebnisse Dropdown -->
                <div v-if="searchResults.length > 0"
                    class="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-indigo-200 dark:border-slate-500 rounded-xl shadow-lg overflow-hidden">
                    <div
                        v-for="user in searchResults"
                        :key="user.id"
                        @click="inviteUser(user)"
                        class="flex items-center justify-between px-4 py-2 text-sm text-slate-700 dark:text-orange-50 hover:bg-indigo-50 dark:hover:bg-slate-600 cursor-pointer"
                    >
                        <span>{{ user.username }}</span>
                        <span class="text-xs text-indigo-400">{{ t('nav.projectSettings.invite') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <p v-if="inviteMsg" class="text-sm mt-1" :class="inviteError ? 'text-red-500' : 'text-green-500'">
            {{ inviteMsg }}
        </p>

        <ManageMembers :iconPath="ManageMemberIcon" :headerLabel="t('nav.projectSettings.manageMembers')" :searchPlaceholder="t('nav.projectSettings.searchMembers')"/>
        <hr class="w-6/12 dark:border-slate-300 my-5 mt-10 border-[#cbd4fe] rounded" />

        <DeleteProject />

        <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-sm text-green-500">{{ successMsg }}</p>

        <div class="flex w-1/2 justify-end">
            <Button :disabled="loading" @click="saveSettings">
                {{ loading ? t('nav.settings.beingSaved') : t('nav.settings.saved-project') }}
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import DeleteProject from '@/components/DeleteProject.vue'
import IconLabelInput from '@/components/IconLabelInput.vue'
import ManageMembers from '../components/ManageMembers.vue'
import Button from '@/components/Button.vue'
import NameIcon from '@/assets/project-settings/light/name.svg'
import MemberIcon from '@/assets/project-settings/light/member.svg'
import ManageMemberIcon from '@/assets/project-settings/light/manage-members.svg'
import DescriptionIcon from '@/assets/project-settings/light/description.svg'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import { useInvitationStore } from '@/stores/invitation'

const { t } = useI18n()
const projectStore = useProjectStore()
const invitationStore = useInvitationStore()

const form = ref({
    name: projectStore.selected?.projectName ?? '',
    description: projectStore.selected?.description ?? '',
})

watch(
    () => projectStore.selected,
    (project) => {
        if (project) {
            form.value.name = project.projectName
            form.value.description = project.description ?? ''
        }
    },
    { immediate: true }
)

const loading = ref(false)
const errorMsg = ref(null)
const successMsg = ref(null)

async function saveSettings() {
    if (!projectStore.selected) return
    errorMsg.value = null
    successMsg.value = null
    loading.value = true
    const id = projectStore.selected.id
    try {
        if (form.value.name && form.value.name !== projectStore.selected.projectName) {
            await projectStore.updateProjectName(id, form.value.name)
        }
        if (form.value.description !== (projectStore.selected.description ?? '')) {
            await projectStore.updateProjectDescription(id, form.value.description)
        }
        successMsg.value = 'Einstellungen gespeichert!'
    } catch (e) {
        errorMsg.value = e.message
    } finally {
        loading.value = false
    }
}

// Mitglieder einladen
const searchQuery = ref('')
const searchResults = ref([])
const inviteMsg = ref(null)
const inviteError = ref(false)
let searchTimeout = null

function onSearchInput() {
    clearTimeout(searchTimeout)
    inviteMsg.value = null
    if (searchQuery.value.length < 2) {
        searchResults.value = []
        return
    }
    searchTimeout = setTimeout(async () => {
        searchResults.value = await invitationStore.searchUsers(searchQuery.value)
    }, 300)
}

async function inviteUser(user) {
    if (!projectStore.selected) return
    searchResults.value = []
    searchQuery.value = ''
    inviteError.value = false
    try {
        await invitationStore.invite(projectStore.selected.id, user.id)
        inviteMsg.value = `${user.username} wurde eingeladen.`
    } catch (e) {
        inviteError.value = true
        inviteMsg.value = e.message
    }
}
</script>