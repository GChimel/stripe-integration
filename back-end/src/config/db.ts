import mongoose from 'mongoose';
import { ENV_VARS } from './envVars';

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(ENV_VARS.MONGO_URI!);
    console.log('MONGODB connected: ', connection.connection.host);
  } catch (error) {
    console.log('Error connecting to MONGODB: ', error);
    process.exit(1);
  }
};
