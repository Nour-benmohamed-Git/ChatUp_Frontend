import { configureStore } from "@reduxjs/toolkit";
import { rtkQueryErrorsMiddleware } from "../utils/config/rtk-query-errors-middleware";
import { chatSessionsApi } from "./apis/chat-sessions/chatSessionsApi";
import { profileApi } from "./apis/profile/profileApi";
import { userApi } from "./apis/user/userApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [userApi.reducerPath]: userApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [chatSessionsApi.reducerPath]: chatSessionsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        userApi.middleware,
        profileApi.middleware,
        chatSessionsApi.middleware,
        rtkQueryErrorsMiddleware,
      ]),
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
