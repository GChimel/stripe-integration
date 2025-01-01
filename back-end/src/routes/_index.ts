import { FastifyInstance } from 'fastify';
import { adminRoutes } from './admin';

export async function appRoutes(app: FastifyInstance) {
  app.register(adminRoutes);
}
