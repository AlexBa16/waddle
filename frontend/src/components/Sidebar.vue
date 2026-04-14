<template>
    <!-- Mobile toggle button -->
    <button class="md:hidden fixed top-4 left-4 z-50 bg-indigo-400 text-white px-3 py-2 rounded-lg shadow"
        @click="isOpen = !isOpen">
        ☰
    </button>

    <!-- Overlay (mobile only) -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="isOpen = false" />

    <!-- Sidebar -->
    <div class="fixed md:static top-0 left-0 h-full z-50 transform transition-all duration-300
         p-6 w-72 sm:w-80 md:w-64 lg:w-72 flex flex-col" :class="[
            isOpen
                ? 'translate-x-0 bg-slate-300 dark:bg-slate-700'
                : '-translate-x-full md:translate-x-0 bg-slate-200 dark:bg-slate-600',

            // Darker variant ONLY on mobile when open
            isOpen ? 'md:bg-slate-200 md:dark:bg-slate-600' : ''
        ]">
        <!-- Logo -->
        <div class="flex items-center gap-4 justify-center mb-8">
            <img :src="LogoLight" class="w-10 dark:hidden" />
            <img :src="LogoDark" class="w-10 hidden dark:block" />
            <span class="text-3xl lg:text-4xl font-bold text-slate-700 dark:text-orange-50">
                Waddle
            </span>
        </div>

        <!-- Dropdown -->
        <Dropdown v-model="selectedProject" :options="projects" @create="showCreateForm = true" />

        <CreateProjectForm v-model="showCreateForm" @create="handleProjectCreated" />

        <!-- Nav -->
        <nav class="mt-6 flex flex-col gap-1">
            <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 px-4 py-2 rounded-lg text-sm lg:text-base
                 text-slate-700 dark:text-orange-50
                 hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                active-class="bg-slate-300 dark:bg-slate-500 font-semibold">
                <img :src="item.iconPath" class="w-5 h-5" />
                <span>{{ item.label }}</span>
            </RouterLink>
        </nav>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import LogoLight from '@/assets/logo-light.svg'
import LogoDark from '@/assets/logo-dark.svg'
import Dropdown from '@/components/Dropdown.vue'
import CreateProjectForm from '@/components/CreateProjectForm.vue'
import SettingsIcon from '@/assets/SidebarIcons/settings.svg'

const isOpen = ref(false)

const projects = ref([])
const selectedProject = ref(null)
const showCreateForm = ref(false)

const navItems = [
    { label: 'Settings', iconPath: SettingsIcon, to: '/settings' }
]

function handleProjectCreated(data) {
    const newProject = { id: Date.now(), ...data }
    projects.value.push(newProject)
    selectedProject.value = newProject.id
}
</script>