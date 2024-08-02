import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  const { dataArr } = await req.json();
  const { userId } = auth();

  if (!dataArr) {
    return new NextResponse("Array is required", { status: 400 });
  }
  if (!params.StoreId) {
    return new NextResponse("Store id is required", { status: 400 });
  }
  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  const addBills = await prisma.billBoard.createMany({
    data: dataArr.map((item: { key: string; value: string }) => ({
        label: item.key,
        ImageUrl: item.value,
        StoreId: params.StoreId,
    })),
  });
  console.log(addBills);

  return NextResponse.json(addBills);
}
