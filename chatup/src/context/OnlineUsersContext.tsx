"use client";
import { useSocket } from "@/context/SocketContext";
import React, { createContext, useContext, useEffect, useState } from "react";

interface OnlineUsersContextType {
  onlineUsers: number[];
}

const OnlineUsersContext = createContext<OnlineUsersContextType>({
  onlineUsers: [],
});

export const OnlineUsersProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  useEffect(() => {
    socket?.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket?.off("online_users");
    };
  }, [socket]);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => useContext(OnlineUsersContext);
