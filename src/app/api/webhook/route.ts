import { NextResponse } from "next/server"
import {headers} from "next/headers"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(req:Request) {

    const body = await req.text()
    const signature=headers().get("Stripe-Signature") as string

    let event:Stripe.Event

    //Attempting to cosntruct the event using the siganture
    try {
        event =stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error:any) {
        console.log("STRIPE ERROR",error)
        return new NextResponse(`Webhook error ${error.message}`,{status:400})
    }

    //Get the session
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId

    if(event.type==="checkout.session.completed"){
        if(!userId || !courseId){
            return new NextResponse(`Missing webhook metadata`,{status:400})
        }

        //we finally create our purchase
        await db.purchase.create({
            data:{
                courseId:courseId,
                userId:userId
            }
        })
    }else{
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`,{status:200})  // We return 200 coz if we return too many 400 stripe wont send again to that webhook
    }

    return new NextResponse(null,{status:200})
}