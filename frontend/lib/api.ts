import { getCsrfToken } from "./auth";

const BASE_URL = "/api";

export const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const csrfToken = getCsrfToken();

    console.log("SENDING CSRF TOKEN:", csrfToken);

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.headers || {}),
            "X-CSRF-Token": csrfToken || "",
        },
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            window.location.href = "/sign-in";
        }
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
};