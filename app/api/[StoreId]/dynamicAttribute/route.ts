import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@clerk/nextjs';

export async function GET(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const dynamicAttributes = await prisma.dynamicAttribute.findMany({
      where: { StoreId: params.StoreId },
    });
    return NextResponse.json(dynamicAttributes);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, type } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dynamicAttribute = await prisma.dynamicAttribute.create({
      data: {
        name,
        type,
        StoreId: params.StoreId,
      },
    });

    return NextResponse.json(dynamicAttribute);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}