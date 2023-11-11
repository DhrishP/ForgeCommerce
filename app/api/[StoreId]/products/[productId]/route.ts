import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prisma from "@/prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const products = await prisma.products.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        Image: true,
        categories: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; StoreId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const products = await prisma.products.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { productId: string; StoreId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      price,
      CategoriesId,
      Image,
      colorId,
      sizesId,
      Featured,
      Archived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.StoreId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prisma.products.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        CategoriesId,
        colorId,
        sizesId,
        Image: {
          deleteMany: {},
        },
        Featured,
        Archived,
      },
    });

    const products = await prisma.products.update({
      where: {
        id: params.productId,
      },
      data: {
        Image: {
          createMany: {
            data: [...Image.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; StoreId: string } }
) {
  const { userId } = auth();
  const { featured, archived } = await req.json();
  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }
  if (!params.productId) {
    return new NextResponse("Product id is required", { status: 400 });
  }
  if (featured && !archived) {
    const products = await prisma.products.update({
      where: {
        id: params.productId,
      },
      data: {
        Featured: featured,
      },
    });
    return NextResponse.json(products);
  }
  if (archived && !featured) {
    const products = await prisma.products.update({
      where: {
        id: params.productId,
      },
      data: {
        Archived: archived,
      },
    });

    return NextResponse.json(products);
  }
  if (!featured && !archived) {
    const products = await prisma.products.update({
      where: {
        id: params.productId,
      },
      data: {
        Archived: archived,
      },
    });
    return NextResponse.json(products);
  }
  if (featured && archived) {
    const products = await prisma.products.update({
      where: {
        id: params.productId,
      },
      data: {
        Featured: !featured, //true hota hai , we are changing it
      },
    });
    return NextResponse.json(products);
  }
}
