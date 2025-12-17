import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import type { Response } from "express";
import { prisma } from "../../prisma/index.js";
import { UserService } from "../services/user.service.js";
import { errors } from "../utils/errors.util.js";
import type {
  CreateUserInput,
  JwtUserPayload,
  LoginInput,
  ResolverContext,
} from "../types.js";
dotenv.config();

const JWT_EXPIRES_IN = "7d";
const JWT_SECRET = process.env.JWT_SECRET || "SECRET";
if (!process.env.JWT_SECRET) console.error("JWT_SECRET is not defined")

export const authResolvers = {
  Mutation: {
    register: async (
      _: unknown,
      {
        input,
      }: {
        input: CreateUserInput;
      },
      { res }: ResolverContext
    ) => {
      const user = await UserService.create(input);
      const token = signToken(user);

      saveCookieToken(res, token);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };
    },

    login: async (
      _: unknown,
      {
        input,
      }: {
        input: LoginInput;
      },
      { res }: ResolverContext
    ) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (!user) throw errors.unauthenticated("Invalid username");

      const isValid = await bcrypt.compare(input.password, user.hash_password);
      if (!isValid) throw errors.unauthenticated("Invalid password");

      const token = signToken(user);

      saveCookieToken(res, token);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };
    },

    logout: async (_: unknown, __: unknown, { res }: ResolverContext) => {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return true;
    },
  },
};

function signToken<T extends JwtUserPayload>(user: T) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

function saveCookieToken(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
