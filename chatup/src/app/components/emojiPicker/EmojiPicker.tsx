import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FC, memo } from "react";
import { useFormContext } from "react-hook-form";
import { EmojiPickerProps } from "./EmojiPicker.types";

const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const { closeEmojiPicker } = props;
  const { getValues, setValue } = useFormContext();

  return (
    <Picker
      data={data}
      onEmojiSelect={(data: any) => {
        setValue("message", getValues("message") + data.native);
      }}
      onClickOutside={() => closeEmojiPicker()}
    />
  );
};
export default memo(EmojiPicker);
