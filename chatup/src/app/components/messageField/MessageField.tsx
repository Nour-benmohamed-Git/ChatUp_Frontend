import { memo } from "react";
import { Controller } from "react-hook-form";
import { FaExclamation } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { MessageFieldProps } from "./MessageField.types";

const MessageField: React.FC<MessageFieldProps> = ({
  id,
  name,
  placeholder,
  messageFieldRef,
  handleSendMessage,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <div className="relative w-full flex items-center">
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
            onKeyDown={handleKeyDown}
          />
          {fieldState?.error?.message && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <FaExclamation
                data-tooltip-id="message-field-error"
                data-tooltip-content={fieldState?.error?.message}
                data-tooltip-place="top-start"
                data-tooltip-variant="error"
                className="bg-red-500 text-white rounded-full p-1 shadow-md"
                size={22}
              />
              <Tooltip id="message-field-error"/>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default memo(MessageField);
