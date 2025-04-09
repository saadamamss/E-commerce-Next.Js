import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // If the user is not authenticated and trying to access a protected route
  if (!req.auth && !pathname.startsWith("/sign-in")) {
    const newUrl = new URL("/sign-in", req.nextUrl.origin);
    newUrl.searchParams.set("redirectedFrom", pathname); // Track the original URL for redirection after login
    return NextResponse.redirect(newUrl);
  }

  // If the user is authenticated and trying to access the sign-in page, redirect to the dashboard
  if (req.auth && pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  // Allow the request to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/checkout"], // Protect all dashboard routes and other specific routes
};
