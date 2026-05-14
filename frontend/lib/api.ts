import { getCsrfToken } from "./auth";

const BASE_URL = "http://localhost:8000";

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const csrfToken = getCsrfToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // CSRF (if exists)
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  // JSON header
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include", //critical
    headers,
  });

  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      window.location.href = "/sign-in";
    }

    throw new Error(data?.detail || "Request failed");
  }

  return data;
};

export const generateFileSummary = async (fileId: string) => {
  return fetchWithAuth(`/files/generate-summary/${fileId}`, {
    method: "POST",
  });
};