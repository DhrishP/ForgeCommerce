import React from "react";
import Orders from "./components/orders";

import { formatter } from "@/lib/utils";
import { orderItems, orders, products } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq, desc } from "drizzle-orm";

const OrdersPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindOrders = await db
    .select({
      id: orders.id,
      phone: orders.phone,
      isPaid: orders.isPaid,
      address: orders.address,
      createdAt: orders.createdAt,
      orderItems: {
        id: orderItems.id,
        productId: products.id,
        name: products.name,
        price: products.price,
      },
    })
    .from(orders)
    .where(eq(orders.storeId, params.StoreId))
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .orderBy(desc(orders.updatedAt));

  const FilterData = FindOrders.map((order) => ({
    id: order.id,
    phone: order.phone ?? "",
    isPaid: order.isPaid ?? false,
    product: Array.isArray(order.orderItems)
      ? order.orderItems
          .map((item) => item.name ?? "")
          .filter(Boolean)
          .join(", ")
      : "",
    address: order.address ?? "",
    totalPrice: formatter.format(
      Array.isArray(order.orderItems)
        ? order.orderItems.reduce((total, item) => {
            return total + Number(item.price ?? 0);
          }, 0)
        : 0
    ),
    createdAt: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "",
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <Orders OrdersData={FilterData} />
      </div>
    </div>
  );
};

export default OrdersPage;
