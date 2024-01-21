import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FC } from "react";
const EmojiPicker: FC = () => {
  return <Picker data={data} onEmojiSelect={console.log} />;
};
export default EmojiPicker;
