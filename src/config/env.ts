import "dotenv/config";
import { z } from "zod";

/**
 * Runtime env validation.
 * App MUST crash on startup if config is invalid.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.url(),

  JWT_SECRET: z.string().min(5, "JWT_SECRET must be at least 5 characters"),

  JWT_EXPIRES_IN: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);
