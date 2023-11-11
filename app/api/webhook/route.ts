import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
// import { Resend } from "resend";
// import StripeWelcomeEmail from "@/lib/email";

//SOME THINGS ARE COMMENTED FOR FUTURE USE AFTER PURCHASE OF DOMAIN

export async function POST(req: Request) {
  // const resend = new Resend(process.env.RESEND_SECRET as string);
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

    // await resend.emails.send({
    //   from: "trexturbo55@gmail.com",
    //   to: session.customer_details?.email
    //     ? session.customer_details.email
    //     : "trexturbo55@gmail.com",
    //   react: StripeWelcomeEmail(),
    //   subject: "Stripe Confirmation",
    // });
  }
  return NextResponse.json({}, { status: 200 });
}
//SOME THINGS ARE COMMENTED FOR FUTURE USE AFTER PURCHASE OF DOMAIN
