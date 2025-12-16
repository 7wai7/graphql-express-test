import { UserService } from "../services/user.service.js";
import type { CreateUserInput } from "../types.js";

export const userResolvers = {
  Query: {
    users: UserService.getAll,
  },

  Mutation: {
    createUser: async (_: unknown, { input }: { input: CreateUserInput }) => UserService.create(input),
  },
};
