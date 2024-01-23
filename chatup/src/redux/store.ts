import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth/authApi";
import { rtkQueryErrorLogger } from "../utils/config/CustomRtkQueryErrorLogger";
export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([authApi.middleware, rtkQueryErrorLogger]),
  });
};
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
