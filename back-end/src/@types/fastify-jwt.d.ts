import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface fastifyJwt {
    user: { sub: string };
  }
}
