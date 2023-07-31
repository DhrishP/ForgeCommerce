import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.WEBHOOK_SIGNING_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook error:${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressfilters = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressjoin = addressfilters.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await prisma.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        name: session?.customer_details?.name as string,
        Email: session?.customer_details?.email as string,
        isPaid: true,
        address: addressjoin,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });
    const productIds = order.orderItems.map((item) => item.productId);

    await prisma.products.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        Archived: true,
      },
    });
  }
  return NextResponse.json({}, { status: 200 });
}
