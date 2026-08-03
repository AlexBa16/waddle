const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (res.status === 401) {
        // token expired/invalid — force re-login rather than surfacing a confusing error
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login";
        return;
    }

    if (res.status === 204) return null;
    if (res.status === 403) return [];

    const body = await res.json().catch(() => null);
    if (!res.ok) {
        const messages = body?.errors ? Object.values(body.errors).join(", ") : (body?.error ?? `HTTP ${res.status}`);
        throw new Error(messages);
    }
    return body;
}
