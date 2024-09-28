import { db } from "@/db/drizzle";
import { billboards, stores } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { dataObj } = await req.json();
    const { userId } = auth();

    if (!dataObj) {
      return new NextResponse("Data object is required", { status: 400 });
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

    const addBills = await db.insert(billboards).values(
      Object.entries(dataObj).map(([key, value]) => ({
        label: key,
        imageUrl: String(value),
        StoreId: params.StoreId,
      }))
    );

    return NextResponse.json(addBills);
  } catch (error) {
    console.log("[MULTIPLE_BILLS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
