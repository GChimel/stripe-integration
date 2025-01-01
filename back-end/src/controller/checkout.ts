import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { User } from '../models/user-models';
import { UserNotFoundError } from '../erros/notFound';
import { generateCheckout } from '../utils/stripe';

export async function Checkout(req: FastifyRequest, reply: FastifyReply) {
  const { id } = z
    .object({
      id: z.string(),
    })
    .parse(req.params);

  try {
    const user = await User.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    const checkout = await generateCheckout(user._id.toString(), user.email);

    return reply.status(200).send({ url: checkout });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ error: true, message: error.message });
    }
  }
}
