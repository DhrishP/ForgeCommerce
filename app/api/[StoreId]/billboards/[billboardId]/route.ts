import { db } from "@/db/drizzle";
import { billboards, stores } from "@/db/schema";
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId)
      return NextResponse.json("Billboard Id needed", { status: 400 });

    const Billboard = await db
      .select()
      .from(billboards)
      .where(eq(billboards.id, params.billboardId));
    if (Billboard) {
      return NextResponse.json(Billboard);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { StoreId: string; billboardId: string } }
) {
  const { userId } = auth();
  const { label, ImageUrl } = await req.json();
  if (!userId) return NextResponse.json("Unauthenticated", { status: 401 });
  if (!label || !ImageUrl)
    return NextResponse.json("Check the credentials or authentication", {
      status: 404,
    });

  const Isvalid = await db
    .select()
    .from(stores)
    .where(eq(stores.id, params.StoreId));
  if (!Isvalid) return NextResponse.json("Unauthorized", { status: 403 });

  const UpdateBill = await db
    .update(billboards)
    .set({ label: label, imageUrl: ImageUrl })
    .where(eq(billboards.id, params.billboardId));
  if (!UpdateBill)
    return NextResponse.json("Name not updated", { status: 404 });
  return NextResponse.json(UpdateBill);
}

export async function DELETE(
  req: Request,
  { params }: { params: { StoreId: string; billboardId: string } }
) {
  const { userId } = auth();
  if (!userId || !params.StoreId || !params.billboardId)
    return NextResponse.json("Unauthorized", { status: 401 });

  const Isvalid = await db
    .select()
    .from(stores)
    .where(eq(stores.id, params.StoreId));
  if (!Isvalid) return NextResponse.json("Unauthorized", { status: 403 });
  const DeleteBillDrizzle = await db
    .delete(billboards)
    .where(eq(billboards.id, params.billboardId));
  if (DeleteBillDrizzle) {
    return NextResponse.json(DeleteBillDrizzle);
  }
  return NextResponse.error();
}
