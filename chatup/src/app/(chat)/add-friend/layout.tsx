import SendFriendRequest from "@/features/send-friend-request/send-friend-request";
import type { Metadata } from "next";
import "../../globals.css";
export const metadata: Metadata = {
  title: "ChatUp | Add Friend",
  description: "Add Friend",
};

export default async function AddFriendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <SendFriendRequest />
      {children}
    </div>
  );
}
