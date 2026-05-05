<template>
    <div class="flex flex-col items-center justify-center">
        <IconLabelInput :iconPath=NameIcon :label="t('nav.projectSettings.changeProjectName')" :placeholder="t('nav.projectSettings.enterNewName')" />
        <IconLabelInput :iconPath=DescriptionIcon :label="t('nav.projectSettings.changeProjectDescription')"
            :placeholder="t('nav.projectSettings.enterNewDescription')" :bigField="true" />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <IconLabelInput :iconPath=MemberIcon :label="t('nav.projectSettings.addMembers')" :placeholder="t('nav.projectSettings.findMembers')" />
        <ManageMembers :iconPath="ManageMemberIcon" :headerLabel="t('nav.projectSettings.manageMembers')" :searchPlaceholder="t('nav.projectSettings.searchMembers')"/>
        <hr class="w-6/12 dark:border-slate-300 my-5 mt-10 border-[#cbd4fe] rounded" />
        <DeleteProject />
    </div>
</template>

<script setup>
import DeleteProject from '@/components/DeleteProject.vue'
import IconLabelInput from '@/components/IconLabelInput.vue'
import ManageMembers from './ManageMembers.vue';
import NameIcon from '@/assets/project-settings/light/name.svg'
import MemberIcon from '@/assets/project-settings/light/member.svg'
import ManageMemberIcon from '@/assets/project-settings/light/manage-members.svg'
import DescriptionIcon from '@/assets/project-settings/light/description.svg'
import { useI18n } from 'vue-i18n'

const {t} = useI18n()
</script>
