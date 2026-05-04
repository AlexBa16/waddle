<template>
    <div class="p-8">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-slate-700 dark:text-orange-50">Posteingang</h1>
            <button @click="$router.back()"
                class="p-2 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600">
                <img :src="BackIcon" alt="Zurück" class="w-5 h-5 dark:invert" />
            </button>
        </div>
        <div class="flex flex-col gap-4">
            <Message v-for="message in messages" :key="message.id" :message="message" @accept="acceptInvitation"
                @decline="declineInvitation" />
        </div>
    </div>
</template>

<script setup>
import BackIcon from '@/assets/go-back.svg'
import Message from '@/components/Message.vue'
//TODO: Nachrichten von Backend laden und in messages speichern
const messages = [
    { id: 1, author: 'Alice', project: 'Projekt A' },
    { id: 2, author: 'Bob', project: 'Projekt B' },
    { id: 3, author: 'Charlie', project: 'Projekt C' }
]
// TODO: Nachrichten von Backend laden und in messages speichern
function acceptInvitation(id) {
    console.log(`Einladung mit ID ${id} akzeptiert`)
    // Hier kannst du die Logik zum Akzeptieren der Einladung implementieren
}

//TODO: Funktion zum Ablehnen der Einladung implementieren
function declineInvitation(id) {
    console.log(`Einladung mit ID ${id} abgelehnt`)
    // Hier kannst du die Logik zum Ablehnen der Einladung implementieren
}
</script>
