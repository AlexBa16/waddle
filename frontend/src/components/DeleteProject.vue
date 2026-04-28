<template>
    <div class="flex w-1/2 gap-6 px-6 py-5 mt-5 mb-3 bg-[#dde3ef] rounded-2xl shadow-md shadow-black/10"
        :class="bigField ? 'flex-col items-stretch' : 'flex-row items-center justify-between'">
        <div class="flex items-center gap-3 shrink-0">
            <span class="text-sm font-bold text-slate-800 tracking-wide">Projekt permanent löschen</span>
        </div>
        <button class="px-4 py-2 text-sm font-medium text-orange-50 transition-all duration-200 shadow-lg cursor-pointer sm:px-5 lg:px-6 sm:py-4 rounded-xl sm:rounded-2xl sm:text-base lg:text-lg bg-red-500 hover:bg-red-600"
            @click="handleDelete">
            Projekt löschen
        </button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function handleDelete() {
    if (confirm('Bist du sicher, dass du dieses Projekt löschen möchtest? Dieser Vorgang kann nicht rückgängig gemacht werden.')) {
        // Hier würde normalerweise die Lösch-Logik stehen, z.B. ein API-Aufruf
        // Nach erfolgreichem Löschen zurück zum Dashboard navigieren
        router.push('/dashboard');
    }
}
</script>
