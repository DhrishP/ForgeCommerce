import prisma from "@/prisma/client";
import redis from "@/lib/redis";
type GraphData = {
  name: string;
  total: number;
};

export default async function getGraphData(StoreId: string) {
 
  if (!StoreId) return null;
  const cachedVAL:any[] |null  = await redis.get(`getGraphData:${StoreId}`);
  if (cachedVAL) {

    return cachedVAL;
  }
  const paidOrders = await prisma.order.findMany({
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
  });
  const monthlyRevenue: { [key: number]: number } = {};
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueFororder = 0;
    for (const item of order.orderItems) {
      revenueFororder += item.product.price.toNumber();
    }
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueFororder;
  }
  const data: GraphData[] = [
    {
      name: "Jan",
      total: 0,
    },
    {
      name: "Feb",
      total: 0,
    },
    {
      name: "Mar",
      total: 0,
    },
    {
      name: "Apr",
      total: 0,
    },
    {
      name: "May",
      total: 0,
    },
    {
      name: "Jun",
      total: 0,
    },
    {
      name: "Jul",
      total: 0,
    },
    {
      name: "Aug",
      total: 0,
    },
    {
      name: "Sep",
      total: 0,
    },
    {
      name: "Oct",
      total: 0,
    },
    {
      name: "Nov",
      total: 0,
    },
    {
      name: "Dec",
      total: 0,
    },
  ];
  for (const month in monthlyRevenue) {
    data[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  await redis.set(`getGraphData:${StoreId}`, JSON.stringify(data));
  await redis.expire(`getGraphData:${StoreId}`, 60 * 60);
  return data
}
