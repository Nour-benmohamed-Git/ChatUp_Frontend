import PositionedWrapper from "@/app/components/positionedWrapper/PositionedWrapper";
import React, { memo, useRef, useState } from "react";
import ReactionItem from "../reactionItem/ReactionItem";
import { ReactionListProps } from "./ReactionList.types";

const ReactionList: React.FC<ReactionListProps> = ({ position, reactions }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleEmojiClick = (emoji: string | null) => {
    setSelectedEmoji(emoji);
  };

  // Count the occurrences of each emoji
  const emojiCounts = Object.values(reactions).reduce((acc, emoji) => {
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredReactions = selectedEmoji
    ? Object.entries(reactions).filter(([_, emoji]) => emoji === selectedEmoji)
    : Object.entries(reactions);

  const uniqueEmojis = [...new Set(Object.values(reactions))];

  return (
    <>
      {Object.keys(reactions).length > 0 ? (
        <div
          ref={buttonRef}
          role="button"
          onClick={handleOpenMenu}
          className="absolute bottom-[-10px] right-4 flex items-center gap-1 bg-gray-100 rounded-lg p-1 shadow-md"
        >
          <span className="text-xs">
            {
              reactions[
                Object.keys(reactions)[Object.keys(reactions).length - 1] as any
              ]
            }
          </span>
          <span className="text-xs text-gray-900">
            {Object.keys(reactions).length}
          </span>
        </div>
      ) : null}
      <PositionedWrapper
        isOpen={openMenu}
        onClose={handleCloseMenu}
        buttonRef={buttonRef}
        position={position}
      >
        <div className="flex w-80 md:w-96 h-80 flex-col bg-white p-2 rounded-md">
          {/* Header with "All" option and emojis */}
          <div className="flex gap-2 px-2 justify-start items-center overflow-x-auto">
            {/* "All" button */}
            <div
              onClick={() => handleEmojiClick(null)}
              className={`cursor-pointer text-gray-900 flex items-center justify-center w-10 h-8 text-md border-b-2 ${
                selectedEmoji === null
                  ? "border-gold-600"
                  : "border-transparent"
              }`}
            >
              All
            </div>
            {uniqueEmojis.map((emoji) => (
              <div
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={`cursor-pointer text-gray-900 flex items-center justify-center w-10 h-8 text-md border-b-2 ${
                  selectedEmoji === emoji
                    ? "border-gold-600"
                    : "border-transparent"
                }`}
              >
                {emoji} {emojiCounts[emoji]}
              </div>
            ))}
          </div>
          {/* Filtered list of reactions */}
          <div className="flex flex-col gap-1 overflow-y-auto">
            {filteredReactions.map(([userId, emoji]) => (
              <ReactionItem key={userId} userId={userId} emoji={emoji} />
            ))}
          </div>
        </div>
      </PositionedWrapper>
    </>
  );
};
export default memo(ReactionList);
