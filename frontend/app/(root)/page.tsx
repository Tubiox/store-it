"use client";

import { useEffect, useState } from "react";
import { Thumbnail } from "@/components/Thumbnail";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { fetchWithAuth } from "@/lib/api";

const Dashboard = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async (fileId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://127.0.0.1:8000/download/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "file"; // optional
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("TOKEN IN DASHBOARD:", token);

    if (!token || token === "undefined" || token === "null") {
      window.location.href = "/sign-in";
      return;
    }

    const fetchFiles = async () => {
      try {
        const data = await fetchWithAuth("/files");

        console.log("API RESPONSE:", data);

        if (!data || !data.documents) {
          setFiles([]);
          return;
        }

        setFiles(data.documents);
      } catch (err) {
        console.error("Error fetching files:", err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="dashboard-container">
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>

        {loading ? (
          <p className="empty-list">Loading...</p>
        ) : files && files.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.map((file) => (
              <div key={file._id} className="flex items-center gap-3">
                <Thumbnail
                  type={file.content_type}
                  extension={file.filename?.split(".").pop()}
                  url=""
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.filename}</p>

                    <FormattedDateTime
                      date={file.uploaded_at}
                      className="caption"
                    />
                  </div>

                  <button
                    onClick={() => handleDownload(file._id)}
                    className="text-blue-400"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;