import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index.js";
import type {
  CreatePostInput,
  FindByUserArgs,
  ResolverContext,
} from "../types.js";
import { withMiddlewares } from "../middleware/withMiddlewares.js";
import { requireAuth } from "../middleware/requireAuth.middleware.js";
import { errors } from "../utils/errors.util.js";

export const postResolvers = {
  Query: {
    postsByUser: async (_: unknown, { input }: { input: FindByUserArgs }) => {
      const where: any = {};

      if (input.id) where.userId = input.id;
      if (input.username) where.user = { username: input.username };

      return await prisma.post.findMany({
        where,
        include: { user: true, comments: { include: { user: true } } },
      });
    },
  },

  Mutation: {
    createPost: withMiddlewares(
      requireAuth,
      async (
        _: unknown,
        { input }: { input: CreatePostInput },
        ctx: ResolverContext
      ) => {
        const userId = ctx.user.id;

        const post = await prisma.post.create({
          data: { ...input, userId },
        });

        return await prisma.post.findUnique({
          where: { id: post.id },
          include: {
            user: true,
            comments: true,
          },
        });
      }
    ),

    deletePost: async (
      _: unknown,
      { id }: { id: number },
      ctx: ResolverContext
    ) => {
      const userId = ctx.user.id;

      try {
        return await prisma.post.delete({
          where: {
            id,
            userId,
          },
          include: {
            user: true,
            comments: true,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          switch (e.code) {
            case "P2025": // Not found
              throw errors.notFound("Post does not exist");
          }
        }
        throw e;
      }
    },
  },
};
