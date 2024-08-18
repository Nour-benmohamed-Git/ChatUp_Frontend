import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PositionedWrapperProps } from "./PositionedWrapper.types";

const PositionedWrapper: React.FC<PositionedWrapperProps> = ({
  isOpen,
  onClose,
  buttonRef,
  tapCoordinates,
  position,
  children,
}) => {
  const [menuPosition, setMenuPosition] = useState<{
    vertical: number;
    horizontal: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node) &&
      isOpen
    ) {
      onClose();
    }
  };

  const handleResize = () => {
    onClose();
  };

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current && wrapperRef.current) {
      const { height: wrapperHeight, width: wrapperWidth } =
        wrapperRef.current.getBoundingClientRect();

      let vertical = 0;
      let horizontal = 0;

      if (tapCoordinates) {
        horizontal = (window.innerWidth - wrapperWidth) / 2;
        vertical = tapCoordinates.y - wrapperHeight / 2; // Center vertically
      } else {
        const {
          top: buttonTop,
          bottom: buttonBottom,
          left: buttonLeft,
          right: buttonRight,
          height: buttonHeight,
          width: buttonWidth,
        } = buttonRef.current.getBoundingClientRect();

        switch (position) {
          case "top-left":
            vertical =
              buttonTop <= wrapperHeight + 64
                ? buttonTop + buttonHeight
                : buttonTop - wrapperHeight;
            horizontal =
              buttonLeft <= wrapperWidth
                ? buttonLeft + buttonWidth
                : buttonLeft - wrapperWidth;
            break;
          case "top-right":
            vertical =
              buttonTop <= wrapperHeight + 64
                ? buttonTop + buttonHeight
                : buttonTop - wrapperHeight;
            horizontal =
              window.innerWidth - buttonRight <= wrapperWidth
                ? window.innerWidth - buttonLeft
                : window.innerWidth - (buttonLeft + wrapperWidth + buttonWidth);
            break;
          case "bottom-left":
            vertical =
              buttonBottom >= wrapperHeight + 64
                ? window.innerHeight - buttonTop
                : window.innerHeight - (buttonBottom + wrapperHeight);
            horizontal = buttonLeft - wrapperWidth;
            break;
          case "bottom-right":
            vertical =
              buttonBottom >= wrapperHeight + 64
                ? window.innerHeight - buttonTop
                : window.innerHeight - (buttonBottom + wrapperHeight);
            horizontal =
              window.innerWidth - buttonRight <= wrapperWidth
                ? window.innerWidth - buttonLeft
                : window.innerWidth - (buttonLeft + wrapperWidth + buttonWidth);
            break;
          default:
            vertical =
              buttonTop <= wrapperHeight + 64
                ? buttonTop + buttonHeight
                : buttonTop - wrapperHeight;
            horizontal =
              buttonLeft <= wrapperWidth
                ? buttonLeft + buttonWidth
                : buttonLeft - wrapperWidth;
            break;
        }
      }
      // Ensure the menu is fully visible vertically
      if (vertical < 0) {
        vertical = 64; // Push it down to be fully visible
      } else if (vertical + wrapperHeight > window.innerHeight) {
        vertical = window.innerHeight - wrapperHeight - 64; // Push it up to be fully visible
      }
      // if (horizontal < 0) {
      //   horizontal = 0; // Push it to the left edge
      // } else if (horizontal + wrapperWidth > window.innerWidth) {
      //   horizontal = (window.innerWidth - wrapperWidth) / 2; // Center it if it overflows
      // }
      setMenuPosition({ vertical, horizontal });
    }
  }, [isOpen, buttonRef, position, tapCoordinates]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", handleResize);
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const wrapperStyle = useMemo(() => {
    if (!menuPosition) {
      return { opacity: 0 };
    }

    const { vertical, horizontal } = menuPosition;

    return {
      opacity: 1,
      top: position?.includes("top") ? vertical : "auto",
      bottom: position?.includes("bottom") ? vertical : "auto",
      left: position?.includes("left") ? horizontal : "auto",
      right: position?.includes("right") ? horizontal : "auto",
    };
  }, [menuPosition, position]);

  return (
    isOpen && (
      <div className="fixed z-50 inset-0 cursor-pointer">
        <motion.div
          ref={wrapperRef}
          className="fixed min-w-48 shadow-2xl"
          style={wrapperStyle}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    )
  );
};

export default PositionedWrapper;
