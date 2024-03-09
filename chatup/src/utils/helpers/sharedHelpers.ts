export function getOtherUserId(
  participantsData: { [userId: string]: string },
  currentUserId: string
) {
  const userIds = Object?.keys(participantsData);
  const otherUserId = userIds?.find((userId) => userId !== currentUserId);
  return userIds?.length === 2
    ? parseInt(otherUserId as string, 10)
    : parseInt(currentUserId, 10);
}

export function convertSearchParams(searchParams: {
  [key: string]: string | undefined;
}): { [key: string]: number | boolean | string | undefined } {
  const convertedParams: {
    [key: string]: number | boolean | string | undefined;
  } = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === undefined) {
      convertedParams[key] = undefined;
    } else {
      const lowerCaseValue = value.toLowerCase();
      convertedParams[key] =
        lowerCaseValue === "true"
          ? true
          : lowerCaseValue === "false"
          ? false
          : !isNaN(Number(value))
          ? Number(value)
          : value;
    }
  }

  return convertedParams;
}
