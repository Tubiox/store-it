const BASE_URL = "http://127.0.0.1:8000";

export const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem("token");

    console.log("SENDING TOKEN:", token);

    const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    const data = await res.json();

    console.log("API RESPONSE:", data);

    if (!res.ok) {
        if (res.status === 401) {
            window.location.href = "/sign-in";
        }
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
};