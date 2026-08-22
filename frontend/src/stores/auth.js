import {defineStore} from "pinia";
import {ref, computed} from "vue";
import {useInvitationStore} from "@/stores/invitation";
import {apiFetch} from "@/lib/api";

export const useAuthStore = defineStore("auth", () => {
    const token = ref(localStorage.getItem("token") ?? null);
    const username = ref(localStorage.getItem("username") ?? null);

    const isLoggedIn = computed(() => !!token.value);

    // function authHeaders() {
    //     return {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token.value}`,
    //     };
    // }
    //
    // async function handleResponse(res) {
    //     if (res.status === 204) return null;
    //     const body = await res.json();
    //     if (!res.ok) {
    //         if (body?.errors) {
    //             const messages = Object.values(body.errors).join(", ");
    //             throw new Error(messages);
    //         }
    //         throw new Error(body?.error ?? `HTTP ${res.status}`);
    //     }
    //     return body;
    // }

    function setToken(newToken) {
        token.value = newToken;
        localStorage.setItem("token", newToken);

        const invitationStore = useInvitationStore();
        invitationStore.init();
    }

    function setUsername(newUsername) {
        username.value = newUsername;
        localStorage.setItem("username", newUsername);
    }

    function logout() {
        token.value = null;
        username.value = null;
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        const invitationStore = useInvitationStore();
        invitationStore.reset();
    }

    async function updateUsername(newUsername) {
        const updated = await apiFetch("/api/user/username", {
            method: "PATCH",
            body: JSON.stringify({username: newUsername}),
        });
        setUsername(updated.username);
        return updated;
    }

    async function updatePassword(password, passwordConfirm) {
        // const res = await fetch("https://localhost/api/user/password", {
        //     method: "PATCH",
        //     headers: authHeaders(),
        //     body: JSON.stringify({password, passwordConfirm}),
        // });
        // return await handleResponse(res); // null (204)

        return await apiFetch("/api/user/password", {
            method: "PATCH",
            body: JSON.stringify({password, passwordConfirm}),
        });
    }

    function getUsername() {
        return username.value;
    }

    return {
        token,
        username,
        isLoggedIn,
        setToken,
        setUsername,
        logout,
        updateUsername,
        updatePassword,
        getUsername,
    };
});
