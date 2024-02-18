import { ChatSessionResponse, ChatSessionsResponse } from "@/types/ChatSession";
import { MessagesResponse } from "@/types/Message";
import environment from "@/utils/config/environment";
import { prepareHeaders } from "@/utils/config/rtk-prepare-headers";
import { endpoints } from "@/utils/constants/endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatSessionsApi = createApi({
  reducerPath: "chatSessionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: environment.baseUrl,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ["ChatSessions"],
  endpoints: (build) => ({
    getCurrentUserChatSessions: build.query<ChatSessionsResponse, void>({
      query() {
        return {
          url: endpoints.getCurrentUserChatSessions,
        };
      },
      providesTags: (result, _error, _args) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "ChatSessions" as const,
                id,
              })),
              { type: "ChatSessions", id: "LIST" },
            ]
          : [{ type: "ChatSessions", id: "LIST" }],
    }),
    getMessagesByChatSessionId: build.query<MessagesResponse, number>({
      query: (chatSessionId) =>
        endpoints.getMessagesByChatSession.replace("id", `${chatSessionId}`),
    }),
    getChatSessionByParticipants: build.mutation<
      { data: ChatSessionResponse },
      { secondMemberId: number }
    >({
      query(data) {
        return {
          url: endpoints.getChatSessionByParticipants,
          method: "POST",
          body: data,
        };
      },
    }),
    addChatSession: build.mutation<
      { data: ChatSessionResponse },
      { secondMemberId: number }
    >({
      query: (data) => ({
        url: endpoints.chatSession,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ChatSessions", id: "LIST" }],
    }),
    updateChatSession: build.mutation<
      { data: ChatSessionResponse },
      { id: number }
    >({
      query: (data) => ({
        url: endpoints.removeOrUpdateChatSession.replace("id", `${data.id}`),
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "ChatSessions", id: arg.id },
      ],
    }),
    deleteChatSession: build.mutation<
      { data: ChatSessionResponse },
      { id: number }
    >({
      query: (data) => ({
        url: endpoints.removeOrUpdateChatSession.replace("id", `${data.id}`),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "ChatSessions", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetCurrentUserChatSessionsQuery,
  useGetChatSessionByParticipantsMutation,
  useAddChatSessionMutation,
  useUpdateChatSessionMutation,
  useGetMessagesByChatSessionIdQuery,
  useDeleteChatSessionMutation,
} = chatSessionsApi;
