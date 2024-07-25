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
import { toast } from "sonner";

const SocketProvider: React.FC<SocketProviderProps> = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;
    const initializeSocket = async () => {
      const token = await getCookie(globals.tokenKey);

      newSocket = io(`${environment.wsBaseUrl}`, {
        autoConnect: false,
        reconnection: true, // Enable automatic reconnection
        reconnectionAttempts: 10, // Try a maximum of 10 times        
        reconnectionDelay: 2000, // Reconnect every 1 second

        auth: {
          token: token,
        },
      });
      setSocket(newSocket);
      newSocket.connect();

      newSocket.on("connect_error", () => {
        toast.error("Connection error!");
      });

      // newSocket.on("disconnect", () => {
      //   toast.error("Connection lost. Check your network.");
      // });

      // newSocket.on("reconnect_attempt", () => {
      //   toast.info("Reconnecting...");
      // });

      newSocket.io.on("reconnect", (attempt) => {
        toast.success(`Reconnected after ${attempt} attempt(s).`);
      });

      // newSocket.io.on("reconnect_error", () => {
      //   toast.error("Reconnection error. Please try again.");
      // });

      newSocket.io.on("reconnect_failed", () => {
        toast.error("Reconnection failed. Please check your connection.");
      });
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
