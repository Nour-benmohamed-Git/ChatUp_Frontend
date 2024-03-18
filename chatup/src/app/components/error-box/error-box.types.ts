import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface ErrorBoxProps {
  error?: FetchBaseQueryError | SerializedError ;
}
