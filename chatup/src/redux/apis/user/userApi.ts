import { UsersResponse } from "@/types/User";
import environment from "@/utils/config/environment";
import { prepareHeaders } from "@/utils/config/rtk-prepare-headers";
import { endpoints } from "@/utils/constants/endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: environment.baseUrl,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (build) => ({
    getUsers: build.query<UsersResponse, void>({
      query() {
        return {
          url: endpoints.getUsers,
        };
      },
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
