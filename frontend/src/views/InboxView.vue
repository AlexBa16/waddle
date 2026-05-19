<template>
  <div class="px-4 py-6 sm:px-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-700 dark:text-orange-50">
        {{ t('nav.inbox.description') }}
        <span
          v-if="invitationStore.received.length"
          class="ml-2 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5"
        >
          {{ invitationStore.received.length }}
        </span>
      </h1>
      <button
        @click="$router.back()"
        class="p-2 cursor-pointer rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
        :title="t('nav.inbox.close')"
      >
        <img :src="BackIcon" alt="Zurück" class="w-5 h-5 dark:hidden" />
        <img :src="BackIconDark" alt="Zurück" class="w-5 h-5 hidden dark:block" />
      </button>
    </div>

    <!-- Loading -->
    <div v-if="invitationStore.loading" class="flex justify-center py-16">
      <svg class="w-6 h-6 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="invitationStore.received.length === 0"
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
        v-for="invitation in invitationStore.received"
        :key="invitation.id"
        :message="{
          id: invitation.id,
          author: invitation.invitedBy,
          project: invitation.project.name,
        }"
        @accept="acceptInvitation"
        @decline="declineInvitation"
      />
    </div>

    <!-- Error -->
    <p v-if="invitationStore.error" class="text-sm text-red-500 text-center mt-4">
      {{ invitationStore.error }}
    </p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import BackIcon from '@/assets/Inbox/light/go-back.svg'
import BackIconDark from '@/assets/Inbox/dark/go-back.svg'
import Message from '@/components/Message.vue'
import { useI18n } from 'vue-i18n'
import { useInvitationStore } from '@/stores/invitation'
import { useProjectStore } from '@/stores/project'


const { t } = useI18n()
const invitationStore = useInvitationStore()
const projectStore = useProjectStore()

onMounted(() => invitationStore.loadReceived())

async function acceptInvitation(id) {
  await invitationStore.respond(id, 'accept'),
  await projectStore.loadProjects();
}

async function declineInvitation(id) {
  await invitationStore.respond(id, 'decline')
}
</script>