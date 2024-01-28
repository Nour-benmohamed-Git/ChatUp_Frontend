import { MessagesResponse } from "@/types/Message";
import environment from "@/utils/config/environment";
import { prepareHeaders } from "@/utils/config/rtk-prepare-headers";
import { endpoints } from "@/utils/constants/endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: environment.baseUrl,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getMessageByChatSessionId: builder.query<MessagesResponse, number>({
      query: (chatSessionId) =>
        endpoints.getMessagesByChatSession.replace("id", `${chatSessionId}`),
    }),
  }),
});
export const { useGetMessageByChatSessionIdQuery } = messageApi;
