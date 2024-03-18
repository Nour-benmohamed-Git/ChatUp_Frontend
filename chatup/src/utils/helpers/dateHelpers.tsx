import { Message } from "@/types/Message";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";
const Chip = dynamic(() => import("@/app/components/chip/Chip"), {
  ssr: false,
});
export const formatChatSessionDate = (day?: number) => {
  if (!day) return "";
  const currentTime = dayjs();
  const targetTime = dayjs(day * 1000);

  if (currentTime.isSame(targetTime, "day")) {
    return targetTime.format("HH:mm");
  } else if (currentTime.isSame(targetTime, "week")) {
    return targetTime.format("dddd");
  } else {
    return targetTime.format("DD/MM/YYYY");
  }
};
export const formatMessageDate = (day?: number) => {
  if (!day) return "";
  const targetTime = dayjs(day * 1000);
  return targetTime.format("HH:mm");
};
dayjs.extend(relativeTime);

export const renderDateChip = (
  messageDate: number,
  index: number,
  messages: Message[]
) => {
  // Multiply by 1000 to convert seconds to milliseconds
  const messageDay = dayjs(messageDate * 1000);

  // Check if it's the first message
  if (index === 0) {
    return <Chip content={messageDay.fromNow()} />;
  }

  // Get the previous message date
  const prevMessageDate = dayjs(
    (messages?.[index - 1].timestamp as number) * 1000
  );

  // Check if it's the same day as the previous message
  if (messageDay.isSame(prevMessageDate, "day")) {
    return null; // No chip needed
  }

  // Check if it's yesterday
  if (messageDay.isSame(prevMessageDate.subtract(1, "day"), "day")) {
    return <Chip content="Yesterday" />;
  }

  // Check if it's within the last week
  if (messageDay.isAfter(dayjs().subtract(7, "day"))) {
    return <Chip content={messageDay.format("dddd")} />;
  }

  // For older messages, just display the date
  return <Chip content={messageDay.format("MMM D, YYYY")} />;
};
