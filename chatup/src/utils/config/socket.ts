import io, { Socket } from "socket.io-client";
import { globals } from "../constants/globals";
import { getItem } from "../helpers/cookies-helpers";
import environment from "./environment";

export const connectToSocket = (): Socket => {
  const token = getItem(globals.tokenKey);

  const socket = io(`${environment.wsBaseUrl}`, {
    auth: {
      token: token,
    },
  });

  return socket;
};
