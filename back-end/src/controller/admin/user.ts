import { z } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '../../models/user-models';
import { UserNotFoundError } from '../../erros/notFound';
import { createStripeCustomer } from '../../utils/stripe';

export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  const userValidation = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const body = userValidation.parse(req.body);

  try {
    const verifyUser = await User.findOne({ name: body.name });
    const verifyUserEmail = await User.findOne({ email: body.email });

    if (verifyUser || verifyUserEmail) {
      return reply.status(400).send({ error: true, message: 'User already exists' });
    }

    // Create a stripe customer
    const userStripe = await createStripeCustomer({ email: body.email, name: body.name });

    const user = await User.create({
      ...body,
      stripeCustumerId: userStripe.id,
    });

    return reply.status(201).send({ error: false, message: 'User created', data: user });
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(req: FastifyRequest, reply: FastifyReply) {
  const validation = z.object({
    id: z.string(),
  });

  const { id } = validation.parse(req.params);

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return reply.status(200).send({ error: false, message: 'User deleted', data: user });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ error: true, message: error.message });
    }
    throw error;
  }
}

export async function updateUser(req: FastifyRequest, reply: FastifyReply) {
  const { id } = z
    .object({
      id: z.string(),
    })
    .parse(req.params);

  const userValidation = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  });

  const body = userValidation.parse(req.body);
  try {
    const user = await User.findOneAndUpdate({ _id: id }, body, { new: true });

    if (!user) {
      throw new UserNotFoundError();
    }

    return reply.status(200).send({ error: false, message: 'User updated', data: user });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ error: true, message: error.message });
    }
    throw error;
  }
}

export async function getUsers(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await User.find({});

    return reply.status(200).send({ error: false, message: 'Users found', users: users });
  } catch (error) {
    throw error;
  }
}

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
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

    return reply.status(200).send({ error: false, message: 'User found', user });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return reply.status(404).send({ error: true, message: error.message });
    }

    throw error;
  }
}
