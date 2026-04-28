<template>
    <div class="flex flex-col items-center justify-center">
        <IconLabelInput :iconPath=NameIcon label="Projektnamen ändern" placeholder="Neuen Namen eingeben..." />
        <IconLabelInput :iconPath=DescriptionIcon label="Projektbeschreibung ändern"
            placeholder="Neue Beschreibung eingeben..." :bigField="true" />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <IconLabelInput :iconPath=MemberIcon label="Mitglieder hinzufügen" placeholder="Mitglieder finden..." />
        <ManageMembers :iconPath="ManageMemberIcon" headerLabel="Mitglieder verwalten" searchPlaceholder="Mitglieder suchen..."/>
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
</script>
