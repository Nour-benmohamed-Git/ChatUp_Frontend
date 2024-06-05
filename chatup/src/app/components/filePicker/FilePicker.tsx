import { formatFileSize } from "@/utils/helpers/sharedHelpers";
import { FC, memo, useEffect, useState } from "react";
import { FaFileLines } from "react-icons/fa6";
import { FilePickerProps } from "./FilePicker.types";

const FilePicker: FC<FilePickerProps> = (props) => {
  const { additionalClasses, file, showFileDetails } = props;
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  useEffect(() => {
    const handleFileChange = async () => {
      if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        const extension = file.name.split(".").pop()?.toUpperCase();
        const size = formatFileSize(file.size);
        extension && setFileExtension(extension);
        setFileSize(size);
      }
    };
    handleFileChange();
  }, [file]);
  const renderFileIcon = () => {
    return (
      <div className="flex flex-col items-center justify-between h-full w-full">
        <div
          className={`flex items-center justify-center ${additionalClasses} overflow-hidden shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900`}
        >
          <FaFileLines className="text-gold-900 h-1/2 w-1/2" />
        </div>
        {showFileDetails ? (
          <div className="text-sm text-gold-600">
            {fileSize} - {fileExtension && `${fileExtension}`}
          </div>
        ) : null}
      </div>
    );
  };
  return renderFileIcon();
};

export default memo(FilePicker);
