<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-700 dark:text-orange-50">
          {{ t('nav.inbox.description')}}
          <span
            v-if="messages.length"
            class="ml-2 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5"
          >
            {{ messages.length }}
          </span>
        </h1>
        <button
          @click="$router.back()"
          class="p-2 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Zurück"
        >
          <img :src="BackIcon" alt="Zurück" class="w-5 h-5 dark:hidden" />
          <img :src="BackIconDark" alt="Zurück" class="w-5 h-5 hidden dark:block" />
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-if="messages.length === 0"
        class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500"
      >
        <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p class="text-sm">{{ t('nav.inbox.noMessagesFound') }}</p>
      </div>

      <!-- Message list -->
      <div v-else class="flex flex-col gap-3 sm:gap-4">
        <Message
          v-for="message in messages"
          :key="message.id"
          :message="message"
          @accept="acceptInvitation"
          @decline="declineInvitation"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import BackIcon from '@/assets/Inbox/light/go-back.svg'
import BackIconDark from '@/assets/Inbox/dark/go-back.svg'
import Message from '@/components/Message.vue'
import { useI18n } from 'vue-i18n'

const {t} = useI18n()

// TODO: Nachrichten von Backend laden und in messages speichern
const messages = [
  { id: 1, author: 'Alice', project: 'Projekt A' },
  { id: 2, author: 'Bob', project: 'Projekt B' },
  { id: 3, author: 'Charlie', project: 'Projekt C' }
]

function acceptInvitation(id) {
  console.log(`Einladung mit ID ${id} akzeptiert`)
}

function declineInvitation(id) {
  console.log(`Einladung mit ID ${id} abgelehnt`)
}
</script>
