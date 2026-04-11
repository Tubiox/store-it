import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { convertFileSize } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const ImageThumbnail = ({ file }: { file: any }) => (
  <div className="file-details-thumbnail">
    <Thumbnail
      type="file"
      extension={file.filename?.split(".").pop()}
      url=""
    />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.filename}</p>
      <FormattedDateTime date={file.uploaded_at} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: any }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow
          label="Format:"
          value={file.filename?.split(".").pop() || "unknown"}
        />
        <DetailRow
          label="Size:"
          value={convertFileSize(file.file_size || 0)}
        />
        <DetailRow
          label="Owner:"
          value="You"
        />
        <DetailRow
          label="Uploaded:"
          value={new Date(file.uploaded_at).toLocaleString()}
        />
      </div>
    </>
  );
};

interface Props {
  file: any;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>

        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) =>
            onInputChange(e.target.value.trim().split(","))
          }
          className="share-input-field"
        />

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">0 users</p>
          </div>

          <ul className="pt-2">
            {/* No sharing system yet */}
          </ul>
        </div>
      </div>
    </>
  );
};