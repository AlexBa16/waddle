<template>
    <div class="bg-slate-200 h-screen w-1/4 p-10 dark:bg-slate-600">
        <div class="logo-section flex flex-row items-center gap-6 justify-center mb-10">
            <img :src="LogoLight" alt="Waddle Logo" class="w-12 h-auto dark:hidden" />
            <img :src="LogoDark" alt="Waddle Logo" class="w-12 h-auto hidden dark:block" />
            <span class="text-5xl pop-reg font-bold text-slate-700 dark:text-orange-50">Waddle</span>
        </div>

        <Dropdown v-model="selectedProject" :options="projects" @create="showCreateForm = true" />

        <CreateProjectForm v-model="showCreateForm" @create="handleCreate" />

        <!-- Nav links -->
        <nav class="mt-6 flex flex-col gap-1">
            <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
                class="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-orange-50 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                active-class="bg-slate-300 dark:bg-slate-500 font-semibold">
                <img :src="item.iconPath" alt="">
                <span>{{ item.label }}</span>
            </RouterLink>
        </nav>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import LogoLight from '@/assets/logo-light.svg'
import LogoDark  from '@/assets/logo-dark.svg'
import Dropdown          from '@/components/Dropdown.vue'
import CreateProjectForm from '@/components/CreateProjectForm.vue'
import { ref } from 'vue'

const projects = ref([
])

const selectedProject = ref(null)
const showCreateForm = ref(false)

const navItems = [
    { label: 'Settings', iconPath: '@/assets/login-icon.svg', to: '/settings' }
]

// TODO: Replace with actual backend dml to create project in db
function handleProjectCreated(data) {
    const newProject = { id: Date.now(), ...data }
    projects.value.push(newProject)
    selectedProject.value = newProject.id
}
</script>