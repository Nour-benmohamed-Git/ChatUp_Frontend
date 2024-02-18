import { UserResponse, UsersResponse } from "@/types/User";
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
    getUsers: build.query<
      UsersResponse,
      {
        page: number;
        offset: number;
        search: string;
        order?: string;
      }
    >({
      query(params: {
        page: number;
        offset: number;
        search: string;
        order?: string;
      }) {
        return {
          url: endpoints.getUsers,
          params: { ...params },
        };
      },
    }),
    getUserById: build.query<{ data: UserResponse }, number>({
      query(userId: number) {
        return {
          url: `${endpoints.getUsers}/${userId}`,
        };
      },
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = userApi;
