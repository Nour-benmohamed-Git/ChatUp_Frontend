import { memo, useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { PopoverPosition, PopoverProps } from "./popover.types";

const Popover: React.FC<PopoverProps> = (props) => {
  const { actionList, position } = props;
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  const calculatePosition = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const popoverWidth = popoverRef.current?.offsetWidth;
    const popoverHeight = popoverRef.current?.offsetHeight;
    if (!buttonRect || !popoverWidth || !popoverHeight)
      return { horizontal: 0, vertical: 0 };

    let horizontal, vertical;

    switch (position) {
      case PopoverPosition.BOTTOM_RIGHT:
        horizontal =
          buttonRect.right + window.scrollX - popoverWidth + buttonRect.width;
        vertical =
          buttonRect.bottom +
            window.scrollY +
            buttonRect.height +
            popoverHeight >
          window.innerHeight
            ? buttonRect.bottom + window.scrollY - popoverHeight
            : buttonRect.bottom + window.scrollY + buttonRect.height;
        break;
      case PopoverPosition.BOTTOM_LEFT:
        horizontal = buttonRect.left - popoverWidth;
        vertical =
          buttonRect.bottom +
            window.scrollY +
            buttonRect.height +
            popoverHeight >
          window.innerHeight
            ? buttonRect.bottom + window.scrollY - popoverHeight
            : buttonRect.bottom + window.scrollY + buttonRect.height;
        break;
      case PopoverPosition.TOP_RIGHT:
        horizontal =
          buttonRect.right + window.scrollX - popoverWidth + buttonRect.width;
        vertical = buttonRect.top - popoverHeight;
        break;
      case PopoverPosition.TOP_LEFT:
        horizontal = buttonRect.left - popoverWidth;
        vertical = buttonRect.top - popoverHeight;
        break;
      default:
        horizontal = 0;
        vertical = 0;
    }
    return { horizontal, vertical };
  };

  const { horizontal, vertical } = calculatePosition();

  return (
    <div className="relative" ref={buttonRef}>
      <div
        role="button"
        onClick={togglePopover}
        className="flex justify-center items-center rounded-full h-8 w-8 bg-slate-900 text-gold-900"
      >
        <BiDotsVerticalRounded size={20} />
      </div>
      {isOpen && (
        <div
          className="absolute"
          style={{
            right: position.includes("right") ? `${horizontal}px` : "auto",
            left: position.includes("left") ? `${horizontal}px` : "auto",
            bottom: position.includes("bottom") ? `${vertical}px` : "auto",
            top: position.includes("top") ? `${vertical}px` : "auto",
          }}
          ref={popoverRef}
        >
          <div className="origin-bottom-right mt-2 w-48 bg-gray-900 p-4 rounded-md shadow-lg">
            <ul className="flex flex-col gap-4">
              {actionList.map((item) => (
                <li
                  key={item.label}
                  role="button"
                  onClick={() => {
                    togglePopover();
                    item.onClick();
                  }}
                  className="flex items-center gap-4 text-gold-900 rounded-full hover:text-gold-50"
                >
                  <div>{item.icon}</div>
                  <div>{item.name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Popover);
