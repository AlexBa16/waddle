import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";

export const useProjectStore = defineStore("project", () => {
    const projects = ref([]);
    const selectedId = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const selected = computed(
        () => projects.value.find((p) => p.id === selectedId.value) ?? null,
    );

    function authHeaders() {
        const auth = useAuthStore();
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
        };
    }

    async function handleResponse(res) {
        if (res.status === 401) {
            // Token is stale/invalid — wipe it and send to login
            const auth = useAuthStore();
            auth.logout();
            // Lazy import to avoid circular dependency
            const { default: router } = await import("@/router");
            router.push("/login");
            throw new Error("Unauthorized");
        }

        if (res.status === 204) return null;

        const text = await res.text();
        let body = null;
        try {
            body = text ? JSON.parse(text) : null;
        } catch {
            body = text;
        }

        if (!res.ok) {
            throw new Error(body?.error ?? body ?? `HTTP ${res.status}`);
        }

        return body;
    }

    async function loadProjects() {
        loading.value = true;
        error.value = null;
        try {
            const res = await fetch("https://localhost/api/projects", {
                headers: authHeaders(),
            });
            projects.value = await handleResponse(res);
            if (!selectedId.value && projects.value.length > 0) {
                selectedId.value = projects.value[0].id;
            }
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function createProject(formData) {
        error.value = null;
        const res = await fetch("https://localhost/api/projects", {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(formData),
        });
        const created = await handleResponse(res);
        projects.value.unshift(created);
        selectedId.value = created.id;
        return created;
    }

    async function updateProjectName(id, name) {
        error.value = null;
        const res = await fetch(`https://localhost/api/projects/${id}/name`, {
            method: "PATCH",
            headers: authHeaders(),
            body: JSON.stringify({ name }),
        });
        const updated = await handleResponse(res);
        const idx = projects.value.findIndex((p) => p.id === id);
        if (idx !== -1) projects.value[idx] = updated;
        return updated;
    }

    async function updateProjectDescription(id, description) {
        error.value = null;
        const res = await fetch(
            `https://localhost/api/projects/${id}/description`,
            {
                method: "PATCH",
                headers: authHeaders(),
                body: JSON.stringify({ description }),
            },
        );
        const updated = await handleResponse(res);
        const idx = projects.value.findIndex((p) => p.id === id);
        if (idx !== -1) projects.value[idx] = updated;
        return updated;
    }

    async function removeProject(id) {
        const res = await fetch(`https://localhost/api/projects/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        await handleResponse(res);
        projects.value = projects.value.filter((p) => p.id !== id);
        if (selectedId.value === id) {
            selectedId.value = projects.value[0]?.id ?? null;
        }
    }

    function selectProject(id) {
        selectedId.value = id;
    }

    return {
        projects,
        selectedId,
        selected,
        loading,
        error,
        loadProjects,
        createProject,
        removeProject,
        selectProject,
        updateProjectName,
        updateProjectDescription,
    };
});
