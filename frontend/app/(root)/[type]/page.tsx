"use client";

import React, { useEffect, useState } from "react";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { fetchWithAuth } from "@/lib/api";
import { useParams } from "next/navigation";

const Page = () => {
  const { type } = useParams();

  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    try {
      setLoading(true);

      const endpoint = type ? `/files?type=${type}` : "/files";

      const data = await fetchWithAuth(endpoint);

      setFiles(data?.documents || []);
    } catch (err) {
      console.error("Error fetching files:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, [type]);

  //  FILTER LOGIC
  const filteredFiles = files.filter((file) => {
    if (type === "images") {
      return file.content_type?.startsWith("image");
    }

    if (type === "documents") {
      return (
        file.content_type?.includes("pdf") ||
        file.content_type?.includes("word") ||
        file.content_type?.includes("text")
      );
    }

    if (type === "media") {
      return (
        file.content_type?.startsWith("video") ||
        file.content_type?.startsWith("audio")
      );
    }

    if (type === "others") {
      return !(
        file.content_type?.startsWith("image") ||
        file.content_type?.startsWith("video") ||
        file.content_type?.startsWith("audio") ||
        file.content_type?.includes("pdf")
      );
    }

    return true;
  });

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type} Files</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total: <span className="h5">{filteredFiles.length}</span>
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
      ) : filteredFiles.length > 0 ? (
        <section className="file-list">
          {filteredFiles.map((file: any) => (
           <Card key={file._id} file={file} onDeleteSuccess={fetchFiles} />))}
        </section>
      ) : (
        <p className="empty-list">No files found</p>
      )}
    </div>
  );
};

export default Page;