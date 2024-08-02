import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  const { dataObj } = await req.json(); // Assuming the JSON body contains an object
  const { userId } = auth();

  if (!dataObj) {
    return new NextResponse("Data object is required", { status: 400 });
  }
  if (!params.StoreId) {
    return new NextResponse("Store id is required", { status: 400 });
  }
  if (!userId) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  const addSizes = await prisma.sizes.createMany({
    data: Object.entries(dataObj).map(([key, value]) => ({
      name: key,
      value: String(value), // Ensure the value is a string
      StoreId: params.StoreId,
    })),
  });

  return NextResponse.json(addSizes);
}
