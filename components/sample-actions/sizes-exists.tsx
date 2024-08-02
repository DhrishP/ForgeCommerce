import prisma from "@/prisma/client";

export async function countSizes(StoreId: string) {
  if (!StoreId) return 0;

  const sizesCount = await prisma.sizes.count({
    where: {
      StoreId,
    },
  });

  return sizesCount;
}
