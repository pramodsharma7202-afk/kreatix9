import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/login?callbackUrl=" + path, req.url));
      }
    }

    if (path.startsWith("/dashboard") || path.startsWith("/checkout")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login?callbackUrl=" + path, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        if (path.startsWith("/admin")) {
          return !!token && token.role === "admin";
        }
        
        if (path.startsWith("/dashboard") || path.startsWith("/checkout")) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/checkout/:path*"],
};
