"use server";
import { signUpSchema } from "@/utils/schemas/signUpSchema";
import { redirect } from "next/navigation";
import { FetchError } from "../fetchFromServer";

export const signUp = async (
  currentState: { error: FetchError } | null = null,
  data: FormData
) => {
  const values = Object.fromEntries(data);
  const parsedData = signUpSchema.safeParse(values);

  if (parsedData.success) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_UP_BASE_URL}/api/sign-up`,
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
      return { message: error?.message};
    }
    redirect("/sign-in");
  }
};
