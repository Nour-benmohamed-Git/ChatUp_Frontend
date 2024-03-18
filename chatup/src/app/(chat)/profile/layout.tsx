import { fetchCurrentUser } from "@/app/_actions/user-actions/fetch-current-user";
import Profile from "@/features/profile/profile";
import type { Metadata } from "next";
import "../../globals.css";
export const metadata: Metadata = {
  title: "ChatUp | Profile",
  description: "Profile",
};

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await fetchCurrentUser();

  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <Profile data={currentUser?.data} />
      {children}
    </div>
  );
}
