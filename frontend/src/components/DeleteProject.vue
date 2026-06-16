<template>
    <div
        class="flex w-1/2 gap-6 px-6 py-5 mt-5 mb-3 bg-[#dde3ef] dark:bg-slate-600 dark:placeholder-indigo-50 dark:border-slate-400 rounded-2xl shadow-md shadow-black/10 flex-row items-center justify-between"
    >
        <div class="flex items-center gap-3 shrink-0">
            <span
                class="text-sm font-bold tracking-wide text-slate-800 dark:text-orange-50"
            >
                {{ t("nav.projectSettings.deleteProject.description") }}
            </span>
        </div>
        <button
            class="font-medium transition-all duration-200 bg-red-500 shadow-lg cursor-pointer text-orange-50 sm:px-5 lg:px-10 sm:py-4 rounded-xl sm:rounded-2xl sm:text-base lg:text-md hover:bg-red-600"
            @click="confirmOpen = true"
        >
            {{ t("nav.projectSettings.deleteProject.button") }}
        </button>

        <ConfirmModal
            v-model="confirmOpen"
            :title="t('nav.projectSettings.deleteProject.confirmTitle')"
            :message="t('nav.projectSettings.deleteProject.confirmMessage')"
            :confirm-text="t('nav.projectSettings.deleteProject.button')"
            :cancel-text="t('nav.projectSettings.deleteProject.cancel')"
            @confirm="handleDelete(projectStore.selectedId)"
        />
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useProjectStore } from "@/stores/project.js";
import ConfirmModal from "./ConfirmModal.vue";

const router = useRouter();
const projectStore = useProjectStore();
const { t } = useI18n();

const confirmOpen = ref(false);

async function handleDelete(id) {
    await projectStore.removeProject(id);
    router.push("/dashboard");
}
</script>
