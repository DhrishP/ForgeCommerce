import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { categories, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { userId } = auth();

    const { name, billboardId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
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

    const storeByUserId = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, params.StoreId), eq(stores.userId, userId)))
      .limit(1);

    if (storeByUserId.length === 0) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const newCategory = await db
      .insert(categories)
      .values({
        name,
        billboardId,
        storeId: params.StoreId,
      })
      .returning();

    return NextResponse.json(newCategory[0]);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
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

    const categoriesList = await db
      .select()
      .from(categories)
      .where(eq(categories.storeId, params.StoreId));

    return NextResponse.json(categoriesList);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
