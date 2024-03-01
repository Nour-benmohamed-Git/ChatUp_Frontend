"use server";
import { cookies } from "next/headers";

export async function getCookie(key: string) {
  try {
    const serializedItem = cookies().get(key);
    return serializedItem?.value;
  } catch (error) {
    console.error("Error reading from cookies", error);
    return null;
  }
}
