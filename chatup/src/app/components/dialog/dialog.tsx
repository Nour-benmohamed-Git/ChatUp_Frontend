import { AnimatePresence, motion } from "framer-motion";
import { FC, memo } from "react";
import { DialogProps } from "./dialog.types";
import { IoIosClose } from "react-icons/io";

const Dialog: FC<DialogProps> = ({ title, onClose, children, actions }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-40 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white border border-gray-300 rounded-md w-full sm:w-4/5 md:w-6/12 max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              className="text-gray-900 text-xl font-medium rounded-full flex justify-center items-center hover:bg-gray-100"
              onClick={onClose}
            >
             <IoIosClose/>
            </button>
          </div>
          <div className="px-6 pb-4 text-sm font-medium">{children}</div>
          <div className="p-2 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-900 px-4 py-3 text-sm uppercase text-white transition duration-150 ease-in-out hover:bg-gray-600"
            >
              Cancel
            </button>

            {actions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`rounded-md px-4 py-3 text-sm uppercase text-white transition duration-150 ease-in-out ${
                  action.category === "dismissal"
                    ? "bg-red-600 hover:bg-red-300"
                    : "bg-gold-900 hover:bg-gold-600"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(Dialog);
