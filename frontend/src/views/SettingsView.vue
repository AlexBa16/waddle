<template>
    <div class="flex flex-col gap-4 items-center justify-center">
        <IconLabelInput :iconPath="languageIcon" label="Sprache ändern: " select="true" />
        <IconLabelInput :iconPath="viewModeIcon" label="Hell/Dunkel: " selectViewMode="true" />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <IconLabelInput :iconPath="userIcon" label="Benutzernamen ändern: " placeholder="Neuer Benutzername..." />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <IconLabelInput :iconPath="passwordIcon" label="Passwort ändern: " placeholder="Neues Passwort..." />
        <IconLabelInput :iconPath="passwordIcon" label="Passwort bestätigen: "
            placeholder="Neues Passwort bestätigen..." />
        <hr class="w-6/12 dark:border-slate-300 my-5 border-[#cbd4fe] rounded" />
        <div class="flex w-1/2 justify-end">
            <Button @click="saveSettings()">Speichern</Button>
        </div>
    </div>
</template>

<script setup>
import IconLabelInput from '@/components/IconLabelInput.vue';
import userIcon from '@/assets/user-settings/light/user.svg';
import languageIcon from '@/assets/user-settings/light/language.svg';
import passwordIcon from '@/assets/user-settings/light/password.svg';
import viewModeIcon from '@/assets/user-settings/light/viewModeIcon.svg';
import Button from '@/components/Button.vue';

//TODO: Implementieren der Logik zum Speichern der Einstellungen
function saveSettings() {
    // Hier können die Logik zum Speichern der Einstellungen implementiert werden
    alert('Einstellungen gespeichert!');
}
</script>
