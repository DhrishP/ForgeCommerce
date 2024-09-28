import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/db/drizzle";
import { categories, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { billboards } from "@/db/schema";

export async function GET(
  req: Request,
  { params }: { params: { CategoriesId: string } }
) {
  try {
    if (!params.CategoriesId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const category = db
      .select({
        id: categories.id,
        name: categories.name,
        billboard: {
          id: billboards.id,
          label: billboards.label,
          imageUrl: billboards.imageUrl,
          createdAt: billboards.createdAt,
          updatedAt: billboards.updatedAt,
        },
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .leftJoin(billboards, eq(categories.billboardId, billboards.id))
      .where(eq(categories.id, params.CategoriesId));

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { CategoriesId: string; StoreId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.CategoriesId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const storeByUserId = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, params.StoreId), eq(stores.userId, userId)))
      .limit(1);

    if (storeByUserId.length === 0) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, params.CategoriesId))
      .returning();

    return NextResponse.json(deletedCategory[0]);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { CategoriesId: string; StoreId: string } }
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

    const storeByUserId = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, params.StoreId), eq(stores.userId, userId)))
      .limit(1);

    if (storeByUserId.length === 0) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const updatedCategory = await db
      .update(categories)
      .set({
        name,
        billboardId,
      })
      .where(eq(categories.id, params.CategoriesId))
      .returning();

    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
