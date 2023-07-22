import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { userId } = auth();
    const {
      name,
      price,
      Featured,
      Archived,
      CategoriesId,
      sizesId,
      colorId,
      Image,
    } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!Image || !Image.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!CategoriesId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!sizesId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!params.StoreId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const StoreByuserId = await prisma.store.findFirst({
      where: {
        id: params.StoreId,
        userId: userId,
      },
    });

    if (!StoreByuserId)
      return new NextResponse("Unauthorized", { status: 405 });

    const Addproduct = await prisma.products.create({
      data: {
        name,
        price,
        Featured,
        Archived,
        CategoriesId,
        sizesId,
        colorId,
        StoreId: params.StoreId,
        Image: {
          createMany: {
            data: [...Image.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(Addproduct);
  } catch (err) {
    console.log("PRODUCTS_POST", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const CategoriesId = searchParams.get("CategoriesId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizesId = searchParams.get("sizesId") || undefined;
    const Featured = searchParams.get("Featured");
    if (!params.StoreId)
      return new NextResponse("Store id is required", { status: 400 });
    const products = await prisma.products.findMany({
      where: {
        StoreId: params.StoreId,
        CategoriesId,
        colorId,
        sizesId,
        Featured: Featured ? true : undefined,
        Archived: false,
      },
      include: {
        Image: true,
        categories: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.log("PRODUCT_GET", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
