import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getErrorMessage = (
  error?: FetchBaseQueryError | SerializedError
) => {
  if (error && "error" in error) {
    return error.error;
  }
  return null;
};
