import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { StoreId: string } }
) {
  const { productIds } = await req.json();
  if (!productIds || productIds.length === 0) {
    return NextResponse.json("Product id's needed", { status: 400 });
  }

  const Findproduct = await prisma.products.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const items:Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  Findproduct.forEach((product) => {
    items.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount:product.price.toNumber() * 100
      },

    });
  });

  const order = await prisma.order.create({
    data: {
      StoreId: params.StoreId,
      isPaid: false,
      orderItems: {
        create:productIds.map((id:string)=>({
            product:{
                connect:{
                    id:id
                }
            }
        }))
      }
    },
  });

  //const coupon_code = await stripe.coupons.create({
  //  percent_off:10,
   // duration:"repeating",
   // id:"10OFF"
  //});
  const session = await stripe.checkout.sessions.create({
    line_items: items,
   // discounts:[{coupon:coupon_code.id}],
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_URL}/cart?cancel=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
