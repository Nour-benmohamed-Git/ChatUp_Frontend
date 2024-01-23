import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    // if (action?.meta?.baseQueryMeta?.response?.status === globalVariables.UNAUTHORIZED_CODE) {
    //   localStorage.clear();
    //   window.location.replace(paths.SIGNIN);
    //   toast.error(action?.payload?.data?.message, {
    //     position: 'top-right',
    //   });
    // }
  }
  return next(action);
};
