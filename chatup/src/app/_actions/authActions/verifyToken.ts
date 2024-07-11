"use server";

import { jwtVerify } from "jose";

export async function verifyToken(token?: string) {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY),
      {
        algorithms: ["HS256"],
      }
    );
    return payload;
  } catch (error: unknown) {
    return null;
  }
}
