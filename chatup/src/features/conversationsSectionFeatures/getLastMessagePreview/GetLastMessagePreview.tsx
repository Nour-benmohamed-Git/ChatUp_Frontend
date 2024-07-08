import React, { memo } from "react";
import { FaFile, FaImage, FaVideo } from "react-icons/fa";
import { LastMessagePreviewProps } from "./GetLastMessagePreview.types";

const LastMessagePreview: React.FC<LastMessagePreviewProps> = ({
  lastMessage,
}) => {
  if (!lastMessage) {
    return (
      <span className="text-xs text-white truncate">
        Looks like it&apos;s quiet here!
      </span>
    );
  }

  const { content, files } = lastMessage;

  if (files && files.length > 0) {
    const file = files[files.length - 1];
    const fileName = file.filename;

    if (file.mimetype.startsWith("image/")) {
      return (
        <div className="flex items-center gap-2 text-xs text-white truncate">
          <FaImage className="shrink-0" size={20} />
          <span className="truncate">{content ? content : fileName}</span>
        </div>
      );
    } else if (file.mimetype.startsWith("video/")) {
      return (
        <div className="flex items-center gap-2 text-xs text-white truncate">
          <FaVideo className="shrink-0" size={20} />
          <span className="truncate">{content ? content : fileName}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-xs text-white truncate">
          <FaFile className="shrink-0" size={20} />
          <span className="truncate">{content ? content : fileName}</span>
        </div>
      );
    }
  }

  return <span className="text-xs text-white truncate">{content}</span>;
};

export default memo(LastMessagePreview);
