import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "./app/_actions/authActions/verifyToken";
import { globals } from "./utils/constants/globals";
import { paths } from "./utils/constants/paths";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(globals.tokenKey);
  const isValidToken = await verifyToken(token?.value);
  if (
    Object.values(paths.protectedRoutes).includes(request.nextUrl.pathname) &&
    !isValidToken
  ) {
    const response = NextResponse.redirect(
      new URL(paths.authRoutes.signIn, request.nextUrl)
    );

    response.cookies.set(globals.tokenKey, "", {
      path: "/",
      expires: new Date(0),
    });

    response.cookies.set(globals.currentUserId, "", {
      path: "/",
      expires: new Date(0),
    });

    return response;
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
