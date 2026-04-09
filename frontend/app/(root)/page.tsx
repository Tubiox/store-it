"use client";

import { useEffect, useState } from "react";
import { Thumbnail } from "@/components/Thumbnail";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import ActionDropdown from "@/components/ActionDropdown";
import AuthForm from "@/components/AuthForm";

// helper to get token
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "token") return value;
  }
  return null;
};

const Dashboard = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = getTokenFromCookie();

        const res = await fetch("http://localhost:8000/files", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.detail);

        setFiles(data); // backend should return list
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Recent files */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>

        {loading ? (
          <p className="empty-list">Loading...</p>
        ) : files.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.map((file) => (
              <div
                className="flex items-center gap-3"
                key={file._id}
              >
                <Thumbnail
                  type="file"
                  extension="file"
                  url="#"
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
                    onClick={() =>
                      window.open(
                        `http://localhost:8000/download/${file._id}`,
                        "_blank"
                      )
                    }
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