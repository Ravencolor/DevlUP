export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protect all page routes.
     * API routes handle their own auth to return proper JSON errors.
     */
    "/((?!api|auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
