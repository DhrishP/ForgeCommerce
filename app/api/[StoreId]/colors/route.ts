import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prisma from "@/prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { userId } = auth();

    const { name, value } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.StoreId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.StoreId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const colors = await prisma.colors.create({
      data: {
        name,
        value,
        StoreId: params.StoreId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    if (!params.StoreId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const color = await prisma.colors.findMany({
      where: {
        StoreId: params.StoreId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
