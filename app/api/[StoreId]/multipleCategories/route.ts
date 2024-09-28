import { db } from "@/db/drizzle";
import { billboards, categories, stores } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { nameArr } = await req.json();
    const { userId } = auth();

    if (!nameArr) {
      return new NextResponse("Array is required", { status: 400 });
    }
    if (!params.StoreId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const storeByUserId = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, params.StoreId), eq(stores.userId, userId)))
      .limit(1);

    if (storeByUserId.length === 0) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const getBills = await db
      .select()
      .from(billboards)
      .where(eq(billboards.storeId, params.StoreId));

    if (!getBills.length) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const billIdsMap = getBills.map((bill) => bill.id);

    const addCategories = await db.insert(categories).values(
      nameArr.map((name: string, index: number) => ({
        name,
        StoreId: params.StoreId,
        billboardId: billIdsMap[index % billIdsMap.length], // Assign a billboard ID in a round-robin fashion
      }))
    );

    console.log(addCategories);
    return NextResponse.json(addCategories);
  } catch (error) {
    console.log("[MULTIPLE_CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
