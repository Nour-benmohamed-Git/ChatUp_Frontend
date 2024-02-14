import io, { Socket } from "socket.io-client";
import { globals } from "../constants/globals";
import { getItem } from "../helpers/cookies-helpers";
import environment from "./environment";
let socket: Socket;
const connectToSocket = (token: string) => {
  //  const token = getItem(globals.tokenKey);

  socket = io(`${environment.wsBaseUrl}`, {
    auth: {
      token: token,
    },
  });
};
export { socket, connectToSocket };
