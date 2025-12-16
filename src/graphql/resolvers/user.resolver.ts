import { GraphQLError } from "graphql";
import { prisma } from "../../prisma/index.js";
import type { CreateUserInput } from "../types.js";
import bcrypt from "bcrypt";

export const userResolvers = {
  Query: {
    users: async () =>
      await prisma.user.findMany({
        select: { id: true, username: true, email: true, createdAt: true },
      }),
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

      if (existedUser)
        throw new GraphQLError("This user already exists", {
          extensions: {
            code: "CONFLICT",
          },
        });

      const hash = await bcrypt.hash(input.password, 5);

      return await prisma.user.create({
        data: { ...{ ...input, password: undefined }, hash_password: hash },
      });
    },
  },
};
