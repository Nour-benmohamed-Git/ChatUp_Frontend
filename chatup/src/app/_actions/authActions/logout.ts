"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const pastDate = new Date(0); // Setting the cookie expiration to a past date
  cookies().set("authToken", "", { path: "/", expires: pastDate });
  cookies().set("currentUserId", "", { path: "/", expires: pastDate });
  redirect("/sign-in");
}
