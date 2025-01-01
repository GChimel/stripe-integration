import mongoose from 'mongoose';

const schedulingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export const Scheduling = mongoose.model('Scheduling', schedulingSchema);
