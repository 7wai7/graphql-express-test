import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index.js";
import type {
  CreateCommentInput,
  FindByUserArgs,
  ResolverContext,
} from "../types.js";
import { errors } from "../utils/errors.util.js";

export const commentResolvers = {
  Query: {
    commentsByPost: async (_: unknown, { postId }: { postId: number }) => {
      return await prisma.comment.findMany({
        where: { postId },
        include: {
          post: true,
          user: true,
        },
      });
    },

    commentsByUser: async (
      _: unknown,
      { input }: { input: FindByUserArgs }
    ) => {
      const where: any = {};

      if (input.id) where.userId = input.id;
      if (input.username) where.user = { username: input.username };

      return await prisma.comment.findMany({
        where,
        include: {
          post: true,
          user: true,
        },
      });
    },
  },

  Mutation: {
    createComment: async (
      _: unknown,
      { input }: { input: CreateCommentInput },
      ctx: ResolverContext
    ) => {
      const userId = ctx.user.id;

      const post = await prisma.comment.create({
        data: { ...input, userId },
      });

      return await prisma.comment.findUnique({
        where: { id: post.id },
        include: {
          user: true,
          post: true,
        },
      });
    },

    deleteComment: async (
      _: unknown,
      { id }: { id: number },
      ctx: ResolverContext
    ) => {
      const userId = ctx.user.id;

      try {
        return await prisma.comment.delete({
          where: {
            id,
            userId,
          },
          include: {
            user: true,
            post: true,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          switch (e.code) {
            case "P2025": // Not found
              throw errors.notFound("Comment does not exist");
          }
        }
        throw e;
      }
    },
  },
};
