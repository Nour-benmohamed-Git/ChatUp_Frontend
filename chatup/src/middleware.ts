import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { globals } from "./utils/constants/globals";
import { paths } from "./utils/constants/paths";
import { verifyToken } from "./utils/helpers/auth-helpers";
import { deleteItem } from "./utils/helpers/cookies-helpers";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(globals.tokenKey);
  const isValidToken = await verifyToken(token?.value);
  if (
    Object.values(paths.protectedRoutes).includes(request.nextUrl.pathname) &&
    !isValidToken
  ) {
    deleteItem(globals.tokenKey);
    return NextResponse.redirect(
      new URL(paths.authRoutes.signIn, request.nextUrl)
    );
  }
  if (
    Object.values(paths.authRoutes).includes(request.nextUrl.pathname) &&
    isValidToken
  ) {
    return NextResponse.redirect(
      new URL(paths.protectedRoutes.home, request.nextUrl)
    );
  }
}
