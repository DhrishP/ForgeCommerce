import prisma from "@/prisma/client";
import redis from "@/lib/redis";
import { Data } from "../ui/recent-sales";

export default async function getUserinfo(StoreId: string) {
  if (!StoreId) return null;
  const cachedVAL: Data[] | null = await redis.get(`getUserinfo:${StoreId}`);
  if (cachedVAL) {
    return cachedVAL;
  }
  const userInfo = await prisma.order.findMany({
    where: {
      StoreId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const userData = userInfo.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.Email,
    pricePaid: user.orderItems.reduce((inital, item) => {
      return inital + item.product.price.toNumber();
    }, 0),
  }));
  if (!userData) return null;
  await redis.set(`getUserinfo:${StoreId}`, JSON.stringify(userData));
  await redis.expire(`getUserinfo:${StoreId}`, 60 * 60);

  return userData;
}
