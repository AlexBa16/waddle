<template>
    <div class="bg-slate-200 h-screen w-1/4 p-10 dark:bg-slate-600">
      <div class="logo-section flex flex-row items-center gap-6 justify-center mb-10">
        <img :src="LogoLight" alt="Waddle Logo" class="w-12 h-auto dark:hidden" />
        <img :src="LogoDark" alt="Waddle Logo" class="w-12 h-auto hidden dark:block" />
        <span class="text-5xl pop-reg font-bold text-slate-700 dark:text-orange-50">Waddle</span>
      </div>
  
      <Dropdown
        v-model="selectedProject"
        :options="projects"
        @create="showCreateForm = true"
      />
  
      <CreateProjectForm
        v-model="showCreateForm"
        @create="handleProjectCreated"
      />
    </div>
  </template>
  
  <script setup>
  import LogoLight from '@/assets/logo-light.svg'
  import LogoDark from '@/assets/logo-dark.svg'
  import Dropdown from '@/components/Dropdown.vue'
  import CreateProjectForm from '@/components/CreateProjectForm.vue'
  import { ref } from 'vue'
  
  const projects = ref([
  ])
  
  const selectedProject = ref(null)
  const showCreateForm = ref(false)
  
  // TODO: Replace with actual backend dml to create project in db
  function handleProjectCreated(data) {
    const newProject = { id: Date.now(), ...data }
    projects.value.push(newProject)
    selectedProject.value = newProject.id
  }
  </script>