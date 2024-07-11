import { AnimatePresence, motion } from "framer-motion";
import { FC, memo } from "react";
import { ImCross } from "react-icons/im";
import { SlidingPanelProps } from "./SlidingPanel.types";

const SlidingPanel: FC<SlidingPanelProps> = (props) => {
  const {
    isOpen,
    togglePanel,
    children,
    fromSide,
    panelRef,
    title,
    panelHeight = "h-full",
    panelWidth = "w-full",
    hasHeader = true,
    zIndex = "z-50",
  } = props;
  const variants = {
    open: { x: 0, y: 0 },
    closed: {
      x: fromSide === "right" ? "100%" : fromSide === "left" ? "-100%" : 0,
      y: fromSide === "top" ? "-100%" : fromSide === "bottom" ? "100%" : 0,
    },
  };

  const panelPositionClasses = () => {
    switch (fromSide) {
      case "right":
        return "right-0 top-0";
      case "left":
        return "left-0 top-0";
      case "top":
        return "left-0 top-0";
      case "bottom":
        return "left-0 bottom-0";
      default:
        return "";
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className={`absolute ${panelPositionClasses()} ${panelHeight} ${panelWidth} bg-gradient-to-b from-slate-800 to-slate-600 shadow-md ${zIndex}`}
        >
          {hasHeader && (
            <header className="sticky top-0 bg-gray-900 shadow-md h-16 z-40 px-4 py-2.5">
              <div className="flex items-center gap-6 h-full">
                <button
                  onClick={togglePanel}
                  className="text-gold-900 rounded-full hover:text-gold-300"
                >
                  <ImCross className="text-sm" />
                </button>
                <div className="text-md font-medium text-gold-600">{title}</div>
              </div>
            </header>
          )}
          <div
            className={`flex w-full ${
              hasHeader ? "h-[calc(100%-4rem)]" : "h-full items-end"
            }`}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(SlidingPanel);
