import environment from "@/utils/config/environment";
import { FC, memo } from "react";
import { FaFileAlt } from "react-icons/fa";
import Avatar from "../avatar/Avatar";
import { FileIconProps } from "./FileIcon.types";
const FileIcon: FC<FileIconProps> = (props) => {
  const { file, additionalClasses } = props;
  const isImage = file.mimetype.startsWith("image/");
  const isVideo = file.mimetype.startsWith("video/");

  if (isImage) {
    return (
      <Avatar
        fileName={file.filename}
        additionalClasses={additionalClasses}
      />
    );
  } else if (isVideo) {
    return (
      <video controls className="rounded-md">
        <source src={`${environment.baseUrl}/uploads/${file.filename}`} />
      </video>
    );
  } else {
    return (
      <a
        target="_blank"
        href={`${environment.baseUrl}/uploads/${file.filename}`}
        download={`${environment.baseUrl}/uploads/${file.filename}`}
        className="w-full text-sm flex gap-2 items-center bg-gray-800 rounded-md p-4 text-blue-500 hover:text-blue-400 max-w-full"
      >
        <FaFileAlt className="h-10 w-10 text-gray-400 flex-shrink-0" />
        <div className="text-sm font-medium truncate">{file.filename}</div>
      </a>
    );
  }
};

export default memo(FileIcon);
