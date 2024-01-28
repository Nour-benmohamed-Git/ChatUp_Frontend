import { configureStore } from "@reduxjs/toolkit";
import { rtkQueryErrorsMiddleware } from "../utils/config/rtk-query-errors-middleware";
import { authApi } from "./apis/auth/authApi";
import { messageApi } from "./apis/message/messageApi";
import { profileApi } from "./apis/profile/profileApi";
import { userApi } from "./apis/user/userApi";
export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [messageApi.reducerPath]: messageApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authApi.middleware,
        userApi.middleware,
        profileApi.middleware,
        messageApi.middleware,
        rtkQueryErrorsMiddleware,
      ]),
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
