import { billboards, stores } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";

export async function DELETE(
  req: Request,
  { params }: { params: { StoreId: string; billboardId: string } }
) {
  const { userId } = auth();
  const { idsArr } = await req.json();
  if (!userId || !params.StoreId)
    return NextResponse.json("Unauthorized", { status: 401 });

  const Isvalid = await db
    .select()
    .from(stores)
    .where(eq(stores.id, params.StoreId));
  if (!Isvalid) return NextResponse.json("Unauthorized", { status: 403 });
  const DeleteBill = await db
    .delete(billboards)
    .where(inArray(billboards.id, idsArr));
  if (!DeleteBill)
    return NextResponse.json("Billboard not deleted", { status: 404 });
  return NextResponse.json(DeleteBill);
}
