"use server";


import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const BACKEND_URL = "http://localhost:8000";

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

export const signOutUser = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/sign-in");
};

export const createAccount = async (params: any) => {
  return { accountId: "dummy-id" };
};

export const signInUser = async (params: any) => {
  return { accountId: "dummy-id" };
};

export const verifySecret = async (params: any) => {
  return { sessionId: "dummy-session-id" };
};

export const sendEmailOTP = async (params: any) => {
  return "dummy-id";
};
