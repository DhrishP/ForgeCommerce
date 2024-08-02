import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
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
  const getBills = await prisma.billBoard.findMany({
    where: {
      StoreId: params.StoreId,
    },
  });
  if (!getBills.length) {
    return new NextResponse("Store not found", { status: 404 });
  }
  const billIdsMap = getBills.map((bill) => bill.id);
  const addCategories = await prisma.categories.createMany({
    data: nameArr.map((name: string, index: number) => ({
      name,
      StoreId: params.StoreId,
      BillboardId: billIdsMap[index % billIdsMap.length], // Assign a billboard ID in a round-robin fashion
    })),
  });
  console.log(addCategories);
  return NextResponse.json(addCategories);
}
