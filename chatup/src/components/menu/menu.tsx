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
        bottom: buttonBottom,
        left: buttonLeft,
        right: buttonRight,
        height: buttonHeight,
        width: buttonWidth,
      } = buttonRef.current.getBoundingClientRect();
      const { height: menuHeight, width: menuWidth } =
        menuRef.current.getBoundingClientRect();
      switch (position) {
        case MenuPosition.TOP_LEFT:
          setMenuPosition({
            vertical:
              buttonTop <= menuHeight + 64
                ? buttonTop + buttonHeight
                : buttonTop - menuHeight,
            horizontal:
              buttonLeft <= menuWidth
                ? buttonLeft + buttonWidth
                : buttonLeft - menuWidth,
          });
          break;
        case MenuPosition.TOP_RIGHT:
          setMenuPosition({
            vertical:
              buttonTop <= menuHeight + 64
                ? buttonTop + buttonHeight
                : buttonTop - menuHeight,
            horizontal:
              window.innerWidth - buttonRight <= menuWidth
                ? window.innerWidth - buttonLeft
                : window.innerWidth - (buttonLeft + menuWidth + buttonWidth),
          });
          break;
        case MenuPosition.BOTTOM_LEFT:
          setMenuPosition({
            vertical:
              buttonBottom >= menuHeight + 64
                ? window.innerHeight - buttonTop
                : window.innerHeight - (buttonBottom + menuHeight),
            horizontal: buttonLeft - menuWidth,
          });
          break;
        case MenuPosition.BOTTOM_RIGHT:
          setMenuPosition({
            vertical:
              buttonBottom >= menuHeight + 64
                ? window.innerHeight - buttonTop
                : window.innerHeight - (buttonBottom + menuHeight),
            horizontal:
              window.innerWidth - buttonRight <= menuWidth
                ? window.innerWidth - buttonLeft
                : window.innerWidth - (buttonLeft + menuWidth + buttonWidth),
          });
          break;
        default:
          setMenuPosition({
            vertical:
              buttonTop <= menuHeight + 64
                ? buttonTop + buttonHeight
                : buttonTop - menuHeight,
            horizontal:
              buttonLeft <= menuWidth
                ? buttonLeft + buttonWidth
                : buttonLeft - menuWidth,
          });
          break;
      }
    }
  }, [isOpen, buttonRef, menuRef]);
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
  }, [isOpen, menuRef]);
  return isOpen
    ? createPortal(
        <div className="fixed z-50 inset-0 cursor-pointer">
          <div
            ref={menuRef}
            className="fixed z-50 min-w-48 bg-gray-800 p-4 rounded-md shadow-2xl"
            style={{
              opacity: menuPosition ? 1 : 0,
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
                  className="flex items-center gap-4 text-white rounded-full hover:text-gold-900 text-sm"
                >
                  <div>{item.icon}</div>
                  <div>{item.name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default memo(Menu);
