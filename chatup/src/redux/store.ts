import { configureStore } from "@reduxjs/toolkit";
import { rtkQueryErrorsMiddleware } from "../utils/config/rtk-query-errors-middleware";
import { authApi } from "./apis/auth/authApi";
import userSlice from "./slices/userSlice";
import { userApi } from "./apis/user/userApi";
export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      userSlice: userSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authApi.middleware,
        userApi.middleware,
        rtkQueryErrorsMiddleware,
      ]),
  });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
