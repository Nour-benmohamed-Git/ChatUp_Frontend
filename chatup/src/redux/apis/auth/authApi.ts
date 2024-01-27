import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { endpoints } from "@/utils/constants/endpoints";
import environment from "@/utils/config/environment";
import { UserSignInRequest } from "@/types/UserSignIn";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: environment.baseUrl,
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query(data: UserSignInRequest) {
        return {
          url: endpoints.signIn,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});
export const { useSignInMutation } = authApi;
