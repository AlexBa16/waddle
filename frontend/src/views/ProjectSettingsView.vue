<template>
    <div class="flex flex-col items-center justify-center">
        <IconLabelInput :iconPath=NameIcon label="Projektnamen ändern" placeholder="Neuen Namen eingeben..." />
        <IconLabelInput :iconPath=MemberIcon label="Mitglieder hinzufügen" placeholder="Mitglieder finden..." />
    </div>
</template>

<script setup>
import IconLabelInput from '@/components/IconLabelInput.vue'
import NameIcon from '@/assets/project-settings/light/name.svg'
import MemberIcon from '@/assets/project-settings/light/member.svg'
</script>
