import dayjs from "dayjs";

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
