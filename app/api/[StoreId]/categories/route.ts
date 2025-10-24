import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prisma from "@/prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { userId } = auth();

    const { name, billboardId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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
      return new NextResponse("Unauthorized", { status: 404 });
    }

    const categories = await prisma.categories.create({
      data: {
        name,
        billboardId,
        StoreId: params.StoreId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error creating category:", error);
    return new NextResponse("Internal server error", { status: 500 });
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

    const categories = await prisma.categories.findMany({
      where: {
        StoreId: params.StoreId,
      },
      include: {
        billboard: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
