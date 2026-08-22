<template>
    <button
        v-if="!isOpen"
        @click="isOpen = true"
        class="fixed z-50 p-2 transition-colors shadow-md cursor-pointer top-4 left-4 rounded-xl bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 lg:hidden"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-slate-700 dark:text-orange-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
            />
        </svg>
    </button>

    <Transition name="fade">
        <div
            v-if="isOpen"
            @click="isOpen = false"
            class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
    </Transition>

    <Transition name="slide">
        <div
            v-if="isOpen || isDesktop"
            class="fixed z-50 flex flex-col h-screen p-8 overflow-scroll shadow-xl lg:relative bg-slate-200 dark:bg-slate-600 w-72 lg:w-85 shrink-0 lg:shadow-none lg:overflow-auto"
        >
            <div class="flex items-center justify-between mb-10">
                <div class="flex items-center gap-4">
                    <img
                        :src="LogoLight"
                        alt="Waddle Logo"
                        class="w-10 h-auto dark:hidden shrink-0"
                    />
                    <img
                        :src="LogoDark"
                        alt="Waddle Logo"
                        class="hidden w-10 h-auto dark:block shrink-0"
                    />
                    <span
                        class="text-3xl font-bold pop-reg text-slate-700 dark:text-orange-50"
                    >Waddle</span>
                </div>
                <button
                    @click="isOpen = false"
                    class="p-1 transition-colors rounded-lg lg:hidden hover:bg-slate-300 dark:hover:bg-slate-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 cursor-pointer text-slate-700 dark:text-orange-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <p
                v-if="projectStore.loading"
                class="mb-4 text-sm text-center text-slate-400"
            >
                Projekte werden geladen…
            </p>
            <p
                v-else-if="projectStore.error"
                class="mb-4 text-sm text-center text-red-400"
            >
                {{ projectStore.error }}
            </p>

            <Dropdown
                :model-value="projectStore.selectedId"
                :options="projectStore.projects"
                @update:model-value="projectStore.selectProject($event)"
                @create="showCreateForm = true"
                :placeholder="t('nav.selectProject')"
                show-create-button
            />

            <CreateProjectForm
                v-model="showCreateForm"
                @create="handleCreate"
            />

            <nav class="flex flex-col gap-1 mt-6 mb-auto">
                <RouterLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    @click="isOpen = false"
                    class="flex items-center gap-3 px-4 py-3 transition-colors rounded-xl text-slate-700 dark:text-orange-50 hover:bg-slate-300 dark:hover:bg-slate-500"
                    active-class="font-semibold bg-slate-300 dark:bg-slate-500"
                >
                    <img
                        :src="item.iconPathLight"
                        alt=""
                        class="block w-5 h-5 shrink-0 dark:hidden"
                    />
                    <img
                        :src="item.iconPathDark"
                        alt=""
                        class="hidden w-5 h-5 shrink-0 dark:block"
                    />
                    <span class="text-sm">{{ item.label }}</span>
                </RouterLink>
            </nav>

            <nav class="flex flex-col gap-1 mt-4">
                <RouterLink
                    v-for="item in personalNavItems"
                    :key="item.to"
                    :to="item.to"
                    @click="isOpen = false"
                    class="flex items-center gap-3 px-4 py-3 transition-colors rounded-xl text-slate-700 dark:text-orange-50 hover:bg-slate-300 dark:hover:bg-slate-500"
                    active-class="font-semibold bg-slate-300 dark:bg-slate-500"
                >
                    <img
                        :src="item.iconPathLight"
                        alt=""
                        class="block w-5 h-5 shrink-0 dark:hidden"
                    />
                    <img
                        :src="item.iconPathDark"
                        alt=""
                        class="hidden w-5 h-5 shrink-0 dark:block"
                    />
                    <span class="text-sm">{{ item.label }}</span>
                    <span
                        v-if="item.badge"
                        class="ml-auto text-xs font-medium bg-red-500 text-white rounded-full px-2 py-0.5"
                    >
                        {{ t("nav.inbox.new") }}
                    </span>
                </RouterLink>
                <Profile class="mt-2" />
            </nav>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import LogoLight from "@/assets/logo-light.svg";
import LogoDark from "@/assets/logo-dark.svg";
import TrackerIconLight from "@/assets/SidebarIcons/light/tracker.svg";
import TrackerIconDark from "@/assets/SidebarIcons/dark/tracker.svg";
import EntryIconLight from "@/assets/SidebarIcons/light/entry.svg";
import EntryIconDark from "@/assets/SidebarIcons/dark/entry.svg";
import ReportIconLight from "@/assets/SidebarIcons/light/report.svg";
import ReportIconDark from "@/assets/SidebarIcons/dark/report.svg";
import ProjectSettingsIconLight from "@/assets/SidebarIcons/light/project-settings.svg";
import ProjectSettingsIconDark from "@/assets/SidebarIcons/dark/project-settings.svg";
import InboxIconLight from "@/assets/SidebarIcons/light/inbox.svg";
import InboxIconDark from "@/assets/SidebarIcons/dark/inbox.svg";
import SettingsIconLight from "@/assets/SidebarIcons/light/settings.svg";
import SettingsIconDark from "@/assets/SidebarIcons/dark/settings.svg";
import Dropdown from "@/components/Dropdown.vue";
import Profile from "@/components/Profile.vue";
import CreateProjectForm from "@/components/CreateProjectForm.vue";
import { useProjectStore } from "@/stores/project";
import { useInvitationStore } from "@/stores/invitation";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const projectStore = useProjectStore();
const invitationStore = useInvitationStore();
const authStore = useAuthStore();
const showCreateForm = ref(false);
const isOpen = ref(false);
const { t } = useI18n();
const hasPendingInvitations = computed(
    () => invitationStore.received.length > 0,
);

const windowWidth = ref(window.innerWidth);
const isDesktop = computed(() => windowWidth.value >= 1024);
const isAdmin = ref(false);

function onResize() {
    windowWidth.value = window.innerWidth;
    if (isDesktop.value) isOpen.value = false;
}

onMounted(() => window.addEventListener("resize", onResize));
onUnmounted(() => window.removeEventListener("resize", onResize));

watch(
    () => projectStore.selected,
    async (project) => {
        if (!project) {
            isAdmin.value = false
            return
        }
        try {
            const data = await invitationStore.fetchMembers(project.id)
            const currentUsername = authStore.getUsername()
            const me = (data || []).find(m => m.name === currentUsername)
            isAdmin.value = me?.isAdmin ?? false
        } catch {
            isAdmin.value = false
        }
    },
    { immediate: true }
)

const navItems = computed(() => {
    if (!projectStore.selectedId) return []
    const items = [
        { label: t('nav.tracker'), iconPathLight: TrackerIconLight, iconPathDark: TrackerIconDark, to: '/dashboard/tracker' },
        { label: t('nav.entrys'), iconPathLight: EntryIconLight, iconPathDark: EntryIconDark, to: '/dashboard/entrys' },
        { label: t('nav.reports.label'), iconPathLight: ReportIconLight, iconPathDark: ReportIconDark, to: '/dashboard/reports' },
    ]
    if (isAdmin.value) {
        items.push({ label: t('nav.projectSettings.description'), iconPathLight: ProjectSettingsIconLight, iconPathDark: ProjectSettingsIconDark, to: '/dashboard/project-settings' })
    }
    return items
})

const personalNavItems = computed(() => [
    {
        label: t("nav.inbox.description"),
        iconPathLight: InboxIconLight,
        iconPathDark: InboxIconDark,
        to: "/dashboard/inbox",
        badge: hasPendingInvitations.value,
    },
    {
        label: t("nav.settings.description"),
        iconPathLight: SettingsIconLight,
        iconPathDark: SettingsIconDark,
        to: "/dashboard/settings",
    },
]);

async function handleCreate(formData) {
    try {
        await projectStore.createProject(formData);
        router.push("/dashboard/tracker");
    } catch (e) {
        console.error(t("nav.createProject.error"), e.message);
    }
}

watch(
    () => [projectStore.loading, projectStore.projects],
    ([loading, projects]) => {
        if (loading || projects.length === 0) return;

        if (
            projectStore.selectedId &&
            projects.some((p) => p.id === projectStore.selectedId)
        )
            return;

        if (projects.length === 1) {
            projectStore.selectProject(projects[0].id);
            return;
        }

        const lastId = localStorage.getItem("lastSelectedProjectId");
        const match = projects.find((p) => p.id === lastId);
        projectStore.selectProject(match ? match.id : projects[0].id);
    },
    { immediate: true, deep: true },
);

watch(
    () => projectStore.selectedId,
    (id) => {
        if (id) {
            localStorage.setItem("lastSelectedProjectId", id);
            if (router.currentRoute.value.path === "/dashboard/onboarding") {
                router.push("/dashboard/tracker");
            }
        } else {
            localStorage.removeItem("lastSelectedProjectId");
        }
    },
);
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
