import type { AddUserInput } from "./types.js";

export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL",
  },

  Mutation: {
    addUser: (_: unknown, { input }: { input: AddUserInput }) => {
      return {
        id: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        role: input.role,
      };
    },
  },
};
