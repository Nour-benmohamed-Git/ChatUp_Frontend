import environment from "@/utils/config/environment";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<any>();
  const createAuthenticatedSocket = () => {
    const token = getItem(globals.tokenKey);
    const socket = io(`${environment.wsBaseUrl}`, {
      // autoConnect: false,
      auth: {
        token: token,
      },
    });
    return socket;
  };

  useEffect(() => {
    const socketInstance = createAuthenticatedSocket();
    setSocket(socketInstance);
  }, []);

  return socket;
};

export default useSocket;
