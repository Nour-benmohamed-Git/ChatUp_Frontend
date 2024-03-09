import SocketProvider from "@/context/socket-context";
import SideBar from "@/features/sidebar/sidebar";
import { globals } from "@/utils/constants/globals";
import type { Metadata } from "next";
import { getCookie } from "../_actions/shared-actions/get-cookie";
import "../globals.css";
export const metadata: Metadata = {
  title: "ChatUp | Chat box",
  description: "Chat box",
};

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getCookie(globals.tokenKey);

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3">
      <SocketProvider token={token}>
        <SideBar />
        {children}
      </SocketProvider>
    </div>
  );
}
