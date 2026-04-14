import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import Sidebar from '@/components/Sidebar.vue';
import SettingsView from '@/views/SettingsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/register', component:RegisterView},
    {path: '/login', component: LoginView},
    {
        path: '/dashboard', 
        component: DashboardView,
        children: [
            {path: '/settings', component: SettingsView}
        ]
    },
    {path: '/sidebar', component: Sidebar}
  ],
})

export default router
