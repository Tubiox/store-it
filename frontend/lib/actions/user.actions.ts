/* "use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const BACKEND_URL = "http://127.0.0.1:8000";

// =======================
// GET CURRENT USER
// =======================
export const getCurrentUser = async () => {
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
};

// =======================
// SIGN IN
// =======================
export const signInUser = async (params: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  //  Save token in cookie
  const cookieStore = await cookies();

cookieStore.set("token", data.access_token, {
  httpOnly: false,
  path: "/",
});
  return data;
};

// =======================
// SIGN UP
// =======================
export const createAccount = async (params: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Signup failed");
  }

  return data;
};

// SIGN OUT

export async function signOutUser() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    path: "/",
    maxAge: 0,
  });
}
  */