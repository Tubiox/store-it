"use client";

import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FilePreviewModal from "@/components/FilePreviewModal";
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
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
      setShareSuccess(true);

      setTimeout(() => {
        setIsShareModalOpen(false);
        setShareEmail("");
        setShareSuccess(false);
      }, 1800);

    } catch (err) {
      console.error(err);
      console.error("Could not send secure link");
    } finally {
      setLoadingShare(false);
    }
  };

  // PREVIEW
  const previewUrl = `http://localhost:8000/files/preview/${file._id}`;
  return (
    <>
      {/* CARD */}
      <div className={`group relative bg-neutral-50 rounded-xl p-4 transition-all duration-300 
  shadow-[0_2px_10px_rgba(0,0,0,0.04)] 
  hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] 
  hover:-translate-y-1 
  ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* PREVIEW */}
        <div
          onClick={() => setPreviewOpen(true)}
          className="mb-3 h-40 w-full overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
        >
          {file.content_type?.startsWith("image") ? (
            <img src={previewUrl} className="w-full h-full object-cover" />
          ) : file.content_type === "application/pdf" ? (
            <div className="relative w-full h-40 overflow-hidden">
              <iframe
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full pointer-events-none"
              />
              <div className="absolute inset-0 pointer-events-none" />
            </div>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <MoreVertical className="w-5 h-5 text-neutral-500" />
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
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-neutral-100"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="space-y-1">
          <p className="font-semibold text-sm truncate">{file.filename}</p>

          <p className="text-xs text-neutral-500">{file.content_type}</p>

          <FormattedDateTime
            date={file.uploaded_at}
            className="text-xs text-gray-400"
          />

          <p className="text-xs text-neutral-500">
            {file.size ? convertFileSize(file.size) : "—"}
          </p>
        </div>
      </div>

      {/* SHARE MODAL */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"

          onClick={() => {
            setIsShareModalOpen(false);
            setShareEmail("");
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fadeIn"
          >
            {/* HEADER */}
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Share Securely
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Generate a protected sharing link for this file.
              </p>
            </div>

            {/* FILE INFO */}
            <div className="flex items-center gap-3 rounded-xl bg-neutral-50 border border-neutral-100 p-3 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                <Thumbnail
                  type={type}
                  extension={extension}
                  url=""
                  className="!size-10"
                  imageClassName="!size-7"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-800">
                  {file.filename}
                </p>

                <p className="text-xs text-neutral-500">
                  {file.size ? convertFileSize(file.size) : "—"}
                  • {file.content_type}
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Recipient Email
              </label>

              <input
                type="email"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:ring-4 focus:ring-red-100"
              />
            </div>

            {/* ACCESS OPTIONS */}
            <div className="mt-5 space-y-4">

              {/* EXPIRY */}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-2">
                  Link Expiry
                </label>

                <select
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
                >
                  <option>1 Hour</option>
                  <option>24 Hours</option>
                  <option>7 Days</option>
                </select>
              </div>

              {/* PERMISSIONS */}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-2">
                  Permissions
                </label>

                <div className="flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input type="radio" name="permission" defaultChecked />
                    View only
                  </label>

                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input type="radio" name="permission" />
                    Allow download
                  </label>
                </div>
              </div>
            </div>

            {/* SECURITY INFO */}
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs leading-relaxed text-red-500">
                SecureIt generates encrypted temporary sharing links for protected file access.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsShareModalOpen(false);
                  setShareEmail("");
                }}
                className="w-full rounded-xl bg-neutral-100 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200"
              >
                Cancel
              </button>

              <button
                onClick={handleShare}
                disabled={loadingShare}
                className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition disabled:opacity-50 ${shareSuccess
                  ? "bg-green-600"
                  : "bg-black hover:bg-neutral-800"
                  }`}
              >
                {shareSuccess
                  ? "Link Generated Successfully ✓"
                  : loadingShare
                    ? "Generating..."
                    : "Generate Secure Link"}

              </button>
            </div>
          </div>
        </div >
      )}
      <FilePreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        file={file}
      />
    </>
  );
};

export default Card;