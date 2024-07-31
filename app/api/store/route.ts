import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";


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
    return NextResponse.json(createStore);
  } else {
    NextResponse.error();
  }
}
