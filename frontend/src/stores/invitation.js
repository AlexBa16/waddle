import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import {apiFetch} from "@/lib/api.js";

export const useInvitationStore = defineStore("invitation", () => {
    const received = ref([]);
    const loading = ref(false);
    const error = ref(null);

    // function authHeaders() {
    //     const auth = useAuthStore();
    //     return {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${auth.token}`,
    //     };
    // }
    //
    // async function handleResponse(res) {
    //     if (res.status === 204) return null;
    //     const body = await res.json();
    //     if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
    //     return body;
    // }

    async function loadReceived() {
        loading.value = true;
        error.value = null;
        try {
            // const res = await fetch("https://localhost/api/invitations", {
            //     headers: authHeaders(),
            // });
            // received.value = await handleResponse(res);
            received.value = await apiFetch("/api/invitations", {
                method: "GET",
            });
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function searchUsers(query) {
        if (query.length < 2) return [];
        // const res = await fetch(
        //     `https://localhost/api/users/search?q=${encodeURIComponent(query)}`,
        //     { headers: authHeaders() },
        // );
        // return await handleResponse(res);
        return await apiFetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
            method: "GET",
        });
    }

    async function invite(projectId, userId) {
        // const res = await fetch(
        //     `https://localhost/api/projects/${projectId}/invite`,
        //     {
        //         method: "POST",
        //         headers: authHeaders(),
        //         body: JSON.stringify({ userId }),
        //     },
        // );
        // return await handleResponse(res);
        return await apiFetch(`/api/projects/${projectId}/invite`, {
            method: "POST",
            body: JSON.stringify({ userId }),
        });
    }

    async function respond(invitationId, action) {
        // const res = await fetch(
        //     `https://localhost/api/invitations/${invitationId}/respond`,
        //     {
        //         method: "PATCH",
        //         headers: authHeaders(),
        //         body: JSON.stringify({ action }),
        //     },
        // );
        // const result = await handleResponse(res);
        const result = await apiFetch(`/api/invitations/${invitationId}/respond`, {
            method: "PATCH",
            body: JSON.stringify({ action }),
        });
        received.value = received.value.filter((i) => i.id !== invitationId);
        return result;
    }

    async function fetchMembers(projectId) {
        // const res = await fetch(
        //     `https://localhost/api/projects/${projectId}/members`,
        //     { headers: authHeaders() },
        // );
        // if (res.status === 403) return [];
        // return await handleResponse(res);

        return await apiFetch(`/api/projects/${projectId}/members`, {
            method: "GET",
        });
    }

    async function removeMember(projectId, invitationId) {
        // const res = await fetch(
        //     `https://localhost/api/projects/${projectId}/members/${invitationId}`,
        //     { method: "DELETE", headers: authHeaders() },
        // );
        // return await handleResponse(res);

        return await apiFetch(`/api/projects/${projectId}/members/${invitationId}`, {
            method: "DELETE",
        });
    }

    function reset() {
        received.value = [];
        loading.value = false;
        error.value = null;
        initialized.value = false;
    }

    const initialized = ref(false);

    async function init() {
        const auth = useAuthStore();

        if (!auth.token) return;

        if (initialized.value) return;

        initialized.value = true;

        try {
            await loadReceived();
        } catch (e) {
            console.error(e);
        }
    }

    init();

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
        reset,
        init,
    };
});
