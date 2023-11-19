import ratelimit from "@/lib/rate-limit";
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  const { userId } = auth();
  const { updatedname } = await req.json();
  if (!userId || !updatedname || !params.StoreId)
    return NextResponse.json("Something went wrong", { status: 404 });
  const UpdateName = await prisma.store.update({
    where: {
      userId: userId,
      id: params.StoreId,
    },
    data: {
      name: updatedname,
    },
  });
  if (!UpdateName)
    return NextResponse.json("Name not updated", { status: 404 });
  return NextResponse.json(updatedname);
}

export async function DELETE(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  const { userId } = auth();
  if (!userId || !params.StoreId)
    return NextResponse.json("Unauthorized", { status: 401 });
  const DeleteStore = await prisma.store.delete({
    where: {
      userId: userId,
      id: params.StoreId,
    },
  });
  if (DeleteStore) {
    return NextResponse.json(DeleteStore);
  }
  return NextResponse.error();
}
