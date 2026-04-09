"use server";

import { revalidatePath } from "next/cache";

export const uploadFile = async (params: any) => {
  // Connect to Python backend instead of Appwrite
  // revalidatePath(params.path);
  return { status: "success" };
};

export const getFiles = async (params: any) => {
  // Return dummy data or fetch from Python backend
  return {
    documents: [],
    total: 0
  };
};

export const renameFile = async (params: any) => {
  // Connect to Python backend
  // revalidatePath(params.path);
  return { status: "success" };
};

export const updateFileUsers = async (params: any) => {
  // Connect to Python backend
  // revalidatePath(params.path);
  return { status: "success" };
};

export const deleteFile = async (params: any) => {
  // Connect to Python backend
  // revalidatePath(params.path);
  return { status: "success" };
};

export async function getTotalSpaceUsed() {
  // Connect to Python backend
  return {
    image: { size: 0, latestDate: "" },
    document: { size: 0, latestDate: "" },
    video: { size: 0, latestDate: "" },
    audio: { size: 0, latestDate: "" },
    other: { size: 0, latestDate: "" },
    used: 0,
    all: 2 * 1024 * 1024 * 1024,
  };
}
