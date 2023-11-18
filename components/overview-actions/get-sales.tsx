import prisma from "@/prisma/client";
import redis from "@/lib/redis";

export default async function getSales(StoreId: string) {
  if (!StoreId) return null;
  const cachedVAL:string | null = await redis.get(`getSalesLength:${StoreId}`);

  if (cachedVAL) {
    return cachedVAL;
  }

  const res = await prisma.order.findMany({
    where: {
      isPaid: true,
      StoreId,
    },
    select: {
      Email: true,
      id: true,
      name: true,
    },
  });

  await redis.set(`getSalesLength:${StoreId}`, JSON.stringify(res.length));
  await redis.expire(`getSalesLength:${StoreId}`, 60 * 60);

  return res.length;
}
