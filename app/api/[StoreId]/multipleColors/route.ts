import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  const { dataObj } = await req.json(); // Assume the JSON body is an object directly
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

  const addColors = await prisma.colors.createMany({
    data: Object.entries(dataObj).map(([key, value]) => ({
      name: key,
      value: String(value), // Ensure the value is a string
      StoreId: params.StoreId,
    })),
  });

  return NextResponse.json(addColors);
}
