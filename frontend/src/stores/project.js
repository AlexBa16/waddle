import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const BASE = "https://localhost";

export const useProjectStore = defineStore('project', () => {
    const projects   = ref([])
    const selectedId = ref(null)
    const loading    = ref(false)
    const error      = ref(null)

    const selected = computed(
        () => projects.value.find(p => p.id === selectedId.value) ?? null
    )

    function authHeaders() {
        const auth = useAuthStore()
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
        }
    }

    async function handleResponse(res) {
        if (res.status === 204) return null
        const body = await res.json()
        if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`)
        return body
    }

    async function loadProjects() {
        loading.value = true
        error.value   = null
        try {
            const res = await fetch(`${BASE}/api/projects`, { headers: authHeaders() })
            projects.value = await handleResponse(res)
            if (!selectedId.value && projects.value.length > 0) {
                selectedId.value = projects.value[0].id
            }
        } catch (e) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    async function createProject(formData) {
        error.value = null
        const res = await fetch(`${BASE}/api/projects`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(formData),
        })
        const created = await handleResponse(res)
        projects.value.unshift(created)
        selectedId.value = created.id
        return created
    }

    async function removeProject(id) {
        const res = await fetch(`${BASE}/api/projects/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        })
        await handleResponse(res)
        projects.value = projects.value.filter(p => p.id !== id)
        if (selectedId.value === id) {
            selectedId.value = projects.value[0]?.id ?? null
        }
    }

    function selectProject(id) {
        selectedId.value = id
    }

    return {
        projects, selectedId, selected,
        loading, error,
        loadProjects, createProject, removeProject, selectProject,
    }
})