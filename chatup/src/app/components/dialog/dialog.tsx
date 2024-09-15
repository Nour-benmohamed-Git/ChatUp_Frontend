import { AnimatePresence, motion } from "framer-motion";
import { FC, memo } from "react";
import { IoIosClose } from "react-icons/io";
import { DialogProps } from "./Dialog.types";

const Dialog: FC<DialogProps> = ({
  title,
  onClose,
  children,
  actions,
  showCancelButton = true,
}) => {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 h-screen"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: "spring", damping: 15, stiffness: 300 },
          y: { duration: 0.3 },
        }}
        onClick={handleOverlayClick}
        role="dialog"
        aria-labelledby="dialog-title"
        aria-modal="true"
      >
        <div
          className="flex flex-col bg-white md:rounded-md w-full h-full md:h-auto md:max-w-md lg:max-w-lg xl:max-w-xl max-h-screen"
          // onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center border-b border-gray-300 p-4">
            <h2
              id="dialog-title"
              className="text-base md:text-lg font-semibold"
            >
              {title}
            </h2>
            <button
              className="text-gray-900 text-xl font-medium rounded-full flex justify-center items-center p-2 hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close"
            >
              <IoIosClose />
            </button>
          </div>
          <div className="flex flex-auto overflow-y-auto p-4 text-sm md:text-base font-medium">
            {children}
          </div>
          <div className="flex flex-col md:flex-row md:justify-end gap-4 border-t border-gray-300 p-4 md:p-4 mt-auto">
          {showCancelButton && (
              <button
                onClick={onClose}
                className="rounded-md bg-gray-900 px-6 py-3 text-base uppercase text-white transition duration-150 ease-in-out hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
            {actions?.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`rounded-md px-6 py-3 text-base uppercase text-white transition duration-150 ease-in-out ${
                  action.category === "dismissal"
                    ? "bg-red-600 hover:bg-red-500 disabled:bg-red-500 disabled:cursor-not-allowed"
                    : "bg-gold-900 hover:bg-gold-700 disabled:bg-gold-700 disabled:cursor-not-allowed"
                } ${action.disabled && "opacity-50"}`}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(Dialog);
