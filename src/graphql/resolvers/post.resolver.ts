import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index.js";
import type {
  CreatePostInput,
  FindByUserArgs,
  ResolverContext,
} from "../types.js";
import { GraphQLError } from "graphql";

export const postResolvers = {
  Query: {
    postsByUser: async (_: unknown, { input }: { input: FindByUserArgs }) => {
      const where: any = {};

      if (input.id) where.userId = input.id;
      if (input.username) where.user = { username: input.username };

      return await prisma.post.findMany({
        where,
        include: { user: true, comments: true },
      });
    },
  },

  Mutation: {
    createPost: async (_: unknown, { input }: { input: CreatePostInput }) => {
      const post = await prisma.post.create({
        data: input,
      });

      return await prisma.post.findUnique({
        where: { id: post.id },
        include: {
          user: true,
          comments: true,
        },
      });
    },

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
              throw new GraphQLError("Post does not exist", {
                extensions: {
                  code: "NOT_FOUND",
                },
              });
          }
        }
        throw e;
      }
    },
  },
};
