import { useEffect, useState } from "react";
import { PiArrowFatLineDownFill } from "react-icons/pi";
import { ScrollToBottomButtonProps } from "./ScrollToBottomButton.types";

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  targetRef,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;
      const { scrollTop, clientHeight } = targetRef.current;
      setIsVisible(scrollTop < -(clientHeight / 2));
    };
    handleScroll();
    targetRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      targetRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [targetRef]);

  const scrollToBottom = () => {
    // Scroll to the bottom of the div when button is clicked
    if (targetRef.current) {
      targetRef.current?.scrollTo({
        top: targetRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      id="scrollToBottomBtn"
      onClick={scrollToBottom}
      className={`absolute rounded-md bottom-4 right-4 bg-gold-300 animate-bounce border-2 shadow-2xl z-40`}
      style={{ display: isVisible ? "block" : "none" }}
    >
      <PiArrowFatLineDownFill size={36} className="text-gray-900" />
    </button>
  );
};

export default ScrollToBottomButton;
