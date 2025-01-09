import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { EXP_TIME_IN_DAYS } from "../../config/constants";
import { RefreshToken } from "../../models/refreshToken-models";

export async function refreshToken(req: FastifyRequest, reply: FastifyReply) {
  const validation = z.object({
    refreshToken: z.string(),
  });

  const { refreshToken: refreshTokenId } = validation.parse(req.body);

  try {
    const refreshToken = await RefreshToken.findById(refreshTokenId);

    if (!refreshToken) {
      return reply
        .status(404)
        .send({ error: true, message: "Invalid refresh token" });
    }

    if (Date.now() > refreshToken.expiresAt!.getTime()) {
      return reply
        .status(404)
        .send({ error: true, message: "Expired refresh token" });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXP_TIME_IN_DAYS);

    const [accessToken, newRefreshToken] = await Promise.all([
      reply.jwtSign({ sub: refreshToken.userId }),
      RefreshToken.create({
        userId: refreshToken.userId,
        expiresAt,
        issuedAt: new Date(),
      }),
      RefreshToken.findByIdAndDelete(refreshTokenId),
    ]);

    return reply.status(200).send({
      error: false,
      accessToken,
      refreshToken: newRefreshToken._id,
    });
  } catch (error) {
    throw error;
  }
}
