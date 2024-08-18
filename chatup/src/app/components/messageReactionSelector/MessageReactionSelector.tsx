import { addOrUpdateReaction } from "@/app/_actions/messageActions/addOrUpdateReaction";
import { useSocket } from "@/context/SocketContext";
import { globals, predefinedReactions } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookiesHelpers";
import { emitMessage } from "@/utils/helpers/socket-helpers";
import { FC, memo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaSmile } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import ExpandedReactionPicker from "../expandedReactionPickerProps/ExpandedReactionPicker";
import PositionedWrapper from "../positionedWrapper/PositionedWrapper";
import { MessageReactionSelectorProps } from "./MessageReactionSelector.types";

const MessageReactionSelector:FC<MessageReactionSelectorProps> = ({
  showReactionPicker,
  setShowReactionPicker,
  reactionSelectorPosition,
  position,
  message,
  conversationRelatedData,
}) => {
  const { socket } = useSocket();
  const currentUserId = parseInt(getItem(globals.currentUserId) as string, 10);
  const { setValue } = useFormContext();
  const [expandedReactionPicker, setExpandedReactionPicker] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const handleAddReaction = async (params: { name: string; emoji: string }) => {
    const { name, emoji } = params;
    setValue(name, emoji);
    const res = await addOrUpdateReaction({
      messageId: message.id,
      reaction: emoji,
    });
    if (res.data?.data) {
      const messageToReact = {
        id: message.id,
        content: message.content,
        files: message.files,
        senderId: currentUserId,
        receiverId: conversationRelatedData?.secondMemberId as number,
        chatSessionId: conversationRelatedData?.conversationId as number,
        reactions: res.data?.data,
      };
      socket &&
        emitMessage(socket, {
          action: "react",
          message: messageToReact,
          reaction: emoji,
        });
     
    }
  };
  const handleCloseReactionPicker = () => {
    setShowReactionPicker(false);
  };
  const handleOpenExpandedReactionPicker = () => {
    setShowReactionPicker(false);
    setExpandedReactionPicker(true);
  };
  const handleCloseExpandedReactionPicker = () => {
    setExpandedReactionPicker(false);
  };
  return (
    <>
      <div
        role="button"
        ref={buttonRef}
        className="hidden md:flex md:justify-center md:items-center rounded-full h-8 w-8 text-gold-900"
        onClick={() => setShowReactionPicker((prev) => !prev)}
      >
        <FaSmile size={20} />
      </div>
      <PositionedWrapper
        isOpen={showReactionPicker}
        onClose={handleCloseReactionPicker}
        buttonRef={buttonRef}
        position={position}
        tapCoordinates={reactionSelectorPosition}
      >
        <ul className="flex items-center gap-2 bg-gray-800 p-2 rounded-md">
          {predefinedReactions.map((reaction) => (
            <li
              key={reaction}
              className="flex items-center justify-center w-10 h-10 text-xl md:text-2xl text-white bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                handleCloseReactionPicker();
                handleAddReaction({ name: "reactions", emoji: reaction });
              }}
            >
              {reaction}
            </li>
          ))}
          <li
            onClick={handleOpenExpandedReactionPicker}
            className="flex items-center justify-center w-12 h-12 text-white bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer"
          >
            <FiPlus size={24} />
          </li>
        </ul>
      </PositionedWrapper>
      <ExpandedReactionPicker
        isOpen={expandedReactionPicker}
        onClose={handleCloseExpandedReactionPicker}
        handleAddReaction={handleAddReaction}
        buttonRef={buttonRef}
        position={position}
        reactionSelectorPosition={reactionSelectorPosition}
      />
    </>
  );
};

export default memo(MessageReactionSelector);
