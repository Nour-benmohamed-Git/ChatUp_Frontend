"use server";
import { ConversationResponse } from "@/types/ChatSession";
import { ChatSessionType } from "@/utils/constants/globals";
import { groupConversationSchema } from "@/utils/schemas/conversationSchemaSchema";
import { FetchError, fetchFromServer } from "../fetchFromServer";

export const addConversation = async (
  currentState: { error: FetchError } | null = null,
  data: FormData
) => {
  const values = Object.fromEntries(data);
  if (typeof values.otherMembersIds === "string") {
    values.otherMembersIds = JSON.parse(values.otherMembersIds);
  }
  let parsedData;

  if (values.type === ChatSessionType.GROUP) {
    parsedData = groupConversationSchema.safeParse(values);
    if (parsedData.success) {
      return fetchFromServer<{ data: ConversationResponse }, FormData>(
        `/api/chat-sessions`,
        {
          method: "POST",
          body: data,
        }
      );
    } else {
      console.log(parsedData.error);
    }
  } else {
    return fetchFromServer<{ data: ConversationResponse }, FormData>(
      `/api/chat-sessions`,
      {
        method: "POST",
        body: data,
      }
    );
  }
};
