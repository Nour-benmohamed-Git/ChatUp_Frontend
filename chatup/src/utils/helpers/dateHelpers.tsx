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

export const renderDateChip = (messageDate: string) => {
  const now = dayjs(); // Current date/time
  const date = dayjs(messageDate, "YYYY-MM-DD"); // Parse messageDate with format 'DD/MM/YYYY'

  if (!date.isValid()) {
    return null; // Handle invalid date input gracefully
  }
  // Check if it's today
  if (date.isSame(now, "day")) {
    return <Chip content="Today" />;
  }

  // Check if it's yesterday
  if (date.isSame(now.subtract(1, "day"), "day")) {
    return <Chip content="Yesterday" />;
  }

  // Check if it's within the last week
  if (date.isAfter(now.subtract(7, "day"))) {
    return <Chip content={date.format("dddd")} />; // Display day name (e.g., Monday, Tuesday)
  }

  // Check if it's within the same year (but older than a week)
  if (date.isSame(now, "year")) {
    return <Chip content={date.format("MMM D")} />; // Display month and day (e.g., Jan 1)
  }

  // For older messages, display the full date
  return <Chip content={date.format("MMM D, YYYY")} />; // Display full date (e.g., Jan 1, 2023)
};

export const compactDateAndTimeFormatter = (timestamp: number) => {
  return dayjs(timestamp * 1000).format("MMMM D, YYYY [at] hh:mm A");
};
export const groupMessagesByDate = (messages: Message[]) => {
  return messages.reduce(
    (acc: { [date: string]: Message[] }, message: Message) => {
      const messageDate = dayjs(message.timestamp * 1000).format("YYYY-MM-DD");

      if (!acc[messageDate]) {
        acc[messageDate] = [];
      }
      acc[messageDate].push(message);
      return acc;
    },
    {}
  );
};
