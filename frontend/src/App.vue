<script setup>
import { useProjectStore } from "@/stores/project";
import { useAuthStore } from "@/stores/auth";
import { watch } from "vue";

const auth = useAuthStore();
const projects = useProjectStore();

watch(
    () => auth.isLoggedIn,
    async (loggedIn) => {
        if (loggedIn) await projects.loadProjects();
    },
    { immediate: true },
);
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
