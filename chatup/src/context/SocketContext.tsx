"use client";
import { ReactNode, createContext, useContext } from "react";
import { Socket, io } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}
interface SocketProviderProps {
  children: ReactNode;
}
const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

import { getCookie } from "@/app/_actions/sharedActions/getCookie";
import environment from "@/utils/config/environment";
import { globals } from "@/utils/constants/globals";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";

const SocketProvider: React.FC<SocketProviderProps> = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
    const initializeSocket = async () => {
      const token = await getCookie(globals.tokenKey);

      newSocket = io(`${environment.wsBaseUrl}`, {
        autoConnect: false,
        auth: {
          token: token,
        },
      });
      setSocket(newSocket);
      newSocket.connect();
    };

    initializeSocket();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
