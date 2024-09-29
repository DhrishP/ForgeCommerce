import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { auth } from '@clerk/nextjs';

export async function GET(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  try {
    const dynamicPages = await prisma.dynamicPage.findMany({
      where: { StoreId: params.StoreId },
      include: { attributes: true },
    });
    return NextResponse.json(dynamicPages);
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
    const { name, attributes } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dynamicPage = await prisma.dynamicPage.create({
      data: {
        name,
        StoreId: params.StoreId,
        attributes: {
          create: attributes,
        },
      },
      include: { attributes: true },
    });

    return NextResponse.json(dynamicPage);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}