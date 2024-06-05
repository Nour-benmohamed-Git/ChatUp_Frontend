import { compactDateAndTimeFormatter } from "@/utils/helpers/dateHelpers";
import { motion } from "framer-motion";
import { FC, memo, useEffect, useRef, useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosClose,
  IoMdDownload,
} from "react-icons/io";
import { RiShareForwardFill } from "react-icons/ri";
import Avatar from "../avatar/avatar";
import FileIcon from "../fileIcon/FileIcon";
import FileViewerHeaderInfo from "../fileViewerHeaderInfo/FileViewerHeaderInfo";
import { FileViewerProps } from "./FileViewer.types";
import { downloadFile } from "@/utils/helpers/sharedHelpers";

const FileViewer: FC<FileViewerProps> = ({
  files,
  onClose,
  messageDetails,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const fileListRef = useRef<HTMLUListElement>(null);

  const slideLeft = () => {
    setSelectedFileIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : files.length - 1
    );
  };

  const slideRight = () => {
    setSelectedFileIndex((prevIndex) =>
      prevIndex < files.length - 1 ? prevIndex + 1 : 0
    );
  };
  const displayUploadedFiles = () =>
    files.length > 0 && (
      <ul
        ref={fileListRef}
        className="flex space-x-4 overflow-auto p-4 border-t border-gold-600 w-full"
      >
        {files.map((file: any, index: number) => (
          <li
            key={index}
            className={`cursor-pointer transition-transform duration-300 shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 rounded-md hover:border-gold-600 ${
              selectedFileIndex === index ? "scale-90" : "100"
            }`}
            onClick={() => setSelectedFileIndex(index)}
          >
            <FileIcon file={file} additionalClasses="h-14 w-14 rounded-md" />
          </li>
        ))}
      </ul>
    );
  useEffect(() => {
    if (fileListRef.current) {
      const selectedItem = fileListRef.current.children[
        selectedFileIndex
      ] as HTMLElement;
      const containerWidth = fileListRef.current.offsetWidth;
      const itemWidth = selectedItem.offsetWidth;
      const scrollPosition =
        selectedItem.offsetLeft - containerWidth / 2 + itemWidth / 2;

      fileListRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [selectedFileIndex]);

  return (
    <div className="w-full h-full space-y-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-1 gap-4">
          <Avatar
            additionalClasses="h-10 w-10 rounded-full"
            fileName={messageDetails?.senderPicture}
          />
          <FileViewerHeaderInfo
            username={messageDetails?.senderName}
            timestamp={compactDateAndTimeFormatter(
              messageDetails.timestamp as number
            )}
          />
        </div>
        <div className="flex flex-row-reverse items-center gap-6">
          <button
            className="text-2xl text-gold-900 hover:text-gold-600 rounded-full"
            onClick={onClose}
          >
            <IoIosClose className="h-8 w-8" />
          </button>
          <button
            className="text-2xl text-gold-900 hover:text-gold-600 rounded-full"
            onClick={() => downloadFile(files[selectedFileIndex].filename)}
          >
            <IoMdDownload />
          </button>
          <button
            className="text-2xl text-gold-900 hover:text-gold-600 rounded-full"
            //   onClick={onForward}
          >
            <RiShareForwardFill />
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-2.75rem)] rounded-lg shadow-lg  p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-between h-full w-full">
          <div className="relative flex items-center justify-center w-full">
            <motion.button
              className="absolute left-0 p-2 border border-gold-300 rounded-full shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={slideLeft}
              whileTap={{ boxShadow: "0 0 30px 15px rgba(255, 165, 0, 0.4)" }}
              disabled={selectedFileIndex === 0}
            >
              <IoIosArrowBack className="text-2xl text-gold-900 hover:text-gold-600" />
            </motion.button>

            <FileIcon
              file={files[selectedFileIndex]}
              additionalClasses="h-96 w-72 rounded-md shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 rounded-md transition-transform duration-300"
            />

            <motion.button
              className="absolute right-0 p-2 border border-gold-300 rounded-full shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={slideRight}
              whileTap={{ boxShadow: "0 0 30px 15px rgba(255, 165, 0, 0.4)" }}
              disabled={selectedFileIndex === files.length - 1}
            >
              <IoIosArrowForward className="text-2xl text-gold-900 hover:text-gold-600" />
            </motion.button>
          </div>
          <div className="flex items-center justify-center w-full">
            {displayUploadedFiles()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FileViewer);
