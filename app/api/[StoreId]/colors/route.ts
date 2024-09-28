import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { colors, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

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

    const storeByUserId = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, params.StoreId), eq(stores.userId, userId)))
      .limit(1);

    if (storeByUserId.length === 0) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const newColor = await db
      .insert(colors)
      .values({
        name,
        value,
        storeId: params.StoreId,
      })
      .returning();

    return NextResponse.json(newColor[0]);
  } catch (error) {
    console.log("[COLORS_POST]", error);
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

    const colorsData = await db
      .select()
      .from(colors)
      .where(eq(colors.storeId, params.StoreId));

    return NextResponse.json(colorsData);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
