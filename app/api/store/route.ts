import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  const { userId } = auth();
  const { name } = await req.json();

  if (!userId || !name)
    return NextResponse.json("Something went wrong", { status: 401 });
  const createStore = await prisma.store.create({
    data: {
      name: name,
      userId: userId,
    },
  });
  if (createStore) {
    await redis.set(`storeNavbar:${userId}`, JSON.stringify(createStore));
    await redis.expire(`storeNavbar:${userId}`, 60 * 60);
    return NextResponse.json(createStore);
  } else {
    NextResponse.error();
  }
}
