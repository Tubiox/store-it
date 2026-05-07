"use client";

import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import {
  MoreVertical,
  Download,
  Share2,
  Pencil,
  Trash2,
  Info,
} from "lucide-react";
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
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [newFilename, setNewFilename] = useState(file.filename);
  const [renaming, setRenaming] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [expiry, setExpiry] = useState("1h");
  const [permission, setPermission] = useState("view");

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
      setOpen(false);

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
      setOpen(false);

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
          body: JSON.stringify({
            email: shareEmail,
            expiry,
            permission,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.detail);

      navigator.clipboard.writeText(data.share_url);
      setShareSuccess(true);

      setTimeout(() => {
        setLoadingShare(false);
        setIsShareModalOpen(false);
        setShareEmail("");
        setShareSuccess(false);
      }, 1800);

    } catch (err) {
      console.error(err);
      console.error("Could not send secure link");
    } finally {
    }
  };


  const handleRename = async () => {
    if (!newFilename.trim()) return;

    try {
      setRenaming(true);

      await fetchWithAuth(`/files/rename/${file._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: newFilename,
        }),
      });

      setIsRenameOpen(false);
      setOpen(false);
      window.location.reload();

    } catch (err) {
      console.error("Rename error:", err);
    } finally {
      setRenaming(false);
    }
  };
  // PREVIEW
  const previewUrl = `http://localhost:8000/files/preview/${file._id}`;

  return (
    <>
      {/* CARD */}
      <div
        className={`group relative bg-neutral-50 rounded-xl p-4 transition-all duration-300 
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

          {/* IMAGE */}
          {file.content_type?.startsWith("image") ? (
            <img
              src={previewUrl}
              alt={file.filename}
              className="w-full h-full object-cover"
            />
          ) : file.content_type === "application/pdf" ? (

            /* PDF PREVIEW */
            <div className="relative w-full h-full overflow-hidden bg-white rounded-lg">
              <iframe
                src={`${previewUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full pointer-events-none"
              />

              {/* HIDE SCROLLBAR */}
              <div className="absolute right-0 top-0 w-3 h-full bg-white" />
            </div>

          ) : file.content_type?.startsWith("video") ? (

            /* VIDEO PREVIEW */
            <div className="relative w-full h-full bg-black overflow-hidden">
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />

              {/* PLAY ICON */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="w-5 h-5 text-pink-500"
                  >
                    <path d="M11.596 8.697l-6.363 3.692A.802.802 0 014 11.692V4.308a.802.802 0 011.233-.697l6.363 3.692a.802.802 0 010 1.394z" />
                  </svg>
                </div>
              </div>
            </div>

          ) : (

            /* OTHER FILES */
            <div className="w-full h-full flex items-center justify-center">
              <Thumbnail
                type={type}
                extension={extension}
                url=""
                className="!size-16"
                imageClassName="!size-10"
              />
            </div>

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
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl z-20">

              {/* DOWNLOAD */}
              <button
                onClick={handleDownload}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:scale-[1.02]"
              >
                <Download
                  size={18}
                  style={{
                    color: "#38bdf8",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />

                Download
              </button>

              {/* SHARE */}
              <button
                onClick={() => {
                  setIsShareModalOpen(true);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:scale-[1.02]"
              >
                <Share2
                  size={18}
                  style={{
                    color: "#fb923c",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />

                Share
              </button>

              {/* RENAME */}
              <button
                onClick={() => {
                  setIsRenameOpen(true);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:scale-[1.02]"
              >
                <Pencil
                  size={18}
                  style={{
                    color: "#8b5cf6",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />

                Rename
              </button>

              {/* DETAILS */}
              <button
                onClick={() => {
                  setIsDetailsOpen(true);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:scale-[1.02]"
              >
                <Info
                  size={18}
                  style={{
                    color: "#737373",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />

                Details
              </button>

              {/* DELETE */}
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:scale-[1.02]"
              >
                <Trash2
                  size={18}
                  style={{
                    color: "#f43f5e",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />

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
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:ring-4focus:ring-red-100"
                >
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>

              {/* PERMISSIONS */}
              <div>
                <label className="text-sm font-medium text-neutral-700 block mb-2">
                  Permissions
                </label>

                <div className="flex flex-col gap-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="radio"
                      checked={permission === "view"}
                      onChange={() => setPermission("view")}
                    />
                    View only
                  </label>

                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="radio"
                      checked={permission === "download"}
                      onChange={() => setPermission("download")}
                    />
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
      {/* DETAILS MODAL */}
      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
          >
            {/* HEADER */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">
                  File Details
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Secure vault metadata and storage information.
                </p>
              </div>

              <button
                onClick={() => setIsDetailsOpen(false)}
                className="rounded-full p-2 transition hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            {/* FILE PREVIEW */}
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
                <Thumbnail
                  type={type}
                  extension={extension}
                  url=""
                  className="!size-10"
                  imageClassName="!size-7"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {file.filename}
                </p>

                <p className="text-xs text-neutral-500">
                  {file.content_type}
                </p>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="space-y-4">

              {/* SIZE */}
              <div className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
                <span className="text-sm text-neutral-500">
                  File Size
                </span>

                <span className="text-sm font-medium text-neutral-800">
                  {file.size ? convertFileSize(file.size) : "—"}
                </span>
              </div>

              {/* MIME */}
              <div className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
                <span className="text-sm text-neutral-500">
                  MIME Type
                </span>

                <span className="max-w-[220px] truncate text-sm font-medium text-neutral-800">
                  {file.content_type || "Unknown"}
                </span>
              </div>

              {/* UPLOAD DATE */}
              <div className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
                <span className="text-sm text-neutral-500">
                  Uploaded
                </span>

                <span className="text-sm font-medium text-neutral-800">
                  {new Date(file.uploaded_at).toLocaleString()}
                </span>
              </div>

              {/* OWNER */}
              <div className="flex items-center justify-between rounded-xl border border-neutral-100 px-4 py-3">
                <span className="text-sm text-neutral-500">
                  Owner ID
                </span>

                <span className="max-w-[220px] truncate text-sm font-medium text-neutral-800">
                  {file.owner_id || "Unknown"}
                </span>
              </div>

              {/* STORAGE KEY */}
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
                  Encrypted Storage Key
                </p>

                <p className="break-all text-xs leading-relaxed text-red-400">
                  {file.storage_key || "Unavailable"}
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* RENAME MODAL */}
      {isRenameOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setIsRenameOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            {/* HEADER */}
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-neutral-900">
                Rename File
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Update the file name securely.
              </p>
            </div>

            {/* INPUT */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                File Name
              </label>

              <input
                type="text"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => setIsRenameOpen(false)}
                className="w-full rounded-xl bg-neutral-100 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200"
              >
                Cancel
              </button>

              <button
                onClick={handleRename}
                disabled={renaming}
                className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                {renaming ? "Renaming..." : "Rename File"}
              </button>
            </div>
          </div>
        </div>
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