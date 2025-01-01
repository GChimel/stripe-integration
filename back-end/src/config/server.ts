import { app } from './app';
import { connectDb } from './db';
import { ENV_VARS } from './envVars';

const port = ENV_VARS.PORT;

app
  .listen({
    host: '0.0.0.0',
    port: Number(port),
  })
  .then(() => {
    console.log('🥳 Server running on port:' + port);
    connectDb();
  });
