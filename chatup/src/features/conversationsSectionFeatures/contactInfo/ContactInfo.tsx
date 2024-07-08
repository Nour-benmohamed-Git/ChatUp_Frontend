import Avatar from "@/app/components/avatar/Avatar";
import FileIcon from "@/app/components/fileIcon/FileIcon";
import FileViewer from "@/app/components/fileViewer/FileViewer";
import { motion } from "framer-motion";
import { memo, useRef, useState } from "react";
import {
  FaPhoneAlt,
  FaTrashAlt,
  FaUserSlash,
  FaUsers,
  FaVideo,
} from "react-icons/fa";
import { MdMessage, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ContactInfoProps } from "./ContactInfo.types";

const ContactInfo: React.FC<ContactInfoProps> = ({
  userData,
  files,
  lastSeen,
  onMessage,
  onAudioCall,
  onVideoCall,
}) => {
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(-1);
  const fileListRef = useRef<HTMLUListElement>(null);

  const onSelectItem = (index: number) => {
    setSelectedFileIndex(index);
    setShowFileViewer(true);
  };
  const displayUploadedFiles = () => (
    <ul
      ref={fileListRef}
      className="flex space-x-4 overflow-auto px-4 md:px-8 py-5 w-full"
    >
      {files.map((file: any, index: number) => (
        <li
          key={index}
          className={`cursor-pointer transition-transform duration-300 shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900 rounded-md hover:border-gold-600 ${
            selectedFileIndex === index ? "scale-90" : "100"
          }`}
          onClick={() => onSelectItem(index)}
        >
          <FileIcon file={file} additionalClasses="h-24 w-24 rounded-md" />
        </li>
      ))}
      <li className="flex items-center justify-center text-gold-900 hover:text-gold-600 cursor-pointer">
        <div className="flex items-center justify-center h-24 w-24">
          <MdOutlineKeyboardArrowRight className="h-6 w-6" />
        </div>
      </li>
    </ul>
  );

  const onCloseFileViewer = () => {
    setSelectedFileIndex(-1);
    setShowFileViewer(false);
  };
  return (
    <>
      {showFileViewer ? (
        <motion.div
          initial="closed"
          animate={showFileViewer ? "open" : "closed"}
          variants={{ open: { y: 0 }, closed: { y: "100%" } }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={
            "z-50 fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4"
          }
        >
          <FileViewer
            files={files}
            onClose={onCloseFileViewer}
            messageDetails={{
              senderPicture: "senderData?.profilePicture",
              senderName: "senderData?.username as string",
              timestamp: 2123123213,
            }}
            initialSelectedFileIndex={selectedFileIndex}
          />
        </motion.div>
      ) : null}
      <div className="flex flex-col items-center w-full h-full gap-2 overflow-y-auto">
        <div className="flex flex-col items-center gap-2 px-4 md:px-8 py-4 w-full bg-slate-700 shadow-2xl border-b border-slate-500">
          <Avatar
            additionalClasses="h-36 w-36 rounded-full shadow-[0_0_10px_5px_rgba(255,_165,_0,_0.4)] border-2 border-gold-900"
            fileName={userData.profilePicture}
          />
          <h2 className="text-xl font-semibold text-gray-100">
            {userData.username}
          </h2>
          <p className="text-slate-300 mb-2">{userData.email}</p>
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={onMessage}
              className="flex flex-1 items-center flex-col gap-2 text-slate-200 px-6 py-2 rounded-md border border-gold-600 hover:bg-slate-600"
            >
              <MdMessage className="text-gold-900 h-6 w-6" />
              Message
            </button>
            <button
              onClick={onAudioCall}
              className="flex flex-1 items-center flex-col gap-2 text-slate-200 px-6 py-2 rounded-md border border-gold-600 hover:bg-slate-600"
            >
              <FaPhoneAlt className="text-gold-900 h-6 w-6" />
              Audio
            </button>
            <button
              onClick={onVideoCall}
              className="flex flex-1 items-center flex-col gap-2 text-slate-200 px-6 py-2 rounded-md border border-gold-600 hover:bg-slate-600"
            >
              <FaVideo className="text-gold-900 h-6 w-6" />
              Video
            </button>
          </div>
        </div>
        <div className="flex items-center w-full px-4 py-5 md:px-8 md:py-9 bg-slate-700 shadow-2xl border-b border-slate-500">
          <p className="text-gray-100">{userData.profileInfo}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-full bg-slate-700 shadow-2xl border-b border-slate-500">
          <h6
            className={`flex items-center justify-start text-gold-600 px-4 md:px-8 py-2 w-full ${
              files.length ? "auto" : "h-24"
            }`}
          >
            Media, links & docs
          </h6>
          {files.length ? displayUploadedFiles() : null}
        </div>
        <div className="flex flex-col w-full bg-slate-700 shadow-2xl border-b border-slate-500">
          <h6 className="text-gold-600 self-start px-4 md:px-8 py-2">
            No groups in common
          </h6>
          <button className="flex items-center gap-4 md:gap-6 text-slate-200 hover:bg-slate-600 px-4 md:px-8 py-5 min-w-0">
            <FaUsers className="text-gold-900 h-6 w-6 flex-shrink-0" />
            <div className="truncate">
              Create group with {userData.username}
            </div>
          </button>
        </div>
        <div className="flex flex-col w-full bg-slate-700 shadow-2xl border-b border-slate-500">
          <button className="flex items-center gap-6 text-red-500 hover:bg-slate-600 px-4 md:px-8 py-5">
            <FaTrashAlt className="text-red-500 h-6 w-6" />
            Delete {userData.username}
          </button>
          <button className="flex items-center gap-6 text-red-500 hover:bg-slate-600 px-4 md:px-8 py-5">
            <FaUserSlash className="text-red-500 h-6 w-6" />
            Block {userData.username}
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(ContactInfo);
