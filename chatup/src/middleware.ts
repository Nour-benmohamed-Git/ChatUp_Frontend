import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "./app/_actions/auth-actions/verify-token";
import { globals } from "./utils/constants/globals";
import { paths } from "./utils/constants/paths";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(globals.tokenKey);
  const isValidToken = await verifyToken(token?.value);
  if (
    Object.values(paths.protectedRoutes).includes(request.nextUrl.pathname) &&
    !isValidToken
  ) {
    return NextResponse.redirect(
      new URL(paths.authRoutes.signIn, request.nextUrl)
    );
  }
  if (
    Object.values(paths.authRoutes).includes(request.nextUrl.pathname) &&
    isValidToken
  ) {
    return NextResponse.redirect(
      new URL(paths.protectedRoutes.conversations, request.nextUrl)
    );
  }
}
