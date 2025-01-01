import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // STRIPE DATA
  stripeSubscriptionStatus: {
    type: String,
  },
  stripeCustumerId: {
    type: String,
  },
  stripeSubscriptionId: {
    type: String,
  },
});

export const User = mongoose.model('User', userSchema);
