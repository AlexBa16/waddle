import { createRouter, createWebHistory } from "vue-router";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import SettingsView from "@/views/SettingsView.vue";
import TrackerView from "@/views/TrackerView.vue";
import EntryView from "@/views/EntryView.vue";
import ReportsView from "@/views/ReportsView.vue";
import ProjectSettingsView from "@/views/ProjectSettingsView.vue";
import InboxView from "@/views/InboxView.vue";
import OnboardingView from "@/views/OnboardingView.vue";

import { useProjectStore } from "@/stores/project";

const PROTECTED_ROUTES = [
    "/dashboard/tracker",
    "/dashboard/entrys",
    "/dashboard/reports",
    "/dashboard/project-settings",
    "/dashboard/inbox",
    "/dashboard/settings",
    "/dashboard/onboarding",
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/register", component: RegisterView },
        { path: "/login", component: LoginView },
        { path: "/", redirect: "/dashboard" },
        {
            path: "/dashboard",
            component: DashboardView,
            meta: { requiresAuth: true },
            children: [
                {
                    path: "",
                    name: "dashboard-home",
                    component: { render: () => null },
                },
                { path: "onboarding", component: OnboardingView },
                { path: "tracker", component: TrackerView },
                { path: "entrys", component: EntryView },
                { path: "reports", component: ReportsView },
                { path: "project-settings", component: ProjectSettingsView },
                { path: "inbox", component: InboxView, meta: { modal: true } },
                { path: "settings", component: SettingsView },
            ],
        },
        {
            path: "/:pathMatch(.*)*",
            redirect: "/dashboard",
        },
    ],
});

router.beforeEach(async (to) => {
    const token = localStorage.getItem("token");

    if (!token && to.path !== "/login" && to.path !== "/register") {
        return { path: "/login" };
    }

    if (token) {
        const projectStore = useProjectStore();

        if (projectStore.projects.length === 0) {
            if (!projectStore.loading) {
                await projectStore.loadProjects();
            } else {
                while (projectStore.loading) {
                    await new Promise((resolve) => setTimeout(resolve, 50));
                }
            }
        }

        const hasProject =
            projectStore.projects && projectStore.projects.length > 0;

        if (!hasProject && localStorage.getItem("lastSelectedProjectId")) {
            localStorage.removeItem("lastSelectedProjectId");
        }

        if (to.path === "/dashboard" || to.path === "/dashboard/") {
            return hasProject
                ? { path: "/dashboard/tracker" }
                : { path: "/dashboard/onboarding" };
        }

        if (
            !hasProject &&
            to.path !== "/dashboard/onboarding" &&
            to.path !== "/dashboard/settings" &&
            to.path !== "/dashboard/inbox"
        ) {
            return { path: "/dashboard/onboarding" };
        }

        if (hasProject && to.path === "/dashboard/onboarding") {
            return { path: "/dashboard/tracker" };
        }
    }
});

export default router;
