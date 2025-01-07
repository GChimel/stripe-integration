import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function refreshToken(req: FastifyRequest, reply: FastifyReply) {
  const validation = z.object({
    refreshToken: z.string(),
  });

  const { refreshToken } = validation.parse(req.body);

  try {
    reply.send({ refreshToken });
  } catch (error) {
    throw error;
  }
}
