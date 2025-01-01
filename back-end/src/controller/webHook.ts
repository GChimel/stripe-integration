import { FastifyReply, FastifyRequest } from 'fastify';
import {
  handleCancelPlan,
  handleCheckoutSessionCompleted,
  handleSubscriptionSessionCompleted,
  stripe,
} from '../utils/stripe';
import { ENV_VARS } from '../config/envVars';

export async function WebHook(req: FastifyRequest, reply: FastifyReply) {
  const WEB_HOOK = ENV_VARS.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'] as string;

  if (!signature || !req.rawBody) {
    console.error('Missing signature or raw body');
    return reply.status(400).send('Missing signature or raw body');
  }

  try {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        WEB_HOOK as string
      );
    } catch (err) {
      reply.status(400).send(`Webhook Error`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // const checkoutSessionCompleted = event.data.object;
        await handleCheckoutSessionCompleted(event);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.deleted':
        // const customerSubscriptionDeleted = event.data.object;
        await handleCancelPlan(event);
        break;
      case 'customer.subscription.updated':
        // const customerSubscriptionUpdated = event.data.object;
        await handleSubscriptionSessionCompleted(event);
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    reply.send();
  } catch (error) {
    console.error(error);
  }
}
