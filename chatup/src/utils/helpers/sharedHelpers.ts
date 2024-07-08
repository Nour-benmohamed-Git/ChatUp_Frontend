import { toast } from "sonner";
import environment from "../config/environment";
import { units } from "../constants/globals";

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

export const formatFileSize = (sizeInBytes: number): string => {
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};
export const downloadFile = async (fileName: string) => {
  try {
    const response = await fetch(`${environment.baseUrl}/uploads/${fileName}`);
    const blob = await response.blob();
    const fileUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.setAttribute("download", fileName);
    link.click();
    toast.success("file downloaded successfully");

    URL.revokeObjectURL(fileUrl);
  } catch (error) {
    toast.error("An error occurred while downloading the file.");
  }
};

