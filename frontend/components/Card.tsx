import Thumbnail from "@/components/Thumbnail";
import { convertFileSize, getFileType } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";

const Card = ({ file }: { file: any }) => {
  const { type, extension } = getFileType(file.filename);

  const fileUrl = `http://127.0.0.1:8000/download/${file._id}`;

  return (
    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={type}
          extension={extension}
          url={fileUrl}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <p className="body-1">
            {file.size ? convertFileSize(file.size) : "-"}
          </p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">
          {file.filename}
        </p>

        <FormattedDateTime
          date={file.uploaded_at}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200">
          Type: {file.content_type}
        </p>
      </div>
    </a>
  );
};

export default Card;