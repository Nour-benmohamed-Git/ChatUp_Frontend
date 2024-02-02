import { ChatSessionResponse, ChatSessionsResponse } from "@/types/ChatSession";
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
      ChatSessionResponse,
      { secondMemberId: number }
    >({
      query: (data) => ({
        url: endpoints.chatSession,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "ChatSessions", id: "LIST" }],
    }),
    UpdateChatSession: build.mutation<ChatSessionResponse, ChatSessionResponse>(
      {
        query: (data) => ({
          url: endpoints.chatSession,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "ChatSessions", id: arg.id },
        ],
      }
    ),
  }),
});

export const {
  useGetCurrentUserChatSessionsQuery,
  useGetChatSessionByParticipantsMutation,
  useAddChatSessionMutation,
  useUpdateChatSessionMutation,
} = chatSessionsApi;
