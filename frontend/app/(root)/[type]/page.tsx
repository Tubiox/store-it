"use client";

import React, { useEffect, useState } from "react";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { fetchWithAuth } from "@/lib/api";

const Page = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const data = await fetchWithAuth("/files");

        const documents = data?.documents || [];
        const normalized = documents.map((file: any) => ({
          ...file,
          name: file.filename,
          extension: file.filename?.split(".").pop(),
          size: file.file_size,
          url: undefined,
          $createdAt: file.uploaded_at,
          $updatedAt: file.uploaded_at,
          owner: { fullName: "You" },
          users: [],
        }));

        setFiles(normalized);
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">Your Files</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{files.length}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">
              Sort by:
            </p>
            <Sort />
          </div>
        </div>
      </section>

      {loading ? (
        <p className="empty-list">Loading...</p>
      ) : files && files.length > 0 ? (
        <section className="file-list">
          {files.map((file: any) => (
            <Card key={file._id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;