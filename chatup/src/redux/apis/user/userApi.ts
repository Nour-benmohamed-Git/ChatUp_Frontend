import { UserResponse, UsersResponse } from "@/types/User";
import environment from "@/utils/config/environment";
import { prepareHeaders } from "@/utils/config/rtk-prepare-headers";
import { endpoints } from "@/utils/constants/endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: environment.baseUrl,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ["Users"],
  endpoints: (build) => ({
    getUsers: build.query<UsersResponse, void>({
      query() {
        return {
          url: endpoints.user,
        };
      },
      // providesTags: (result) =>
      //   result ? result.map(({ id }) => ({ type: "Users", id })) : [],
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
