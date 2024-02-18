"use server";
import { schema } from "@/utils/schemas/sign-in-schema";
import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient();
export const signIn = action(schema, async (values) => {
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
    throw new Error("Failed to fetch data");
  }
  return res.json();
});
