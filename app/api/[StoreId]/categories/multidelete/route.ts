import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { StoreId: string; billboardId: string } }
) {
  console.log(params);
  const { userId } = auth();
  const { idsArr } = await req.json();
  if (!userId || !params.StoreId)
    return NextResponse.json("Unauthorized", { status: 401 });
  const Isvalid = await prisma.store.findFirst({
    where: {
      id: params.StoreId,
      userId,
    },
  });
  if (!Isvalid) return NextResponse.json("Unauthorized", { status: 403 });
  const DeleteBill = await prisma.categories.deleteMany({
    where: {
      id: {
        in: idsArr,
      },
    },
  });
  if (!DeleteBill)
    return NextResponse.json("Billboard not deleted", { status: 404 });
  return NextResponse.json(DeleteBill);
}
