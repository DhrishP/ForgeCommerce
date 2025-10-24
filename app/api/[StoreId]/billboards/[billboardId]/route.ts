import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return NextResponse.json("Billboard ID is required", { status: 400 });
    }

    const billboard = await prisma.billBoard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    if (!billboard) {
      return NextResponse.json("Billboard not found", { status: 404 });
    }

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("Error fetching billboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { StoreId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }

    if (!params.StoreId || !params.billboardId) {
      return NextResponse.json("Store ID and Billboard ID are required", {
        status: 400,
      });
    }

    const body = await req.json();
    const { label, ImageUrl } = body;

    if (!label || !ImageUrl) {
      return NextResponse.json("Label and ImageUrl are required", {
        status: 400,
      });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.StoreId,
        userId,
      },
    });

    if (!store) {
      return NextResponse.json("Store not found or unauthorized", {
        status: 404,
      });
    }

    const billboard = await prisma.billBoard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        ImageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("Error updating billboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { StoreId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthenticated", { status: 401 });
    }

    if (!params.StoreId || !params.billboardId) {
      return NextResponse.json("Store ID and Billboard ID are required", {
        status: 400,
      });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.StoreId,
        userId,
      },
    });

    if (!store) {
      return NextResponse.json("Store not found or unauthorized", {
        status: 404,
      });
    }

    const billboard = await prisma.billBoard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("Error deleting billboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
