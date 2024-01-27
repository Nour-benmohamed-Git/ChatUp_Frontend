import { motion } from "framer-motion";
import { FC, memo } from "react";
import { SlidingPanelProps } from "./sliding-panel.types";
import { ImCross } from "react-icons/im";

const SlidingPanel: FC<SlidingPanelProps> = (props) => {
  const { isOpen, togglePanel, children, fromSide, panelRef, title } = props;
  const variants = {
    open: { x: 0 },
    closed: fromSide === "right" ? { x: "100%" } : { x: "-100%" },
  };
  return (
    <motion.div
      ref={panelRef}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={variants}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 ${fromSide}-0 bottom-0 w-full ${
        fromSide === "right" ? "md:w-2/3" : "md:w-1/3"
      } bg-gradient-to-b from-slate-800 to-slate-600  shadow-md z-50`}
    >
      <header className="sticky top-0 bg-gray-900 shadow-md h-16 z-40 px-4 py-2.5">
        <div className="flex items-center gap-6 h-full">
          <button
            onClick={togglePanel}
            className="text-gold-900 rounded-full hover:text-gold-50"
          >
            <ImCross className="text-sm" />
          </button>
          <div className="text-md font-medium text-gold-600">{title}</div>
        </div>
      </header>
      <div className="px-4 py-2.5 h-full">{children}</div>
    </motion.div>
  );
};

export default memo(SlidingPanel);
