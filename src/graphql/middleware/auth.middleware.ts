import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/index.js";
import type { Middleware } from "../types.js";
import { errors } from "../utils/errors.util.js";
import { env } from "../../config/index.js";

// isHardGuard === false -- leave access to unauthorized users but with reduced functionality
export const auth = (isHardGuard = true): Middleware => {
  return (next) => {
    return async (parent, args, ctx) => {
      const token = ctx.req.cookies?.token;
      if (!token) {
        if (isHardGuard) throw errors.unauthenticated();
        return next(parent, args, ctx);
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, env.JWT_SECRET);
      } catch {
        if (isHardGuard) throw errors.unauthenticated();
        return next(parent, args, ctx);
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        if (isHardGuard) throw errors.unauthenticated();
        return next(parent, args, ctx);
      }

      ctx.user = user;
      return next(parent, args, ctx);
    };
  };
};
