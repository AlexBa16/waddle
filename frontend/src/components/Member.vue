<template>
    <div class="w-full bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md shadow-black/5">
        <!-- Header mit dem dynamischen Usernamen -->
        <div class="mb-6">
            <h2 class="text-xl font-bold text-slate-800 dark:text-orange-50">
                {{ t('nav.reports.memberReportFor', 'Bericht für') }}: 
                <span class="text-indigo-500 dark:text-indigo-400 font-semibold">{{ username }}</span>
            </h2>
            <p class="text-xs text-slate-400 mt-1">
                {{ t('nav.reports.individualView', 'Einzelauswertung der Arbeitszeiten') }}
            </p>
        </div>

        <!-- Hier folgen deine Charts und Auswertungen -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Beispiel-Platzhalter für dein Chart-Widget -->
            <div class="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-sm text-slate-500">
                [ Hier das Chart für {{ username }} rendern ]
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Das empfangene Prop definieren
defineProps({
    username: {
        type: String,
        required: true
    }
})
</script>
