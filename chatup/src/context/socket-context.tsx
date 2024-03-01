"use client";
import { ReactNode, createContext, useContext } from "react";
import { Socket, io } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}
interface SocketProviderProps {
  children: ReactNode;
  token?: string | null;
}
const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

import environment from "@/utils/config/environment";
import React, { useEffect, useState } from "react";

const SocketProvider: React.FC<SocketProviderProps> = (props) => {
  const { children, token } = props;

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${environment.wsBaseUrl}`, {
      autoConnect: false,
      auth: {
        token: token,
      },
    });
    setSocket(newSocket);
    newSocket.connect();
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
