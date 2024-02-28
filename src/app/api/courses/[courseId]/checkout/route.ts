import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { User, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  rer: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    //Fetch the enture user for clerk
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    //Attempt to fetch the course we are trying to purchase
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    //Check if we already purchased the course
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userid: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    //If we dont have a stripe customer, we are gonna create a nmew one: THis is if the customer is purchasing for the first time
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      //Now we create a stripe customer in our databse
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userid: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?cancelled=1`,
      //We use metadata that will be used by stripe to throu us a webhook when the payment goes throughs
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });

    return NextResponse.json({url:session.url})
  } catch (error) {
    console.log("[COURSE ID CHECKOUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
