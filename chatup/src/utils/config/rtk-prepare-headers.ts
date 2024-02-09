import { globals } from "../constants/globals";
import { getItem } from "../helpers/cookies-helpers";

export const prepareHeaders = (headers: Headers) => {
  const token = getItem(globals.tokenKey);
  if (token) {
    headers.set(globals.authorizationKey, `Bearer ${token}`);
  }
  return headers;
};
