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

// Importiere deinen Pinia-Store
import { useProjectStore } from "@/stores/project";

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

    if (token && (to.path === "/login" || to.path === "/register")) {
        return { path: "/dashboard" };
    }

    // Logik für eingeloggte User
    if (token) {
        const projectStore = useProjectStore();

        // Falls die Projekte im Store noch gar nicht geladen wurden, warten wir kurz darauf.
        // Das verhindert, dass beim ersten Seiten-Refresh fälschlicherweise "0 Projekte" angenommen wird.
        if (!projectStore.projects || projectStore.projects.length === 0 && projectStore.loading) {
            // Falls du eine fetch-Methode im Store hast, kannst du sie hier awaiten, z.B.:
            // await projectStore.fetchProjects()
        }

        // Die Wahrheit liegt im Store, nicht im alten LocalStorage!
        const hasProject = projectStore.projects && projectStore.projects.length > 0;

        // Falls der LocalStorage lügt (z.B. ID steht noch drin, aber Store ist leer): Löschen!
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