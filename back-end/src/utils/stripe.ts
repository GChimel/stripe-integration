import Stripe from 'stripe';
import { ENV_VARS } from '../config/envVars';
import { User } from '../models/user-models';

export const stripe = new Stripe(ENV_VARS.STRIPE_SECRET as string, {
  httpClient: Stripe.createFetchHttpClient(),
});

export const getStripeCustomerByEmail = async (email: string) => {
  const custumers = await stripe.customers.list({ email });
  return custumers.data[0];
};

export const createStripeCustomer = async (data: {
  email: string;
  name?: string;
}) => {
  // Check if user already exists
  const custumer = await getStripeCustomerByEmail(data?.email);

  if (custumer) return custumer;

  return stripe.customers.create({
    email: data.email,
    name: data.name,
  });
};

export const generateCheckout = async (userId: string, email: string) => {
  try {
    const customer = await createStripeCustomer({ email });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      client_reference_id: userId,
      customer: customer.id,
      success_url: 'http://localhost:3000/done', //endpoint do front.
      cancel_url: 'http://localhost:3000/cancel', //endpoint do front.
      line_items: [
        {
          price: ENV_VARS.STRIPE_ID_PLAN,
          quantity: 1,
        },
      ],
    });

    return {
      url: session.url,
    };
  } catch (error) {
    console.log(error);
  }
};

export const handleCheckoutSessionCompleted = async (event: {
  data: {
    object: Stripe.Checkout.Session;
  };
}) => {
  const idUser = event.data.object.client_reference_id as string;
  const stripeSubscriptionId = event.data.object.subscription as string;
  const stripeCustumerId = event.data.object.customer as string;
  const checkoutStatus = event.data.object.status;

  if (checkoutStatus !== 'complete') return;

  if (!idUser || !stripeSubscriptionId || !stripeCustumerId) {
    throw new Error(
      'idUser, stripeSubscriptionId, stripeCustumerId is required'
    );
  }

  const userExists = await User.findById(idUser);

  if (!userExists) {
    throw new Error('User not found');
  }

  await User.updateOne(
    { _id: idUser },
    {
      stripeSubscriptionId,
      stripeCustumerId,
    }
  );
};

export const handleSubscriptionSessionCompleted = async (event: {
  data: { object: Stripe.Subscription };
}) => {
  const subscriptionStatus = event.data.object.status;

  const stripeCustumerId = event.data.object.customer as string;
  const stripeSubscriptionId = event.data.object.id as string;

  const userExist = await User.findOne({ stripeCustumerId });

  if (!userExist) {
    throw new Error('User stripeCustumerId not found');
  }

  await User.updateOne(
    { _id: userExist._id },
    {
      stripeCustumerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus: subscriptionStatus,
    }
  );
};

export const handleCancelPlan = async (event: {
  data: { object: Stripe.Subscription };
}) => {
  const stripeCustumerId = event.data.object.customer as string;

  const userExist = await User.findOne({ stripeCustumerId });

  if (!userExist) {
    throw new Error('User stripeCustumerId not found');
  }

  await User.updateOne(
    { _id: userExist._id },
    {
      stripeCustumerId,
      stripeSubscriptionStatus: null,
    }
  );
};

export const handleCancelSubscription = async (idSubscription: string) => {
  const subscription = await stripe.subscriptions.update(idSubscription, {
    cancel_at_period_end: true,
  });

  return subscription;
};
