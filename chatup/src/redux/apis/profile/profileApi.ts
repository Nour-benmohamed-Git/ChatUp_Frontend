import { UsersResponse } from "@/types/User";
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
  endpoints: (build) => ({
    getCurrentUser: build.query<UsersResponse, void>({
      query() {
        return {
          url: endpoints.currentUser,
        };
      },
    }),
  }),
});

export const { useGetCurrentUserQuery } = profileApi;
