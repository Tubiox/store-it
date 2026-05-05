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

  const SkeletonCard = () => (
    <div className="animate-pulse bg-gray-200 rounded-2xl p-4 space-y-3">
      <div className="h-32 bg-gray-300 rounded-lg"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="w-full px-6">
      <section className="w-full">
        <h2 className="text-xl font-semibold mb-4">
          Recent files uploaded
        </h2>

        {loading ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {files.map((file) => (
              <Card
                key={file._id}
                file={file}
                onDeleteSuccess={(id: string) => {
                  setFiles((prev) => prev.filter((f) => f._id !== id));
                }}
              />))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;