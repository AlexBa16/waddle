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
                { path: "", name: "dashboard-home", component: { render: () => null } },
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
    
    // 1. Uneingeloggt -> Immer zu Login (außer Register)
    if (!token && to.path !== "/login" && to.path !== "/register") {
        return { path: "/login" };
    }

    // Logik für eingeloggte User
    if (token) {
        const projectStore = useProjectStore();

        // WICHTIG: Wenn der Store lädt oder noch leer ist, lade die Projekte 
        // und warte, bis die API-Antwort wirklich im Store angekommen ist.
        if (projectStore.projects.length === 0) {
            // Falls noch gar nicht geladen wird, Ladevorgang starten
            if (!projectStore.loading) {
                await projectStore.loadProjects();
            } else {
                // Falls der Store schon von woanders getriggert wurde und lädt,
                // warten wir hier, bis "loading" wieder false ist.
                while (projectStore.loading) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        // Erst JETZT, nachdem das `await` komplett durch ist, bestimmen wir den finalen Zustand!
        const hasProject = projectStore.projects && projectStore.projects.length > 0;

        // Falls der LocalStorage lügt: Löschen!
        if (!hasProject && localStorage.getItem("lastSelectedProjectId")) {
            localStorage.removeItem("lastSelectedProjectId");
        }

        // Falls man direkt auf /dashboard landet
        if (to.path === "/dashboard" || to.path === "/dashboard/") {
            return hasProject 
                ? { path: "/dashboard/tracker" } 
                : { path: "/dashboard/onboarding" };
        }

        // 2. Eingeloggt, aber kein Projekt -> Darf NUR Onboarding, Settings oder Inbox sehen
        if (!hasProject && to.path !== "/dashboard/onboarding" && to.path !== "/dashboard/settings" && to.path !== "/dashboard/inbox") {
            return { path: "/dashboard/onboarding" };
        }

        // 3. Eingeloggt und hat Projekt -> Darf nicht mehr aufs Onboarding
        if (hasProject && to.path === "/dashboard/onboarding") {
            return { path: "/dashboard/tracker" };
        }
    }
});

export default router;
