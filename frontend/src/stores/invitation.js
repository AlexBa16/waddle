import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

export const useInvitationStore = defineStore("invitation", () => {
    const received = ref([]);
    const loading = ref(false);
    const error = ref(null);

    function authHeaders() {
        const auth = useAuthStore();
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
        };
    }

    async function handleResponse(res) {
        if (res.status === 204) return null;
        const body = await res.json();
        if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
        return body;
    }

    // Eigene Einladungen laden (Inbox)
    async function loadReceived() {
        loading.value = true;
        error.value = null;
        try {
            const res = await fetch("https://localhost/api/invitations", {
                headers: authHeaders(),
            });
            received.value = await handleResponse(res);
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    // User suchen
    async function searchUsers(query) {
        if (query.length < 2) return [];
        const res = await fetch(
            `https://localhost/api/users/search?q=${encodeURIComponent(query)}`,
            { headers: authHeaders() },
        );
        return await handleResponse(res);
    }

    // Einladung senden
    async function invite(projectId, userId) {
        const res = await fetch(
            `https://localhost/api/projects/${projectId}/invite`,
            {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ userId }),
            },
        );
        return await handleResponse(res);
    }

    // Einladung annehmen oder ablehnen
    async function respond(invitationId, action) {
        const res = await fetch(
            `https://localhost/api/invitations/${invitationId}/respond`,
            {
                method: "PATCH",
                headers: authHeaders(),
                body: JSON.stringify({ action }),
            },
        );
        const result = await handleResponse(res);
        // Aus der Liste entfernen nach Antwort
        received.value = received.value.filter((i) => i.id !== invitationId);
        return result;
    }

    async function fetchMembers(projectId) {
        const res = await fetch(
            `https://localhost/api/projects/${projectId}/members`,
            { headers: authHeaders() },
        );
        return await handleResponse(res);
    }

    async function removeMember(projectId, invitationId) {
        const res = await fetch(
            `https://localhost/api/projects/${projectId}/members/${invitationId}`,
            { method: "DELETE", headers: authHeaders() },
        );
        return await handleResponse(res);
    }

    return {
        received,
        loading,
        error,
        loadReceived,
        searchUsers,
        invite,
        respond,
        fetchMembers,
        removeMember,
    };
});
