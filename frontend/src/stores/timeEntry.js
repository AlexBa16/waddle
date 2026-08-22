import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

export const useTimeEntryStore = defineStore("timeEntry", () => {
    const entries = ref([]);
    const myEntries = ref([]);
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

    async function fetchByUser() {
        loading.value = true;
        error.value = null;
        try {
            const res = await fetch("https://localhost/api/time-entries", {
                headers: authHeaders(),
            });
            myEntries.value = await handleResponse(res);
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchByProject(projectId) {
        loading.value = true;
        error.value = null;
        try {
            const res = await fetch(
                `https://localhost/api/projects/${projectId}/time-entries`,
                { headers: authHeaders() },
            );
            if (res.status === 403) {
                entries.value = [];
                return;
            }
            entries.value = await handleResponse(res);
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchByUserAndProject(projectId) {
        loading.value = true;
        error.value = null;
        try {
            const res = await fetch(
                `https://localhost/api/projects/${projectId}/time-entries/mine`,
                { headers: authHeaders() },
            );
            myEntries.value = await handleResponse(res);
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function save(projectId, description, startTime, endTime) {
        error.value = null;
        try {
            const res = await fetch("https://localhost/api/time-entries", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    projectId,
                    description,
                    startTime,
                    endTime,
                }),
            });
            const entry = await handleResponse(res);
            entries.value.unshift(entry);
            return entry;
        } catch (e) {
            error.value = e.message;
        }
    }

    async function update(id, data) {
        error.value = null;
        try {
            const res = await fetch(
                `https://localhost/api/time-entries/${id}`,
                {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify(data),
                },
            );
            const updated = await handleResponse(res);

            const index = entries.value.findIndex((e) => e.id === id);
            if (index !== -1) entries.value[index] = updated;

            const myIndex = myEntries.value.findIndex((e) => e.id === id); // ← add
            if (myIndex !== -1) myEntries.value[myIndex] = updated; // ← add

            return updated;
        } catch (e) {
            error.value = e.message;
        }
    }

    async function remove(id) {
        error.value = null;
        try {
            const res = await fetch(
                `https://localhost/api/time-entries/${id}`,
                {
                    method: "DELETE",
                    headers: authHeaders(),
                },
            );
            await handleResponse(res);

            entries.value = entries.value.filter((e) => e.id !== id);
            myEntries.value = myEntries.value.filter((e) => e.id !== id); // ← add
        } catch (e) {
            error.value = e.message;
        }
    }

    const memberSummary = ref([]);

    function computeMemberSummary() {
        const map = {};

        for (const entry of entries.value) {
            const uid = entry.trackedBy?.id;
            if (!uid) continue;

            const start = new Date(entry.startTime);
            const end = new Date(entry.endTime);
            const duration = (end - start) / 1000 / 60;

            if (!map[uid]) {
                map[uid] = {
                    userId: uid,
                    username: entry.trackedBy.username,
                    totalDuration: 0,
                };
            }
            map[uid].totalDuration += duration;
        }

        memberSummary.value = Object.values(map);
        return memberSummary.value;
    }
    async function fetchProjectSummary(projectId) {
        await fetchByProject(projectId);
        return computeMemberSummary();
    }

    return {
        entries,
        myEntries,
        loading,
        error,
        fetchByUser,
        fetchByProject,
        fetchProjectSummary,
        fetchByUserAndProject,
        save,
        update,
        remove,
    };
});
