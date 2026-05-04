import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import Sidebar from '@/components/Sidebar.vue';
import SettingsView from '@/views/SettingsView.vue';
import TrackerView from '@/views/TrackerView.vue';
import ReportsView from '@/views/ReportsView.vue';
import ProjectSettingsView from '@/views/ProjectSettingsView.vue';
import InboxView from '@/views/InboxView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/register', component:RegisterView},
    {path: '/login', component: LoginView},
    {
        path: '/dashboard', 
        component: DashboardView,
        children: [
            { path: '/tracker', component: TrackerView },
            { path: '/reports', component: ReportsView },
            { path: '/project-settings', component: ProjectSettingsView },
            { path: '/inbox', component: InboxView, meta: { modal: true}},
            { path: '/settings', component: SettingsView },
        ]
    },
    {path: '/sidebar', component: Sidebar}
  ],
})

export default router
