import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/prisma/client";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string; dynamicPage: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

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
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const dynamicPage = await prisma.dynamicPage.findFirst({
      where: {
        name: params.dynamicPage,
        StoreId: params.StoreId,
      }
    });

    if (!dynamicPage) {
      return new NextResponse("Dynamic page not found", { status: 404 });
    }

    const dynamicAttribute = await prisma.dynamicAttribute.create({
      data: {
        name,
        type:value,
        DynamicPageId: dynamicPage.id
      }
    });

    return NextResponse.json(dynamicAttribute);
  } catch (error) {
    console.log('[DYNAMIC_ATTRIBUTE_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { StoreId: string; dynamicPage: string } }
) {
  try {
    if (!params.StoreId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const dynamicPage = await prisma.dynamicPage.findFirst({
      where: {
        name: params.dynamicPage,
        StoreId: params.StoreId,
      },
      include: {
        attributes: true,
      }
    });

    return NextResponse.json(dynamicPage?.attributes);
  } catch (error) {
    console.log('[DYNAMIC_ATTRIBUTE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}