import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import fastifyRawBody from "fastify-raw-body";
import { ZodError } from "zod";
import { privateRoutes, publicRoutes } from "../routes/routes";
import { ENV_VARS } from "./envVars";

export const app = fastify();

const jwtSecret = ENV_VARS.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined.");
}

app.register(fastifyRawBody, {
  global: false,
  field: "rawBody",
  encoding: "utf8",
  runFirst: true,
});

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.register(fastifyJwt, {
  secret: jwtSecret,
  sign: {
    expiresIn: "10m",
  },
});

app.register(fastifyCookie);
app.register(privateRoutes, { prefix: "/api/v1" });
app.register(publicRoutes, { prefix: "/api/v1" });

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }

  if (ENV_VARS.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // todo: Deveria ter log para uma ferramenta externa como Datadog/NewRelic/Sentry etc
  }

  return reply.status(500).send({
    error: true,
    message: "Internal server error.",
  });
});
