"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import { getCsrfToken } from "@/lib/auth";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { useFiles } from "@/contexts/FilesContext";

interface Props {
  className?: string;
}

const FileUploader = ({ className }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const { fetchFiles, addFile } = useFiles();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    const csrfToken = getCsrfToken();

    if (!csrfToken) {
      toast({
        description: "You are not logged in",
        className: "error-toast",
      });
      fetchFiles();
      return;
    }

    for (const file of acceptedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          description: `${file.name} is too large`,
          className: "error-toast",
        });
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8000/files/upload", {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.detail);

        toast({
          description: `${file.name} uploaded successfully`,
        });

        fetchFiles();
        router.refresh();

        setFiles((prev) => prev.filter((f) => f.name !== file.name));
      } catch (err: any) {
        console.error(err);

        toast({
          description: err.message || "Upload failed",
          className: "error-toast",
        });
      }
    }
  }, [toast, router, fetchFiles]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
                  <p>{file.name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;