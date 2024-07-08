import { memo } from "react";
import { Controller } from "react-hook-form";
import { MessageFieldProps } from "./MessageField.types";

const MessageField: React.FC<MessageFieldProps> = ({
  id,
  name,
  placeholder,
  messageFieldRef,
}) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <div className="flex items-center justify-center w-full">
          <textarea
            {...field}
            autoFocus
            id={id}
            name={name}
            ref={messageFieldRef}
            rows={1}
            style={{
              resize: "none",
            }}
            placeholder={placeholder}
            className={`focus:outline-none border-2 text-sm rounded-md w-full focus:${"border-2 border-gold-600"} p-2 min-h-10 max-h-32`}
          />
        </div>
      )}
    />
  );
};

export default memo(MessageField);
