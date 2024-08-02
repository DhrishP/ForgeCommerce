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

  const addsizes = await prisma.sizes.createMany({
    data: dataArr.map((item: { key: string; value: string }) => ({
      name: item.key,
      value: item.value,
      StoreId: params.StoreId,
    })),
  });

  return NextResponse.json(addsizes);
}
