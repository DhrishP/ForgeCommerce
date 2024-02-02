import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import ratelimit from "@/lib/rate-limit";

export async function GET(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
   
    if(!params.StoreId) return  NextResponse.json("Store Id is required",{status:404})
    const FindBillboards = await prisma.billBoard.findMany({
        where:{
            StoreId:params.StoreId
        }
    })
    return NextResponse.json(FindBillboards)
  } catch (err) {
    console.log(err);
    return NextResponse.error()
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { StoreId: string } }
) {
  const { userId } = auth();
  const { label, ImageUrl } = await req.json();
  if (!userId) return NextResponse.json("Unauthenticated", { status: 404 });
  if (!label || !ImageUrl)
    return NextResponse.json("Please provide correct credentials", {
      status: 401,
    });
  const IsStorevalid = await prisma.store.findFirst({
    where: {
      userId: userId,
      id: params.StoreId,
    },
  });
  if (!IsStorevalid)
    return NextResponse.json("Dont change the store id on the Url", {
      status: 404,
    });

  const createBill = await prisma.billBoard.create({
    data: {
      label: label,
      ImageUrl: ImageUrl,
      StoreId: params.StoreId,
    },
  });
  if (createBill) {
    return NextResponse.json(createBill);
  } else {
    NextResponse.error();
  }
}
