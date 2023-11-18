import prisma from "@/prisma/client";
import redis from "@/lib/redis";

export default async function getRevenue(StoreId: string) {
  if (!StoreId) return null;
  const cachedVAL: string | null = await redis.get(`getRevenue:${StoreId}`);
  if (cachedVAL) {
    return JSON.parse(cachedVAL);
  }

  const orders = await prisma.order.findMany({
    where: {
      StoreId,
      isPaid: true,
    },
    include: {
      orderItems: true,
    },
  });
  const productIds = orders.flatMap((item) =>
    item.orderItems.map((o) => o.productId)
  );
  const findProduct = await prisma.products.findMany({
    where: {
      id: {
        in: [...productIds],
      },
    },
    select: {
      price: true,
    },
  });
  const total = findProduct.reduce((initial, curritem) => {
    return initial + curritem.price.toNumber();
  }, 0);
  await redis.set(`getRevenue:${StoreId}`, total);
  await redis.expire(`getRevenue:${StoreId}`, 60 * 60);
  return total;
}
