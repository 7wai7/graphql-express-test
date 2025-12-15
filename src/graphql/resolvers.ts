import type { Prisma } from "@prisma/client";
import { prisma } from "../prisma/index.js";
import type {
  CreateCommentInput,
  CreatePostInput,
  CreateUserInput,
  FindByUserArgs,
} from "./types.js";
import bcrypt from "bcrypt";
import { DateTimeResolver } from "graphql-scalars";

export const resolvers = {
  Date: DateTimeResolver,

  Query: {
    users: async () => await prisma.user.findMany(),

    postsByUser: async (_: unknown, { input }: { input: FindByUserArgs }) => {
      const where: any = {};

      if (input.id) where.userId = input.id;
      if (input.username) where.user = { username: input.username };

      return await prisma.post.findMany({
        where,
        include: { user: true, comments: true },
      });
    },

    commentsByPost: async (_: unknown, { postId }: { postId: number }) => {
      return await prisma.comment.findMany({
        where: { postId },
        include: {
          post: true,
          user: true,
        },
      });
    },

    commentsByUser: async (_: unknown, { input }: { input: FindByUserArgs }) => {
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
    createUser: async (_: unknown, { input }: { input: CreateUserInput }) => {
      const existedUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email: {
                contains: input.email,
                mode: "insensitive", // for case-insensitive search
              },
            },
            {
              username: {
                contains: input.username,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      if (existedUser) throw new Error("This user already exists");

      const hash = await bcrypt.hash(input.password, 5);

      return await prisma.user.create({
        data: { ...{ ...input, password: undefined }, hash_password: hash },
      });
    },

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

    createComment: async (_: unknown, { input }: { input: CreateCommentInput }) => {
      const post = await prisma.comment.create({
        data: input,
      });

      return await prisma.comment.findUnique({
        where: { id: post.id },
        include: {
          user: true,
          post: true
        },
      });
    },
  },
};
