import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { dbConnect } from '@/lib/db/dbConnect';
import { User } from '@/lib/db/models/User';

const stripe = new Stripe(process.env.STRIPE_SK || '');

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
      const email = paymentIntentSucceeded.receipt_email; // Assuming the email is stored in the receipt_email field

      try {
        await dbConnect(); // Ensure the database connection is established
        const result = await User.updateOne({ email }, { isPro: true }); // Update the user's isPro variable to true

        if (result.modifiedCount === 1) {
          console.log(`User with email ${email} is now a Pro user.`);
        } else {
          console.log(`User with email ${email} not found or already a Pro user.`);
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
      break; // Ensure to break after handling this case

    // case 'customer.subscription.deleted':
    //   const subscriptionDeleted = event.data.object as Stripe.Subscription;
    //   const customerEmail = subscriptionDeleted.customer_email; // Assuming the email is stored in the customer object

    //   try {
    //     await dbConnect(); // Ensure the database connection is established
    //     const result = await User.updateOne({ email: customerEmail }, { isPro: false }); // Update the user's isPro variable to false

    //     if (result.modifiedCount === 1) {
    //       console.log(`User with email ${customerEmail} subscription has expired and is no longer a Pro user.`);
    //     } else {
    //       console.log(`User with email ${customerEmail} not found or already not a Pro user.`);
    //     }
    //   } catch (error) {
    //     console.error('Error updating user subscription status:', error);
    //   }
      // break; // Ensure to break after handling this case

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}