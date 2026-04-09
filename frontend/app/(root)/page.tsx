"use client";

import { useEffect, useState } from "react";
import { Thumbnail } from "@/components/Thumbnail";
import { FormattedDateTime } from "@/components/FormattedDateTime";

const Dashboard = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/files", {
          credentials: "include", 
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.detail);

        setFiles(data);
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
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>

        {loading ? (
          <p className="empty-list">Loading...</p>
        ) : files.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.map((file) => (
              <div key={file._id} className="flex items-center gap-3">
                <Thumbnail type="file" extension="file" url="#" />

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
                        `http://127.0.0.1:8000/download/${file._id}`,
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