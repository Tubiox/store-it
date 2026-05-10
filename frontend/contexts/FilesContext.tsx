"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";

interface FileItem {
  _id: string;
  filename: string;
  content_type: string;
  size?: number;
  uploaded_at: string;
  owner_id?: string;
  storage_key?: string;
}

interface FilesContextValue {
  files: FileItem[];
  loading: boolean;
  fetchFiles: () => Promise<void>;
  addFile: (file: FileItem) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const FilesContext = createContext<FilesContextValue | null>(null);

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within FilesProvider");
  }
  return context;
};

export const FilesProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${window.location.origin}/api/auth/me`, {
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/files");
      setFiles(data?.documents || []);
    } catch (err) {
      console.error("Error fetching files:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const addFile = useCallback((file: FileItem) => {
    setFiles((prev) => [file, ...prev]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f._id !== id));
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<FileItem>) => {
    setFiles((prev) =>
      prev.map((f) => (f._id === id ? { ...f, ...updates } : f))
    );
  }, []);

  useEffect(() => {
    const init = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        fetchFiles();
      } else {
        setLoading(false);
      }
    };
    init();
  }, [checkAuth, fetchFiles, refreshKey]);

  return (
    <FilesContext.Provider
      value={{
        files,
        loading,
        fetchFiles,
        addFile,
        removeFile,
        updateFile,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};