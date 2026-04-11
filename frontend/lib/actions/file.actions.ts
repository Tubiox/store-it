/*"use server";

import { cookies } from "next/headers";

const BACKEND_URL = "http://127.0.0.1:8000";

// UPLOAD FILE
export const uploadFile = async (params: { file: File }) => {
const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("file", params.file);

  const res = await fetch(`${BACKEND_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Upload failed");
  }

  return data;
};

// GET FILES
export const getFiles = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("NO TOKEN FOUND");
    return { documents: [], total: 0 };
  }

  const res = await fetch("http://localhost:8000/files", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
    },
    cache: "no-store",
  });

  const data = await res.json();

  console.log("FILES API RESPONSE:", data);

  if (!res.ok) {
    console.log("FILES ERROR:", data);
    return { documents: [], total: 0 };
  }

  return {
    documents: data,
    total: data.length,
  };
};

// DELETE FILE (optional later)
export const deleteFile = async (fileId: string) => {

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${BACKEND_URL}/delete/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Delete failed");
  }

  return { status: "success" };
};
*/