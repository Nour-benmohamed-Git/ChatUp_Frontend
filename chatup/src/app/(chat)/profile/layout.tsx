import { fetchCurrentUser } from "@/app/_actions/userActions/fetchCurrentUser";
import Profile from "@/features/profile/Profile";
import { UserResponse } from "@/types/User";
import { CustomError } from "@/utils/config/exceptions";
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
  if (currentUser.error) {
    const message = currentUser.error?.message 
    throw new CustomError(message);
  }
  return (
    <div className="h-screen md:col-span-11 grid md:grid-cols-12 bg-slate-700">
      <Profile data={currentUser.data?.data as UserResponse} />
      {children}
    </div>
  );
}
