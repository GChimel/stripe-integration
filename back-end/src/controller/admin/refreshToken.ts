import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GenerateRefreshToken } from "../../utils/refreshToken";

export async function refreshToken(req: FastifyRequest, reply: FastifyReply) {
  const validation = z.object({
    refreshToken: z.string(),
  });

  const { refreshToken } = validation.parse(req.body);

  try {
    const userId = GenerateRefreshToken.validate(refreshToken);

    if (!userId) {
      return reply
        .status(401)
        .send({ error: true, message: "Invalid refresh token" });
    }

    const token = await reply.jwtSign({ sub: userId });
    const newRefreshToken = GenerateRefreshToken.genereate(userId);

    return reply.status(200).send({
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    throw error;
  }
}
