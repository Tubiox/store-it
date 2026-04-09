"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";

// helper to get token from cookie
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "token") return value;
  }
  return null;
};

interface Props {
  className?: string;
}

const FileUploader = ({ className }: Props) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    const token = getTokenFromCookie();

    const uploadPromises = acceptedFiles.map(async (file) => {
      // file size check
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prev) => prev.filter((f) => f.name !== file.name));

        return toast({
          description: `${file.name} is too large. Max 50MB.`,
          className: "error-toast",
        });
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Upload failed");
        }

        console.log("Uploaded:", data);

        // remove from preview after success
        setFiles((prev) => prev.filter((f) => f.name !== file.name));

      } catch (error: any) {
        console.error(error);

        toast({
          description: error.message || "Upload failed",
          className: "error-toast",
        });
      }
    });

    await Promise.all(uploadPromises);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />

      <Button type="button" className={cn("uploader-button", className)}>
        <Image src="/assets/icons/upload.svg" alt="upload" width={24} height={24} />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li key={`${file.name}-${index}`} className="uploader-preview-item">
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      width={80}
                      height={26}
                      alt="Loader"
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  width={24}
                  height={24}
                  alt="Remove"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;