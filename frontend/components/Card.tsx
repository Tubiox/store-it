"use client";

import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/api";

const Card = ({
  file,
  onDeleteSuccess,
}: {
  file: any;
  onDeleteSuccess?: (id: string) => void;
}) => {
  const { type, extension } = getFileType(file.filename);

  const [open, setOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const ref = useRef<HTMLDivElement>(null);

  // close dropdown
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
    if (deleting) return;

    setDeleting(true);

    try {
      await fetchWithAuth(`/files/delete/${file._id}`, {
        method: "DELETE",
      });

      setIsVisible(false);

      setTimeout(() => {
        onDeleteSuccess?.(file._id as string);
      }, 250);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  // DOWNLOAD
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/files/download/${file._id}`,
        { credentials: "include" }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  // SHARE
  const handleShare = async () => {
    if (!shareEmail) {
      alert("Enter email first");
      return;
    }

    try {
      setLoadingShare(true);

      const res = await fetch(
        `http://localhost:8000/files/share/${file._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: shareEmail }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.detail);

      navigator.clipboard.writeText(data.share_url);

      console.log("Link copied");
      setIsShareModalOpen(false);
      setShareEmail("");
    } catch (err) {
      console.error(err);
      alert("Share failed");
    } finally {
      setLoadingShare(false);
    }
  };

  // PREVIEW
  const previewUrl = `http://localhost:8000/files/download/${file._id}`;

  return (
    <>
      {/* CARD */}
      <div
        className={`group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        {/* PREVIEW */}
        <div className="mb-3 overflow-hidden rounded-lg">
          {file.content_type?.startsWith("image") ? (
            <img
              src={previewUrl}
              className="w-full h-32 object-cover"
            />
          ) : file.content_type === "application/pdf" ? (
            <iframe
              src={previewUrl}
              className="w-full h-32"
            />
          ) : (
            <Thumbnail
              type={type}
              extension={extension}
              url=""
              className="!size-16"
              imageClassName="!size-10"
            />
          )}
        </div>

        {/* MENU */}
        <div className="absolute top-3 right-3" ref={ref}>
          <button onClick={() => setOpen((prev) => !prev)}>
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-20 border">
              <button
                onClick={handleDownload}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download
              </button>

              <button
                onClick={() => {
                  setIsShareModalOpen(true);
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Share
              </button>

              <button
                onClick={handleDelete}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="space-y-1">
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

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">Share File</h2>

            <input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-400" />

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => {
                  setIsShareModalOpen(false);
                  setShareEmail("");
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleShare}
                disabled={loadingShare}
                className="w-full px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loadingShare ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;