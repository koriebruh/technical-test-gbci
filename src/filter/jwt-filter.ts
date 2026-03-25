import { NextRequest, NextResponse } from "next/server";
import { JwtUtil } from "../libs/jwt";

const PUBLIC_PATHS = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/docs',
    '/api/openapi.json',
    '/_next',
    '/favicon.ico',
    '/public'
];

export async function jwtFilter(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Skip public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next({
            request: {
                headers: req.headers,
            }
        });
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { message: "Missing or invalid authorization token" },
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await JwtUtil.verify(token);

        // Pass user info to downstream handlers via headers
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", decoded.id);
        requestHeaders.set("x-user-email", decoded.email);
        requestHeaders.set("x-user-role", decoded.role);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 }
        );
    }
}
