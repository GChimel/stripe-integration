import { FastifyInstance } from "fastify";
import { authenticate } from "../controller/admin/authenticate";
import { refreshToken } from "../controller/admin/refreshToken";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controller/admin/user";
import { Checkout } from "../controller/checkout";
import { WebHook } from "../controller/webHook";
import { authMiddleware } from "../middlewares/authMiddleware";

export async function publicRoutes(fastify: FastifyInstance) {
  fastify.post("/session", authenticate);
  fastify.post("/session/refresh", refreshToken);

  fastify.post("/user", createUser);
}

export async function privateRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authMiddleware);

  fastify.get("/user", getUsers);
  fastify.get("/user/:id", getUser);
  fastify.delete("/user/:id", deleteUser);
  fastify.patch("/user/:id", updateUser);

  fastify.get("/checkout/:id", Checkout);
  fastify.post("/webhook", { config: { rawBody: true } }, WebHook);
}
