"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { usePathname } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { getCsrfToken } from "@/lib/auth";

const Dashboard = () => {
  const pathname = usePathname();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH FILES
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await fetchWithAuth("/files");

        if (!data?.documents) {
          setFiles([]);
        } else {
          setFiles(data.documents);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = async (fileId: string) => {
    try {
      const csrfToken = getCsrfToken();

      const res = await fetch(
        `http://localhost:8000/download/${fileId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Download failed: ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `file-${fileId}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

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
            {files
              .filter((file) => {
                if (pathname.includes("images")) {
                  return file.content_type?.startsWith("image");
                }

                if (pathname.includes("documents")) {
                  return (
                    file.content_type?.includes("pdf") ||
                    file.content_type?.includes("word") ||
                    file.content_type?.includes("text")
                  );
                }

                if (pathname.includes("media")) {
                  return (
                    file.content_type?.startsWith("video") ||
                    file.content_type?.startsWith("audio")
                  );
                }

                if (pathname.includes("others")) {
                  return !(
                    file.content_type?.startsWith("image") ||
                    file.content_type?.startsWith("video") ||
                    file.content_type?.includes("pdf")
                  );
                }

                return true;
              })
              .map((file) => (
                <Card key={file._id} file={file} />
              ))}
          </div>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;