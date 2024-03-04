"use server";
import { schema } from "@/utils/schemas/sign-in-schema";
import { createSafeActionClient } from "next-safe-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const action = createSafeActionClient();
export const signIn = action(schema, async (values) => {
  // const oneDay = 24 * 60 * 60 * 1000;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/sign-in`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: values.email, password: values.password }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to sign in.");
  }
  const data = await res.json();
  cookies().set("authToken", data?.data?.token);
  cookies().set("currentUserId", data?.data?.id);
  redirect("/");
});
