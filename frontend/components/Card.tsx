"use client";

import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Card = ({
  file,
  onDeleteSuccess,
}: {
  file: any;
  onDeleteSuccess?: () => void;
}) => {
  const { type, extension } = getFileType(file.filename);
  const [open, setOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // DELETE
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/files/delete/${file._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      onDeleteSuccess?.();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // DOWNLOAD 
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/files/download/${file._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // SHARE
  const handleShare = async () => {
    try {
      if (!shareEmail) {
        alert("Please enter email first");
        return;
      }

      const res = await fetch(`http://localhost:8000/files/share/${file._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: shareEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Share failed");
      }

      navigator.clipboard.writeText(data.share_url);

      alert("Link sent & copied!");
    } catch (err) {
      console.error(err);
      alert("Share failed");
    }
  };

  return (
    <div className="group relative bg-[#f6f7f9] hover:bg-[#eef1f4] transition rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer">

      {/* Top */}
      <div className="flex justify-between items-start">
        <Thumbnail
          type={type}
          extension={extension}
          url=""
          className="!size-16"
          imageClassName="!size-10"
        />

        {/* Menu */}
        <div ref={ref} className="relative">
          <button onClick={() => setOpen((prev) => !prev)}>
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg z-10">
              <button
                onClick={handleDownload}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download
              </button>

              <div className="px-4 py-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="border p-2 rounded w-full mb-2"
                />

                <button
                  onClick={handleShare}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Share
                </button>
              </div>

              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <p className="font-semibold text-sm truncate">{file.filename}</p>

        <p className="text-xs text-gray-500">{file.content_type}</p>

        <FormattedDateTime
          date={file.uploaded_at}
          className="text-xs text-gray-400"
        />

        <p className="text-xs text-gray-500">
          {file.size ? convertFileSize(file.size) : "—"}
        </p>
      </div>
    </div>
  );
};

export default Card;