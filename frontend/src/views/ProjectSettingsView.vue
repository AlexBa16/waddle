<template>
    <div class="flex flex-col items-center justify-center">
        <IconLabelInput :iconPath=NameIcon label="Projektnamen ändern" placeholder="Neuen Namen eingeben..." />
        <IconLabelInput :iconPath=DescriptionIcon label="Projektbeschreibung ändern"
            placeholder="Neue Beschreibung eingeben..." bigField=true />
            <hr class="w-6/12 dark:border-slate-300 my-5" />
        <IconLabelInput :iconPath=MemberIcon label="Mitglieder hinzufügen" placeholder="Mitglieder finden..." />
    </div>
</template>

<script setup>
import IconLabelInput from '@/components/IconLabelInput.vue'
import NameIcon from '@/assets/project-settings/light/name.svg'
import MemberIcon from '@/assets/project-settings/light/member.svg'
import DescriptionIcon from '@/assets/project-settings/light/description.svg'
</script>
