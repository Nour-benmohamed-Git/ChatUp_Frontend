import { UserResponse } from "@/types/User";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface ProfileProps {
  data?: UserResponse;
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
}
