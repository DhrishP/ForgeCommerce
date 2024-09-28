import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { billboards, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    if (!params.StoreId)
      return NextResponse.json("Store Id is required", { status: 404 });
    const FindBillboards = await db
      .select()
      .from(billboards)
      .where(eq(billboards.storeId, params.StoreId));
    return NextResponse.json(FindBillboards);
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { StoreId: string } }
) {
  const { userId } = auth();
  const { label, ImageUrl } = await req.json();
  if (!userId) return NextResponse.json("Unauthenticated", { status: 404 });
  if (!label || !ImageUrl)
    return NextResponse.json("Please provide correct credentials", {
      status: 401,
    });
  const IsStorevalid = await db
    .select()
    .from(stores)
    .where(and(eq(stores.userId, userId), eq(stores.id, params.StoreId)))
    .limit(1);
  if (IsStorevalid.length === 0)
    return NextResponse.json("Dont change the store id on the Url", {
      status: 404,
    });

  const createBill = await db
    .insert(billboards)
    .values({
      label: label,
      imageUrl: ImageUrl,
      storeId: params.StoreId,
    })
    .returning();
  if (createBill.length > 0) {
    return NextResponse.json(createBill[0]);
  } else {
    return NextResponse.error();
  }
}
