import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// className merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// file preview
export const convertFileToUrl = (file: File) =>
  URL.createObjectURL(file);

// file size formatter
export const convertFileSize = (bytes: number) => {
  if (!bytes) return "0 Bytes";

  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

// extract file type
export const getFileType = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  const image = ["jpg", "jpeg", "png", "gif", "webp"];
  const video = ["mp4", "mov", "mkv"];
  const audio = ["mp3", "wav"];
  const document = ["pdf", "doc", "docx", "txt", "xls", "xlsx"];

  if (image.includes(extension)) return { type: "image", extension };
  if (video.includes(extension)) return { type: "video", extension };
  if (audio.includes(extension)) return { type: "audio", extension };
  if (document.includes(extension))
    return { type: "document", extension };

  return { type: "other", extension };
};

export const getFileIcon = (extension: string, type: string) => {
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
    return "/assets/icons/file-image.svg";

  if (["mp4", "mov", "mkv"].includes(extension))
    return "/assets/icons/file-video.svg";

  if (["mp3", "wav"].includes(extension))
    return "/assets/icons/file-audio.svg";

  if (["pdf", "doc", "docx", "txt", "xls", "xlsx"].includes(extension))
    return "/assets/icons/file-document.svg";

  return "/assets/icons/file-other.svg";
};

// format date
export const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  return date.toLocaleString();
};


export const calculatePercentage = (used: number, total: number = 2000000000) => {
  if (!used || total === 0) return 0;
  return Math.round((used / total) * 100);
};

// backend urls
export const constructFileUrl = (key: string) =>
  `http://localhost:8000/files/${key}/view`;

export const constructDownloadUrl = (key: string) =>
  `http://localhost:8000/files/${key}/download`;