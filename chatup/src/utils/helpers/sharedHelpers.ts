export function getChatSessionTitle(
  participantsData: { [userId: string]: string },
  currentUserId: string
) {
  const userIds = Object.keys(participantsData);
  const otherUserId = userIds.find((userId) => userId !== currentUserId);
  return otherUserId
    ? participantsData[otherUserId]
    : `${participantsData[currentUserId]} (YOU)`;
}
