import { jwtVerify } from "jose";
import environment from "../config/environment";
import { globals } from "../constants/globals";

export async function verifyToken(token?: string) {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(environment.secretKey),
      {
        algorithms: [globals.algorithm],
      }
    );
    return payload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error verifying token: ${error.name}`);
    }
    return null;
  }
}
