import React from "react";
import EmojiPicker from "../emojiPicker/EmojiPicker";
import PositionedWrapper from "../positionedWrapper/PositionedWrapper";
import { ExpandedReactionPickerProps } from "./ExpandedReactionPicker.types";

const ExpandedReactionPicker: React.FC<ExpandedReactionPickerProps> = ({
  isOpen,
  onClose,
  buttonRef,
  position,
  reactionSelectorPosition,
  handleAddReaction
}) => {
  return (
    <PositionedWrapper
      isOpen={isOpen}
      onClose={onClose}
      buttonRef={buttonRef}
      position={position}
      tapCoordinates={reactionSelectorPosition}
    >
      <EmojiPicker
        closeEmojiPicker={onClose}
        handleEmojiSelect={handleAddReaction}
        name="reactions"
      />
    </PositionedWrapper>
  );
};

export default ExpandedReactionPicker;
