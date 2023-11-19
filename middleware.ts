import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import ratelimit from "./lib/rate-limit";

async function middleware(request: NextRequest,userId:string): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(
    ip
  );
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/blocked", request.url));
}


export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  afterAuth:async()=>{middleware}
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)","/api/:path"],
};
