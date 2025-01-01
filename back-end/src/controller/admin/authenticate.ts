import { z } from 'zod';
import { User } from '../../models/user-models';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticationError } from '../../erros/authenticateError';

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

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id.toString(),
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id.toString(),
          expiresIn: '2d',
        },
      }
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return reply.status(401).send({ error: true, message: error.message });
    }
    throw error;
  }
}
