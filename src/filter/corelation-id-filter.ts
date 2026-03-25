import { NextRequest, NextResponse } from "next/server";

export async function correlationIdFilter(req: NextRequest) {
    const correlationId = req.headers.get("x-correlation-id") || crypto.randomUUID();

    // Create a new response or modify the request headers to pass along
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-correlation-id", correlationId);

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set("x-correlation-id", correlationId);

    return response;
}

