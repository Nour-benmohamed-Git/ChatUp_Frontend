import environment from "@/utils/config/environment";
import { globals } from "@/utils/constants/globals";
import { getItem } from "@/utils/helpers/cookies-helpers";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<any>();
  useEffect(() => {
    const token = getItem(globals.tokenKey);
    if (token && !socket) {
      const socketInstance = io(`${environment.wsBaseUrl}`, {
        autoConnect: false,
        auth: {
          token: token,
        },
      });
      socketInstance.connect();
      setSocket(socketInstance);
    }
  }, [socket]);
  return socket;
};

export default useSocket;
