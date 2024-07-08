"use server";
import { globals } from "@/utils/constants/globals";
import { signInSchema } from "@/utils/schemas/signInSchema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FetchError } from "../fetchFromServer";

export const signIn = async (
  currentState: { error: FetchError } | null = null,
  data: FormData
) => {
  const values = Object.fromEntries(data);
  const parsedData = signInSchema.safeParse(values);

  if (parsedData.success) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/sign-in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      return { message: error?.message };
    }
    const data = await response.json();

    cookies().set("authToken", data?.data?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: globals.expireIn,
      path: "/",
    });
    cookies().set("currentUserId", data?.data?.id, {
      httpOnly: false,
      maxAge: globals.expireIn,
      path: "/",
    });
    redirect("/conversations");
  }
};
