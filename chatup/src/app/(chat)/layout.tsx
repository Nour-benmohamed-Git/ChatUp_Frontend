import SocketProvider from "@/context/socket-context";
import { globals } from "@/utils/constants/globals";
import type { Metadata } from "next";
import { getCookie } from "../_actions/get-cookie";
import "../globals.css";
export const metadata: Metadata = {
  title: "ChatUp | Chat box",
  description: "Chat box",
};

export default async function RootLayout({
  children,
  main,
}: Readonly<{
  children: React.ReactNode;
  main: React.ReactNode;
}>) {
  const token = await getCookie(globals.tokenKey);
  return (
    <SocketProvider token={token}>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {children}
        {main}
      </div>
    </SocketProvider>
  );
}
