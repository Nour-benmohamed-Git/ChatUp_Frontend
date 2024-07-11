import { useEffect, useRef, useState } from "react";

const usePanel = (closeOnClickOutside: boolean = true) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const togglePanel = (_event?: React.MouseEvent) => {
    setIsOpen((prev) => !prev);
  };
  useEffect(() => {
    if (!closeOnClickOutside) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return { isOpen, panelRef, togglePanel };
};
export default usePanel;
