import React, { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MenuPosition, MenuProps } from "./menu.types";

const Menu: React.FC<MenuProps> = ({
  actionList,
  isOpen,
  onClose,
  buttonRef,
  position,
}) => {
  const [menuPosition, setMenuPosition] = useState<{
    vertical: number;
    horizontal: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen && buttonRef.current && menuRef.current) {
      const {
        top: buttonTop,
        left: buttonLeft,
        bottom: buttonBottom,
        right: buttonRight,
        height: buttonHeight,
        width: buttonWidth,
        x,
        y,
      } = buttonRef.current.getBoundingClientRect();
      const { height: menuHeight, width: menuWidth } =
        menuRef.current.getBoundingClientRect();
      switch (position) {
        case MenuPosition.TOP_LEFT:
          setMenuPosition({
            vertical: buttonTop - menuHeight - window.scrollY,
            horizontal: buttonRight - buttonWidth - menuWidth,
          });
          break;
        case MenuPosition.TOP_RIGHT:
          setMenuPosition({
            vertical: buttonTop - menuHeight,
            horizontal:
              window.innerWidth - (buttonLeft + menuWidth + buttonWidth),
          });
          break;
        case MenuPosition.BOTTOM_LEFT:
          setMenuPosition({
            vertical: window.innerHeight - (buttonBottom + menuHeight),
            horizontal: buttonLeft - menuWidth,
          });
          break;
        case MenuPosition.BOTTOM_RIGHT:
          setMenuPosition({
            vertical: window.innerHeight - (buttonBottom + menuHeight),
            horizontal:
              window.innerWidth - (buttonLeft + menuWidth + buttonWidth),
          });
          break;
        default:
          setMenuPosition({
            vertical: buttonTop - menuHeight,
            horizontal: buttonLeft + buttonWidth,
          });
          break;
      }
    }
  }, [isOpen, buttonRef]);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);
  return isOpen
    ? createPortal(
        <div
          ref={menuRef}
          className="fixed z-50 w-48 bg-gray-900 p-4 rounded-md shadow-lg"
          style={{
            top: position?.includes("top") ? menuPosition?.vertical : "auto",
            bottom: position?.includes("bottom")
              ? menuPosition?.vertical
              : "auto",
            left: position?.includes("left")
              ? menuPosition?.horizontal
              : "auto",
            right: position?.includes("right")
              ? menuPosition?.horizontal
              : "auto",
          }}
        >
          <ul className="flex flex-col gap-4">
            {actionList.map((item) => (
              <li
                key={item.label}
                role="button"
                onClick={() => {
                  onClose();
                  item.onClick();
                }}
                className="flex items-center gap-4 text-gold-900 rounded-full hover:text-gold-300"
              >
                <div>{item.icon}</div>
                <div>{item.name}</div>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )
    : null;
};

export default memo(Menu);
