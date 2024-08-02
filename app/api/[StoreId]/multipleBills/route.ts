import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  const { dataObj } = await req.json();
  const { userId } = auth();

  console.log(dataObj);

  if (!dataObj) {
    return new NextResponse("Data object is required", { status: 400 });
  }
  if (!params.StoreId) {
    return new NextResponse("Store id is required", { status: 400 });
  }
  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  const addBills = await prisma.billBoard.createMany({
    data: Object.entries(dataObj).map(([key, value]) => ({
      label: key,
      ImageUrl: String(value),
      StoreId: params.StoreId,
    })),
  });
  console.log(addBills);

  return NextResponse.json(addBills);
}
