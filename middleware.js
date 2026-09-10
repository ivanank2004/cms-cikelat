import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isLoginRoute = pathname === "/";

    let isValidToken = false;

    if (token) {
        try {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (JWT_SECRET) {
                await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
                isValidToken = true;
            }
        } catch (err) {
            isValidToken = false;
        }
    }

    // 1. Guard dashboard routes: redirect unauthenticated users to login
    if (isDashboardRoute) {
        if (!isValidToken) {
            const response = NextResponse.redirect(new URL("/", req.url));
            if (token) {
                response.cookies.delete("token");
            }
            return response;
        }
        return NextResponse.next();
    }

    // 2. Redirect authenticated users away from login page to dashboard
    if (isLoginRoute && isValidToken) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard", "/dashboard/:path*"],
};
