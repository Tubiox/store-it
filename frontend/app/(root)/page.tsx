"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { fetchWithAuth } from "@/lib/api";
import FileUploader from "@/components/FileUploader";

const Dashboard = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 const fetchFiles = async () => {
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
};

useEffect(() => {
  fetchFiles();
}, []);

  return (
<div className="dashboard-container">
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">
          Recent files uploaded
        </h2>

        {loading ? (
          <p className="empty-list">Loading...</p>
        ) : files.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {files.map((file) => (
              <Card
                key={file._id}
                file={file}
                onDeleteSuccess={fetchFiles}
              />))}
          </div>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;