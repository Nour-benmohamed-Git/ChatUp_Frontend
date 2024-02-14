import { globals } from "../constants/globals";
import { getItem } from "./cookies-helpers";

export function getChatSessionTitle(participantsData: {
  [userId: string]: string;
}) {
  const currentUserId = getItem(globals.currentUserId) as string;
  const userIds = Object.keys(participantsData);
  const otherUserId = userIds.find((userId) => userId !== currentUserId);

  return otherUserId
    ? participantsData[otherUserId]
    : `${participantsData[currentUserId]} (YOU)`;
}
export function getOtherUserId(participantsData: { [userId: string]: string }) {
  const currentUserId = getItem(globals.currentUserId) as string;
  const userIds = Object.keys(participantsData);
  const otherUserId = userIds.find((userId) => userId !== currentUserId);
  return userIds.length === 2 ? Number(otherUserId) : Number(currentUserId);
}
