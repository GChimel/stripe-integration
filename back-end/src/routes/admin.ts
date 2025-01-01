import { FastifyInstance } from 'fastify';
import { authenticate } from '../controller/admin/authenticate';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controller/admin/user';
import { verifyJwt } from '../controller/middlewares/verify-jwt';
import { WebHook } from '../controller/webHook';
import { Checkout } from '../controller/checkout';

export async function adminRoutes(app: FastifyInstance) {
  app.post('/session', authenticate);

  // Create user
  app.post('/user', createUser);
  app.get('/user', { preHandler: verifyJwt }, getUsers);
  app.get('/user/:id', { preHandler: verifyJwt }, getUser);
  app.delete('/user/:id', { preHandler: verifyJwt }, deleteUser);
  app.patch('/user/:id', { preHandler: verifyJwt }, updateUser);

  app.get('/checkout/:id', { preHandler: verifyJwt }, Checkout);
  app.post('/webhook', { config: { rawBody: true } }, WebHook);
}
