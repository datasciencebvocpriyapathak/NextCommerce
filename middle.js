// middleware.js
import { NextResponse } from "next/server";

const ipRequestMap = new Map();
const WINDOW_MS = 10 * 1000; // 10 seconds
const MAX_REQUESTS = 10;

export function middleware(req) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const now = Date.now();

  const requestData = ipRequestMap.get(ip) || { count: 0, start: now };

  // Reset window if expired
  if (now - requestData.start > WINDOW_MS) {
    requestData.count = 0;
    requestData.start = now;
  }

  requestData.count++;
  ipRequestMap.set(ip, requestData);

  if (requestData.count > MAX_REQUESTS) {
    return new Response("Too many requests", { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};