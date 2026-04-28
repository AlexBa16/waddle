<template>
    <div class="flex h-screen overflow-hidden bg-orange-50">
        <Sidebar />
        <main class="flex-1 overflow-y-auto bg-orange-50 dark:bg-slate-800 " >
            <RouterView /> 
        </main>
    </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
</script>
