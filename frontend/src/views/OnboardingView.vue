<template>
    <div class="flex flex-col items-center justify-start max-w-3xl min-h-full px-10 py-16 mx-auto">

        <!-- Header -->
        <div class="w-full mb-12">
            <div class="flex items-center gap-4 mb-3">
                <img :src="LogoLight" class="w-10 h-auto dark:hidden" />
                <img :src="LogoDark" class="hidden w-10 h-auto dark:block" />
                <h1 class="text-3xl font-bold pop-reg text-slate-700 dark:text-orange-50">
                    {{ t('onboarding.welcome') }}
                </h1>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-300 ml-14">
                {{ t('onboarding.subtitle') }}
            </p>
        </div>

        <!-- Start section -->
        <div class="w-full mb-10">
            <h2 class="mb-4 text-xs font-semibold tracking-widest uppercase text-slate-400">
                {{ t('onboarding.start') }}
            </h2>
            <div class="flex flex-col gap-2">
                <button @click="showCreateForm = true"
                    class="flex items-center gap-4 px-5 py-4 rounded-xl bg-[#dde3ef] dark:bg-slate-700 hover:bg-[#cdd4e3] dark:hover:bg-slate-600 transition-colors text-left group">
                    <span class="flex items-center justify-center w-8 h-8 text-indigo-500 rounded-lg bg-indigo-400/20 dark:text-indigo-300 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </span>
                    <div class="cursor-pointer">
                        <p class="text-sm font-semibold text-slate-700 dark:text-orange-50">{{ t('onboarding.createProject') }}</p>
                        <p class="text-xs text-slate-400 dark:text-slate-300 mt-0.5">{{ t('onboarding.createProjectDesc') }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto transition-colors text-slate-300 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Configure section -->
        <div class="w-full mb-10">
            <h2 class="mb-4 text-xs font-semibold tracking-widest uppercase text-slate-400">
                {{ t('onboarding.configure') }}
            </h2>
            <div class="flex flex-col gap-2">
                <RouterLink to="/settings"
                    class="flex items-center gap-4 px-5 py-4 rounded-xl bg-[#dde3ef] dark:bg-slate-700 hover:bg-[#cdd4e3] dark:hover:bg-slate-600 transition-colors group">
                    <span class="flex items-center justify-center w-8 h-8 text-indigo-500 rounded-lg bg-indigo-400/20 dark:text-indigo-300 shrink-0">
                        <img :src="SettingsIconLight" class="w-4 h-4 dark:hidden" />
                        <img :src="SettingsIconDark" class="hidden w-4 h-4 dark:block" />
                    </span>
                    <div>
                        <p class="text-sm font-semibold text-slate-700 dark:text-orange-50">{{ t('onboarding.settings') }}</p>
                        <p class="text-xs text-slate-400 dark:text-slate-300 mt-0.5">{{ t('onboarding.settingsDesc') }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto transition-colors text-slate-300 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </RouterLink>

                <RouterLink to="/inbox"
                    class="flex items-center gap-4 px-5 py-4 rounded-xl bg-[#dde3ef] dark:bg-slate-700 hover:bg-[#cdd4e3] dark:hover:bg-slate-600 transition-colors group">
                    <span class="flex items-center justify-center w-8 h-8 text-indigo-500 rounded-lg bg-indigo-400/20 dark:text-indigo-300 shrink-0">
                        <img :src="InboxIconLight" class="w-4 h-4 dark:hidden" />
                        <img :src="InboxIconDark" class="hidden w-4 h-4 dark:block" />
                    </span>
                    <div>
                        <p class="text-sm font-semibold text-slate-700 dark:text-orange-50">{{ t('onboarding.inbox') }}</p>
                        <p class="text-xs text-slate-400 dark:text-slate-300 mt-0.5">{{ t('onboarding.inboxDesc') }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto transition-colors text-slate-300 group-hover:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </RouterLink>
            </div>
        </div>

        <CreateProjectForm v-model="showCreateForm" @create="handleCreate" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '@/stores/project'
import LogoLight from '@/assets/logo-light.svg'
import LogoDark from '@/assets/logo-dark.svg'
import SettingsIconLight from '@/assets/SidebarIcons/light/settings.svg'
import SettingsIconDark from '@/assets/SidebarIcons/dark/settings.svg'
import InboxIconLight from '@/assets/SidebarIcons/light/inbox.svg'
import InboxIconDark from '@/assets/SidebarIcons/dark/inbox.svg'
import CreateProjectForm from '@/components/CreateProjectForm.vue'

const { t } = useI18n()
const projectStore = useProjectStore()
const showCreateForm = ref(false)

async function handleCreate(formData) {
    try {
        await projectStore.createProject(formData)
    } catch (e) {
        console.error(e.message)
    }
}
</script>
