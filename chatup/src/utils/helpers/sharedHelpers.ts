import { ConversationResponse } from "@/types/ChatSession";
import { ConversationCombinedType } from "@/types/ConversationCombinedType";
import { UserResponse } from "@/types/User";
import { toast } from "sonner";
import environment from "../config/environment";
import {
  allowedExtensions,
  ChatSessionType,
  maxFileSize,
  units,
} from "../constants/globals";
import { compactDateAndTimeFormatter } from "./dateHelpers";

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

export function isValidFileExtension(file: File): {
  isValid: boolean;
  message: string;
} {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const isValid =
    extension !== undefined && allowedExtensions.includes(extension);
  return {
    isValid,
    message: isValid
      ? ""
      : `Invalid file type "${extension}" for file "${file.name}".`,
  };
}

export const isValidFileSize = (file: File) => {
  const isValid = file.size <= maxFileSize;
  return {
    isValid,
    message: isValid ? "" : `File "${file.name}" exceeds 5 MB in size.`,
  };
};

export const createConversationCombinedData = (
  conversation: ConversationResponse,
  userData?: UserResponse,
  currentUserId?: string
): ConversationCombinedType => {
  if (userData) {
    return {
      conversationId: conversation?.id || "new",
      type: ChatSessionType.INDIVIDUAL,
      title: userData.username,
      image: userData.profilePicture,
      subTitle: userData.email,
      description: userData.profileInfo,
      members: conversation?.participantsData || {},
      additionalInfo: userData.id,
    };
  } else {
    const updatedMembers = Object.entries(conversation.participantsData).map(
      ([id, username]) => (id === currentUserId ? "you" : username)
    );

    const [creatorId, creatorName] = Object.entries(
      conversation.groupAdmins
    )[0] || [null, "unknown"];
    return {
      conversationId: conversation.id,
      type: conversation.type,
      title: conversation.title,
      image: conversation.image,
      subTitle: `Group · ${
        Object.keys(conversation.participantsData).length
      } members`,
      description: `Group created by ${
        creatorId === currentUserId ? "you" : creatorName
      }, ${compactDateAndTimeFormatter(conversation.creationDate)}`,
      members: conversation.participantsData,
      admins: conversation.groupAdmins,
      additionalInfo: updatedMembers,
    };
  }
};

export const getMediaRecordError = async (error: string) => {
  switch (error) {
    case "permission_denied":
      toast.error(
        "Permission to access the microphone was denied. Please enable it in your browser settings."
      );
      break;

    case "media_aborted":
      toast.error("Media recording was aborted.");
      break;

    case "no_specified_media_found":
      toast.error("No media device found.");
      break;

    case "media_in_use":
      toast.error("Media device is currently in use.");
      break;

    case "invalid_media_constraints":
      toast.error("Invalid media constraints.");
      break;

    case "no_constraints":
      toast.error("No media constraints provided.");
      break;

    case "recorder_error":
      toast.error("An error occurred with the media recorder.");
      break;

    default:
      toast.error("An unknown error occurred.");
      break;
  }
};
export const convertBlobToFile = async (
  blobUrl: string,
  filename: string
): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};
