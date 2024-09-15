import Menu from "@/app/components/menu/Menu";
import useAutoSizeTextArea from "@/hooks/useAutoSizeTextArea";
import { fileMenuActions } from "@/utils/constants/actionLists/fileMenuActions";
import { MenuPosition } from "@/utils/constants/globals";
import { formatRecordingTime } from "@/utils/helpers/dateHelpers";
import {
  convertBlobToFile,
  getMediaRecordError,
} from "@/utils/helpers/sharedHelpers";
import { motion } from "framer-motion";
import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone, FaPause, FaPlay, FaPlus } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { useReactMediaRecorder } from "react-media-recorder";
import MessageField from "../messageField/MessageField";
import { MessageComposerProps } from "./MessageComposer.types";

const MessageComposer: FC<MessageComposerProps> = ({
  handleSubmitForm,
  handleUploadDocuments,
  openEmojiPicker,
}) => {
  const { watch, getValues, setValue } = useFormContext();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  useAutoSizeTextArea(textAreaRef.current, getValues("message"));

  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    mediaBlobUrl,
    clearBlobUrl,
    error,
  } = useReactMediaRecorder({
    audio: true,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (status === "recording") {
      interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else if (!["recording", "paused"].includes(status)) {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleRecordingControl = async (
    action: "start" | "pause" | "resume" | "stop" | "send"
  ) => {
    if (action === "start") {
      setRecordingTime(0);
      startRecording();
      setShowRecorder(true);
    } else if (action === "pause") {
      pauseRecording();
      setIsPaused(true);
    } else if (action === "resume") {
      resumeRecording();
      setIsPaused(false);
    }
    if (action === "stop") {
      stopRecording();
      clearBlobUrl();
      setShowRecorder(false);
    }
    if (action === "send") {
      stopRecording();
      setShowRecorder(false);
    }
  };

  useEffect(() => {
    const sendAudioMessage = async () => {
      if (mediaBlobUrl) {
        try {
          const audioFile = await convertBlobToFile(
            mediaBlobUrl,
            "recording.wav"
          );
          setValue("files", [audioFile], { shouldValidate: true });
          handleSubmitForm();
          clearBlobUrl();
        } catch (e) {
          console.error("Error processing audio file:", e);
        }
      }
    };
    sendAudioMessage();
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (error) getMediaRecordError(error);
  }, [error]);

  const onClickFunctions: { [key: string]: () => void } = {
    location: () => {},
    documents: handleUploadDocuments,
    camera: () => {},
  };
  const fileMenuActionsWithHandlers = useMemo(
    () =>
      fileMenuActions.map((action) => ({
        ...action,
        onClick: onClickFunctions[action.label],
      })),
    [handleUploadDocuments]
  );
  return (
    <div className="flex items-center justify-center h-full w-full gap-5">
      {showRecorder ? (
        <div className="flex items-center justify-between w-full md:w-2/3 bg-white shadow-lg rounded-lg px-4">
          <div className="flex items-center">
            <p className="text-lg font-semibold text-gray-900 mr-2">
              {formatRecordingTime(recordingTime)}
            </p>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    status === "recording" ? "bg-red-500" : "bg-gray-300"
                  } animate-pulse`}
                />
              </div>
            </div>
          </div>
          <p className="text-sm capitalize font-semibold text-gray-700 animate-pulse">
            {status === "acquiring_media" ? "processing" : status}
          </p>
          <div className="flex gap-4 items-center">
            <button
              onClick={() =>
                handleRecordingControl(isPaused ? "resume" : "pause")
              }
              className="flex items-center justify-center w-10 h-10 text-gold-900 hover:text-gold-300"
            >
              {isPaused ? <FaPlay size={18} /> : <FaPause size={18} />}
            </button>
            <button
              onClick={() => handleRecordingControl("stop")}
              className="flex items-center justify-center w-10 h-10 text-red-600 hover:text-red-500"
            >
              <FaTrashCan size={18} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-4 md:gap-6 h-full">
            <button onClick={openEmojiPicker}>
              <motion.div
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                whileHover={{ scale: 1.5, rotate: 360 }}
                className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300"
              >
                <MdEmojiEmotions size={24} />
              </motion.div>
            </button>
            <Menu
              actionList={fileMenuActionsWithHandlers}
              position={MenuPosition.TOP_RIGHT}
              icon={FaPlus}
            />
          </div>
          <MessageField
            id="message"
            name="message"
            placeholder="Type your message"
            messageFieldRef={textAreaRef}
            handleSendMessage={handleSubmitForm}
          />
        </>
      )}
      <div className="flex items-center gap-4">
        {watch("message").trim().length === 0 && !showRecorder ? (
          <button
            type="button"
            onClick={() => handleRecordingControl("start")}
            className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300"
          >
            <FaMicrophone size={24} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleRecordingControl("send")}
            className="flex justify-center items-center rounded-md text-gold-900 hover:text-gold-300"
          >
            <BsFillSendFill size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(MessageComposer);
