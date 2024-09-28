import { categories, stores } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";

export async function DELETE(
  req: Request,
  { params }: { params: { StoreId: string; billboardId: string } }
) {
  console.log(params);
  const { userId } = auth();
  const { idsArr } = await req.json();
  if (!userId || !params.StoreId)
    return NextResponse.json("Unauthorized", { status: 401 });
  const Isvalid = await db
    .select()
    .from(stores)
    .where(eq(stores.id, params.StoreId))
    .limit(1);
  if (Isvalid.length === 0) return NextResponse.json("Unauthorized", { status: 403 });
  const DeleteCategories = await db
    .delete(categories)
    .where(inArray(categories.id, idsArr));
  if (!DeleteCategories)
    return NextResponse.json("Categories not deleted", { status: 404 });
  return NextResponse.json(DeleteCategories);
}
