import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AuthenticationError } from "../../erros/authenticateError";
import { RefreshToken } from "../../models/refreshToken-models";
import { User } from "../../models/user-models";
import { EXP_TIME_IN_DAYS } from "../../config/constants";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const validation = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = validation.parse(req.body);
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AuthenticationError();
    }

    if (user.password !== password) {
      throw new AuthenticationError();
    }

    const token = await reply.jwtSign({ sub: user._id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXP_TIME_IN_DAYS);

    const refreshToken = await RefreshToken.create({
      userId: user._id,
      expiresAt,
      issuedAt: new Date(),
    });

    return reply.status(200).send({
      token,
      refreshToken: refreshToken._id,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return reply.status(401).send({ error: true, message: error.message });
    }
    throw error;
  }
}
