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
        <IconLabelInput :iconPath="MemberIcon" :label="t('nav.projectSettings.addMembers')" :placeholder="t('nav.projectSettings.findMembers')" />
        <ManageMembers :iconPath="ManageMemberIcon" :headerLabel="t('nav.projectSettings.manageMembers')" :searchPlaceholder="t('nav.projectSettings.searchMembers')"/>
        <hr class="w-6/12 dark:border-slate-300 my-5 mt-10 border-[#cbd4fe] rounded" />
        
        <DeleteProject />

        <p v-if="errorMsg" class="text-sm text-red-500">{{ errorMsg }}</p>
        <p v-if="successMsg" class="text-sm text-green-500">{{ successMsg }}</p>

        <div class="flex w-1/2 justify-end">
            <Button :disabled="loading" @click="saveSettings">
                {{ loading ? t('nav.settings.beingSaved') : t('nav.settings.saved') }}
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

const { t } = useI18n()
const projectStore = useProjectStore()

const form = ref({
    name: projectStore.selected?.projectName ?? '',
    description: projectStore.selected?.description ?? '',
})

// Wenn sich das ausgewählte Projekt ändert, Felder neu befüllen
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
</script>