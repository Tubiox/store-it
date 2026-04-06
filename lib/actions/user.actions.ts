"use server";

import { redirect } from "next/navigation";

export const getCurrentUser = async () => {
  // Mock data as fallback. Connect this to your python backend later.
  return {
    $id: "dummy-id",
    accountId: "dummy-account-id",
    fullName: "User",
    email: "user@example.com",
    avatar: "https://i.pravatar.cc/150",
  };
};

export const signOutUser = async () => {
  // Connect this to your python backend or handle token clearing
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
