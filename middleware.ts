import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import ratelimit from "./lib/rate-limit";

async function middleware(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  const { success, reset, limit, remaining } = await ratelimit.limit(ip);
  const res = success
    ? NextResponse.next(req)
    : NextResponse.redirect(`${process.env.NEXT_PUBLIC_API_URL}/ratelimit`);
  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", reset.toString());
  return res;
}

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  afterAuth: async () => {
    const urlOrRequestInfo:
      | string
      | URL = `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`;
    let req: NextRequest = new NextRequest(urlOrRequestInfo);
    const res = await middleware(req);
    return res;
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
