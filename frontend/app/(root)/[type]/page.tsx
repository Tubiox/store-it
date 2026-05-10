"use client";

import React from "react";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { useParams } from "next/navigation";
import { useFiles } from "@/contexts/FilesContext";

const Page = () => {
  const { type } = useParams();
  const { files, loading, removeFile } = useFiles();

  // FILTER LOGIC
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
          {filteredFiles.map((file) => (
           <Card key={file._id} file={file} onDeleteSuccess={removeFile} />))}
        </section>
      ) : (
        <p className="empty-list">No files found</p>
      )}
    </div>
  );
};

export default Page;
