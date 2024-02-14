import { UserResponse } from "@/types/User";
import environment from "@/utils/config/environment";
import { prepareHeaders } from "@/utils/config/rtk-prepare-headers";
import { endpoints } from "@/utils/constants/endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: environment.baseUrl,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ["Profile"],
  endpoints: (build) => ({
    getCurrentUser: build.query<{ data: UserResponse }, void>({
      query: () => endpoints.currentUser,
      providesTags: ["Profile"],
    }),
    editCurrentUser: build.mutation({
      query: (body: any) => ({
        url: endpoints.currentUser,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: () => ["Profile"],
    }),
  }),
});

export const { useGetCurrentUserQuery, useEditCurrentUserMutation } =
  profileApi;
