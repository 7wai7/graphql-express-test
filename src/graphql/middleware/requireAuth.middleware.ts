import { GraphQLError } from "graphql";
import { prisma } from "../../prisma/index.js";
import type { Middleware } from "../types.js";

export const requireAuth: Middleware = (next) => {
  return async (parent, args, ctx) => {
    const currentUserId = 1;

    const user = await prisma.user.findUnique({
      where: {
        id: currentUserId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user)
      throw new GraphQLError("Unauthorized", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });

    ctx.user = user;
    return next(parent, args, ctx);
  };
};