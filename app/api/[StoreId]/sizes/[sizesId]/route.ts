import { NextResponse } from "next/server";

import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { sizesId: string } }
) {
  try {
    if (!params.sizesId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const sizes = await prisma.sizes.findUnique({
      where: {
        id: params.sizesId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizesId: string; StoreId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sizesId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    const sizes = await prisma.sizes.delete({
      where: {
        id: params.sizesId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizesId: string; StoreId: string } }
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

    if (!params.sizesId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    const sizes = await prisma.sizes.update({
      where: {
        id: params.sizesId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
