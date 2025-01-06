import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { ENV_VARS } from './envVars';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { appRoutes } from '../routes/_index';
import fastifyRawBody from 'fastify-raw-body';

export const app = fastify();

const jwtSecret = ENV_VARS.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined.');
}

app.register(fastifyRawBody, {
  global: false,
  field: 'rawBody',
  encoding: 'utf8',
  runFirst: true,
});

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

app.register(fastifyJwt, {
  secret: jwtSecret,
  cookie: {
    cookieName: 'refresh_token',
    signed: false,
  },
  sign: {
    expiresIn: '90m',
  },
});

app.register(fastifyCookie);
app.register(appRoutes, { prefix: '/api/v1' });

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    });
  }

  if (ENV_VARS.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // todo: Deveria ter log para uma ferramenta externa como Datadog/NewRelic/Sentry etc
  }

  return reply.status(500).send({
    error: true,
    message: 'Internal server error.',
  });
});
