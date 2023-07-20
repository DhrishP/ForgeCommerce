import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prisma from "@/prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { CategoriesId: string } }
) {
  try {
    if (!params.CategoriesId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const categories = await prisma.categories.findUnique({
      where: {
        id: params.CategoriesId
      },
      include: {
        billboard: true
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { CategoriesId: string, StoreId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.CategoriesId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const categories = await prisma.categories.delete({
      where: {
        id: params.CategoriesId,
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { CategoriesId: string, StoreId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { name, billboardId } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.CategoriesId) {
      return new NextResponse("Category id is required", { status: 400 });
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

    const categories = await prisma.categories.update({
      where: {
        id: params.CategoriesId,
      },
      data: {
        name,
        billboardId
      }
    });
  
    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};