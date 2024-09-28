import { db } from "@/db/drizzle";
import { colors, stores } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";

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
    .where(and(eq(stores.id, params.StoreId), eq(stores.userId, userId)))
    .limit(1);

  if (Isvalid.length === 0) return NextResponse.json("Unauthorized", { status: 403 });

  const DeleteColors = await db
    .delete(colors)
    .where(inArray(colors.id, idsArr));

  if (!DeleteColors)
    return NextResponse.json("Colors not deleted", { status: 404 });
  return NextResponse.json(DeleteColors);
}
