import { NextResponse, NextRequest } from "next/server";
import { correlationIdFilter } from "./filter/corelation-id-filter";
import { jwtFilter } from "./filter/jwt-filter";

export async function middleware(req: NextRequest) {
    // 1. Run Correlation ID Filter
    const correlationResponse = await correlationIdFilter(req);
    const correlationId = correlationResponse.headers.get("x-correlation-id");

    // Create a new request with updated headers to pass the correlation ID to the next filter
    const requestHeaders = new Headers(req.headers);
    if (correlationId) {
        requestHeaders.set("x-correlation-id", correlationId);
    }

    // We need to clone the request to pass it to the next filter with updated headers
    const nextReq = new NextRequest(req.url, {
        headers: requestHeaders,
    });

    // 2. Run JWT Filter
    const response = await jwtFilter(nextReq);

    // Ensure x-correlation-id is in the final response headers
    if (correlationId) {
        response.headers.set("x-correlation-id", correlationId);
    }

    return response;
}

export const config = {
    matcher: "/api/:path*",
};

