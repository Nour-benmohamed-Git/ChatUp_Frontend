import { compactDateAndTimeFormatter } from "@/utils/helpers/dateHelpers";
import { downloadFile } from "@/utils/helpers/sharedHelpers";
import { motion } from "framer-motion";
import { FC, memo, useEffect, useRef, useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosClose,
  IoMdDownload,
} from "react-icons/io";
import { RiShareForwardFill } from "react-icons/ri";
import Avatar from "../avatar/Avatar";
import FileIcon from "../fileIcon/FileIcon";
import FileViewerHeaderInfo from "../fileViewerHeaderInfo/FileViewerHeaderInfo";
import { FileViewerProps } from "./FileViewer.types";

const FileViewer: FC<FileViewerProps> = ({
  files,
  onClose,
  messageDetails,
  initialSelectedFileIndex,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(
    initialSelectedFileIndex || 0
  );
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
            <FileIcon file={file} additionalClasses="h-14 w-14" />
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
      <div
        className={`flex ${
          messageDetails ? "justify-between" : "justify-end"
        } items-center w-full`}
      >
        {messageDetails ? (
          <div className="flex flex-1 gap-4">
            <Avatar
              additionalClasses="h-10 w-10"
              rounded={`rounded-full ${
                typeof messageDetails?.senderPicture === "string" &&
                messageDetails?.senderPicture !== ""
                  ? ""
                  : "shadow-[0_0_8px_3px_rgba(255,_165,_0,_0.4)] border-2 border-gold-600"
              }`}
              fileName={messageDetails?.senderPicture}
              userId={messageDetails?.senderId}
            />
            <FileViewerHeaderInfo
              username={messageDetails?.senderName}
              timestamp={compactDateAndTimeFormatter(
                messageDetails.timestamp as number
              )}
            />
          </div>
        ) : null}
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
      <div className="h-[calc(100%-2.75rem)] p-4 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-between h-full w-full">
          <div className="relative flex items-center justify-center w-full">
            <motion.button
              className="hidden md:block absolute left-0 p-2 border border-gold-300 rounded-full shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={slideLeft}
              whileTap={{ boxShadow: "0 0 30px 15px rgba(255, 165, 0, 0.4)" }}
              disabled={selectedFileIndex === 0}
            >
              <IoIosArrowBack className="text-2xl text-gold-900 hover:text-gold-600" />
            </motion.button>
            <motion.div
              className="w-72 h-96"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_event, info) => {
                if (info.offset.x < -100) {
                  slideRight();
                } else if (info.offset.x > 100) {
                  slideLeft();
                }
              }}
            >
              <FileIcon
                file={files[selectedFileIndex]}
                additionalClasses="h-full w-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 rounded-md transition-transform duration-300"
              />
            </motion.div>

            <motion.button
              className="hidden md:block absolute right-0 p-2 border border-gold-300 rounded-full shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
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
