"use client";

import { useState } from "react";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";

const Card = ({ file }: { file: any }) => {
  const { type, extension } = getFileType(file.filename);
  const [open, setOpen] = useState(false);

  const fileUrl = `/api/download/${file._id}`;

  return (
    <div className="relative file-card bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">

      {/* TOP */}
      <div className="flex justify-between items-start">
        <Thumbnail
          type={type}
          extension={extension}
          url={fileUrl}
          className="!size-16"
          imageClassName="!size-10"
        />

        {/* 3 DOT MENU */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-500 hover:text-black text-lg px-2"
          >
            ⋮
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
              <a
                href={fileUrl}
                target="_blank"
                className="block px-3 py-2 text-sm hover:bg-gray-100"
              >
                Download
              </a>

              <button
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Share
              </button>

              <button
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-3 space-y-1">
        <p className="font-semibold truncate">{file.filename}</p>

        <FormattedDateTime
          date={file.uploaded_at}
          className="text-xs text-gray-400"
        />

        <div className="flex justify-between text-xs text-gray-400">
          <span className="truncate">{file.content_type}</span>
          <span className="font-medium">
            {convertFileSize(file.file_size || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;