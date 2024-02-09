import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { paths } from "../constants/paths";
import { globals } from "../constants/globals";

export const rtkQueryErrorsMiddleware: Middleware =
  () => (next) => (action: any) => {
    if (isRejectedWithValue(action)) {
      const { payload } = action;
      const error = payload?.data?.error;
      const statusCode = payload?.status;

      if (statusCode === globals.unauthorizedCode) {
        window.location.replace(paths.authRoutes.signIn);
      }

      if (error) {
        toast.error(error);
      }
    }
    return next(action);
  };
