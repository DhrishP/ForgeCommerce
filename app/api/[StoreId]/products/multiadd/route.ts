import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { userId } = auth();
    const products = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
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

    if (!StoreByuserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return new NextResponse("Invalid product data", { status: 400 });
    }

    const createdProducts = await prisma.$transaction(
      products.map((product) => {
        const {
          name,
          price,
          Featured,
          Archived,
          CategoriesId,
          sizesId,
          colorId,
          Image,
          description,
          ytURL,
        } = product;

        if (!name || !Image || !Image.length || !price || !CategoriesId || !colorId || !sizesId) {
          throw new Error("Invalid product data");
        }

        return prisma.products.create({
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
            description: description || "",
            ytURL: ytURL || "",
          },
        });
      })
    );

    return NextResponse.json(createdProducts);
  } catch (err) {
    console.log("PRODUCTS_BULK_POST", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}