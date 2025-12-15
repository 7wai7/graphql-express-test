import { prisma } from "../prisma/index.js";
import type { AddUserInput } from "./types.js";
import bcrypt from "bcrypt";

export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL",
  },

  Mutation: {
    createUser: async (_: unknown, { input }: { input: AddUserInput }) => {
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
  },
};
